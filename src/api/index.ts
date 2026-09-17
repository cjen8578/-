import { Project, TestMode, Video, TestTask, TestResult, ReviewCase, ProjectRegion, IssueStatus } from '../types';
import { mockProjects, mockVideos, mockTasks, mockReviews, mockResults } from './mockData';

// Delay helper to simulate network
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  // Projects
  getProjects: async (): Promise<Project[]> => {
    await delay(300);
    return [...mockProjects];
  },
  getProject: async (id: string): Promise<Project | undefined> => {
    await delay(200);
    return mockProjects.find(p => p.id === id);
  },
  createProject: async (data: { name: string, targetLanguage: string, testMode: TestMode }): Promise<Project> => {
    await delay(500);
    const newProject: Project = {
      id: `p${Date.now()}`,
      name: data.name,
      targetLanguage: data.targetLanguage,
      testMode: data.testMode,
      status: 'ACTIVE',
      videoCount: 0,
      regions: []
    };
    mockProjects.push(newProject);
    return newProject;
  },
  updateProjectRegions: async (projectId: string, regions: ProjectRegion[]): Promise<void> => {
    await delay(400);
    const proj = mockProjects.find(p => p.id === projectId);
    if (proj) {
      proj.regions = regions;
    }
  },

  // Videos
  getVideosByProject: async (projectId: string): Promise<Video[]> => {
    await delay(300);
    return mockVideos.filter(v => v.projectId === projectId);
  },
  uploadVideo: async (projectId: string, file: File): Promise<Video> => {
    await delay(1500); // simulate upload
    const newVid: Video = {
      id: `v${Date.now()}`,
      projectId,
      filename: file.name,
      size: file.size,
      thumbnailUrl: 'https://placehold.co/600x400?text=Uploaded+Video',
      duration: 150,
      resolution: '1920x1080',
      fps: 30,
      totalFrames: 4500,
      uploadedAt: new Date().toISOString()
    };
    mockVideos.push(newVid);
    const proj = mockProjects.find(p => p.id === projectId);
    if (proj) proj.videoCount += 1;
    return newVid;
  },

  // Tasks
  getTasksByProject: async (projectId: string): Promise<TestTask[]> => {
    await delay(300);
    return mockTasks.filter(t => t.projectId === projectId);
  },
  getTask: async (id: string): Promise<TestTask | undefined> => {
    await delay(200);
    return mockTasks.find(t => t.id === id);
  },
  createTask: async (projectId: string, videoId: string): Promise<TestTask> => {
    await delay(500);
    const newTask: TestTask = {
      id: `t${Date.now()}`,
      projectId,
      videoId,
      status: 'PENDING',
      progress: 0,
      currentStage: 'Initialized',
      processedFrames: 0,
      testedFrames: 0,
      errorCount: 0,
      createdAt: new Date().toISOString()
    };
    mockTasks.push(newTask);
    return newTask;
  },
  // Simulate processing
  simulateTaskProgress: async (taskId: string, onProgress: (task: TestTask) => void): Promise<void> => {
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) return;
    task.status = 'PROCESSING';
    
    const stages = [
      { name: '视频解析', weight: 10 },
      { name: '智能抽帧', weight: 20 },
      { name: 'OCR', weight: 30 },
      { name: '语言识别', weight: 20 },
      { name: '规则检测', weight: 20 }
    ];

    let currentProgress = 0;
    for (const stage of stages) {
      task.currentStage = stage.name;
      for (let i = 0; i < stage.weight; i += 5) {
        await delay(300);
        currentProgress += 5;
        task.progress = currentProgress;
        task.processedFrames = Math.floor((currentProgress / 100) * 4500);
        onProgress({ ...task });
      }
    }
    
    task.status = 'COMPLETED';
    task.completedAt = new Date().toISOString();
    
    // Create a mock result
    const newResult: TestResult = {
      id: `res${Date.now()}`,
      taskId,
      totalFrames: task.processedFrames,
      testedFrames: 500,
      consistent: 490,
      inconsistent: 5,
      pendingReview: 5,
      finalResult: 'REVIEW',
      issues: Array(5).fill(0).map((_, i) => ({
        id: `rc_new_${i}`,
        taskId,
        time: 10 + i * 5,
        imageUrl: `https://placehold.co/800x450?text=Frame+${10 + i * 5}`,
        region: { id: 'r1', projectId: task.projectId, name: 'Region', x: 0.1, y: 0.8, width: 0.8, height: 0.1 },
        ocrText: `Mock OCR ${i}`,
        expectedLanguage: 'English',
        detectedLanguage: 'Unknown',
        ocrConfidence: 0.6,
        languageConfidence: 0.5,
        status: 'OPEN'
      }))
    };
    mockResults.push(newResult);
    mockReviews.push(...newResult.issues);
    
    onProgress({ ...task });
  },

  // Results & Reviews
  getResultByTask: async (taskId: string): Promise<TestResult | undefined> => {
    await delay(300);
    return mockResults.find(r => r.taskId === taskId);
  },
  getReviewsByTask: async (taskId: string): Promise<ReviewCase[]> => {
    await delay(200);
    return mockReviews.filter(r => r.taskId === taskId);
  },
  getPendingReviews: async (): Promise<ReviewCase[]> => {
    await delay(200);
    return mockReviews.filter(r => r.status === 'OPEN');
  },
  updateReviewStatus: async (reviewId: string, status: IssueStatus, confirmedLanguage?: string): Promise<void> => {
    await delay(300);
    const review = mockReviews.find(r => r.id === reviewId);
    if (review) {
      review.status = status;
      if (confirmedLanguage) {
        review.humanConfirmed = confirmedLanguage;
      }
      
      // Update result stats
      const result = mockResults.find(r => r.taskId === review.taskId);
      if (result) {
        result.pendingReview = mockReviews.filter(r => r.taskId === result.taskId && r.status === 'OPEN').length;
        if (result.pendingReview === 0) {
          result.finalResult = result.inconsistent > 0 ? 'FAIL' : 'PASS'; // Simplified logic
        }
      }
    }
  }
};
