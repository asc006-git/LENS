import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

interface Stage {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'pending';
}

interface LearningProgressTrackerProps {
  stages: Stage[];
}

export default function LearningProgressTracker({ stages }: LearningProgressTrackerProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto py-8">
      {stages.map((stage, index) => (
        <div key={stage.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                stage.status === 'completed'
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : stage.status === 'current'
                  ? 'bg-white border-primary-500 text-primary-600'
                  : 'bg-white border-secondary-200 text-secondary-400'
              }`}
            >
              {stage.status === 'completed' ? (
                <Check size={18} />
              ) : stage.status === 'current' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </motion.div>
            <span className={`mt-2 text-xs font-medium whitespace-nowrap ${
              stage.status === 'pending' ? 'text-secondary-400' : 'text-secondary-700'
            }`}>
              {stage.label}
            </span>
          </div>
          {index < stages.length - 1 && (
            <div className="flex-1 mx-2 h-0.5 mt-[-20px]">
              <div className={`h-full rounded-full ${
                stage.status === 'completed' ? 'bg-primary-500' : 'bg-secondary-200'
              }`} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
