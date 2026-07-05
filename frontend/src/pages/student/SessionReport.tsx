import { useParams, Link } from 'react-router-dom';
import { Download, TrendingUp, ArrowRight, Lightbulb, Shield, Award, Brain, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { useReport } from '@/hooks/api/useReport';
import ConceptMasteryChart from '@/components/charts/ConceptMasteryChart';
import ConfidenceTrendChart from '@/components/charts/ConfidenceTrendChart';
import { useLearningSession } from '@/hooks/api/useLearningSession';
import toast from 'react-hot-toast';

export default function SessionReport() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: report, isLoading, error } = useReport(sessionId!);
  const { data: session } = useLearningSession(sessionId!);

  const handleExport = () => {
    toast.success('Report export coming soon');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="h-48 bg-white/5 rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-white/5 rounded-2xl" />
            <div className="h-64 bg-white/5 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <AlertCircle className="w-12 h-12 text-stone-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Report not available</h2>
        <p className="text-sm text-stone-400 mb-4">This session may still be in progress, or the report hasn't been generated yet.</p>
        <Link to="/student/dashboard" className="btn-primary text-sm">Back to Dashboard</Link>
      </div>
    );
  }

  const conceptData = report.conceptMastery?.byConcept
    ? Object.entries(report.conceptMastery.byConcept).map(([_, c]: any) => ({
        concept: c.name,
        mastery: c.score,
        confidence: c.confidence,
      }))
    : [];

  const chartDataPoints = report.confidenceAnalysis?.dataPoints || [];
  const authenticityScore = report.authenticityScore || 0;
  const overallMastery = report.conceptMastery?.overall || 0;
  const overallConfidence = report.confidenceAnalysis?.overall || 0;
  const trend = report.confidenceAnalysis?.trend || 'stable';
  const strengths = report.strengths || [];
  const recommendations = report.recommendations || [];
  const aiInsights = report.aiInsights || '';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-500/10 border border-sage-500/20 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage-500" />
            <span className="text-xs font-medium text-sage-400">Learning Authenticity Report</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{session?.title || 'Session Learning Report'}</h1>
          <p className="text-xs text-stone-500">
            Generated on {report.generatedAt ? new Date(report.generatedAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        <button onClick={handleExport} className="btn-secondary !py-2.5 !px-5 text-sm">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      {/* Authenticity Score Banner */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="72" cy="72" r="60" className="stroke-white/5" strokeWidth="10" fill="transparent" />
            {authenticityScore > 0 && (
              <circle cx="72" cy="72" r="60" className="stroke-emerald-500 progress-ring-circle" strokeWidth="10" fill="transparent"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - authenticityScore / 100)}`}
                strokeLinecap="round" />
            )}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-extrabold text-white">{authenticityScore}%</span>
            <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Authenticity</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Your Learning Authenticity Score</h2>
            <p className="text-sm text-stone-400 leading-relaxed">
              This score measures the genuineness of your learning process based on your responses, confidence patterns, and engagement quality during validation.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white/2 rounded-xl border border-white/5 text-center">
              <p className="text-lg font-bold text-white">{overallMastery}%</p>
              <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Mastery</p>
            </div>
            <div className="p-3 bg-white/2 rounded-xl border border-white/5 text-center">
              <p className="text-lg font-bold text-white">{overallConfidence}%</p>
              <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Confidence</p>
            </div>
            <div className="p-3 bg-white/2 rounded-xl border border-white/5 text-center">
              <p className="text-lg font-bold text-sage-500 capitalize">{trend}</p>
              <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Trend</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {conceptData.length > 0 && chartDataPoints.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-coral-500" /> Concept Mastery Breakdown
            </h3>
            <div className="h-64 flex items-center justify-center">
              <ConceptMasteryChart data={conceptData} />
            </div>
          </div>
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-copper-400" /> Confidence Trend
            </h3>
            <div className="h-64 flex items-center justify-center">
              <ConfidenceTrendChart data={chartDataPoints} />
            </div>
          </div>
        </div>
      )}

      {/* Strengths & Recommendations */}
      {(strengths.length > 0 || recommendations.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-6">
          {strengths.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-sage-500 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Conceptual Strengths
              </h3>
              <ul className="space-y-3">
                {strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-stone-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recommendations.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-coral-500 mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> AI Recommendations
              </h3>
              <ul className="space-y-3">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-stone-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-coral-400 shrink-0 mt-2" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* AI Insights Summary */}
      {aiInsights && (
        <div className="glass-card p-6 border-amber-400/15 bg-gradient-to-br from-amber-400/5 to-transparent">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 flex items-center justify-center text-copper-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">AI Teacher Insights</h3>
              <p className="text-sm text-stone-300 leading-relaxed">{aiInsights}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Actions */}
      <div className="flex justify-between items-center">
        <Link to="/student/dashboard" className="btn-secondary !py-2.5 !px-5 text-sm">
          Workspace Hub
        </Link>
        {(session?.status === 'report_generated' || session?.status === 'completed') && (
          <Link to={`/student/learning/${sessionId}/guided-learning`} className="btn-primary !py-2.5 !px-5 text-sm">
            Continue to Guided Learning <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
