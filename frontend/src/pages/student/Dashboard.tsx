import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, BookOpen, TrendingUp, Flame, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { useDashboard } from '@/hooks/api/useDashboard';
import { SkeletonDashboard } from '@/components/ui/Skeleton';
import ProgressRing from '@/components/ui/ProgressRing';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function StudentDashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <SkeletonDashboard />;

  const metrics = data?.metrics;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-card p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-primary-100 mb-4">Continue your learning journey. You're on a {metrics?.learningStreak || 0}-day streak!</p>
            <Link to="/student/learning/new" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-button hover:bg-primary-50 transition-colors">
              <Plus size={18} />
              Start New Session
            </Link>
          </div>
          <div className="hidden md:block">
            <ProgressRing value={metrics?.learningAuthenticity || 0} size={140} color="#FFFFFF" bgColor="rgba(255,255,255,0.2)" label="Authenticity" />
          </div>
        </div>
      </motion.div>

      {/* Continue Session */}
      {data?.recentSessions?.[0] && data.recentSessions[0].status !== 'completed' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Link to={`/student/learning/${data.recentSessions[0].id}`} className="block">
            <Card hover className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                  <BookOpen size={24} className="text-accent-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">{data.recentSessions[0].title}</h3>
                  <p className="text-sm text-secondary-500">Continue where you left off</p>
                </div>
              </div>
              <Badge variant="accent">{data.recentSessions[0].status}</Badge>
            </Card>
          </Link>
        </motion.div>
      )}

      {/* Learning Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Learning Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Authenticity', value: metrics?.learningAuthenticity || 0, icon: Sparkles, color: '#22C55E' },
            { label: 'Concept Mastery', value: metrics?.conceptMastery || 0, icon: BookOpen, color: '#3B82F6' },
            { label: 'Confidence', value: metrics?.confidenceIndex || 0, icon: TrendingUp, color: '#8B5CF6' },
            { label: 'AI Balance', value: metrics?.aiLearningBalance || 0, icon: Sparkles, color: '#F59E0B' },
            { label: 'Weekly', value: metrics?.weeklyProgress || 0, icon: TrendingUp, color: '#10B981' },
            { label: 'Streak', value: 0, icon: Flame, color: '#EF4444', display: `${metrics?.learningStreak || 0} days` },
          ].map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="text-center">
                <metric.icon size={20} className="mx-auto mb-2" style={{ color: metric.color }} />
                <div className="text-2xl font-bold text-secondary-900">{metric.display || `${Math.round(metric.value)}%`}</div>
                <div className="text-xs text-secondary-500 mt-1">{metric.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Sessions & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Recent Sessions</h2>
          <div className="space-y-3">
            {data?.recentSessions?.slice(0, 5).map((session) => (
              <Link key={session.id} to={`/student/learning/${session.id}`}>
                <Card hover padding="sm" className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                      <BookOpen size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-secondary-900">{session.title}</h4>
                      <p className="text-xs text-secondary-500">{session.courseName}</p>
                    </div>
                  </div>
                  <Badge variant={session.status === 'completed' ? 'success' : 'accent'}>
                    {session.status}
                  </Badge>
                </Card>
              </Link>
            ))}
            {(!data?.recentSessions || data.recentSessions.length === 0) && (
              <Card className="text-center py-8">
                <p className="text-sm text-secondary-500">No sessions yet. Start your first one!</p>
              </Card>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">AI Recommendations</h2>
          <div className="space-y-3">
            {data?.recommendations?.slice(0, 3).map((rec) => (
              <Card key={rec.id} hover padding="sm" className="mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-warning-50 rounded-lg flex items-center justify-center shrink-0">
                    <Trophy size={16} className="text-warning-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-secondary-900">{rec.title}</h4>
                    <p className="text-xs text-secondary-500 mt-0.5">{rec.description}</p>
                  </div>
                  <ArrowRight size={16} className="text-secondary-400 mt-1" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
