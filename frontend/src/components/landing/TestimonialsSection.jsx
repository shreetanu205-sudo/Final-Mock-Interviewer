import React from 'react';
import { Quote, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';

export const TestimonialsSection = () => {
  const sampleTestimonials = [
    {
      quote: "The 5-question batch format took away the panic I usually felt during online interviews. Being able to see all 5 questions, think through my answers, and practice speaking aloud made all the difference.",
      author: "Sample Candidate A",
      role: "Final Year B.Tech Student",
      target: "Placed at FinTech Startup",
      tag: "Batch Workflow"
    },
    {
      quote: "The ATS resume analyzer caught missing concurrency keywords on my resume that I had overlooked. After revising my project bullet points, my readiness score jumped from 68% to 84%.",
      author: "Sample Candidate B",
      role: "Recent Computer Science Graduate",
      target: "Associate Software Engineer",
      tag: "ATS Resume Feedback"
    },
    {
      quote: "Practicing voice answers directly in the browser with live speech recognition helped me cut down my rambling. The rubrics gave specific suggestions instead of generic star ratings.",
      author: "Sample Candidate C",
      role: "Self-Taught Full Stack Developer",
      target: "Frontend Developer Role",
      tag: "Voice Practice"
    },
  ];

  return (
    <section className="py-24 bg-cream border-b border-plum/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-orbit-purple px-3 py-1 rounded-full bg-orbit-lavender/40">
              Student & Candidate Stories
            </span>
            <span className="text-[11px] font-semibold text-orbit-muted uppercase tracking-wider bg-white/70 px-2 py-0.5 rounded-full border border-plum/10">
              Sample Feedback
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-plum">
            Tested for modern interview readiness
          </h2>
          <p className="text-xs text-orbit-muted max-w-xl mx-auto italic">
            Note: The following are illustrative sample personas demonstrating how students utilize PrepOrbit during mock preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleTestimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-plum/10 shadow-soft flex flex-col justify-between hover:shadow-medium transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Quote className="w-8 h-8 text-orbit-lavender" />
                  <Badge variant="lavender">{item.tag}</Badge>
                </div>

                <p className="text-sm text-plum/80 leading-relaxed font-normal mb-6 italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-plum/10">
                <p className="font-serif text-base font-bold text-plum">{item.author}</p>
                <p className="text-xs text-orbit-muted">{item.role}</p>
                <p className="text-xs font-medium text-orbit-purple mt-0.5">{item.target}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
