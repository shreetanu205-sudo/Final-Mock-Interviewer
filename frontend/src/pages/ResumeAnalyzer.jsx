import React, { useState, useEffect } from 'react';
import { resumeService } from '../services/resumeService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { Badge } from '../components/common/Badge';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Edit3, 
  Save, 
  Trash2, 
  RefreshCw, 
  Plus, 
  X,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResumeAnalyzer = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editingMode, setEditingMode] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Editable fields state
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [summary, setSummary] = useState('');
  const [techSkills, setTechSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [softSkills, setSoftSkills] = useState([]);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await resumeService.getUserResumes();
      setResumes(data);
      if (data.length > 0) {
        populateSelected(data[0]);
      }
    } catch (err) {
      console.error('Failed to load resumes:', err);
    }
  };

  const populateSelected = (resume) => {
    setSelectedResume(resume);
    setCandidateName(resume.candidateName || '');
    setCandidateEmail(resume.candidateEmail || '');
    setCandidatePhone(resume.candidatePhone || '');
    setSummary(resume.professionalSummary || '');
    setTechSkills(resume.technicalSkills || []);
    setSoftSkills(resume.softSkills || []);
    setJobDescription(resume.targetJobDescription || '');
    setEditingMode(false);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      const ext = selected.name.toLowerCase();
      if (!validTypes.includes(selected.type) && !ext.endsWith('.pdf') && !ext.endsWith('.docx') && !ext.endsWith('.txt')) {
        setError('Invalid file format. Please upload a PDF, DOCX, or TXT file.');
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        setError('File exceeds 10MB limit.');
        return;
      }
      setFile(selected);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please choose a resume file to upload.');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const result = await resumeService.uploadResume(file, jobDescription);
      setMessage(`Resume "${result.fileName}" parsed successfully! Estimated ATS Score: ${result.atsScore}%`);
      setFile(null);
      await loadResumes();
      populateSelected(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload and parse resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleReanalyze = async () => {
    if (!selectedResume) return;
    setReanalyzing(true);
    setError('');
    setMessage('');

    try {
      const updated = await resumeService.reanalyzeResume(selectedResume.id, jobDescription);
      setMessage('Resume re-analyzed successfully against target job description.');
      await loadResumes();
      populateSelected(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to re-analyze resume.');
    } finally {
      setReanalyzing(false);
    }
  };

  const handleSaveEdits = async () => {
    if (!selectedResume) return;
    setSavingEdit(true);
    setError('');

    try {
      const updated = await resumeService.updateResume(selectedResume.id, {
        candidateName,
        candidateEmail,
        candidatePhone,
        professionalSummary: summary,
        technicalSkills: techSkills,
        softSkills: softSkills,
        targetJobDescription: jobDescription,
      });
      setMessage('Extracted resume details updated and ATS score recalibrated.');
      await loadResumes();
      populateSelected(updated);
      setEditingMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update resume details.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumeService.deleteResume(id);
      setMessage('Resume deleted.');
      const remaining = resumes.filter((r) => r.id !== id);
      setResumes(remaining);
      if (remaining.length > 0) {
        populateSelected(remaining[0]);
      } else {
        setSelectedResume(null);
      }
    } catch (err) {
      setError('Failed to delete resume.');
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !techSkills.includes(newSkill.trim())) {
      setTechSkills([...techSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setTechSkills(techSkills.filter((s) => s !== skill));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-plum/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orbit-purple px-3 py-1 rounded-full bg-orbit-lavender/50">
            Resume Intelligence & ATS Engine
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-plum mt-2">
            Resume Analyzer & Match Studio
          </h1>
          <p className="text-sm text-plum/70 font-normal mt-1 max-w-2xl">
            Upload your resume, verify extracted metadata, and examine how well your skills match industry target roles.
          </p>
        </div>

        <Link to="/interview/setup">
          <Button variant="primary" size="md" icon={PlayIcon} className="shadow-soft">
            Launch Mock Interview with Resume
          </Button>
        </Link>
      </div>

      {message && <Alert type="success" message={message} onDismiss={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

      {/* Upload Zone & Optional Job Description */}
      <Card padding="p-8">
        <h2 className="font-serif text-xl font-bold text-plum mb-2">Upload or Replace Resume</h2>
        <p className="text-xs text-plum/70 mb-6">
          Supported formats: PDF, DOCX, TXT (Maximum file size: 10MB).
        </p>

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* File Drag / Drop area */}
            <div className="lg:col-span-7">
              <label className="border-2 border-dashed border-plum/20 hover:border-orbit-purple rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer bg-cream/30 hover:bg-cream/60 transition-all text-center">
                <UploadCloud className="w-10 h-10 text-orbit-purple mb-3" />
                <span className="font-serif font-bold text-sm text-plum">
                  {file ? file.name : 'Click to select or drag and drop your resume file'}
                </span>
                <span className="text-xs text-orbit-muted mt-1">PDF or Word (.docx)</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />
              </label>
            </div>

            {/* Optional Target Job Description matching */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-plum/80">
                  Target Job Description (Optional)
                </label>
                <span className="text-[11px] text-orbit-purple font-semibold">For keyword matching</span>
              </div>
              <textarea
                rows="4"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description or requirements here to check specific keyword alignment..."
                className="w-full p-3.5 bg-cream/40 rounded-2xl border border-plum/15 text-xs text-plum focus:outline-none focus:border-orbit-purple"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={uploading}
              disabled={!file}
              icon={Sparkles}
              className="shadow-soft"
            >
              Parse Resume & Calculate ATS Score
            </Button>
          </div>
        </form>
      </Card>

      {/* Parsed Resume View & ATS Score Analysis */}
      {selectedResume ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: ATS Score & Improvement Recommendations */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* ATS Score Card */}
            <Card padding="p-8 text-center space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-orbit-muted">
                ATS Compatibility Index
              </span>

              {/* Big Score Dial */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center rounded-full bg-gradient-to-tr from-orbit-lavender to-orbit-peach p-1.5 shadow-soft">
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-2">
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-plum">
                    {selectedResume.atsScore}%
                  </span>
                  <span className="text-[11px] font-semibold text-orbit-purple mt-0.5">
                    {selectedResume.atsScore >= 80 ? 'High Match' : selectedResume.atsScore >= 65 ? 'Moderate Match' : 'Needs Optimization'}
                  </span>
                </div>
              </div>

              {/* Disclaimer Notice */}
              <div className="p-3.5 rounded-2xl bg-cream/60 border border-plum/10 text-[11px] text-plum/70 leading-relaxed text-left">
                <span className="font-bold text-plum block mb-0.5">Estimated Heuristic Indicator:</span>
                This score measures keyword density, structural section headers, and measurable impact markers. It is an educational tool to guide resume revisions, not a commercial ATS warranty.
              </div>

              {/* Breakdown Bars */}
              {selectedResume.atsScoreBreakdown && (
                <div className="space-y-3 pt-3 text-left">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orbit-muted">Score Breakdown</h4>
                  
                  {Object.entries(selectedResume.atsScoreBreakdown).map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-plum">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-bold text-orbit-purple">{val}%</span>
                      </div>
                      <div className="w-full h-2 bg-cream rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orbit-purple rounded-full"
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Re-analyze CTA */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReanalyze}
                  loading={reanalyzing}
                  icon={RefreshCw}
                  className="w-full"
                >
                  Recalculate with Current JD
                </Button>
              </div>
            </Card>

            {/* Identified Missing Skills Card */}
            <Card padding="p-7 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-plum">Identified Missing Skills</h3>
              </div>
              <p className="text-xs text-plum/70">
                Keywords frequently expected for this role profile that were not detected in your resume:
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {(selectedResume.identifiedMissingSkills || []).map((sk, idx) => (
                  <Badge key={idx} variant="peach" size="md">
                    + {sk}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Improvement Suggestions */}
            <Card padding="p-7 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orbit-purple" />
                <h3 className="font-serif text-lg font-bold text-plum">Actionable Suggestions</h3>
              </div>

              <div className="space-y-3">
                {(selectedResume.improvementSuggestions || []).map((sugg, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-cream/60 border border-plum/10 text-xs text-plum/80 leading-relaxed flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{sugg}</span>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* Right Column: Parsed Content & Editable Sections */}
          <div className="lg:col-span-7 space-y-6">
            <Card padding="p-8 space-y-6">
              
              {/* Header with edit toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-plum/10">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-plum">Extracted Information</h3>
                  <p className="text-xs text-orbit-muted">Review and correct parsed details if necessary</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {editingMode ? (
                    <>
                      <Button variant="primary" size="sm" icon={Save} onClick={handleSaveEdits} loading={savingEdit}>
                        Save Edits
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingMode(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" icon={Edit3} onClick={() => setEditingMode(true)}>
                        Correct Information
                      </Button>
                      <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(selectedResume.id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-orbit-muted mb-1">
                    Candidate Name
                  </label>
                  {editingMode ? (
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-cream/40 rounded-lg border border-plum/20"
                    />
                  ) : (
                    <p className="text-sm font-bold text-plum">{candidateName || '—'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-orbit-muted mb-1">
                    Email
                  </label>
                  {editingMode ? (
                    <input
                      type="text"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-cream/40 rounded-lg border border-plum/20"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-plum truncate">{candidateEmail || '—'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-orbit-muted mb-1">
                    Phone
                  </label>
                  {editingMode ? (
                    <input
                      type="text"
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-cream/40 rounded-lg border border-plum/20"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-plum">{candidatePhone || '—'}</p>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-orbit-muted mb-1">
                  Professional Summary
                </label>
                {editingMode ? (
                  <textarea
                    rows="3"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full p-3 text-xs bg-cream/40 rounded-xl border border-plum/20"
                  />
                ) : (
                  <p className="text-xs text-plum/80 leading-relaxed font-normal bg-cream/40 p-4 rounded-xl border border-plum/10">
                    {summary || 'No summary detected.'}
                  </p>
                )}
              </div>

              {/* Technical Skills */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-orbit-muted mb-2">
                  Technical Skills Detected ({techSkills.length})
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {techSkills.map((sk) => (
                    <span
                      key={sk}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orbit-lavender/50 text-plum font-semibold text-xs border border-plum/10"
                    >
                      <span>{sk}</span>
                      {editingMode && (
                        <button type="button" onClick={() => handleRemoveSkill(sk)}>
                          <X className="w-3 h-3 text-plum hover:text-red-600" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {editingMode && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add detected skill"
                      className="px-3 py-1.5 text-xs bg-cream/40 rounded-lg border border-plum/20"
                    />
                    <Button variant="outline" size="sm" onClick={handleAddSkill}>Add</Button>
                  </div>
                )}
              </div>

              {/* Projects */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-orbit-muted mb-2">
                  Projects Extracted
                </label>
                <div className="space-y-3">
                  {(selectedResume.projects || []).map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-cream/40 border border-plum/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h5 className="font-serif font-bold text-sm text-plum">{proj.title || 'Project'}</h5>
                        {proj.technologies && (
                          <div className="flex gap-1">
                            {proj.technologies.slice(0, 3).map((t, tIdx) => (
                              <span key={tIdx} className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded border border-plum/10 text-orbit-purple">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-plum/75 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-orbit-muted mb-2">
                    Education
                  </label>
                  <div className="space-y-2">
                    {(selectedResume.education || []).map((edu, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-cream/40 border border-plum/10 text-xs">
                        <p className="font-bold text-plum">{edu.degree || edu.institution}</p>
                        <p className="text-[11px] text-orbit-muted">{edu.institution} • {edu.graduationYear || '2024'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-orbit-muted mb-2">
                    Work / Internships
                  </label>
                  <div className="space-y-2">
                    {(selectedResume.workExperience || []).map((work, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-cream/40 border border-plum/10 text-xs">
                        <p className="font-bold text-plum">{work.role || work.company}</p>
                        <p className="text-[11px] text-orbit-muted">{work.company} • {work.duration || 'Recent'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </Card>
          </div>

        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-plum/20">
          <FileText className="w-12 h-12 text-orbit-purple/40 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-plum">No resume parsed yet</h3>
          <p className="text-xs text-plum/60 max-w-sm mx-auto mt-1 mb-6">
            Upload your resume above to extract your skills, compute ATS keyword alignment, and prepare personalized mock interview questions.
          </p>
        </div>
      )}

    </div>
  );
};

const PlayIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
