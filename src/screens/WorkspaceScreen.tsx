import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { AgentDeskCard } from '../components/AgentDeskCard';
import { MOCK_AGENTS, MOCK_ACTIVITY } from '../data/workspaceMock';
import { STAGE_LABELS } from '../types/workspace';
import { colors, radius, spacing, font } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Workspace'>;

export default function WorkspaceScreen({ navigation }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const agents = MOCK_AGENTS;
  const activeAgents = useMemo(
    () => agents.filter((a) => a.status === 'working' || a.status === 'review'),
    [agents]
  );
  const workingCount = useMemo(() => agents.filter((a) => a.status === 'working').length, [agents]);
  const selectedAgent = agents.find((a) => a.id === selectedId) ?? null;
  const selectedActivity = selectedAgent
    ? MOCK_ACTIVITY.filter((a) => a.agentId === selectedAgent.id)
    : [];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Studio Floor</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.statsRow}>
          <Stat label="Agents online" value={`${agents.length}/${agents.length}`} />
          <Stat label="Working" value={String(workingCount)} />
          <Stat label="Active tasks" value={String(activeAgents.length)} />
        </View>

        <Text style={styles.sectionTitle}>Agents</Text>
        <View style={styles.grid}>
          {agents.map((agent) => (
            <AgentDeskCard
              key={agent.id}
              agent={agent}
              selected={agent.id === selectedId}
              onPress={() => setSelectedId(agent.id === selectedId ? null : agent.id)}
            />
          ))}
        </View>

        {selectedAgent ? (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>
              {selectedAgent.emoji} {selectedAgent.name} · {selectedAgent.role}
            </Text>
            <Text style={styles.detailStage}>{STAGE_LABELS[selectedAgent.stage]}</Text>
            <Text style={styles.detailTask}>{selectedAgent.task}</Text>
            {selectedActivity.length > 0 ? (
              <View style={{ marginTop: spacing(1.5) }}>
                {selectedActivity.map((item) => (
                  <Text key={item.id} style={styles.activityLine}>
                    {timeAgo(item.minutesAgo)} — {selectedAgent.name} {item.message}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Task flow</Text>
        <View style={styles.card}>
          {activeAgents.map((agent, i) => (
            <View
              key={agent.id}
              style={[styles.taskRow, i < activeAgents.length - 1 && styles.taskRowDivider]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.taskOwner}>{agent.name}</Text>
                <Text style={styles.taskName} numberOfLines={1}>
                  {agent.task}
                </Text>
              </View>
              <Text style={styles.taskProgress}>{agent.progress}%</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Live activity</Text>
        <View style={styles.card}>
          {MOCK_ACTIVITY.map((item, i) => {
            const agent = agents.find((a) => a.id === item.agentId);
            return (
              <View
                key={item.id}
                style={[styles.activityRow, i < MOCK_ACTIVITY.length - 1 && styles.taskRowDivider]}
              >
                <Text style={styles.activityText}>
                  <Text style={styles.activityAgent}>{agent?.name ?? 'Unknown'}</Text>{' '}
                  {item.message}
                </Text>
                <Text style={styles.activityTime}>{timeAgo(item.minutesAgo)}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function timeAgo(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.round(minutes / 60)}h ago`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing(2.5),
    paddingTop: spacing(1),
    paddingBottom: spacing(1.5),
  },
  back: { color: colors.text, fontSize: font.body, width: 40 },
  title: { color: colors.text, fontSize: font.heading, fontWeight: '700' },
  body: { paddingHorizontal: spacing(2.5), paddingBottom: spacing(6) },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing(2) },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing(1.5),
    marginRight: spacing(1),
    alignItems: 'center',
  },
  statValue: { color: colors.text, fontSize: font.heading, fontWeight: '700' },
  statLabel: { color: colors.textMuted, fontSize: font.small, marginTop: 2 },
  sectionTitle: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
    marginBottom: spacing(1.25),
    marginTop: spacing(1),
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  detailCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    padding: spacing(2),
    marginBottom: spacing(2),
  },
  detailTitle: { color: colors.text, fontSize: font.body, fontWeight: '700' },
  detailStage: { color: colors.primary, fontSize: font.small, marginTop: 2 },
  detailTask: { color: colors.textMuted, fontSize: font.body, marginTop: spacing(1) },
  activityLine: { color: colors.textMuted, fontSize: font.small, marginTop: 4 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing(2),
    marginBottom: spacing(2),
  },
  taskRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing(1.5) },
  taskRowDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  taskOwner: { color: colors.text, fontSize: font.body, fontWeight: '700' },
  taskName: { color: colors.textMuted, fontSize: font.small, marginTop: 2 },
  taskProgress: { color: colors.primary, fontSize: font.body, fontWeight: '700' },
  activityRow: { paddingVertical: spacing(1.25) },
  activityText: { color: colors.textMuted, fontSize: font.small },
  activityAgent: { color: colors.text, fontWeight: '700' },
  activityTime: { color: colors.textMuted, fontSize: font.small, marginTop: 2, opacity: 0.7 },
});
