import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileText, Target, Upload, Settings, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { useCreateSession } from '@/hooks/api/useLearningSession';
import toast from 'react-hot-toast';

const steps = [
  { id: 'course', label: 'Course', icon: BookOpen },
  { id: 'assignment', label: 'Assignment', icon: FileText },
  { id: 'objective', label: 'Objective', icon: Target },
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'config', label: 'AI Config', icon: Settings },
  { id: 'review', label: 'Review', icon: CheckCircle },
];

export default function CreateLearningSession() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    courseName: '',
    courseCode: '',
    title: '',
    description: '',
    assignmentContent: '',
    learningObjective: '',
    difficulty: 'intermediate',
    learningStyle: 'visual',
    timeEstimate: 30,
    adaptiveDifficulty: true,
  });
  const createSession = useCreateSession();
  const navigate = useNavigate();

  const updateForm = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const session = await createSession.mutateAsync({
        courseId: form.courseCode,
        title: form.title,
        description: form.description,
        assignmentContent: form.assignmentContent,
        learningObjective: form.learningObjective,
        aiConfig: {
          difficulty: form.difficulty,
          learningStyle: form.learningStyle,
          timeEstimate: form.timeEstimate,
          adaptiveDifficulty: form.adaptiveDifficulty,
        },
      });
      toast.success('Session created! AI is analyzing your work...');
      navigate(`/student/learning/${session.id}`);
    } catch (error) {
      toast.error('Failed to create session');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-secondary-900 mb-2">New Learning Session</h1>
      <p className="text-secondary-500 mb-8">Set up your personalized AI learning experience.</p>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              index <= currentStep ? 'bg-primary-500 text-white' : 'bg-secondary-100 text-secondary-400'
            }`}>
              {index < currentStep ? <CheckCircle size={16} /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${index < currentStep ? 'bg-primary-500' : 'bg-secondary-100'}`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {currentStep === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Course Selection</h2>
                <Input label="Course Name" placeholder="e.g., Introduction to Machine Learning" value={form.courseName} onChange={(e) => updateForm('courseName', e.target.value)} />
                <Input label="Course Code" placeholder="e.g., CS-4610" value={form.courseCode} onChange={(e) => updateForm('courseCode', e.target.value)} />
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Assignment Details</h2>
                <Input label="Session Title" placeholder="e.g., Neural Networks Assignment" value={form.title} onChange={(e) => updateForm('title', e.target.value)} />
                <Textarea label="Description" placeholder="Brief description of the assignment..." value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={3} />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Learning Objective</h2>
                <Textarea label="What do you want to learn?" placeholder="Describe your learning goals for this session. What concepts do you want to master?" value={form.learningObjective} onChange={(e) => updateForm('learningObjective', e.target.value)} rows={4} />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Upload Assignment</h2>
                <div className="border-2 border-dashed border-secondary-200 rounded-card p-12 text-center hover:border-primary-300 transition-colors cursor-pointer">
                  <Upload size={32} className="mx-auto text-secondary-400 mb-4" />
                  <p className="text-sm text-secondary-600 font-medium">Drag and drop your assignment here</p>
                  <p className="text-xs text-secondary-400 mt-1">PDF, DOCX, TXT, or paste text directly</p>
                </div>
                <Textarea label="Or paste your assignment content" placeholder="Paste your assignment text here..." value={form.assignmentContent} onChange={(e) => updateForm('assignmentContent', e.target.value)} rows={6} />
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">AI Configuration</h2>
                <Select label="Difficulty Level" value={form.difficulty} onChange={(e) => updateForm('difficulty', e.target.value)} options={[
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' },
                ]} />
                <Select label="Learning Style" value={form.learningStyle} onChange={(e) => updateForm('learningStyle', e.target.value)} options={[
                  { value: 'visual', label: 'Visual' },
                  { value: 'auditory', label: 'Auditory' },
                  { value: 'reading', label: 'Reading/Writing' },
                  { value: 'kinesthetic', label: 'Kinesthetic' },
                ]} />
                <Input label="Estimated Time (minutes)" type="number" value={form.timeEstimate} onChange={(e) => updateForm('timeEstimate', parseInt(e.target.value))} />
                <label className="flex items-center gap-3 p-4 bg-secondary-50 rounded-card cursor-pointer">
                  <input type="checkbox" checked={form.adaptiveDifficulty} onChange={(e) => updateForm('adaptiveDifficulty', e.target.checked)} className="w-4 h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500" />
                  <div>
                    <span className="text-sm font-medium text-secondary-900">Adaptive Difficulty</span>
                    <p className="text-xs text-secondary-500">AI adjusts question difficulty based on your responses</p>
                  </div>
                </label>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Review & Start</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Course', value: `${form.courseName} (${form.courseCode})` },
                    { label: 'Title', value: form.title },
                    { label: 'Objective', value: form.learningObjective },
                    { label: 'Difficulty', value: form.difficulty },
                    { label: 'Learning Style', value: form.learningStyle },
                    { label: 'Time Estimate', value: `${form.timeEstimate} minutes` },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-secondary-100">
                      <span className="text-sm text-secondary-500">{item.label}</span>
                      <span className="text-sm font-medium text-secondary-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-secondary-100">
          <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0} leftIcon={<ChevronLeft size={16} />}>
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} rightIcon={<ChevronRight size={16} />}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={createSession.isPending}>
              Start Session
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
