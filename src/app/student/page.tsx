"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { Card, Badge, StatCard } from "@/components/ui";
import { 
  Play, History, TrendingUp, School, Scale, 
  ArrowRight, Sparkles, Flame, Brain, Target,
  CircleCheckBig, BookOpen, Route
} from "lucide-react";

export default function StudentDashboard() {
  const { user, metrics } = useApp();

  const stats = [
    { label: "Learning Authenticity", value: "88%", icon: <CircleCheckBig className="w-6 h-6" />, trend: { value: "+2%", positive: true } },
    { label: "Confidence Index", value: "72%", icon: <TrendingUp className="w-6 h-6" />, trend: { value: "+5%", positive: true } },
    { label: "Concept Mastery", value: "65%", icon: <Brain className="w-6 h-6" />, trend: { value: "+12%", positive: true } },
    { label: "AI Learning Balance", value: "94%", icon: <Scale className="w-6 h-6" />, trend: { value: "Optimal", positive: true } },
  ];

  const courses = [
    {
      title: "Data Structures",
      desc: "Currently focusing on Trees and Graphs. You struggled slightly with AVL tree rotations last session.",
      progress: 45,
      status: "In Progress",
      readiness: "High",
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-primary-fixed text-primary",
      btnText: "Continue",
      href: "/student/guided",
    },
    {
      title: "Operating Systems",
      desc: "Memory management and paging algorithms. Readiness assessment indicates need for review.",
      progress: 22,
      status: "Review Suggested",
      readiness: "Medium",
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-secondary-fixed text-secondary",
      btnText: "Start Review",
      href: "/student/guided",
    },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Welcome */}
      <section className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge variant="primary" size="sm">July 3, 2026</Badge>
            <span className="flex items-center gap-1 text-tertiary font-semibold text-xs">
              <Flame className="w-3.5 h-3.5" />
              7-Day Streak
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-on-surface font-headline-lg">
            Good Morning, {user?.name || "Adhyatma"}
          </h2>
          <p className="text-base text-on-surface-variant font-body-md">
            Let&apos;s continue building authentic understanding today.
          </p>
          <div className="glass-panel px-4 py-2.5 rounded-xl border border-outline-variant mt-2 inline-block">
            <p className="text-xs italic text-on-surface-variant font-body-sm">
              &quot;AI can guide your journey, but your understanding defines your destination.&quot;
            </p>
          </div>
        </div>
        <div className="flex gap-3 shrink-0 pt-2 lg:pt-0">
          <Link href="/student/create">
            <button className="px-5 py-3 bg-primary text-on-primary font-semibold text-xs rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm">
              <Play className="w-4 h-4" />
              Start New Learning Session
            </button>
          </Link>
          <Link href="/student/guided">
            <button className="px-5 py-3 bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-variant transition-all border border-outline-variant/50 flex items-center gap-1.5">
              <History className="w-4 h-4" />
              Continue Previous Session
            </button>
          </Link>
        </div>
      </section>

      {/* KPI Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </section>

      {/* Today's Learning */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold font-headline-sm text-on-surface">Today&apos;s Learning Journey</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course, idx) => (
            <Card key={idx} hover className="flex flex-col group">
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${course.color}`}>
                      {course.icon}
                    </div>
                    <Badge variant="default" size="sm">{course.status}</Badge>
                  </div>
                  <h4 className="text-xl font-bold font-headline-md text-on-surface mb-2">{course.title}</h4>
                  <p className="text-sm text-on-surface-variant mb-6 font-body-sm leading-relaxed">{course.desc}</p>
                </div>
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                    <span>Course Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-outline-variant/30 bg-surface-container-low/50 flex justify-between items-center group-hover:bg-primary-container/5 transition-colors mt-4 -mx-6 -mb-6 rounded-b-2xl">
                <div className="flex items-center gap-1.5 text-primary font-semibold text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Readiness: {course.readiness}</span>
                </div>
                <Link href={course.href} className="text-primary font-bold text-xs hover:underline flex items-center gap-1">
                  {course.btnText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Growth */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-level-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold font-headline-sm text-on-surface mb-6">Weekly Growth Overview</h3>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="40" stroke="#F1F5F9" strokeWidth="8" />
                  <circle cx="50" cy="50" fill="transparent" r="40" stroke="#004ac6" strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" strokeWidth="8" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-on-surface font-headline-md">75%</span>
                  <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Mastery</span>
                </div>
              </div>
              <div className="flex-grow space-y-4 w-full">
                <div>
                  <div className="flex justify-between text-xs text-on-surface-variant mb-1 font-semibold">
                    <span>Data Structures Confidence</span>
                    <span className="text-green-600 flex items-center gap-0.5">
                      +18% <TrendingUp className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[82%] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-on-surface-variant mb-1 font-semibold">
                    <span>Operating Systems Confidence</span>
                    <span className="text-tertiary flex items-center gap-0.5">
                      -2% <TrendingUp className="w-3 h-3 rotate-180" />
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-tertiary h-full w-[45%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-tertiary-container/10 border border-tertiary-container/20 rounded-xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-tertiary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-tertiary font-headline-sm mb-0.5">AI Insights</p>
              <p className="text-xs text-on-surface-variant font-body-sm leading-relaxed">
                Your confidence in Data Structures has improved by 18% this week. Continue practising recursion explanations for even stronger conceptual consistency.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <Card>
            <h3 className="text-lg font-bold font-headline-sm text-on-surface mb-4">Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <Flame className="w-6 h-6 text-amber-600" />
                <div>
                  <p className="text-xs font-bold text-on-surface font-headline-sm">7-Day Learning Streak</p>
                  <p className="text-[10px] text-on-surface-variant">Consistent daily progress</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                <Brain className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-xs font-bold text-on-surface font-headline-sm">Independent Thinker</p>
                  <p className="text-[10px] text-on-surface-variant">High original thought ratio</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="bg-primary rounded-2xl p-6 shadow-level-2 text-on-primary relative overflow-hidden flex flex-col justify-between flex-grow">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -right-8 top-12 w-16 h-16 bg-white/10 rounded-full" />
            <div className="relative z-10 space-y-2 mb-6">
              <h3 className="text-lg font-bold font-headline-sm">Next Best Step</h3>
              <p className="text-xs text-primary-fixed-dim font-body-sm leading-relaxed">
                Recommended based on your recent activity.
              </p>
              <div className="bg-white/15 rounded-xl p-4 border border-white/20">
                <p className="text-xs font-bold font-headline-sm">Practice Explaining Binary Trees</p>
                <div className="flex items-center gap-1.5 text-[10px] text-primary-fixed-dim mt-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>~15 mins</span>
                </div>
              </div>
            </div>
            <Link href="/student/validate" className="relative z-10 w-full">
              <button className="w-full py-2.5 bg-white text-primary font-bold text-xs rounded-xl hover:opacity-90 transition-all">
                Start Practice
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
