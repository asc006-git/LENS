import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Brain, Target, BookOpen, LineChart, Zap, TrendingUp,
  GraduationCap, Shield, Users, MessageSquare, FileText, Award,
  ArrowRight, ChevronDown, ChevronUp, CheckCircle2, Monitor,
  Database, Lock, Cloud, Cpu
} from 'lucide-react';

const studentFeatures = [
  { icon: FileText, title: 'Learning Sessions', desc: 'Structured AI-guided learning instead of simple assignment uploads. Every session becomes a deliberate learning experience.', color: 'from-coral-500 to-teal-500' },
  { icon: Brain, title: 'Learning Blueprint', desc: 'AI extracts concepts, objectives, complexity, and learning outcomes before evaluation begins. Students see what AI understands.', color: 'from-amber-400 to-amber-400' },
  { icon: Target, title: 'Adaptive Validation', desc: 'Dynamic questions generated from uploaded work that verify genuine conceptual understanding — not just memorized answers.', color: 'from-sage-500 to-teal-500' },
  { icon: BookOpen, title: 'Reflection Notebook', desc: 'Automatically creates personal learning notes during every session. A growing journal of understanding.', color: 'from-copper-500 to-copper-400' },
  { icon: Zap, title: 'Guided Learning', desc: 'Personalized revision plans based on conceptual weaknesses. AI creates targeted practice to strengthen understanding.', color: 'from-terracotta-500 to-terracotta-400' },
  { icon: TrendingUp, title: 'Growth Portfolio', desc: 'Long-term visualization of academic growth, confidence trends, and concept mastery across all subjects.', color: 'from-plum-500 to-coral-500' },
];

const facultyFeatures = [
  { icon: LineChart, title: 'Learning Intelligence', desc: 'AI-generated insights into class-wide conceptual understanding and learning authenticity trends.' },
  { icon: Users, title: 'Student Analytics', desc: 'Deep journey view for each student showing growth, weak areas, and confidence over time.' },
  { icon: Target, title: 'Concept Heatmaps', desc: 'Visual maps showing which concepts students truly understand versus surface-level knowledge.' },
  { icon: MessageSquare, title: 'Teaching Recommendations', desc: 'AI-generated suggestions for improving pedagogy based on class learning patterns.' },
  { icon: Shield, title: 'Intervention Planning', desc: 'Proactively identifies struggling students and suggests targeted support strategies.' },
  { icon: FileText, title: 'Learning Reports', desc: 'Comprehensive reports replacing manual evaluation with meaningful learning metrics.' },
];

const aiPipeline = [
  { label: 'Submission Understanding', desc: 'AI reads and comprehends the uploaded content' },
  { label: 'Concept Extraction', desc: 'Identifies key concepts and topics' },
  { label: 'Difficulty Detection', desc: 'Estimates complexity of each concept' },
  { label: 'Learning Blueprint', desc: 'Generates personalized learning roadmap' },
  { label: 'Adaptive Questions', desc: 'Creates validation questions per concept' },
  { label: 'Reflection', desc: 'Guides student self-assessment' },
  { label: 'Authenticity Engine', desc: 'Evaluates genuine understanding' },
  { label: 'Confidence Engine', desc: 'Measures learning confidence' },
  { label: 'Recommendation Engine', desc: 'Generates improvement pathways' },
  { label: 'Faculty Intelligence', desc: 'Produces educator insights' },
];

const techStack = [
  { icon: Monitor, label: 'Frontend', tech: 'React + TypeScript' },
  { icon: Database, label: 'Backend', tech: 'Node.js + Express' },
  { icon: Cloud, label: 'Database', tech: 'MongoDB Atlas' },
  { icon: Lock, label: 'Auth', tech: 'JWT + Refresh Tokens' },
  { icon: Cpu, label: 'AI', tech: 'Google Gemini' },
  { icon: Cloud, label: 'Storage', tech: 'Cloudinary' },
];

const faqs = [
  { q: 'Why LENS?', a: 'LENS shifts the focus from detecting AI usage to evaluating genuine understanding. Instead of punishing students for using AI, it helps them learn authentically alongside AI tools.' },
  { q: 'Can students still use AI?', a: 'Absolutely. LENS encourages responsible AI usage. Students can use any AI tool — but LENS evaluates whether they genuinely understood the concepts in their work.' },
  { q: 'Does LENS detect AI-generated content?', a: 'No. LENS is not an AI detector. It evaluates conceptual understanding through adaptive validation, reflection, and learning analytics — a fundamentally different approach.' },
  { q: 'Can universities integrate LENS?', a: 'Yes. LENS is designed as a scalable SaaS platform that can integrate with existing Learning Management Systems and university portals.' },
  { q: 'How is student data protected?', a: 'LENS follows industry-standard security practices including encrypted communications, JWT authentication, role-based access control, and secure cloud storage.' },
];

export default function FeaturesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero */}
      <section className="py-24 relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-coral-500/8 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral-500/10 border border-coral-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-coral-500" />
            <span className="text-sm font-medium text-coral-400">Complete Feature Set</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Everything You Need For{' '}
            <span className="gradient-text">Authentic AI-Assisted Learning</span>
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto mb-8">
            LENS provides a complete educational ecosystem — not individual AI tools.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary">Start Learning <ArrowRight className="w-5 h-5" /></Link>
            <Link to="/contact" className="btn-secondary">Request Faculty Demo</Link>
          </div>
        </div>
      </section>

      {/* Student Features */}
      <section className="py-24 bg-lens-navy-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge badge-blue mb-3">For Students</div>
            <h2 className="section-heading">Student Features</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentFeatures.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="premium-card group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-stone-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge badge-emerald mb-3">For Faculty</div>
            <h2 className="section-heading">Faculty Intelligence</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facultyFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="premium-card group">
                <Icon className="w-8 h-8 text-sage-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-stone-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Pipeline */}
      <section className="py-24 bg-lens-navy-light/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge badge-violet mb-3">AI Engine</div>
            <h2 className="section-heading">AI Learning <span className="gradient-text">Pipeline</span></h2>
            <p className="section-subheading mx-auto">Every AI service executes sequentially for precision</p>
          </div>
          <div className="space-y-3">
            {aiPipeline.map(({ label, desc }, i) => (
              <div key={label} className="glass-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-plum-500 flex items-center justify-center shrink-0 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white">{label}</h4>
                  <p className="text-xs text-stone-400">{desc}</p>
                </div>
                {i < aiPipeline.length - 1 && (
                  <ChevronDown className="w-4 h-4 text-stone-600 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading">Technology <span className="gradient-text">Stack</span></h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {techStack.map(({ icon: Icon, label, tech }) => (
              <div key={label} className="glass-card p-5 text-center group">
                <Icon className="w-8 h-8 text-coral-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-xs text-stone-500 mb-1">{label}</p>
                <p className="text-sm font-semibold text-white">{tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-lens-navy-light/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading">Frequently Asked <span className="gradient-text">Questions</span></h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <span className="text-sm font-semibold text-white">{q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 animate-fade-in">
                    <p className="text-sm text-stone-400 leading-relaxed">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-4">Ready to <span className="gradient-text">Get Started?</span></h2>
          <p className="text-stone-400 mb-8">Experience the future of AI-assisted education</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary !py-3 !px-7">Start Learning <ArrowRight className="w-5 h-5" /></Link>
            <Link to="/contact" className="btn-secondary !py-3 !px-7">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
