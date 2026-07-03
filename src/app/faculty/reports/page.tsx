"use client";

import React from "react";
import { PageHeader, Card, Button, Badge } from "@/components/ui";
import { FileText, Download, Eye, Calendar } from "lucide-react";
import { useApp } from "@/lib/context";

export default function FacultyReportsPage() {
  const { addNotification } = useApp();

  const reports = [
    { name: "Class Performance Summary", date: "2026-07-03", type: "PDF", size: "2.4 MB", status: "Ready" },
    { name: "Concept Mastery Heatmap", date: "2026-07-02", type: "PDF", size: "1.8 MB", status: "Ready" },
    { name: "Student Progress Report", date: "2026-07-01", type: "PDF", size: "3.1 MB", status: "Ready" },
    { name: "AI Intervention Analysis", date: "2026-06-30", type: "PDF", size: "1.2 MB", status: "Generating" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Reports"
        description="Export and view detailed analytics reports for your courses."
        breadcrumbs={[{ label: "Dashboard", href: "/faculty" }, { label: "Reports" }]}
        actions={
          <Button onClick={() => addNotification("Generating new class report...")} icon={<FileText className="w-4 h-4" />}>
            Generate New Report
          </Button>
        }
      />

      <div className="space-y-4">
        {reports.map((report, idx) => (
          <Card key={idx} hover>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-sm font-bold text-on-surface">{report.name}</h4>
                  <Badge variant={report.status === "Ready" ? "success" : "warning"} size="sm">
                    {report.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {report.date}
                  </span>
                  <span>{report.type}</span>
                  <span>{report.size}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" icon={<Eye className="w-3.5 h-3.5" />}>
                  View
                </Button>
                <Button variant="primary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
