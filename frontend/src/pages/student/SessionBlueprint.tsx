import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Target, Brain, Clock, BarChart3, CheckCircle2, Edit3, RefreshCw, ArrowRight, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useLearningSession } from '@/hooks/api/useLearningSession';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';

export default function SessionBlueprint() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { data: session, isLoading, isError, refetch } = useLearningSession(sessionId!);
  const [confirming, setConfirming] = useState(false);
  const [polls, setPolls] = useState(0);

  useEffect(() => {
    if (!sessionId) return;
    if (session?.status === 'blueprint_generated' || session?.status === 'blueprint_confirmed') return;
    const interval = setInterval(() => {
      refetch();
      setPolls(p => p + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [sessionId, session?.status, refetch]);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await apiClient.put(`/api/v1/learning-sessions/${sessionId}/blueprint/confirm`, { confirmed: true });
      toast.success('Blueprint confirmed! Starting validation...');
      navigate(`/student/learning/${sessionId}/validation`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to confirm blueprint');
    } finally {
      setConfirming(false);
    }
  };

  if (isLoading && !session) {
    return (
      <div className="max-w-5xl mx-auto text-center py-16">
        <Loader2 className="w-8 h-8 text-coral-500 mx-auto animate-spin mb-4" />
        <p className="text-stone-400">Loading blueprint...</p>
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="max-w-5xl mx-auto text-center py-16">
        <AlertCircle className="w-12 h-12 text-terracotta-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Could not load blueprint</h2>
        <button onClick={() => navigate('/student/dashboard')} className="btn-primary text-sm">Back to Dashboard</button>
      </div>
    );
  }

  const blueprint = session.blueprint;
  if (!blueprint || !blueprint.concepts || blueprint.concepts.length === 0) {
    return (
      <div className="max-w-5xl mx-auto text-center py-16">
        <Loader2 className="w-8 h-8 text-coral-500 mx-auto animate-spin mb-4" />
        <p className="text-stone-400">Blueprint is being generated...</p>
      </div>
    );
  }

  const concepts = blueprint.concepts;
  const goals = blueprint.learningGoals || [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-500/10 border border-sage-500/20 mb-4">
          <Target className="w-4 h-4 text-sage-500" />
          <span className="text-sm font-medium text-sage-400">Learning Blueprint</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Your Learning Blueprint</h1>
        <p className="text-sm text-stone-400">Review what AI has identified from your submission</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="stat-card text-center">
          <Brain className="w-6 h-6 text-coral-500 mx-auto mb-2" />
          <p className="text-lg font-bold text-white">{concepts.length}</p>
          <p className="text-[10px] text-stone-500">Concepts Detected</p>
        </div>
        <div className="stat-card text-center">
          <Target className="w-6 h-6 text-sage-500 mx-auto mb-2" />
          <p className="text-lg font-bold text-white">{goals.length}</p>
          <p className="text-[10px] text-stone-500">Learning Goals</p>
        </div>
        <div className="stat-card text-center">
          <Clock className="w-6 h-6 text-copper-400 mx-auto mb-2" />
          <p className="text-lg font-bold text-white">{blueprint.estimatedTime || '?'}m</p>
          <p className="text-[10px] text-stone-500">Estimated Time</p>
        </div>
        <div className="stat-card text-center">
          <BarChart3 className="w-6 h-6 text-copper-400 mx-auto mb-2" />
          <p className="text-lg font-bold text-white">{blueprint.difficulty || 'N/A'}</p>
          <p className="text-[10px] text-stone-500 text-capitalize">Difficulty</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Detected Concepts</h3>
            <div className="space-y-3">
              {concepts.map((concept: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-white">{concept.name}</h4>
                    <span className="text-xs text-coral-500 font-medium">{Math.round((concept.weight || 0) * 100)}% weight</span>
                  </div>
                  <p className="text-xs text-stone-400">{concept.description || ''}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-coral-500 to-teal-500 rounded-full"
                      style={{ width: `${(concept.weight || 0) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Learning Goals</h3>
            {goals.length === 0 ? (
              <p className="text-sm text-stone-500">No specific learning goals defined.</p>
            ) : (
              <div className="space-y-2">
                {goals.map((goal: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-sage-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-stone-300">{goal}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Expected Outcomes</h3>
            {goals.length === 0 ? (
              <p className="text-sm text-stone-500">Review the concepts above to understand what you'll learn.</p>
            ) : (
              <div className="space-y-2">
                {goals.slice(0, 3).map((goal: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-stone-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-4 border-amber-400/15">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-copper-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-copper-400 mb-1">AI Mentor</p>
                <p className="text-xs text-stone-400 leading-relaxed">
                  I've analyzed your submission and created this blueprint. Review the concepts and goals —
                  when ready, we'll begin adaptive validation.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button onClick={handleConfirm} disabled={confirming}
              className="btn-primary w-full justify-center">
              {confirming ? 'Confirming...' : 'Begin Adaptive Validation'} <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => refetch()} className="btn-secondary w-full justify-center text-sm">
              <RefreshCw className="w-4 h-4" /> Refresh Blueprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
