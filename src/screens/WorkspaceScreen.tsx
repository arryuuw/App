import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { StudioFloor } from '../components/StudioFloor';
import { MOCK_AGENTS, MOCK_ACTIVITY } from '../data/workspaceMock';
import { ActivityItem, STAGE_LABELS } from '../types/workspace';
import { colors, radius, spacing, font } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Workspace'>;

export default function WorkspaceScreen({ navigation }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>(MOCK_ACTIVITY);

  const agents = MOCK_AGENTS;
  const activeAgents = useMemo(
    () => agents.filter((a) => a.status === 'working' || a.status === 'review'),
    [agents]
  );
  const episodeCount = useMemo(() => {
    const episodes = new Set<string>();
    agents.forEach((a) => {
      const match = a.task.match(/ep\.(\d+)/);
      if (match) episodes.add(match[1]);
    });
    return episodes.size;
  }, [agents]);

  const selectedAgent = agents.find((a) => a.id === selectedId) ?? null;
  const recentActivity = useMemo(
    () => [...activity].sort((a, b) => b.ts - a.ts),
    [activity]
  );
  const selectedActivity = selectedAgent
    ? recentActivity.filter((a) => a.agentId === selectedAgent.id).slice(0, 3)
    : [];

  function handleWalkEvent(agentId: string, message: string) {
    setActivity((prev) => [...prev, { id: `${agentId}-${Date.now()}`, agentId, message, ts: Date.now() }]);
  }

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
          <Stat label="On the floor" value={`${agents.length}/${agents.length}`} />
          <Stat label="Active tasks" value={String(activeAgents.length)} />
          <Stat label="Episodes in flight" value={String(episodeCount)} />
        </View>

        <View style={styles.floorHeadRow}>
          <Text style={styles.sectionTitle}>The floor</Text>
          <View style={styles.legend}>
            <LegendDot color={colors.primary} label="Working" />
            <LegendDot color={colors.warning} label="In review" />
            <LegendDot color={colors.textMuted} label="Idle" />
          </View>
        </View>
        <StudioFloor
          agents={agents}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
          onWalkEvent={handleWalkEvent}
        />

        <Text style={styles.sectionTitle}>Preview</Text>
        <View style={styles.card}>
          {selectedAgent ? (
            <>
              <Text style={styles.detailTitle}>
                {selectedAgent.emoji} {selectedAgent.name} · {selectedAgent.role}
              </Text>
              <Text style={styles.detailStage}>{STAGE_LABELS[selectedAgent.stage]}</Text>
              <Text style={styles.detailTask}>{selectedAgent.task}</Text>
              {selectedActivity.length > 0 ? (
                <View style={{ marginTop: spacing(1.5) }}>
                  {selectedActivity.map((item) => (
                    <Text key={item.id} style={styles.activityLine}>
                      {timeAgo(item.ts)} — {selectedAgent.name} {item.message}
                    </Text>
                  ))}
                </View>
              ) : null}
            </>
          ) : (
            <Text style={styles.previewEmpty}>Tap anyone on the floor to see what they're working on.</Text>
          )}
        </View>

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
          {recentActivity.slice(0, 8).map((item, i, arr) => {
            const agent = agents.find((a) => a.id === item.agentId);
            return (
              <View
                key={item.id}
                style={[styles.activityRow, i < arr.length - 1 && styles.taskRowDivider]}
              >
                <Text style={styles.activityText}>
                  <Text style={styles.activityAgent}>{agent?.name ?? 'Unknown'}</Text>{' '}
                  {item.message}
                </Text>
                <Text style={styles.activityTime}>{timeAgo(item.ts)}</Text>
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

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

function timeAgo(ts: number): string {
  const minutes = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (minutes < 1) return 'just now';
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
  floorHeadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legend: { flexDirection: 'row', gap: spacing(1.5) },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 6, height: 6, borderRadius: 999, marginRight: 4 },
  legendLabel: { color: colors.textMuted, fontSize: 11 },
  sectionTitle: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
    marginBottom: spacing(1.25),
    marginTop: spacing(1),
  },
  previewEmpty: { color: colors.textMuted, fontSize: font.small, lineHeight: 18 },
  detailTitle: { color: colors.text, fontSize: font.body, fontWeight: '700' },
  detailStage: { color: colors.primary, fontSize: font.small, marginTop: 2 },
  detailTask: { color: colors.textMuted, fontSize: font.body, marginTop: spacing(1) },
  activityLine: { color: colors.textMuted, fontSize: font.small, marginTop: 4 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing(2),
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
