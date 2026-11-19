import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { interviewService } from '../services/interviewService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Alert } from '../components/common/Alert';
import { Modal } from '../components/common/Modal';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  RotateCcw, 
  SkipForward, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  Send, 
  X,
  FileCheck,
  HelpCircle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Interview & Batch State
  const [interview, setInterview] = useState(null);
  const [batch, setBatch] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 0 to 4 (within batch)
  const [answers, setAnswers] = useState({}); // { [questionId]: { text, isSkipped, audioUrl, audioMeta } }
  const [loading, setLoading] = useState(true);
  const [submittingBatch, setSubmittingBatch] = useState(false);
  const [error, setError] = useState('');
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [batchEvaluation, setBatchEvaluation] = useState(null);
  const [showHints, setShowHints] = useState(false);

  // Timer State
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  // Voice Hooks
  const speechRecognition = useSpeechRecognition();
  const speechSynthesis = useSpeechSynthesis();
  const audioRecorder = useAudioRecorder();

  // Load interview session & current batch
  useEffect(() => {
    loadInterviewAndBatch();
  }, [id]);

  // Timer counter
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const loadInterviewAndBatch = async () => {
    setLoading(true);
    setError('');
    try {
      const interviewData = await interviewService.getInterviewById(id);
      setInterview(interviewData);

      const batchNumber = interviewData.currentBatchNumber || 1;
      const batchData = await interviewService.getBatch(id, batchNumber);
      setBatch(batchData);

      // Restore drafts from localStorage if available
      const localKey = `preporbit_interview_${id}_batch_${batchNumber}`;
      const savedDrafts = localStorage.getItem(localKey);
      if (savedDrafts) {
        try {
          setAnswers(JSON.parse(savedDrafts));
        } catch {}
      } else {
        // Initialize empty answers map
        const initial = {};
        batchData.questions.forEach((q) => {
          initial[q.id] = { text: '', isSkipped: false };
        });
        setAnswers(initial);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load interview session.');
    } finally {
      setLoading(false);
    }
  };

  // Sync current question's text with speech recognition transcript when voice mode is active
  useEffect(() => {
    if (speechRecognition.transcript && currentQuestion) {
      handleAnswerChange(speechRecognition.transcript);
    }
  }, [speechRecognition.transcript]);

  const currentQuestion = batch?.questions?.[currentQuestionIndex];

  const handleAnswerChange = (text) => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const updated = {
      ...answers,
      [qId]: {
        ...(answers[qId] || {}),
        text,
        isSkipped: false,
      },
    };
    setAnswers(updated);
    // Persist draft to localStorage
    if (batch) {
      localStorage.setItem(`preporbit_interview_${id}_batch_${batch.batchNumber}`, JSON.stringify(updated));
    }
  };

  const handleSkipQuestion = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const updated = {
      ...answers,
      [qId]: {
        ...(answers[qId] || {}),
        text: '',
        isSkipped: true,
      },
    };
    setAnswers(updated);
    if (batch) {
      localStorage.setItem(`preporbit_interview_${id}_batch_${batch.batchNumber}`, JSON.stringify(updated));
    }

    // Move to next question if available
    if (currentQuestionIndex < 4) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Voice Interaction Handlers
  const handleStartVoiceRecording = async () => {
    speechRecognition.resetTranscript();
    speechRecognition.startListening();
    await audioRecorder.startRecording();
  };

  const handleStopVoiceRecording = () => {
    speechRecognition.stopListening();
    audioRecorder.stopRecording();
  };

  const handleReadQuestionAloud = () => {
    if (!currentQuestion) return;
    if (speechSynthesis.isSpeaking) {
      speechSynthesis.stop();
    } else {
      speechSynthesis.speak(currentQuestion.text);
    }
  };

  // Batch Submission
  const handleSubmitBatch = async () => {
    if (!batch) return;
    setSubmittingBatch(true);
    setShowSubmitModal(false);
    setError('');

    const answerPayload = batch.questions.map((q) => {
      const ansObj = answers[q.id] || {};
      return {
        questionId: q.id,
        questionText: q.text,
        answer: ansObj.text || '',
        isSkipped: Boolean(ansObj.isSkipped),
        audioMetadata: ansObj.audioUrl ? { hasAudio: true } : null,
      };
    });

    try {
      const evalResponse = await interviewService.submitBatch(id, batch.batchNumber, answerPayload);
      setBatchEvaluation(evalResponse);

      // Trigger celebratory confetti for positive milestones!
      if (evalResponse.batchScore >= 75) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#713B91', '#D9C4F2', '#FFB79D', '#CBE8D6'],
        });
      }

      // Clear local draft cache for submitted batch
      localStorage.removeItem(`preporbit_interview_${id}_batch_${batch.batchNumber}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit batch for evaluation.');
    } finally {
      setSubmittingBatch(false);
    }
  };

  const handleProceedToNextBatch = async () => {
    setBatchEvaluation(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    await loadInterviewAndBatch();
  };

  const handleViewFinalReport = () => {
    navigate(`/reports/${id}`);
  };

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orbit-purple border-t-transparent animate-spin" />
        <h3 className="font-serif text-xl font-bold text-plum">Preparing Your 5-Question Batch...</h3>
        <p className="text-xs text-orbit-muted">Synthesizing tailored questions and scoring rubric...</p>
      </div>
    );
  }

  const answeredCount = Object.values(answers).filter((a) => a.text?.trim() && !a.isSkipped).length;
  const skippedCount = Object.values(answers).filter((a) => a.isSkipped).length;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header: Session Info, Batch Indicator & Actions */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-plum/10 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-orbit-purple text-white flex items-center justify-center font-bold text-sm shadow-sm">
            B{batch?.batchNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-plum">{interview?.jobRole}</h2>
              <Badge variant="plum">{interview?.difficulty}</Badge>
              <Badge variant="lavender">{interview?.category}</Badge>
            </div>
            <p className="text-xs text-orbit-muted mt-0.5">
              Batch {batch?.batchNumber} of {batch?.totalBatches} • Questions {((batch?.batchNumber - 1) * 5) + 1} to {batch?.batchNumber * 5} of {interview?.totalQuestions}
            </p>
          </div>
        </div>

        {/* Timer & Exit */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream border border-plum/10 text-xs font-semibold text-plum">
            <Clock className="w-4 h-4 text-orbit-purple" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <Button variant="ghost" size="sm" onClick={() => setShowExitModal(true)}>
            Exit Studio
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

      {/* 5-Question Batch Navigation Ribbon */}
      <Card padding="p-4" className="bg-[#FFF7F0]">
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-orbit-muted">
            Batch 5-Question Navigator
          </span>
          <span className="text-xs font-semibold text-orbit-purple">
            {answeredCount} Answered • {skippedCount} Skipped • {5 - answeredCount - skippedCount} Remaining
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {batch?.questions?.map((q, idx) => {
            const ans = answers[q.id];
            const isAnswered = ans?.text?.trim() && !ans.isSkipped;
            const isSkipped = ans?.isSkipped;
            const isActive = idx === currentQuestionIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`py-3 px-2 rounded-2xl text-center font-serif transition-all border flex flex-col items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-orbit-purple text-white border-orbit-purple shadow-medium ring-2 ring-orbit-purple/30'
                    : isAnswered
                    ? 'bg-orbit-mint/40 text-[#123E24] border-orbit-mint/60 hover:bg-orbit-mint/60'
                    : isSkipped
                    ? 'bg-orbit-peach/40 text-[#4A1D0E] border-orbit-peach/60 hover:bg-orbit-peach/60'
                    : 'bg-white text-plum border-plum/10 hover:border-plum/30'
                }`}
              >
                <span className="text-xs font-sans uppercase font-bold tracking-wider">
                  Q{idx + 1}
                </span>
                <span className="text-[10px] font-sans font-semibold truncate max-w-full px-1">
                  {isAnswered ? 'Answered' : isSkipped ? 'Skipped' : 'Draft'}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Active Question Display & Answering Workspace */}
      {currentQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Question & Answer Input Card */}
          <div className="lg:col-span-8 space-y-6">
            <Card padding="p-8 space-y-6">
              
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-plum/10">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-orbit-purple">
                    Question {currentQuestion.questionNumber} of {interview?.totalQuestions}
                  </span>
                  <Badge variant="lavender">{currentQuestion.type}</Badge>
                  <Badge variant="neutral">{currentQuestion.targetSkill}</Badge>
                </div>

                {/* Text-to-Speech audio button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReadQuestionAloud}
                  icon={speechSynthesis.isSpeaking ? VolumeX : Volume2}
                >
                  {speechSynthesis.isSpeaking ? 'Mute' : 'Read Aloud'}
                </Button>
              </div>

              {/* Question Text */}
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-plum leading-snug">
                  "{currentQuestion.text}"
                </h3>

                {/* Evaluation hints accordion toggle */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowHints(!showHints)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-orbit-purple hover:underline"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHints ? 'Hide Guidance Hints' : 'View Answering Guidance'}</span>
                  </button>

                  {showHints && (
                    <div className="mt-2 p-3.5 rounded-xl bg-orbit-lavender/30 border border-orbit-lavender text-xs text-plum/80 leading-relaxed animate-in fade-in">
                      <span className="font-bold block mb-1">Key Topics to Consider:</span>
                      {currentQuestion.evaluationHints || 'Structure your response clearly with real-world examples and trade-off considerations.'}
                    </div>
                  )}
                </div>
              </div>

              {/* Answer Input Area */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-plum/80">
                    Your Response
                  </label>
                  <span className="text-xs text-orbit-muted font-medium">
                    {(currentAnswer?.text || '').trim().split(/\s+/).filter(Boolean).length} words • {(currentAnswer?.text || '').length} chars
                  </span>
                </div>

                <textarea
                  rows="8"
                  value={currentAnswer?.text || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Articulate your response here. Walk through your thought process, architecture, and practical considerations..."
                  className="w-full p-4 bg-cream/40 rounded-2xl border border-plum/15 text-sm text-plum focus:outline-none focus:border-orbit-purple focus:ring-1 focus:ring-orbit-purple transition-all font-sans leading-relaxed"
                />
              </div>

              {/* Question Navigation & Skip / Save Controls */}
              <div className="pt-4 border-t border-plum/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                    icon={ChevronLeft}
                  >
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentQuestionIndex === 4}
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={SkipForward}
                    onClick={handleSkipQuestion}
                  >
                    Skip Question
                  </Button>
                </div>
              </div>

            </Card>
          </div>

          {/* Right Column: Voice Studio Controls & Batch Submission Card */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Voice Mode Studio Module */}
            <Card padding="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-orbit-purple" />
                  <h4 className="font-serif text-lg font-bold text-plum">Voice Response</h4>
                </div>
                <Badge variant={interview?.mode === 'voice' ? 'mint' : 'neutral'} size="sm">
                  {interview?.mode === 'voice' ? 'Voice Active' : 'Voice Optional'}
                </Badge>
              </div>

              <p className="text-xs text-plum/70 leading-relaxed font-normal">
                Click record to speak your answer. Your speech will be transcribed in real time and can be edited above.
              </p>

              {/* Recording Action Button */}
              <div className="text-center py-2">
                {audioRecorder.isRecording ? (
                  <button
                    type="button"
                    onClick={handleStopVoiceRecording}
                    className="w-20 h-20 rounded-full bg-red-600 text-white flex flex-col items-center justify-center mx-auto shadow-elevated pulse-recording transition-transform"
                  >
                    <Square className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {formatTimer(audioRecorder.recordingDuration)}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartVoiceRecording}
                    className="w-20 h-20 rounded-full bg-orbit-purple hover:bg-plum text-white flex flex-col items-center justify-center mx-auto shadow-soft transition-transform hover:scale-105"
                  >
                    <Mic className="w-7 h-7 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Record</span>
                  </button>
                )}
              </div>

              {/* Audio Playback if recorded */}
              {audioRecorder.audioUrl && (
                <div className="p-3.5 rounded-xl bg-cream/70 border border-plum/10 space-y-2">
                  <span className="text-[11px] font-bold text-plum uppercase tracking-wider block">
                    Play Back Recorded Audio
                  </span>
                  <audio controls src={audioRecorder.audioUrl} className="w-full h-8" />
                </div>
              )}

              {audioRecorder.error && (
                <p className="text-[11px] text-red-600 leading-normal">{audioRecorder.error}</p>
              )}
            </Card>

            {/* Batch Submission Status Card */}
            <Card padding="p-6 space-y-4">
              <h4 className="font-serif text-lg font-bold text-plum">Batch 1 of {batch?.totalBatches} Status</h4>
              <p className="text-xs text-plum/70 leading-relaxed">
                When you are satisfied with your answers across all 5 questions, submit the batch. The AI evaluation engine will assess all responses together.
              </p>

              <div className="p-3 rounded-xl bg-cream/70 border border-plum/10 text-xs space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span>Questions Attempted:</span>
                  <span className="font-bold text-orbit-purple">{answeredCount} of 5</span>
                </div>
                <div className="flex justify-between">
                  <span>Questions Skipped:</span>
                  <span className="font-bold text-plum">{skippedCount} of 5</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowSubmitModal(true)}
                className="w-full shadow-soft"
                icon={Send}
              >
                Submit Batch {batch?.batchNumber} for AI Review
              </Button>
            </Card>

          </div>

        </div>
      )}

      {/* Confirmation Modal before Batch Submission */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title={`Submit Batch ${batch?.batchNumber} for AI Evaluation?`}
      >
        <div className="space-y-4 text-sm text-plum/80 leading-relaxed">
          <p>
            You have answered <strong className="text-plum">{answeredCount}</strong> of 5 questions and skipped <strong className="text-plum">{skippedCount}</strong>.
          </p>
          <p className="text-xs text-orbit-muted">
            Upon submission, our AI evaluation engine will score each response based on relevance, technical accuracy, completeness, clarity, and depth.
          </p>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowSubmitModal(false)}>
              Keep Editing
            </Button>
            <Button
              variant="primary"
              loading={submittingBatch}
              onClick={handleSubmitBatch}
              icon={CheckCircle2}
            >
              Confirm & Submit
            </Button>
          </div>
        </div>
      </Modal>

      {/* Batch Evaluation Result Overlay Modal */}
      {batchEvaluation && (
        <Modal
          isOpen={true}
          onClose={() => {}}
          title={`Batch ${batchEvaluation.batchNumber} Evaluation Summary`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            
            {/* Batch Score Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-orbit-lavender/50 to-orbit-peach/40 border border-plum/10 text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-orbit-purple">
                Batch Average Score
              </span>
              <div className="font-serif text-4xl sm:text-5xl font-bold text-plum">
                {batchEvaluation.batchScore}%
              </div>
              <p className="text-xs text-plum/80 font-medium max-w-md mx-auto">
                {batchEvaluation.batchSummary}
              </p>
            </div>

            {/* Question by question mini breakdown */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-orbit-muted">
                Question Evaluations
              </h4>

              {batchEvaluation.evaluations?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-cream/50 border border-plum/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-plum">
                    <span>Q{idx + 1}: {item.questionText ? item.questionText.slice(0, 50) + '...' : `Question ${idx + 1}`}</span>
                    <span className="text-orbit-purple">{item.score}%</span>
                  </div>
                  <p className="text-plum/80">
                    <strong className="text-emerald-700">Done well:</strong> {item.whatWasDoneWell}
                  </p>
                  {item.missingConcepts && item.missingConcepts.length > 0 && (
                    <p className="text-plum/70">
                      <strong className="text-amber-800">Missing concepts:</strong> {item.missingConcepts.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Action button to proceed */}
            <div className="pt-4 border-t border-plum/10 flex justify-end gap-3">
              {batchEvaluation.isInterviewComplete ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleViewFinalReport}
                  icon={Award}
                  className="shadow-soft"
                >
                  View Final Comprehensive Report
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleProceedToNextBatch}
                  icon={ChevronRight}
                  className="shadow-soft"
                >
                  Proceed to Batch {batchEvaluation.batchNumber + 1} of {batchEvaluation.totalBatches}
                </Button>
              )}
            </div>

          </div>
        </Modal>
      )}

      {/* Exit Confirmation Modal */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Exit Interview Studio?"
      >
        <div className="space-y-4 text-sm text-plum/80">
          <p>
            Are you sure you want to exit the interview studio? Your current batch answers are saved locally as drafts and you can resume anytime from your dashboard.
          </p>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowExitModal(false)}>
              Stay in Session
            </Button>
            <Button variant="danger" onClick={() => navigate('/dashboard')}>
              Exit to Dashboard
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
