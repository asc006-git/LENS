import { useState } from 'react';
import { motion } from 'framer-motion';
import { ValidationQuestion as ValidationQuestionType } from '@/types';

interface ValidationQuestionProps {
  question: ValidationQuestionType;
  onAnswer: (answer: string, confidence: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function ValidationQuestion({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
}: ValidationQuestionProps) {
  const [answer, setAnswer] = useState('');
  const [confidence, setConfidence] = useState(70);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSubmit = () => {
    const finalAnswer = question.type === 'multiple_choice' ? selectedOption || '' : answer;
    if (finalAnswer) {
      onAnswer(finalAnswer, confidence);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-card border border-secondary-100 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-secondary-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
          {question.conceptName}
        </span>
      </div>

      <h3 className="text-base font-medium text-secondary-900 mb-6">{question.question}</h3>

      {question.type === 'multiple_choice' && question.options && (
        <div className="space-y-2 mb-6">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedOption(option)}
              className={`w-full text-left p-3 rounded-button border text-sm transition-all ${
                selectedOption === option
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-secondary-200 hover:border-secondary-300 text-secondary-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {question.type !== 'multiple_choice' && (
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none h-32 mb-6"
        />
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          How confident are you? {confidence}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full h-2 bg-secondary-200 rounded-full appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex justify-between text-xs text-secondary-400 mt-1">
          <span>Not sure</span>
          <span>Very confident</span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedOption && !answer}
        className="w-full py-3 bg-primary-500 text-white font-medium rounded-button hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Answer
      </button>
    </motion.div>
  );
}
