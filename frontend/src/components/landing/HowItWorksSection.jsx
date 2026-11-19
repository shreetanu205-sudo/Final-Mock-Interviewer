import React from 'react';
import { UploadCloud, Sliders, Mic, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload Your Resume',
      desc: 'Drop your PDF or DOCX file. Our engine parses your projects, tech stack, and experience, estimating an instant ATS compatibility score.',
      icon: UploadCloud,
      color: 'bg-orbit-peach/30 text-[#4A1D0E]',
      badge: 'Step 1'
    },
    {
      number: '02',
      title: 'Configure Role & Skills',
      desc: 'Select your target job role (Frontend, Backend, Java, Full Stack) and skills. Choose interview category, difficulty, and text or voice mode.',
      icon: Sliders,
      color: 'bg-orbit-lavender/40 text-plum',
      badge: 'Step 2'
    },
    {
      number: '03',
      title: 'Practise in 5-Question Batches',
      desc: 'No high-pressure single questions. View five questions together, skip and revisit, edit drafts, speak your answers aloud, and submit when confident.',
      icon: Mic,
      color: 'bg-orbit-mint/40 text-[#123E24]',
      badge: 'Step 3'
    },
    {
      number: '04',
      title: 'Receive Actionable AI Evaluation',
      desc: 'Get rubric-based scoring on relevance, accuracy, and clarity. Review model answers, identify missing concepts, and track your progress over time.',
      icon: Award,
      color: 'bg-orbit-purple/15 text-orbit-purple',
      badge: 'Step 4'
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-y border-plum/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orbit-purple px-3 py-1 rounded-full bg-orbit-lavender/40">
            Workflow Blueprint
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-plum">
            How PrepOrbit works
          </h2>
          <p className="text-base sm:text-lg text-plum/70 font-normal">
            A structured, stress-free methodology designed specifically to transform anxiety into interview mastery.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-cream rounded-3xl p-7 border border-plum/10 shadow-soft relative flex flex-col justify-between hover:-translate-y-1 hover:shadow-medium transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl font-bold text-plum/20">
                      {step.number}
                    </span>
                    <span className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step.color} shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-plum mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-plum/75 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-plum/10 flex items-center justify-between text-xs font-semibold text-orbit-purple">
                  <span>{step.badge}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 text-center">
          <Link
            to="/interview/setup"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-plum text-white font-semibold text-sm hover:bg-orbit-purple transition-all duration-200 shadow-soft"
          >
            <span>Launch Your Practice Session</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
