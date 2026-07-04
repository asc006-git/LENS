import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Save } from 'lucide-react';
import { useReflection, useUpdateReflectionSection } from '@/hooks/api/useReflection';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/layout/Breadcrumb';
import toast from 'react-hot-toast';

export default function SessionReflection() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: reflection, isLoading } = useReflection(sessionId!);
  const updateSection = useUpdateReflectionSection();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Record<string, string>>({});

  const handleContentChange = (sectionId: string, content: string) => {
    setSections((prev) => ({ ...prev, [sectionId]: content }));
  };

  const handleSaveSection = async (sectionId: string) => {
    if (!reflection) return;
    try {
      await updateSection.mutateAsync({
        reflectionId: reflection.id,
        sectionId,
        content: sections[sectionId] || '',
      });
      toast.success('Section saved');
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleFinish = () => {
    navigate(`/student/learning/${sessionId}/report`);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-100 rounded w-1/3" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-secondary-100 rounded-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/student/dashboard' },
        { label: 'Sessions', to: '/student/dashboard' },
        { label: 'Reflection', to: '#' },
      ]} />

      <h1 className="text-2xl font-bold text-secondary-900 mb-2">Reflection Notebook</h1>
      <p className="text-secondary-500 mb-8">Take a moment to reflect on your learning experience.</p>

      <div className="space-y-6">
        {reflection?.sections?.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-secondary-900">{section.title}</h3>
                {section.isCompleted && (
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Completed</span>
                )}
              </div>
              <p className="text-sm text-secondary-500 mb-4">{section.placeholder}</p>
              <textarea
                value={sections[section.id] || section.content || ''}
                onChange={(e) => handleContentChange(section.id, e.target.value)}
                placeholder={section.placeholder}
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none h-32"
              />
              <div className="flex justify-end mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSaveSection(section.id)}
                  leftIcon={<Save size={14} />}
                >
                  Save
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleFinish} rightIcon={<ArrowRight size={16} />}>
          View Report
        </Button>
      </div>
    </div>
  );
}
