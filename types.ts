export interface StoredFile {
  name: string;
  content: string;
}

export interface Overview {
  websiteType: string;
  summary: string;
  theme: string;
  technologies: {
    name: string;
    category: string;
  }[];
}

export interface Architecture {
  structureSummary: string;
  pages: string[];
  reusableComponents: string[];
  externalLibraries: {
    name: string;
    url: string;
  }[];
  assetFolders: string[];
}

export interface DataFlow {
  dataSummary: string;
  forms: {
    id: string;
    action: string;
    method: string;
    fields: string[];
  }[];
  apiCalls: {
    url: string;
    method: string;
    purpose: string;
  }[];
  securityIssues: string[];
}

export interface Improvement {
  category: 'Performance' | 'Security' | 'Scalability' | 'UX' | 'Code Quality' | 'SEO';
  suggestion: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface AnalysisReport {
  projectName: string;
  analysisDate: string;
  overview: Overview;
  architecture: Architecture;
  dataFlow: DataFlow;
  improvements: Improvement[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
