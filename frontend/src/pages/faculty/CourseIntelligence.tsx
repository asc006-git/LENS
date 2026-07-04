import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { useFacultyCourses, useFacultyCourse, useConceptHeatmap } from '@/hooks/api/useFaculty';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ConceptHeatmap from '@/components/charts/ConceptHeatmap';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function CourseIntelligence() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: courses } = useFacultyCourses();
  const { data: course } = useFacultyCourse(courseId!);
  const { data: heatmap } = useConceptHeatmap();

  if (courseId && course) {
    return (
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[
          { label: 'Courses', to: '/faculty/courses' },
          { label: course.name },
        ]} />
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">{course.name}</h1>
        <p className="text-secondary-500 mb-8">{course.code} • {course.semester}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <Users size={20} className="mx-auto mb-2 text-primary-500" />
            <div className="text-2xl font-bold text-secondary-900">{course.studentCount}</div>
            <div className="text-xs text-secondary-500">Students</div>
          </Card>
          <Card className="text-center">
            <TrendingUp size={20} className="mx-auto mb-2 text-accent-500" />
            <div className="text-2xl font-bold text-secondary-900">{Math.round(course.averageAuthenticity)}%</div>
            <div className="text-xs text-secondary-500">Avg Authenticity</div>
          </Card>
          <Card className="text-center">
            <BarChart3 size={20} className="mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold text-secondary-900">{Math.round(course.conceptMastery)}%</div>
            <div className="text-xs text-secondary-500">Concept Mastery</div>
          </Card>
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Concept Mastery Heatmap</h2>
          <ConceptHeatmap data={heatmap || []} />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: 'Courses' }]} />
      <h1 className="text-2xl font-bold text-secondary-900 mb-8">Course Intelligence</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses?.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card hover className="cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <BookOpen size={20} className="text-primary-500" />
                <Badge variant="primary">{course.code}</Badge>
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1">{course.name}</h3>
              <p className="text-xs text-secondary-500 mb-3">{course.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-500">{course.studentCount} students</span>
                <span className="font-medium text-primary-600">{Math.round(course.averageAuthenticity)}% authenticity</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
