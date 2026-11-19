import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const CtaSection = () => {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#24102F] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-elevated border border-plum-light">
          
          {/* Ambient decorative orbital lights */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orbit-purple/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orbit-peach/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-orbit-lavender text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-orbit-peach" />
              <span>Get Started in 60 Seconds</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Ready to own your next interview?
            </h2>

            <p className="text-base sm:text-lg text-white/70 max-w-2xl font-normal leading-relaxed">
              Step into the studio today. Upload your resume, pick your target role, and practise your first 5-question batch completely free.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/interview/setup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-orbit-purple text-white font-semibold text-base hover:bg-white hover:text-plum hover:shadow-elevated transition-all duration-200"
              >
                <span>Launch Practice Room</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/resume"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/10 border border-white/20 text-white font-medium text-base hover:bg-white/20 transition-all duration-200"
              >
                <span>Upload Resume</span>
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-orbit-mint" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-orbit-mint" />
                Instant 5-question batch generation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-orbit-mint" />
                Speech & text feedback
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
