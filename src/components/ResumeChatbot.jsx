import React, { useState, useRef, useEffect } from "react";
import { Send, X, Bot, Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { streamResumeChat } from "../utils/streamResumeChat.js";

// Shown before the model's reasoning trace starts arriving. Cycling past the
// end used to leave the bubble frozen on "Almost done..." for the whole wait.
const FALLBACK_STAGES = [
  "Thinking...",
  "Reading your details...",
  "Planning the layout...",
  "Writing your summary...",
  "Structuring experience...",
  "Polishing bullet points...",
  "Almost done...",
];
const FALLBACK_STAGE_MS = 6000;

// Only the tail of the reasoning trace is shown — the early part is about
// reading the prompt and the user isn't waiting for that.
const REASONING_TAIL_CHARS = 260;

const ResumeChatbot = ({ onUpdateResume, currentResume, onLoadingChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [reasoning, setReasoning] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hi! I am your AI Resume Assistant. I can create a resume from scratch or update your existing one. Just tell me what to do!",
    },
  ]);

  const { token } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);
  const abortRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Don't leave a request running (and a spinner spinning) after unmount.
  useEffect(() => () => abortRef.current?.abort(), []);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Add User Message to Chat
    const userMsg = { id: Date.now(), role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const originalInput = input; // Store input for API call
    setInput(""); // Clear input field
    setIsLoading(true);
    onLoadingChange?.(true);
    setReasoning("");
    setElapsedSeconds(0);
    const ticker = setInterval(() => setElapsedSeconds((e) => e + 1), 1000);

    // Lets the user start a fresh request over a previous one that is stuck.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const aiResponse = await streamResumeChat({
        userMessage: originalInput,
        currentResume,
        token,
        signal: controller.signal,
        onReasoning: (delta) =>
          setReasoning((prev) => (prev + delta).slice(-REASONING_TAIL_CHARS)),
      });

      // 2. Add AI Text Response to Chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: aiResponse.message, // This will be the specific text or the success message
        },
      ]);

      // 3. Logic: If it contained Resume Data, update the form
      if (aiResponse.responseType === "resume_update" && aiResponse.resumeData) {
        await onUpdateResume(aiResponse.resumeData);
        toast.success("Resume updated successfully!");
      }
    } catch (error) {
      if (error.name === "AbortError") return; // superseded or unmounted

      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: error.message || "Sorry, something went wrong. Please try again.",
        },
      ]);
      toast.error("Failed to process request");
    } finally {
      clearInterval(ticker);
      setIsLoading(false);
      setReasoning("");
      onLoadingChange?.(false);
    }
  };

  const stageText = FALLBACK_STAGES[
    Math.min(Math.floor(elapsedSeconds * 1000 / FALLBACK_STAGE_MS), FALLBACK_STAGES.length - 1)
  ];

  return (
    <div className="fixed bottom-4 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot className="size-5" />
              <span className="font-semibold">AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition">
              <X className="size-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[90%] bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 shrink-0 animate-spin text-green-500" />
                    <span className="text-xs text-gray-500">
                      {reasoning ? "Building your resume..." : stageText}
                    </span>
                    <span className="text-[11px] tabular-nums text-gray-400">
                      {elapsedSeconds}s
                    </span>
                  </div>

                  {/* Live trace from the model — proof the request is alive
                      rather than a spinner that could mean anything. */}
                  {reasoning && (
                    <p className="mt-2 border-l-2 border-green-200 pl-2 text-[11px] leading-relaxed text-gray-400 italic whitespace-pre-wrap break-words max-h-24 overflow-y-auto">
                      {reasoning.trim()}
                    </p>
                  )}

                  {/* Past the staged copy, say so rather than looping forever. */}
                  {elapsedSeconds > 40 && (
                    <p className="mt-2 text-[11px] text-gray-400">
                      Large resumes can take a minute — still working.
                    </p>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type here..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                className="text-green-500 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-200"
      >
        {isOpen ? <X className="size-6" /> : <Sparkles className="size-6" />}
        {!isOpen && (
            <span className="absolute right-16 bg-white text-gray-800 text-xs font-medium px-2 py-1 rounded shadow-md border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Ask AI to build it
            </span>
        )}
      </button>
    </div>
  );
};

export default ResumeChatbot;