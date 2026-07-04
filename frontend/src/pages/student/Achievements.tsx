import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Target, BookOpen, TrendingUp } from 'lucide-react';
import { useAchievements } from '@/hooks/api/usePortfolio';
import Card from '@/components/ui/Card';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function Achievements() {
  const { data: achievements, isLoading } = useAchievements();

  const categories = [
    { id: 'streak', label: 'Streaks', icon: Flame },
    { id: 'mastery', label: 'Mastery', icon: Target },
    { id: 'consistency', label: 'Consistency', icon: TrendingUp },
    { id: 'exploration', label: 'Exploration', icon: BookOpen },
    { id: 'social', label: 'Social', icon: Star },
  ];

  const filteredAchievements = (category: string) =>
    achievements?.filter((a) => a.category === category) || [];

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Achievements' }]} />

      <h1 className="text-2xl font-bold text-secondary-900 mb-2">Achievements</h1>
      <p className="text-secondary-500 mb-8">Track your learning milestones and badges.</p>

      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-secondary-100 rounded-card animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => {
            const items = filteredAchievements(category.id);
            if (items.length === 0) return null;

            return (
              <div key={category.id}>
                <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                  <category.icon size={18} />
                  {category.label}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map((achievement, i) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className={`relative p-6 rounded-card border text-center transition-all ${
                        achievement.isUnlocked
                          ? 'bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200 shadow-sm'
                          : 'bg-secondary-50 border-secondary-200 opacity-60'
                      }`}
                    >
                      {achievement.isUnlocked && (
                        <div className="absolute top-2 right-2">
                          <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                            <Trophy size={10} className="text-white" />
                          </div>
                        </div>
                      )}
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h4 className="text-sm font-semibold text-secondary-900 mb-1">{achievement.name}</h4>
                      <p className="text-xs text-secondary-500 mb-3">{achievement.description}</p>
                      {!achievement.isUnlocked && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-secondary-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-secondary-400 mt-1">{achievement.progress}/{achievement.maxProgress}</p>
                        </div>
                      )}
                      {achievement.isUnlocked && achievement.unlockedAt && (
                        <p className="text-xs text-primary-600 mt-1">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
