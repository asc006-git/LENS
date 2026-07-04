import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { useLearningSession, useSessionAnalysis } from '@/hooks/api/useLearningSession';
import AIProcessingTimeline from '@/components/workflow/AIProcessingTimeline';
import LearningProgressTracker from '@/components/workflow/LearningProgressTracker';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function SessionAnalysis() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: session } = useLearningSession(sessionId!);
  const { data: analysis } = useSessionAnalysis(sessionId!);

  const stages = [
    { id: 'upload', label: 'Upload', status: 'completed' as const },
    { id: 'analyze', label: 'Analysis', status: session?.status === 'analyzing' ? 'current' as const : session?.status === 'blueprint_ready' || session?.status === 'validating' || session?.status === 'completed' ? 'completed' as const : 'pending' as const },
    { id: 'blueprint', label: 'Blueprint', status: session?.status === 'blueprint_ready' ? 'current' as const : session?.status === 'validating' || session?.status === 'completed' ? 'completed' as const : 'pending' as const },
    { id: 'validate', label: 'Validate', status: session?.status === 'validating' ? 'current' as const : session?.status === 'completed' ? 'completed' as const : 'pending' as const },
    { id: 'reflect', label: 'Reflect', status: session?.status === 'reflecting' ? 'current' as const : session?.status === 'completed' ? 'completed' as const : 'pending' as const },
    { id: 'report', label: 'Report', status: session?.status === 'completed' ? 'completed' as const : 'pending' as const },
  ];

  const timelineStages = [
    { id: 'read', label: 'Reading Assignment', description: 'AI is parsing your document content', status: 'completed' as const, duration: '12s' },
    { id: 'nlp', label: 'NLP Analysis', description: 'Extracting key concepts and relationships', status: session?.status === 'analyzing' ? 'active' as const : 'completed' as const, duration: '18s' },
    { id: 'graph', label: 'Knowledge Graph', description: 'Building concept dependency map', status: analysis?.status === 'graph_building' ? 'active' as const : session?.status !== 'analyzing' ? 'completed' as const : 'pending' as const, duration: '8s' },
    { id: 'questions', label: 'Question Generation', description: 'Creating adaptive validation questions', status: 'pending' as const, duration: '15s' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/student/dashboard' },
        { label: 'Sessions', to: '/student/dashboard' },
        { label: session?.title || 'Session' },
      ]} />

      <h1 className="text-2xl font-bold text-secondary-900 mb-2">{session?.title || 'Analyzing Session...'}</h1>
      <p className="text-secondary-500 mb-8">AI is working on understanding your assignment.</p>

      <LearningProgressTracker stages={stages} />

      {session?.status === 'completed' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="bg-primary-50 border-primary-200">
            <div className="flex items-center gap-4">
              <CheckCircle size={24} className="text-primary-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-primary-900">Analysis Complete!</h3>
                <p className="text-sm text-primary-700">Your learning blueprint is ready.</p>
              </div>
              <Link to={`/student/learning/${sessionId}/blueprint`}>
                <Button rightIcon={<ArrowRight size={16} />}>View Blueprint</Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Processing Timeline</h2>
          <AIProcessingTimeline stages={timelineStages} />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Discovered Concepts</h2>
          {analysis?.concepts ? (
            <div className="space-y-2">
              {analysis.concepts.map((concept: any) => (
                <div key={concept.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-button">
                  <span className="text-sm font-medium text-secondary-900">{concept.name}</span>
                  <span className="text-xs text-secondary-500">Difficulty: {concept.difficulty}/10</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Loader2 size={24} className="animate-spin mx-auto text-secondary-400 mb-2" />
              <p className="text-sm text-secondary-500">Discovering concepts...</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
