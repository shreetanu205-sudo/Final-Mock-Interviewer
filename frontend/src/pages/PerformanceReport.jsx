import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reportService } from '../services/reportService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Alert } from '../components/common/Alert';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Printer, 
  Download, 
  Share2, 
  Sparkles, 
  Layers, 
  BarChart3, 
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

export const PerformanceReport = () => {
  const { interviewId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await reportService.getReportByInterviewId(interviewId);
        setReport(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch interview report.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [interviewId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orbit-purple border-t-transparent animate-spin" />
        <h3 className="font-serif text-xl font-bold text-plum">Synthesizing Comprehensive Report...</h3>
        <p className="text-xs text-orbit-muted">Aggregating question rubrics, skill scores, and study plans...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <Alert type="error" message={error || 'Report not found.'} />
        <Link to="/dashboard">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const skillData = (report.skillScores || []).map((s) => ({
    skill: s.skill,
    score: s.score,
    fullMark: 100,
  }));

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Exceptional':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Interview Ready':
        return 'bg-orbit-mint text-[#123E24] border-orbit-mint';
      case 'Emerging':
        return 'bg-orbit-lavender text-plum border-orbit-lavender';
      default:
        return 'bg-orbit-peach text-[#4A1D0E] border-orbit-peach';
    }
  };

  return (
    <div ref={reportRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 print:p-0 print:m-0">
      
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-plum/10 print:hidden">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-plum/70 hover:text-plum">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
            Print / Save as PDF
          </Button>
          <Link to="/interview/setup">
            <Button variant="primary" size="sm" icon={Sparkles}>
              Practise Again
            </Button>
          </Link>
        </div>
      </div>

      {/* Report Hero Card */}
      <Card padding="p-8 sm:p-12" className="bg-white border-plum/10 shadow-elevated">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border ${getTierColor(report.readinessTier)}`}>
                {report.readinessTier}
              </span>
              <span className="text-xs text-orbit-muted">
                Evaluated {new Date(report.generatedAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-plum leading-tight">
              {report.jobRole} Performance Report
            </h1>

            <p className="text-sm sm:text-base text-plum/80 font-normal leading-relaxed">
              {report.executiveSummary}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-plum/70 font-medium">
              <div>
                <span className="text-orbit-muted block text-[10px] uppercase tracking-wider">Total Questions</span>
                <span className="font-serif text-base font-bold text-plum">{report.totalQuestions}</span>
              </div>
              <div className="h-6 w-px bg-plum/10" />
              <div>
                <span className="text-orbit-muted block text-[10px] uppercase tracking-wider">Attempted</span>
                <span className="font-serif text-base font-bold text-emerald-700">{report.attemptedQuestions}</span>
              </div>
              <div className="h-6 w-px bg-plum/10" />
              <div>
                <span className="text-orbit-muted block text-[10px] uppercase tracking-wider">Skipped</span>
                <span className="font-serif text-base font-bold text-amber-700">{report.skippedQuestions}</span>
              </div>
              <div className="h-6 w-px bg-plum/10" />
              <div>
                <span className="text-orbit-muted block text-[10px] uppercase tracking-wider">Difficulty</span>
                <span className="font-serif text-base font-bold text-plum">{report.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Big Score Dial */}
          <div className="flex-shrink-0 text-center mx-auto lg:mx-0">
            <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-orbit-lavender via-orbit-peach to-orbit-mint p-2 shadow-elevated flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-3">
                <span className="font-serif text-5xl font-bold text-plum">
                  {report.overallScore}%
                </span>
                <span className="text-[11px] font-bold text-orbit-purple uppercase tracking-wider mt-1">
                  Overall Score
                </span>
              </div>
            </div>
          </div>

        </div>
      </Card>

      {/* Skill Performance Radar & Strengths / Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Radar / Bar Chart */}
        <div className="lg:col-span-6 space-y-6">
          <Card padding="p-7">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-orbit-purple" />
              <h3 className="font-serif text-xl font-bold text-plum">Skill Competency Breakdown</h3>
            </div>

            {skillData.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#24102F15" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#81758A', fontSize: 11 }} />
                    <YAxis dataKey="skill" type="category" tick={{ fill: '#24102F', fontSize: 11, fontWeight: 600 }} />
                    <Tooltip
                      formatter={(val) => [`${val}%`, 'Score']}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #24102F15' }}
                    />
                    <Bar dataKey="score" fill="#713B91" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-orbit-muted py-8 text-center">No skill breakdown available.</p>
            )}
          </Card>
        </div>

        {/* Strongest & Weakest Areas */}
        <div className="lg:col-span-6 space-y-6">
          {/* Strongest Areas */}
          <Card padding="p-7 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif text-lg font-bold text-plum">Key Demonstrated Strengths</h3>
            </div>
            <div className="space-y-2.5">
              {(report.strongestAreas || []).map((str, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-orbit-mint/30 border border-orbit-mint text-xs text-[#123E24] font-medium leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Weakest Areas & Missing Concepts */}
          <Card padding="p-7 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif text-lg font-bold text-plum">Areas for Improvement</h3>
            </div>
            <div className="space-y-2.5">
              {(report.weakestAreas || []).map((weak, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-orbit-peach/30 border border-orbit-peach text-xs text-[#4A1D0E] font-medium leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                  <span>{weak}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* Recommended Study Topics & Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Actionable Improvement Plan */}
        <div className="lg:col-span-6 space-y-4">
          <Card padding="p-7 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orbit-purple" />
              <h3 className="font-serif text-xl font-bold text-plum">Actionable Improvement Plan</h3>
            </div>
            <div className="space-y-3">
              {(report.actionableImprovementPlan || []).map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-cream/50 border border-plum/10 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-plum">
                    <span>{item.area}</span>
                    <Badge variant={item.priority === 'High' ? 'peach' : 'lavender'} size="sm">
                      {item.priority} Priority
                    </Badge>
                  </div>
                  <p className="text-xs text-plum/75 leading-relaxed font-normal">{item.suggestion}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recommended Study Topics */}
        <div className="lg:col-span-6 space-y-4">
          <Card padding="p-7 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orbit-purple" />
              <h3 className="font-serif text-xl font-bold text-plum">Recommended Study Roadmap</h3>
            </div>
            <div className="space-y-3">
              {(report.recommendedStudyTopics || []).map((topic, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-cream/50 border border-plum/10 space-y-1.5">
                  <h4 className="font-serif text-sm font-bold text-plum">{topic.topic}</h4>
                  <p className="text-xs text-orbit-muted leading-relaxed">{topic.reason}</p>
                  <div className="pt-1 text-xs text-orbit-purple font-semibold">
                    👉 Action: {topic.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* Question-Wise In-Depth Review Accordions */}
      <Card padding="p-8 space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-plum">Question-by-Question Evaluation Review</h3>
          <p className="text-xs text-orbit-muted mt-1">
            Examine your candidate answers, objective rubric breakdown (0–20 each), and expert model answers.
          </p>
        </div>

        <div className="space-y-4">
          {(report.questionEvaluations || []).map((qe, idx) => {
            const isExpanded = expandedQuestion === idx;
            return (
              <div key={idx} className="rounded-2xl border border-plum/10 bg-cream/30 overflow-hidden transition-all">
                
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-cream/60 transition-colors"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <span className="w-7 h-7 rounded-full bg-orbit-purple text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="font-serif text-sm font-bold text-plum">
                      {qe.questionText}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-serif font-bold text-sm text-orbit-purple">
                      {qe.score}%
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-plum/50" /> : <ChevronDown className="w-5 h-5 text-plum/50" />}
                  </div>
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-5 pt-2 border-t border-plum/10 space-y-4 bg-white text-xs leading-relaxed animate-in fade-in">
                    
                    {/* Candidate Answer */}
                    <div className="p-3.5 rounded-xl bg-cream/40 border border-plum/10 space-y-1">
                      <span className="font-bold text-plum block">Your Submitted Response:</span>
                      <p className="italic text-plum/80 font-normal">
                        {qe.candidateAnswer || (qe.isSkipped ? 'Question was skipped.' : 'No response provided.')}
                      </p>
                    </div>

                    {/* Rubric scores */}
                    {qe.rubricScores && (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                        {Object.entries(qe.rubricScores).map(([rubricKey, val]) => (
                          <div key={rubricKey} className="p-2 rounded-lg bg-cream/60 border border-plum/10">
                            <span className="block text-[10px] text-orbit-muted uppercase capitalize truncate">
                              {rubricKey.replace(/([A-Z])/g, ' $1')}
                            </span>
                            <span className="font-bold text-orbit-purple text-xs">{val}/20</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* What was done well */}
                    {qe.whatWasDoneWell && (
                      <div className="p-3 rounded-lg bg-orbit-mint/30 text-[#123E24]">
                        <strong>What went well:</strong> {qe.whatWasDoneWell}
                      </div>
                    )}

                    {/* Missing concepts */}
                    {qe.missingConcepts && qe.missingConcepts.length > 0 && (
                      <div className="p-3 rounded-lg bg-orbit-peach/30 text-[#4A1D0E]">
                        <strong>Missing Concepts:</strong> {qe.missingConcepts.join(', ')}
                      </div>
                    )}

                    {/* Model Answer */}
                    {qe.suggestedBetterAnswer && (
                      <div className="p-3.5 rounded-xl bg-orbit-lavender/30 border border-orbit-lavender text-plum">
                        <strong className="block font-serif text-xs mb-1">Model Answer / Comprehensive Take:</strong>
                        <p className="font-normal leading-relaxed">{qe.suggestedBetterAnswer}</p>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
};
