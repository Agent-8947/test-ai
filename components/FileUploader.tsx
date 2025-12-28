
import React, { useState } from 'react';
import { Upload, FileArchive, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.zip')) {
        onFileSelect(file);
      } else {
        alert("Please upload a .zip file.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative w-full max-w-2xl mx-auto p-12 border-2 border-dashed rounded-3xl transition-all duration-300 ${
        dragActive ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' : 'border-gray-700 bg-gray-900/50'
      } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        accept=".zip" 
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
      />
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="p-6 rounded-full bg-blue-500/10 text-blue-400">
          <FileArchive size={48} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Upload Codebase (.zip)</h3>
          <p className="mt-2 text-gray-400 max-w-sm">
            Drag and drop your project ZIP here to initiate a comprehensive AI codebase audit.
          </p>
        </div>
        <div className="px-6 py-2 bg-gray-800 rounded-full text-xs font-semibold text-gray-300 uppercase tracking-widest">
          Supports: JS, TS, React, Node.js
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
