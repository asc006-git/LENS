import { Link } from 'react-router-dom';
import {
  Sparkles, Brain, Target, BookOpen, LineChart, Shield, Users,
  ArrowRight, CheckCircle2, Zap, GraduationCap, TrendingUp,
  FileText, MessageSquare, Award, ChevronRight, Star
} from 'lucide-react';

const workflowSteps = [
  { icon: FileText, label: 'Upload Work', color: 'from-coral-500 to-teal-500' },
  { icon: Brain, label: 'AI Analysis', color: 'from-amber-400 to-amber-400' },
  { icon: Target, label: 'Blueprint', color: 'from-sage-500 to-teal-500' },
  { icon: MessageSquare, label: 'Validation', color: 'from-copper-500 to-copper-400' },
  { icon: BookOpen, label: 'Reflection', color: 'from-terracotta-500 to-terracotta-400' },
  { icon: LineChart, label: 'Report', color: 'from-plum-500 to-coral-500' },
  { icon: Zap, label: 'Guided Learning', color: 'from-teal-500 to-sage-500' },
  { icon: TrendingUp, label: 'Growth Portfolio', color: 'from-amber-400 to-plum-500' },
];

const studentBenefits = [
  { icon: Brain, title: 'Conceptual Understanding', desc: 'Move beyond memorization to genuine comprehension' },
  { icon: Shield, title: 'Reduced AI Dependency', desc: 'Build confidence to think independently' },
  { icon: Target, title: 'Personalized Guidance', desc: 'AI adapts to your unique learning style' },
  { icon: TrendingUp, title: 'Learning Confidence', desc: 'Track and visualize your growth over time' },
  { icon: BookOpen, title: 'Reflection Notebook', desc: 'Auto-generated personal learning notes' },
  { icon: Award, title: 'Growth Portfolio', desc: 'Long-term visualization of academic progress' },
];

const facultyBenefits = [
  { icon: LineChart, title: 'Learning Intelligence', desc: 'AI-powered classroom analytics' },
  { icon: Target, title: 'Concept Heatmaps', desc: 'Identify class-wide knowledge gaps' },
  { icon: Users, title: 'Student Analytics', desc: 'Deep insights into each student\'s journey' },
  { icon: Zap, title: 'Teaching Recommendations', desc: 'AI-generated pedagogy suggestions' },
  { icon: MessageSquare, title: 'Intervention Planning', desc: 'Proactive support for struggling students' },
  { icon: FileText, title: 'Automated Reports', desc: 'Reduce manual evaluation workload' },
];

const features = [
  { icon: Brain, title: 'Learning Blueprint', desc: 'AI extracts concepts, objectives, and learning outcomes from uploaded work', color: 'blue' },
  { icon: Target, title: 'Adaptive Validation', desc: 'Dynamic questions that verify genuine understanding, not just answers', color: 'emerald' },
  { icon: BookOpen, title: 'Reflection Notebook', desc: 'Personal learning journal auto-created during every session', color: 'violet' },
  { icon: TrendingUp, title: 'Growth Portfolio', desc: 'Long-term visualization of academic growth and confidence', color: 'amber' },
  { icon: LineChart, title: 'Learning Intelligence', desc: 'AI-powered analytics for educators and institutions', color: 'cyan' },
  { icon: GraduationCap, title: 'Faculty Dashboard', desc: 'Comprehensive teaching insights and intervention tools', color: 'rose' },
];

const testimonials = [
  {
    quote: "LENS helped me realize I was depending too much on AI. Now I actually understand the concepts I submit.",
    name: "Priya Sharma",
    role: "B.Tech Computer Science, 3rd Year",
    type: "Student"
  },
  {
    quote: "For the first time, I can see which concepts my students truly understand versus what they copied from ChatGPT.",
    name: "Dr. Rajesh Kumar",
    role: "Associate Professor, Computer Science",
    type: "Faculty"
  },
  {
    quote: "LENS provides the kind of learning intelligence we've been looking for — authentic, actionable, and scalable.",
    name: "Prof. Anita Desai",
    role: "Dean of Academics",
    type: "University"
  },
];

