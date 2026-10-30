import { ActivityItem, Agent } from '../types/workspace';

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'mina',
    name: 'Mina',
    role: 'Story Lead',
    stage: 'script',
    emoji: '🧠',
    status: 'working',
    task: 'Breaking down the ep.12 plot twist',
    progress: 72,
    home: { x: 15, y: 30 },
  },
  {
    id: 'theo',
    name: 'Theo',
    role: 'Scriptwriter',
    stage: 'script',
    emoji: '✍️',
    status: 'working',
    task: 'Drafting dialogue for ep.12 scene 3',
    progress: 45,
    home: { x: 29, y: 46 },
  },
  {
    id: 'ren',
    name: 'Ren',
    role: 'Voice Director',
    stage: 'production',
    emoji: '🎙️',
    status: 'review',
    task: 'Reviewing AI voice takes for ep.11',
    progress: 90,
    home: { x: 51, y: 28 },
  },
  {
    id: 'kai',
    name: 'Kai',
    role: 'Video Generator',
    stage: 'production',
    emoji: '🎬',
    status: 'working',
    task: 'Rendering the ep.11 final cut',
    progress: 58,
    home: { x: 65, y: 48 },
  },
  {
    id: 'ivy',
    name: 'Ivy',
    role: 'Thumbnail & Title',
    stage: 'publishing',
    emoji: '🖼️',
    status: 'idle',
    task: 'Waiting on ep.10 footage',
    progress: 0,
    home: { x: 82, y: 30 },
  },
  {
    id: 'noah',
    name: 'Noah',
    role: 'Scheduler & Analyst',
    stage: 'publishing',
    emoji: '📊',
    status: 'working',
    task: 'Packaging ep.10 upload + performance report',
    progress: 30,
    home: { x: 89, y: 50 },
  },
];

const now = Date.now();

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'a1', agentId: 'theo', message: 'started drafting ep.12 scene 3', ts: now - 2 * 60000 },
  { id: 'a2', agentId: 'ren', message: 'flagged a voice take for re-record', ts: now - 15 * 60000 },
  { id: 'a3', agentId: 'kai', message: 'finished rendering ep.11 scene 4', ts: now - 32 * 60000 },
  { id: 'a4', agentId: 'mina', message: 'completed the plot outline for ep.12', ts: now - 61 * 60000 },
  { id: 'a5', agentId: 'noah', message: 'scheduled ep.10 for Friday 6pm', ts: now - 95 * 60000 },
];

export const FLOOR_ZONES: Record<Agent['stage'], { left: number; top: number; width: number; height: number }> = {
  script: { left: 4, top: 8, width: 34, height: 72 },
  production: { left: 40, top: 8, width: 30, height: 72 },
  publishing: { left: 72, top: 8, width: 24, height: 72 },
};

export const HUDDLE_SPOT = { x: 50, y: 84, label: 'Huddle nook' };
