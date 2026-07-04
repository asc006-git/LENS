import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Breadcrumb from '@/components/layout/Breadcrumb';

const mockData = [
  {
    intervention: 'Concept Review Workshop',
    before: 45,
    after: 72,
    students: 12,
    startDate: '2026-01-15',
    endDate: '2026-02-15',
  },
  {
    intervention: 'Peer Learning Groups',
    before: 55,
    after: 68,
    students: 20,
    startDate: '2026-01-10',
    endDate: '2026-02-10',
  },
  {
    intervention: 'AI Tutor Sessions',
    before: 40,
    after: 65,
    students: 15,
    startDate: '2026-02-01',
    endDate: '2026-03-01',
  },
];

export default function ImpactAnalytics() {
  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Impact Analytics' }]} />

      <h1 className="text-2xl font-bold text-secondary-900 mb-2">Impact Analytics</h1>
      <p className="text-secondary-500 mb-8">Measure the effectiveness of your interventions.</p>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Interventions', value: '3', color: '#22C55E' },
          { label: 'Avg Improvement', value: '+22%', color: '#3B82F6' },
          { label: 'Students Helped', value: '47', color: '#8B5CF6' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="text-center">
              <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-secondary-500 mt-1">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Intervention Results */}
      <div className="space-y-6">
        {mockData.map((item, i) => {
          const improvement = item.after - item.before;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{item.intervention}</h3>
                    <p className="text-xs text-secondary-500">{item.students} students • {item.startDate} to {item.endDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {improvement > 0 ? (
                      <TrendingUp size={18} className="text-primary-500" />
                    ) : improvement < 0 ? (
                      <TrendingDown size={18} className="text-error-500" />
                    ) : (
                      <Minus size={18} className="text-secondary-400" />
                    )}
                    <span className={`text-lg font-bold ${improvement > 0 ? 'text-primary-600' : improvement < 0 ? 'text-error-500' : 'text-secondary-500'}`}>
                      {improvement > 0 ? '+' : ''}{improvement}%
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-secondary-500 mb-1">Before</p>
                    <ProgressBar value={item.before} color="#94A3B8" showLabel />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500 mb-1">After</p>
                    <ProgressBar value={item.after} color="#22C55E" showLabel />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
