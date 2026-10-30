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
  home: { x: number; y: number }; // desk position, percent of the floor
}

export interface ActivityItem {
  id: string;
  agentId: string;
  message: string;
  ts: number; // Date.now() timestamp
}

export const STAGE_LABELS: Record<PipelineStage, string> = {
  script: "Writers' Room",
  production: 'Edit Bay',
  publishing: 'Publishing Desk',
};

export const STATUS_LABELS: Record<AgentStatus, string> = {
  working: 'Working',
  review: 'In review',
  blocked: 'Blocked',
  idle: 'Idle',
};
