import { usePortfolio, useAchievements, usePortfolioAnalytics } from '@/hooks/api/usePortfolio';
import { FolderOpen, TrendingUp, BookOpen, Trophy, Flame, Brain, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const { data: portfolio, isLoading } = usePortfolio();
  const { data: achievements } = useAchievements();
  const { data: analytics } = usePortfolioAnalytics();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-white/5 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const s = portfolio?.stats;
  const analyticStats = {
    totalSessions: s?.totalSessions || 0,
    averageAuthenticity: s ? Math.round((s.averageConfidence || 0) * 100) : 0,
    conceptsMastered: s?.totalConcepts || 0,
    currentStreak: s?.streak || analytics?.currentStreak || 0,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-500/10 border border-sage-500/20 mb-2">
          <FolderOpen className="w-3.5 h-3.5 text-sage-500" />
          <span className="text-xs font-medium text-sage-400">Growth Portfolio</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Your Growth Portfolio</h1>
        <p className="text-sm text-stone-400">Your comprehensive learning journey and achievements.</p>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Sessions', value: analyticStats.totalSessions, icon: BookOpen, color: 'text-coral-500', bg: 'bg-coral-500/10' },
          { label: 'Authenticity', value: `${analyticStats.averageAuthenticity}%`, icon: TrendingUp, color: 'text-sage-500', bg: 'bg-sage-500/10' },
          { label: 'Concepts', value: analyticStats.conceptsMastered, icon: Brain, color: 'text-copper-400', bg: 'bg-amber-400/10' },
          { label: 'Streak', value: `${analyticStats.currentStreak} days`, icon: Flame, color: 'text-terracotta-500', bg: 'bg-terracotta-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card text-center">
            <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-[10px] text-stone-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Learning DNA */}
      {portfolio?.learningDNA && (
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-copper-400" /> Learning DNA
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-medium text-stone-400 mb-2">Primary Style</h4>
              <span className="badge badge-blue text-xs">{portfolio.learningDNA.primaryStyle}</span>
              <h4 className="text-xs font-medium text-stone-400 mt-4 mb-2">Secondary Style</h4>
              <span className="badge badge-violet text-xs">{portfolio.learningDNA.secondaryStyle}</span>
            </div>
            <div>
              <h4 className="text-xs font-medium text-stone-400 mb-2">Strengths</h4>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {portfolio.learningDNA.strengths.map((s: string) => (
                  <span key={s} className="badge badge-emerald text-[10px]">{s}</span>
                ))}
              </div>
              <h4 className="text-xs font-medium text-stone-400 mb-2">Growth Areas</h4>
              <div className="flex flex-wrap gap-1.5">
                {portfolio.learningDNA.growthAreas.map((g: string) => (
                  <span key={g} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-copper-500/10 text-copper-400">{g}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-copper-400" /> Achievement Gallery
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(achievements || []).map((achievement: any) => (
            <div key={achievement.id} className={`p-4 rounded-xl border text-center transition-all ${
              achievement.isUnlocked
                ? 'bg-amber-500/5 border-amber-500/15'
                : 'bg-white/2 border-white/5 opacity-50'
            }`}>
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h4 className="text-xs font-semibold text-white">{achievement.name}</h4>
              <p className="text-[10px] text-stone-500 mt-1">{achievement.description}</p>
              {achievement.isUnlocked && achievement.unlockedAt && (
                <p className="text-[10px] text-sage-500 mt-1">Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}</p>
              )}
            </div>
          ))}
          {(!achievements || achievements.length === 0) && (
            <div className="col-span-4 py-8 text-center">
              <Trophy className="w-10 h-10 text-stone-600 mx-auto mb-3" />
              <p className="text-sm text-stone-500">Complete learning sessions to earn achievements!</p>
            </div>
          )}
        </div>
      </div>

      {/* Reflection Library */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-terracotta-500" /> Reflection Library
        </h2>
        {portfolio?.reflectionLibrary?.length ? (
          <div className="space-y-2">
            {portfolio.reflectionLibrary.map((entry: any) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                <div>
                  <h4 className="text-sm font-medium text-stone-200">{entry.sessionTitle}</h4>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{entry.content}</p>
                </div>
                <span className="text-xs text-stone-500 shrink-0 ml-4">{new Date(entry.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <BookOpen className="w-10 h-10 text-stone-600 mx-auto mb-3" />
            <p className="text-sm text-stone-500">Complete learning sessions to build your reflection library.</p>
          </div>
        )}
      </div>
    </div>
  );
}
