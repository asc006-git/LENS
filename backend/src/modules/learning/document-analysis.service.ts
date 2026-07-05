import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
const pdfParse = require('pdf-parse');
import { config } from '../../config';
import LearningSession from './learning-session.model';
import User from '../users/user.model';
import LLMAdapter from '../../ai/adapters/llm-adapter';
import { AiDebugLog } from '../../ai/models/ai-debug-log.model';
import { AIModule, SessionStatus } from '../../common/enums';
import { AIProcessingError, NotFoundError, AppError } from '../../common/errors';
import logger from '../../common/utils/logger';

const UPLOAD_DIR = path.resolve(__dirname, '../../../uploads');
const MAX_CHUNK_WORDS = 45000;

export interface ConceptExtractionResult {
  concepts: Array<{
    name: string;
    difficulty: 'easy' | 'medium' | 'hard';
    bloomLevel: string;
    importance: number;
    conceptualDepth: string;
  }>;
  learningObjectives: string[];
  summary: string;
  writingFlowNote?: string;
  humanEffortScore?: number;
}

export interface HumanEffortResult {
  styleConsistency: number;
  reasoningContinuity: number;
  overallScore: number;
  note: string;
}

export interface ValidationQuestionsResult {
  questions: Array<{
    question: string;
    concept: string;
    type?: string;
    expectedAnswerPoints: string[];
  }>;
}

export interface AnswerEvaluationResult {
  score: number;
  feedback: string;
  understandingDelta: number;
}

export interface AssignmentAlignmentResult {
  aligned: boolean;
  confidence: number;
  reason: string;
}

export interface ReflectionAnalysisResult {
  confidenceIndex: number;
  aiSummary: string;
  gapsIdentified: string[];
  conceptualConsistency?: 'high' | 'medium' | 'low';
}

export class DocumentAnalysisService {
  static async ensureUploadDir(sessionId: string): Promise<string> {
    const dir = path.join(UPLOAD_DIR, sessionId);
    await fs.promises.mkdir(dir, { recursive: true });
    return dir;
  }

  static async storeFile(
    sessionId: string,
    file: Express.Multer.File
  ): Promise<{ filePath: string; filename: string; mimetype: string; size: number }> {
    const dir = await this.ensureUploadDir(sessionId);
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(dir, filename);
    await fs.promises.writeFile(filePath, file.buffer);
    return {
      filePath,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  static async extractText(filePath: string, mimetype: string): Promise<string> {
    if (mimetype === 'application/pdf') {
      const buffer = await fs.promises.readFile(filePath);
      const data = await pdfParse(buffer);
      return data.text;
    }
    if (mimetype === 'text/plain') {
      return fs.promises.readFile(filePath, 'utf-8');
    }
    return fs.promises.readFile(filePath, 'utf-8');
  }

  static chunkTextByWords(text: string, maxWords: number): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += maxWords) {
      chunks.push(words.slice(i, i + maxWords).join(' '));
    }
    return chunks;
  }

  static estimateWordCount(text: string): number {
    return text.split(/\s+/).filter(Boolean).length;
  }

