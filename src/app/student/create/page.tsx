"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { PageHeader, ProgressSteps, Button, Card } from "@/components/ui";
import { Upload, ArrowLeft, ArrowRight, Rocket, CircleCheckBig, BookOpen, Cpu, Brain, Sparkles } from "lucide-react";

export default function CreateSessionPage() {
  const router = useRouter();
  const { updateSession } = useApp();
  const [step, setStep] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<string>("ds");
  const [topicName, setTopicName] = useState("");
  const [learningObjective, setLearningObjective] = useState("");
  const [assignmentDetails, setAssignmentDetails] = useState("");
  const [focusArea, setFocusArea] = useState("recursion");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedCompanion, setSelectedCompanion] = useState<string>("socratic");
  const [cognitiveLevel, setCognitiveLevel] = useState("deep");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!).map((f) => f.name)]);
    }
  };

  const handleLaunch = () => {
    updateSession({
      course: selectedCourse,
      topic: topicName,
      focusArea,
      files: uploadedFiles,
      companion: selectedCompanion,
      cognitiveLevel,
      learningObjective,
      assignmentDetails,
    });
    router.push("/student/analysis");
  };

  const steps = [
    { num: 1, label: "Course" },
    { num: 2, label: "Details" },
    { num: 3, label: "Materials" },
    { num: 4, label: "AI Config" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      <PageHeader
        title="Create New Learning Session"
        description="Configure your AI-guided learning workspace step by step."
        breadcrumbs={[
          { label: "Dashboard", href: "/student" },
          { label: "Create Session" },
        ]}
      />

      <ProgressSteps steps={steps} currentStep={step} onStepClick={setStep} />

      <Card padding="lg">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-bold font-headline-sm text-on-surface">Select Subject & Course</h3>
              <p className="text-xs text-on-surface-variant mt-1 font-body-sm">
                Choose your subject and course to help AI tailor vocabulary and depth.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedCourse("ds")}
                className={`text-left rounded-xl p-5 border-2 transition-all relative overflow-hidden group hover:shadow-level-1 ${
                  selectedCourse === "ds" ? "border-primary bg-primary/5" : "border-outline-variant bg-surface"
                }`}
              >
                {selectedCourse === "ds" && (
                  <CircleCheckBig className="w-5 h-5 text-primary absolute top-4 right-4" />
                )}
                <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center mb-4 border border-outline-variant/30">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-base font-bold font-headline-sm text-on-surface">Data Structures</h4>
                <p className="text-xs text-on-surface-variant mt-1 font-body-sm">CS301 • Prof. Alan Turing</p>
                <span className="inline-block mt-3 px-2 py-0.5 bg-surface-container-high rounded-full text-[10px] text-on-surface-variant font-medium">
                  Spring 2026
                </span>
              </button>

              <button
                onClick={() => setSelectedCourse("os")}
                className={`text-left rounded-xl p-5 border-2 transition-all relative overflow-hidden group hover:shadow-level-1 ${
                  selectedCourse === "os" ? "border-primary bg-primary/5" : "border-outline-variant bg-surface"
                }`}
              >
                {selectedCourse === "os" && (
                  <CircleCheckBig className="w-5 h-5 text-primary absolute top-4 right-4" />
                )}
                <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center mb-4 border border-outline-variant/30">
                  <Cpu className="w-6 h-6 text-secondary" />
                </div>
                <h4 className="text-base font-bold font-headline-sm text-on-surface">Operating Systems</h4>
                <p className="text-xs text-on-surface-variant mt-1 font-body-sm">CS402 • Prof. Grace Hopper</p>
                <span className="inline-block mt-3 px-2 py-0.5 bg-surface-container-high rounded-full text-[10px] text-on-surface-variant font-medium">
                  Spring 2026
                </span>
              </button>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} icon={<ArrowRight className="w-4 h-4" />}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-bold font-headline-sm text-on-surface">Session Details</h3>
              <p className="text-xs text-on-surface-variant mt-1 font-body-sm">
                Define what you want to learn and your personal learning objective.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant font-label-sm">
                  What topic are you studying?
                </label>
                <input
                  type="text"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="e.g. Graph Traversal Algorithms (DFS/BFS)"
                  className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface placeholder:text-outline"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant font-label-sm">
                  Personal Learning Objective
                </label>
                <input
                  type="text"
                  value={learningObjective}
                  onChange={(e) => setLearningObjective(e.target.value)}
                  placeholder="e.g. Understand how inheritance enables code reuse"
                  className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface placeholder:text-outline"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant font-label-sm">
                  Assignment / Project Details
                </label>
                <textarea
                  value={assignmentDetails}
                  onChange={(e) => setAssignmentDetails(e.target.value)}
                  placeholder="Describe your assignment or project briefly..."
                  rows={3}
                  className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface placeholder:text-outline resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant font-label-sm">
                  Focus Area
                </label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all text-on-surface"
                >
                  <option value="recursion">Basic Concept & Implementation</option>
                  <option value="applications">Complex Edge Cases & Rotations</option>
                  <option value="proofs">Mathematical Background & Proofs</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} icon={<ArrowRight className="w-4 h-4" />}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-bold font-headline-sm text-on-surface">Upload Materials</h3>
              <p className="text-xs text-on-surface-variant mt-1 font-body-sm">
                Upload your assignment, project files, or reference materials.
              </p>
            </div>
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center bg-surface hover:bg-surface-container-low transition-colors relative cursor-pointer">
              <input type="file" multiple onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <Upload className="w-10 h-10 text-outline mb-3" />
              <p className="text-sm font-bold text-on-surface">Drag & drop files here or click to browse</p>
              <p className="text-xs text-on-surface-variant mt-1">Supports PDF, DOCX, TXT up to 10MB</p>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-on-surface-variant">Uploaded files ({uploadedFiles.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high rounded-full text-xs text-on-surface font-medium border border-outline-variant/30">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      {file}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)} icon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button onClick={() => setStep(4)} icon={<ArrowRight className="w-4 h-4" />}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-bold font-headline-sm text-on-surface">AI Preferences</h3>
              <p className="text-xs text-on-surface-variant mt-1 font-body-sm">
                Choose your AI companion persona and cognitive challenge level.
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant">Select AI Companion</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "socratic", name: "Socratic Mentor", icon: <Brain className="w-5 h-5" />, desc: "Asks guiding questions to help you realise concepts yourself.", color: "text-tertiary" },
                    { id: "turing", name: "Alan Turing", icon: <Cpu className="w-5 h-5" />, desc: "Analytical and detail-oriented. Focuses on code structures.", color: "text-primary" },
                    { id: "hopper", name: "Grace Hopper", icon: <Sparkles className="w-5 h-5" />, desc: "Practical and syllabus-oriented. Links to learning objectives.", color: "text-secondary" },
                  ].map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedCompanion(comp.id)}
                      className={`text-left rounded-xl p-4 border transition-all flex flex-col justify-between min-h-[140px] ${
                        selectedCompanion === comp.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-outline-variant bg-surface"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={comp.color}>{comp.icon}</span>
                        <span className="text-sm font-bold">{comp.name}</span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant mt-2 leading-relaxed">{comp.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant">Cognitive Challenge Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "explorer", title: "Explorer", subtitle: "Basic review" },
                    { id: "deep", title: "Deep Dive", subtitle: "Core syllabus" },
                    { id: "challenging", title: "Challenging", subtitle: "Critical thinking" },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setCognitiveLevel(lvl.id)}
                      className={`py-2 px-3 rounded-lg border text-center transition-all ${
                        cognitiveLevel === lvl.id
                          ? "bg-primary text-on-primary border-primary"
                          : "border-outline-variant text-on-surface hover:bg-surface-container-low"
                      }`}
                    >
                      <p className="text-xs font-bold">{lvl.title}</p>
                      <p className={`text-[9px] mt-0.5 ${cognitiveLevel === lvl.id ? "text-primary-fixed-dim" : "text-on-surface-variant"}`}>
                        {lvl.subtitle}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(3)} icon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button onClick={handleLaunch} icon={<Rocket className="w-4 h-4" />}>
                Launch Session
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
