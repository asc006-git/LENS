import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BookOpen, ArrowRight, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { useReflection } from '@/hooks/api/useReflection';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';

const sectionTemplates = [
  { id: '1', title: 'What I Learned', type: 'learning', placeholder: 'Reflect on the key concepts you understood during this session...' },
  { id: '2', title: 'What Challenged Me', type: 'challenge', placeholder: 'Describe the concepts or questions that were difficult...' },
  { id: '3', title: 'Key Takeaways', type: 'takeaway', placeholder: 'Summarize the most important points from this learning session...' },
  { id: '4', title: 'Next Steps', type: 'next', placeholder: 'What do you want to explore or practice next?' },
];

export default function SessionReflection() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { data: reflection } = useReflection(sessionId!);
  const [sections, setSections] = useState<Record<string, string>>({});
  const [savedSections, setSavedSections] = useState<Set<string>>(new Set());
  const [analyzing, setAnalyzing] = useState(false);

  const handleContentChange = (sectionId: string, content: string) => {
    setSections(prev => ({ ...prev, [sectionId]: content }));
    savedSections.delete(sectionId);
    setSavedSections(new Set(savedSections));
  };

  const handleSave = async (sectionId: string) => {
    const content = sections[sectionId];
    if (!content) return;
    try {
      await apiClient.put(`/api/v1/reflection/${sessionId}/sections/${sectionId}`, { content });
      setSavedSections(prev => new Set(prev).add(sectionId));
      toast.success('Section saved');
    } catch {
      toast.error('Failed to save section');
    }
  };

  const handleFinish = async () => {
    setAnalyzing(true);
    try {
      const allText = Object.values(sections).filter(Boolean).join('\n');
      if (allText) {
        await apiClient.post(`/api/v1/learning-sessions/${sessionId}/reflection/analyze`, {
          reflectionText: allText,
        });
      }
      navigate(`/student/learning/${sessionId}/report`);
    } catch {
      navigate(`/student/learning/${sessionId}/report`);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta-500/10 border border-rose-500/20 mb-4">
          <BookOpen className="w-4 h-4 text-terracotta-500" />
          <span className="text-sm font-medium text-rose-300">Reflection Notebook</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Reflection Notebook</h1>
        <p className="text-sm text-stone-400">Take a moment to reflect on your learning experience</p>
      </div>

      <div className="space-y-4">
        {sectionTemplates.map((section, index) => (
          <div key={section.id} className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">{section.title}</h3>
              {savedSections.has(section.id) && (
                <span className="badge badge-emerald text-[10px]">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Saved
                </span>
              )}
            </div>

            <textarea
              value={sections[section.id] || ''}
              onChange={(e) => handleContentChange(section.id, e.target.value)}
              placeholder={section.placeholder}
              rows={4}
              className="input-field resize-none mb-3"
            />

            <div className="flex justify-end">
              <button onClick={() => handleSave(section.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-400 hover:text-sage-500 hover:bg-sage-500/10 transition-colors">
                <Save className="w-3 h-3" /> Save
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={handleFinish} disabled={analyzing} className="btn-primary">
          {analyzing ? 'Analyzing...' : 'View Learning Report'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
