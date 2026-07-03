"use client";

import React from "react";
import { PageHeader, Card, Button } from "@/components/ui";
import { Sparkles, Lightbulb, TrendingUp, BookOpen, Users, ArrowRight } from "lucide-react";

export default function AiTeachingAssistantPage() {
  const insights = [
    {
      type: "observation",
      title: "Concept Bottleneck Detected",
      desc: "42% of students are struggling with Recursion Base Cases. Consider a dedicated revision session with visual aids.",
      severity: "high",
    },
    {
      type: "insight",
      title: "Teaching Improvement",
      desc: "Visual explanations for Deadlocks improved average confidence by 19% this week. Continue using visual-first approaches.",
      severity: "positive",
    },
    {
      type: "recommendation",
      title: "Personalised Intervention",
      desc: "Alex Mercer shows low confidence (45%) despite high authenticity (92%). A one-on-one mentoring session is recommended.",
      severity: "medium",
    },
    {
      type: "trend",
      title: "Class-wide Trend",
      desc: "Binary Tree concepts show 82% understanding. Students respond well to practice-based learning for structural topics.",
      severity: "positive",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="AI Teaching Assistant"
        description="Continuous analysis of class-wide trends with actionable educational recommendations."
        breadcrumbs={[{ label: "Dashboard", href: "/faculty" }, { label: "AI Assistant" }]}
        actions={
          <Button icon={<Sparkles className="w-4 h-4" />}>
            Generate New Analysis
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((item, idx) => (
          <Card key={idx} hover className={`border-l-4 ${
            item.severity === "high" ? "border-l-error" :
            item.severity === "medium" ? "border-l-amber-500" :
            "border-l-green-500"
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                item.severity === "high" ? "bg-red-50 text-red-600" :
                item.severity === "medium" ? "bg-amber-50 text-amber-600" :
                "bg-green-50 text-green-600"
              }`}>
                {item.type === "observation" ? <Lightbulb className="w-5 h-5" /> :
                 item.type === "insight" ? <TrendingUp className="w-5 h-5" /> :
                 item.type === "recommendation" ? <Users className="w-5 h-5" /> :
                 <BookOpen className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-on-surface">{item.title}</h4>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.severity === "high" ? "bg-red-50 text-red-700" :
                    item.severity === "medium" ? "bg-amber-50 text-amber-700" :
                    "bg-green-50 text-green-700"
                  }`}>
                    {item.severity === "high" ? "Action Needed" :
                     item.severity === "medium" ? "Review" : "Positive"}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-primary font-headline-sm">AI Summary</h4>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Overall class health is positive. Two students may need additional support. 
              Consider scheduling a revision session for Recursion concepts this week.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
