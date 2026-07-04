import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { useBlueprint, useConfirmBlueprint } from '@/hooks/api/useBlueprint';
import ConceptCard from '@/components/workflow/ConceptCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressRing from '@/components/ui/ProgressRing';
import Breadcrumb from '@/components/layout/Breadcrumb';
import toast from 'react-hot-toast';

export default function SessionBlueprint() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: blueprint, isLoading } = useBlueprint(sessionId!);
  const confirmBlueprint = useConfirmBlueprint();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (!blueprint) return;
    try {
      await confirmBlueprint.mutateAsync({ blueprintId: blueprint.id, confirmed: true });
      toast.success('Blueprint confirmed! Starting validation...');
      navigate(`/student/learning/${sessionId}/validation`);
    } catch (error) {
      toast.error('Failed to confirm blueprint');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-100 rounded w-1/3" />
          <div className="h-4 bg-secondary-100 rounded w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 bg-secondary-100 rounded-card" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/student/dashboard' },
        { label: 'Sessions', to: '/student/dashboard' },
        { label: 'Blueprint', to: '#' },
      ]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Learning Blueprint</h1>
          <p className="text-secondary-500">AI has identified the following concepts from your assignment.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-secondary-500">
            <Clock size={16} />
            <span>~{blueprint?.estimatedTime || 0} min</span>
          </div>
          <div className="text-sm text-secondary-500">
            Difficulty: {blueprint?.difficulty || 'N/A'}
          </div>
        </div>
      </div>

      {/* Overall Mastery */}
      <Card className="mb-8">
        <div className="flex items-center gap-8">
          <ProgressRing value={(blueprint?.concepts && blueprint.concepts.length > 0) ? blueprint.concepts.reduce((sum: number, c: any) => sum + (c.mastery || 0), 0) / blueprint.concepts.length : 0} size={100} label="Overall" />
          <div className="flex-1">
            <h3 className="font-semibold text-secondary-900 mb-2">Learning Objectives</h3>
            <ul className="space-y-1">
              {blueprint?.learningObjectives?.map((obj, i) => (
                <li key={i} className="text-sm text-secondary-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Concepts */}
      <h2 className="text-lg font-semibold text-secondary-900 mb-4">Discovered Concepts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {blueprint?.concepts?.map((concept) => (
          <ConceptCard key={concept.id} concept={concept} />
        ))}
      </div>

      {/* Actions */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-secondary-900">Ready to validate your understanding?</h3>
            <p className="text-sm text-secondary-500">The AI will ask adaptive questions based on these concepts.</p>
          </div>
          <Button onClick={handleConfirm} isLoading={confirmBlueprint.isPending} rightIcon={<ArrowRight size={16} />}>
            Confirm & Start Validation
          </Button>
        </div>
      </Card>
    </div>
  );
}
