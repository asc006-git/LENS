import { BloomLevel } from '../../common/enums';

interface AnalysisPromptData {
  files: Array<{ name: string; type: string }>;
  learningObjective?: string;
}

interface BlueprintPromptData {
  concepts: Array<{
    name: string;
    difficulty: number;
    bloomLevel: string;
    prerequisites: string[];
  }>;
  topicClassification: string;
  difficultyEstimate: number;
  learningObjectives: string[];
  facultyExpectations?: {
    expectedConcepts?: string[];
    rubricCriteria?: string[];
    learningObjectives?: string[];
    facultyNotes?: string;
  };
}

interface ValidationPromptData {
  concept: string;
  description: string;
  difficulty: string;
  previousResponses: Array<{
    concept: string;
    question: string;
    response: string;
    confidence: number;
  }>;
}

interface HintPromptData {
  concept: string;
  previousResponses: Array<{
    concept: string;
    question: string;
    response: string;
    confidence: number;
  }>;
}

interface ReflectionPromptData {
  concepts: Array<{ name: string; description: string; weight: number }>;
  validationResponses: Array<{
    concept: string;
    question: string;
    response: string;
    understanding: string;
    confidence: number;
  }>;
  overallConfidence: number;
  overallUnderstanding: string;
  priorSessionPatterns?: {
    conceptConsistency: Array<{ concept: string; priorTendency: string }>;
    confidenceTrend: 'improving' | 'declining' | 'stable';
  };
}

interface ReportPromptData {
  concepts: Array<{ name: string; description: string; weight: number }>;
  validationResponses: Array<{
    concept: string;
    question: string;
    response: string;
    understanding: string;
    confidence: number;
  }>;
  overallConfidence: number;
  reflection: any;
  conceptMastery?: Record<string, number>;
}

interface RecommendationPromptData {
  concepts: Array<{ name: string; description: string; weight: number }>;
  conceptMastery: Record<string, number>;
  validationResponses: Array<{
    concept: string;
    question: string;
    response: string;
    confidence: number;
  }>;
  strengths: string[];
  growthOpportunities: string[];
  conceptualConsistency?: {
    consistency: 'high' | 'medium' | 'low';
    description: string;
  };
}

export class PromptManager {
  static createAnalysisPrompt(data: AnalysisPromptData): string {
    const fileList = data.files.map((f) => `- ${f.name} (${f.type})`).join('\n');

    return `You are an expert educational content analyzer. Analyze the following uploaded assignment files and extract learning concepts.

FILES TO ANALYZE:
${fileList}

${data.learningObjective ? `LEARNING OBJECTIVE: ${data.learningObjective}` : ''}

Provide a JSON response with the following structure:
{
  "concepts": [
    {
      "name": "concept name",
      "difficulty": 0.5,
      "bloomLevel": "understand",
      "prerequisites": ["prerequisite1", "prerequisite2"]
    }
  ],
  "topicClassification": "subject area",
  "difficultyEstimate": 0.5,
  "learningObjectives": ["objective1", "objective2"]
}

Consider Bloom's Taxonomy levels: remember, understand, apply, analyze, evaluate, create.
Difficulty should be between 0 and 1.
Extract 5-15 key concepts.
Respond only with valid JSON.`;
  }

  static createBlueprintPrompt(data: BlueprintPromptData): string {
    const conceptsList = data.concepts
      .map((c) => `- ${c.name} (difficulty: ${c.difficulty}, bloomLevel: ${c.bloomLevel})`)
      .join('\n');

    let facultyContext = '';
    if (data.facultyExpectations) {
      if (data.facultyExpectations.expectedConcepts?.length) {
        facultyContext += `\nFACULTY-EXPECTED CONCEPTS: ${data.facultyExpectations.expectedConcepts.join(', ')}`;
      }
      if (data.facultyExpectations.rubricCriteria?.length) {
        facultyContext += `\nRUBRIC CRITERIA: ${data.facultyExpectations.rubricCriteria.join(', ')}`;
      }
      if (data.facultyExpectations.facultyNotes) {
        facultyContext += `\nFACULTY NOTES: ${data.facultyExpectations.facultyNotes}`;
      }
    }

    return `You are an expert learning designer. Create a learning blueprint based on the analyzed concepts.
Map each concept to its Bloom's Taxonomy level and describe what understanding at that level looks like.

ANALYZED CONCEPTS:
${conceptsList}

TOPIC: ${data.topicClassification}
OVERALL DIFFICULTY: ${data.difficultyEstimate}
LEARNING OBJECTIVES: ${data.learningObjectives.join(', ')}${facultyContext}

Create a comprehensive learning blueprint with the following JSON structure:
{
  "concepts": [
    {
      "name": "concept name",
      "description": "detailed description of what understanding this concept means",
      "weight": 0.2,
      "order": 1
    }
  ],
  "learningGoals": ["goal1", "goal2"],
  "dependencies": {
    "concept1": ["prerequisite1"],
    "concept2": ["prerequisite2"]
  },
  "estimatedTime": 120,
  "difficulty": "medium"
}

Ensure concepts are ordered logically with dependencies properly mapped. Weight reflects relative importance (sum ≈ 1).
Estimated time should be in minutes.
Respond only with valid JSON.`;
  }

