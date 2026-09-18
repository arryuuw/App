import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry } from '../types/entry';

const STORAGE_KEY = 'journal_entries_v1';

export async function getEntries(): Promise<JournalEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const entries: JournalEntry[] = JSON.parse(raw);
  return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveEntry(entry: JournalEntry): Promise<void> {
  const entries = await getEntries();
  entries.unshift(entry);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export async function updateEntry(id: string, patch: Partial<JournalEntry>): Promise<void> {
  const entries = await getEntries();
  const next = entries.map((e) => (e.id === id ? { ...e, ...patch } : e));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export async function deleteEntry(id: string): Promise<void> {
  const entries = await getEntries();
  const next = entries.filter((e) => e.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

/** Consecutive days (ending today or yesterday) with at least one entry. */
export function computeStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;

  const days = Array.from(
    new Set(entries.map((e) => new Date(e.createdAt).toDateString()))
  ).map((d) => new Date(d));
  days.sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  const mostRecentGap = Math.round(
    (today.setHours(0, 0, 0, 0) - days[0].setHours(0, 0, 0, 0)) / 86400000
  );
  if (mostRecentGap > 1) return 0; // streak broken

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = Math.round(
      (days[i - 1].getTime() - days[i].getTime()) / 86400000
    );
    if (diff === 1) streak++;
    else if (diff > 1) break;
  }
  return streak;
}
