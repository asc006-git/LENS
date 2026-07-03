"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Button, Badge } from "@/components/ui";
import { BookOpen, Users, TrendingUp, ArrowRight, Search, Filter } from "lucide-react";

export default function FacultyCoursesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const courses = [
    {
      id: "cs301",
      name: "Data Structures",
      code: "CS301",
      instructor: "Prof. Sharma",
      students: 48,
      avgMastery: 76,
      avgConfidence: 72,
      status: "Active",
      concepts: 8,
    },
    {
      id: "cs402",
      name: "Operating Systems",
      code: "CS402",
      instructor: "Prof. Sharma",
      students: 42,
      avgMastery: 68,
      avgConfidence: 65,
      status: "Active",
      concepts: 6,
    },
    {
      id: "cs201",
      name: "Discrete Mathematics",
      code: "CS201",
      instructor: "Prof. Sharma",
      students: 52,
      avgMastery: 71,
      avgConfidence: 70,
      status: "Completed",
      concepts: 5,
    },
  ];

  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Courses"
        description="Manage and analyse your courses with AI-powered insights."
        breadcrumbs={[{ label: "Dashboard", href: "/faculty" }, { label: "Courses" }]}
        actions={
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-xl text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none w-56"
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((course) => (
          <Card key={course.id} hover>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-on-surface font-headline-sm">{course.name}</h3>
                  <Badge variant={course.status === "Active" ? "success" : "default"}>{course.status}</Badge>
                  <span className="text-xs text-on-surface-variant font-semibold">{course.code}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {course.students} students
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-green-600" /> {course.avgMastery}% avg mastery
                  </span>
                  <span>{course.concepts} concepts</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/faculty")}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                View Analytics
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