  static async analyzeDocument(
    sessionId: string,
    extractedText: string,
    context: {
      course?: string;
      assignment?: string;
      priorWeakConcepts?: string[];
    }
  ): Promise<ConceptExtractionResult> {
    const wordCount = this.estimateWordCount(extractedText);

    let textForAnalysis: string;

    if (wordCount > MAX_CHUNK_WORDS) {
      logger.info(`Document is large (${wordCount} words). Chunking for analysis.`);
      const chunks = this.chunkTextByWords(extractedText, MAX_CHUNK_WORDS);
      const summaries: string[] = [];
      for (let i = 0; i < chunks.length; i++) {
        const summaryPrompt = this.buildChunkSummaryPrompt(chunks[i], i + 1, chunks.length, context);
        const summaryRaw = await this.callGeminiJson(summaryPrompt, sessionId, 'document-chunk-summary');
        const parsed = JSON.parse(summaryRaw);
        summaries.push(parsed.summary || parsed.chunkSummary || chunks[i].slice(0, 2000));
      }
      textForAnalysis = summaries.join('\n\n=== NEXT CHUNK ===\n\n');
    } else {
      textForAnalysis = extractedText;
    }

    const analysisPrompt = this.buildConceptExtractionPrompt(textForAnalysis, context);
    const analysisRaw = await this.callGeminiJson(analysisPrompt, sessionId, 'concept-extraction');

    const parsed = JSON.parse(analysisRaw);

    await AiDebugLog.create({
      sessionId,
      module: 'document-analysis',
      prompt: analysisPrompt.slice(0, 1000),
      responseText: analysisRaw.slice(0, 2000),
      aiModel: 'groq-llama-3.3-70b',
      duration: 0,
    });

    if (!parsed.concepts || !Array.isArray(parsed.concepts) || parsed.concepts.length === 0) {
      throw new Error('AI returned no concepts — the document may not contain educational content');
    }
    return {
      concepts: parsed.concepts,
      learningObjectives: parsed.learningObjectives || [],
      summary: parsed.summary || '',
      writingFlowNote: parsed.writingFlowNote || '',
    };
  }

  static async evaluateHumanEffort(
    sessionId: string,
    extractedText: string
  ): Promise<HumanEffortResult> {
    const textSample = extractedText.slice(0, 8000);
    const prompt = `You are assessing the human-effort characteristics of a student's written work. Evaluate style consistency and reasoning continuity.

STUDENT TEXT:
${textSample}

Analyze the text for:
1. Style Consistency: Does the writing show a consistent voice, vocabulary range, and sentence structure throughout? (0.0-1.0)
2. Reasoning Continuity: Do ideas flow logically from one to the next? Are there abrupt topic shifts or non-sequiturs? (0.0-1.0)

Provide an overall score (average of the two) and a brief note.

Respond ONLY with valid JSON. No explanation, no markdown formatting.
{
  "styleConsistency": number,
  "reasoningContinuity": number,
  "overallScore": number,
  "note": "brief observation about the writing characteristics"
}`;

    const raw = await this.callGeminiJson(prompt, sessionId, 'human-effort');
    const parsed = JSON.parse(raw);
    return {
      styleConsistency: typeof parsed.styleConsistency === 'number' ? parsed.styleConsistency : 0.5,
      reasoningContinuity: typeof parsed.reasoningContinuity === 'number' ? parsed.reasoningContinuity : 0.5,
      overallScore: typeof parsed.overallScore === 'number' ? parsed.overallScore : 0.5,
      note: parsed.note || '',
    };
  }

  static async checkAssignmentAlignment(
    sessionId: string,
    extractedText: string,
    assignment: {
      title: string;
      description?: string;
      expectedConcepts?: string[];
      learningObjectives?: string[];
    }
  ): Promise<AssignmentAlignmentResult> {
    const prompt = `You are evaluating whether a student's submission matches the actual assignment requirements.

ASSIGNMENT TITLE: ${assignment.title}
ASSIGNMENT DESCRIPTION: ${assignment.description || 'N/A'}
${assignment.expectedConcepts?.length ? `EXPECTED CONCEPTS: ${assignment.expectedConcepts.join(', ')}` : ''}
${assignment.learningObjectives?.length ? `LEARNING OBJECTIVES: ${assignment.learningObjectives.join(', ')}` : ''}

STUDENT SUBMISSION TEXT (first 8000 chars):
${extractedText.slice(0, 8000)}

Evaluate whether the student's submission content actually addresses the assignment requirements. Respond ONLY with valid JSON:
{
  "aligned": true/false,
  "confidence": 0.0-1.0,
  "reason": "brief explanation of why the content does or does not match"
}`;

    const raw = await this.callGeminiJson(prompt, sessionId, 'assignment-alignment');
    const parsed = JSON.parse(raw);
    return {
      aligned: parsed.aligned === true,
      confidence: parsed.confidence || 0,
      reason: parsed.reason || '',
    };
  }

