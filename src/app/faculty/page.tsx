"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useApp } from "@/lib/context";
import { PageHeader, Card, Badge, Button } from "@/components/ui";
import { 
  Sparkles, TrendingUp, ArrowUp, ArrowDown, 
  Users, BookOpen, Brain, Shield, Send,
  Search, BarChart3
} from "lucide-react";

export default function FacultyDashboard() {
  const { addNotification } = useApp();
  const [reflection, setReflection] = useState(
    "Overall conceptual alignment is high, but there is a clear bottleneck in recursion logic. I plan to introduce visual models next Tuesday to help bridge this gap."
  );
  const [intervention, setIntervention] = useState("Introduce visual models for Recursion");

  const students = [
    { name: "Alex Mercer", cohort: "CS301 • Cohort A", authenticity: 92, confidence: 45, mastery: 78, strongest: "Trees",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA76WFpKiERAiamaOyWCezObEHxQ3gwuMAAvy2IkNaNqRtZKB8hoo8Zt1o4pIYos3GgvUnk6Dj4kJiWpWnvJBfquJq1FCdI0cgTIf_gJhiw0zq5cg6RnbPAK8Y-Xics3sSti4DBn5Ru6SuzhQ9IbYsU0S8yZG_d3Keqmcc-rJ_q6mGdIkhwzegMnyEzIkG__y9f_5Mx0YQ68rNjOpjC6sQm85kR1vbYMDnoSj7_r99tMVO34_QOobXp" },
    { name: "Sarah Chen", cohort: "CS301 • Cohort B", authenticity: 88, confidence: 85, mastery: 52, strongest: "Syntax",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmC6bkVVQy1ykWN8AkhPk8uy3ERJmnFH020wcNEh07DaUVVu_I-aJJd-UNSSWF1cV-WvsI0pJkAoVS95YHORmcSlrRHsA0RKAmWTVKltgO4EDz-Sv5vAJ8s7mA9xYYFmZGwmE0FAng2ltpYuucHzA5mzIiw-u6sqvSI9CQ6xeaFFvnrKyBTkBZ_LO2BZs1zk02_Q2PtJc9lUgiH9gIY9Jp5JizHP66v0SMLF5KxGvxAgSaz6szpTNH" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Faculty Intelligence Dashboard"
        description="3 Active Courses • 142 Students Monitored"
        actions={
          <>
            <Button variant="outline" onClick={() => addNotification("Viewing active sessions logs...")}>
              View Active Sessions
            </Button>
            <Button onClick={() => addNotification("Generating class summary PDF...")} icon={<Sparkles className="w-4 h-4" />}>
              Generate AI Class Report
            </Button>
          </>
        }
      />

      {/* Knowledge Graph + AI Assistant */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-level-1 border border-outline-variant/30 flex flex-col h-[350px] overflow-hidden relative group">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <div className="relative z-10 space-y-1">
            <h2 className="text-lg font-bold text-on-surface font-headline-sm">Classroom Knowledge Graph</h2>
            <p className="text-xs text-on-surface-variant font-body-sm">Real-time conceptual mapping of CS301.</p>
          </div>
          <div className="mt-auto relative z-10 flex gap-3">
            <div className="glass-panel px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 text-[10px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>High Mastery Nodes</span>
            </div>
            <div className="glass-panel px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 text-[10px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Struggle Points</span>
            </div>
          </div>
        </div>

        {/* AI Teaching Assistant */}
        <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl p-6 shadow-level-2 border border-primary/20 flex flex-col h-[350px]">
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-outline-variant/20">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-on-surface font-headline-sm">AI Teaching Assistant</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div className="bg-surface p-4 rounded-xl border border-primary/20 shadow-sm space-y-2">
              <p className="text-xs text-on-surface leading-relaxed font-body-sm">
                <strong>Observation:</strong> 42% of students are struggling with the &apos;Recursion Base Cases&apos; module.
              </p>
              <button onClick={() => addNotification("Revision scheduled for next class session.")}
                className="w-full py-1.5 bg-surface-container-high rounded text-xs font-bold text-primary hover:bg-surface-container-highest transition-colors">
                Schedule AI-Assisted Revision
              </button>
            </div>
            <div className="bg-surface p-4 rounded-xl border border-outline-variant/30 shadow-sm">
              <p className="text-xs text-on-surface leading-relaxed font-body-sm">
                <strong>Insight:</strong> Visual explanations for &apos;Deadlocks&apos; improved average confidence by 19% this week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center text-primary font-bold text-lg">
            12
          </div>
          <div>
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5 font-label-sm">Total Active Sessions</p>
            <div className="flex items-center gap-1 text-on-surface">
              <span className="text-lg font-bold">12</span>
              <span className="text-emerald-600 text-xs flex items-center font-bold"><ArrowUp className="w-3 h-3" /> 2</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" fill="none" r="16" stroke="#E2E8F0" strokeWidth="3" />
              <circle cx="18" cy="18" fill="none" r="16" stroke="#712ae2" strokeWidth="3" strokeDasharray="88 100" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-secondary font-bold text-xs">88%</div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5 font-label-sm">Avg Authenticity</p>
            <div className="flex items-center gap-1 text-on-surface">
              <span className="text-lg font-bold">88%</span>
              <span className="text-emerald-600 text-xs flex items-center font-bold"><ArrowUp className="w-3 h-3" /> 4%</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5 font-label-sm">Confidence Growth</p>
            <span className="text-lg font-bold text-emerald-600">+14%</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" fill="none" r="16" stroke="#E2E8F0" strokeWidth="3" />
              <circle cx="18" cy="18" fill="none" r="16" stroke="#004ac6" strokeWidth="3" strokeDasharray="76 100" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-primary font-bold text-xs">76%</div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5 font-label-sm">Concept Mastery</p>
            <div className="flex items-center gap-1 text-on-surface">
              <span className="text-lg font-bold">76%</span>
              <span className="text-amber-600 text-xs flex items-center font-bold"><ArrowDown className="w-3 h-3" /> 2%</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Heatmap + Reflection */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-bold font-headline-sm text-on-surface mb-4">Class Concept Heatmap</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-outline-variant/30 text-on-surface-variant font-semibold">
                  <th className="py-2.5 w-1/4">Concept</th>
                  <th className="py-2.5 text-center w-1/4">Understanding</th>
                  <th className="py-2.5 text-center w-1/4">Confidence</th>
                  <th className="py-2.5 text-center w-1/4">Mastery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                {[
                  { name: "Recursion", understanding: "45%", confidence: "32%", mastery: "40%", color: "amber" },
                  { name: "Binary Trees", understanding: "82%", confidence: "88%", mastery: "85%", color: "emerald" },
                  { name: "Deadlocks", understanding: "71%", confidence: "65%", mastery: "68%", color: "emerald" },
                  { name: "Graph Theory", understanding: "55%", confidence: "50%", mastery: "58%", color: "amber" },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium">{row.name}</td>
                    <td className="py-3 px-1">
                      <div className={`w-full py-1 bg-${row.color}-100 rounded text-center text-${row.color}-800 font-bold`}>{row.understanding}</div>
                    </td>
                    <td className="py-3 px-1">
                      <div className={`w-full py-1 bg-${row.color}-200 rounded text-center text-${row.color}-800 font-bold`}>{row.confidence}</div>
                    </td>
                    <td className="py-3 px-1">
                      <div className={`w-full py-1 bg-${row.color}-100 rounded text-center text-${row.color}-800 font-bold`}>{row.mastery}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <h3 className="text-base font-bold font-headline-sm text-on-surface mb-4">Faculty Reflection Workspace</h3>
          <div className="space-y-4 flex-grow">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Observations (AI Drafted)</label>
              <textarea value={reflection} onChange={(e) => setReflection(e.target.value)}
                className="w-full h-24 bg-surface border border-outline-variant rounded-xl p-3 text-xs outline-none focus:border-primary transition-all resize-none"
                placeholder="Enter observations..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Planned Interventions</label>
              <div className="relative">
                <Send className="w-4 h-4 absolute left-3 top-3 text-outline" />
                <input value={intervention} onChange={(e) => setIntervention(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-xl text-xs outline-none focus:border-primary transition-all"
                  placeholder="e.g. Introduce visual models for Recursion" type="text" />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-outline-variant/20 mt-4">
            <Button onClick={() => addNotification("Faculty reflection and planned interventions saved!")}>
              Save Reflection
            </Button>
          </div>
        </Card>
      </section>

      {/* Student List */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold font-headline-sm text-on-surface">Student Intelligence Cards</h3>
          <button onClick={() => addNotification("Loading all students lists...")} className="text-xs font-bold text-primary hover:underline">
            View All Students
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map((student, idx) => (
            <Card key={idx} hover>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30">
                  <Image alt={student.name} width={40} height={40} className="w-full h-full object-cover" src={student.avatar} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">{student.name}</h4>
                  <p className="text-[10px] text-on-surface-variant font-semibold">{student.cohort}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Authenticity</span>
                  <span className="font-semibold text-on-surface">{student.authenticity}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Confidence</span>
                  <span className="font-semibold text-amber-600">{student.confidence}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Mastery</span>
                  <span className="font-semibold text-on-surface">{student.mastery}%</span>
                </div>
              </div>
              <div className="pt-3 border-t border-outline-variant/20 flex justify-between items-center text-xs">
                <span className="text-on-surface-variant font-semibold">Strongest: {student.strongest}</span>
                <button onClick={() => addNotification(`Intervention sent to ${student.name}`)} className="text-primary font-bold hover:underline">
                  Intervene
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
