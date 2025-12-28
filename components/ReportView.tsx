
import React, { useState } from 'react';
import { TestResult, ProjectData, AuditReport } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  RefreshCcw, 
  ShieldAlert,
  Terminal,
  Cpu,
  Sparkles,
  Zap,
  Code
} from 'lucide-react';

interface ReportViewProps {
  results: TestResult[];
  project: ProjectData;
  onRestart: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ results, project, onRestart }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const saveAiReadyJson = () => {
    // Generate navigation array with visual status indicators
    const navigation = results.map((res, index) => ({
      number: index + 1,
      id: res.id || `test-${index + 1}`,
      name: res.testName,
      status: res.success ? "✅ PASS" : "❌ FAIL"
    }));

    // Generate keyed results object for rapid agent access
    const resultsMap: Record<string, TestResult> = {};
    results.forEach((res, index) => {
      resultsMap[(index + 1).toString()] = res;
    });

    const fullReport: AuditReport = {
      metadata: {
        project_name: project.name,
        timestamp: new Date().toISOString(),
        orchestrator_version: "7.0.0",
        agent_instruction: "Вы — Техлид. 1. Выведите список 'navigation'. 2. Ждите НОМЕР ТЕСТА для разбора. 3. Если пользователь просит 'ФИКС' или 'JSON ИСПРАВЛЕНИЯ' для номера, выдайте блок из поля 'fix_patch' в виде чистого JSON-объекта."
      },
      navigation: navigation,
      results: resultsMap
    };

    const blob = new Blob([JSON.stringify(fullReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-agent-v7-report-${project.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const score = results.length > 0 ? Math.round((results.filter(r => r.success).length / results.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Summary */}
      <div className="p-8 bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <div className="flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <Sparkles size={12} className="text-cyan-400" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">v7.0 Lead Mode</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-black text-white">{project.name}</h2>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
                Full Neural Audit
              </span>
              <span className="text-gray-500 text-sm">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`text-6xl font-black ${score >= 80 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {score}%
            </div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mt-1">Health Score</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <button 
            onClick={saveAiReadyJson}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-8 py-5 rounded-2xl transition-all font-black text-sm shadow-xl shadow-purple-900/20 active:scale-95"
          >
            <Download size={20} />
            <span>DOWNLOAD AI REPORT (v7.0)</span>
          </button>
          <div className="flex gap-2">
            <button 
              onClick={onRestart}
              className="flex-1 flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-3 rounded-2xl transition-all font-bold text-sm border border-white/5"
            >
              <RefreshCcw size={18} />
              <span>RE-AUDIT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Test Result List */}
      <div className="space-y-4">
        {results.map((result, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div 
              key={index}
              className={`border rounded-[2rem] overflow-hidden transition-all duration-300 ${
                isExpanded ? 'bg-gray-900 border-white/20 ring-1 ring-white/10 shadow-2xl' : 'bg-gray-900/40 border-white/5 hover:border-white/10'
              }`}
            >
              <button 
                className="w-full flex items-center justify-between p-7 text-left"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <div className="flex items-center space-x-5">
                  <div className={`shrink-0 p-3 rounded-2xl ${result.success ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {result.success ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-tighter bg-gray-800 px-2 py-0.5 rounded">
                        #{index + 1}
                      </span>
                      <h4 className="font-bold text-white text-lg">{result.testName}</h4>
                      {!result.success && result.fix_patch && (
                        <Zap size={14} className="text-yellow-500 animate-pulse" />
                      )}
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${result.success ? 'text-green-500/60' : 'text-red-500/60'}`}>
                      {result.success ? 'PASSED' : 'FAILED'} — {result.id}
                    </p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
              </button>

              {isExpanded && (
                <div className="px-7 pb-8 pt-0 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                      <Terminal size={12} className="mr-2" /> Audit Logs
                    </div>
                    <div className="space-y-2">
                      {result.logs.map((log, lIdx) => (
                        <div key={lIdx} className="flex items-start space-x-3 text-sm text-gray-400 font-mono bg-black/40 p-4 rounded-xl border border-white/5">
                          <span className="text-blue-500/40">{lIdx + 1}</span>
                          <span className="leading-relaxed">{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.codeExcerpt && (
                    <div className="space-y-3">
                      <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <Cpu size={12} className="mr-2" /> Context Excerpt
                      </div>
                      <pre className="p-4 bg-gray-950 rounded-xl border border-white/5 overflow-x-auto shadow-inner">
                        <code className="text-xs text-blue-300 font-mono">{result.codeExcerpt}</code>
                      </pre>
                    </div>
                  )}

                  {!result.success && result.fix_patch && (
                    <div className="space-y-3">
                      <div className="flex items-center text-xs font-bold text-yellow-500 uppercase tracking-widest">
                        <Code size={12} className="mr-2" /> AI FIX PATCH (STAGED)
                      </div>
                      <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                        <div className="text-[10px] text-yellow-500/70 font-bold mb-2 uppercase tracking-tighter">
                          Target: {result.fix_patch.file}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                          <div className="p-3 bg-red-950/30 rounded border border-red-900/20">
                            <div className="text-[10px] text-red-500/50 mb-1">- Remove</div>
                            <div className="opacity-60 truncate">{result.fix_patch.original_code}</div>
                          </div>
                          <div className="p-3 bg-green-950/30 rounded border border-green-900/20">
                            <div className="text-[10px] text-green-500/50 mb-1">+ Add</div>
                            <div className="text-green-400 truncate">{result.fix_patch.new_code}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!result.success && result.suggestedFix && (
                    <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl relative overflow-hidden">
                      <div className="flex items-center text-red-400 font-black text-xs uppercase tracking-[0.2em] mb-3">
                        Lead Recommendations
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {result.suggestedFix}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportView;
