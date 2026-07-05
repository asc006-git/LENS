import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, FileText, Target, Upload, Settings, CheckCircle2,
  ArrowRight, ArrowLeft, X, Sparkles, Cloud, Loader2
} from 'lucide-react';
import { useCreateSession } from '@/hooks/api/useLearningSession';
import apiClient, { aiApiClient } from '@/api/client';
import toast from 'react-hot-toast';

const steps = [
  { id: 1, label: 'Course', icon: BookOpen },
  { id: 2, label: 'Assignment', icon: FileText },
  { id: 3, label: 'Objective', icon: Target },
  { id: 4, label: 'Upload', icon: Upload },
  { id: 5, label: 'AI Config', icon: Settings },
  { id: 6, label: 'Review', icon: CheckCircle2 },
];

export default function CreateLearningSession() {
  const navigate = useNavigate();
  const createSession = useCreateSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [courses, setCourses] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '', courseName: '', assignmentId: '', assignmentTitle: '', assignmentDescription: '',
    learningObjective: '', files: [] as File[],
    aiConfig: { difficulty: 'intermediate', learningStyle: 'reading', adaptiveDifficulty: true, depth: 'standard' }
  });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (formData.courseId) {
      loadAssignments(formData.courseId);
    } else {
      setAssignments([]);
    }
  }, [formData.courseId]);

  const loadCourses = async () => {
    setCoursesLoading(true);
    try {
      const { data: res } = await apiClient.get('/api/v1/courses');
      const list = res?.data || (Array.isArray(res) ? res : []);
      setCourses(list);
    } catch {
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  const loadAssignments = async (courseId: string) => {
    setAssignmentsLoading(true);
    try {
      const { data: res } = await apiClient.get(`/api/v1/courses/${courseId}/assignments`);
      const list = res?.data || (Array.isArray(res) ? res : []);
      setAssignments(list);
    } catch {
      setAssignments([]);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const updateForm = (updates: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...updates }));

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!formData.courseId;
      case 2: return true;
      case 3: return !!formData.learningObjective;
      case 4: return formData.files.length > 0;
      case 5: return true;
      case 6: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(prev => prev + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload: any = {
        course: formData.courseId,
        learningObjective: formData.learningObjective,
      };
      if (formData.assignmentId) {
        payload.assignment = formData.assignmentId;
      }

      const result = await createSession.mutateAsync(payload);
      const sessionId = result?._id || result?.id || result?.data?._id;

      if (sessionId && formData.files.length > 0) {
        const form = new FormData();
        formData.files.forEach(f => form.append('files', f));
        try {
          await aiApiClient.post(`/api/v1/learning-sessions/${sessionId}/upload-and-analyze`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } catch (err: any) {
          if (err.message?.includes('timeout') || err.code === 'ECONNABORTED') {
            toast('Analysis started — it may take a moment to complete.', { icon: '⏳' });
          } else {
            toast.error('File upload queued but analysis may be delayed');
          }
        }
      }

      toast.success('Session created! Analysis in progress...');
      if (sessionId) {
        navigate(`/student/learning/${sessionId}/analysis`);
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create session');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    updateForm({ files: [...formData.files, ...newFiles] });
  };

  const removeFile = (index: number) => {
    updateForm({ files: formData.files.filter((_, i) => i !== index) });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map(({ id, label, icon: Icon }, i) => (
            <div key={id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  id < currentStep ? 'bg-sage-500/20 text-sage-500'
                  : id === currentStep ? 'bg-coral-500/20 text-coral-500 shadow-glow-blue'
                  : 'bg-white/5 text-stone-600'
                }`}>
                  {id < currentStep ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] mt-1.5 font-medium ${
                  id <= currentStep ? 'text-stone-300' : 'text-stone-600'
                }`}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`hidden sm:block w-12 lg:w-20 h-0.5 mx-2 mt-[-14px] rounded-full transition-all ${
                  id < currentStep ? 'bg-emerald-500/40' : 'bg-white/5'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 lg:p-8 mb-6 animate-fade-in" key={currentStep}>
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Select Course</h2>
            <p className="text-sm text-stone-400 mb-6">Choose the course for this learning session</p>
            {coursesLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 text-coral-500 animate-spin" /></div>
            ) : courses.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-sm">No courses available. A faculty member needs to enroll you first.</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {courses.map((course: any) => (
                  <button key={course.id || course._id} onClick={() => updateForm({ courseId: course.id || course._id, courseName: course.name, assignmentId: '', assignmentTitle: '' })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      formData.courseId === (course.id || course._id)
                        ? 'border-coral-500/50 bg-coral-500/10'
                        : 'border-white/5 bg-white/2 hover:border-white/15'
                    }`}>
                    <p className={`text-sm font-semibold ${formData.courseId === (course.id || course._id) ? 'text-white' : 'text-stone-300'}`}>
                      {course.name}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">{course.code}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Link Assignment (Optional)</h2>
            <p className="text-sm text-stone-400 mb-6">Choose an assignment from this course, or start a self-directed session</p>
            {assignmentsLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 text-coral-500 animate-spin" /></div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                <p className="text-sm text-stone-500">No assignments yet for this course</p>
                <p className="text-xs text-stone-600 mt-1">You can still start a self-directed session.</p>
                <button onClick={() => updateForm({ assignmentId: 'self', assignmentTitle: '', assignmentDescription: '' })}
                  className="mt-4 btn-primary text-sm">
                  Continue Without Assignment
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  {assignments.map((a: any) => (
                    <button key={a._id || a.id} onClick={() => updateForm({ assignmentId: a._id || a.id, assignmentTitle: a.title, assignmentDescription: a.description || '' })}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.assignmentId === (a._id || a.id)
                          ? 'border-coral-500/50 bg-coral-500/10'
                          : 'border-white/5 bg-white/2 hover:border-white/15'
                      }`}>
                      <p className={`text-sm font-semibold ${formData.assignmentId === (a._id || a.id) ? 'text-white' : 'text-stone-300'}`}>
                        {a.title}
                      </p>
                      {a.description && <p className="text-xs text-stone-500 mt-1 line-clamp-2">{a.description}</p>}
                    </button>
                  ))}
                </div>
                {formData.assignmentId && formData.assignmentId !== 'self' && (() => {
                  const selected = assignments.find(a => (a._id || a.id) === formData.assignmentId);
                  if (!selected) return null;
                  const hasDetails = selected.expectedConcepts?.length || selected.learningObjectives?.length || selected.facultyNotes;
                  return hasDetails ? (
                    <div className="p-4 rounded-xl bg-copper-500/8 border border-copper-500/15">
                      <h3 className="text-sm font-semibold text-copper-400 mb-3">Assignment Requirements</h3>
                      {selected.expectedConcepts?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-stone-400 mb-1">Expected Concepts</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selected.expectedConcepts.map((c: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-coral-500/10 text-coral-400">{c}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selected.learningObjectives?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-stone-400 mb-1">Learning Objectives</p>
                          <ul className="list-disc list-inside space-y-0.5">
                            {selected.learningObjectives.map((o: string, i: number) => (
                              <li key={i} className="text-xs text-stone-400">{o}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selected.facultyNotes && (
                        <div>
                          <p className="text-xs font-medium text-stone-400 mb-1">Faculty Notes</p>
                          <p className="text-xs text-stone-400 italic">{selected.facultyNotes}</p>
                        </div>
                      )}
                    </div>
                  ) : null;
                })()}
                <div className="border-t border-white/5 pt-3">
                  <button onClick={() => updateForm({ assignmentId: 'self', assignmentTitle: '', assignmentDescription: '' })}
                    className={`p-3 w-full rounded-xl border text-center text-sm transition-all ${
                      formData.assignmentId === 'self'
                        ? 'border-stone-500/50 bg-stone-500/10 text-stone-300'
                        : 'border-white/5 text-stone-500 hover:border-white/15'
                    }`}>
                    Self-directed session (no assignment)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Learning Objective</h2>
            <p className="text-sm text-stone-400 mb-6">What do you want to learn or improve from this session?</p>
            <textarea value={formData.learningObjective}
              onChange={e => updateForm({ learningObjective: e.target.value })}
              rows={4} className="input-field resize-none"
              placeholder="e.g., I want to understand how balanced BST operations work and when to use them..." />
            <div className="mt-4 p-3 rounded-xl bg-coral-500/8 border border-coral-500/15">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-coral-500 mt-0.5 shrink-0" />
                <p className="text-xs text-coral-400">
                  <strong>Tip:</strong> Be specific about what you want to understand. This helps the AI
                  create more relevant questions during validation.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Upload Assignment</h2>
            <p className="text-sm text-stone-400 mb-6">Upload your work for AI analysis</p>
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-2xl hover:border-coral-500/30 cursor-pointer transition-all bg-white/2">
              <Cloud className="w-10 h-10 text-stone-500 mb-3" />
              <p className="text-sm font-medium text-stone-300">Drop files here or click to upload</p>
              <p className="text-xs text-stone-500 mt-1">PDF, DOCX, TXT, Images • Max 50MB</p>
              <input type="file" multiple accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" />
            </label>
            {formData.files.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-coral-500" />
                      <div>
                        <p className="text-sm text-stone-300">{file.name}</p>
                        <p className="text-[10px] text-stone-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile(i)} className="p-1 text-stone-500 hover:text-terracotta-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">AI Configuration</h2>
            <p className="text-sm text-stone-400 mb-6">Customize how AI will analyze and validate your learning</p>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-2">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {['beginner', 'intermediate', 'advanced'].map(level => (
                    <button key={level} onClick={() => updateForm({ aiConfig: { ...formData.aiConfig, difficulty: level } })}
                      className={`p-3 rounded-xl border text-center capitalize text-sm font-medium transition-all ${
                        formData.aiConfig.difficulty === level
                          ? 'border-coral-500/50 bg-coral-500/10 text-coral-500'
                          : 'border-white/5 text-stone-400 hover:border-white/15'
                      }`}>{level}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-2">Learning Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['visual', 'auditory', 'reading', 'kinesthetic'].map(style => (
                    <button key={style} onClick={() => updateForm({ aiConfig: { ...formData.aiConfig, learningStyle: style } })}
                      className={`p-3 rounded-xl border text-center capitalize text-sm font-medium transition-all ${
                        formData.aiConfig.learningStyle === style
                          ? 'border-coral-500/50 bg-coral-500/10 text-coral-500'
                          : 'border-white/5 text-stone-400 hover:border-white/15'
                      }`}>{style}</button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.aiConfig.adaptiveDifficulty}
                  onChange={e => updateForm({ aiConfig: { ...formData.aiConfig, adaptiveDifficulty: e.target.checked } })}
                  className="w-4 h-4 rounded border-stone-600 bg-lens-surface text-coral-500" />
                <div>
                  <span className="text-sm font-medium text-stone-300">Adaptive Difficulty</span>
                  <p className="text-xs text-stone-500">AI adjusts question difficulty based on your responses</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Review & Start</h2>
            <p className="text-sm text-stone-400 mb-6">Confirm your session details before starting</p>
            <div className="space-y-3">
              {[
                { label: 'Course', value: formData.courseName },
                { label: 'Assignment', value: formData.assignmentId && formData.assignmentId !== 'self' ? formData.assignmentTitle : 'Self-directed' },
                { label: 'Objective', value: formData.learningObjective },
                { label: 'Files', value: `${formData.files.length} file(s) uploaded` },
                { label: 'Difficulty', value: formData.aiConfig.difficulty },
                { label: 'Learning Style', value: formData.aiConfig.learningStyle },
                { label: 'Adaptive', value: formData.aiConfig.adaptiveDifficulty ? 'Enabled' : 'Disabled' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                  <span className="text-sm text-stone-500">{label}</span>
                  <span className="text-sm font-medium text-stone-200 capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => currentStep > 1 ? setCurrentStep(prev => prev - 1) : navigate('/student/dashboard')}
          className="btn-secondary !py-2.5 !px-5 text-sm">
          <ArrowLeft className="w-4 h-4" />
          {currentStep > 1 ? 'Previous' : 'Cancel'}
        </button>
        <button onClick={handleNext} disabled={!canProceed() || submitting}
          className="btn-primary !py-2.5 !px-5 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
          {submitting ? 'Creating...' : currentStep === 6 ? 'Start Learning Session' : 'Continue'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
