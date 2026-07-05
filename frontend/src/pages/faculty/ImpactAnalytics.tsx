import { Download, BarChart3, TrendingUp, Users, Sparkles, BookOpen, Target } from 'lucide-react';
import { useFacultyDashboard, useFacultyCourses, useFacultyImpact, useFacultyInsights } from '@/hooks/api/useFaculty';
import toast from 'react-hot-toast';

export default function ImpactAnalytics() {
  const { data: dashboard } = useFacultyDashboard();
  const { data: courses } = useFacultyCourses();
  const { data: impact } = useFacultyImpact();
  const { data: insights } = useFacultyInsights();

  const courseList = Array.isArray(courses) ? courses : [];
  const courseBreakdown = courseList.map((c: any) => ({
    name: c.name,
    students: c.studentCount || 0,
    authenticity: c.averageAuthenticity || 0,
    sessions: 0,
  }));

  const totalStudents = dashboard?.totalStudents ?? 0;
  const totalSessions = impact?.stats?.totalSessions ?? 0;
  const averageAuthenticity = dashboard?.averageAuthenticity ?? 0;
  const completionRate = impact?.stats?.completionRate ?? 0;

  const improvementRate = completionRate > 0 ? Math.round(completionRate * 100) : 0;
  const insightList = insights?.aiSuggestions || [];

  const handleExport = () => toast.success('Exporting analytics report...');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Impact Analytics</h1>
          <p className="text-sm text-stone-400">Comprehensive learning impact analysis across all your courses.</p>
        </div>
        <button onClick={handleExport} className="btn-secondary text-sm">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: totalStudents, icon: Users, color: 'text-coral-500', bg: 'bg-coral-500/10' },
          { label: 'Total Sessions', value: totalSessions, icon: BookOpen, color: 'text-sage-500', bg: 'bg-sage-500/10' },
          { label: 'Avg Authenticity', value: `${averageAuthenticity}%`, icon: TrendingUp, color: 'text-copper-400', bg: 'bg-amber-400/10' },
          { label: 'Completion Rate', value: `${improvementRate}%`, icon: Target, color: 'text-copper-400', bg: 'bg-copper-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
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

      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Course Performance Breakdown</h3>
        {courseBreakdown.length === 0 ? (
          <p className="text-sm text-stone-500 text-center py-6">No course data available. Create courses and complete sessions to see breakdown.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Course</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Students</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Avg Authenticity</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody>
                {courseBreakdown.map((course: any) => (
                  <tr key={course.name} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                    <td className="py-3 px-4 font-medium text-stone-200">{course.name}</td>
                    <td className="py-3 px-4 text-center text-stone-400">{course.students}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-semibold ${course.authenticity >= 80 ? 'text-sage-500' : 'text-copper-400'}`}>
                        {course.authenticity}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-coral-500 to-sage-500 rounded-full"
                            style={{ width: `${course.authenticity}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="glass-card p-6 border-amber-400/15">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-copper-400" /> AI Impact Insights
        </h3>
        {insightList.length === 0 ? (
          <p className="text-sm text-stone-500 text-center py-6">Complete more sessions to generate AI insights.</p>
        ) : (
          <div className="space-y-2">
            {insightList.map((insight: string, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-violet-500/5 border border-violet-500/10 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <p className="text-sm text-stone-300 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
