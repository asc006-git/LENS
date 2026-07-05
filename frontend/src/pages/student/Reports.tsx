import { Link } from 'react-router-dom';
import { FileText, ChevronRight, Calendar, Target, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { useAllReports } from '@/hooks/api/useReport';

export default function Reports() {
  const { data: reports, isLoading } = useAllReports();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <Loader2 className="w-8 h-8 text-coral-500 mx-auto animate-spin mb-4" />
        <p className="text-stone-400">Loading reports...</p>
      </div>
    );
  }

  const reportList = Array.isArray(reports) ? reports : [];

  if (reportList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-coral-500/10 border border-coral-500/20 mb-2">
            <FileText className="w-3.5 h-3.5 text-coral-500" />
            <span className="text-xs font-medium text-coral-400">Learning Reports</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Your Learning Reports</h1>
          <p className="text-sm text-stone-400">View detailed reports from all your completed learning sessions.</p>
        </div>
        <div className="glass-card p-12 text-center">
          <AlertCircle className="w-12 h-12 text-stone-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">No reports yet</h2>
          <p className="text-sm text-stone-400 mb-4">Complete a learning session to generate your first report.</p>
          <Link to="/student/learning/new" className="btn-primary text-sm">Start Learning Session</Link>
        </div>
      </div>
    );
  }

  const avgAuthenticity = Math.round(reportList.reduce((sum: number, r: any) => sum + (r.authenticityScore || 0), 0) / reportList.length);
  const avgMastery = Math.round(reportList.reduce((sum: number, r: any) => sum + (r.conceptMastery?.overall || 0), 0) / reportList.length);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-coral-500/10 border border-coral-500/20 mb-2">
          <FileText className="w-3.5 h-3.5 text-coral-500" />
          <span className="text-xs font-medium text-coral-400">Learning Reports</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Your Learning Reports</h1>
        <p className="text-sm text-stone-400">View detailed reports from all your completed learning sessions.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card text-center">
          <FileText className="w-6 h-6 text-coral-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-white">{reportList.length}</p>
          <p className="text-[10px] text-stone-500">Total Reports</p>
        </div>
        <div className="stat-card text-center">
          <TrendingUp className="w-6 h-6 text-sage-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-white">{avgAuthenticity}%</p>
          <p className="text-[10px] text-stone-500">Avg Authenticity</p>
        </div>
        <div className="stat-card text-center">
          <Target className="w-6 h-6 text-copper-400 mx-auto mb-2" />
          <p className="text-xl font-bold text-white">{avgMastery}%</p>
          <p className="text-[10px] text-stone-500">Avg Mastery</p>
        </div>
      </div>

      <div className="space-y-2">
        {reportList.map((report: any) => {
          const sessionId = report.sessionId || report.id;
          const title = report.title || `Session ${sessionId?.slice(-6) || ''}`;
          const date = report.generatedAt || report.createdAt;
          const authenticity = report.authenticityScore || 0;
          const mastery = report.conceptMastery?.overall || 0;

          return (
            <Link key={report.id || report._id} to={`/student/learning/${sessionId}/report`}
              className="glass-card p-4 flex items-center justify-between group hover:border-white/15 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${authenticity >= 80 ? 'bg-emerald-400' : authenticity >= 60 ? 'bg-amber-400' : 'bg-rose-400'}`} />
                <div>
                  <p className="text-sm font-medium text-stone-200 group-hover:text-white transition-colors">{title}</p>
                  {date && (
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{authenticity}%</p>
                  <p className="text-[10px] text-stone-500">Authenticity</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-coral-500">{mastery}%</p>
                  <p className="text-[10px] text-stone-500">Mastery</p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-coral-500 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
