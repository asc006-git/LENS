import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, TrendingUp, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import { useStudentIntelligence } from '@/hooks/api/useFaculty';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressRing from '@/components/ui/ProgressRing';
import ProgressBar from '@/components/ui/ProgressBar';
import ConfidenceTrendChart from '@/components/charts/ConfidenceTrendChart';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function StudentIntelligence() {
  const { studentId } = useParams<{ studentId: string }>();
  const { data: student, isLoading } = useStudentIntelligence(studentId!);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-100 rounded w-1/3" />
          <div className="h-48 bg-secondary-100 rounded-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb items={[
        { label: 'Students', to: '/faculty/courses' },
        { label: student?.name || 'Student' },
      ]} />

      {/* Student Header */}
      <Card className="mb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
            {student?.name?.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-secondary-900">{student?.name}</h1>
            <p className="text-secondary-500">{student?.email}</p>
          </div>
          <div className="flex gap-4">
            <ProgressRing value={student?.learningAuthenticity || 0} size={80} label="Auth" />
            <ProgressRing value={student?.conceptMastery || 0} size={80} color="#3B82F6" label="Mastery" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Confidence Trend */}
        <Card>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} />
            Confidence Trend
          </h2>
          <ConfidenceTrendChart data={student?.confidenceTrend || []} />
        </Card>

        {/* Recent Sessions */}
        <Card>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
            <Clock size={18} />
            Recent Sessions
          </h2>
          <div className="space-y-3">
            {student?.recentSessions?.slice(0, 5).map((session: any) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-card">
                <div>
                  <h4 className="text-sm font-medium text-secondary-900">{session.title}</h4>
                  <p className="text-xs text-secondary-500">{new Date(session.completedAt).toLocaleDateString()}</p>
                </div>
                <Badge variant={session.authenticityScore >= 70 ? 'success' : session.authenticityScore >= 40 ? 'warning' : 'error'}>
                  {session.authenticityScore}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Concept Mastery */}
      <Card>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <BookOpen size={18} />
          Concept Mastery
        </h2>
        <div className="space-y-3">
          {student?.conceptMasteryList?.map((concept: any) => (
            <div key={concept.name}>
              <ProgressBar value={concept.score} label={concept.name} showLabel />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
