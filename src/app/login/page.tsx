"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, GraduationCap, Presentation, Mail, Lock, User, Eye, EyeOff, Brain, Users } from "lucide-react";

type AuthView = "role-select" | "student-login" | "faculty-login" | "student-register";

function LoginContent() {
  const [view, setView] = useState<AuthView>("role-select");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentName, setStudentName] = useState("");
  const [facultyEmail, setFacultyEmail] = useState("");
  const [facultyPassword, setFacultyPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const role = searchParams.get("role");
    if (role === "student") setView("student-login");
    else if (role === "faculty") setView("faculty-login");
    else setView("role-select");
  }, [searchParams]);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/student");
  };

  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/faculty");
  };

  const renderInput = (icon: React.ReactNode, value: string, onChange: (v: string) => void, placeholder: string, type = "text") => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
        {icon}
      </div>
      <input
        type={type === "password" && showPassword ? "text" : type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-on-surface placeholder:text-outline"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 md:p-12 overflow-hidden bg-gradient-to-br from-primary-fixed/20 via-background to-secondary-fixed/20">
      <div className="w-full max-w-5xl z-10 flex flex-col items-center justify-center">
        {view === "role-select" && (
          <div className="w-full flex flex-col lg:flex-row gap-12 items-center justify-center animate-fade-in">
            <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 max-w-lg">
              <div className="space-y-3">
                <Link href="/" className="inline-flex items-center gap-2 group mb-2">
                  <Image alt="Logo" src="/logo.svg" width={32} height={32} />
                  <span className="text-3xl font-extrabold text-primary tracking-tight font-headline-md">LENS</span>
                </Link>
                <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface font-headline-lg leading-tight">
                  Welcome to LENS
                </h2>
                <p className="text-base text-on-surface-variant font-body-md leading-relaxed">
                  The AI Learning Companion that evaluates, navigates, and supports your educational journey with precision and care.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest border border-outline-variant/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <Brain className="w-8 h-8 text-secondary mb-3" />
                  <h3 className="text-base font-bold font-headline-sm mb-1">AI Supports Learning</h3>
                  <p className="text-xs text-on-surface-variant font-body-sm leading-relaxed">
                    Personalized feedback and adaptive pathways tailored to your unique learning style.
                  </p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <Users className="w-8 h-8 text-tertiary mb-3" />
                  <h3 className="text-base font-bold font-headline-sm mb-1">Human Understanding</h3>
                  <p className="text-xs text-on-surface-variant font-body-sm leading-relaxed">
                    Technology designed to enhance, not replace, human connection and comprehension.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[420px] shrink-0">
              <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-level-2 border border-outline-variant/40 backdrop-blur-md space-y-6">
                <h3 className="text-xl font-bold font-headline-md text-center text-on-surface">
                  Choose your role
                </h3>

                <button
                  onClick={() => setView("student-login")}
                  className="w-full text-left bg-surface group hover:bg-surface-container-low border border-outline-variant hover:border-primary p-5 rounded-xl transition-all flex items-start gap-4"
                >
                  <div className="bg-primary-container/10 p-3 rounded-lg group-hover:bg-primary-container/20 transition-colors text-primary">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors font-headline-sm">Student</h4>
                    <p className="text-xs text-on-surface-variant mt-1 font-body-sm leading-relaxed">
                      Start learning sessions, receive feedback, track progress.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setView("faculty-login")}
                  className="w-full text-left bg-surface group hover:bg-surface-container-low border border-outline-variant hover:border-secondary p-5 rounded-xl transition-all flex items-start gap-4"
                >
                  <div className="bg-secondary/10 p-3 rounded-lg group-hover:bg-secondary/20 transition-colors text-secondary">
                    <Presentation className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-on-surface group-hover:text-secondary transition-colors font-headline-sm">Faculty</h4>
                    <p className="text-xs text-on-surface-variant mt-1 font-body-sm leading-relaxed">
                      Monitor authenticity, identify gaps, review analytics.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "student-login" && (
          <div className="w-full max-w-[440px] animate-fade-in">
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-level-2 border border-outline-variant/40 relative">
              <button onClick={() => setView("role-select")} className="absolute top-6 left-6 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-sm font-semibold">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="text-center mt-6 mb-8">
                <GraduationCap className="w-12 h-12 text-primary mx-auto mb-2" />
                <h2 className="text-2xl font-bold font-headline-md text-on-surface">Student Login</h2>
                <p className="text-xs text-on-surface-variant mt-1 font-body-sm">
                  Continue your AI-powered learning journey.
                </p>
              </div>

              <form onSubmit={handleStudentSubmit} className="space-y-4">
                {renderInput(<Mail className="w-4 h-4" />, studentEmail, setStudentEmail, "Institutional Email", "email")}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-xl pl-10 pr-10 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-on-surface placeholder:text-outline"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface-variant"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button type="submit" className="w-full bg-primary hover:bg-primary-container text-on-primary font-semibold py-3 rounded-xl transition-all shadow-sm">
                  Sign In
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-outline-variant"></div>
                  <span className="flex-shrink-0 mx-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Or</span>
                  <div className="flex-grow border-t border-outline-variant"></div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/student")}
                  className="w-full bg-surface hover:bg-surface-container-low border border-outline-variant text-on-surface font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-on-surface-variant">
                  New to LENS?{" "}
                  <button onClick={() => setView("student-register")} className="text-primary font-bold hover:underline">
                    Create Student Account
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {view === "faculty-login" && (
          <div className="w-full max-w-[440px] animate-fade-in">
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-level-2 border border-outline-variant/40 relative">
              <button onClick={() => setView("role-select")} className="absolute top-6 left-6 text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-1 text-sm font-semibold">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="text-center mt-6 mb-8">
                <Presentation className="w-12 h-12 text-secondary mx-auto mb-2" />
                <h2 className="text-2xl font-bold font-headline-md text-on-surface">Faculty Login</h2>
                <p className="text-xs text-on-surface-variant mt-1 font-body-sm">
                  Access institutional dashboard and analytics.
                </p>
              </div>

              <form onSubmit={handleFacultySubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input type="email" required value={facultyEmail} onChange={(e) => setFacultyEmail(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none text-on-surface placeholder:text-outline"
                    placeholder="Faculty Email" />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input type="password" required value={facultyPassword} onChange={(e) => setFacultyPassword(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none text-on-surface placeholder:text-outline"
                    placeholder="Password" />
                </div>
                <button type="submit" className="w-full bg-secondary hover:bg-secondary-container text-on-secondary font-semibold py-3 rounded-xl transition-all shadow-sm">
                  Sign In
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  To register your institution, please contact the LENS administrator support team.
                </p>
              </div>
            </div>
          </div>
        )}

        {view === "student-register" && (
          <div className="w-full max-w-[440px] animate-fade-in">
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-level-2 border border-outline-variant/40 relative">
              <button onClick={() => setView("student-login")} className="absolute top-6 left-6 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-sm font-semibold">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="text-center mt-6 mb-8">
                <User className="w-12 h-12 text-primary mx-auto mb-2" />
                <h2 className="text-2xl font-bold font-headline-md text-on-surface">Create Student Account</h2>
                <p className="text-xs text-on-surface-variant mt-1 font-body-sm">
                  Join LENS to navigate your study paths.
                </p>
              </div>

              <form onSubmit={handleStudentSubmit} className="space-y-4">
                {renderInput(<User className="w-4 h-4" />, studentName, setStudentName, "Full Name")}
                {renderInput(<Mail className="w-4 h-4" />, studentEmail, setStudentEmail, "Institutional Email", "email")}
                {renderInput(<Lock className="w-4 h-4" />, studentPassword, setStudentPassword, "Password", "password")}
                <button type="submit" className="w-full bg-primary hover:bg-primary-container text-on-primary font-semibold py-3 rounded-xl transition-all shadow-sm">
                  Create Account
                </button>
              </form>

              <div className="mt-8 text-center font-body-sm text-sm">
                <p className="text-on-surface-variant">
                  Already have an account?{" "}
                  <button onClick={() => setView("student-login")} className="text-primary font-bold hover:underline">
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  );
}


