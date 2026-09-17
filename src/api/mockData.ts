import { Project, Video, TestTask, TestResult, ReviewCase, ProjectRegion } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Sample Movie Test',
    targetLanguage: 'English',
    testMode: 'English',
    status: 'ACTIVE',
    videoCount: 1,
    lastTestAt: '2023-10-01T12:00:00Z',
    regions: [
      { id: 'r1', projectId: 'p1', name: 'English Region', x: 0.1, y: 0.8, width: 0.8, height: 0.1 }
    ]
  }
];

export const mockVideos: Video[] = [
  {
    id: 'v1',
    projectId: 'p1',
    filename: 'test_001.mp4',
    size: 1024 * 1024 * 150,
    thumbnailUrl: 'https://placehold.co/600x400?text=Video+Thumbnail',
    duration: 120,
    resolution: '1920x1080',
    fps: 24,
    totalFrames: 2880,
    uploadedAt: '2023-10-01T10:00:00Z'
  }
];

export const mockTasks: TestTask[] = [
  {
    id: 't1',
    projectId: 'p1',
    videoId: 'v1',
    status: 'COMPLETED',
    progress: 100,
    currentStage: 'Completed',
    processedFrames: 2880,
    testedFrames: 500,
    errorCount: 5,
    createdAt: '2023-10-01T12:00:00Z',
    completedAt: '2023-10-01T12:05:00Z'
  }
];

export const mockReviews: ReviewCase[] = [
  {
    id: 'rc1',
    taskId: 't1',
    time: 4.5,
    imageUrl: 'https://placehold.co/800x450?text=Frame+00:04',
    region: { id: 'r1', projectId: 'p1', name: 'English Region', x: 0.1, y: 0.8, width: 0.8, height: 0.1 },
    ocrText: 'Appl3',
    expectedLanguage: 'English',
    detectedLanguage: 'Unknown',
    ocrConfidence: 0.61,
    languageConfidence: 0.45,
    status: 'OPEN'
  }
];

export const mockResults: TestResult[] = [
  {
    id: 'tr1',
    taskId: 't1',
    totalFrames: 2880,
    testedFrames: 500,
    consistent: 495,
    inconsistent: 4,
    pendingReview: 1,
    finalResult: 'REVIEW',
    issues: mockReviews
  }
];
