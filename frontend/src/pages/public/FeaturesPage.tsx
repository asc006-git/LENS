import { motion } from 'framer-motion';
import { Brain, Shield, BarChart3, Users, Zap, BookOpen, Target, TrendingUp, Sparkles } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI Concept Discovery', description: 'Advanced NLP analyzes your assignments to identify key concepts and their relationships automatically.' },
  { icon: Target, title: 'Adaptive Validation', description: 'AI-generated questions adapt in real-time based on your responses, probing deeper where needed.' },
  { icon: Shield, title: 'Learning Authenticity Score', description: 'A proprietary metric that measures genuine understanding versus surface-level memorization.' },
  { icon: BarChart3, title: 'Concept Mastery Tracking', description: 'Visual dashboards showing your progress across all discovered concepts with granular detail.' },
  { icon: BookOpen, title: 'Guided Reflection', description: 'Structured reflection exercises that help consolidate understanding and identify gaps.' },
  { icon: TrendingUp, title: 'Growth Portfolio', description: 'A comprehensive view of your learning journey with achievements, streaks, and analytics.' },
  { icon: Users, title: 'Faculty Intelligence', description: 'Real-time class analytics helping educators identify struggling students before it\'s too late.' },
  { icon: Zap, title: 'AI Teaching Assistant', description: 'AI-powered intervention recommendations tailored to individual student needs.' },
  { icon: Sparkles, title: 'Learning DNA', description: 'Understand your unique learning patterns, strengths, and areas for growth.' },
];

export default function FeaturesPage() {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">Features</h1>
          <p className="text-lg text-secondary-500">Everything you need for authentic learning intelligence</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 bg-white rounded-card border border-secondary-100 hover:shadow-card-hover transition-all"
            >
              <feature.icon size={28} className="text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-secondary-500">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
