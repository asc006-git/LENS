import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/api/useDashboard';
import { useLearningSessions } from '@/hooks/api/useLearningSession';
import {
  ArrowRight, BookOpen, Brain, Target, TrendingUp, Zap, Clock,
  CheckCircle2, Play, Flame, Award, BarChart3, Sparkles, ChevronRight, FileText
} from 'lucide-react';

const quickActions = [
  { label: 'New Session', icon: BookOpen, to: '/student/learning/new', color: 'from-coral-500 to-teal-500' },
  { label: 'View Portfolio', icon: TrendingUp, to: '/student/portfolio', color: 'from-sage-500 to-teal-500' },
  { label: 'Session Reports', icon: FileText, to: '/student/reports', color: 'from-copper-500 to-copper-400' },
  { label: 'AI Mentor', icon: Zap, to: '/student/mentor', color: 'from-amber-400 to-amber-400' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: dashboard, isLoading: dashLoading } = useDashboard();
  const { data: sessions, isLoading: sessionsLoading } = useLearningSessions();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  if (dashLoading || sessionsLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = dashboard?.metrics;
  const recentSessions = sessions?.slice(0, 3) || [];
  const recommendations = dashboard?.recommendations || [];
  const hasActiveSession = sessions?.some(s => s.status !== 'completed' && s.status !== 'failed');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-coral-600/20 via-violet-600/15 to-lens-navy border border-white/5 p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-coral-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            {greeting}, {user?.firstName || 'Learner'}
          </h1>
          <p className="text-stone-400 max-w-lg">
            Your learning journey continues. Keep building authentic understanding — every session makes you stronger.
          </p>
        </div>
      </div>

      {/* Continue Session / Start New */}
      {hasActiveSession && sessions ? (
        (() => {
          const activeSession = sessions.find(s => s.status !== 'completed' && s.status !== 'failed');
          if (!activeSession) return null;
          const sessionId = activeSession.id;
          return (
            <div className="premium-card border-coral-500/20 animate-pulse-glow cursor-pointer" onClick={() => navigate(`/student/learning/${sessionId}/analysis`)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-coral-500/15 flex items-center justify-center">
                    <Play className="w-6 h-6 text-coral-500" />
                  </div>
                  <div>
                    <p className="text-xs text-coral-500 font-medium mb-0.5">Continue Previous Session</p>
                    <h3 className="text-base font-semibold text-white">
                      {activeSession.title || 'Active Session'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Stage: {activeSession.status}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-coral-500" />
              </div>
            </div>
          );
        })()
      ) : (
        <Link to="/student/learning/new" className="premium-card border-coral-500/20 hover:border-coral-500/40 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-500 to-amber-400 flex items-center justify-center shadow-glow-blue group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Start New Learning Session</h3>
              <p className="text-sm text-stone-500">Begin a structured AI-guided learning experience</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-500 group-hover:text-coral-500 transition-colors" />
        </Link>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics ? (
          <>
            <MetricCard label="Learning Authenticity" value={`${Math.round(metrics.learningAuthenticity)}%`} icon={Target} color="text-sage-500" bg="bg-sage-500/10" />
            <MetricCard label="Concept Mastery" value={`${Math.round(metrics.conceptMastery)}%`} icon={Brain} color="text-coral-500" bg="bg-coral-500/10" />
            <MetricCard label="Confidence Index" value={`${Math.round(metrics.confidenceIndex)}%`} icon={TrendingUp} color="text-copper-400" bg="bg-amber-400/10" />
            <MetricCard label="AI Learning Balance" value={`${Math.round(metrics.aiLearningBalance)}/100`} icon={Zap} color="text-copper-400" bg="bg-copper-500/10" />
            <MetricCard label="Weekly Progress" value={`+${Math.round(metrics.weeklyProgress)}%`} icon={BarChart3} color="text-teal-400" bg="bg-teal-500/10" />
            <MetricCard label="Learning Streak" value={`${metrics.learningStreak} days`} icon={Flame} color="text-terracotta-500" bg="bg-terracotta-500/10" />
          </>
        ) : (
          <div className="col-span-6 text-center py-8 text-stone-500 text-sm">
            No session data yet — complete your first session to see metrics.
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map(({ label, icon: Icon, to, color }) => (
          <Link key={label} to={to} className="glass-card p-4 flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-stone-300 group-hover:text-white transition-colors">{label}</span>
          </Link>
        ))}
      </div>

      {/* Two-column: Recent Sessions + AI Recommendations */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Recent Learning Sessions</h2>
            <Link to="/student/reports" className="text-xs text-coral-500 hover:text-coral-400 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {recentSessions.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <p className="text-sm text-stone-500">No sessions yet — start your first learning session</p>
              <Link to="/student/learning/new" className="btn-primary text-xs mt-3 inline-block">Start Now</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentSessions.map((session: any) => (
                <div key={session.id || session._id} className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:border-white/15"
                  onClick={() => navigate(`/student/learning/${session.id || session._id}`)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${session.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-stone-200">{session.title || 'Untitled Session'}</p>
                      <p className="text-xs text-stone-500">
                        {new Date(session.updatedAt || session.createdAt).toLocaleDateString()} • {session.status}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-coral-500 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Mentor Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-copper-400" />
            <h2 className="text-base font-semibold text-white">AI Recommendations</h2>
          </div>
          {recommendations.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <p className="text-sm text-stone-500">No recommendations yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recommendations.map((rec: any, i: number) => (
                <div key={i} className="glass-card p-4 group cursor-pointer hover:border-white/15">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      rec.priority === 'high' ? 'bg-rose-400' : rec.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                    <p className="text-sm text-stone-300 leading-relaxed">{rec.text || rec.description || rec.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, bg }: { label: string; value: string; icon: any; color: string; bg: string }) {
  return (
    <div className="stat-card group">
      <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[11px] text-stone-500 mt-0.5">{label}</p>
    </div>
  );
}
