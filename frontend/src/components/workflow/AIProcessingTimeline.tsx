import { motion } from 'framer-motion';
import { Check, Loader2, Circle } from 'lucide-react';

interface TimelineStage {
  id: string;
  label: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  duration?: string;
}

interface AIProcessingTimelineProps {
  stages: TimelineStage[];
}

export default function AIProcessingTimeline({ stages }: AIProcessingTimelineProps) {
  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-4"
        >
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              stage.status === 'completed'
                ? 'bg-primary-500 text-white'
                : stage.status === 'active'
                ? 'bg-primary-100 text-primary-600'
                : 'bg-secondary-100 text-secondary-400'
            }`}>
              {stage.status === 'completed' ? (
                <Check size={16} />
              ) : stage.status === 'active' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Circle size={16} />
              )}
            </div>
            {index < stages.length - 1 && (
              <div className={`w-0.5 h-8 mt-1 ${
                stage.status === 'completed' ? 'bg-primary-500' : 'bg-secondary-200'
              }`} />
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2">
              <h4 className={`text-sm font-medium ${
                stage.status === 'pending' ? 'text-secondary-400' : 'text-secondary-900'
              }`}>
                {stage.label}
              </h4>
              {stage.duration && (
                <span className="text-xs text-secondary-400">{stage.duration}</span>
              )}
            </div>
            <p className={`text-xs mt-0.5 ${
              stage.status === 'pending' ? 'text-secondary-300' : 'text-secondary-500'
            }`}>
              {stage.description}
            </p>
            {stage.status === 'active' && (
              <motion.div
                className="mt-2 h-1 bg-primary-100 rounded-full overflow-hidden"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
              >
                <div className="h-full bg-primary-500 rounded-full" />
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
