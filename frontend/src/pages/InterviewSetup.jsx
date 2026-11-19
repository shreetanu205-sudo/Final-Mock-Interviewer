import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interviewService } from '../services/interviewService';
import { resumeService } from '../services/resumeService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Alert } from '../components/common/Alert';
import { 
  Play, 
  Layers, 
  Mic, 
  FileText, 
  Sliders, 
  Check, 
  Plus, 
  Sparkles, 
  Volume2, 
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

export const InterviewSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isSupported: isVoiceSupported } = useSpeechRecognition();

  const standardRoles = [
    'Full Stack Developer',
    'Backend Developer',
    'Frontend Developer',
    'Java Developer',
    'Python Developer',
    'Data Analyst',
    'Software Engineer',
    'Custom Role',
  ];

  const standardSkills = [
    'Java',
    'Python',
    'C++',
    'Data Structures & Algorithms',
    'DBMS',
    'Operating Systems',
    'Computer Networks',
    'React',
    'Spring Boot',
    'SQL',
    'System Design',
    'Machine Learning',
  ];

  const [selectedRole, setSelectedRole] = useState(user?.targetRole || 'Full Stack Developer');
  const [customRole, setCustomRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(['Java', 'React', 'Spring Boot', 'SQL']);
  const [customSkill, setCustomSkill] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate'); // Beginner, Intermediate, Advanced
  const [category, setCategory] = useState('Mixed'); // Technical, HR, Behavioral, Project-based, Mixed
  const [totalQuestions, setTotalQuestions] = useState(15); // 10, 15, 20
  const [mode, setMode] = useState('text'); // text, voice
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [resumes, setResumes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const list = await resumeService.getUserResumes();
        setResumes(list);
        if (list.length > 0) {
          setSelectedResumeId(list[0].id);
          // If candidate has resume skills, blend them in
          if (list[0].technicalSkills && list[0].technicalSkills.length > 0) {
            setSelectedSkills(Array.from(new Set([...selectedSkills, ...list[0].technicalSkills.slice(0, 6)])));
          }
        }
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
      }
    };
    fetchResumes();
  }, []);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
      }
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setError('');

    const effectiveRole = selectedRole === 'Custom Role' ? customRole.trim() : selectedRole;
    if (!effectiveRole) {
      setError('Please provide or select a target job role.');
      return;
    }

    if (selectedSkills.length === 0) {
      setError('Please select at least one core skill.');
      return;
    }

    setLoading(true);
    try {
      const interview = await interviewService.createInterview({
        jobRole: effectiveRole,
        targetSkills: selectedSkills,
        difficulty,
        category,
        totalQuestions,
        mode,
        resumeId: selectedResumeId || null,
      });

      // Navigate straight to the active mock interview studio
      navigate(`/interview/${interview.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize interview studio session.');
      setLoading(false);
    }
  };

  const totalBatches = Math.ceil(totalQuestions / 5);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-orbit-purple px-3 py-1 rounded-full bg-orbit-lavender/40">
          Studio Configuration
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-plum">
          Configure Your Practice Studio
        </h1>
        <p className="text-sm sm:text-base text-plum/70 font-normal">
          Customize your interview role, skill focus, difficulty, and mode. Questions will be generated in structured <strong className="font-semibold text-plum">5-question batches</strong>.
        </p>
      </div>

      {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

      <form onSubmit={handleStartInterview} className="space-y-8">
        
        {/* 1. Job Role Selection */}
        <Card padding="p-7">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-5 h-5 text-orbit-purple" />
            <h3 className="font-serif text-xl font-bold text-plum">Target Job Role</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {standardRoles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`p-3.5 rounded-2xl text-xs font-bold transition-all border text-left ${
                  selectedRole === role
                    ? 'bg-plum text-white border-plum shadow-soft'
                    : 'bg-cream/40 text-plum border-plum/10 hover:border-plum/30'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {selectedRole === 'Custom Role' && (
            <div className="mt-4">
              <input
                type="text"
                required
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="Enter custom job title (e.g. Cloud Security Engineer, DevOps Specialist)"
                className="w-full px-4 py-3 bg-cream/40 rounded-xl border border-plum/20 text-sm text-plum focus:outline-none focus:border-orbit-purple"
              />
            </div>
          )}
        </Card>

        {/* 2. Target Skills Selection */}
        <Card padding="p-7">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-orbit-purple" />
              <h3 className="font-serif text-xl font-bold text-plum">Skills & Topics ({selectedSkills.length} selected)</h3>
            </div>
            <span className="text-xs text-orbit-muted">Select 1 or more</span>
          </div>

          <div className="flex flex-wrap gap-2.5 mb-4">
            {standardSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-orbit-purple text-white border-orbit-purple shadow-sm'
                      : 'bg-white text-plum/80 border-plum/15 hover:border-plum/30 hover:bg-cream/40'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>

          {/* Add custom skill input */}
          <div className="flex items-center gap-2 max-w-md pt-2 border-t border-plum/10">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              placeholder="Add other skill (e.g. Docker, GraphQL, Kubernetes)"
              className="flex-1 px-4 py-2 text-xs bg-cream/40 rounded-xl border border-plum/15 text-plum focus:outline-none focus:border-orbit-purple"
            />
            <Button type="button" variant="outline" size="sm" icon={Plus} onClick={handleAddCustomSkill}>
              Add
            </Button>
          </div>
        </Card>

        {/* 3. Category & Difficulty & Length */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Category */}
          <Card padding="p-6">
            <h4 className="font-serif text-base font-bold text-plum mb-3">Interview Category</h4>
            <div className="space-y-2">
              {[
                { id: 'Mixed', label: 'Mixed (Tech + Project + HR)' },
                { id: 'Technical', label: 'Technical & Coding' },
                { id: 'Project-based', label: 'Project Architecture' },
                { id: 'Behavioral', label: 'Behavioral & STAR' },
                { id: 'HR', label: 'HR & Cultural Fit' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    category === cat.id
                      ? 'bg-orbit-lavender/60 text-plum border-orbit-purple shadow-sm'
                      : 'bg-cream/40 text-plum/70 border-transparent hover:bg-cream'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Difficulty */}
          <Card padding="p-6">
            <h4 className="font-serif text-base font-bold text-plum mb-3">Difficulty Level</h4>
            <div className="space-y-2">
              {[
                { id: 'Beginner', desc: 'Core fundamentals & syntax', badge: 'Fresh Grad' },
                { id: 'Intermediate', desc: 'Practical scenarios & trade-offs', badge: 'Recommended' },
                { id: 'Advanced', desc: 'Architecture, concurrency, scale', badge: 'Senior' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setDifficulty(diff.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    difficulty === diff.id
                      ? 'bg-orbit-peach/40 text-plum border-[#4A1D0E] shadow-sm'
                      : 'bg-cream/40 text-plum/70 border-transparent hover:bg-cream'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-plum">
                    <span>{diff.id}</span>
                    <span className="text-[10px] text-orbit-muted">{diff.badge}</span>
                  </div>
                  <p className="text-[11px] text-plum/60 mt-0.5">{diff.desc}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Interview Length */}
          <Card padding="p-6">
            <h4 className="font-serif text-base font-bold text-plum mb-3">Interview Length</h4>
            <div className="space-y-2">
              {[
                { count: 10, label: 'Short', batches: '2 Batches (10 Qs)' },
                { count: 15, label: 'Standard', batches: '3 Batches (15 Qs)' },
                { count: 20, label: 'Detailed', batches: '4 Batches (20 Qs)' },
              ].map((len) => (
                <button
                  key={len.count}
                  type="button"
                  onClick={() => setTotalQuestions(len.count)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    totalQuestions === len.count
                      ? 'bg-orbit-mint/40 text-plum border-emerald-700 shadow-sm'
                      : 'bg-cream/40 text-plum/70 border-transparent hover:bg-cream'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-plum">
                    <span>{len.label}</span>
                    <span className="text-[10px] text-emerald-800 font-semibold">{len.count} Questions</span>
                  </div>
                  <p className="text-[11px] text-plum/60 mt-0.5">{len.batches}</p>
                </button>
              ))}
            </div>
          </Card>

        </div>

        {/* 4. Interview Mode: Text vs Voice */}
        <Card padding="p-7">
          <h3 className="font-serif text-xl font-bold text-plum mb-2">Interview Interaction Mode</h3>
          <p className="text-xs text-plum/70 mb-5">
            Choose how you would like to answer questions in your studio session.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Text Mode */}
            <div
              onClick={() => setMode('text')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                mode === 'text'
                  ? 'bg-white border-orbit-purple ring-2 ring-orbit-purple/20 shadow-soft'
                  : 'bg-cream/40 border-plum/10 hover:bg-cream'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif font-bold text-base text-plum">Text-Based Studio</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-plum/10 text-plum">Standard</span>
              </div>
              <p className="text-xs text-plum/70 leading-relaxed">
                Type your responses in the distraction-free workspace. Includes character & word counter, draft saving, and full editing freedom.
              </p>
            </div>

            {/* Voice Mode */}
            <div
              onClick={() => setMode('voice')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all relative ${
                mode === 'voice'
                  ? 'bg-white border-orbit-purple ring-2 ring-orbit-purple/20 shadow-soft'
                  : 'bg-cream/40 border-plum/10 hover:bg-cream'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-orbit-purple" />
                  <span className="font-serif font-bold text-base text-plum">Voice-Based Studio</span>
                </div>
                <Badge variant="mint" size="sm">Interactive</Badge>
              </div>
              <p className="text-xs text-plum/70 leading-relaxed">
                Hear questions read aloud with text-to-speech. Speak your answers naturally with live speech-to-text transcription and audio replay.
              </p>
              {!isVoiceSupported && (
                <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  Note: Web Speech recognition is best supported in Chrome/Edge browsers. Fallback text mode is enabled.
                </div>
              )}
            </div>

          </div>
        </Card>

        {/* 5. Optional Linked Resume */}
        {resumes.length > 0 && (
          <Card padding="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-base font-bold text-plum">Link Uploaded Resume</h4>
                <p className="text-xs text-orbit-muted">Questions will incorporate your real project experience</p>
              </div>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="px-3.5 py-2 bg-cream/40 rounded-xl border border-plum/20 text-xs font-semibold text-plum focus:outline-none"
              >
                <option value="">None (Generic Role Interview)</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.fileName} ({r.atsScore}% ATS)
                  </option>
                ))}
              </select>
            </div>
          </Card>
        )}

        {/* Submit & Launch */}
        <div className="text-center pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            icon={Play}
            className="w-full sm:w-auto px-12 py-4 shadow-elevated"
          >
            Launch Interview Studio ({totalBatches} Batches • {totalQuestions} Questions)
          </Button>
          <p className="text-xs text-orbit-muted mt-3 font-normal">
            Your interview progress will be preserved even if you refresh or navigate away.
          </p>
        </div>

      </form>

    </div>
  );
};
