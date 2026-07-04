import logger from '../../common/utils/logger';

export interface GuardrailConfig {
  maxInputLength: number;
  maxOutputLength: number;
  blockedTopics: string[];
  toxicityThreshold: number;
  educationalFocus: boolean;
}

const defaultConfig: GuardrailConfig = {
  maxInputLength: 10000,
  maxOutputLength: 8000,
  blockedTopics: ['violence', 'hate', 'illegal', 'nsfw'],
  toxicityThreshold: 0.7,
  educationalFocus: true,
};

export class AISafetyGuardrails {
  private config: GuardrailConfig;

  constructor(config: Partial<GuardrailConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  validateInput(input: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (input.length > this.config.maxInputLength) {
      errors.push(`Input exceeds maximum length of ${this.config.maxInputLength} characters`);
    }

    const lowerInput = input.toLowerCase();
    for (const topic of this.config.blockedTopics) {
      if (lowerInput.includes(topic)) {
        errors.push(`Input contains blocked topic: ${topic}`);
      }
    }

    if (this.config.educationalFocus) {
      const nonEducationalPatterns = [
        /\b(hack|exploit|cheat)\b/i,
        /\b(solve|answer)\s+(this|the)\s+(quiz|test|exam)/i,
      ];

      for (const pattern of nonEducationalPatterns) {
        if (pattern.test(input)) {
          errors.push('Input appears to be seeking unauthorized assistance');
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateOutput(output: string): { valid: boolean; errors: string[]; sanitized: string } {
    const errors: string[] = [];
    let sanitized = output;

    if (output.length > this.config.maxOutputLength) {
      sanitized = output.substring(0, this.config.maxOutputLength);
      errors.push('Output was truncated to maximum length');
    }

    const lowerOutput = output.toLowerCase();
    for (const topic of this.config.blockedTopics) {
      if (lowerOutput.includes(topic)) {
        errors.push(`Output contains blocked topic: ${topic}`);
        sanitized = sanitized.replace(new RegExp(topic, 'gi'), '[REDACTED]');
      }
    }

    const piiPatterns = [
      { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '[EMAIL]' },
      { pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, replacement: '[PHONE]' },
      { pattern: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g, replacement: '[SSN]' },
    ];

    for (const { pattern, replacement } of piiPatterns) {
      if (pattern.test(sanitized)) {
        sanitized = sanitized.replace(pattern, replacement);
        errors.push('PII detected and redacted');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitized,
    };
  }

  sanitizeForLogging(input: string): string {
    let sanitized = input;

    const sensitivePatterns = [
      { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '[EMAIL]' },
      { pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, replacement: '[PHONE]' },
      { pattern: /password\s*[:=]\s*\S+/gi, replacement: 'password: [REDACTED]' },
      { pattern: /token\s*[:=]\s*\S+/gi, replacement: 'token: [REDACTED]' },
      { pattern: /key\s*[:=]\s*\S+/gi, replacement: 'key: [REDACTED]' },
    ];

    for (const { pattern, replacement } of sensitivePatterns) {
      sanitized = sanitized.replace(pattern, replacement);
    }

    return sanitized;
  }

  async checkContentSafety(content: string): Promise<{
    safe: boolean;
    confidence: number;
    flags: string[];
  }> {
    const flags: string[] = [];
    let confidence = 1.0;

    const lowerContent = content.toLowerCase();

    const safetyChecks = [
      { pattern: /\b(violent|kill|murder|harm)\b/i, flag: 'violence', weight: 0.3 },
      { pattern: /\b(hate|racist|sexist|discriminat)\b/i, flag: 'hate_speech', weight: 0.3 },
      { pattern: /\b(drug|cocaine|heroin|marijuana)\b/i, flag: 'substance', weight: 0.2 },
      { pattern: /\b(hack|exploit|malware|phishing)\b/i, flag: 'cybercrime', weight: 0.2 },
    ];

    for (const check of safetyChecks) {
      if (check.pattern.test(lowerContent)) {
        flags.push(check.flag);
        confidence -= check.weight;
      }
    }

    return {
      safe: confidence >= this.config.toxicityThreshold,
      confidence: Math.max(0, confidence),
      flags,
    };
  }

  logSafetyEvent(event: {
    type: 'input_rejected' | 'output_filtered' | 'content_flagged';
    input?: string;
    output?: string;
    errors: string[];
    studentId?: string;
    sessionId?: string;
  }): void {
    logger.warn('AI Safety Event', {
      type: event.type,
      errors: event.errors,
      studentId: event.studentId,
      sessionId: event.sessionId,
      timestamp: new Date().toISOString(),
    });
  }
}

export default AISafetyGuardrails;
