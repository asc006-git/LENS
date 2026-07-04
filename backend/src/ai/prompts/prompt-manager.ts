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

    return `You are an expert learning designer. Create a learning blueprint based on the analyzed concepts.

ANALYZED CONCEPTS:
${conceptsList}

TOPIC: ${data.topicClassification}
OVERALL DIFFICULTY: ${data.difficultyEstimate}
LEARNING OBJECTIVES: ${data.learningObjectives.join(', ')}

Create a comprehensive learning blueprint with the following JSON structure:
{
  "concepts": [
    {
      "name": "concept name",
      "description": "detailed description",
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

Ensure concepts are ordered logically with dependencies properly mapped.
Estimated time should be in minutes.
Respond only with valid JSON.`;
  }

  static createValidationQuestionPrompt(data: ValidationPromptData): string {
    const previousContext = data.previousResponses
      .slice(-3)
      .map((r) => `Concept: ${r.concept}, Response: ${r.response}, Confidence: ${r.confidence}`)
      .join('\n');

    return `You are an expert educator creating validation questions to assess student understanding.

CONCEPT TO VALIDATE: ${data.concept}
DESCRIPTION: ${data.description}
DIFFICULTY LEVEL: ${data.difficulty}

${previousContext ? `PREVIOUS RESPONSES FOR CONTEXT:\n${previousContext}` : ''}

Generate a validation question to assess the student's understanding of this concept.

Provide a JSON response with the following structure:
{
  "question": "the validation question",
  "options": ["option1", "option2", "option3", "option4"],
  "hints": ["hint1", "hint2"]
}

The question should:
- Test deep understanding, not just memorization
- Be appropriate for the difficulty level
- Have one correct answer and plausible distractors
- Include helpful hints for struggling students

Respond only with valid JSON.`;
  }

  static createHintPrompt(data: HintPromptData): string {
    const previousContext = data.previousResponses
      .filter((r) => r.concept === data.concept)
      .map((r) => `Question: ${r.question}\nResponse: ${r.response}\nConfidence: ${r.confidence}`)
      .join('\n\n');

    return `You are a supportive learning assistant providing hints for a struggling student.

CONCEPT: ${data.concept}

${previousContext ? `STUDENT'S PREVIOUS ATTEMPTS:\n${previousContext}` : 'No previous attempts recorded.'}

Provide helpful hints that guide the student toward understanding without giving away the answer.

Provide a JSON response with the following structure:
{
  "hints": [
    {
      "level": 1,
      "hint": "subtle hint",
      "explanation": "why this hint helps"
    },
    {
      "level": 2,
      "hint": "more direct hint",
      "explanation": "why this hint helps"
    },
    {
      "level": 3,
      "hint": "almost direct answer",
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

    return `You are an expert learning coach helping a student reflect on their learning journey.

CONCEPTS COVERED: ${conceptsList}
OVERALL CONFIDENCE: ${data.overallConfidence}
UNDERSTANDING LEVEL: ${data.overallUnderstanding}

VALIDATION RESPONSES SUMMARY:
${responseSummary}

Generate a comprehensive reflection with the following JSON structure:
{
  "sections": [
    {
      "title": "What I Learned",
      "content": "detailed reflection content",
      "type": "summary"
    },
    {
      "title": "Key Insights",
      "content": "key insights from the learning session",
      "type": "insights"
    },
    {
      "title": "Challenges Faced",
      "content": "challenges and how they were addressed",
      "type": "challenges"
    },
    {
      "title": "Next Steps",
      "content": "recommended next steps for continued learning",
      "type": "action_items"
    },
    {
      "title": "Self-Assessment",
      "content": "honest self-assessment of understanding",
      "type": "self_assessment"
    }
  ]
}

Make the reflection personalized and encouraging.
Respond only with valid JSON.`;
  }

  static createReportPrompt(data: ReportPromptData): string {
    const conceptMasteryStr = Object.entries(data.conceptMastery || {})
      .map(([concept, mastery]) => `${concept}: ${Math.round((mastery as number) * 100)}%`)
      .join('\n');

    const responseSummary = data.validationResponses
      .map((r) => `${r.concept}: confidence ${r.confidence}`)
      .join('\n');

    return `You are an expert learning analyst creating a comprehensive learning report.

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

Provide honest, constructive feedback.
Respond only with valid JSON.`;
  }

  static createRecommendationPrompt(data: RecommendationPromptData): string {
    const weakConcepts = Object.entries(data.conceptMastery)
      .filter(([, mastery]) => mastery < 0.7)
      .map(([concept]) => concept);

    const strongConcepts = Object.entries(data.conceptMastery)
      .filter(([, mastery]) => mastery >= 0.7)
      .map(([concept]) => concept);

    return `You are an expert learning designer creating personalized recommendations.

STRONG CONCEPTS: ${strongConcepts.join(', ') || 'None identified yet'}
CONCEPTS NEEDING IMPROVEMENT: ${weakConcepts.join(', ') || 'None identified yet'}
STRENGTHS: ${data.strengths.join(', ') || 'None identified yet'}
GROWTH AREAS: ${data.growthOpportunities.join(', ') || 'None identified yet'}

Generate personalized learning recommendations with the following JSON structure:
{
  "activities": [
    {
      "type": "video",
      "concept": "concept name",
      "description": "activity description",
      "completed": false
    }
  ],
  "roadmap": [
    "step1: description",
    "step2: description",
    "step3: description"
  ]
}

Activity types can be: video, reading, practice, quiz, interactive, project
Include 5-10 activities tailored to the student's needs.
Respond only with valid JSON.`;
  }
}

export default PromptManager;
