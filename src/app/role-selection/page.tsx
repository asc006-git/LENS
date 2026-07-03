"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Presentation, ArrowLeft } from "lucide-react";

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 md:p-12 overflow-hidden bg-gradient-to-br from-primary-fixed/20 via-background to-secondary-fixed/20">
      <div className="w-full max-w-4xl z-10 space-y-12">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <Image alt="Logo" src="/logo.svg" width={36} height={36} />
            <span className="text-3xl font-extrabold text-primary tracking-tight">LENS</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface font-display-lg leading-tight">
            Choose Your Path
          </h1>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto font-body-md">
            Select how you want to experience LENS — as a learner or as an educator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <button
            onClick={() => router.push("/login")}
            className="group bg-surface-container-lowest rounded-2xl p-8 border-2 border-outline-variant/30 hover:border-primary hover:shadow-level-2 transition-all text-left flex flex-col items-start gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary group-hover:bg-primary-container/20 transition-colors">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-on-surface font-headline-md mb-2 group-hover:text-primary transition-colors">
                Student
              </h2>
              <p className="text-sm text-on-surface-variant font-body-md leading-relaxed">
                Start learning sessions, receive AI-guided feedback, track your conceptual growth, and build your portfolio.
              </p>
            </div>
            <div className="mt-auto pt-4 flex items-center gap-2 text-primary font-semibold text-sm">
              <span>Continue as Student</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </div>
          </button>

          <button
            onClick={() => router.push("/login")}
            className="group bg-surface-container-lowest rounded-2xl p-8 border-2 border-outline-variant/30 hover:border-secondary hover:shadow-level-2 transition-all text-left flex flex-col items-start gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-colors">
              <Presentation className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-on-surface font-headline-md mb-2 group-hover:text-secondary transition-colors">
                Faculty
              </h2>
              <p className="text-sm text-on-surface-variant font-body-md leading-relaxed">
                Monitor learning authenticity, identify conceptual gaps, review analytics, and guide your classroom.
              </p>
            </div>
            <div className="mt-auto pt-4 flex items-center gap-2 text-secondary font-semibold text-sm">
              <span>Continue as Faculty</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </div>
          </button>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-on-surface-variant hover:text-primary transition-colors font-semibold inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