  static createValidationQuestionPrompt(data: ValidationPromptData): string {
    const previousContext = data.previousResponses
      .slice(-3)
      .map((r) => `Concept: ${r.concept}, Response: ${r.response}, Confidence: ${r.confidence}`)
      .join('\n');

    return `You are an expert educator assessing conceptual understanding. Generate a question that requires the student to explain a concept in their own words and demonstrate reasoning.

CONCEPT TO VALIDATE: ${data.concept}
DESCRIPTION: ${data.description}
DIFFICULTY LEVEL: ${data.difficulty}

${previousContext ? `PREVIOUS RESPONSES FOR CONTEXT:\n${previousContext}` : ''}

Generate one validation question. Choose the most appropriate type based on the concept:
- "explain": ask the student to describe the concept in their own words
- "summarize": ask the student to condense key points about the concept
- "connect": ask the student to relate this concept to another concept
- "analyze": ask the student to break down a problem using this concept

Provide a JSON response with the following structure:
{
  "question": "the open-ended validation question",
  "type": "explain" | "summarize" | "connect" | "analyze",
  "expectedInsights": ["key point the student should mention", "another key insight"],
  "scaffoldingHint": "gentle prompt if the student struggles to start"
}

The question should:
- Require the student to demonstrate reasoning, not recall facts
- Be open-ended — there is no single correct answer, but certain insights are expected
- Be appropriate for the difficulty level
- Never be a multiple-choice or true/false question

Respond only with valid JSON.`;
  }

