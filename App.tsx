
import React, { useState, useCallback } from 'react';
import { AppStatus, ProjectData, TestResult } from './types';
import { parseZipFile } from './services/zipService';
import { analyzeProject } from './services/geminiService';
import FileUploader from './components/FileUploader';
import AuditProgress from './components/AuditProgress';
import ReportView from './components/ReportView';
import { Shield, Zap, Cpu, AlertTriangle, ExternalLink, Sparkles, Code } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startAudit = useCallback(async (file: File) => {
    try {
      setStatus(AppStatus.PARSING);
      setError(null);
      
      const parsedData = await parseZipFile(file);
      setProject(parsedData);
      
      setStatus(AppStatus.ANALYZING);
      const auditResults = await analyzeProject(parsedData);
      
      setResults(auditResults);
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during the audit.");
      setStatus(AppStatus.ERROR);
    }
  }, []);

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setProject(null);
    setResults([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={reset}>
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white">ORCHESTRATOR</h1>
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Neural Lead v7.0</div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <Zap size={14} className="text-blue-400" />
              <span>Gemini 3 Pro</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <Code size={14} className="text-purple-400" />
              <span>Fix Patch Engine</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {status === AppStatus.IDLE && (
          <div className="space-y-12">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
                Refactor with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Neural Patching.</span>
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                Version 7.0 introduces the Lead Agent Patching Engine. Reports now include structured 
                JSON patches for automated code refactoring by AI agents.
              </p>
            </div>
            <FileUploader onFileSelect={startAudit} isProcessing={false} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
              {[
                { icon: Code, title: "Automated Patches", desc: "Structured code diffs ready for agent-based refactoring." },
                { icon: Sparkles, title: "Lead Mode", desc: "Optimized conversational flow for Senior AI Technical Leads." },
                { icon: Zap, title: "Deep Analysis", desc: "O(1) lookup map for instant test deep-dives." }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-gray-900/30 border border-gray-800 hover:border-gray-700 transition-colors">
                  <f.icon className="text-indigo-500 mb-4" size={32} strokeWidth={1.5} />
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(status === AppStatus.PARSING || status === AppStatus.ANALYZING) && (
          <AuditProgress phase={status as 'PARSING' | 'ANALYZING'} />
        )}

        {status === AppStatus.COMPLETED && project && (
          <ReportView 
            results={results} 
            project={project} 
            onRestart={reset} 
          />
        )}

        {status === AppStatus.ERROR && (
          <div className="max-w-xl mx-auto p-12 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] text-center space-y-6">
            <div className="inline-flex p-4 bg-red-500/10 rounded-full text-red-500">
              <AlertTriangle size={48} />
            </div>
            <h3 className="text-2xl font-bold text-white">Neural Terminated</h3>
            <p className="text-gray-400 leading-relaxed">
              {error || "An internal error occurred during processing."}
            </p>
            <button 
              onClick={reset}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all"
            >
              RESTART ORCHESTRATOR
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© 2024 Gemini Test Orchestrator Pro v7.0. Lead Agent Orchestration.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="flex items-center hover:text-white transition-colors cursor-pointer">
              Orchestration Docs <ExternalLink size={14} className="ml-1" />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
