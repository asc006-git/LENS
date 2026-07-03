"use client";

import React, { useState } from "react";
import { Sparkles, Lightbulb, FileText, Send, X, MessageSquare } from "lucide-react";

interface AiMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiMentorDrawer({ isOpen, onClose }: AiMentorDrawerProps) {
  const [tab, setTab] = useState<"chat" | "insights" | "resources">("chat");

  return (
    <aside
      className={`bg-surface-container-low/95 backdrop-blur-xl border-l border-primary-container/20 shadow-xl flex flex-col p-6 z-50 fixed right-0 top-0 h-screen w-80 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-tertiary font-headline-sm">AI Mentor</h2>
          <p className="text-xs text-on-surface-variant font-label-sm">Always here to help</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex bg-surface-container-lowest rounded-lg p-1 mb-4 shadow-sm">
        {(["chat", "insights", "resources"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1 transition-all capitalize ${
              tab === t
                ? "bg-tertiary-container text-on-tertiary-container font-bold"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {t === "chat" ? (
              <MessageSquare className="w-3.5 h-3.5" />
            ) : t === "insights" ? (
              <Lightbulb className="w-3.5 h-3.5" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
            <span>{t}</span>
          </button>
        ))}
      </div>

      {tab === "chat" && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-surface-container-lowest p-3 rounded-2xl rounded-tl-none border border-outline-variant shadow-sm text-on-surface text-xs leading-relaxed">
              Hi! I noticed you were reviewing concepts earlier. Would you like to practise explaining them to solidify your understanding?
            </div>
          </div>

          <div className="flex gap-2 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 font-bold text-xs">
              A
            </div>
            <div className="bg-primary text-on-primary p-3 rounded-2xl rounded-tr-none shadow-sm text-xs leading-relaxed">
              Sure, I can try explaining what I learned.
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-surface-container-lowest p-3 rounded-2xl rounded-tl-none border border-outline-variant shadow-sm text-on-surface text-xs leading-relaxed">
              Great! Let&apos;s start with the core concept. What was the main topic you were studying?
            </div>
          </div>
        </div>
      )}

      {tab === "insights" && (
        <div className="flex-grow space-y-3 overflow-y-auto">
          <div className="p-4 bg-surface rounded-xl border border-outline-variant/30">
            <h4 className="font-bold text-xs text-on-surface">Pacing Alert</h4>
            <p className="text-xs text-on-surface-variant mt-1">
              You are progressing well. Consider a quick validation quiz to reinforce key concepts.
            </p>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-outline-variant/30">
            <h4 className="font-bold text-xs text-on-surface">Concept Suggestion</h4>
            <p className="text-xs text-on-surface-variant mt-1">
              Try drawing diagrams to visualise relationships between concepts before explaining them.
            </p>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-outline-variant/30">
            <h4 className="font-bold text-xs text-on-surface">Learning Pattern</h4>
            <p className="text-xs text-on-surface-variant mt-1">
              Your understanding improves significantly when you use real-world analogies. Keep using them!
            </p>
          </div>
        </div>
      )}

      {tab === "resources" && (
        <div className="flex-grow space-y-2 overflow-y-auto">
          <a href="#" className="block p-3 hover:bg-surface rounded-lg transition-colors border border-transparent hover:border-outline-variant/20">
            <p className="text-xs font-bold text-on-surface">Study Guide.pdf</p>
            <span className="text-[10px] text-on-surface-variant">Reference Material (1.2 MB)</span>
          </a>
          <a href="#" className="block p-3 hover:bg-surface rounded-lg transition-colors border border-transparent hover:border-outline-variant/20">
            <p className="text-xs font-bold text-on-surface">Concept Visualiser</p>
            <span className="text-[10px] text-on-surface-variant">Interactive Tool</span>
          </a>
          <a href="#" className="block p-3 hover:bg-surface rounded-lg transition-colors border border-transparent hover:border-outline-variant/20">
            <p className="text-xs font-bold text-on-surface">Practice Exercises</p>
            <span className="text-[10px] text-on-surface-variant">Problem Set (PDF)</span>
          </a>
        </div>
      )}

      <div className="mt-auto pt-4 relative">
        <input
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-full pl-4 pr-10 py-3 text-xs focus:outline-none focus:border-tertiary shadow-sm"
          placeholder="Reply or ask a question..."
          type="text"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 mt-2 w-8 h-8 flex items-center justify-center text-tertiary-container hover:bg-tertiary-fixed rounded-full transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
