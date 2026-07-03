"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import IntellectSphereScene from "@/components/IntellectSphereScene";
import { useApp } from "@/lib/context";
import { PageHeader, Card, Badge } from "@/components/ui";
import { Check, Loader2, Eye, Target, Sparkles, ArrowRight } from "lucide-react";
import { ANALYSIS_STEPS } from "@/lib/constants";

export default function LearningAnalysisPage() {
  const router = useRouter();
  const { advanceAnalysis, analysisComplete, analysisProgress } = useApp();
  const [current, setCurrent] = useState(analysisProgress || 0);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    if (analysisProgress === 0) {
      // Start simulation
      const timers = ANALYSIS_STEPS.slice(1).map((_, idx) => {
        const stepIdx = idx + 1;
        return setTimeout(() => {
          setCompleted((prev) => [...prev, stepIdx]);
          setCurrent(stepIdx);
          advanceAnalysis();
        }, (idx + 1) * 1500);
      });

      // Mark first step as complete immediately
      setCompleted([0]);
      setCurrent(1);

      return () => timers.forEach(clearTimeout);
    }
  }, []);

  const isDone = completed.includes(ANALYSIS_STEPS.length - 1);

  useEffect(() => {
    if (isDone) {
      const timer = setTimeout(() => {
        router.push("/student/blueprint");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isDone, router]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-fade-in">
      <div className="text-center space-y-4">
        <Badge variant="primary" size="md">
          <span className="relative flex h-2 w-2 mr-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          AI Engine Active
        </Badge>
        <h2 className="text-4xl font-extrabold text-on-surface font-display-lg leading-tight">
          {isDone ? "Personalised Blueprint Ready!" : "Analysing Your Submission"}
        </h2>
        <p className="text-sm text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-body-sm">
          LENS is analysing your submission to structure an adaptive learning experience tailored to your understanding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Timeline */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-level-1 relative min-h-[380px]">
          <h3 className="text-base font-bold font-headline-sm mb-6 flex items-center gap-2 border-b border-outline-variant/20 pb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            Analysis Protocol
          </h3>
          <div className="relative pl-6 space-y-6">
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-outline-variant/30 rounded-full" />
            <div
              className="absolute left-2.5 top-2 w-0.5 bg-primary rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(37,99,235,0.6)]"
              style={{ height: `${((completed.length + 0.5) / ANALYSIS_STEPS.length) * 100}%` }}
            />
            {ANALYSIS_STEPS.map((step) => {
              const isStepCompleted = completed.includes(step.num - 1);
              const isCurrent = current === step.num - 1;
              return (
                <div key={step.num} className={`flex items-start gap-4 transition-opacity duration-300 ${isStepCompleted || isCurrent ? "opacity-100" : "opacity-40"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold z-10 relative ${
                    isStepCompleted ? "bg-green-500 text-white" :
                    isCurrent ? "bg-primary text-on-primary ring-4 ring-primary/20" :
                    "bg-surface-container-high border border-outline-variant text-on-surface-variant"
                  }`}>
                    {isStepCompleted ? <Check className="w-3.5 h-3.5" /> :
                     isCurrent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                     step.num}
                  </div>
                  <div className="space-y-0.5">
                    <p className={`text-xs font-bold ${isCurrent ? "text-primary" : "text-on-surface"}`}>{step.name}</p>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed font-body-sm">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Scene & Insights */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 relative h-64 overflow-hidden shadow-level-1 flex flex-col justify-end">
              <div className="absolute inset-0"><IntellectSphereScene /></div>
              <div className="absolute top-4 left-4 bg-surface/85 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-on-surface flex items-center gap-1.5 shadow-sm">
                <Eye className="w-3.5 h-3.5 animate-pulse text-primary" />
                Live Processing
              </div>
            </div>
            <Card className="flex flex-col justify-center space-y-4">
              <div>
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1 font-label-sm">
                  Detected Subject
                </p>
                <p className="text-lg font-bold text-on-surface font-headline-sm">
                  Object-Oriented Programming
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2 font-label-sm">
                  Primary Concepts
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Inheritance", "Polymorphism", "Encapsulation"].map((c, i) => (
                    <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      i === 0 ? "bg-primary/10 text-primary border border-primary/20" :
                      "bg-surface-container-high text-on-surface-variant border border-outline-variant/20"
                    }`}>
                      {c}
                    </span>
                  ))}
                  {!isDone && (
                    <span className="px-2.5 py-1 bg-surface-container-high border border-dashed border-outline-variant/30 rounded-full text-xs font-semibold text-on-surface-variant animate-pulse">
                      Evaluating...
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <Card className="border-l-4 border-l-secondary relative overflow-hidden">
            <div className="flex items-start gap-4">
              <Target className="w-6 h-6 text-secondary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1 font-label-sm">
                  Formulated Learning Objective
                </h4>
                <p className="text-base font-bold text-on-surface font-headline-sm leading-relaxed">
                  Understanding OOP concepts and applying inheritance structures in Java architecture.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-surface/90 backdrop-blur-md border-t border-outline-variant/30 px-8 py-4 flex justify-between items-center z-40 shadow-md">
        <div className="hidden sm:flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider font-label-sm">Est. Duration</span>
            <span className="text-lg font-bold text-on-surface font-headline-sm">45 Mins</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider font-label-sm">Activities</span>
            <span className="text-lg font-bold text-on-surface font-headline-sm">12 Nodes</span>
          </div>
        </div>

        {isDone ? (
          <button
            onClick={() => router.push("/student/blueprint")}
            className="w-full sm:w-auto px-8 py-3 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-level-2 hover:opacity-90 transition-all flex items-center justify-center gap-1.5 animate-bounce-slow"
          >
            View Your Learning Blueprint
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            disabled
            className="w-full sm:w-auto px-8 py-3 bg-surface-container-high text-on-surface-variant font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed opacity-80"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing Environment...
          </button>
        )}
      </div>
    </div>
  );
}
