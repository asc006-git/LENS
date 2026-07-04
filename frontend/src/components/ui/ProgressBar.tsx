import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  bgColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  color = '#22C55E',
  bgColor = '#E2E8F0',
  height = 8,
  showLabel = false,
  label,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm font-medium text-secondary-700">{label}</span>}
          {showLabel && <span className="text-sm text-secondary-500">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="w-full rounded-full overflow-hidden" style={{ height, backgroundColor: bgColor }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
