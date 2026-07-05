import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Calendar, BookOpen, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';

export default function ReflectionNotebook() {
  const [reflections, setReflections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        const { data: res } = await apiClient.get('/api/v1/reflection');
        setReflections(res.data || []);
      } catch (err: any) {
        toast.error('Failed to load reflection logs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReflections();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="h-32 bg-white/5 rounded-2xl" />
          <div className="h-32 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-terracotta-500/10 border border-rose-500/20 mb-2">
          <PenTool className="w-3.5 h-3.5 text-terracotta-500" />
          <span className="text-xs font-medium text-rose-300">Journal & Notes</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Reflection Notebook</h1>
        <p className="text-sm text-stone-400">Review all your conceptual reflections and personal notes from completed sessions.</p>
      </div>

      {reflections.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <PenTool className="w-12 h-12 text-stone-600 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-white mb-1">No Reflections Yet</h3>
          <p className="text-sm text-stone-400 max-w-sm mx-auto mb-6">
            Reflections are automatically created at the end of each learning session to help consolidate your understanding.
          </p>
          <Link to="/student/learning/new" className="btn-primary">
            Start a Session
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reflections.map((ref: any) => (
            <div key={ref._id} className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/10 transition-all">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge badge-blue text-[10px]">{ref.course?.name || 'Computer Science'}</span>
                  <span className="badge badge-emerald text-[10px]">{ref.assignment?.title || 'Assignment'}</span>
                </div>
                <h3 className="text-base font-semibold text-white">
                  {ref.blueprint?.concepts?.map((c: any) => c.name).join(', ') || 'Reflection Logs'}
                </h3>
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(ref.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {ref.reflection?.sections?.length || 4} sections
                  </span>
                </div>
              </div>
              <Link to={`/student/learning/${ref._id}/reflection`} className="btn-secondary !py-2 !px-4 text-xs font-semibold flex items-center gap-1 group">
                Open Notebook
                <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-coral-500 transition-colors" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Info Notice */}
      <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-copper-400 shrink-0 mt-0.5" />
        <p className="text-xs text-stone-400 leading-relaxed">
          Reflecting on what you learned and what challenged you helps consolidate short-term practice into long-term conceptual mastery.
        </p>
      </div>
    </div>
  );
}
