import { BarChart3, TrendingUp, Users, Brain, Sparkles, BookOpen, Target } from 'lucide-react';
import { useFacultyInsights } from '@/hooks/api/useFaculty';
import WeeklyProgressChart from '@/components/charts/WeeklyProgressChart';
import LearningBalanceChart from '@/components/charts/LearningBalanceChart';

export default function TeachingInsights() {
  const { data: insights, isLoading } = useFacultyInsights();

  const stats = [
    { label: 'Class Avg Authenticity', value: insights ? `${insights.classAverageAuthenticity ?? 0}%` : '-', icon: TrendingUp, color: 'text-sage-500', bg: 'bg-sage-500/10' },
    { label: 'Class Avg Confidence', value: insights ? `${insights.classAverageConfidence ?? 0}%` : '-', icon: Brain, color: 'text-coral-500', bg: 'bg-coral-500/10' },
    { label: 'Active Sessions', value: insights?.totalActiveSessions ?? 0, icon: BookOpen, color: 'text-copper-400', bg: 'bg-amber-400/10' },
    { label: 'Concepts Covered', value: insights?.conceptCoverage ?? 0, icon: Target, color: 'text-copper-400', bg: 'bg-copper-500/10' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Teaching Insights</h1>
        <p className="text-sm text-stone-400">AI-powered analysis of your teaching effectiveness and student learning patterns.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="text-xs text-stone-500 mt-1">{label}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-coral-500" /> Weekly Class Progress
              </h3>
              <div className="h-64 flex items-center justify-center">
                <WeeklyProgressChart data={[]} />
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-copper-400" /> Learning Balance
              </h3>
              <div className="h-64 flex items-center justify-center">
                <LearningBalanceChart data={[]} />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-sage-500 mb-4">Class Strengths</h3>
              {(!insights?.topStrengths || insights.topStrengths.length === 0) ? (
                <p className="text-sm text-stone-500 text-center py-6">No strength data available yet</p>
              ) : (
                <div className="space-y-2">
                  {insights.topStrengths.map((s: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-sage-500/20 text-sage-500 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                      <span className="text-sm text-stone-200">{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-copper-400 mb-4">Areas Needing Attention</h3>
              {(!insights?.topWeaknesses || insights.topWeaknesses.length === 0) ? (
                <p className="text-sm text-stone-500 text-center py-6">No weakness data available yet</p>
              ) : (
                <div className="space-y-2">
                  {insights.topWeaknesses.map((w: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 text-copper-400 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                      <span className="text-sm text-stone-200">{w}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6 border-amber-400/15">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-copper-400" /> AI Teaching Suggestions
            </h3>
            {(!insights?.aiSuggestions || insights.aiSuggestions.length === 0) ? (
              <p className="text-sm text-stone-500 text-center py-6">Complete more sessions to get AI-powered suggestions.</p>
            ) : (
              <div className="space-y-3">
                {insights.aiSuggestions.map((suggestion: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-violet-500/5 border border-violet-500/10 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                    <p className="text-sm text-stone-300 leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
