"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { PageHeader, Card, Button, Badge } from "@/components/ui";
import { 
  ShieldCheck, Brain, MessageCircle, Sparkles, 
  TrendingUp, BookOpen, Star, ArrowRight, Heart,
  Lightbulb, Target, Award
} from "lucide-react";

export default function LearningAuthenticityReport() {
  const { metrics } = useApp();

  const strengths = [
    { label: "Deep Conceptual Understanding", desc: "You consistently explain concepts in your own words rather than repeating definitions." },
    { label: "Strong Analogical Thinking", desc: "Your use of real-world analogies shows genuine comprehension, not memorisation." },
    { label: "Active Learning Engagement", desc: "You ask clarifying questions and explore concepts from multiple angles." },
  ];

  const improvements = [
    { label: "Polymorphism Understanding", desc: "Try connecting method overriding to real-world scenarios for stronger retention." },
    { label: "Consistent Explanation Depth", desc: "Some concepts need deeper exploration — aim for three concrete examples each time." },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in">
      <PageHeader
        title="Learning Authenticity Report"
        description="This is not a grade. It is a reflection of how authentically you engaged with your learning."
        breadcrumbs={[
          { label: "Dashboard", href: "/student" },
          { label: "Reflection", href: "/student/reflection" },
          { label: "Authenticity Report" },
        ]}
      />

      {/* Hero Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-2xl font-extrabold text-on-surface font-headline-md">{metrics?.authenticity || 94}%</p>
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mt-1">Learning Authenticity</p>
        </Card>
        <Card className="text-center">
          <Brain className="w-8 h-8 text-secondary mx-auto mb-3" />
          <p className="text-2xl font-extrabold text-on-surface font-headline-md">{metrics?.confidence || 88}%</p>
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mt-1">Confidence Index</p>
        </Card>
        <Card className="text-center">
          <MessageCircle className="w-8 h-8 text-tertiary mx-auto mb-3" />
          <p className="text-2xl font-extrabold text-on-surface font-headline-md">{metrics?.originalThoughtRatio || 92}%</p>
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mt-1">Original Thought</p>
        </Card>
        <Card className="text-center">
          <Sparkles className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-extrabold text-on-surface font-headline-md">{metrics?.aiBalance || 94}%</p>
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mt-1">AI Learning Balance</p>
        </Card>
      </div>

      {/* Main Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Strengths */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-on-surface font-headline-sm">Your Strengths</h3>
            </div>
            <div className="space-y-4">
              {strengths.map((s, idx) => (
                <div key={idx} className="flex gap-3 p-4 bg-green-50/50 rounded-xl border border-green-100">
                  <Star className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">{s.label}</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-amber-600" />
              <h3 className="text-lg font-bold text-on-surface font-headline-sm">Opportunities for Growth</h3>
            </div>
            <div className="space-y-4">
              {improvements.map((imp, idx) => (
                <div key={idx} className="flex gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                  <Target className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">{imp.label}</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{imp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: AI Summary */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-bold text-on-surface font-headline-sm">AI Mentor Says</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-on-surface font-body-md leading-relaxed italic">
                &ldquo;You are building genuine understanding. Your explanations show you are thinking, not just repeating. 
                Keep using real-world analogies — they are your superpower. Focus on connecting new concepts to what 
                you already know for even stronger retention.&rdquo;
              </p>
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <p className="text-xs font-semibold text-on-surface flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Confidence grew by 8% this session
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-on-surface font-headline-sm mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Session Summary
            </h3>
            <div className="divide-y divide-outline-variant/20 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-on-surface-variant">Time Spent</span>
                <span className="font-semibold text-on-surface">{metrics?.timeSpent || 45} min</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-on-surface-variant">Hints Used</span>
                <span className="font-semibold text-on-surface">{metrics?.hintsUsed || 1}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-on-surface-variant">AI Suggestions</span>
                <span className="font-semibold text-on-surface">{metrics?.aiSuggestionsApplied || 3}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-on-surface-variant">Concepts Covered</span>
                <span className="font-semibold text-on-surface">3</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-outline-variant/20">
        <Link href="/student/reflection">
          <Button variant="outline" icon={<ArrowRight className="w-4 h-4 rotate-180" />}>
            Back to Reflection
          </Button>
        </Link>
        <Link href="/student/guided">
          <Button icon={<ArrowRight className="w-4 h-4" />}>
            Continue to Guided Learning
          </Button>
        </Link>
      </div>
    </div>
  );
}
