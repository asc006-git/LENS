import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Brain, FileText, Target, Lightbulb, CheckCircle2, Loader2,
  Sparkles, ArrowRight, BookOpen, BarChart3, AlertCircle
} from 'lucide-react';
import { useLearningSession } from '@/hooks/api/useLearningSession';

const stageLabels: Record<string, { label: string; icon: any; order: number }> = {
  created: { label: 'Initializing', icon: FileText, order: 0 },
  uploading: { label: 'Reading Submission', icon: FileText, order: 1 },
  analyzing: { label: 'Extracting Concepts', icon: Brain, order: 2 },
  analysis_failed: { label: 'Analysis Failed', icon: AlertCircle, order: -1 },
  assignment_mismatch: { label: 'Assignment Mismatch', icon: AlertCircle, order: -2 },
  blueprint_generated: { label: 'Building Blueprint', icon: Target, order: 3 },
  blueprint_confirmed: { label: 'Preparing Validation', icon: Lightbulb, order: 4 },
  validating: { label: 'Validation', icon: CheckCircle2, order: 5 },
  validating_completed: { label: 'Complete', icon: CheckCircle2, order: 6 },
  reflection_saved: { label: 'Reflection', icon: CheckCircle2, order: 7 },
  report_generated: { label: 'Report Ready', icon: CheckCircle2, order: 8 },
  completed: { label: 'Completed', icon: CheckCircle2, order: 9 },
};

const progressStages = [
  { key: 'uploading', label: 'Reading Submission', icon: FileText },
  { key: 'analyzing', label: 'Extracting Concepts', icon: Brain },
  { key: 'blueprint_generated', label: 'Building Blueprint', icon: Target },
  { key: 'blueprint_confirmed', label: 'Preparing Validation', icon: Lightbulb },
];

const analysisCompleteOrder = stageLabels.blueprint_generated?.order ?? 3;

