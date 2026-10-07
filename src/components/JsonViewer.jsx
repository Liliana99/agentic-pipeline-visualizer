import React, { useState } from 'react';

/**
 * Syntax highlighter for JSON state objects with line numbers and copy functionality.
 */
export const JsonViewer = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);
  const lines = jsonString.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTokenizedLine = (line) => {
    // Regex matching keys, string values, numbers, booleans, null
    const parts = [];
    let remaining = line;

    // Detect indentation
    const indentMatch = remaining.match(/^(\s+)/);
    const indent = indentMatch ? indentMatch[1] : '';
    remaining = remaining.substring(indent.length);

    // Key match: "key":
    const keyMatch = remaining.match(/^"([^"]+)":\s*/);
    if (keyMatch) {
      const keyName = keyMatch[1];
      const isCriticalKey = [
        'status',
        'retry_count',
        'audit_result',
        'violations',
        'schema_signature',
        'is_valid',
        'is_duplicate',
        'confidence_score'
      ].includes(keyName);

      parts.push(
        <span
          key="k"
          className={
            isCriticalKey
              ? 'text-cyan-400 font-semibold'
              : 'text-sky-300'
          }
        >
          "{keyName}"
        </span>
      );
      parts.push(<span key="colon" className="text-neutral-500">: </span>);
      remaining = remaining.substring(keyMatch[0].length);
    }

    // Value tokenization
    if (remaining.startsWith('"')) {
      // String value
      const strVal = remaining.endsWith(',') ? remaining.slice(0, -1) : remaining;
      const comma = remaining.endsWith(',');
      const isErrorStr = strVal.toLowerCase().includes('violation') ||
                         strVal.toLowerCase().includes('missing') ||
                         strVal.toLowerCase().includes('out of bounds') ||
                         strVal.toLowerCase().includes('rejected');
      const isSuccessStr = strVal.includes('APPROVED') ||
                           strVal.includes('COMPLETED') ||
                           strVal.includes('COMMITTED');

      let strClass = 'text-emerald-300';
      if (isErrorStr) strClass = 'text-rose-300 font-medium bg-rose-950/40 px-1 rounded';
      else if (isSuccessStr) strClass = 'text-emerald-400 font-semibold';

      parts.push(<span key="str" className={strClass}>{strVal}</span>);
      if (comma) parts.push(<span key="c" className="text-neutral-500">,</span>);
    } else if (/^-?\d+(\.\d+)?(,?)$/.test(remaining)) {
      // Number value
      const numVal = remaining.endsWith(',') ? remaining.slice(0, -1) : remaining;
      const comma = remaining.endsWith(',');
      parts.push(<span key="num" className="text-amber-300">{numVal}</span>);
      if (comma) parts.push(<span key="c" className="text-neutral-500">,</span>);
    } else if (/^(true|false)(,?)$/.test(remaining)) {
      // Boolean value
      const boolVal = remaining.endsWith(',') ? remaining.slice(0, -1) : remaining;
      const comma = remaining.endsWith(',');
      const isTrue = boolVal === 'true';
      parts.push(
        <span
          key="bool"
          className={isTrue ? 'text-violet-400 font-semibold' : 'text-rose-400 font-semibold'}
        >
          {boolVal}
        </span>
      );
      if (comma) parts.push(<span key="c" className="text-neutral-500">,</span>);
    } else if (/^null(,?)$/.test(remaining)) {
      // Null value
      const comma = remaining.endsWith(',');
      parts.push(<span key="null" className="text-neutral-500 italic">null</span>);
      if (comma) parts.push(<span key="c" className="text-neutral-500">,</span>);
    } else {
      // Structural braces/brackets
      parts.push(<span key="rest" className="text-neutral-400">{remaining}</span>);
    }

    return (
      <>
        <span>{indent}</span>
        {parts}
      </>
    );
  };

  return (
    <div className="relative font-mono text-[13px] leading-relaxed select-text">
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-400 hover:text-neutral-100 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 rounded-md transition-all duration-150 backdrop-blur"
        title="Copy state payload to clipboard"
      >
        {copied ? (
          <>
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-emerald-400 font-sans">Copied!</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="font-sans">Copy State</span>
          </>
        )}
      </button>

      {/* Code Lines Container */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-neutral-900/40 transition-colors">
                <td className="w-10 pr-4 text-right text-neutral-600 select-none text-xs align-top">
                  {idx + 1}
                </td>
                <td className="whitespace-pre align-top">
                  {renderTokenizedLine(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
