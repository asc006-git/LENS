"use client";

import React, { useState } from "react";
import Link from "next/link";
import GrowthTreeScene from "@/components/GrowthTreeScene";
import { PageHeader, Card, Badge, Button } from "@/components/ui";
import { 
  Route, CircleCheckBig, Bookmark, RotateCw, 
  Minimize, CirclePlay, Sparkles, Lightbulb,
  TrendingUp, ArrowRight, ChartPie
} from "lucide-react";

export default function GuidedLearningPage() {
  const [explainLevel, setExplainLevel] = useState<"standard" | "simple" | "technical">("standard");

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in">
      <PageHeader
        title="Guided Learning Journey"
        description="Strengthen your understanding one concept at a time with AI-powered guidance."
        breadcrumbs={[
          { label: "Dashboard", href: "/student" },
          { label: "Report", href: "/student/report" },
          { label: "Guided Learning" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Roadmap */}
          <Card>
            <h3 className="text-base font-bold font-headline-sm mb-4 flex items-center gap-2 text-on-surface">
              <Route className="w-5 h-5 text-primary" />
              Roadmap
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              <div className="min-w-[160px] p-4 rounded-xl border border-green-200 bg-green-50/50 relative">
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white shadow-sm">
                  <CircleCheckBig className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-semibold text-green-600 mb-1 font-label-sm uppercase tracking-wider">Mastered</p>
                <p className="text-xs font-bold text-on-surface">Neural Network Basics</p>
              </div>
              <div className="min-w-[180px] p-4 rounded-xl border-2 border-primary bg-primary/5 relative">
                <p className="text-[10px] font-semibold text-primary mb-1 font-label-sm uppercase tracking-wider">In Progress • 45m</p>
                <p className="text-xs font-bold text-on-surface">Backpropagation Math</p>
                <div className="w-full bg-outline-variant/30 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-primary h-full w-3/5 rounded-full" />
                </div>
              </div>
              <div className="min-w-[160px] p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest opacity-75">
                <p className="text-[10px] font-semibold text-on-surface-variant mb-1 font-label-sm uppercase tracking-wider">Upcoming</p>
                <p className="text-xs font-bold text-on-surface">Optimization Algorithms</p>
              </div>
            </div>
          </Card>

          {/* Main Content */}
          <Card padding="lg">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="secondary" size="sm" className="mb-3 inline-block">Core Concept</Badge>
                <h3 className="text-2xl font-bold font-headline-md text-on-surface">Understanding Backpropagation</h3>
                <p className="text-sm text-on-surface-variant font-body-sm mt-1">The mechanism that allows neural networks to learn from errors.</p>
              </div>
              <button className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors">
                <Bookmark className="w-5 h-5 text-outline" />
              </button>
            </div>

            <div className="bg-surface-container-low rounded-xl p-6 mt-6">
              {explainLevel === "standard" && (
                <p className="text-sm text-on-surface font-body-md leading-relaxed mb-4">
                  Imagine a coach correcting a tennis player&apos;s swing. The player takes a shot (forward pass), misses the mark (calculates error), and the coach works backward from the missed shot to adjust the grip, stance, and swing (backpropagation) so the next shot is better.
                </p>
              )}
              {explainLevel === "simple" && (
                <p className="text-sm text-on-surface font-body-md leading-relaxed mb-4">
                  Think of it like tracing your steps. You make a mistake at the end of a maze. To fix it, you walk backwards to see exactly where you made the wrong turn, then change that decision for your next run.
                </p>
              )}
              {explainLevel === "technical" && (
                <p className="text-sm text-on-surface font-body-md leading-relaxed mb-4">
                  Mathematically, backpropagation computes the gradient of the loss function with respect to the network&apos;s weights using the calculus chain rule. Gradients are calculated layer-by-layer, propagating backward from output to input to update parameters via gradient descent.
                </p>
              )}

              <div className="w-full h-48 bg-surface-variant rounded-lg flex items-center justify-center border border-outline-variant/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAILhjdbnmUyxfAX-Fa0PlOxD8ek3CiO4OQzpcvLCs4Ih68TKGhhmVox557JFcPt6gVWgbJZ0ddB4Zm7O6scXA1yLrJeQfGlNlZNeM6mXZBRDso8awKJPCDZ8EdfO1QKVMQhR7kXzJ6Jq5XC-nSFE3pctyAogZUtIUkFENweF5Yb3SHBw3iZ0gKN5z3zeGPH5rcP5X5UfcEv9sjo7QvK2vr0fafOTQtsbs9JqVtd0VoBJWp8i0osKhd')" }}
                />
                <span className="font-semibold text-xs text-primary relative z-10 flex items-center gap-2 bg-surface/85 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm cursor-pointer hover:bg-surface transition-colors">
                  <CirclePlay className="w-4 h-4" />
                  Interactive Visualization
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setExplainLevel(explainLevel === "technical" ? "standard" : "technical")}
                className={`flex-1 bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 text-on-surface font-semibold text-xs py-3 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 ${
                  explainLevel === "technical" ? "border-primary text-primary" : ""
                }`}
              >
                <RotateCw className="w-4 h-4" />
                Explain Differently (Math)
              </button>
              <button
                onClick={() => setExplainLevel(explainLevel === "simple" ? "standard" : "simple")}
                className={`flex-1 bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 text-on-surface font-semibold text-xs py-3 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 ${
                  explainLevel === "simple" ? "border-primary text-primary" : ""
                }`}
              >
                <Minimize className="w-4 h-4" />
                Simplify Further (Analogy)
              </button>
            </div>
          </Card>

          {/* Knowledge Tree */}
          <Card>
            <h3 className="text-base font-bold font-headline-sm mb-4 flex items-center gap-2 text-on-surface">
              <Sparkles className="w-5 h-5 text-primary" />
              Knowledge Growth Visualiser
            </h3>
            <div className="w-full h-72 rounded-xl overflow-hidden relative border border-outline-variant/20 bg-surface-container-lowest/50 backdrop-blur-sm">
              <GrowthTreeScene />
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Coach */}
          <Card>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/20">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface font-headline-sm">LENS Coach</h4>
                <p className="text-[10px] text-on-surface-variant font-label-sm uppercase tracking-wider">Proactive coaching</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-surface p-4 rounded-xl border border-primary/10 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                <p className="text-xs text-on-surface font-body-sm leading-relaxed mb-3">
                  I noticed you spent extra time on the chain rule last session. Should we review a quick application of it before diving into today&apos;s math?
                </p>
                <button onClick={() => setExplainLevel("technical")} className="text-primary font-bold text-xs hover:underline flex items-center gap-0.5">
                  Review Chain Rule <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="bg-surface p-4 rounded-xl border border-secondary/10 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary" />
                <h5 className="text-xs text-secondary font-bold flex items-center gap-1 mb-1 font-label-sm">
                  <Lightbulb className="w-4 h-4" /> Recommendation
                </h5>
                <p className="text-xs text-on-surface-variant font-body-sm leading-relaxed">
                  Try &apos;Deep Learning Mode&apos; for the next visualisation to see the full network context.
                </p>
              </div>
            </div>
          </Card>

          {/* Progress */}
          <Card>
            <h3 className="text-base font-bold font-headline-sm flex items-center gap-2 text-on-surface">
              <ChartPie className="w-5 h-5 text-primary" />
              Session Progress
            </h3>
            <div className="space-y-4 mt-4">
              <div>
                <div className="flex justify-between text-xs text-on-surface-variant font-semibold mb-1">
                  <span>Concept Mastery</span>
                  <span>78%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[78%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-on-surface-variant font-semibold mb-1">
                  <span>Confidence Level</span>
                  <span>High</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[85%] rounded-full" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="py-8 text-center border-t border-outline-variant/20">
        <h3 className="text-xl font-bold font-headline-sm text-on-surface mb-6">Ready for Your Next Challenge?</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/student/validate">
            <Button icon={<ArrowRight className="w-4 h-4" />}>
              Continue to Validation
            </Button>
          </Link>
          <Link href="/student/create">
            <Button variant="outline">
              Start New Session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
