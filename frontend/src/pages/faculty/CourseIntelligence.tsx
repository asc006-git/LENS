import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Users, TrendingUp, BarChart3, Plus, X, FileText, Calendar, AlertCircle } from 'lucide-react';
import { useFacultyCourses, useFacultyCourse, useConceptHeatmap, useCreateCourse, useCreateAssignment, useCourseAssignments, useEnrollStudent } from '@/hooks/api/useFaculty';
import ConceptHeatmap from '@/components/charts/ConceptHeatmap';
import toast from 'react-hot-toast';

export default function CourseIntelligence() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: courses, isLoading: coursesLoading } = useFacultyCourses();
  const { data: course } = useFacultyCourse(courseId || '');
  const { data: heatmap } = useConceptHeatmap();
  const createCourse = useCreateCourse();
  const createAssignment = useCreateAssignment();
  const enrollStudent = useEnrollStudent();
  const { data: assignments } = useCourseAssignments(courseId || '');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: '', code: '', description: '', semester: '' });
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', expectedConcepts: '', rubricCriteria: '', learningObjectives: '', facultyNotes: '' });

  const handleCreateCourse = async () => {
    if (!newCourse.name || !newCourse.code) {
      toast.error('Course name and code are required');
      return;
    }
    try {
      await createCourse.mutateAsync(newCourse);
      toast.success('Course created');
      setShowCreateModal(false);
      setNewCourse({ name: '', code: '', description: '', semester: '' });
    } catch {
      toast.error('Failed to create course');
    }
  };

  const handleEnrollStudent = async () => {
    if (!enrollEmail) { toast.error('Enter a student email'); return; }
    setEnrolling(true);
    try {
      const result = await enrollStudent.mutateAsync({ courseId: courseId!, email: enrollEmail });
      toast.success(`Enrolled ${result?.studentName || 'student'}`);
      setEnrollEmail('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to enroll student');
    } finally {
      setEnrolling(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!newAssignment.title) {
      toast.error('Assignment title is required');
      return;
    }
    try {
      await createAssignment.mutateAsync({
        courseId: courseId!,
        title: newAssignment.title,
        description: newAssignment.description,
        dueDate: newAssignment.dueDate || undefined,
        expectedConcepts: newAssignment.expectedConcepts ? newAssignment.expectedConcepts.split(',').map(s => s.trim()) : undefined,
        rubricCriteria: newAssignment.rubricCriteria ? newAssignment.rubricCriteria.split(',').map(s => s.trim()) : undefined,
        learningObjectives: newAssignment.learningObjectives ? newAssignment.learningObjectives.split(',').map(s => s.trim()) : undefined,
        facultyNotes: newAssignment.facultyNotes || undefined,
      });
      toast.success('Assignment created');
      setShowAssignmentModal(false);
      setNewAssignment({ title: '', description: '', dueDate: '', expectedConcepts: '', rubricCriteria: '', learningObjectives: '', facultyNotes: '' });
    } catch {
      toast.error('Failed to create assignment');
    }
  };

  if (courseId && course) {
    const assignmentList = Array.isArray(assignments) ? assignments : [];
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <Link to="/faculty/courses" className="text-xs text-coral-500 hover:text-coral-400 mb-2 inline-block">← Back to Courses</Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{course.name}</h1>
              <p className="text-sm text-stone-400">{course.code} • {course.semester || 'No semester'}</p>
            </div>
            <button onClick={() => setShowAssignmentModal(true)} className="btn-primary text-sm">
              <Plus className="w-4 h-4" /> Create Assignment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="stat-card text-center">
            <Users className="w-6 h-6 text-coral-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{course.studentCount}</p>
            <p className="text-[10px] text-stone-500">Students</p>
          </div>
          <div className="stat-card text-center">
            <TrendingUp className="w-6 h-6 text-sage-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{course.averageAuthenticity ?? 0}%</p>
            <p className="text-[10px] text-stone-500">Avg Authenticity</p>
          </div>
          <div className="stat-card text-center">
            <BarChart3 className="w-6 h-6 text-copper-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{course.conceptMastery ?? 0}%</p>
            <p className="text-[10px] text-stone-500">Concept Mastery</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Concept Mastery Heatmap</h2>
          <div className="h-64 flex items-center justify-center">
            <ConceptHeatmap data={heatmap || []} />
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Enrolled Students ({course.studentCount})</h2>
          <div className="flex items-center gap-3">
            <input className="input-field flex-1" value={enrollEmail} onChange={e => setEnrollEmail(e.target.value)}
              placeholder="student@email.com" />
            <button onClick={handleEnrollStudent} disabled={enrolling} className="btn-primary text-sm shrink-0">
              {enrolling ? 'Enrolling...' : 'Enroll Student'}
            </button>
          </div>
        </div>

        {(course.flaggedSessions?.length ?? 0) > 0 && (
          <div className="glass-card p-6 border-amber-500/15">
            <h2 className="text-sm font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Flagged Submissions ({course.flaggedSessions?.length ?? 0})
            </h2>
            <div className="space-y-2">
              {(course.flaggedSessions ?? []).map((fs: any) => (
                <div key={fs.id} className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-stone-200">{fs.studentName}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{fs.learningObjective || 'No objective'}</p>
                    {fs.reason && <p className="text-xs text-amber-400 mt-1 italic">{fs.reason}</p>}
                  </div>
                  <span className="text-[10px] text-stone-500">{new Date(fs.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Assignments</h2>
          {assignmentList.length === 0 ? (
            <div className="py-6 text-center text-sm text-stone-500">
              No assignments yet. Create one to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {assignmentList.map((a: any) => (
                <div key={a._id || a.id} className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-sage-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-stone-200">{a.title}</h4>
                      {a.description && <p className="text-xs text-stone-500 mt-0.5">{a.description}</p>}
                    </div>
                  </div>
                  {a.dueDate && (
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(a.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {showAssignmentModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-lens-navy border border-white/10 rounded-2xl p-6 w-full max-w-lg animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Create Assignment</h3>
                <button onClick={() => setShowAssignmentModal(false)} className="text-stone-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">Title *</label>
                  <input className="input-field" value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} placeholder="e.g., Linear Regression Paper Analysis" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">Description</label>
                  <textarea className="input-field resize-none" rows={3} value={newAssignment.description} onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })} placeholder="Describe the assignment..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">Due Date</label>
                  <input type="date" className="input-field" value={newAssignment.dueDate} onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} />
                </div>
                <details className="group">
                  <summary className="text-xs font-medium text-stone-400 cursor-pointer hover:text-stone-300">Faculty Expectations (optional)</summary>
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1.5">Expected Concepts (comma-separated)</label>
                      <input className="input-field" value={newAssignment.expectedConcepts} onChange={e => setNewAssignment({ ...newAssignment, expectedConcepts: e.target.value })} placeholder="e.g., Binary Search Trees, Recursion, Big O" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1.5">Rubric Criteria (comma-separated)</label>
                      <input className="input-field" value={newAssignment.rubricCriteria} onChange={e => setNewAssignment({ ...newAssignment, rubricCriteria: e.target.value })} placeholder="e.g., Correctness, Efficiency, Code Quality" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1.5">Learning Objectives (comma-separated)</label>
                      <input className="input-field" value={newAssignment.learningObjectives} onChange={e => setNewAssignment({ ...newAssignment, learningObjectives: e.target.value })} placeholder="e.g., Implement a BST, Analyze time complexity" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1.5">Faculty Notes</label>
                      <textarea className="input-field resize-none" rows={3} value={newAssignment.facultyNotes} onChange={e => setNewAssignment({ ...newAssignment, facultyNotes: e.target.value })} placeholder="Additional context or expectations for this assignment..." />
                    </div>
                  </div>
                </details>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setShowAssignmentModal(false)} className="btn-secondary text-sm">Cancel</button>
                  <button onClick={handleCreateAssignment} className="btn-primary text-sm">Create</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const courseList = Array.isArray(courses) ? courses : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Course Intelligence</h1>
          <p className="text-sm text-stone-400">Monitor learning authenticity and concept mastery across your courses.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Create Course
        </button>
      </div>

      {coursesLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : courseList.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <BookOpen className="w-12 h-12 text-stone-500 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-white mb-2">No courses yet</h3>
          <p className="text-sm text-stone-400 mb-6">Create your first course to get started with tracking student learning.</p>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> Create Course
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseList.map((c: any) => (
            <Link key={c.id} to={`/faculty/courses/${c.id}`}
              className="glass-card p-5 group hover:border-white/15 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-coral-500/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-coral-500" />
                </div>
                <span className="badge badge-blue text-[10px]">{c.code}</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-coral-500 transition-colors">{c.name}</h3>
              <p className="text-xs text-stone-500 mb-3">{c.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">{c.studentCount} students</span>
                <span className="font-semibold text-sage-500">{c.averageAuthenticity ?? 0}%</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-lens-navy border border-white/10 rounded-2xl p-6 w-full max-w-lg animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Create Course</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-stone-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">Course Name *</label>
                  <input className="input-field" value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} placeholder="e.g., Data Structures" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">Course Code *</label>
                  <input className="input-field" value={newCourse.code} onChange={e => setNewCourse({ ...newCourse, code: e.target.value })} placeholder="e.g., CS201" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">Description</label>
                <textarea className="input-field resize-none" rows={3} value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} placeholder="Brief description of the course..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">Semester</label>
                <input className="input-field" value={newCourse.semester} onChange={e => setNewCourse({ ...newCourse, semester: e.target.value })} placeholder="e.g., Fall 2026" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowCreateModal(false)} className="btn-secondary text-sm">Cancel</button>
                <button onClick={handleCreateCourse} className="btn-primary text-sm">Create Course</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
