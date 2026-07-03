"use client";

import React from "react";
import Link from "next/link";
import { PageHeader, Card, Badge, Button } from "@/components/ui";
import { 
  Brain, TrendingUp, ShieldCheck, MessageCircle, 
  ArrowRight, Sparkles, Clock, CircleCheckBig,
  Info
} from "lucide-react";

export default function LearningReflectionReport() {
  const gauges = [
    { title: "Learning Authenticity", value: "94%", offset: 6, color: "text-primary", trend: "+2% today" },
    { title: "Confidence Index", value: "88%", offset: 12, color: "text-secondary", trend: "Steady growth" },
    { title: "Concept Mastery", value: "72%", offset: 28, color: "text-tertiary", trend: "Solid foundation" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in">
      <PageHeader
        title="Your Learning Reflection"
        description="Great work! Here is how your understanding has grown during today's learning session."
        breadcrumbs={[
          { label: "Dashboard", href: "/student" },
          { label: "Validation", href: "/student/validate" },
          { label: "Reflection" },
        ]}
        actions={
          <Link href="/student/report">
            <Button icon={<ArrowRight className="w-4 h-4" />}>
              View Full Report
            </Button>
          </Link>
        }
      />

      <div className="glass-panel px-4 py-3 rounded-xl border border-outline-variant inline-block">
        <p className="text-xs italic text-on-surface-variant font-body-sm">
          &quot;Learning is not measured by answers remembered, but by concepts understood.&quot;
        </p>
      </div>

      {/* Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gauges.map((g, idx) => (
          <Card key={idx} hover className="flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-4 right-4 text-on-surface-variant/40 hover:text-primary transition-colors cursor-pointer">
              <Info className="w-4 h-4" />
            </div>
            <div className="relative w-24 h-24 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${100 - g.offset}, 100`} className={g.color} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xl font-extrabold font-headline-md ${g.color}`}>{g.value}</span>
              </div>
            </div>
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-label-sm">{g.title}</h3>
            <p className="text-[10px] font-semibold text-green-600 mt-1.5 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> {g.trend}
            </p>
          </Card>
        ))}

        {/* AI Balance */}
        <Card className="flex flex-col items-center justify-center text-center">
          <Brain className="w-10 h-10 text-primary mb-3" />
          <h3 className="text-base font-extrabold text-primary font-headline-sm">Optimal</h3>
          <h4 className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mt-0.5 font-label-sm">AI Balance</h4>
          <p className="text-[10px] text-on-surface-variant mt-2 px-2 font-body-sm leading-relaxed">
            You are using AI to assist understanding, not to bypass it.
          </p>
        </Card>
      </section>

      {/* Details */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-base font-bold font-headline-sm text-on-surface">Session Performance Metrics</h3>
          <div className="divide-y divide-outline-variant/20 text-xs mt-4">
            {[
              { label: "Time Spent Studying", value: "45 Mins" },
              { label: "Original Thought Ratio", value: "92% (High)", positive: true },
              { label: "AI Suggestions Applied", value: "3 suggestions" },
              { label: "Hints Requested", value: "1 hint used" },
            ].map((row, idx) => (
              <div key={idx} className="py-3 flex justify-between">
                <span className="text-on-surface-variant">{row.label}</span>
                <span className={`font-semibold ${row.positive ? "text-green-600 flex items-center gap-0.5" : "text-on-surface"}`}>
                  {row.value}
                  {row.positive && <CircleCheckBig className="w-3.5 h-3.5" />}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold font-headline-sm text-on-surface">AI Coach Evaluation</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed font-body-sm">
              &quot;You demonstrated strong comprehension of inheritance and Object-Oriented programming concepts. Your excellent real-world blueprint analogy showed high originality. Concepts like encapsulation and polymorphism are well-positioned for further study.&quot;
            </p>
          </div>
          <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-2.5 mt-4">
            <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-on-surface font-semibold font-body-sm leading-relaxed">
              Confidence score increased by <strong>+8%</strong> on Inheritance hierarchies. Keep utilising analogies to solidify your structures!
            </p>
          </div>
        </Card>
      </section>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-outline-variant/20">
        <Link href="/student/validate">
          <Button variant="outline" icon={<ArrowRight className="w-4 h-4 rotate-180" />}>
            Back to Validation
          </Button>
        </Link>
        <Link href="/student/report">
          <Button icon={<ArrowRight className="w-4 h-4" />}>
            View Authenticity Report
          </Button>
        </Link>
      </div>
    </div>
  );
}
