import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { JournalEntry, MOODS } from '../types/entry';
import { colors, radius, spacing, font } from '../theme/theme';

export function EntryCard({
  entry,
  onPress,
}: {
  entry: JournalEntry;
  onPress: () => void;
}) {
  const mood = MOODS.find((m) => m.key === entry.mood);
  const date = new Date(entry.createdAt);
  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.emoji}>{mood?.emoji}</Text>
        <Text style={styles.date}>{dateLabel}</Text>
      </View>
      <Text style={styles.text} numberOfLines={2}>
        {entry.text}
      </Text>
      {entry.reflection ? (
        <Text style={styles.reflection} numberOfLines={2}>
          ✨ {entry.reflection}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing(2),
    marginBottom: spacing(1.5),
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing(1) },
  emoji: { fontSize: 20, marginRight: spacing(1) },
  date: { color: colors.textMuted, fontSize: font.small },
  text: { color: colors.text, fontSize: font.body, lineHeight: 22 },
  reflection: {
    color: colors.primary,
    fontSize: font.small,
    marginTop: spacing(1),
    fontStyle: 'italic',
  },
});
