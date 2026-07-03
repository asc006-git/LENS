"use client";

import React, { useState } from "react";
import { PageHeader, Card, Button, Badge } from "@/components/ui";
import { Shield, Users, BookOpen, CircleCheckBig, Clock, ArrowRight, Plus } from "lucide-react";
import { useApp } from "@/lib/context";

export default function FacultyInterventionsPage() {
  const { addNotification } = useApp();
  const [newIntervention, setNewIntervention] = useState("");

  const interventions = [
    { title: "Recursion Visual Workshop", type: "Group Session", students: 18, status: "Scheduled", date: "2026-07-05" },
    { title: "Alex Mercer - Confidence Building", type: "One-on-One", students: 1, status: "Pending", date: "2026-07-06" },
    { title: "Graph Theory Practice Set", type: "Assignment", students: 42, status: "Active", date: "2026-07-04" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Interventions"
        description="Create and manage personalised intervention plans for your students."
        breadcrumbs={[{ label: "Dashboard", href: "/faculty" }, { label: "Interventions" }]}
      />

      <Card>
        <div className="space-y-4">
          <h3 className="text-base font-bold text-on-surface font-headline-sm flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Create New Intervention
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newIntervention}
              onChange={(e) => setNewIntervention(e.target.value)}
              placeholder="e.g., Introduce visual models for Recursion"
              className="flex-1 bg-surface border border-outline-variant rounded-xl px-4 py-3 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <Button
              onClick={() => {
                if (newIntervention.trim()) {
                  addNotification(`Intervention created: ${newIntervention}`);
                  setNewIntervention("");
                }
              }}
              icon={<Plus className="w-4 h-4" />}
            >
              Create
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {interventions.map((intervention, idx) => (
          <Card key={idx} hover>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                intervention.type === "One-on-One" ? "bg-amber-50 text-amber-600" :
                intervention.type === "Group Session" ? "bg-primary/10 text-primary" :
                "bg-green-50 text-green-600"
              }`}>
                {intervention.type === "One-on-One" ? <Users className="w-5 h-5" /> :
                 intervention.type === "Group Session" ? <BookOpen className="w-5 h-5" /> :
                 <Shield className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-sm font-bold text-on-surface">{intervention.title}</h4>
                  <Badge variant={
                    intervention.status === "Active" ? "success" :
                    intervention.status === "Scheduled" ? "primary" : "warning"
                  } size="sm">
                    {intervention.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                  <span>{intervention.type}</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {intervention.students} students
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {intervention.date}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
