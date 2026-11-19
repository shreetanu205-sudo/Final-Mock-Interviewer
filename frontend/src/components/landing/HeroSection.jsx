import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Mic, CheckCircle2, ShieldCheck, Compass, Zap } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Decorative background radial ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orbit-lavender/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-orbit-peach/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Editorial Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-plum/10 shadow-soft text-xs font-semibold text-plum uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-orbit-purple animate-ping" />
              <span>Personal AI Interview Studio</span>
              <span className="text-orbit-muted">•</span>
              <span className="text-orbit-purple">For Students & Job Seekers</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-plum tracking-tight leading-[1.1]">
              Practise the questions. <br />
              <span className="italic font-normal text-orbit-purple">Own the room.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-plum/75 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Step into an encouraging, distraction-free AI studio. Upload your resume, select your target role, and practise 
              thoughtfully structured <strong className="text-plum font-semibold">5-question batches</strong> with text or voice. 
              Receive constructive feedback you can actually act on.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/interview/setup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-orbit-purple text-white text-base font-semibold hover:bg-plum hover:shadow-elevated transition-all duration-200"
              >
                <span>Start Practising Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/resume"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white border border-plum/15 text-plum text-base font-medium hover:bg-cream hover:border-plum/30 transition-all duration-200 shadow-soft"
              >
                <Sparkles className="w-5 h-5 text-orbit-purple" />
                <span>Analyze Resume & ATS</span>
              </Link>
            </div>

            {/* Trust points */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-plum/70 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Judgment Feedback</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>5-Question Batch Workflow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Voice Recognition & TTS</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Studio Mockup Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Studio Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-elevated border border-plum/10 relative overflow-hidden">
                
                {/* Header ribbon */}
                <div className="flex items-center justify-between pb-5 border-b border-plum/10">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#FFB79D]" />
                    <div className="w-3 h-3 rounded-full bg-[#D9C4F2]" />
                    <div className="w-3 h-3 rounded-full bg-[#CBE8D6]" />
                    <span className="text-xs font-bold text-plum/80 ml-1">Mock Session • Batch 1 of 3</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orbit-mint text-[#123E24]">
                    Live Voice Mode
                  </span>
                </div>

                {/* Question Preview Box */}
                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between text-xs text-orbit-muted">
                    <span className="font-semibold text-orbit-purple uppercase tracking-wider">Question 2 of 5</span>
                    <span>System Architecture</span>
                  </div>

                  <p className="font-serif text-lg font-bold text-plum leading-snug">
                    "How do you ensure data consistency and prevent race conditions when handling concurrent requests in your Spring Boot REST APIs?"
                  </p>

                  {/* Simulated Voice wave & candidate response */}
                  <div className="bg-cream rounded-2xl p-4 border border-plum/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold text-plum uppercase tracking-wider">Spoken Answer</span>
                      </div>
                      <span className="text-[11px] text-orbit-muted">0:42 recorded</span>
                    </div>

                    <p className="text-xs text-plum/80 italic font-sans leading-relaxed">
                      "I implement optimistic locking using @Version on our MongoDB/JPA entities, combined with database indexes and transactional isolation levels..."
                    </p>

                    {/* Audio wave bars visualization */}
                    <div className="flex items-center gap-1 pt-1 h-6">
                      {[40, 75, 55, 90, 60, 30, 80, 95, 45, 60, 85, 50, 70, 90, 35, 65, 80, 50].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-orbit-purple/80 rounded-full"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Mini Feedback Preview */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-orbit-lavender text-plum font-semibold">
                        Relevance: 19/20
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-orbit-peach text-[#4A1D0E] font-semibold">
                        Accuracy: 18/20
                      </span>
                    </div>
                    <span className="text-xs font-bold text-orbit-purple">Score: 92%</span>
                  </div>
                </div>

                {/* Floating Orbit Pill 1 */}
                <div className="absolute -bottom-3 -left-3 bg-[#24102F] text-white px-4 py-2.5 rounded-2xl shadow-elevated border border-white/10 flex items-center gap-2.5 text-xs font-semibold animate-bounce duration-1000">
                  <Sparkles className="w-4 h-4 text-orbit-peach" />
                  <span>Resume Matched: 84% ATS Score</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
