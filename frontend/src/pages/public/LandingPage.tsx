import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Shield, BarChart3, Users, Sparkles, BookOpen, CheckCircle2, ChevronRight, Zap, Target, TrendingUp } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full mb-8">
              <Sparkles size={16} className="text-primary-500" />
              <span className="text-sm font-medium text-primary-700">AI-Powered Learning Intelligence</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-secondary-900 tracking-tight leading-[1.1] mb-6">
              Learn with AI.{' '}
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Think Independently.
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-secondary-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              LENS evaluates the authenticity of your learning process, not just outcomes.
              Build genuine understanding with AI that adapts to how you think.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white font-semibold rounded-button hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30"
              >
                Start Learning Free
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-secondary-700 font-medium rounded-button border border-secondary-200 hover:border-secondary-300 transition-all"
              >
                See How It Works
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-dialog shadow-elevated border border-secondary-100 p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary-50 rounded-card p-6">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
                    <Brain size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-2">Concept Discovery</h3>
                  <p className="text-sm text-secondary-500">AI identifies what you truly understand from your work</p>
                </div>
                <div className="bg-accent-50 rounded-card p-6">
                  <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center mb-4">
                    <Target size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-2">Adaptive Validation</h3>
                  <p className="text-sm text-secondary-500">Questions that adapt to probe your real understanding</p>
                </div>
                <div className="bg-purple-50 rounded-card p-6">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-2">Growth Tracking</h3>
                  <p className="text-sm text-secondary-500">Watch your authentic learning journey unfold over time</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-24 bg-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              The Problem with Modern Education
            </h2>
            <p className="text-secondary-300 text-lg">
              Students are learning to pass exams, not to understand. Traditional assessment measures memorization, not genuine learning.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { stat: '73%', desc: 'of students admit to surface-level learning strategies' },
              { stat: '2.5x', desc: 'more focus on grades over genuine understanding' },
              { stat: '40%', desc: 'of knowledge is forgotten within weeks of exams' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 bg-white/5 rounded-card border border-white/10"
              >
                <div className="text-4xl font-bold text-primary-400 mb-3">{item.stat}</div>
                <p className="text-secondary-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How LENS Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              How LENS Works
            </h2>
            <p className="text-secondary-500 text-lg">
              A five-stage intelligence pipeline that evaluates authentic learning
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Analyze', desc: 'AI reads your assignment and discovers key concepts', icon: Brain },
              { step: '02', title: 'Blueprint', desc: 'Generate your personalized learning concept map', icon: Target },
              { step: '03', title: 'Validate', desc: 'Adaptive questions probe your true understanding', icon: Shield },
              { step: '04', title: 'Reflect', desc: 'Structured reflection on your learning journey', icon: BookOpen },
              { step: '05', title: 'Report', desc: 'Get your Learning Authenticity Score and insights', icon: BarChart3 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 bg-white rounded-card border border-secondary-100 hover:shadow-card-hover transition-all"
              >
                <div className="text-xs font-bold text-primary-500 mb-3">STEP {item.step}</div>
                <item.icon size={24} className="text-secondary-900 mb-3" />
                <h3 className="font-semibold text-secondary-900 mb-2">{item.title}</h3>
                <p className="text-sm text-secondary-500">{item.desc}</p>
                {i < 4 && (
                  <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 text-secondary-300 hidden md:block" size={20} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl font-bold text-secondary-900 mb-8">
                Built for Students Who Want to <span className="text-primary-500">Truly Learn</span>
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'Know What You Really Understand', desc: 'Get honest feedback on your actual comprehension, not just surface-level recall.' },
                  { title: 'Learn at Your Own Pace', desc: 'AI adapts to your learning style and adjusts difficulty based on your progress.' },
                  { title: 'Build Lasting Knowledge', desc: 'Reflection exercises help solidify understanding and create meaningful connections.' },
                  { title: 'Track Your Growth', desc: 'Visualize your learning journey with authentic metrics that matter.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-card">
                    <CheckCircle2 size={20} className="text-primary-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-secondary-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-secondary-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeUp} className="flex items-center justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                  <div className="w-60 h-60 bg-white rounded-full shadow-elevated flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary-500 mb-2">94%</div>
                      <div className="text-sm text-secondary-500">Learning Authenticity</div>
                      <div className="flex items-center gap-1 justify-center mt-2 text-xs text-primary-600">
                        <TrendingUp size={12} /> +12% this week
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* For Faculty */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Empowering Faculty with <span className="text-accent-500">Intelligence</span>
            </h2>
            <p className="text-secondary-500 text-lg">
              See beyond grades. Understand how your students truly learn.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Student Intelligence', desc: 'Real-time visibility into each student\'s learning process and comprehension levels.' },
              { icon: BarChart3, title: 'Class Analytics', desc: 'Concept-level heatmap showing what the class understands and where gaps exist.' },
              { icon: Zap, title: 'AI Teaching Assistant', desc: 'Get AI-powered intervention recommendations before students fall behind.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-card border border-secondary-100 hover:shadow-card-hover transition-all"
              >
                <item.icon size={28} className="text-primary-500 mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">{item.title}</h3>
                <p className="text-secondary-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 bg-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Platform Features
            </h2>
            <p className="text-secondary-300 text-lg">
              Everything you need for authentic learning intelligence
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Real-time AI Analysis', 'Concept Graphs', 'Adaptive Questions',
              'Learning DNA', 'Achievement System', 'Progress Tracking',
              'Reflection Prompts', 'Export Reports', 'Faculty Dashboard',
              'Intervention Planning', 'Student Profiles', 'API Access',
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 bg-white/5 border border-white/10 rounded-card text-center text-sm font-medium text-secondary-200 hover:bg-white/10 transition-colors"
              >
                {feature}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
              Ready to Learn Authentically?
            </h2>
            <p className="text-lg text-secondary-500 mb-10 max-w-2xl mx-auto">
              Join thousands of students and educators who are transforming how learning is measured and improved.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-10 py-4 bg-primary-500 text-white font-semibold rounded-button hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25 text-lg"
            >
              Get Started Free
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-secondary-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <GraduationCap size={16} className="text-white" />
              </div>
              <span className="font-bold text-secondary-900">LENS</span>
            </div>
            <p className="text-sm text-secondary-500">© 2026 LENS. Learning Evaluation & Navigation System.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-secondary-500 hover:text-secondary-900">Privacy</a>
              <a href="#" className="text-sm text-secondary-500 hover:text-secondary-900">Terms</a>
              <a href="#" className="text-sm text-secondary-500 hover:text-secondary-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function GraduationCap({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/>
    </svg>
  );
}