const comparisonRows = [
  { current: 'Assignment Upload', lens: 'Structured Learning Session' },
  { current: 'AI Detection', lens: 'Learning Understanding' },
  { current: 'Marks & Grades', lens: 'Growth Metrics & Confidence' },
  { current: 'Static Reports', lens: 'AI Learning Intelligence' },
  { current: 'One-time Evaluation', lens: 'Continuous Improvement' },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral-500/10 border border-coral-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-coral-500" />
                <span className="text-sm font-medium text-coral-400">AI-Powered Learning Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
                Learn with AI.{' '}
                <span className="gradient-text">Think Independently.</span>
              </h1>

              <p className="text-lg text-stone-400 leading-relaxed mb-8 max-w-xl">
                LENS helps students transform AI-assisted work into authentic understanding through
                guided learning, adaptive validation, and personalized academic growth.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/register" className="btn-primary text-base !py-3.5 !px-7">
                  Start Learning Journey
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="btn-secondary text-base !py-3.5 !px-7">
                  Explore Faculty Portal
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-8 text-sm">
                {[
                  { value: 'AI-Powered', label: 'Learning Engine' },
                  { value: 'Adaptive', label: 'Validation' },
                  { value: 'Real-time', label: 'Analytics' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="font-bold text-white">{value}</div>
                    <div className="text-stone-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Animated Workflow */}
            <div className="animate-fade-in-up delay-300 hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-coral-500/20 to-amber-400/20 rounded-3xl blur-xl" />
                <div className="relative glass-card p-8 rounded-3xl">
                  <div className="text-center mb-6">
                    <span className="text-sm font-semibold text-coral-500 uppercase tracking-wider">Learning Session Flow</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {workflowSteps.map(({ icon: Icon, label, color }, i) => (
                      <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/15 transition-all group"
                        style={{ animationDelay: `${i * 100}ms` }}>
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-xs text-stone-500">Step {i + 1}</span>
                          <p className="text-sm font-medium text-stone-200">{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem Statement ── */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              The Challenge in <span className="gradient-text">Modern Education</span>
            </h2>
            <p className="section-subheading mx-auto">
              AI tools have transformed how students work — but are they actually learning?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Current Education */}
            <div className="premium-card border-rose-500/20 hover:border-rose-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-rose-500/15 flex items-center justify-center">
                  <X2 className="w-5 h-5 text-terracotta-500" />
                </div>
                <h3 className="text-lg font-bold text-terracotta-500">Current Education</h3>
              </div>
              <ul className="space-y-3">
                {['Blind AI Dependency', 'Copy-Paste Learning', 'Reduced Critical Thinking', 'No Authenticity Verification', 'Grade-focused Evaluation'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-stone-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* LENS Approach */}
            <div className="premium-card border-sage-500/20 hover:border-emerald-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-sage-500/15 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-sage-500" />
                </div>
                <h3 className="text-lg font-bold text-sage-500">LENS Approach</h3>
              </div>
              <ul className="space-y-3">
                {['Guided AI-Assisted Learning', 'Concept Validation', 'Independent Thinking', 'Learning Authenticity Engine', 'Growth-focused Intelligence'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-stone-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Solution Overview ── */}
      <section className="py-24 relative bg-lens-navy-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-500/10 border border-sage-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-sage-500" />
              <span className="text-sm font-medium text-sage-400">AI Learning Companion</span>
            </div>
            <h2 className="section-heading">
              Not an AI Detector. <br />
              A <span className="gradient-text-success">Learning Intelligence</span> Platform.
            </h2>
            <p className="section-subheading mx-auto">
              LENS evaluates whether students have genuinely understood the concepts — not whether AI was used.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: 'Understands Assignments', desc: 'AI reads and comprehends uploaded academic work' },
              { icon: Target, title: 'Evaluates Understanding', desc: 'Adaptive questions verify conceptual mastery' },
              { icon: TrendingUp, title: 'Builds Confidence', desc: 'Students see their growth over time' },
              { icon: Zap, title: 'Personalized Pathways', desc: 'Custom learning plans for weak areas' },
              { icon: LineChart, title: 'Faculty Intelligence', desc: 'Actionable insights for educators' },
              { icon: Shield, title: 'Learning Authenticity', desc: 'Measures genuine understanding, not AI usage' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-500/20 to-amber-400/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-coral-500" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-stone-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform Workflow ── */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              How <span className="gradient-text">LENS</span> Works
            </h2>
            <p className="section-subheading mx-auto">
              A complete learning journey — from upload to understanding
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-coral-500/20 via-violet-500/20 to-sage-500/20 -translate-y-1/2" />

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {workflowSteps.map(({ icon: Icon, label, color }, i) => (
                <div key={label} className="flex flex-col items-center text-center group">
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-all shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-lens-navy border-2 border-stone-600 text-xs font-bold text-white flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-stone-300">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Student & Faculty Benefits ── */}
      <section className="py-24 relative bg-lens-navy-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Student Benefits */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="badge badge-blue mb-3">For Students</div>
              <h2 className="section-heading">Transform How You Learn</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentBenefits.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="premium-card group">
                  <Icon className="w-8 h-8 text-coral-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Benefits */}
          <div>
            <div className="text-center mb-12">
              <div className="badge badge-emerald mb-3">For Faculty</div>
              <h2 className="section-heading">Teach Smarter, Not Harder</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {facultyBenefits.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="premium-card group">
                  <Icon className="w-8 h-8 text-sage-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Features ── */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="section-subheading mx-auto">
              Everything you need for authentic AI-assisted learning
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => {
              const colorMap: Record<string, string> = {
                blue: 'from-coral-500 to-teal-500 text-coral-500',
                emerald: 'from-sage-500 to-teal-500 text-sage-500',
                violet: 'from-amber-400 to-amber-400 text-copper-400',
                amber: 'from-copper-500 to-copper-400 text-copper-400',
                cyan: 'from-teal-500 to-coral-500 text-teal-400',
                rose: 'from-terracotta-500 to-terracotta-400 text-terracotta-500',
              };
              const [gradient, text] = (colorMap[color] || colorMap.blue).split(' text-');
              return (
                <div key={title} className="glass-card p-6 group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-base font-semibold text-${text} mb-2`}>{title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-stone-500 group-hover:text-coral-500 transition-colors">
                    Learn more <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-24 relative bg-lens-navy-light/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading">
              Why <span className="gradient-text">LENS</span> is Different
            </h2>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="grid grid-cols-2 text-sm font-semibold text-stone-400 uppercase tracking-wider border-b border-white/5">
              <div className="p-4 text-center text-terracotta-500">Current Education</div>
              <div className="p-4 text-center text-sage-500">LENS Platform</div>
            </div>
            {comparisonRows.map(({ current, lens }, i) => (
              <div key={i} className="grid grid-cols-2 border-b border-white/5 last:border-0">
                <div className="p-4 text-center text-sm text-stone-400">{current}</div>
                <div className="p-4 text-center text-sm text-stone-200 font-medium bg-emerald-500/5">{lens}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Trusted by <span className="gradient-text">Learners & Educators</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, role, type }) => (
              <div key={name} className="premium-card">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-copper-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-stone-300 leading-relaxed mb-6 italic">"{quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs text-stone-500">{role}</p>
                  <span className="badge badge-blue mt-2 text-[10px]">{type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-coral-500/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">
            Ready to Transform{' '}
            <span className="gradient-text">Learning?</span>
          </h2>
          <p className="text-lg text-stone-400 mb-10 max-w-xl mx-auto">
            Join the next generation of AI-assisted education where intelligence strengthens learning instead of replacing it.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary text-base !py-3.5 !px-8">
              Start Learning Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="btn-secondary text-base !py-3.5 !px-8">
              Book Faculty Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function X2({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
