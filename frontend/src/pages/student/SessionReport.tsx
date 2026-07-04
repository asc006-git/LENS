import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, TrendingUp, ArrowRight, BookOpen, Lightbulb, Shield } from 'lucide-react';
import { useReport } from '@/hooks/api/useReport';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressRing from '@/components/ui/ProgressRing';
import ProgressBar from '@/components/ui/ProgressBar';
import ConceptMasteryChart from '@/components/charts/ConceptMasteryChart';
import ConfidenceTrendChart from '@/components/charts/ConfidenceTrendChart';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function SessionReport() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: report, isLoading } = useReport(sessionId!);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-100 rounded w-1/3" />
          <div className="h-48 bg-secondary-100 rounded-card" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-secondary-100 rounded-card" />
            <div className="h-64 bg-secondary-100 rounded-card" />
          </div>
        </div>
      </div>
    );
  }

  const conceptData = report?.conceptMastery?.byConcept
    ? Object.values(report.conceptMastery.byConcept).map((c: any) => ({
        concept: c.name,
        mastery: c.score,
        confidence: c.confidence,
      }))
    : [];

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/student/dashboard' },
        { label: 'Reports', to: '/student/reports' },
        { label: 'Learning Report', to: '#' },
      ]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Learning Authenticity Report</h1>
          <p className="text-secondary-500">Generated on {report?.generatedAt ? new Date(report.generatedAt).toLocaleDateString() : ''}</p>
        </div>
        <Button variant="secondary" leftIcon={<Download size={16} />}>Export PDF</Button>
      </div>

      {/* Authenticity Score */}
      <Card className="mb-8">
        <div className="flex items-center gap-8">
          <ProgressRing value={report?.authenticityScore || 0} size={140} color="#22C55E" label="Authenticity" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-secondary-900 mb-2">Your Learning Authenticity Score</h2>
            <p className="text-sm text-secondary-500 mb-4">
              This score measures the genuineness of your learning process based on concept mastery, confidence patterns, and engagement quality.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-secondary-50 rounded-card">
                <div className="text-xl font-bold text-secondary-900">{report?.conceptMastery?.overall || 0}%</div>
                <div className="text-xs text-secondary-500">Concept Mastery</div>
              </div>
              <div className="text-center p-3 bg-secondary-50 rounded-card">
                <div className="text-xl font-bold text-secondary-900">{report?.confidenceAnalysis?.overall || 0}%</div>
                <div className="text-xs text-secondary-500">Confidence</div>
              </div>
              <div className="text-center p-3 bg-secondary-50 rounded-card">
                <div className="text-xl font-bold text-primary-600">{report?.confidenceAnalysis?.trend || 'stable'}</div>
                <div className="text-xs text-secondary-500">Trend</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="font-semibold text-secondary-900 mb-4 flex items-center gap-2">
            <BookOpen size={16} />
            Concept Mastery
          </h3>
          <ConceptMasteryChart data={conceptData} />
        </Card>
        <Card>
          <h3 className="font-semibold text-secondary-900 mb-4 flex items-center gap-2">
            <TrendingUp size={16} />
            Confidence Trend
          </h3>
          <ConfidenceTrendChart data={report?.confidenceAnalysis?.dataPoints || []} />
        </Card>
      </div>

      {/* Strengths & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="font-semibold text-secondary-900 mb-4 flex items-center gap-2">
            <Shield size={16} />
            Strengths
          </h3>
          <ul className="space-y-2">
            {report?.strengths?.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-secondary-600">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="font-semibold text-secondary-900 mb-4 flex items-center gap-2">
            <Lightbulb size={16} />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {report?.recommendations?.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-secondary-600">
                <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mt-1.5 shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* AI Insights */}
      {report?.aiInsights && (
        <Card className="mb-8 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-100">
          <h3 className="font-semibold text-secondary-900 mb-2">AI Insights</h3>
          <p className="text-sm text-secondary-600">{report.aiInsights}</p>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Link to="/student/dashboard">
          <Button variant="ghost">Back to Dashboard</Button>
        </Link>
        <Link to={`/student/learning/${sessionId}/guided-learning`}>
          <Button rightIcon={<ArrowRight size={16} />}>Continue Learning</Button>
        </Link>
      </div>
    </div>
  );
}
