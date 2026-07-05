import { useParams, Link } from 'react-router-dom';
import { User, Brain, TrendingUp, Target, BarChart3, BookOpen, Clock, Award, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { useStudentIntelligence } from '@/hooks/api/useFaculty';

export default function StudentIntelligence() {
  const { studentId } = useParams<{ studentId: string }>();
  const { data: student } = useStudentIntelligence(studentId!);

  const mockStudent = student || {
    name: 'Aarav Mehta',
    email: 'aarav@university.edu',
    department: 'Computer Science',
    stats: {
      totalSessions: 12,
      completedSessions: 10,
      averageAuthenticity: 82,
      averageConfidence: 75,
      totalStudyTime: 420,
      streak: 5,
    },
    strengths: ['Binary Search Trees', 'Sorting Algorithms', 'Time Complexity'],
    weaknesses: ['AVL Rotations', 'Graph Traversal'],
    recentSessions: [
      { id: '1', title: 'BST Rotations', score: 72, date: '2 days ago' },
      { id: '2', title: 'Process Scheduling', score: 88, date: '5 days ago' },
      { id: '3', title: 'Linear Regression', score: 91, date: '1 week ago' },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link to="/faculty/dashboard" className="text-xs text-coral-500 hover:text-coral-400 mb-2 inline-block">← Back to Dashboard</Link>
        <div className="flex items-center gap-4 mt-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-coral-500 to-amber-400 flex items-center justify-center text-white text-xl font-bold">
            {mockStudent.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{mockStudent.name}</h1>
            <p className="text-sm text-stone-400">{mockStudent.email} • {mockStudent.department}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Sessions', value: mockStudent.stats.totalSessions, icon: BookOpen, color: 'text-coral-500', bg: 'bg-coral-500/10' },
          { label: 'Completed', value: mockStudent.stats.completedSessions, icon: Target, color: 'text-sage-500', bg: 'bg-sage-500/10' },
          { label: 'Authenticity', value: `${mockStudent.stats.averageAuthenticity}%`, icon: TrendingUp, color: 'text-copper-400', bg: 'bg-amber-400/10' },
          { label: 'Confidence', value: `${mockStudent.stats.averageConfidence}%`, icon: Brain, color: 'text-copper-400', bg: 'bg-copper-500/10' },
          { label: 'Study Time', value: `${Math.round(mockStudent.stats.totalStudyTime / 60)}h`, icon: Clock, color: 'text-teal-400', bg: 'bg-teal-500/10' },
          { label: 'Streak', value: `${mockStudent.stats.streak}d`, icon: Award, color: 'text-terracotta-500', bg: 'bg-terracotta-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-lg font-bold text-white">{value}</p>
            <p className="text-[10px] text-stone-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Strengths & Weaknesses */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-sage-500 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Conceptual Strengths
          </h3>
          <div className="space-y-2 mb-5">
            {mockStudent.strengths.map((s: string) => (
              <div key={s} className="flex items-center gap-2 text-sm text-stone-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {s}
              </div>
            ))}
          </div>
          <h3 className="text-sm font-semibold text-copper-400 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Growth Areas
          </h3>
          <div className="space-y-2">
            {mockStudent.weaknesses.map((w: string) => (
              <div key={w} className="flex items-center gap-2 text-sm text-stone-300">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {w}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Sessions</h3>
          <div className="space-y-2">
            {mockStudent.recentSessions.map((session: any) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-white/2 border border-white/5 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-stone-200">{session.title}</p>
                  <p className="text-xs text-stone-500">{session.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{session.score}%</p>
                  <p className="text-[10px] text-stone-500">Authenticity</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="glass-card p-5 border-amber-400/15">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-copper-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">AI Teaching Insight</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              {mockStudent.name} shows strong foundational understanding but struggles with advanced self-balancing tree concepts. 
              Consider providing visual demonstrations for AVL rotations and assigning incremental practice exercises.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