  static createHintPrompt(data: HintPromptData): string {
    const previousContext = data.previousResponses
      .filter((r) => r.concept === data.concept)
      .map((r) => `Question: ${r.question}\nResponse: ${r.response}\nConfidence: ${r.confidence}`)
      .join('\n\n');

    return `You are a supportive learning assistant providing scaffolding for a struggling student.

CONCEPT: ${data.concept}

${previousContext ? `STUDENT'S PREVIOUS ATTEMPTS:\n${previousContext}` : 'No previous attempts recorded.'}

Provide progressive hints that guide the student toward constructing their own understanding. Never give away the answer.

Provide a JSON response with the following structure:
{
  "hints": [
    {
      "level": 1,
      "hint": "subtle nudge toward the key idea",
      "explanation": "why this nudge helps"
    },
    {
      "level": 2,
      "hint": "more direct hint connecting to prior knowledge",
      "explanation": "why this hint helps"
    },
    {
      "level": 3,
      "hint": "almost direct explanation but framed as a question",
      "explanation": "why this hint helps"
    }
  ]
}

Hints should progress from subtle to more direct.
Respond only with valid JSON.`;
  }

  static createReflectionPrompt(data: ReflectionPromptData): string {
    const conceptsList = data.concepts.map((c) => c.name).join(', ');
    const responseSummary = data.validationResponses
      .map((r) => `${r.concept}: ${r.understanding} (confidence: ${r.confidence})`)
      .join('\n');

    let consistencySection = '';
    if (data.priorSessionPatterns) {
      consistencySection = `\nCROSS-SESSION PATTERNS:
- Confidence trend: ${data.priorSessionPatterns.confidenceTrend}
- Concept-level tendencies: ${data.priorSessionPatterns.conceptConsistency.map(c => `${c.concept} (${c.priorTendency})`).join(', ')}`;
    }

    return `You are an expert learning coach providing constructive, supportive feedback. Evaluate the student's demonstrated understanding against the learning blueprint — do NOT assess for AI use. Focus on conceptual ownership.

CONCEPTS COVERED: ${conceptsList}
OVERALL CONFIDENCE: ${data.overallConfidence}
UNDERSTANDING LEVEL: ${data.overallUnderstanding}

VALIDATION RESPONSES SUMMARY:
${responseSummary}${consistencySection}

Generate a reflection with two mandatory sections plus conceptual consistency assessment.

CONCEPTUAL CONSISTENCY: Compare the student's explanations against the blueprint expectations. Flag potential gaps neutrally as areas for growth, never as accusations.

Provide a JSON response with the following structure:
{
  "sections": [
    {
      "title": "What I Learned",
      "content": "encouraging summary of demonstrated understanding",
      "type": "summary"
    },
    {
      "title": "Areas to Strengthen",
      "content": "neutral description of concepts where understanding could deepen",
      "type": "growth_areas"
    },
    {
      "title": "Next Steps",
      "content": "actionable suggestions for continued learning",
      "type": "action_items"
    },
    {
      "title": "Self-Assessment",
      "content": "prompt for the student to reflect on their own understanding",
      "type": "self_assessment"
    }
  ],
  "conceptualConsistency": {
    "consistency": "high"|"medium"|"low",
    "description": "neutral explanation of the consistency level without judgment"
  }
}

Be supportive and constructive. Flag inconsistencies neutrally as growth opportunities.
Respond only with valid JSON.`;
  }

  static createReportPrompt(data: ReportPromptData): string {
    const conceptMasteryStr = Object.entries(data.conceptMastery || {})
      .map(([concept, mastery]) => `${concept}: ${Math.round((mastery as number) * 100)}%`)
      .join('\n');

    const responseSummary = data.validationResponses
      .map((r) => `${r.concept}: confidence ${r.confidence}`)
      .join('\n');

    return `You are an expert learning analyst creating a constructive learning report that measures conceptual ownership, not AI detection. Scores reflect depth of reasoning and explanation quality.

CONCEPTS ANALYZED: ${data.concepts.map((c) => c.name).join(', ')}
OVERALL CONFIDENCE: ${data.overallConfidence}

CONCEPT MASTERY:
${conceptMasteryStr || 'No mastery data available'}

VALIDATION RESPONSES:
${responseSummary || 'No validation data available'}

Generate a detailed learning report with the following JSON structure:
{
  "learningAuthenticity": 0.85,
  "confidenceIndex": 0.75,
  "conceptMastery": {
    "concept1": 0.8,
    "concept2": 0.6
  },
  "aiLearningBalance": {
    "aiAssisted": 0.3,
    "selfDirected": 0.7
  },
  "strengths": ["strength1", "strength2"],
  "growthOpportunities": ["opportunity1", "opportunity2"],
  "recommendations": ["recommendation1", "recommendation2"]
}

Notes:
- learningAuthenticity: based on reasoning coherence and conceptual ownership, NOT AI detection
- confidenceIndex: based on demonstrated understanding, not self-reported confidence
- strengths and growthOpportunities: frame neutrally, always pair a growth area with a strength

Provide honest, constructive feedback that supports learning.
Respond only with valid JSON.`;
  }

  static createRecommendationPrompt(data: RecommendationPromptData): string {
    const weakConcepts = Object.entries(data.conceptMastery)
      .filter(([, mastery]) => mastery < 0.7)
      .map(([concept]) => concept);

    const strongConcepts = Object.entries(data.conceptMastery)
      .filter(([, mastery]) => mastery >= 0.7)
      .map(([concept]) => concept);

    let consistencyNote = '';
    if (data.conceptualConsistency) {
      consistencyNote = `\nCONCEPTUAL CONSISTENCY: ${data.conceptualConsistency.consistency} — ${data.conceptualConsistency.description}`;
    }

    return `You are a supportive learning guide creating personalized recommendations. The goal is to deepen conceptual understanding through guided learning — never punitive or remedial in tone.

STRONG CONCEPTS: ${strongConcepts.join(', ') || 'None identified yet'}
CONCEPTS NEEDING IMPROVEMENT: ${weakConcepts.join(', ') || 'None identified yet'}
STRENGTHS: ${data.strengths.join(', ') || 'None identified yet'}
GROWTH AREAS: ${data.growthOpportunities.join(', ') || 'None identified yet'}${consistencyNote}

Generate personalized learning recommendations with the following JSON structure:
{
  "activities": [
    {
      "type": "video",
      "concept": "concept name",
      "description": "activity description that builds on what the student knows",
      "completed": false
    }
  ],
  "roadmap": [
    "step1: description starting from current understanding",
    "step2: description building on step1",
    "step3: description"
  ]
}

For concepts needing improvement: suggest practice activities and simplified explanations.
For strong concepts: suggest application/connection activities to deepen understanding.
Activity types can be: video, reading, practice, quiz, interactive, project, reflection
Include 5-10 activities. Frame everything as supportive growth opportunities.
Respond only with valid JSON.`;
  }
}

export default PromptManager;
