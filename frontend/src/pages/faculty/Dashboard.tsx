import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, AlertTriangle, Activity, ArrowRight } from 'lucide-react';
import { useFacultyDashboard } from '@/hooks/api/useFaculty';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ConceptHeatmap from '@/components/charts/ConceptHeatmap';
import Breadcrumb from '@/components/layout/Breadcrumb';

interface ActivityItem {
  id: string;
  description: string;
  studentName: string;
  timestamp: string;
}

interface InterventionItem {
  id: string;
  title: string;
  status: string;
  targetStudents: { id: string }[];
}

export default function FacultyDashboard() {
  const { data: dashboard, isLoading } = useFacultyDashboard();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-100 rounded w-1/3" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-secondary-100 rounded-[20px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Active Sessions', value: dashboard?.activeSessions || 0, icon: Activity, color: '#22C55E' },
    { label: 'Total Students', value: dashboard?.totalStudents || 0, icon: Users, color: '#3B82F6' },
    { label: 'Avg Authenticity', value: `${Math.round(dashboard?.averageAuthenticity || 0)}%`, icon: TrendingUp, color: '#8B5CF6' },
    { label: 'Student Confidence', value: `${Math.round(dashboard?.studentConfidence || 0)}%`, icon: BookOpen, color: '#F59E0B' },
  ];

  const recentActivity: ActivityItem[] = dashboard?.recentActivity || [];
  const interventions: InterventionItem[] = dashboard?.interventions || [];

  return (
    <div className="max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: 'Faculty Dashboard' }]} />

      <h1 className="text-2xl font-bold text-secondary-900 mb-8">Faculty Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon size={22} style={{ color: stat.color }} />
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary-900">{stat.value}</div>
                <div className="text-xs text-secondary-500">{stat.label}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Concept Heatmap */}
        <Card>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Concept Heatmap</h2>
          <ConceptHeatmap data={dashboard?.conceptHeatmap || []} />
        </Card>

        {/* Recent Activity */}
        <Card>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-secondary-50 rounded-[16px]">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                  <Activity size={14} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-secondary-900">{activity.description}</p>
                  <p className="text-xs text-secondary-500 mt-0.5">{activity.studentName} • {new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-sm text-secondary-400 text-center py-4">No recent activity</p>
            )}
          </div>
        </Card>
      </div>

      {/* Interventions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Active Interventions</h2>
          <a href="/faculty/interventions" className="text-sm text-emerald-600 font-medium flex items-center gap-1 hover:text-emerald-700">
            View all <ArrowRight size={14} />
          </a>
        </div>
        <div className="space-y-3">
          {interventions.filter((item) => item.status === 'active').slice(0, 3).map((intervention) => (
            <div key={intervention.id} className="flex items-center justify-between p-4 border border-secondary-100 rounded-[16px]">
              <div className="flex items-center gap-3">
                <AlertTriangle size={16} className="text-amber-500" />
                <div>
                  <h4 className="text-sm font-medium text-secondary-900">{intervention.title}</h4>
                  <p className="text-xs text-secondary-500">{intervention.targetStudents.length} students targeted</p>
                </div>
              </div>
              <Badge variant="warning">{intervention.status}</Badge>
            </div>
          ))}
          {interventions.filter((item) => item.status === 'active').length === 0 && (
            <p className="text-sm text-secondary-400 text-center py-4">No active interventions</p>
          )}
        </div>
      </Card>
    </div>
  );
}
