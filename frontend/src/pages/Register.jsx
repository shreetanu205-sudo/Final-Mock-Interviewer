import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { UserPlus, User, Mail, Lock, Briefcase } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleOptions = [
    'Full Stack Developer',
    'Backend Developer',
    'Frontend Developer',
    'Java Developer',
    'Python Developer',
    'Data Analyst',
    'Software Engineer',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email, password, targetRole);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. An account with this email may already exist.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-9 h-9 rounded-full bg-orbit-purple flex items-center justify-center shadow-soft">
              <img src="/logo.svg" alt="PrepOrbit Logo" className="w-7 h-7" />
            </div>
            <span className="font-serif text-2xl font-bold text-plum">PrepOrbit</span>
          </Link>
          <h2 className="font-serif text-3xl font-bold text-plum">Create your account</h2>
          <p className="text-sm text-plum/70 font-normal">
            Start your AI-powered interview coaching studio in 60 seconds.
          </p>
        </div>

        {/* Form Card */}
        <Card padding="p-8">
          {error && <Alert type="error" message={error} className="mb-6" onDismiss={() => setError('')} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-plum/80 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-plum/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full pl-11 pr-4 py-3 bg-cream/50 rounded-xl border border-plum/15 text-sm text-plum focus:outline-none focus:border-orbit-purple focus:ring-1 focus:ring-orbit-purple transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-plum/80 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-plum/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rivera@university.edu"
                  className="w-full pl-11 pr-4 py-3 bg-cream/50 rounded-xl border border-plum/15 text-sm text-plum focus:outline-none focus:border-orbit-purple focus:ring-1 focus:ring-orbit-purple transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-plum/80 mb-1.5">
                Target Job Role
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-plum/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-cream/50 rounded-xl border border-plum/15 text-sm text-plum focus:outline-none focus:border-orbit-purple focus:ring-1 focus:ring-orbit-purple transition-colors appearance-none"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-plum/80 mb-1.5">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-plum/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-cream/50 rounded-xl border border-plum/15 text-sm text-plum focus:outline-none focus:border-orbit-purple focus:ring-1 focus:ring-orbit-purple transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full shadow-soft"
                icon={UserPlus}
              >
                Create Account & Launch Studio
              </Button>
            </div>
          </form>

          <p className="text-center text-[11px] text-plum/60 mt-4 leading-normal">
            By registering, you agree to our respectful studio principles and privacy terms. Voice data remains confidential.
          </p>
        </Card>

        {/* Footer Link */}
        <p className="text-center text-sm text-plum/70 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-orbit-purple hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};
