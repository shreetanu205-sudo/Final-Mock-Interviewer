import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#24102F] text-white pt-16 pb-12 mt-20 border-t border-plum-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orbit-purple flex items-center justify-center">
                <img src="/logo.svg" alt="PrepOrbit Logo" className="w-8 h-8" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                PrepOrbit
              </span>
            </div>
            <p className="text-white/70 max-w-sm text-sm leading-relaxed">
              Your Personal AI Interview Studio. Practise high-impact conceptual, technical, and project-based questions in 5-question structured batches with voice and text feedback.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-orbit-lavender">
              <Sparkles className="w-3.5 h-3.5 text-orbit-peach" />
              <span>Designed for students, fresh graduates, and tech job seekers.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-orbit-peach uppercase tracking-wider text-xs">
              Studio Features
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/resume" className="hover:text-white transition-colors">Resume Intelligence</Link>
              </li>
              <li>
                <Link to="/interview/setup" className="hover:text-white transition-colors">AI Interview Rooms</Link>
              </li>
              <li>
                <Link to="/interview/setup" className="hover:text-white transition-colors">Voice Practice Mode</Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-white transition-colors">Performance Analytics</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Notice */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-orbit-peach uppercase tracking-wider text-xs">
              Standards & Transparency
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <span className="text-xs leading-normal block text-white/60">
                  Estimated ATS scores are heuristic compatibility indicators designed to help candidates identify missing skills, not an official guarantee of passing proprietary corporate ATS gates.
                </span>
              </li>
              <li>
                <span className="text-xs text-white/40 block mt-2">
                  Voice audio data is processed locally within browser memory and is never permanently retained without explicit user consent.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-white/50 gap-4">
          <p>© {new Date().getFullYear()} PrepOrbit. Crafted for academic & career readiness.</p>
          <div className="flex items-center space-x-6">
            <span>Built with React, Spring Boot, & Generative AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
