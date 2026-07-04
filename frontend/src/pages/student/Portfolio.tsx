import { motion } from 'framer-motion';
import { usePortfolio, useAchievements, usePortfolioAnalytics } from '@/hooks/api/usePortfolio';
import Card from '@/components/ui/Card';
import ProgressRing from '@/components/ui/ProgressRing';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { FolderOpen, TrendingUp, BookOpen, Trophy, Flame } from 'lucide-react';

export default function Portfolio() {
  const { data: portfolio, isLoading } = usePortfolio();
  const { data: achievements } = useAchievements();
  const { data: analytics } = usePortfolioAnalytics();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-100 rounded w-1/3" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-secondary-100 rounded-card" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: 'Portfolio' }]} />

      <h1 className="text-2xl font-bold text-secondary-900 mb-2">Growth Portfolio</h1>
      <p className="text-secondary-500 mb-8">Your comprehensive learning journey and achievements.</p>

      {/* Analytics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Sessions', value: analytics?.totalSessions || 0, icon: BookOpen, color: '#22C55E' },
          { label: 'Authenticity', value: `${Math.round(analytics?.averageAuthenticity || 0)}%`, icon: TrendingUp, color: '#3B82F6' },
          { label: 'Concepts', value: analytics?.conceptsMastered || 0, icon: FolderOpen, color: '#8B5CF6' },
          { label: 'Streak', value: `${analytics?.currentStreak || 0} days`, icon: Flame, color: '#EF4444' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="text-center">
              <stat.icon size={20} className="mx-auto mb-2" style={{ color: stat.color }} />
              <div className="text-2xl font-bold text-secondary-900">{stat.value}</div>
              <div className="text-xs text-secondary-500 mt-1">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Learning DNA */}
      {portfolio?.learningDNA && (
        <Card className="mb-8">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Learning DNA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-secondary-700 mb-2">Primary Style</h4>
              <Badge variant="primary" size="md">{portfolio.learningDNA.primaryStyle}</Badge>
              <h4 className="text-sm font-medium text-secondary-700 mt-4 mb-2">Secondary Style</h4>
              <Badge variant="accent" size="md">{portfolio.learningDNA.secondaryStyle}</Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium text-secondary-700 mb-2">Strengths</h4>
              <div className="flex flex-wrap gap-1 mb-4">
                {portfolio.learningDNA.strengths.map((s) => (
                  <Badge key={s} variant="success">{s}</Badge>
                ))}
              </div>
              <h4 className="text-sm font-medium text-secondary-700 mb-2">Growth Areas</h4>
              <div className="flex flex-wrap gap-1">
                {portfolio.learningDNA.growthAreas.map((g) => (
                  <Badge key={g} variant="warning">{g}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Achievements */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <Trophy size={18} />
          Achievement Gallery
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements?.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-card border text-center ${
                achievement.isUnlocked ? 'bg-primary-50 border-primary-200' : 'bg-secondary-50 border-secondary-200 opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h4 className="text-sm font-medium text-secondary-900">{achievement.name}</h4>
              <p className="text-xs text-secondary-500 mt-1">{achievement.description}</p>
              {achievement.isUnlocked && achievement.unlockedAt && (
                <p className="text-xs text-primary-600 mt-2">Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}</p>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Reflection Library */}
      <Card>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Reflection Library</h2>
        {portfolio?.reflectionLibrary?.length ? (
          <div className="space-y-3">
            {portfolio.reflectionLibrary.map((entry) => (
              <div key={entry.id} className="p-4 border border-secondary-100 rounded-card">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-secondary-900">{entry.sessionTitle}</h4>
                  <span className="text-xs text-secondary-400">{new Date(entry.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-secondary-600 line-clamp-2">{entry.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No reflections yet" description="Complete learning sessions to build your reflection library." />
        )}
      </Card>
    </div>
  );
}
