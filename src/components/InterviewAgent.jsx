import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import pdfToText from "react-pdftotext";
import api from "../config/api";
import {
  Target,
  UploadCloud,
  Mic,
  BarChart3,
  Zap,
  SkipForward,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  User,
  Bot
} from "lucide-react";

// ── Utility: Extract text from TXT or PDF file ──────────────────────────────
const extractTextFromFile = (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      } else if (file.type === "application/pdf") {
        const text = await pdfToText(file);
        resolve(text);
      } else {
        reject(new Error("Unsupported file type"));
      }
    } catch (err) {
      reject(err);
    }
  });
};

// ── Robot Avatar Component ──────────────────────────────────────────────────────
const RobotAvatar = ({ isSpeaking }) => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Head */}
      <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-400 rounded-3xl border-4 border-white shadow-inner relative overflow-hidden">
        {/* Top Bar/Antenna */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-500 rounded-full" />

        {/* Eyes Area */}
        <div className="absolute top-6 left-0 right-0 flex justify-center gap-6 px-4">
          <div className="w-4 h-4 bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse" />
          <div className="w-4 h-4 bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse" />
        </div>

        {/* Mouth */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-600 rounded-full transition-all duration-150 ease-in-out"
          style={{
            height: isSpeaking ? '12px' : '3px',
            borderRadius: isSpeaking ? '10px' : '50%',
            backgroundColor: isSpeaking ? '#0ea5e9' : '#475569'
          }}
        />
      </div>

      {/* Neck/Body shadow */}
      <div className="absolute bottom-2 w-12 h-4 bg-slate-300 rounded-full blur-sm opacity-50" />
    </div>
  );
};

