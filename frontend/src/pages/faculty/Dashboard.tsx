import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, AlertTriangle, Activity, ArrowRight, Sparkles, Shield, Award } from 'lucide-react';
import { useFacultyDashboard } from '@/hooks/api/useFaculty';
import ConceptHeatmap from '@/components/charts/ConceptHeatmap';
import { Link } from 'react-router-dom';

export default function FacultyDashboard() {
  const { data: dashboard, isLoading } = useFacultyDashboard();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-white/5 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16">
        <Users className="w-12 h-12 text-stone-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">No data available</h2>
        <p className="text-sm text-stone-400">No students or sessions found for your courses yet.</p>
      </div>
    );
  }

  const stats = [
    { label: 'Active Sessions', value: dashboard.activeSessions ?? 0, icon: Activity, color: 'text-sage-500', bg: 'bg-sage-500/10' },
    { label: 'Total Students', value: dashboard.totalStudents ?? 0, icon: Users, color: 'text-coral-500', bg: 'bg-coral-500/10' },
    { label: 'Avg Authenticity', value: `${Math.round(dashboard.averageAuthenticity ?? 0)}%`, icon: Shield, color: 'text-copper-400', bg: 'bg-amber-400/10' },
    { label: 'Student Confidence', value: `${Math.round(dashboard.studentConfidence ?? 0)}%`, icon: Award, color: 'text-copper-400', bg: 'bg-copper-500/10' },
  ];

  const recentActivity = dashboard.recentActivity || [];
  const interventions = dashboard.interventions || [];
  const conceptHeatmapData = dashboard.conceptHeatmap || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/20 via-cyan-600/15 to-lens-navy border border-white/5 p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sage-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            Classroom Learning Intelligence
          </h1>
          <p className="text-stone-400 max-w-lg">
            Monitor conceptual understanding, authenticity, and student journeys across your courses in real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-stone-500 mt-1">{stat.label}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Concept Heatmap */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Concept Heatmap</h2>
            <span className="text-xs text-stone-500">Class average scores</span>
          </div>
          {conceptHeatmapData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-stone-500">
              No concept data available yet
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <ConceptHeatmap data={conceptHeatmapData} />
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Recent Student Activity</h2>
          {recentActivity.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-sm text-stone-500">
              No activity recorded
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-white/2 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-sage-500/10 flex items-center justify-center text-sage-500 shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-200">{activity.description}</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {activity.studentName} • {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Interventions */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Active Interventions Required</h2>
          <Link to="/faculty/interventions" className="text-xs text-sage-500 hover:text-sage-400 flex items-center gap-1">
            View all planner <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {interventions.length === 0 ? (
          <div className="py-6 text-center text-sm text-stone-500">
            No active interventions needed
          </div>
        ) : (
          <div className="space-y-2">
            {interventions.map((intervention: any) => (
              <div key={intervention.id} className="flex items-center justify-between p-4 bg-white/2 border border-white/5 hover:border-white/10 transition-colors rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-stone-200">{intervention.title}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{intervention.targetStudents?.length || 0} students need support</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                  intervention.status === 'active' ? 'bg-copper-500/10 text-copper-400' : 'bg-stone-500/10 text-stone-400'
                } uppercase tracking-wider`}>
                  {intervention.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
