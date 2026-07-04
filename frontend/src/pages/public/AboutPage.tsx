import { motion } from 'framer-motion';
import { Target, Users, Lightbulb, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">About LENS</h1>
          <p className="text-lg text-secondary-500">Redefining how we measure and support genuine learning</p>
        </motion.div>

        <div className="prose prose-lg max-w-none">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-secondary-600 text-lg leading-relaxed mb-8">
            LENS (Learning Evaluation & Navigation System) was born from a simple observation: traditional education measures what students memorize, not what they understand. We built LENS to change that.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            {[
              { icon: Target, title: 'Our Mission', desc: 'To create a world where every learner receives honest, personalized feedback about their genuine understanding.' },
              { icon: Lightbulb, title: 'Our Vision', desc: 'An education system that values depth of understanding over speed of memorization.' },
              { icon: Users, title: 'For Everyone', desc: 'Built for students seeking genuine growth and faculty who want to truly understand their students.' },
              { icon: Globe, title: 'Global Impact', desc: 'Designed to work across cultures, languages, and educational systems worldwide.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white rounded-card border border-secondary-100"
              >
                <item.icon size={24} className="text-primary-500 mb-3" />
                <h3 className="font-semibold text-secondary-900 mb-2">{item.title}</h3>
                <p className="text-sm text-secondary-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-secondary-600 text-lg leading-relaxed">
            We believe that when students receive feedback about their authentic understanding, they become more engaged, more curious, and ultimately more capable learners. LENS is not just a tool; it's a paradigm shift in how we approach education.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
