import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  User, 
  LogOut, 
  FileText, 
  Layers, 
  BarChart2, 
  Menu, 
  X,
  Compass,
  ArrowRight
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isCurrent = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#FFF7F0]/90 backdrop-blur-md border-b border-[#24102F]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-orbit-purple flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <img src="/logo.svg" alt="PrepOrbit Logo" className="w-8 h-8" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-plum block leading-none">
                PrepOrbit
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-orbit-purple">
                AI Interview Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/#how-it-works" 
              className="text-sm font-medium text-plum/70 hover:text-plum hover:underline underline-offset-8 transition-colors"
            >
              How it works
            </Link>
            <Link 
              to="/#features" 
              className="text-sm font-medium text-plum/70 hover:text-plum hover:underline underline-offset-8 transition-colors"
            >
              Features
            </Link>
            <Link 
              to="/resume" 
              className={`text-sm font-medium transition-colors ${
                isCurrent('/resume') ? 'text-orbit-purple font-semibold' : 'text-plum/70 hover:text-plum'
              }`}
            >
              Resume Intelligence
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors ${
                    isCurrent('/dashboard') ? 'text-orbit-purple font-semibold' : 'text-plum/70 hover:text-plum'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/analytics" 
                  className={`text-sm font-medium transition-colors ${
                    isCurrent('/analytics') ? 'text-orbit-purple font-semibold' : 'text-plum/70 hover:text-plum'
                  }`}
                >
                  Analytics
                </Link>
              </>
            )}
          </div>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-plum/15 bg-white hover:bg-cream transition-colors text-plum text-sm font-medium shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-orbit-lavender text-orbit-purple flex items-center justify-center font-bold text-xs uppercase">
                    {user?.fullName ? user.fullName[0] : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.fullName || 'My Account'}</span>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-plum/10 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-plum/10">
                      <p className="text-xs text-orbit-muted uppercase font-semibold">Signed in as</p>
                      <p className="text-sm font-bold text-plum truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[11px] bg-orbit-lavender/60 text-plum px-2 py-0.5 rounded-full font-medium">
                        {user?.targetRole || 'Software Candidate'}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-plum/80 hover:bg-cream hover:text-plum transition-colors"
                    >
                      <Layers className="w-4 h-4 text-orbit-purple" />
                      Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-plum/80 hover:bg-cream hover:text-plum transition-colors"
                    >
                      <User className="w-4 h-4 text-orbit-purple" />
                      Profile & Settings
                    </Link>

                    <Link
                      to="/resume"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-plum/80 hover:bg-cream hover:text-plum transition-colors"
                    >
                      <FileText className="w-4 h-4 text-orbit-purple" />
                      Resume & ATS Score
                    </Link>

                    <Link
                      to="/analytics"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-plum/80 hover:bg-cream hover:text-plum transition-colors"
                    >
                      <BarChart2 className="w-4 h-4 text-orbit-purple" />
                      Interview Analytics
                    </Link>

                    <div className="border-t border-plum/10 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-plum hover:text-orbit-purple px-4 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/interview/setup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orbit-purple text-white text-sm font-semibold hover:bg-plum hover:shadow-medium transition-all duration-200"
                >
                  <span>Practise Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-plum hover:bg-plum/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-b border-plum/10 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-plum hover:bg-white"
          >
            How it works
          </Link>
          <Link
            to="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-plum hover:bg-white"
          >
            Features
          </Link>
          <Link
            to="/resume"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-plum hover:bg-white"
          >
            Resume Intelligence
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-plum hover:bg-white"
              >
                Dashboard
              </Link>
              <Link
                to="/interview/setup"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-orbit-purple font-semibold hover:bg-white"
              >
                Start New Interview
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-plum hover:bg-white"
              >
                Profile & Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-4 border-t border-plum/10 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded-full border border-plum/20 font-semibold text-plum"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded-full bg-orbit-purple text-white font-semibold shadow-soft"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
