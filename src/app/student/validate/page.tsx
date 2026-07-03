"use client";

import React, { useState } from "react";
import Link from "next/link";
import KnowledgeGraphScene from "@/components/KnowledgeGraphScene";
import { Card, Badge, Button } from "@/components/ui";
import { 
  Lightbulb, BookOpen, CircleCheckBig, Lock, 
  Send, ArrowRight, History, Bot,
  Flag, SlidersHorizontal
} from "lucide-react";

export default function StudentValidationPage() {
  const [response, setResponse] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [mentorMessages, setMentorMessages] = useState<string[]>([
    "You're explaining this concept clearly. Try connecting it with code reusability to strengthen your answer.",
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) return;
    setIsSubmitted(true);
    setMentorMessages((prev) => [
      ...prev,
      "Analysis complete: Excellent analogy! Your response highlights key parent-child inheritance mechanics. Focus score: 92%. Conceptual accuracy: High.",
    ]);
  };

  const handleSuggestion = (type: "analogy" | "example" | "simplify") => {
    const msgs: Record<string, string> = {
      analogy: "Coach Suggestion: Think of a blueprint for a car. A sports car 'inherits' the basic blueprint (engine, wheels) but adds specialized features (turbo, spoiler).",
      example: "Coach Suggestion: Imagine a Class 'Animal' with property 'age'. A subclass 'Dog' inherits 'age' automatically, and adds its own method 'bark()'.",
      simplify: "Coach Suggestion: Simplification: Inheritance is just a way for one piece of code to reuse another piece of code's properties and behaviors automatically.",
    };
    setResponse((prev) => (prev ? prev + "\n\n" + msgs[type] : msgs[type]));
    setMentorMessages((prev) => [...prev, `Added ${type} suggestion to your editor.`]);
  };

  const concepts = [
    { name: "Object-Oriented Prog.", mastery: 92, status: "strong", locked: false },
    { name: "Inheritance", mastery: 40, status: "learning", locked: false },
    { name: "Polymorphism", mastery: 10, status: "pending", locked: true },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-on-surface font-headline-lg mb-2">
          Adaptive Learning Validation
        </h2>
        <p className="text-sm text-on-surface-variant font-body-sm">
          Explain concepts in your own words. This is not a test — it is a guided conceptual discussion to deepen understanding.
        </p>
      </div>

      {/* Progress */}
      <div className="relative py-4 w-full overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-variant -translate-y-1/2 z-0" />
        <div className="absolute top-1/2 left-0 w-[60%] h-0.5 bg-primary z-0 -translate-y-1/2" />
        <div className="relative z-10 flex justify-between">
          {["Blueprint", "Reflection", "Validation", "Report", "Guided"].map((label, idx) => {
            const isComplete = idx < 2;
            const isCurrent = idx === 2;
            return (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                  isCurrent ? "bg-primary text-on-primary ring-4 ring-primary/20 scale-110" :
                  isComplete ? "bg-primary text-on-primary" :
                  "bg-surface border border-outline-variant text-outline"
                }`}>
                  {isComplete ? <CircleCheckBig className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-[10px] font-semibold hidden md:block ${isCurrent ? "text-primary font-bold" : isComplete ? "text-on-surface-variant" : "text-outline"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Three Column Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Concept Navigator */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-base font-bold font-headline-sm text-on-surface">Concept Navigator</h3>
          <div className="flex flex-col gap-3">
            {concepts.map((c, idx) => (
              <div key={idx} className={`p-4 rounded-xl flex items-center gap-3 shadow-sm ${
                c.status === "learning" 
                  ? "bg-primary/5 border-2 border-primary" 
                  : "bg-surface-container-lowest border border-outline-variant/30"
              } ${c.locked ? "opacity-70" : ""}`}>
                <div className="relative w-12 h-12 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" fill="none" r="16" stroke="#E2E8F0" strokeWidth="3" />
                    <circle cx="18" cy="18" fill="none" r="16" stroke={c.status === "strong" ? "#004ac6" : c.status === "learning" ? "#8a4cfc" : "#737686"} strokeWidth="3" strokeDasharray={`${c.mastery} 100`} strokeDashoffset={`${100 - c.mastery}`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {c.locked ? <Lock className="w-4 h-4 text-outline" /> : 
                     c.status === "strong" ? <CircleCheckBig className="w-4 h-4 text-primary" /> :
                     <span className="text-[10px] font-bold text-secondary">{c.mastery}%</span>}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-on-surface truncate">{c.name}</p>
                  <Badge variant={c.status === "strong" ? "success" : c.status === "learning" ? "secondary" : "default"} size="sm" className="mt-1">
                    {c.status === "strong" ? "Strong" : c.status === "learning" ? "Learning" : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Quiz */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="secondary" size="sm" className="mb-1">Current Focus</Badge>
                <h3 className="text-xl font-bold text-on-surface mt-1">Inheritance</h3>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" size="sm" className="flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3" /> Medium
                </Badge>
                <Badge variant="outline" size="sm" className="flex items-center gap-1">
                  <Flag className="w-3 h-3" /> Hierarchy
                </Badge>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 mt-4">
              <p className="text-sm font-semibold text-on-surface leading-relaxed font-body-md">
                &quot;How would you teach the concept of inheritance to a beginner? Feel free to use an analogy or a real-world example.&quot;
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 mt-4">
              <div className="relative">
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/50 focus:border-primary rounded-xl p-4 text-xs font-body-md text-on-surface outline-none transition-all resize-none"
                  placeholder="Start typing your explanation or click suggestions on the right..."
                  rows={5}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button type="button" onClick={() => setShowHint(!showHint)} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-primary transition-colors border border-outline-variant/30">
                    <Lightbulb className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showHint && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700 leading-relaxed font-body-sm">
                  <strong>Hint:</strong> Think of physical traits passed down from parents to children, or a general vehicle blueprint that a truck builds upon.
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-on-surface-variant italic font-semibold flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Focus on explaining concepts clearly.
                </span>
                <button type="submit" disabled={!response.trim()}
                  className="bg-primary text-on-primary font-bold text-xs px-6 py-2.5 rounded-xl hover:opacity-95 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  Submit for Analysis
                </button>
              </div>
            </form>
          </Card>

          {/* Knowledge Graph */}
          <Card className="relative h-64 overflow-hidden flex flex-col justify-end p-4">
            <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider absolute z-10 top-4 left-4 bg-surface/80 px-2 py-1 rounded backdrop-blur-sm shadow-sm">
              Understanding Map
            </h4>
            <div className="absolute inset-0"><KnowledgeGraphScene /></div>
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-outline-variant/30 shadow-sm text-xs font-semibold">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-on-surface">Knowledge Blooming</span>
            </div>
          </Card>
        </div>

        {/* Right: AI Coach */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="flex flex-col justify-between min-h-[300px]">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/20">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center border border-primary-container/20 relative">
                  <Bot className="w-5 h-5 text-primary" />
                  <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-full" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface font-headline-sm">AI Coach</h4>
                  <span className="text-[9px] text-green-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Listening & Analysing
                  </span>
                </div>
              </div>
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {mentorMessages.map((msg, idx) => (
                  <div key={idx} className="bg-surface-container rounded-2xl rounded-tl-sm p-4 text-xs text-on-surface leading-relaxed shadow-sm border border-outline-variant/20 font-body-sm">
                    {msg}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-outline-variant/20">
              <span className="text-[9px] font-bold text-outline uppercase tracking-wider">Coach Suggestions</span>
              {[
                { label: "Provide Analogy", action: "analogy" as const },
                { label: "Show Visual Example", action: "example" as const },
                { label: "Simplify Concept", action: "simplify" as const },
              ].map((s) => (
                <button
                  key={s.action}
                  onClick={() => handleSuggestion(s.action)}
                  className="w-full text-left px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface hover:bg-surface-variant hover:border-primary transition-all text-xs font-semibold text-on-surface-variant flex items-center justify-between group"
                >
                  {s.label}
                  <ArrowRight className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Bottom Actions */}
      <section className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-outline-variant/20">
        <Link href="/student/guided">
          <Button variant="outline" icon={<History className="w-4 h-4" />}>
            Revisit Guided Content
          </Button>
        </Link>
        <Link href="/student/reflection">
          <Button icon={<ArrowRight className="w-4 h-4" />}>
            Continue to Reflection
          </Button>
        </Link>
      </section>
    </div>
  );
}
