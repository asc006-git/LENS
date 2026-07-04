import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { useFacultyInsights } from '@/hooks/api/useFaculty';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function TeachingInsights() {
  const { data: insights, isLoading } = useFacultyInsights();

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
      <Breadcrumb items={[{ label: 'Teaching Insights' }]} />

      <h1 className="text-2xl font-bold text-secondary-900 mb-2">Teaching Insights</h1>
      <p className="text-secondary-500 mb-8">AI-powered recommendations for your teaching.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'At-Risk Students', value: insights?.atRiskCount || 0, icon: AlertTriangle, color: '#EF4444' },
          { label: 'High Performers', value: insights?.highPerformers || 0, icon: TrendingUp, color: '#22C55E' },
          { label: 'Intervention Success', value: `${Math.round(insights?.interventionSuccess || 0)}%`, icon: Users, color: '#3B82F6' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="text-center">
              <stat.icon size={24} className="mx-auto mb-2" style={{ color: stat.color }} />
              <div className="text-2xl font-bold text-secondary-900">{stat.value}</div>
              <div className="text-xs text-secondary-500 mt-1">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Recommendations */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <Lightbulb size={18} className="text-warning-500" />
          AI Teaching Recommendations
        </h2>
        <div className="space-y-3">
          {insights?.recommendations?.map((rec: any, i: number) => (
            <div key={i} className="p-4 bg-secondary-50 rounded-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-secondary-900">{rec.title}</h4>
                  <p className="text-xs text-secondary-500 mt-1">{rec.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'default'}>
                      {rec.priority} priority
                    </Badge>
                    <span className="text-xs text-secondary-400">{rec.targetStudents} students affected</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
                  Act
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Intervention Planning */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Plan Intervention</h2>
        </div>
        <p className="text-sm text-secondary-500 mb-4">Create targeted interventions for students who need extra support.</p>
        <Button leftIcon={<Lightbulb size={16} />}>Create New Intervention</Button>
      </Card>
    </div>
  );
}
