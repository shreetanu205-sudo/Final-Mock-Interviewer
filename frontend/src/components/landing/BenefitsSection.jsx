import React from 'react';
import { Target, HeartHandshake, Clock, Check } from 'lucide-react';

export const BenefitsSection = () => {
  const benefits = [
    {
      title: 'Interviews built around you',
      subtitle: 'Dynamic Tailoring',
      desc: 'No generic question banks. PrepOrbit synthesizes questions directly from your resume projects, selected tech stack, and targeted job role for maximum real-world relevance.',
      icon: Target,
      color: 'bg-orbit-peach/30 text-[#4A1D0E]',
      highlights: ['Tailored to candidate resume', 'Custom skill selection', 'Difficulty calibrated to role']
    },
    {
      title: 'Feedback you can act on',
      subtitle: 'Constructive Coaching',
      desc: 'Instead of harsh rejection emails or cryptic scores, receive objective rubric breakdowns detailing what was done well, missing technical concepts, and model answers.',
      icon: HeartHandshake,
      color: 'bg-orbit-lavender/50 text-orbit-purple',
      highlights: ['Relevance & accuracy scores', 'Missing conceptual pointers', 'Direct study recommendations']
    },
    {
      title: 'Practice at your own pace',
      subtitle: 'Zero Judgment Studio',
      desc: 'Whether it is 11 PM before your campus drive or an early morning sprint, practise in a safe, private environment without the fear of making mistakes.',
      icon: Clock,
      color: 'bg-orbit-mint/40 text-[#123E24]',
      highlights: ['5-question batch navigation', 'Skip and revisit anytime', 'Voice and text versatility']
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-plum/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-orbit-purple px-3 py-1 rounded-full bg-orbit-lavender/40">
            Candidate First Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-plum">
            Built for confidence, not anxiety
          </h2>
          <p className="text-base sm:text-lg text-plum/70 font-normal">
            Every interaction in PrepOrbit is engineered to be encouraging, constructive, and empowering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-cream rounded-3xl p-8 border border-plum/10 shadow-soft flex flex-col justify-between hover:shadow-medium transition-all"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${b.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-orbit-muted uppercase tracking-wider block">
                        {b.subtitle}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-plum">
                        {b.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-plum/75 leading-relaxed mb-6 font-normal">
                    {b.desc}
                  </p>
                </div>

                <div className="space-y-2 pt-6 border-t border-plum/10">
                  {b.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs font-medium text-plum/80">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
