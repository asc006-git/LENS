import { Link } from 'react-router-dom';
import {
  Sparkles, Brain, Target, BookOpen, TrendingUp, Shield,
  ArrowRight, Lightbulb, Heart, Globe, Users, Zap, Award,
  CheckCircle2, GraduationCap
} from 'lucide-react';

const timeline = [
  { phase: 'Phase 1', title: 'Foundation', desc: 'Core platform, AI engine, student dashboard, learning sessions', status: 'current' },
  { phase: 'Phase 2', title: 'Intelligence', desc: 'Advanced analytics, faculty intelligence, intervention planning', status: 'upcoming' },
  { phase: 'Phase 3', title: 'Scale', desc: 'Institution onboarding, LMS integration, mobile apps', status: 'future' },
  { phase: 'Phase 4', title: 'Research', desc: 'Published research, learning science integration, global expansion', status: 'future' },
];

const values = [
  { icon: Brain, title: 'Learning First', desc: 'Every feature exists to strengthen understanding, not automate thinking' },
  { icon: Heart, title: 'Student Centered', desc: 'Positive reinforcement and guided improvement over surveillance' },
  { icon: Shield, title: 'Responsible AI', desc: 'AI as a mentor, not a substitute for human reasoning' },
  { icon: Lightbulb, title: 'Continuous Growth', desc: 'Learning as a journey, not a submission deadline' },
  { icon: Users, title: 'Collaborative', desc: 'Students and faculty working together through shared intelligence' },
  { icon: Globe, title: 'Accessible', desc: 'Designed for students across all learning styles and backgrounds' },
];

export default function AboutPage() {
  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 mb-6">
            <Sparkles className="w-4 h-4 text-copper-400" />
            <span className="text-sm font-medium text-copper-400">Our Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
            AI Should Guide Learning,{' '}
            <span className="gradient-text">Not Replace It</span>
          </h1>
          <p className="text-lg text-stone-400 leading-relaxed max-w-2xl mx-auto">
            LENS was born from a simple observation: students are using AI to complete work without
            understanding it. We believe there's a better way.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-lens-navy-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="premium-card border-coral-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-coral-500/15 flex items-center justify-center">
                  <Target className="w-5 h-5 text-coral-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Vision</h2>
              </div>
              <p className="text-stone-300 leading-relaxed">
                To build the world's most trusted AI-powered Learning Intelligence Platform that
                transforms Artificial Intelligence from a content generation tool into a personalized
                academic mentor, enabling students to develop authentic understanding, independent
                thinking, and lifelong learning skills.
              </p>
            </div>
            <div className="premium-card border-sage-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-sage-500/15 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-sage-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Mission</h2>
              </div>
              <p className="text-stone-300 leading-relaxed">
                To create a balanced educational ecosystem where AI enhances learning without
                diminishing human reasoning. By combining adaptive learning, authenticity evaluation,
                and continuous academic growth tracking, LENS redefines how institutions measure and
                nurture genuine learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading">The Problem We're <span className="gradient-text">Solving</span></h2>
          </div>
          <div className="glass-card p-8 lg:p-10">
            <div className="space-y-6 text-stone-300 leading-relaxed">
              <p>
                Large Language Models like ChatGPT, Gemini, and Copilot have become integral to
                students' daily academic activities. While these tools improve productivity, their
                unrestricted use has created a growing educational challenge.
              </p>
              <p>
                Students increasingly rely on AI to complete work without developing genuine
                conceptual understanding, critical thinking, or independent reasoning skills.
                Current solutions focus on <span className="text-terracotta-500 font-medium">detecting AI usage</span> —
                but that approach is becoming unreliable and counterproductive.
              </p>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-coral-500/8 border border-coral-500/15">
                <Lightbulb className="w-6 h-6 text-coral-500 shrink-0 mt-0.5" />
                <p className="text-coral-400">
                  <strong>LENS takes a different approach:</strong> Instead of asking "Was AI used?",
                  we ask "Did the student genuinely understand the concepts?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-lens-navy-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">Our <span className="gradient-text">Values</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="premium-card group">
                <Icon className="w-8 h-8 text-copper-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-stone-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">Expected <span className="gradient-text-success">Impact</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: GraduationCap, value: 'Students', label: 'Better conceptual understanding' },
              { icon: Users, value: 'Faculty', label: 'Actionable learning intelligence' },
              { icon: Award, value: 'Institutions', label: 'Evidence-based academic decisions' },
              { icon: Globe, value: 'Education', label: 'A new paradigm for AI in learning' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={value} className="text-center glass-card p-6">
                <Icon className="w-10 h-10 text-sage-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">{value}</h3>
                <p className="text-sm text-stone-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-24 bg-lens-navy-light/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">Future <span className="gradient-text">Roadmap</span></h2>
          </div>
          <div className="space-y-4">
            {timeline.map(({ phase, title, desc, status }) => (
              <div key={phase} className={`premium-card flex items-start gap-4 ${
                status === 'current' ? 'border-coral-500/30' : 'border-white/5'
              }`}>
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                  status === 'current'
                    ? 'bg-coral-500/20 text-coral-500'
                    : 'bg-white/5 text-stone-500'
                }`}>
                  {phase.split(' ')[1]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{title}</h3>
                    {status === 'current' && (
                      <span className="badge badge-blue text-[10px]">In Progress</span>
                    )}
                  </div>
                  <p className="text-sm text-stone-400 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-4">
            Join the <span className="gradient-text">Learning Revolution</span>
          </h2>
          <p className="text-stone-400 mb-8">
            Be part of a new educational paradigm where AI strengthens learning.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary !py-3 !px-7">
              Start Learning Journey <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="btn-secondary !py-3 !px-7">
              Request Faculty Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
