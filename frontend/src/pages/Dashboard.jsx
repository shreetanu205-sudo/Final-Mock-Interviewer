import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analyticsService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { 
  Play, 
  FileText, 
  BarChart3, 
  Award, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await analyticsService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const totalInterviews = stats?.totalInterviews || 0;
  const averageScore = stats?.averageInterviewScore || 0;
  const atsScore = stats?.currentAtsScore;
  const recentInterviews = stats?.recentInterviews || [];
  const skillPerformance = stats?.skillPerformance || [];
  const areasRequiringImprovement = stats?.areasRequiringImprovement || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-plum/10 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orbit-lavender/50 text-xs font-semibold text-plum uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-orbit-purple" />
            <span>AI Practice Studio Active</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-plum leading-tight">
            Welcome back, {user?.fullName || 'Candidate'}.
          </h1>

          <p className="text-sm sm:text-base text-plum/70 font-normal leading-relaxed">
            Your studio is ready. Review your estimated ATS resume score, launch a focused 5-question interview batch, or track your skill gains.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link to="/interview/setup">
              <Button variant="primary" size="md" icon={Play} className="shadow-soft">
                Start New Interview
              </Button>
            </Link>
            <Link to="/resume">
              <Button variant="outline" size="md" icon={FileText}>
                {atsScore != null ? 'Update Resume & ATS' : 'Upload Resume'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient Orbit Graphic */}
        <div className="hidden lg:block relative z-10">
          <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-orbit-lavender to-orbit-peach p-1 flex items-center justify-center shadow-medium">
            <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-center p-4">
              <span className="text-[11px] font-bold text-orbit-muted uppercase tracking-wider">Target Role</span>
              <span className="font-serif font-bold text-plum text-sm mt-1 leading-snug">{user?.targetRole || 'Full Stack'}</span>
              <Badge variant="mint" size="sm" className="mt-2">Ready</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Interviews */}
        <Card padding="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orbit-muted">Interviews Completed</span>
            <div className="w-10 h-10 rounded-2xl bg-orbit-lavender/50 text-orbit-purple flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-plum">{totalInterviews}</span>
            <span className="text-xs text-orbit-muted font-medium">sessions</span>
          </div>
          <p className="text-xs text-plum/60 mt-2">
            {totalInterviews > 0 ? 'Consistent practice leads to peak readiness.' : 'Complete your first batch to begin tracking.'}
          </p>
        </Card>

        {/* Average Interview Score */}
        <Card padding="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orbit-muted">Average Interview Score</span>
            <div className="w-10 h-10 rounded-2xl bg-orbit-peach/40 text-[#4A1D0E] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-plum">
              {averageScore > 0 ? `${averageScore}%` : '—'}
            </span>
            {averageScore > 0 && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                5-Point Rubric
              </span>
            )}
          </div>
          <p className="text-xs text-plum/60 mt-2">
            {averageScore >= 80 ? 'Exceptional mastery across concepts.' : averageScore > 0 ? 'Interview Ready tier in progress.' : 'Scores populate after first batch submission.'}
          </p>
        </Card>

        {/* ATS Resume Score */}
        <Card padding="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orbit-muted">Current ATS Score</span>
            <div className="w-10 h-10 rounded-2xl bg-orbit-mint/40 text-[#123E24] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-plum">
              {atsScore != null ? `${atsScore}%` : '—'}
            </span>
            {atsScore != null && (
              <span className="text-xs text-orbit-muted font-medium truncate max-w-[120px]">
                {stats?.resumeFileName}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-plum/60">
              {atsScore != null ? 'Estimated keyword compatibility' : 'No resume uploaded yet.'}
            </p>
            <Link to="/resume" className="text-xs font-bold text-orbit-purple hover:underline">
              {atsScore != null ? 'View Details' : 'Analyze Now'}
            </Link>
          </div>
        </Card>

      </div>

      {/* Main Grid: Skill-Wise Performance & Areas for Improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Skill Mastery Bars */}
        <div className="lg:col-span-7 space-y-6">
          <Card padding="p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-plum">Skill-Wise Mastery</h3>
                <p className="text-xs text-orbit-muted mt-0.5">Average score achieved across interview categories</p>
              </div>
              <Link to="/analytics" className="text-xs font-semibold text-orbit-purple hover:underline flex items-center gap-1">
                <span>Detailed Analytics</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {skillPerformance.length === 0 ? (
              <div className="text-center py-12 px-4 bg-cream/40 rounded-2xl border border-dashed border-plum/15">
                <BarChart3 className="w-10 h-10 text-orbit-purple/40 mx-auto mb-3" />
                <h4 className="font-serif text-base font-bold text-plum">No skill data yet</h4>
                <p className="text-xs text-plum/70 max-w-sm mx-auto mt-1 mb-4">
                  Complete your first 5-question interview batch to see your breakdown by Java, React, SQL, and System Design.
                </p>
                <Link to="/interview/setup">
                  <Button variant="lavender" size="sm" icon={Play}>Start 5-Question Batch</Button>
                </Link>
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#24102F15" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#81758A', fontSize: 11 }} />
                    <YAxis dataKey="skill" type="category" tick={{ fill: '#24102F', fontSize: 12, fontWeight: 500 }} />
                    <Tooltip
                      formatter={(val) => [`${val}%`, 'Mastery Score']}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #24102F15' }}
                    />
                    <Bar dataKey="averageScore" fill="#713B91" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Recent Interview Sessions Table */}
          <Card padding="p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-plum">Recent Interview Sessions</h3>
                <p className="text-xs text-orbit-muted mt-0.5">Your completed and active studio sessions</p>
              </div>
              <Link to="/interview/setup" className="text-xs font-bold text-orbit-purple hover:underline">
                New Session +
              </Link>
            </div>

            {recentInterviews.length === 0 ? (
              <div className="text-center py-8 bg-cream/40 rounded-2xl border border-dashed border-plum/15">
                <p className="text-xs text-plum/70 mb-3">No interview sessions recorded yet.</p>
                <Link to="/interview/setup">
                  <Button variant="primary" size="sm">Launch First Session</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-plum/10">
                {recentInterviews.map((session) => (
                  <div key={session.id} className="py-3.5 flex items-center justify-between hover:bg-cream/40 px-2 rounded-xl transition-colors">
                    <div>
                      <p className="font-semibold text-sm text-plum">{session.jobRole}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-orbit-muted">
                        <span>{session.difficulty}</span>
                        <span>•</span>
                        <span>{session.totalQuestions} Questions</span>
                        <span>•</span>
                        <span className="capitalize">{session.mode} Mode</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {session.status === 'COMPLETED' ? (
                        <>
                          <span className="font-serif font-bold text-sm text-orbit-purple">
                            {session.overallScore}%
                          </span>
                          <Link to={`/reports/${session.id}`}>
                            <Button variant="outline" size="sm">Report</Button>
                          </Link>
                        </>
                      ) : (
                        <Link to={`/interview/${session.id}`}>
                          <Button variant="lavender" size="sm">Resume</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Areas for Improvement & Action CTAs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Areas for Improvement Card */}
          <Card padding="p-7">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-orbit-peach/40 text-[#4A1D0E] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-plum">Recommended Focus Areas</h3>
                <p className="text-xs text-orbit-muted">Identified from recent batch submissions</p>
              </div>
            </div>

            <div className="space-y-3">
              {areasRequiringImprovement.map((area, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-cream/60 border border-plum/10 text-xs text-plum/80 leading-relaxed flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-orbit-purple mt-1.5 flex-shrink-0" />
                  <span>{area}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-plum/10">
              <Link to="/interview/setup" className="w-full">
                <Button variant="primary" size="md" className="w-full" icon={Play}>
                  Practice These Weak Spots
                </Button>
              </Link>
            </div>
          </Card>

          {/* Quick Studio Tools Card */}
          <Card padding="p-7" className="bg-gradient-to-br from-white to-orbit-lavender/20">
            <h3 className="font-serif text-lg font-bold text-plum mb-2">Studio Quick Actions</h3>
            <p className="text-xs text-plum/70 mb-5 leading-relaxed">
              Navigate directly to your core interview studio modules.
            </p>

            <div className="space-y-2.5">
              <Link
                to="/resume"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-plum/10 hover:border-orbit-purple transition-all text-xs font-semibold text-plum shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-orbit-purple" />
                  <span>Resume Parser & ATS Check</span>
                </div>
                <ChevronRight className="w-4 h-4 text-plum/40" />
              </Link>

              <Link
                to="/interview/setup"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-plum/10 hover:border-orbit-purple transition-all text-xs font-semibold text-plum shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Play className="w-4 h-4 text-orbit-purple" />
                  <span>Configure 5-Question Batch</span>
                </div>
                <ChevronRight className="w-4 h-4 text-plum/40" />
              </Link>

              <Link
                to="/analytics"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-plum/10 hover:border-orbit-purple transition-all text-xs font-semibold text-plum shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-orbit-purple" />
                  <span>Comprehensive Progress Reports</span>
                </div>
                <ChevronRight className="w-4 h-4 text-plum/40" />
              </Link>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};
