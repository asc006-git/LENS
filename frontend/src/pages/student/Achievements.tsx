import { Award, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAchievements } from '@/hooks/api/usePortfolio';

export default function Achievements() {
  const { data: achievements, isLoading } = useAchievements();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="h-28 bg-white/5 rounded-2xl" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!achievements || achievements.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <AlertCircle className="w-12 h-12 text-stone-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">No achievements yet</h2>
        <p className="text-sm text-stone-400">Complete learning sessions to unlock achievements.</p>
      </div>
    );
  }

  const unlocked = achievements.filter(a => a.isUnlocked);
  const locked = achievements.filter(a => !a.isUnlocked);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-copper-500/10 border border-amber-500/20 mb-2">
          <Award className="w-3.5 h-3.5 text-copper-400" />
          <span className="text-xs font-medium text-copper-400">Achievement Gallery</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Achievements</h1>
        <p className="text-sm text-stone-400">Track your milestones and celebrate your learning journey.</p>
      </div>

      {/* Progress Summary */}
      <div className="glass-card p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-copper-500 to-copper-400 flex items-center justify-center text-white text-2xl font-bold shadow-glow-amber">
          {unlocked.length}/{achievements.length}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white mb-1">Achievement Progress</h3>
          <p className="text-sm text-stone-400 mb-3">
            You've unlocked {unlocked.length} out of {achievements.length} achievements. Keep learning to earn more!
          </p>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-copper-500 to-copper-400 rounded-full transition-all"
              style={{ width: `${(unlocked.length / achievements.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlocked.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-sage-500 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Unlocked ({unlocked.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {unlocked.map((achievement) => (
              <div key={achievement.id} className="glass-card p-4 text-center border-amber-500/15 hover:scale-105 transition-transform">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h4 className="text-xs font-semibold text-white mb-1">{achievement.name}</h4>
                <p className="text-[10px] text-stone-500">{achievement.description}</p>
                {achievement.unlockedAt && (
                  <p className="text-[10px] text-sage-500 mt-2">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {locked.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-stone-500 mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4" /> Locked ({locked.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {locked.map((achievement) => (
              <div key={achievement.id} className="glass-card p-4 text-center opacity-50">
                <div className="text-4xl mb-3 grayscale">{achievement.icon}</div>
                <h4 className="text-xs font-semibold text-stone-400 mb-1">{achievement.name}</h4>
                <p className="text-[10px] text-stone-600">{achievement.description}</p>
                <Lock className="w-3 h-3 text-stone-600 mx-auto mt-2" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