  static async generateValidationQuestions(
    sessionId: string,
    blueprint: { concepts: Array<{ name: string; difficulty?: string; importance?: number }>; learningObjectives: string[] }
  ): Promise<ValidationQuestionsResult> {
    const prompt = `You are an expert educator creating open-ended validation questions that assess conceptual understanding through explanation and reasoning.

LEARNING OBJECTIVES:
${blueprint.learningObjectives.map(o => `- ${o}`).join('\n')}

CONCEPTS TO VALIDATE:
${blueprint.concepts.map(c => `- ${c.name} (difficulty: ${c.difficulty || 'medium'}, importance: ${c.importance || 1})`).join('\n')}

For each concept, generate one open-ended question that requires the student to explain, summarize, connect, or analyze — NOT recall facts. Each question must include expected answer points (key insights the student should demonstrate).

Respond ONLY with valid JSON. No explanation, no markdown formatting.
{
  "questions": [
    {
      "question": "string",
      "concept": "string",
      "type": "explain"|"summarize"|"connect"|"analyze",
      "expectedAnswerPoints": ["string"]
    }
  ]
}`;

    const raw = await this.callGeminiJson(prompt, sessionId, 'validation-questions');
    const parsed = JSON.parse(raw);
    return { questions: parsed.questions || [] };
  }

  static async evaluateAnswer(
    sessionId: string,
    concept: string,
    question: string,
    studentAnswer: string,
    expectedAnswerPoints: string[]
  ): Promise<AnswerEvaluationResult> {
    const prompt = `You are an expert educator evaluating a student's understanding.

CONCEPT: ${concept}
QUESTION: ${question}

EXPECTED ANSWER POINTS:
${expectedAnswerPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

STUDENT ANSWER:
${studentAnswer}

Evaluate the student's answer against the expected points. Score from 0.0 to 1.0.
Provide constructive feedback and estimate how much their understanding has changed (understandingDelta: -1.0 to 1.0, positive means improved).

Respond ONLY with valid JSON. No explanation, no markdown formatting.
{
  "score": number,
  "feedback": "string",
  "understandingDelta": number
}`;

    const raw = await this.callGeminiJson(prompt, sessionId, 'answer-evaluation');
    const parsed = JSON.parse(raw);
    return {
      score: parsed.score ?? 0,
      feedback: parsed.feedback || '',
      understandingDelta: parsed.understandingDelta ?? 0,
    };
  }

  static async analyzeReflection(
    sessionId: string,
    reflectionText: string,
    concepts: Array<{ name: string; difficulty?: string; importance?: number }>
  ): Promise<ReflectionAnalysisResult> {
    const prompt = `You are an expert learning coach analyzing a student's free-text reflection. Assess conceptual understanding through what the student expresses in their own words — do NOT assess for AI use.

CONCEPTS COVERED:
${concepts.map(c => `- ${c.name}`).join('\n')}

STUDENT REFLECTION:
${reflectionText}

Analyze the reflection and provide:
- confidenceIndex: 0.0 to 1.0 — how coherently the student discusses the concepts
- aiSummary: brief neutral summary of the reflection
- gapsIdentified: any knowledge gaps the student mentions or implies
- conceptualConsistency: compare what the student claims to understand against the concepts covered; flag inconsistencies neutrally

Respond ONLY with valid JSON. No explanation, no markdown formatting.
{
  "confidenceIndex": number,
  "aiSummary": "string",
  "gapsIdentified": ["string"],
  "conceptualConsistency": "high"|"medium"|"low"
}`;

    const raw = await this.callGeminiJson(prompt, sessionId, 'reflection-analysis');
    const parsed = JSON.parse(raw);
    return {
      confidenceIndex: parsed.confidenceIndex ?? 0.5,
      aiSummary: parsed.aiSummary || '',
      gapsIdentified: parsed.gapsIdentified || [],
      conceptualConsistency: parsed.conceptualConsistency || 'medium',
    };
  }

