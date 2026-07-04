import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Users, Target, Trash2, Edit2 } from 'lucide-react';
import { useInterventions, useCreateIntervention } from '@/hooks/api/useFaculty';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Breadcrumb from '@/components/layout/Breadcrumb';
import toast from 'react-hot-toast';

export default function InterventionPlanner() {
  const { data: interventions, isLoading } = useInterventions();
  const createIntervention = useCreateIntervention();
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    targetConcepts: '',
    startDate: '',
    endDate: '',
  });

  const handleCreate = async () => {
    try {
      await createIntervention.mutateAsync({
        title: form.title,
        description: form.description,
        targetStudents: [],
        targetConcepts: form.targetConcepts.split(',').map((c) => c.trim()),
        status: 'draft',
        startDate: form.startDate,
        endDate: form.endDate,
      });
      toast.success('Intervention created');
      setShowDialog(false);
      setForm({ title: '', description: '', targetConcepts: '', startDate: '', endDate: '' });
    } catch (error) {
      toast.error('Failed to create intervention');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Interventions' }]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Intervention Planner</h1>
          <p className="text-secondary-500">Create and manage learning interventions.</p>
        </div>
        <Button onClick={() => setShowDialog(true)} leftIcon={<Plus size={16} />}>
          New Intervention
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-secondary-100 rounded-card animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {interventions?.map((intervention, i) => (
            <motion.div
              key={intervention.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-secondary-900">{intervention.title}</h3>
                      <Badge variant={intervention.status === 'active' ? 'success' : intervention.status === 'draft' ? 'default' : 'accent'}>
                        {intervention.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-secondary-500 mb-3">{intervention.description}</p>
                    <div className="flex items-center gap-4 text-xs text-secondary-400">
                      <span className="flex items-center gap-1"><Users size={12} /> {intervention.targetStudents.length} students</span>
                      <span className="flex items-center gap-1"><Target size={12} /> {intervention.targetConcepts.length} concepts</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(intervention.startDate).toLocaleDateString()} - {new Date(intervention.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-secondary-50 text-secondary-400">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-error-50 text-secondary-400 hover:text-error-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog isOpen={showDialog} onClose={() => setShowDialog(false)} title="New Intervention" size="lg">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Concept Review for Struggling Students" />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the intervention plan..." />
          <Input label="Target Concepts" value={form.targetConcepts} onChange={(e) => setForm({ ...form, targetConcepts: e.target.value })} placeholder="Comma-separated list of concepts" helperText="Enter concepts separated by commas" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate} isLoading={createIntervention.isPending}>Create</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
