import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { FeatureShowcaseSection } from '../components/landing/FeatureShowcaseSection';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { CtaSection } from '../components/landing/CtaSection';

export const Home = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <HowItWorksSection />
      <FeatureShowcaseSection />
      <BenefitsSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
};
