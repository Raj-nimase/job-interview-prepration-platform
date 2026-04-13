import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { templates } from "../utils/codeTemplates";

export default function CodePanel({ language, setLanguage, readOnly, onCodeChange, initialCode, codePrompt }) {
  const [code, setCode] = useState(initialCode || templates[language] || "");

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      onCodeChange(initialCode);
    } else {
      setCode(templates[language] || "");
      onCodeChange(templates[language] || "");
    }
  }, [language, initialCode]);

  const handleEditorChange = (value) => {
    setCode(value);
    onCodeChange(value);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] border-none rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative">
      {/* Header bar styled like VSCode tab */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-black/40 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="ml-2 text-xs font-medium text-gray-400 tracking-wider uppercase">Live Code</span>
        </div>
        
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-[#333333] border border-[#444444] text-gray-200 text-xs rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 cursor-pointer hover:bg-[#3d3d3d] transition-colors"
          disabled={readOnly}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="sql">SQL</option>
        </select>
      </div>
      
      {codePrompt && (
        <div className="p-4 bg-[#1e1e1e] text-sm text-gray-300 border-b border-[#333333] max-h-40 overflow-y-auto custom-scrollbar">
          <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap opacity-90">{codePrompt}</div>
        </div>
      )}

      {/* Editor Container with overlay when readonly */}
      <div className="flex-1 relative h-full min-h-[300px]">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            readOnly: readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            suggestOnTriggerCharacters: false,
            quickSuggestions: false,
            wordBasedSuggestions: false,
            formatOnPaste: true,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            renderLineHighlight: "all"
          }}
          loading={
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Loading editor environment...
            </div>
          }
        />
        {readOnly && (
          <div className="absolute inset-0 z-20 pointer-events-auto cursor-not-allowed">
            {/* Invisible overlay just to capture clicks and prevent scrolling/selecting if needed, though Monaco handles readonly fine */}
          </div>
        )}
      </div>
    </div>
  );
}
