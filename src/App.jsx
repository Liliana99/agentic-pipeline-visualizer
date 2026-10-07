import React, { useState, useEffect, useRef } from 'react';
import { pipelineTrace } from './data/pipelineTrace';
import { TerminalHeader } from './components/TerminalHeader';
import { JsonViewer } from './components/JsonViewer';
import diagramImg from '../assets/diagrama.png';

export default function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const autoPlayTimerRef = useRef(null);

  const totalSteps = pipelineTrace.length;
  const currentStep = pipelineTrace[currentStepIndex];

  // Auto-play interval effect (2.5s)
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    }
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, totalSteps]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'n') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'p') {
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'r') {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const getNodeHighlightColor = (nodeType) => {
    switch (nodeType) {
      case 'audit':
        return currentStep.badge_variant === 'error'
          ? 'ring-rose-500/50 bg-rose-500/10'
          : 'ring-emerald-500/50 bg-emerald-500/10';
      case 'routing':
        return 'ring-amber-500/50 bg-amber-500/10';
      case 'sink':
        return 'ring-emerald-500/50 bg-emerald-500/10';
      case 'inference':
        return 'ring-sky-500/50 bg-sky-500/10';
      default:
        return 'ring-cyan-500/50 bg-cyan-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* ── TOP APPLICATION HEADER ── */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight text-white">
                Agentic Pipeline Visualizer
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 font-medium">
                LangGraph FSM
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-normal">
              State transitions, deterministic guardrails & idempotent event sink
            </p>
          </div>
        </div>

        {/* Global Control Toolbar */}
        <div className="flex items-center gap-2">
          {/* Step Navigation Controls */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-1 shadow-sm">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-2.5 py-1 text-xs font-medium rounded-md text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition flex items-center gap-1"
              title="Previous Step (Left Arrow)"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Prev</span>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
              }`}
              title="Toggle Auto Play (Spacebar)"
            >
              {isPlaying ? (
                <>
                  <svg className="w-3.5 h-3.5 fill-current animate-pulse" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                  <span>Pause (2.5s)</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Auto Play</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === totalSteps - 1}
              className="px-2.5 py-1 text-xs font-medium rounded-md text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition flex items-center gap-1"
              title="Next Step (Right Arrow)"
            >
              <span>Next</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={handleReset}
              className="ml-1 px-2 py-1 text-xs text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-md transition"
              title="Reset to Initial State (Key: R)"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── STEP TRACKER STRIP ── */}
      <div className="bg-neutral-900/60 border-b border-neutral-800/80 px-6 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {pipelineTrace.map((step, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-all flex items-center gap-2 ${
                idx === currentStepIndex
                  ? 'bg-neutral-800 text-cyan-300 ring-1 ring-cyan-500/50 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  idx === currentStepIndex
                    ? 'bg-cyan-400 shadow-sm shadow-cyan-400'
                    : 'bg-neutral-700'
                }`}
              />
              <span>{idx + 1}. {step.active_node}</span>
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-neutral-500 text-[11px]">
          <span>Shortcuts:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">← Prev</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">→ Next</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">Space</kbd>
        </div>
      </div>

      {/* ── MAIN SPLIT VIEW (LEFT: DIAGRAM, RIGHT: TERMINAL) ── */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* LEFT COLUMN: ARCHITECTURE DIAGRAM CONTAINER (5 Cols) */}
        <section className="lg:col-span-5 border-r border-neutral-800 bg-neutral-950 flex flex-col overflow-hidden">
          {/* Header of Diagram Container */}
          <div className="px-4 py-3 border-b border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <h2 className="text-xs font-semibold text-neutral-200 tracking-wide">
                ARCHITECTURE GRAPH
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ring-1 ${getNodeHighlightColor(currentStep.node_type)}`}>
                Active: {currentStep.active_node}
              </span>
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded hover:bg-neutral-800 transition"
                title="Toggle Diagram Fit/Zoom"
              >
                {isZoomed ? 'Reset Fit' : 'Full Zoom'}
              </button>
            </div>
          </div>

          {/* Diagram Canvas */}
          <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-neutral-950/90 relative">
            <div className={`transition-all duration-300 w-full flex items-center justify-center ${isZoomed ? 'scale-125 origin-top' : 'max-h-[78vh]'}`}>
              <img
                src={diagramImg}
                alt="LangGraph Architecture Flowchart"
                className="rounded-lg border border-neutral-800/80 shadow-2xl max-h-[75vh] object-contain hover:border-neutral-700 transition"
              />
            </div>
          </div>

          {/* Diagram Stage Annotation Box */}
          <div className="p-3.5 border-t border-neutral-800/80 bg-neutral-900/60 text-xs">
            <div className="flex items-center gap-2 text-neutral-300 font-medium mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Step Execution Context:</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              {currentStep.description}
            </p>
          </div>
        </section>

        {/* RIGHT COLUMN: LANGGRAPH STATE INSPECTOR (7 Cols) */}
        <section className="lg:col-span-7 bg-neutral-950 flex flex-col overflow-hidden">
          {/* Terminal Window Wrapper */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-950">
            {/* Terminal Top Window Frame */}
            <TerminalHeader
              currentStep={currentStepIndex}
              totalSteps={totalSteps}
              stepData={currentStep}
            />

            {/* Terminal Body: Real-time Mutating State JSON Inspector */}
            <div className="flex-1 overflow-auto bg-neutral-950/95 scrollbar-thin scrollbar-thumb-neutral-800">
              <div className="transition-opacity duration-200">
                <JsonViewer data={currentStep.state} />
              </div>
            </div>

            {/* Terminal Status Command Footer */}
            <div className="border-t border-neutral-800 bg-neutral-900/90 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <div className="flex items-center gap-4">
                <span>
                  <strong className="text-neutral-500">PROVIDER:</strong> Ollama (Metal GPU)
                </span>
                <span>
                  <strong className="text-neutral-500">FRAMEWORK:</strong> LangGraph v0.2
                </span>
                <span>
                  <strong className="text-neutral-500">SINK:</strong> Supabase
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-medium">READY</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── TELEMETRY FOOTER ── */}
      <footer className="border-t border-neutral-800 bg-neutral-950 px-6 py-2.5 flex items-center justify-between text-xs text-neutral-400 font-mono">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <span className="text-neutral-500">Latency:</span>
            <span className="text-neutral-200">~14ms</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-neutral-500">Inference Cost:</span>
            <span className="text-emerald-400 font-semibold">$0.00 / marginal</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-neutral-500">Audit Status:</span>
            <span className={currentStep.badge_variant === 'error' ? 'text-rose-400' : 'text-emerald-400'}>
              {currentStep.state.status || 'OK'}
            </span>
          </span>
        </div>

        <div>
          <span>Agentic Pipeline Visualizer • Open Source Telemetry</span>
        </div>
      </footer>
    </div>
  );
}
