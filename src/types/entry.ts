export type Mood = 'great' | 'good' | 'okay' | 'low' | 'rough';

export const MOODS: { key: Mood; emoji: string; label: string }[] = [
  { key: 'great', emoji: '😄', label: 'Great' },
  { key: 'good', emoji: '🙂', label: 'Good' },
  { key: 'okay', emoji: '😐', label: 'Okay' },
  { key: 'low', emoji: '😔', label: 'Low' },
  { key: 'rough', emoji: '😣', label: 'Rough' },
];

export interface JournalEntry {
  id: string;
  createdAt: string; // ISO timestamp
  mood: Mood;
  text: string;
  reflection?: string;
  prompt?: string;
}
