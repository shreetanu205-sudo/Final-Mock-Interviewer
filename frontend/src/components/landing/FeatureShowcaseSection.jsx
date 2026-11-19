import React from 'react';
import { 
  FileCheck2, 
  Layers, 
  Mic2, 
  Sparkles, 
  TrendingUp, 
  Video, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const FeatureShowcaseSection = () => {
  return (
    <section id="features" className="py-24 bg-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-orbit-purple px-3 py-1 rounded-full bg-orbit-lavender/50">
            Intelligent Platform Capabilities
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-plum">
            Everything you need to master your interview
          </h2>
          <p className="text-base sm:text-lg text-plum/70 font-normal">
            Engineered from ground up with candidate confidence, transparent scoring, and privacy in mind.
          </p>
        </div>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature 1: Resume Intelligence */}
          <div className="bg-white rounded-3xl p-8 border border-plum/10 shadow-soft flex flex-col justify-between hover:shadow-medium transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orbit-peach/30 text-[#4A1D0E] flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-plum">
                Resume Intelligence & ATS Scoring
              </h3>
              <p className="text-sm text-plum/75 leading-relaxed">
                Upload your resume in PDF or DOCX format. PrepOrbit extracts your technical skills, work experience, and projects, generating an estimated ATS compatibility score and pinpointing missing industry keywords.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-plum/10 flex items-center justify-between text-xs text-orbit-muted">
              <span>PDF & DOCX Support</span>
              <span className="font-semibold text-orbit-purple">Live Keyword Match</span>
            </div>
          </div>

          {/* Feature 2: 5-Question Batch Generation */}
          <div className="bg-white rounded-3xl p-8 border border-plum/10 shadow-soft flex flex-col justify-between hover:shadow-medium transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orbit-lavender/50 text-orbit-purple flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-plum">
                5-Question Batch Workflow
              </h3>
              <p className="text-sm text-plum/75 leading-relaxed">
                No single-question panic. Practice in balanced sets of exactly 5 questions per batch. Move freely between questions, skip, draft, and submit all five together for comprehensive AI evaluation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-plum/10 flex items-center justify-between text-xs text-orbit-muted">
              <span>Batch 1 (1–5) • Batch 2 (6–10)</span>
              <span className="font-semibold text-orbit-purple">Adaptive Difficulty</span>
            </div>
          </div>

          {/* Feature 3: Voice-Based Interview Mode */}
          <div className="bg-white rounded-3xl p-8 border border-plum/10 shadow-soft flex flex-col justify-between hover:shadow-medium transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orbit-mint/50 text-[#123E24] flex items-center justify-center">
                <Mic2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-plum">
                Dual Mode: Voice & Text
              </h3>
              <p className="text-sm text-plum/75 leading-relaxed">
                Listen to questions read aloud with natural text-to-speech, and speak your answers aloud. Speech-to-text live transcription lets you review and edit your spoken answer before submitting.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-plum/10 flex items-center justify-between text-xs text-orbit-muted">
              <span>Web Speech API STT/TTS</span>
              <span className="font-semibold text-orbit-purple">Live Transcript Edit</span>
            </div>
          </div>

          {/* Feature 4: Multi-Rubric AI Evaluation */}
          <div className="bg-white rounded-3xl p-8 border border-plum/10 shadow-soft flex flex-col justify-between hover:shadow-medium transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orbit-purple/15 text-orbit-purple flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-plum">
                Objective 5-Point Evaluation
              </h3>
              <p className="text-sm text-plum/75 leading-relaxed">
                Each response is objectively evaluated on Relevance, Technical Accuracy, Completeness, Clarity, and Depth of Explanation. Clear suggestions explain what was done well and what key concepts were missing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-plum/10 flex items-center justify-between text-xs text-orbit-muted">
              <span>5 Rubric Criteria (0–20 each)</span>
              <span className="font-semibold text-orbit-purple">Model Answers</span>
            </div>
          </div>

          {/* Feature 5: Performance Analytics */}
          <div className="bg-white rounded-3xl p-8 border border-plum/10 shadow-soft flex flex-col justify-between hover:shadow-medium transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-plum">
                Longitudinal Analytics & Tracking
              </h3>
              <p className="text-sm text-plum/75 leading-relaxed">
                Track your interview scores over time with interactive trend charts. Identify your strongest skills, pinpoint recurring conceptual gaps, and download clean PDF performance certificates.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-plum/10 flex items-center justify-between text-xs text-orbit-muted">
              <span>Interactive Recharts</span>
              <span className="font-semibold text-orbit-purple">PDF Export</span>
            </div>
          </div>

          {/* Feature 6: FUTURE SCOPE - Webcam & Visual Analysis (Roadmap Card) */}
          <div className="bg-gradient-to-br from-white to-orbit-lavender/20 rounded-3xl p-8 border-2 border-dashed border-orbit-purple/30 shadow-soft flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-plum text-white flex items-center justify-center">
                  <Video className="w-6 h-6" />
                </div>
                <Badge variant="plum">Roadmap • Coming Soon</Badge>
              </div>

              <h3 className="font-serif text-2xl font-bold text-plum">
                Webcam & Video Engagement
              </h3>

              <p className="text-sm text-plum/70 leading-relaxed font-normal">
                Future architecture is prepped for opt-in webcam streaming, posture feedback, and eye-gaze indicators. No simulation or fabricated results are displayed today; clear consent and privacy safeguards will govern its release.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-plum/10 flex items-center justify-between text-xs text-orbit-muted">
              <span>Opt-in Camera Privacy</span>
              <span className="text-orbit-purple font-semibold">Future Scope</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
