import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Agent, AgentStatus, STATUS_LABELS } from '../types/workspace';
import { colors, radius, spacing, font } from '../theme/theme';

const STATUS_COLORS: Record<AgentStatus, string> = {
  working: colors.primary,
  review: colors.warning,
  blocked: colors.danger,
  idle: colors.textMuted,
};

export function AgentDeskCard({
  agent,
  selected,
  onPress,
}: {
  agent: Agent;
  selected: boolean;
  onPress: () => void;
}) {
  const statusColor = STATUS_COLORS[agent.status];

  return (
    <Pressable
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{agent.emoji}</Text>
        </View>
        <View style={styles.statusPill}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusText}>{STATUS_LABELS[agent.status]}</Text>
        </View>
      </View>
      <Text style={styles.name}>{agent.name}</Text>
      <Text style={styles.role}>{agent.role}</Text>
      <Text style={styles.task} numberOfLines={2}>
        {agent.task}
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${agent.progress}%` }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing(1.75),
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing(1.5),
  },
  cardSelected: { borderColor: colors.primary },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 18 },
  statusPill: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 7, height: 7, borderRadius: radius.pill, marginRight: 5 },
  statusText: { color: colors.textMuted, fontSize: font.small },
  name: { color: colors.text, fontSize: font.body, fontWeight: '700', marginTop: spacing(1) },
  role: { color: colors.textMuted, fontSize: font.small, marginTop: 2 },
  task: { color: colors.text, fontSize: font.small, marginTop: spacing(1), lineHeight: 17 },
  progressTrack: {
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    marginTop: spacing(1.25),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});
