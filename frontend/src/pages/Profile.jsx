import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { resumeService } from '../services/resumeService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { Badge } from '../components/common/Badge';
import { 
  User, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Save, 
  Plus, 
  X, 
  Sparkles,
  LogOut,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Profile = () => {
  const { user, refreshProfile, logout } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Developer');
  const [education, setEducation] = useState(user?.education || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills || ['Java', 'React', 'Spring Boot', 'SQL']);
  const [newSkill, setNewSkill] = useState('');
  const [resumes, setResumes] = useState([]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profile = await authService.getCurrentUser();
        if (profile) {
          setFullName(profile.fullName || '');
          setTargetRole(profile.targetRole || 'Full Stack Developer');
          setEducation(profile.education || '');
          setBio(profile.bio || '');
          if (profile.skills && profile.skills.length > 0) {
            setSkills(profile.skills);
          }
        }
        const userResumes = await resumeService.getUserResumes();
        setResumes(userResumes);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      }
    };
    fetchUserData();
  }, []);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await authService.updateProfile({
        fullName,
        targetRole,
        education,
        bio,
        skills,
      });
      await refreshProfile();
      setMessage('Profile settings saved successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-plum/10">
        <div>
          <h1 className="font-serif text-3xl font-bold text-plum">Candidate Profile</h1>
          <p className="text-sm text-plum/70 font-normal">
            Manage your personal background, preferred roles, and technical skill set.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">Back to Dashboard</Button>
          </Link>
          <Button variant="danger" size="sm" icon={LogOut} onClick={logout}>Sign Out</Button>
        </div>
      </div>

      {message && <Alert type="success" message={message} onDismiss={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Identity Card */}
        <div className="space-y-6">
          <Card padding="p-6 text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-orbit-lavender text-orbit-purple flex items-center justify-center font-bold font-serif text-3xl mx-auto shadow-soft border-4 border-white">
              {fullName ? fullName[0].toUpperCase() : 'U'}
            </div>

            <div>
              <h2 className="font-serif text-xl font-bold text-plum">{fullName || 'Candidate'}</h2>
              <p className="text-xs text-orbit-muted">{user?.email}</p>
              <Badge variant="plum" className="mt-2">{targetRole}</Badge>
            </div>

            <div className="pt-4 border-t border-plum/10 text-left text-xs space-y-2 text-plum/80">
              <div className="flex items-center justify-between">
                <span className="text-orbit-muted">Member Since</span>
                <span className="font-semibold">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-orbit-muted">Stored Resumes</span>
                <span className="font-semibold">{resumes.length}</span>
              </div>
            </div>
          </Card>

          {/* Stored Resumes Box */}
          <Card padding="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-plum">My Resumes</h3>
              <Link to="/resume" className="text-xs font-semibold text-orbit-purple hover:underline">
                Upload New
              </Link>
            </div>

            {resumes.length === 0 ? (
              <p className="text-xs text-plum/60 italic">No resumes uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {resumes.map((res) => (
                  <Link
                    key={res.id}
                    to="/resume"
                    className="block p-3 rounded-xl bg-cream/60 border border-plum/10 hover:border-orbit-purple transition-all"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-plum">
                      <span className="truncate max-w-[140px]">{res.fileName}</span>
                      <span className="text-orbit-purple font-bold">{res.atsScore}% ATS</span>
                    </div>
                    <span className="text-[10px] text-orbit-muted block mt-1">
                      {new Date(res.uploadedAt).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Col: Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="p-8">
            <form onSubmit={handleSave} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-plum/80 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream/40 rounded-xl border border-plum/15 text-sm text-plum focus:outline-none focus:border-orbit-purple"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-plum/80 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-2.5 bg-plum/5 rounded-xl border border-plum/10 text-sm text-plum/60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-plum/80 mb-2">
                    Target Job Role
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Backend Developer"
                    className="w-full px-4 py-2.5 bg-cream/40 rounded-xl border border-plum/15 text-sm text-plum focus:outline-none focus:border-orbit-purple"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-plum/80 mb-2">
                    University / Degree
                  </label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science (2024)"
                    className="w-full px-4 py-2.5 bg-cream/40 rounded-xl border border-plum/15 text-sm text-plum focus:outline-none focus:border-orbit-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-plum/80 mb-2">
                  Short Professional Bio
                </label>
                <textarea
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the studio about your core interests, background, and goals..."
                  className="w-full p-4 bg-cream/40 rounded-xl border border-plum/15 text-sm text-plum focus:outline-none focus:border-orbit-purple"
                />
              </div>

              {/* Skills Tags Manager */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-plum/80 mb-2">
                  Technical Skills & Competencies
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orbit-lavender/50 text-plum font-semibold text-xs border border-plum/10"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="p-0.5 hover:text-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill (e.g. Docker, Redis, TypeScript)"
                    className="flex-1 px-4 py-2 bg-cream/40 rounded-xl border border-plum/15 text-sm text-plum focus:outline-none focus:border-orbit-purple"
                  />
                  <Button type="button" variant="outline" size="sm" icon={Plus} onClick={handleAddSkill}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={saving}
                  icon={Save}
                  className="shadow-soft"
                >
                  Save Profile Changes
                </Button>
              </div>

            </form>
          </Card>
        </div>

      </div>

    </div>
  );
};
