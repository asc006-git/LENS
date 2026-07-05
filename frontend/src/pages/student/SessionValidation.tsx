import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Target, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { useValidation, useSubmitAnswer, useStartValidation } from '@/hooks/api/useValidation';
import { useLearningSession } from '@/hooks/api/useLearningSession';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';

const confidenceLevels = [
  { value: 1, label: 'Not Sure', color: 'bg-rose-500' },
  { value: 2, label: 'Somewhat', color: 'bg-amber-500' },
  { value: 3, label: 'Fairly', color: 'bg-coral-500' },
  { value: 4, label: 'Very', color: 'bg-emerald-500' },
  { value: 5, label: 'Certain', color: 'bg-emerald-600' },
];

interface ValidationQuestion {
  concept: string;
  question: string;
  expectedAnswerPoints?: string[];
}

export default function SessionValidation() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { data: session } = useLearningSession(sessionId!);
  const { data: validation } = useValidation(sessionId!);
  const startValidation = useStartValidation();
  const submitAnswer = useSubmitAnswer();

  const [questions, setQuestions] = useState<ValidationQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { response: string; confidence: number }>>({});
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [sessionId]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      if (!validation?.startedAt) {
        await startValidation.mutateAsync(sessionId!);
      }
      const { data: res } = await apiClient.get(`/api/v1/learning-sessions/${sessionId}`);
      const questions = res?.data?.validation?.questions || res?.validation?.questions || [];
      if (questions.length > 0) {
        setQuestions(questions);
      } else if (session?.blueprint?.concepts) {
        const fallbackQs = session.blueprint.concepts.map((c: any) => ({
          concept: c.name,
          question: `Explain the concept of "${c.name}" in your own words. What makes it important?`,
          expectedAnswerPoints: [],
        }));
        setQuestions(fallbackQs);
      }
    } catch (err: any) {
      toast.error('Failed to load validation questions');
    } finally {
      setLoading(false);
    }
  };

  const question = questions[currentQ];
  const answer = question ? (answers[question.concept] || { response: '', confidence: 0 }) : { response: '', confidence: 0 };
  const progress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0;

  const updateAnswer = (updates: Partial<typeof answer>) => {
    if (!question) return;
    setAnswers(prev => ({ ...prev, [question.concept]: { ...answer, ...updates } }));
  };

  const handleNext = async () => {
    if (!question) return;
    setSubmitting(true);
    try {
      await submitAnswer.mutateAsync({
        sessionId: sessionId!,
        questionId: question.concept,
        answer: answer.response,
        timeSpent: 30,
        confidence: answer.confidence / 5,
      });
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
        setShowHint(false);
      } else {
        toast.success('Validation complete!');
        navigate(`/student/learning/${sessionId}/reflection`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <Loader2 className="w-8 h-8 text-coral-500 mx-auto animate-spin mb-4" />
        <p className="text-stone-400">Loading validation questions...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <AlertCircle className="w-12 h-12 text-stone-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">No questions available</h2>
        <p className="text-sm text-stone-400">Complete the analysis phase first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-copper-500/10 border border-amber-500/20 mb-4">
          <Target className="w-4 h-4 text-copper-400" />
          <span className="text-sm font-medium text-copper-400">Adaptive Validation</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Validate Your Understanding</h1>
        <p className="text-sm text-stone-400">Answer questions to demonstrate genuine conceptual mastery</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-copper-500 to-sage-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs text-stone-400 shrink-0">{currentQ + 1}/{questions.length}</span>
      </div>

      <div className="glass-card p-6 lg:p-8 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="badge badge-blue text-[10px]">{question.concept}</span>
        </div>

        <h2 className="text-base font-semibold text-white mb-6 leading-relaxed">{question.question}</h2>

        <textarea value={answer.response}
          onChange={e => updateAnswer({ response: e.target.value })}
          rows={5} className="input-field resize-none"
          placeholder="Explain in your own words..." />

        <div className="mt-6">
          <label className="block text-xs font-medium text-stone-400 mb-2">How confident are you in this answer?</label>
          <div className="flex gap-2">
            {confidenceLevels.map(({ value, label, color }) => (
              <button key={value} onClick={() => updateAnswer({ confidence: value })}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  answer.confidence === value
                    ? `${color} text-white`
                    : 'bg-white/5 text-stone-500 hover:bg-white/10'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {!showHint ? (
          <button onClick={() => setShowHint(true)} className="mt-4 text-xs text-stone-500 hover:text-coral-500 transition-colors">
            Need a hint?
          </button>
        ) : (
          <div className="mt-4 p-3 rounded-xl bg-coral-500/8 border border-coral-500/15 animate-fade-in">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-coral-500 mt-0.5 shrink-0" />
              <p className="text-xs text-coral-400">Think deeply about the concept and explain in your own words.</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => currentQ > 0 && setCurrentQ(prev => prev - 1)}
          disabled={currentQ === 0}
          className="btn-secondary !py-2.5 text-sm disabled:opacity-30">
          Previous
        </button>
        <button onClick={handleNext}
          disabled={!answer.response || !answer.confidence || submitting}
          className="btn-primary !py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
          {submitting ? 'Submitting...' : currentQ === questions.length - 1 ? 'Complete Validation' : 'Next Question'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
