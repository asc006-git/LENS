"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import GrowthTreeScene from "@/components/GrowthTreeScene";
import { PageHeader, Card, Badge } from "@/components/ui";
import { 
  Flame, Clock, Sparkles, Award, Brain,
  TrendingUp, ArrowRight, BookOpen
} from "lucide-react";

export default function StudentPortfolio() {
  const badges = [
    { title: "Socratic Scholar", desc: "Earned by achieving a high active thought ratio in validation dialogues.", icon: <Brain className="w-5 h-5" />, color: "bg-amber-50 text-amber-700 border-amber-200", date: "Earned 2 days ago" },
    { title: "Data Master", desc: "Earned by fully validating Binary Search Trees and AVL Rotations.", icon: <BookOpen className="w-5 h-5" />, color: "bg-primary-container/10 text-primary border-primary/20", date: "Earned 1 week ago" },
    { title: "Streak Champ", desc: "Maintained a consistent learning streak for 7 consecutive days.", icon: <Flame className="w-5 h-5" />, color: "bg-red-50 text-red-700 border-red-200", date: "Earned today" },
  ];

  const mastery = [
    { name: "Object-Oriented Programming Principles", level: "94%", status: "Mastered" },
    { name: "Data Structures - Binary Trees & AVL Trees", level: "78%", status: "Strong" },
    { name: "Operating Systems - Process Scheduling", level: "65%", status: "Proficient" },
    { name: "Discrete Mathematics - Graph Theory", level: "40%", status: "Learning" },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <PageHeader
        title="Growth Portfolio"
        description="Your permanent digital learning profile — lifetime statistics, reflection history, and achievements."
        breadcrumbs={[{ label: "Dashboard", href: "/student" }, { label: "Portfolio" }]}
      />

      {/* Profile Hero */}
      <Card padding="lg" className="relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl group-hover:bg-primary-container/20 transition-colors duration-700 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary">
              <Image
                alt="Profile" width={160} height={160}
                className="w-full h-full rounded-full object-cover border-4 border-surface"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALDMVgWd9gzvdYt6srItwT6jJjc7mN9JmR7B8t-CWu_swnYZD-vPDVJSLHeA8Cx_5-0AUXZdJj8tPOKSmJ3KfVaEGSSK_5pw7bWg6mZLYoJwBIZ-zgBRqkkICrsgmM9o8m_uPQXoTOd5SSq4HB54NKaEhdp4zk1bynMmPVtpIzFQGfu1Er5YXahQYtx9t3p2L6n6DBM64I-GalqwfRFLNF4kaiZgNH1tCSmdY2t-5ihlZOhBD6f4hl"
              />
            </div>
          </div>
          <div className="flex-grow text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h2 className="text-3xl font-extrabold text-on-surface font-headline-lg">Adhyatma</h2>
              <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-outline-variant" />
              <p className="text-sm text-on-surface-variant font-body-sm flex items-center justify-center gap-1">
                <BookOpen className="w-4 h-4 text-primary" />
                CS Major • Junior Year
              </p>
            </div>
            <p className="text-sm text-on-surface-variant max-w-xl font-body-sm leading-relaxed">
              Focusing on building deep conceptual understanding in system architecture and intelligence systems. Currently investigating AVL Tree balancing metrics.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs font-semibold">
              <Badge variant="outline" size="md" className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> 7-Day Streak
              </Badge>
              <Badge variant="outline" size="md" className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 24h Study Time
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Knowledge Tree */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <h3 className="text-base font-bold font-headline-sm text-on-surface flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Personalised Knowledge Growth Tree
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed font-body-sm mt-2 mb-4">
              Each branch represents a conceptual subtree. Coloured nodes indicate fully validated concepts. Growth increases as you explain things independently to the AI.
            </p>
            <div className="w-full h-80 rounded-xl overflow-hidden relative border border-outline-variant/20 bg-surface-container-lowest/50 backdrop-blur-sm">
              <GrowthTreeScene />
            </div>
          </Card>
        </div>

        {/* Right: Mastery and Badges */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <h3 className="text-base font-bold font-headline-sm text-on-surface">Concept Mastery</h3>
            <div className="space-y-4 mt-4">
              {mastery.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-on-surface truncate pr-4">{item.name}</span>
                    <span className="text-primary">{item.level}</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: item.level }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-bold font-headline-sm text-on-surface">Earned Credentials</h3>
            <div className="space-y-3 mt-4">
              {badges.map((badge, idx) => (
                <div key={idx} className={`flex items-start gap-3.5 p-3 rounded-xl border ${badge.color}`}>
                  <span className="mt-0.5">{badge.icon}</span>
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-baseline w-full">
                      <p className="text-xs font-bold text-on-surface">{badge.title}</p>
                    </div>
                    <p className="text-[10px] text-on-surface-variant font-body-sm leading-relaxed">{badge.desc}</p>
                    <span className="text-[9px] text-on-surface-variant block pt-1 italic">{badge.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-outline-variant/20">
        <Link href="/student">
          <button className="px-6 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-high text-on-surface-variant font-bold text-xs transition-colors flex items-center gap-1">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Dashboard
          </button>
        </Link>
        <Link href="/student/report">
          <button className="px-8 py-3 rounded-xl bg-primary text-on-primary font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm">
            View Analytics Report
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}
