export type PipelineStage = 'script' | 'production' | 'publishing';

export type AgentStatus = 'working' | 'review' | 'blocked' | 'idle';

export interface Agent {
  id: string;
  name: string;
  role: string;
  stage: PipelineStage;
  emoji: string;
  status: AgentStatus;
  task: string;
  progress: number; // 0-100
}

export interface ActivityItem {
  id: string;
  agentId: string;
  message: string;
  minutesAgo: number;
}

export const STAGE_LABELS: Record<PipelineStage, string> = {
  script: 'Script & Story',
  production: 'Production',
  publishing: 'Publishing',
};

export const STATUS_LABELS: Record<AgentStatus, string> = {
  working: 'Working',
  review: 'In review',
  blocked: 'Blocked',
  idle: 'Idle',
};
