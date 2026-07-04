import { motion } from 'framer-motion';
import { Concept } from '@/types';
import Badge from '@/components/ui/Badge';

interface ConceptCardProps {
  concept: Concept;
  onClick?: () => void;
}

const statusColors = {
  discovered: 'default',
  learning: 'accent',
  validated: 'success',
  mastered: 'primary',
} as const;

const statusLabels = {
  discovered: 'Discovered',
  learning: 'Learning',
  validated: 'Validated',
  mastered: 'Mastered',
};

export default function ConceptCard({ concept, onClick }: ConceptCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-white rounded-card border border-secondary-100 p-4 cursor-pointer hover:shadow-card-hover transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-secondary-900">{concept.name}</h4>
        <Badge variant={statusColors[concept.status]}>
          {statusLabels[concept.status]}
        </Badge>
      </div>
      <p className="text-xs text-secondary-500 line-clamp-2 mb-3">{concept.description}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-secondary-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${concept.mastery}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs font-medium text-secondary-600">{concept.mastery}%</span>
      </div>
      {concept.relatedTopics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {concept.relatedTopics.slice(0, 3).map((topic) => (
            <span key={topic} className="px-2 py-0.5 bg-secondary-50 rounded text-xs text-secondary-500">
              {topic}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
