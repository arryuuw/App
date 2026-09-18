import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Mood, MOODS } from '../types/entry';
import { colors, radius, spacing, font } from '../theme/theme';

export function MoodPicker({
  value,
  onChange,
}: {
  value: Mood | null;
  onChange: (m: Mood) => void;
}) {
  return (
    <View style={styles.row}>
      {MOODS.map((m) => {
        const selected = value === m.key;
        return (
          <Pressable
            key={m.key}
            onPress={() => onChange(m.key)}
            style={[styles.item, selected && styles.itemSelected]}
          >
            <Text style={styles.emoji}>{m.emoji}</Text>
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {m.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  item: {
    alignItems: 'center',
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(1),
    borderRadius: radius.md,
    flex: 1,
    marginHorizontal: 2,
  },
  itemSelected: { backgroundColor: colors.primaryMuted },
  emoji: { fontSize: 24, marginBottom: 4 },
  label: { fontSize: font.small, color: colors.textMuted },
  labelSelected: { color: colors.text, fontWeight: '600' },
});
