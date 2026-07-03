"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { PageHeader, Card, Button, Badge } from "@/components/ui";
import { BookOpen, Clock, Target, ArrowRight, Sparkles, CircleCheckBig, Brain } from "lucide-react";

export default function LearningBlueprintPage() {
  const router = useRouter();
  const { session } = useApp();

  const concepts = [
    { name: "Object-Oriented Programming", difficulty: "Intermediate", outcomes: ["Define OOP paradigms", "Identify class structures"], duration: "20 min" },
    { name: "Inheritance", difficulty: "Intermediate", outcomes: ["Explain parent-child relationships", "Implement class hierarchies"], duration: "30 min" },
    { name: "Polymorphism", difficulty: "Advanced", outcomes: ["Describe method overriding", "Use interfaces effectively"], duration: "25 min" },
  ];

  const totalDuration = concepts.reduce((acc, c) => {
    const mins = parseInt(c.duration);
    return acc + (isNaN(mins) ? 0 : mins);
  }, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in">
      <PageHeader
        title="Your Learning Blueprint"
        description="LENS has analysed your submission and created a personalised learning roadmap."
        breadcrumbs={[
          { label: "Dashboard", href: "/student" },
          { label: "New Session", href: "/student/create" },
          { label: "Blueprint" },
        ]}
        actions={
          <Button onClick={() => router.push("/student/validate")} icon={<ArrowRight className="w-4 h-4" />}>
            Begin Learning
          </Button>
        }
      />

      {/* Summary Card */}
      <Card padding="lg" className="border-l-4 border-l-primary">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary flex-shrink-0">
            <Brain className="w-8 h-8" />
          </div>
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-bold text-on-surface font-headline-md">
              {session?.topic || "Object-Oriented Programming"} 
            </h2>
            <p className="text-sm text-on-surface-variant font-body-md leading-relaxed">
              Based on your submission, LENS has identified <strong>3 core concepts</strong> to validate. 
              Your estimated learning duration is <strong>{totalDuration} minutes</strong>. 
              Focus on explaining concepts in your own words for best results.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-semibold">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{totalDuration} min total</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-semibold">
                <Target className="w-3.5 h-3.5 text-secondary" />
                <span>{concepts.length} concepts</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-semibold">
                <BookOpen className="w-3.5 h-3.5 text-tertiary" />
                <span>Adaptive validation</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Concepts List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-on-surface font-headline-sm">Concepts to Validate</h3>
        {concepts.map((concept, idx) => (
          <Card key={idx} hover>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary flex-shrink-0">
                <CircleCheckBig className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-on-surface font-headline-sm">{concept.name}</h4>
                  <Badge variant={
                    concept.difficulty === "Advanced" ? "warning" : 
                    concept.difficulty === "Intermediate" ? "primary" : "success"
                  } size="sm">
                    {concept.difficulty}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-on-surface-variant">Learning Outcomes:</p>
                  <ul className="list-disc list-inside text-xs text-on-surface-variant space-y-0.5">
                    {concept.outcomes.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-semibold whitespace-nowrap">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {concept.duration}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Recommendation */}
      <Card className="bg-tertiary-container/5 border-tertiary-container/20">
        <div className="flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-tertiary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-tertiary font-headline-sm">AI Recommendation</h4>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed font-body-sm">
              Start with Inheritance — it is the foundational concept for the other topics. 
              Take your time to explain it clearly before moving to Polymorphism.
            </p>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={() => router.push("/student/create")} icon={<ArrowRight className="w-4 h-4 rotate-180" />}>
          Back to Session
        </Button>
        <Button onClick={() => router.push("/student/validate")} icon={<ArrowRight className="w-4 h-4" />}>
          Begin Learning
        </Button>
      </div>
    </div>
  );
}
