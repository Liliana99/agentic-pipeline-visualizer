import React from 'react';

export const TerminalHeader = ({ currentStep, totalSteps, stepData }) => {
  const getBadgeStyle = (variant) => {
    switch (variant) {
      case 'error':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'warning':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'success':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'info':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="flex flex-col border-b border-neutral-800 bg-neutral-900/90 backdrop-blur px-4 py-3 select-none">
      {/* Top Bar: macOS window buttons & Title */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/60 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/60 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/60 inline-block" />
          </div>
          <span className="font-mono text-xs font-semibold tracking-wider text-neutral-300">
            LANGGRAPH_STATE_INSPECTOR
          </span>
          <span className="text-[11px] font-mono text-neutral-500 px-1.5 py-0.5 rounded bg-neutral-800/80 border border-neutral-700/50">
            FSM: RUN_984F2A
          </span>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 font-mono text-[11px] font-medium border rounded-full ${getBadgeStyle(
              stepData.badge_variant
            )}`}
          >
            {stepData.status_badge}
          </span>
        </div>
      </div>

      {/* Breadcrumb / Step Indicator */}
      <div className="mt-2.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-neutral-300">
          <span className="text-cyan-400 font-semibold">
            Pass {currentStep + 1}/{totalSteps}:
          </span>
          <span className="text-neutral-100 font-medium">
            {stepData.step_name}
          </span>
          <span className="text-neutral-500">
            [retry_count={stepData.state.retry_count || 0}]
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Active:</span>
          <span className="text-cyan-300 font-medium">{stepData.active_node}</span>
        </div>
      </div>
    </div>
  );
};
