"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PageHeader, Card, Badge, Button } from "@/components/ui";
import { Search, ArrowRight, TrendingUp, ShieldCheck } from "lucide-react";

export default function FacultyStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const students = [
    { name: "Alex Mercer", cohort: "CS301 • Cohort A", authenticity: 92, confidence: 45, mastery: 78, strongest: "Trees", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA76WFpKiERAiamaOyWCezObEHxQ3gwuMAAvy2IkNaNqRtZKB8hoo8Zt1o4pIYos3GgvUnk6Dj4kJiWpWnvJBfquJq1FCdI0cgTIf_gJhiw0zq5cg6RnbPAK8Y-Xics3sSti4DBn5Ru6SuzhQ9IbYsU0S8yZG_d3Keqmcc-rJ_q6mGdIkhwzegMnyEzIkG__y9f_5Mx0YQ68rNjOpjC6sQm85kR1vbYMDnoSj7_r99tMVO34_QOobXp" },
    { name: "Sarah Chen", cohort: "CS301 • Cohort B", authenticity: 88, confidence: 85, mastery: 52, strongest: "Syntax", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmC6bkVVQy1ykWN8AkhPk8uy3ERJmnFH020wcNEh07DaUVVu_I-aJJd-UNSSWF1cV-WvsI0pJkAoVS95YHORmcSlrRHsA0RKAmWTVKltgO4EDz-Sv5vAJ8s7mA9xYYFmZGwmE0FAng2ltpYuucHzA5mzIiw-u6sqvSI9CQ6xeaFFvnrKyBTkBZ_LO2BZs1zk02_Q2PtJc9lUgiH9gIY9Jp5JizHP66v0SMLF5KxGvxAgSaz6szpTNH" },
  ];

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Students"
        description="View individual student learning profiles and progress."
        breadcrumbs={[{ label: "Dashboard", href: "/faculty" }, { label: "Students" }]}
        actions={
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-xl text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none w-56"
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((student, idx) => (
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
              <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
