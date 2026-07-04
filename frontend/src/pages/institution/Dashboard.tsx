import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, GraduationCap, BarChart3, Activity } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Breadcrumb from '@/components/layout/Breadcrumb';

const mockData = {
  overview: {
    totalStudents: 1250,
    totalFaculty: 45,
    activeCourses: 28,
    averageAuthenticity: 67,
    totalSessions: 3420,
  },
  departments: [
    { name: 'Computer Science', students: 320, authenticity: 72, trend: 'improving' as const },
    { name: 'Mathematics', students: 280, authenticity: 65, trend: 'stable' as const },
    { name: 'Physics', students: 210, authenticity: 58, trend: 'declining' as const },
    { name: 'Engineering', students: 440, authenticity: 71, trend: 'improving' as const },
  ],
  facultyEngagement: [
    { name: 'Dr. Smith', department: 'CS', courses: 4, satisfaction: 4.8 },
    { name: 'Prof. Johnson', department: 'Math', courses: 3, satisfaction: 4.5 },
    { name: 'Dr. Williams', department: 'Physics', courses: 3, satisfaction: 4.2 },
    { name: 'Prof. Brown', department: 'Engineering', courses: 5, satisfaction: 4.7 },
  ],
};

export default function InstitutionDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <Breadcrumb items={[{ label: 'Institution Dashboard' }]} />

      <h1 className="text-2xl font-bold text-secondary-900 mb-8">Institution Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Students', value: mockData.overview.totalStudents, icon: Users, color: '#22C55E' },
          { label: 'Faculty', value: mockData.overview.totalFaculty, icon: GraduationCap, color: '#3B82F6' },
          { label: 'Active Courses', value: mockData.overview.activeCourses, icon: BookOpen, color: '#8B5CF6' },
          { label: 'Avg Authenticity', value: `${mockData.overview.averageAuthenticity}%`, icon: TrendingUp, color: '#F59E0B' },
          { label: 'Total Sessions', value: mockData.overview.totalSessions, icon: Activity, color: '#10B981' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="text-center">
              <stat.icon size={20} className="mx-auto mb-2" style={{ color: stat.color }} />
              <div className="text-2xl font-bold text-secondary-900">{stat.value}</div>
              <div className="text-xs text-secondary-500 mt-1">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Performance */}
        <Card>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Department Performance</h2>
          <div className="space-y-4">
            {mockData.departments.map((dept) => (
              <div key={dept.name} className="p-4 bg-secondary-50 rounded-card">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900">{dept.name}</h4>
                    <p className="text-xs text-secondary-500">{dept.students} students</p>
                  </div>
                  <Badge variant={dept.trend === 'improving' ? 'success' : dept.trend === 'declining' ? 'error' : 'default'}>
                    {dept.trend}
                  </Badge>
                </div>
                <ProgressBar value={dept.authenticity} label="Authenticity" showLabel />
              </div>
            ))}
          </div>
        </Card>

        {/* Faculty Engagement */}
        <Card>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Faculty Engagement</h2>
          <div className="space-y-3">
            {mockData.facultyEngagement.map((faculty) => (
              <div key={faculty.name} className="flex items-center justify-between p-4 border border-secondary-100 rounded-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
                    {faculty.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900">{faculty.name}</h4>
                    <p className="text-xs text-secondary-500">{faculty.department} • {faculty.courses} courses</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-secondary-900">{faculty.satisfaction}</div>
                  <div className="text-xs text-secondary-400">Satisfaction</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Learning Trends */}
      <Card>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Learning Trends</h2>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center">
              <div className="text-xs text-secondary-500 mb-2">{day}</div>
              <div className="space-y-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 rounded-sm"
                    style={{
                      backgroundColor: `rgba(34, 197, 94, ${Math.random() * 0.8 + 0.2})`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
