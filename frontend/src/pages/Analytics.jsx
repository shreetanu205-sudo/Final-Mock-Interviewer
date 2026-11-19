import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { interviewService } from '../services/interviewService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { 
  TrendingUp, 
  BarChart2, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Play, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';

export const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashData, interviewList] = await Promise.all([
          analyticsService.getDashboardStats(),
          interviewService.getUserInterviews(),
        ]);
        setStats(dashData);
        setInterviews(interviewList);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalInterviews = stats?.totalInterviews || 0;
  const avgScore = stats?.averageInterviewScore || 0;
  const scoreHistory = stats?.scoreHistory || [];
  const skillPerformance = stats?.skillPerformance || [];
  const areasRequiringImprovement = stats?.areasRequiringImprovement || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-plum/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orbit-purple px-3 py-1 rounded-full bg-orbit-lavender/50">
            Performance Intelligence
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-plum mt-2">
            Interview Analytics & Skill Trends
          </h1>
          <p className="text-sm text-plum/70 font-normal mt-1">
            Track your progression across 5-question batches, identify mastery gaps, and review session archives.
          </p>
        </div>

        <Link to="/interview/setup">
          <Button variant="primary" size="md" icon={Play} className="shadow-soft">
            New Studio Session
          </Button>
        </Link>
      </div>

      {/* Top 3 KPI metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card padding="p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-orbit-muted">Sessions Completed</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-4xl font-bold text-plum">{totalInterviews}</span>
            <span className="text-xs text-orbit-muted">interviews</span>
          </div>
          <p className="text-xs text-plum/60 mt-1">All multi-batch sessions</p>
        </Card>

        <Card padding="p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-orbit-muted">Overall Average</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-4xl font-bold text-plum">{avgScore > 0 ? `${avgScore}%` : '—'}</span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              Rubric Standard
            </span>
          </div>
          <p className="text-xs text-plum/60 mt-1">Objective AI evaluation</p>
        </Card>

        <Card padding="p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-orbit-muted">Top Ranked Skill</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-plum truncate max-w-[200px]">
              {skillPerformance.length > 0 ? skillPerformance[0].skill : '—'}
            </span>
            {skillPerformance.length > 0 && (
              <span className="text-xs font-bold text-orbit-purple">
                {skillPerformance[0].averageScore}%
              </span>
            )}
          </div>
          <p className="text-xs text-plum/60 mt-1">Highest mastery domain</p>
        </Card>
      </div>

      {/* Main Charts: Score Progression Over Time */}
      <Card padding="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-plum">Interview Score Progression Over Time</h3>
            <p className="text-xs text-orbit-muted mt-0.5">Chronological readiness score achieved per completed interview session</p>
          </div>
          <Badge variant="lavender">Progress Trend</Badge>
        </div>

        {scoreHistory.length < 2 ? (
          <div className="py-12 text-center bg-cream/40 rounded-2xl border border-dashed border-plum/15">
            <TrendingUp className="w-10 h-10 text-orbit-purple/40 mx-auto mb-2" />
            <h4 className="font-serif font-bold text-plum text-sm">Need at least 2 sessions to chart trends</h4>
            <p className="text-xs text-plum/60 max-w-sm mx-auto mt-1 mb-4">
              Complete more interview batches to visualize your score trajectories and growth.
            </p>
            <Link to="/interview/setup">
              <Button variant="outline" size="sm">Start an Interview</Button>
            </Link>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreHistory} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#24102F15" />
                <XAxis dataKey="date" tick={{ fill: '#81758A', fontSize: 11 }} />
                <YAxis domain={[40, 100]} tick={{ fill: '#81758A', fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Score']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #24102F15' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#713B91"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#713B91' }}
                  activeDot={{ r: 8, fill: '#24102F' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Skill Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Skill Scores Bar Chart */}
        <div className="lg:col-span-7">
          <Card padding="p-7 space-y-5">
            <div>
              <h3 className="font-serif text-xl font-bold text-plum">Skill Performance Index</h3>
              <p className="text-xs text-orbit-muted mt-0.5">Average score across assessed competencies</p>
            </div>

            {skillPerformance.length === 0 ? (
              <p className="text-xs text-orbit-muted py-8 text-center italic">No skill evaluations yet.</p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillPerformance} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#24102F15" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#81758A', fontSize: 11 }} />
                    <YAxis dataKey="skill" type="category" tick={{ fill: '#24102F', fontSize: 12, fontWeight: 500 }} />
                    <Tooltip
                      formatter={(val) => [`${val}%`, 'Mastery']}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #24102F15' }}
                    />
                    <Bar dataKey="averageScore" fill="#FFB79D" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        {/* Improvement Areas */}
        <div className="lg:col-span-5">
          <Card padding="p-7 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif text-xl font-bold text-plum">Persistent Focus Areas</h3>
            </div>
            <p className="text-xs text-orbit-muted">Recurring gaps identified across batch submissions:</p>

            <div className="space-y-3">
              {areasRequiringImprovement.map((area, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-cream/70 border border-plum/10 text-xs text-plum/80 leading-relaxed flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orbit-purple mt-1.5 flex-shrink-0" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* Comprehensive Interview History Archive */}
      <Card padding="p-8 space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-plum">Interview Session History</h3>
          <p className="text-xs text-orbit-muted mt-0.5">Complete record of your practice rooms and performance reports</p>
        </div>

        {interviews.length === 0 ? (
          <p className="text-xs text-orbit-muted py-8 text-center italic">No recorded sessions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-plum/10 text-orbit-muted uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Job Role</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Questions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-plum/10">
                {interviews.map((item) => (
                  <tr key={item.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3.5 px-4 text-orbit-muted">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-plum">
                      {item.jobRole}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="neutral" size="sm">{item.difficulty}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-plum/70">
                      {item.totalQuestions} Questions ({item.totalBatches} batches)
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={item.status === 'COMPLETED' ? 'mint' : 'lavender'} size="sm">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-orbit-purple">
                      {item.status === 'COMPLETED' ? `${item.overallScore}%` : 'In Progress'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {item.status === 'COMPLETED' ? (
                        <Link to={`/reports/${item.id}`}>
                          <Button variant="outline" size="sm">View Report</Button>
                        </Link>
                      ) : (
                        <Link to={`/interview/${item.id}`}>
                          <Button variant="lavender" size="sm">Resume</Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  );
};
