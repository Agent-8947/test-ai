
import React from 'react';
import { Loader2, Zap, Search, ShieldCheck } from 'lucide-react';

interface AuditProgressProps {
  phase: 'PARSING' | 'ANALYZING';
}

const AuditProgress: React.FC<AuditProgressProps> = ({ phase }) => {
  const steps = [
    { id: 'PARSING', label: 'Extracting Repository Structure', icon: Search },
    { id: 'ANALYZING', label: 'Orchestrating AI Neural Tests', icon: Zap },
    { id: 'FINISHING', label: 'Compiling Vulnerability Report', icon: ShieldCheck },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === phase);

  return (
    <div className="max-w-xl mx-auto py-12 px-6 bg-gray-900/40 border border-gray-800 rounded-3xl backdrop-blur-md">
      <div className="flex flex-col items-center space-y-8">
        <div className="relative">
          <Loader2 size={64} className="text-blue-500 animate-spin" strokeWidth={1.5} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap size={24} className="text-blue-400 animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-6 w-full">
          {steps.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  isActive ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 
                  isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-600'
                }`}>
                  <Icon size={18} />
                </div>
                <span className={`text-sm font-medium ${
                  isActive ? 'text-white' : 
                  isCompleted ? 'text-green-400/80' : 'text-gray-600'
                }`}>
                  {step.label}
                  {isActive && <span className="ml-2 animate-pulse">...</span>}
                </span>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-1000 ease-out"
            style={{ width: `${((currentStepIndex + 0.5) / steps.length) * 100}%` }}
          />
        </div>
        
        <p className="text-xs text-gray-500 text-center uppercase tracking-widest">
          Auditing logic, security, and performance metrics
        </p>
      </div>
    </div>
  );
};

export default AuditProgress;
