import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, Filter, Search } from 'lucide-react';
import { useAllReports } from '@/hooks/api/useReport';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { useState } from 'react';

export default function Reports() {
  const { data: reports, isLoading } = useAllReports();
  const [search, setSearch] = useState('');

  const filtered = reports?.filter((r) =>
    r.sessionId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Reports' }]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Learning Reports</h1>
          <p className="text-secondary-500">All your learning authenticity reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports..."
              className="pl-9 pr-4 py-2 border border-secondary-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-secondary-100 rounded-card animate-pulse" />
          ))}
        </div>
      ) : filtered?.length ? (
        <div className="space-y-3">
          {filtered.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/student/learning/${report.sessionId}/report`}>
                <Card hover className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                      <FileText size={18} className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-secondary-900">Report #{i + 1}</h4>
                      <p className="text-xs text-secondary-500">Session: {report.sessionId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={report.authenticityScore >= 70 ? 'success' : report.authenticityScore >= 40 ? 'warning' : 'error'}>
                      {report.authenticityScore}% authenticity
                    </Badge>
                    <span className="text-xs text-secondary-400">{new Date(report.generatedAt).toLocaleDateString()}</span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No reports yet"
          description="Complete learning sessions to generate your first authenticity report."
          action={<Link to="/student/learning/new" className="text-sm text-primary-600 font-medium">Start a session</Link>}
        />
      )}
    </div>
  );
}
