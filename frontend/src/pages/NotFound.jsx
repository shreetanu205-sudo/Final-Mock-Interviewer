import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home, Compass } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-orbit-lavender text-orbit-purple flex items-center justify-center shadow-soft">
        <Compass className="w-8 h-8 animate-spin duration-3000" />
      </div>
      <h1 className="font-serif text-5xl font-bold text-plum">404</h1>
      <h2 className="font-serif text-2xl font-bold text-plum">Orbit Lost in Space</h2>
      <p className="text-sm text-plum/70 max-w-md font-normal leading-relaxed">
        The studio page or interview room you are looking for does not exist or has been relocated.
      </p>
      <Link to="/">
        <Button variant="primary" icon={Home}>Return to Studio Home</Button>
      </Link>
    </div>
  );
};
