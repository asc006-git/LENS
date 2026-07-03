import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShaderBackground from "@/components/ShaderBackground";
import LensScene from "@/components/LensScene";
import { ArrowRight, CirclePlay, Route, Brain, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <ShaderBackground opacity={0.5} />
      <Navbar />

      <main className="pt-24 flex-grow">
        <section className="min-h-[85vh] flex items-center py-16 px-6 md:px-12 max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-low border border-primary-fixed-dim/50 rounded-full">
                <span className="material-symbols-outlined text-base text-primary" data-weight="fill">school</span>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider font-label-sm">
                  The Future of Education
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold text-on-surface leading-tight font-display-lg">
                Learn with AI.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Think Independently.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-on-surface-variant max-w-xl font-body-lg leading-relaxed">
                LENS is an intelligent evaluation and navigation system that uses AI to guide your learning journey, ensuring deep comprehension without short-circuiting the human thought process.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/role-selection">
                  <button className="w-full sm:w-auto px-8 py-3 bg-primary text-on-primary font-semibold rounded-xl shadow-level-1 hover:shadow-level-2 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 h-12">
                    Start Learning Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <a href="#demo">
                  <button className="w-full sm:w-auto px-8 py-3 bg-surface border border-outline-variant text-on-surface font-semibold rounded-xl hover:bg-surface-variant transition-colors flex items-center justify-center gap-2 h-12">
                    <CirclePlay className="w-5 h-5" />
                    Watch Demo
                  </button>
                </a>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-outline-variant/30 text-on-surface-variant font-body-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center overflow-hidden">
                      <Image alt="User" width={32} height={32} className="w-full h-full object-cover" src={`https://lh3.googleusercontent.com/aida-public/AB6AXuCNwqKgNLYcgTUrxWDSaR8Gtgq1C9LWsNK_afNPx2JuSu23MyFZLe8RpyJhLqW_eBMC2jJyt6UaaGP51kOaua66KF-M6yO36NXItY3wfJUkXmlxZd4fUl7I4GTflG0xsaR3hDykrjWT7hmJhuC7Q1S2lC18x9NnZR0JrAY78s-oS2rajzXqjceQboxqySbEvEqgGRD4GwD92FXyrIYsFRvzbRnVdC1VHkgRGQoJe8FTPkxEjbtFPq4e`} />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium">Trusted by 10,000+ students & educators</span>
              </div>
            </div>

            <div className="relative h-[450px] lg:h-[550px] w-full rounded-2xl overflow-hidden shadow-level-2 bg-surface-container-lowest border border-outline-variant/20 lg:ml-auto">
              <LensScene />
              <div className="absolute bottom-6 left-6 right-6 glass-panel p-6 rounded-xl shadow-level-1 flex items-center justify-between">
                <div>
                  <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-1 font-label-sm">
                    Learning Trajectory
                  </p>
                  <p className="text-lg font-bold text-on-surface font-headline-sm">
                    Optimal Path Calculated
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" data-weight="fill">auto_awesome</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-headline-lg mb-4">
              Designed for Deep comprehension
            </h2>
            <p className="text-lg text-on-surface-variant font-body-md">
              Unlike chat interfaces that give answers directly, LENS evaluates your understanding and navigates you to independent realization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-level-1">
              <div className="w-12 h-12 bg-primary-container/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <Route className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-headline-sm mb-2">Adaptive Journeys</h3>
              <p className="text-on-surface-variant font-body-md">
                Continuous assessment of your cognitive load and conceptual gaps maps an educational path unique to your speed.
              </p>
            </div>

            <div className="p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-level-1">
              <div className="w-12 h-12 bg-secondary-container/10 rounded-xl flex items-center justify-center text-secondary mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-headline-sm mb-2">Active Validation</h3>
              <p className="text-on-surface-variant font-body-md">
                Interactive quizzes, critical challenges, and mock validations ensure details stick for long-term mastery.
              </p>
            </div>

            <div className="p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-level-1">
              <div className="w-12 h-12 bg-tertiary-container/10 rounded-xl flex items-center justify-center text-tertiary mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-headline-sm mb-2">Detailed Reflection</h3>
              <p className="text-on-surface-variant font-body-md">
                Get full visibility into your progress, focus trends, and cognitive growth portfolio with AI analysis.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
