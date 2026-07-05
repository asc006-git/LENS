import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, BookOpen, CheckCircle, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useSessionGuidedLearning } from '@/hooks/api/useLearningSession';

export default function GuidedLearning() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: guided, isLoading } = useSessionGuidedLearning(sessionId!);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="h-48 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  const milestones = guided?.milestones || [
    { id: 'm1', conceptName: 'Binary Search Tree Rotations', description: 'Practice left and right single rotations', estimatedTime: 15, completed: false },
    { id: 'm2', conceptName: 'Double Rotations (LR/RL)', description: 'Understand sequence of operations for double rotation', estimatedTime: 20, completed: false },
    { id: 'm3', conceptName: 'Complexity of Balanced Trees', description: 'Analyze runtime differences between AVL and standard BST', estimatedTime: 10, completed: false },
  ];

  const activities = guided?.activities || [
    { id: 'a1', title: 'AVL Tree Interactive Simulator', type: 'Simulation', difficulty: 'Medium', estimatedTime: 15 },
    { id: 'a2', title: 'Practice Code: AVL Rotations', type: 'Coding', difficulty: 'Hard', estimatedTime: 25 },
    { id: 'a3', title: 'Self-Check Quiz on Tree Balance Factors', type: 'Quiz', difficulty: 'Easy', estimatedTime: 10 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-coral-500/10 border border-coral-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-coral-500" />
          <span className="text-xs font-medium text-coral-400">Guided Learning Plan</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Your Learning Roadmap</h1>
        <p className="text-sm text-stone-400">Your personalized path to mastering the concepts identified as weak.</p>
      </div>

      {/* Concept Milestones */}
      <div className="glass-card p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-sage-500" /> Concept Milestones
        </h2>
        <div className="space-y-3">
          {milestones.map((milestone: any, index: number) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-white/2 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                milestone.completed ? 'bg-sage-500/20 text-sage-500' : 'bg-white/5 border border-white/10 text-stone-500'
              }`}>
                {milestone.completed ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-semibold">{index + 1}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{milestone.conceptName}</h4>
                <p className="text-xs text-stone-400">{milestone.description}</p>
              </div>
              <span className="text-xs text-stone-500 font-medium shrink-0">{milestone.estimatedTime} min</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Practice Activities */}
      <div className="glass-card p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-coral-500" /> Recommended Activities
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity: any) => (
            <div key={activity.id} className="p-4 rounded-xl bg-white/2 border border-white/5 hover:border-white/10 transition-all cursor-pointer flex flex-col justify-between group">
              <div>
                <span className="badge badge-blue mb-2.5 text-[10px]">{activity.type}</span>
                <h4 className="text-sm font-semibold text-stone-200 group-hover:text-white transition-colors mb-1">{activity.title}</h4>
                <p className="text-xs text-stone-500">{activity.difficulty} Difficulty</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-stone-500">
                <span>{activity.estimatedTime} mins</span>
                <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-coral-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary notice */}
      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-sage-500 shrink-0 mt-0.5" />
        <p className="text-xs text-stone-400 leading-relaxed">
          Completing these milestones and activities will update your concept mastery scores and build your Growth Portfolio.
        </p>
      </div>

      {/* Back to Workspace button */}
      <div className="flex justify-end">
        <Link to="/student/dashboard" className="btn-primary !py-2.5 !px-5 text-sm">
          Return to Workspace <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