export default function SessionAnalysis() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { data: session, isLoading, isError, refetch } = useLearningSession(sessionId!);

  const [polls, setPolls] = useState(0);

  useEffect(() => {
    if (!sessionId) return;
    const stage = session?.sessionState?.currentStage;
    if (stage === 'blueprint_generated' || stage === 'blueprint_confirmed' || stage === 'analysis_failed') {
      return;
    }
    const interval = setInterval(() => {
      refetch();
      setPolls(p => p + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [sessionId, session?.sessionState?.currentStage, refetch]);

  if (isLoading && !session) {
    return (
      <div className="max-w-5xl mx-auto text-center py-16">
        <Loader2 className="w-8 h-8 text-coral-500 mx-auto animate-spin mb-4" />
        <p className="text-stone-400">Loading analysis...</p>
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="max-w-5xl mx-auto text-center py-16">
        <AlertCircle className="w-12 h-12 text-terracotta-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Could not load session</h2>
        <p className="text-sm text-stone-400 mb-4">The session may have expired or been deleted.</p>
        <button onClick={() => navigate('/student/dashboard')} className="btn-primary text-sm">Back to Dashboard</button>
      </div>
    );
  }

  const currentStage = session.sessionState?.currentStage || 'created';
  const currentOrder = stageLabels[currentStage]?.order ?? 0;
  const isFailed = currentStage === 'analysis_failed';
  const isMismatch = currentStage === 'assignment_mismatch';
  const isComplete = currentOrder >= analysisCompleteOrder;
  const mismatchReason = (session as any).assignmentMismatchReason;
  const errorMessage = (session as any).errorMessage;

  const aiAnalysis = session.aiAnalysis;
  const concepts = aiAnalysis?.concepts || [];

  const currentProgressIndex = isFailed
    ? progressStages.findIndex(s => s.key === 'analyzing')
    : progressStages.findIndex(s => currentOrder >= (stageLabels[s.key]?.order ?? 0));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-4 ${
          isFailed
            ? 'bg-terracotta-500/10 border-terracotta-500/20'
            : isMismatch
              ? 'bg-amber-500/10 border-amber-500/20'
              : isComplete
                ? 'bg-sage-500/10 border-sage-500/20'
                : 'bg-amber-400/10 border-amber-400/20'
        }`}>
          {isFailed || isMismatch ? (
            <AlertCircle className="w-4 h-4 text-terracotta-400" />
          ) : (
            <Brain className="w-4 h-4 text-copper-400" />
          )}
          <span className={`text-sm font-medium ${
            isFailed ? 'text-terracotta-400' : isMismatch ? 'text-amber-400' : isComplete ? 'text-sage-400' : 'text-copper-400'
          }`}>
            {isFailed ? 'Analysis Failed' : isMismatch ? 'Assignment Mismatch' : isComplete ? 'Analysis Complete' : stageLabels[currentStage]?.label || 'Processing'}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          {isFailed ? 'Analysis Failed' : isMismatch ? 'Assignment Mismatch Detected' : isComplete ? 'Analysis Complete' : stageLabels[currentStage]?.label || 'Processing'}
        </h1>
        <p className="text-sm text-stone-400">
          {isFailed
            ? `There was an error analyzing your submission. ${errorMessage ? `Details: ${errorMessage}` : 'You can try again or start a new session.'}`
            : isMismatch
              ? mismatchReason || 'This submission doesn\'t appear to match the assignment requirements. Please check you\'ve uploaded the correct file, or contact your faculty if you believe this is an error.'
              : isComplete
                ? 'AI has identified key concepts from your work. Review your learning blueprint.'
                : 'Our AI is understanding your work to create a personalized learning experience'
          }
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Processing Timeline</h3>
            <div className="space-y-3">
              {progressStages.map(({ key, label, icon: Icon }, i) => {
                const stageOrder = stageLabels[key]?.order ?? 0;
                const isStageDone = currentOrder > stageOrder;
                const isStageCurrent = currentOrder === stageOrder;
                const isStageSkipped = isMismatch && stageOrder >= 2;
                return (
                  <div key={key} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                    isStageDone ? 'bg-emerald-500/8 border border-sage-500/15'
                    : isStageCurrent ? 'bg-coral-500/8 border border-coral-500/15'
                    : isStageSkipped ? 'bg-amber-500/5 border border-amber-500/10'
                    : 'bg-white/2 border border-white/5'
                  }`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isStageDone ? 'bg-sage-500/20'
                      : isStageCurrent ? 'bg-coral-500/20'
                      : isStageSkipped ? 'bg-amber-500/15'
                      : 'bg-white/5'
                    }`}>
                      {isStageDone ? (
                        <CheckCircle2 className="w-5 h-5 text-sage-500" />
                      ) : isStageCurrent ? (
                        isFailed ? <AlertCircle className="w-5 h-5 text-terracotta-500" /> :
                        <Loader2 className="w-5 h-5 text-coral-500 animate-spin" />
                      ) : isStageSkipped ? (
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      ) : (
                        <Icon className="w-5 h-5 text-stone-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        isStageDone || isStageCurrent ? 'text-stone-200' : isStageSkipped ? 'text-stone-400' : 'text-stone-500'
                      }`}>{label}</p>
                      <p className="text-[10px] text-stone-500">
                        {isStageDone ? 'Completed' : isStageCurrent ? (isFailed ? 'Failed' : 'Processing...') : isStageSkipped ? 'Skipped' : 'Pending'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-stone-500">Overall Progress</span>
                <span className="text-xs font-medium text-coral-500">
                  {isFailed ? 'Failed' : isMismatch ? 'Mismatch' : `${Math.min(Math.round(((currentProgressIndex + 1) / progressStages.length) * 100), 100)}%`}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${
                  isFailed ? 'bg-terracotta-500' : isMismatch ? 'bg-amber-500' : 'bg-gradient-to-r from-coral-500 to-amber-400'
                }`} style={{ width: isFailed || isMismatch ? '100%' : `${Math.min(((currentProgressIndex + 1) / progressStages.length) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-copper-400" /> {concepts.length > 0 ? 'Discovered Concepts' : 'Concept Discovery'}
            </h3>
            {concepts.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="w-10 h-10 text-stone-600 mx-auto mb-3 animate-pulse" />
                <p className="text-sm text-stone-500">Discovering concepts...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {concepts.map((concept: any, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-white/3 border border-white/5 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-stone-200">{concept.name}</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <div key={j} className={`w-1.5 h-3 rounded-full ${
                            j < Math.round((concept.difficulty || 0.5) * 5) ? 'bg-coral-400' : 'bg-white/10'
                          }`} />
                        ))}
                      </div>
                    </div>
                    {concept.bloomLevel && (
                      <p className="text-[10px] text-stone-500 mt-1 capitalize">{concept.bloomLevel}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`glass-card p-4 mt-4 ${
            isFailed ? 'border-terracotta-500/15' : isMismatch ? 'border-amber-500/15' : 'border-amber-400/15'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-copper-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-copper-400 mb-1">AI Mentor</p>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {isFailed
                    ? "The analysis encountered an error. Please try uploading your files again or start a new session."
                    : isMismatch
                      ? "This submission doesn't appear to match the selected assignment. Please check you've uploaded the correct file. If you believe this is an error, contact your faculty."
                      : isComplete
                        ? "Analysis complete! I've identified key concepts and prepared your learning blueprint. Let's review it together."
                        : "I'm carefully reading your submission to understand the concepts and create a personalized learning plan for you."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isComplete && !isFailed && !isMismatch && (
        <div className="mt-6 flex justify-end animate-fade-in-up">
          <button onClick={() => navigate(`/student/learning/${sessionId}/blueprint`)}
            className="btn-primary">
            View Learning Blueprint <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {(isFailed || isMismatch) && (
        <div className="mt-6 flex justify-end gap-3 animate-fade-in-up">
          {isFailed && (
            <button onClick={() => { refetch(); }} className="btn-secondary text-sm">
              Retry Analysis
            </button>
          )}
          <button onClick={() => navigate('/student/dashboard')} className="btn-secondary text-sm">
            Back to Dashboard
          </button>
          <button onClick={() => navigate(`/student/learning/create`)} className="btn-primary text-sm">
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
}
