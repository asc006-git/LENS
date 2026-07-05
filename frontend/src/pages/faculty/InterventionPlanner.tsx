import { useState } from 'react';
import { Plus, Calendar, Users, Target, Trash2, Edit2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useInterventions, useCreateIntervention } from '@/hooks/api/useFaculty';
import toast from 'react-hot-toast';

export default function InterventionPlanner() {
  const { data: interventions, isLoading } = useInterventions();
  const createIntervention = useCreateIntervention();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', targetConcepts: '', startDate: '', endDate: '',
  });

  const handleCreate = async () => {
    try {
      await createIntervention.mutateAsync({
        title: form.title,
        description: form.description,
        targetStudents: [],
        targetConcepts: form.targetConcepts.split(',').map(c => c.trim()).filter(Boolean),
        status: 'draft',
        startDate: form.startDate,
        endDate: form.endDate,
      } as any);
      toast.success('Intervention created');
      setShowForm(false);
      setForm({ title: '', description: '', targetConcepts: '', startDate: '', endDate: '' });
    } catch {
      toast.error('Failed to create intervention');
    }
  };

  const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
    active: { color: 'text-sage-500', bg: 'bg-sage-500/10', icon: CheckCircle2 },
    draft: { color: 'text-copper-400', bg: 'bg-copper-500/10', icon: Clock },
    completed: { color: 'text-coral-500', bg: 'bg-coral-500/10', icon: CheckCircle2 },
  };

  const list = Array.isArray(interventions) ? interventions : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Intervention Planner</h1>
          <p className="text-sm text-stone-400">Create and manage targeted learning interventions for struggling students.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> New Intervention
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-white mb-4">Create New Intervention</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">Title</label>
              <input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., AVL Tree Review Session" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">Description</label>
              <textarea className="input-field resize-none" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the intervention plan..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">Target Concepts (comma-separated)</label>
              <input className="input-field" value={form.targetConcepts} onChange={e => setForm({ ...form, targetConcepts: e.target.value })} placeholder="AVL Rotations, Balance Factors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">Start Date</label>
                <input type="date" className="input-field" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">End Date</label>
                <input type="date" className="input-field" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleCreate} className="btn-primary text-sm">Create Intervention</button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <AlertCircle className="w-12 h-12 text-stone-500 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-white mb-2">No interventions yet</h3>
          <p className="text-sm text-stone-400">Create your first intervention to help struggling students.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((intervention: any) => {
            const sc = statusConfig[intervention.status] || statusConfig.draft;
            const StatusIcon = sc.icon;
            return (
              <div key={intervention.id || intervention._id} className="glass-card p-5 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-sm font-semibold text-white">{intervention.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${sc.bg} ${sc.color}`}>
                        <StatusIcon className="w-3 h-3" /> {intervention.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mb-3">{intervention.description}</p>
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {intervention.targetStudents?.length || 0} students</span>
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {intervention.targetConcepts?.length || 0} concepts</span>
                      {intervention.startDate && (
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(intervention.startDate).toLocaleDateString()} – {new Date(intervention.endDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg text-stone-500 hover:text-white hover:bg-white/5 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2 rounded-lg text-stone-500 hover:text-terracotta-500 hover:bg-terracotta-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
