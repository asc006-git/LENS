import logger from '../../common/utils/logger';

export interface MemoryEntry {
  id: string;
  type: 'concept_mastery' | 'learning_pattern' | 'preference' | 'interaction';
  key: string;
  value: any;
  timestamp: Date;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface ConceptMemory {
  concept: string;
  mastery: number;
  attempts: number;
  lastPracticed: Date;
  difficulty: number;
  bloomLevel: string;
}

export interface LearningPattern {
  pattern: string;
  frequency: number;
  lastSeen: Date;
  confidence: number;
}

export class LearningMemoryEngine {
  private memories: Map<string, MemoryEntry[]> = new Map();
  private conceptMemory: Map<string, ConceptMemory> = new Map();
  private learningPatterns: Map<string, LearningPattern> = new Map();

  addMemory(studentId: string, entry: Omit<MemoryEntry, 'id' | 'timestamp'>): void {
    const fullEntry: MemoryEntry = {
      ...entry,
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    const studentMemories = this.memories.get(studentId) || [];
    studentMemories.push(fullEntry);
    this.memories.set(studentId, studentMemories);

    if (entry.type === 'concept_mastery') {
      this.updateConceptMemory(studentId, entry.key, entry.value);
    }

    this.detectLearningPattern(studentId, entry);
  }

  getMemories(studentId: string, type?: MemoryEntry['type'], limit: number = 50): MemoryEntry[] {
    const memories = this.memories.get(studentId) || [];
    const filtered = type ? memories.filter((m) => m.type === type) : memories;
    return filtered.slice(-limit);
  }

  private updateConceptMemory(studentId: string, concept: string, data: Partial<ConceptMemory>): void {
    const key = `${studentId}:${concept}`;
    const existing = this.conceptMemory.get(key) || {
      concept,
      mastery: 0,
      attempts: 0,
      lastPracticed: new Date(),
      difficulty: 0.5,
      bloomLevel: 'understand',
    };

    this.conceptMemory.set(key, {
      ...existing,
      ...data,
      attempts: existing.attempts + 1,
      lastPracticed: new Date(),
    });
  }

  getConceptMemory(studentId: string, concept: string): ConceptMemory | null {
    const key = `${studentId}:${concept}`;
    return this.conceptMemory.get(key) || null;
  }

  getAllConceptMemory(studentId: string): ConceptMemory[] {
    const memories: ConceptMemory[] = [];
    this.conceptMemory.forEach((memory, key) => {
      if (key.startsWith(studentId)) {
        memories.push(memory);
      }
    });
    return memories;
  }

  private detectLearningPattern(studentId: string, entry: Omit<MemoryEntry, 'id' | 'timestamp'>): void {
    const patternKey = `${studentId}:${entry.type}:${entry.key}`;
    const existing = this.learningPatterns.get(patternKey) || {
      pattern: patternKey,
      frequency: 0,
      lastSeen: new Date(),
      confidence: 0,
    };

    const timeDiff = Date.now() - existing.lastSeen.getTime();
    const isRecent = timeDiff < 24 * 60 * 60 * 1000;

    this.learningPatterns.set(patternKey, {
      pattern: patternKey,
      frequency: existing.frequency + 1,
      lastSeen: new Date(),
      confidence: Math.min(1, existing.confidence + (isRecent ? 0.1 : 0)),
    });
  }

  getLearningPatterns(studentId: string, minConfidence: number = 0.3): LearningPattern[] {
    const patterns: LearningPattern[] = [];
    this.learningPatterns.forEach((pattern) => {
      if (pattern.pattern.startsWith(studentId) && pattern.confidence >= minConfidence) {
        patterns.push(pattern);
      }
    });
    return patterns.sort((a, b) => b.confidence - a.confidence);
  }

  getWeakestConcepts(studentId: string, limit: number = 5): ConceptMemory[] {
    const memories = this.getAllConceptMemory(studentId);
    return memories
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, limit);
  }

  getStrongestConcepts(studentId: string, limit: number = 5): ConceptMemory[] {
    const memories = this.getAllConceptMemory(studentId);
    return memories
      .sort((a, b) => b.mastery - a.mastery)
      .slice(0, limit);
  }

  getConceptsNeedingReview(studentId: string, daysSinceLastPractice: number = 7): ConceptMemory[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysSinceLastPractice);

    return this.getAllConceptMemory(studentId).filter(
      (memory) => memory.lastPracticed < cutoff && memory.mastery < 0.8
    );
  }

  exportMemory(studentId: string): {
    memories: MemoryEntry[];
    concepts: ConceptMemory[];
    patterns: LearningPattern[];
  } {
    return {
      memories: this.getMemories(studentId),
      concepts: this.getAllConceptMemory(studentId),
      patterns: this.getLearningPatterns(studentId),
    };
  }

  clearMemory(studentId: string): void {
    this.memories.delete(studentId);
    const keysToDelete: string[] = [];
    this.conceptMemory.forEach((_, key) => {
      if (key.startsWith(studentId)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.conceptMemory.delete(key));

    const patternKeysToDelete: string[] = [];
    this.learningPatterns.forEach((_, key) => {
      if (key.startsWith(studentId)) {
        patternKeysToDelete.push(key);
      }
    });
    patternKeysToDelete.forEach((key) => this.learningPatterns.delete(key));
  }
}

export default LearningMemoryEngine;
