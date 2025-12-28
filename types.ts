
export interface ProjectFile {
  path: string;
  content: string;
}

export interface ProjectData {
  name: string;
  files: ProjectFile[];
}

export interface FixPatch {
  file: string;
  action: 'replace' | 'insert' | 'delete';
  original_code: string;
  new_code: string;
}

export interface TestResult {
  id: string;
  testName: string;
  success: boolean;
  logs: string[];
  suggestedFix?: string;
  executionTime?: number;
  codeExcerpt?: string;
  fix_patch?: FixPatch;
}

export interface AuditReport {
  metadata: {
    project_name: string;
    timestamp: string;
    agent_instruction: string;
    orchestrator_version: string;
  };
  navigation: {
    number: number;
    id: string;
    name: string;
    status: string;
  }[];
  results: Record<string, TestResult>;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PARSING = 'PARSING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