  static async extractPriorWeakConcepts(studentId: string): Promise<string[]> {
    const priorSessions = await LearningSession.find({
      student: new mongoose.Types.ObjectId(studentId),
      status: { $in: [SessionStatus.COMPLETED, SessionStatus.REPORT_GENERATED, SessionStatus.GUIDED_LEARNING] },
    })
      .select('validation.report.conceptMastery')
      .sort({ updatedAt: -1 })
      .limit(5);

    const weakConcepts = new Set<string>();
    for (const session of priorSessions) {
      if (session.report?.conceptMastery) {
        for (const [concept, mastery] of Object.entries(session.report.conceptMastery)) {
          if ((mastery as number) < 0.6) {
            weakConcepts.add(concept);
          }
        }
      }
    }
    return Array.from(weakConcepts);
  }

  private static buildChunkSummaryPrompt(
    chunk: string,
    chunkIndex: number,
    totalChunks: number,
    context: { course?: string; assignment?: string }
  ): string {
    return `You are a document summarizer. Summarize the following document chunk (${chunkIndex}/${totalChunks}) for educational analysis.

${context.course ? `COURSE: ${context.course}` : ''}
${context.assignment ? `ASSIGNMENT: ${context.assignment}` : ''}

DOCUMENT CHUNK:
${chunk.slice(0, 30000)}

Provide a concise summary of the key educational content in this chunk.
Respond ONLY with valid JSON: { "summary": "string" }`;
  }

  private static buildConceptExtractionPrompt(
    text: string,
    context: { course?: string; assignment?: string; priorWeakConcepts?: string[] }
  ): string {
    let prompt = `You are an expert educational content analyzer assessing conceptual depth and writing flow. Analyze the following document text.

${context.course ? `COURSE: ${context.course}` : ''}
${context.assignment ? `ASSIGNMENT DESCRIPTION: ${context.assignment}` : ''}`;

    if (context.priorWeakConcepts && context.priorWeakConcepts.length > 0) {
      prompt += `\n\nSTUDENT'S PRIOR WEAK CONCEPTS (focus on reinforcing these if they appear):\n${context.priorWeakConcepts.map(c => `- ${c}`).join('\n')}`;
    }

    prompt += `\n\nDOCUMENT TEXT:
${text.slice(0, 100000)}

Extract 5-15 key concepts from this educational content. For each concept, assess:
- difficulty: "easy", "medium", or "hard"
- bloomLevel: the highest Bloom's Taxonomy level demonstrated (remember, understand, apply, analyze, evaluate, create)
- importance: number from 1-10 (10 = most important)
- conceptualDepth: brief note on how deeply the student engages with this concept (e.g., "superficial definition only", "applies to examples", "critically evaluates trade-offs")

Also provide 2-5 learning objectives, a brief summary, and a writing flow observation:
- writingFlowNote: comment on the coherence and structure of the writing (e.g., "well-organized with clear transitions", "some disorganized sections", "ideas presented but loosely connected")

Respond ONLY with valid JSON. No explanation, no markdown formatting.
{
  "concepts": [
    { "name": "string", "difficulty": "easy"|"medium"|"hard", "bloomLevel": "string", "importance": number, "conceptualDepth": "string" }
  ],
  "learningObjectives": ["string"],
  "summary": "string",
  "writingFlowNote": "string"
}`;

    return prompt;
  }

  private static async callGeminiJson(prompt: string, sessionId: string, module: string): Promise<string> {
    const startTime = Date.now();
    const response = await LLMAdapter.generateWithSystemPrompt(
      'You are a precise JSON generator. You respond ONLY with valid JSON. Never include markdown formatting, code blocks, or explanation.',
      prompt,
      { temperature: 0.1, maxTokens: 8192, responseMimeType: 'application/json' }
    );
    const duration = Date.now() - startTime;

    const cleaned = response
      .replace(/```(?:json)?\s*/gi, '')
      .replace(/\s*```/g, '')
      .trim();

    AiDebugLog.create({
      sessionId,
      module,
      prompt: prompt.slice(0, 1000),
      responseText: cleaned.slice(0, 2000),
      aiModel: 'groq-llama-3.3-70b',
      duration,
    });

    JSON.parse(cleaned);
    return cleaned;
  }
}
