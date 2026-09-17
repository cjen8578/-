export type ProjectStatus = 'ACTIVE' | 'ARCHIVED';
export type TaskStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type TestResultState = 'PASS' | 'FAIL' | 'REVIEW';
export type IssueStatus = 'OPEN' | 'REVIEWED' | 'IGNORED';
export type TestMode = 'English' | 'Chinese' | 'English + Chinese';

export interface ProjectRegion {
  id: string;
  projectId: string;
  name: string; // e.g. "English Subtitle Region"
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  name: string;
  targetLanguage: string;
  testMode: TestMode;
  status: ProjectStatus;
  videoCount: number;
  lastTestAt?: string;
  regions: ProjectRegion[];
}

export interface Video {
  id: string;
  projectId: string;
  filename: string;
  size: number;
  thumbnailUrl: string;
  duration: number; // in seconds
  resolution: string;
  fps: number;
  totalFrames: number;
  uploadedAt: string;
}

export interface TestTask {
  id: string;
  projectId: string;
  videoId: string;
  status: TaskStatus;
  progress: number;
  currentStage: string;
  processedFrames: number;
  testedFrames: number;
  errorCount: number;
  createdAt: string;
  completedAt?: string;
}

export interface OCRResult {
  text: string;
  confidence: number;
  box: { x: number; y: number; w: number; h: number };
}

export interface LanguageResult {
  language: string;
  confidence: number;
  script: string;
  scriptConfidence: number;
}

export interface Frame {
  time: number; // in seconds
  frameNumber: number;
  imageUrl: string;
  ocr: OCRResult;
  language: LanguageResult;
}

export interface SubtitleEvent {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  language: string;
}

export interface ReviewCase {
  id: string;
  taskId: string;
  time: number;
  imageUrl: string;
  region: ProjectRegion;
  ocrText: string;
  expectedLanguage: string;
  detectedLanguage: string;
  ocrConfidence: number;
  languageConfidence: number;
  status: IssueStatus;
  humanConfirmed?: string;
}

export interface TestResult {
  id: string;
  taskId: string;
  totalFrames: number;
  testedFrames: number;
  consistent: number;
  inconsistent: number;
  pendingReview: number;
  finalResult: TestResultState;
  issues: ReviewCase[];
}

export interface Report {
  id: string;
  testResultId: string;
  projectId: string;
  summary: string;
  generatedAt: string;
}
