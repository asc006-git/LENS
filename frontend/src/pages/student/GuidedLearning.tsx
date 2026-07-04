import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Target, BookOpen, CheckCircle } from 'lucide-react';
import { useSessionGuidedLearning } from '@/hooks/api/useLearningSession';
import Card from '@/components/ui/Card';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function GuidedLearning() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: guided, isLoading } = useSessionGuidedLearning(sessionId!);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-100 rounded w-1/3" />
          <div className="h-48 bg-secondary-100 rounded-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/student/dashboard' },
        { label: 'Guided Learning', to: '#' },
      ]} />

      <h1 className="text-2xl font-bold text-secondary-900 mb-2">Today's Learning Roadmap</h1>
      <p className="text-secondary-500 mb-8">Your personalized path to mastering the concepts.</p>

      {/* Concept Milestones */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <Target size={18} />
          Concept Milestones
        </h2>
        <div className="space-y-4">
          {guided?.milestones?.map((milestone: any, index: number) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-secondary-50 rounded-card"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                milestone.completed ? 'bg-primary-500 text-white' : 'bg-white border-2 border-secondary-200 text-secondary-400'
              }`}>
                {milestone.completed ? <CheckCircle size={18} /> : <span className="text-sm font-medium">{index + 1}</span>}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-secondary-900">{milestone.conceptName}</h4>
                <p className="text-xs text-secondary-500">{milestone.description}</p>
              </div>
              <span className="text-xs text-secondary-400">{milestone.estimatedTime} min</span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Practice Activities */}
      <Card>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <BookOpen size={18} />
          Practice Activities
        </h2>
        <div className="space-y-3">
          {guided?.activities?.map((activity: any) => (
            <div key={activity.id} className="flex items-center justify-between p-4 border border-secondary-100 rounded-card hover:shadow-card transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-50 rounded-lg flex items-center justify-center">
                  <BookOpen size={14} className="text-accent-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-secondary-900">{activity.title}</h4>
                  <p className="text-xs text-secondary-500">{activity.type} • {activity.difficulty}</p>
                </div>
              </div>
              <span className="text-xs text-secondary-400">{activity.estimatedTime} min</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
