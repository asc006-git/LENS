import { motion } from 'framer-motion';

interface HeatmapData {
  concept: string;
  course?: string;
  mastery?: number;
  averageMastery?: number;
  difficulty?: number;
  studentCount?: number;
}

interface ConceptHeatmapProps {
  data: HeatmapData[];
}

function getColor(value: number) {
  if (value >= 80) return 'bg-emerald-500';
  if (value >= 60) return 'bg-emerald-300';
  if (value >= 40) return 'bg-amber-400';
  if (value >= 20) return 'bg-amber-500';
  return 'bg-red-400';
}

export default function ConceptHeatmap({ data }: ConceptHeatmapProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-secondary-400">
        No concept data available yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {data.map((item, index) => {
        const masteryValue = item.mastery || item.averageMastery || 0;
        return (
          <motion.div
            key={`${item.concept}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-[16px] ${getColor(masteryValue)} text-white`}
          >
            <h4 className="text-sm font-semibold truncate">{item.concept}</h4>
            {item.course && (
              <p className="text-xs opacity-80 mt-0.5">{item.course}</p>
            )}
            <p className="text-lg font-bold mt-2">{masteryValue}%</p>
          </motion.div>
        );
      })}
    </div>
  );
}
