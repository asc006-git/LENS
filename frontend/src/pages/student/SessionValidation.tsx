import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, BookOpen } from 'lucide-react';
import { useValidation, useSubmitAnswer } from '@/hooks/api/useValidation';
import { useLearningSession } from '@/hooks/api/useLearningSession';
import ValidationQuestionComponent from '@/components/workflow/ValidationQuestion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import Breadcrumb from '@/components/layout/Breadcrumb';
import toast from 'react-hot-toast';

export default function SessionValidation() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: session } = useLearningSession(sessionId!);
  const { data: validation, isLoading } = useValidation(sessionId!);
  const submitAnswer = useSubmitAnswer();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-100 rounded w-1/3" />
          <div className="h-64 bg-secondary-100 rounded-card mt-8" />
        </div>
      </div>
    );
  }

  const questions = validation?.questions || [];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  const handleAnswer = async (answer: string, confidence: number) => {
    if (!sessionId || !questions[currentQuestion]) return;
    try {
      await submitAnswer.mutateAsync({
        sessionId,
        questionId: questions[currentQuestion].id,
        answer,
        timeSpent: 30,
        confidence,
      });
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        toast.success('Validation complete! Generating your report...');
        navigate(`/student/learning/${sessionId}/reflection`);
      }
    } catch (error) {
      toast.error('Failed to submit answer');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/student/dashboard' },
        { label: 'Sessions', to: '/student/dashboard' },
        { label: 'Validation', to: '#' },
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">Knowledge Validation</h1>
          <p className="text-secondary-500 mb-6">Answer these adaptive questions to validate your understanding.</p>

          <ProgressBar value={progress} label={`Question ${currentQuestion + 1} of ${totalQuestions}`} showLabel />

          {questions[currentQuestion] && (
            <div className="mt-6">
              <ValidationQuestionComponent
                question={questions[currentQuestion]}
                onAnswer={handleAnswer}
                questionNumber={currentQuestion + 1}
                totalQuestions={totalQuestions}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Concept Navigator */}
          <Card>
            <h3 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
              <BookOpen size={16} />
              Concept Navigator
            </h3>
            <div className="space-y-2">
              {session?.blueprint?.concepts?.map((concept: any) => (
                <div key={concept.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary-50 text-sm">
                  <div className={`w-2 h-2 rounded-full ${concept.status === 'mastered' ? 'bg-primary-500' : concept.status === 'validated' ? 'bg-accent-500' : 'bg-secondary-300'}`} />
                  <span className="text-secondary-700">{concept.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Mentor Panel */}
          <Card>
            <h3 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
              <Bot size={16} />
              AI Mentor
            </h3>
            <p className="text-sm text-secondary-500 mb-3">Need help? Ask the AI mentor for hints or explanations.</p>
            <div className="bg-secondary-50 rounded-button p-3 text-sm text-secondary-600">
              "Take your time with each question. The goal is to demonstrate genuine understanding, not speed."
            </div>
          </Card>

          {/* Progress */}
          <Card>
            <h3 className="font-semibold text-secondary-900 mb-3">Your Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-500">Questions answered</span>
                <span className="font-medium text-secondary-900">{currentQuestion} / {totalQuestions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-500">Overall score</span>
                <span className="font-medium text-primary-600">{validation?.overallScore || 0}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-500">Confidence</span>
                <span className="font-medium text-accent-600">{validation?.confidence || 0}%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