// ── Score Ring Component ─────────────────────────────────────────────────────
const ScoreRing = ({ score, isDark }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#4ade80" : score >= 50 ? "#facc15" : "#f87171";

  return (
    <div className="relative w-32 h-32">
      <svg width="130" height="130" className="transform -rotate-90">
        <circle
          cx="65" cy="65" r={radius}
          fill="none"
          stroke={"rgba(0,0,0,0.06)"}
          strokeWidth="10"
        />
        <circle
          cx="65" cy="65" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
const InterviewAgent = () => {
  const [phase, setPhase] = useState("upload");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState([]);
  const [questionContext, setQuestionContext] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const TOTAL_QUESTIONS = 7;

  // ── Speech Recognition Setup ──────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setUserInput("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // ── Text to Speech ──────────────────────────────────────────────────────────
  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Optional: Select a professional sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Male")) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant" && phase === "interviewing") {
      speakText(lastMessage.content);
    }
  }, [messages, phase]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (phase === "interviewing" && !loading) {
      inputRef.current?.focus();
    }
  }, [phase, loading, questionNumber]);

  // ── File Handling ──────────────────────────────────────────────────────────
  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    const allowed = ["application/pdf", "text/plain"];
    if (!allowed.includes(file.type)) {
      setError("Only PDF or TXT files are supported.");
      return;
    }
    setError("");
    setResumeFile(file);
  };

  // ── Start Interview ────────────────────────────────────────────────────────
  const handleStartInterview = async () => {
    if (!resumeFile) return;
    setLoading(true);
    setError("");

    try {
      const text = await extractTextFromFile(resumeFile);

      if (!text || text.trim() === "") {
        setError("Could not extract text from this file. Please try a different file.");
        setLoading(false);
        return;
      }

      setResumeText(text);

      const res = await api.post("/api/ai/interview-prep", { resumeText: text });
      const { question, questionContext: ctx, questionNumber: qNum } = res.data;

      setQuestionContext(ctx);
      setQuestionNumber(qNum);
      setMessages([{ role: "assistant", content: question, context: ctx }]);
      setPhase("interviewing");

    } catch (err) {
      console.error("Full error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to start interview.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Send Answer ────────────────────────────────────────────────────────────
  const handleSendAnswer = async (answer) => {
    if (!answer.trim() || loading) return;

    const userMessage = { role: "user", content: answer };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput("");
    setLoading(true);

    try {
      const apiMessages = updatedMessages.map(({ role, content }) => ({ role, content }));

      const res = await api.post("/api/ai/interview-respond", {
        resumeText,
        messages: apiMessages,
        questionNumber,
        userAnswer: answer,
      });

      if (res.data.isComplete) {
        setResult(res.data.result);
        setPhase("results");
      } else {
        const { acknowledgment, question, questionContext: ctx, questionNumber: nextNum } = res.data;
        const combined = acknowledgment ? `${acknowledgment}\n\n${question}` : question;
        setMessages((prev) => [...prev, { role: "assistant", content: combined, context: ctx }]);
        setQuestionContext(ctx);
        setQuestionNumber(nextNum);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "There was a connection issue. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => handleSendAnswer("I don't know the answer to this question.");

  const handleReset = () => {
    setPhase("upload");
    setResumeFile(null);
    setResumeText("");
    setMessages([]);
    setQuestionContext("");
    setQuestionNumber(0);
    setUserInput("");
    setResult(null);
    setError("");
  };

  // ── UPLOAD PHASE ───────────────────────────────────────────────────────────
  if (phase === "upload") {
    return (
      <div className={`min-h-screen  `}>
        <div className="max-w-2xl mx-auto px-4">
          {/* Nav */}
          <div className={`flex items-center justify-between py-6 border-b `}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center `}>
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`font-bold `}>Interview Agent</div>
                <div className={`text-xs `}>AI-Powered Mock Interviewer</div>
              </div>
            </div>
            <Link
              to="/app"
              className={`flex items-center gap-2 text-sm font-medium transition-colors `}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>

          {/* Badge */}
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mt-6 mb-4 text-xs font-bold tracking-wider uppercase `}>
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            7 Questions · Scored
          </div>

          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 `}>
              Ace Your Next
              <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent"> Interview</span>
            </h1>
            <p className={`text-base max-w-md mx-auto `}>
              Upload your resume. Our AI reads it, runs a live personalized mock interview — then scores you and tells you exactly how to improve.
            </p>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 mb-5
              ${dragOver
                ? "border-sky-400 bg-sky-500/10"
                : resumeFile
                  ? "border-sky-400/50 bg-sky-500/5"
                  : "border-slate-300 hover:border-slate-400 bg-slate-100"
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={(e) => validateAndSetFile(e.target.files[0])}
            />

            {resumeFile ? (
              <>
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center `}>
                  <UploadCloud className="w-7 h-7 text-sky-400" />
                </div>
                <div className="text-sky-400 font-semibold mb-1">{resumeFile.name}</div>
                <div className={`text-sm `}>Click to replace</div>
              </>
            ) : (
              <>
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center `}>
                  <UploadCloud className={`w-7 h-7 `} />
                </div>
                <div className={`font-medium mb-1 `}>Drop your resume here</div>
                <div className={`text-sm `}>PDF or TXT · Click to browse</div>
              </>
            )}
          </div>

          {error && (
            <div className={`flex items-center gap-2 text-sm p-3 rounded-xl mb-5 `}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { icon: Mic, label: "Resume-tailored Q&A" },
              { icon: BarChart3, label: "Scored out of 100" },
              { icon: Lightbulb, label: "Hire tips" },
              { icon: Zap, label: "Skip any question" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm `}
              >
                <Icon className="w-4 h-4 text-sky-400" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleStartInterview}
            disabled={!resumeFile || loading}
            className={`
              w-full py-4 rounded-xl font-bold text-base tracking-wide mb-2
              flex items-center justify-center gap-3 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${resumeFile && !loading
                ? "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5"
                : "bg-slate-200 text-slate-400"
              }
            `}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-400/30 border-t-white rounded-full animate-spin" />
                Analyzing Resume...
              </>
            ) : resumeFile ? (
              <>
                <Sparkles className="w-5 h-5" />
                Start Interview →
              </>
            ) : (
              "Upload Resume to Begin"
            )}
          </button>
        </div>
      </div>
    );
  }

  // ── INTERVIEW PHASE ────────────────────────────────────────────────────────
  if (phase === "interviewing") {
    const progress = (questionNumber / TOTAL_QUESTIONS) * 100;

    return (
      <div className={`min-h-screen flex flex-col bg-slate-50`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center `}>
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className={`font-bold text-slate-800`}>Interview Agent</div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`text-sm font-medium text-slate-600`}>
              Question <span className="text-sky-500 font-bold">{questionNumber}</span>
              <span className={"text-slate-400"}> / {TOTAL_QUESTIONS}</span>
            </div>
            <button
              onClick={handleReset}
              className={`text-sm px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all `}
            >
              Quit
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`h-1.5 bg-slate-100`}>
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Alex Interviewer Sidebar */}
          <div className="hidden lg:flex w-80 bg-white border-r flex-col items-center justify-center p-8 gap-6">
            <div className="relative">
              <RobotAvatar isSpeaking={isSpeaking} />
              {isSpeaking && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {[1, 2, 3].map(i => (
                    <span key={i} className="w-1.5 h-6 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-800">Alex</h3>
              <p className="text-sm text-slate-500 font-medium">Professional HR Interviewer</p>
            </div>
            <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-xs text-slate-500 leading-relaxed text-center italic">
                "I'm here to help you practice. Take your time, and respond naturally as you would in a real interview."
              </p>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="max-w-3xl mx-auto space-y-5">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                  >
                    <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      {msg.role === "assistant" ? (
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className={`w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 border border-indigo-100`}>
                          <User className="w-5 h-5 text-indigo-500" />
                        </div>
                      )}
                      <div className={`
                        px-5 py-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm
                        ${msg.role === "assistant"
                          ? "bg-white border border-slate-200 rounded-tl-none text-slate-700"
                          : "bg-indigo-600 border border-indigo-500 rounded-tr-none text-white"
                        }
                      `}>
                        {msg.content}
                        {msg.role === "assistant" && msg.context && (
                          <div className={`mt-3 pt-3 border-t border-slate-100 text-[11px] font-medium text-sky-500 uppercase tracking-wider`}>
                            Focus: {msg.context}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center flex-shrink-0 `}>
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className={`px-5 py-4 rounded-2xl bg-white border border-slate-200 rounded-tl-none flex items-center gap-2 `}>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>
            </div>

            {/* Input Area */}
            {!loading && (
              <div className={`px-6 pb-6 pt-4 bg-white border-t`}>
                <div className="max-w-3xl mx-auto">
                  <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-inner relative`}>
                    <textarea
                      ref={inputRef}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendAnswer(userInput); } }}
                      placeholder="Type your answer or use the microphone..."
                      rows={2}
                      className={`w-full bg-transparent border-none resize-none text-sm leading-relaxed focus:ring-0 focus:outline-none pr-24`}
                    />

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div className="flex gap-2">
                        <button
                          onClick={handleSkip}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 transition-all `}
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                          Skip
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleListening}
                          className={`
                            p-2.5 rounded-full transition-all duration-200 border
                            ${isListening
                              ? "bg-red-500 text-white border-red-400 shadow-lg shadow-red-200 animate-pulse"
                              : "bg-white text-slate-500 border-slate-200 hover:border-sky-300 hover:text-sky-500"
                            }
                          `}
                          title={isListening ? "Stop Listening" : "Start Voice Input"}
                        >
                          <Mic className={`w-5 h-5 ${isListening ? 'scale-110' : ''}`} />
                        </button>

                        <button
                          onClick={() => handleSendAnswer(userInput)}
                          disabled={!userInput.trim()}
                          className={`
                            flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all
                            ${userInput.trim()
                              ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5"
                              : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            }
                          `}
                        >
                          <Send className="w-4 h-4" />
                          Send Answer
                        </button>
                      </div>
                    </div>

                    {isListening && (
                      <div className="absolute top-0 left-0 right-0 -translate-y-full pb-2">
                        <div className="bg-sky-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-t-lg inline-block">
                          Listening...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS PHASE ──────────────────────────────────────────────────────────
  if (phase === "results" && result) {
    const gradeColor = result.score >= 75 ? "#10b981" : result.score >= 50 ? "#f59e0b" : "#ef4444";
    const recColor = result.hiringRecommendation === "Strong Hire" ? "#10b981" : result.hiringRecommendation === "Hire" ? "#3b82f6" : result.hiringRecommendation === "Consider" ? "#f59e0b" : "#ef4444";

    return (
      <div className={`min-h-screen bg-slate-50`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 `}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-200`}>
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Interview Results</h1>
                <p className="text-sm text-slate-500 font-medium">Candidate: {result.personal_info?.full_name || "Assessment Complete"}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Start New Practice
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Score Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className={`bg-white rounded-3xl border border-slate-200 p-8 shadow-sm`}>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="relative">
                    <ScoreRing score={result.score} />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Score</span>
                    </div>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
                      <span className="text-4xl font-black" style={{ color: gradeColor }}>{result.grade}</span>
                      <span
                        className="px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider"
                        style={{ backgroundColor: `${gradeColor}10`, color: gradeColor, borderColor: `${gradeColor}20` }}
                      >
                        {result.performance}
                      </span>
                      <div
                        className="px-4 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 uppercase tracking-wider flex items-center gap-2"
                      >
                        <Target className="w-3 h-3" />
                        Recommendation: <span style={{ color: recColor }}>{result.hiringRecommendation}</span>
                      </div>
                    </div>
                    <p className={`text-slate-600 leading-relaxed font-medium`}>{result.summary}</p>
                    {result.skippedQuestions > 0 && (
                      <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 w-fit text-xs font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {result.skippedQuestions} Question{result.skippedQuestions !== 1 ? "s" : ""} Skipped
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div className={`bg-white rounded-3xl border border-slate-200 p-8 shadow-sm`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">Personalized Roadmap</h3>
                </div>
                <div className="grid gap-4">
                  {result.tipsToGetHired?.map((tip, i) => (
                    <div
                      key={i}
                      className={`flex gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0 text-sm font-black text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors`}>
                        {i + 1}
                      </div>
                      <div>
                        <div className={`font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors`}>{tip.tip}</div>
                        <div className={`text-sm text-slate-500 leading-relaxed font-medium`}>{tip.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar: Strengths & Weaknesses */}
            <div className="space-y-6">
              {/* Strengths */}
              <div className={`bg-white rounded-3xl border border-slate-200 p-6 shadow-sm`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest text-slate-800">Strengths</span>
                </div>
                <ul className="space-y-4">
                  {result.strengths?.map((s, i) => (
                    <li key={i} className={`flex gap-3 text-sm font-medium text-slate-600`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-2" />
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className={`bg-white rounded-3xl border border-slate-200 p-6 shadow-sm`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest text-slate-800">Growth Areas</span>
                </div>
                <ul className="space-y-4">
                  {result.weaknesses?.map((w, i) => (
                    <li key={i} className={`flex gap-3 text-sm font-medium text-slate-600`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-2" />
                      <span className="leading-relaxed">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default InterviewAgent;
