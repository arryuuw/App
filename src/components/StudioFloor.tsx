import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Agent, AgentStatus, STAGE_LABELS } from '../types/workspace';
import { FLOOR_ZONES, HUDDLE_SPOT } from '../data/workspaceMock';
import { colors, radius } from '../theme/theme';

const AVATAR_SIZE = 38;
const WRAP_WIDTH = 64;
const WALK_INTERVAL_MS = 5200;
const TRAVEL_MS = 2600;
const PAUSE_AT_HUDDLE_MS = 600;

const STATUS_DOT_COLOR: Record<AgentStatus, string> = {
  working: colors.primary,
  review: colors.warning,
  idle: colors.textMuted,
  blocked: colors.danger,
};

const AVATAR_GRADIENT: Record<AgentStatus, [string, string]> = {
  working: ['#A79BFA', '#6552D8'],
  review: ['#F0C084', '#C97F3A'],
  idle: ['#5B5F6C', '#34373F'],
  blocked: ['#F0968C', '#C94B3E'],
};

export function StudioFloor({
  agents,
  selectedId,
  onSelect,
  onWalkEvent,
}: {
  agents: Agent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onWalkEvent?: (agentId: string, message: string) => void;
}) {
  const positionsRef = useRef<Record<string, Animated.ValueXY>>({});
  const awayRef = useRef<Set<string>>(new Set());
  const [walkingIds, setWalkingIds] = useState<Set<string>>(new Set());

  agents.forEach((a) => {
    if (!positionsRef.current[a.id]) {
      positionsRef.current[a.id] = new Animated.ValueXY({ x: a.home.x, y: a.home.y });
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const candidates = agents.filter((a) => !awayRef.current.has(a.id));
      if (!candidates.length) return;
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      walk(pick);
    }, WALK_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agents]);

  function walk(agent: Agent) {
    awayRef.current.add(agent.id);
    setWalkingIds((prev) => new Set(prev).add(agent.id));
    onWalkEvent?.(agent.id, 'stepped away to the huddle nook');

    Animated.timing(positionsRef.current[agent.id], {
      toValue: { x: HUDDLE_SPOT.x, y: HUDDLE_SPOT.y - 6 },
      duration: TRAVEL_MS,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        onWalkEvent?.(agent.id, 'is back at the desk');
        Animated.timing(positionsRef.current[agent.id], {
          toValue: agent.home,
          duration: TRAVEL_MS,
          useNativeDriver: false,
        }).start(() => {
          awayRef.current.delete(agent.id);
          setWalkingIds((prev) => {
            const next = new Set(prev);
            next.delete(agent.id);
            return next;
          });
        });
      }, PAUSE_AT_HUDDLE_MS);
    });
  }

  return (
    <View style={styles.floor}>
      {(Object.keys(FLOOR_ZONES) as Agent['stage'][]).map((stage) => {
        const zone = FLOOR_ZONES[stage];
        return (
          <View
            key={stage}
            style={[
              styles.zone,
              { left: `${zone.left}%`, top: `${zone.top}%`, width: `${zone.width}%`, height: `${zone.height}%` },
            ]}
          >
            <Text style={styles.zoneLabel}>{STAGE_LABELS[stage]}</Text>
          </View>
        );
      })}

      <View style={[styles.huddle, { left: `${HUDDLE_SPOT.x}%`, top: `${HUDDLE_SPOT.y}%` }]}>
        <Text style={styles.huddleMark}>☕</Text>
        <Text style={styles.huddleLabel}>{HUDDLE_SPOT.label}</Text>
      </View>

      {agents.map((a) => (
        <View key={`${a.id}-desk`} style={[styles.desk, { left: `${a.home.x}%`, top: `${a.home.y}%` }]} />
      ))}

      {agents.map((a) => (
        <AnimatedAvatar
          key={a.id}
          agent={a}
          pos={positionsRef.current[a.id]}
          walking={walkingIds.has(a.id)}
          selected={a.id === selectedId}
          onPress={() => onSelect(a.id)}
        />
      ))}
    </View>
  );
}

function AnimatedAvatar({
  agent,
  pos,
  walking,
  selected,
  onPress,
}: {
  agent: Agent;
  pos: Animated.ValueXY;
  walking: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    bob.stopAnimation();
    bob.setValue(0);
    const amplitude = walking ? -5 : -1.5;
    const duration = walking ? 260 : 1800;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: amplitude, duration, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [walking, bob]);

  const left = pos.x.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  const top = pos.y.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <Animated.View
      style={[
        styles.agentWrap,
        { left, top, transform: [{ translateX: -WRAP_WIDTH / 2 }, { translateY: -AVATAR_SIZE / 2 }] },
      ]}
    >
      <Pressable onPress={onPress} hitSlop={8} style={styles.agentPressable}>
        <View style={styles.avatarStack}>
          <View style={styles.shadowEllipse} />
          <Animated.View style={{ transform: [{ translateY: bob }] }}>
            <LinearGradient
              colors={AVATAR_GRADIENT[agent.status]}
              start={{ x: 0.25, y: 0.15 }}
              end={{ x: 0.85, y: 1 }}
              style={[styles.avatarCircle, selected && styles.avatarSelected]}
            >
              <View style={styles.avatarHighlight} />
              <Text style={styles.avatarEmoji}>{agent.emoji}</Text>
              <View style={[styles.statusDot, { backgroundColor: STATUS_DOT_COLOR[agent.status] }]} />
            </LinearGradient>
          </Animated.View>
        </View>
        <Text style={styles.agentName} numberOfLines={1}>
          {agent.name}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  floor: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 11,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  zone: {
    position: 'absolute',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primaryMuted,
    backgroundColor: 'rgba(139,124,246,0.05)',
  },
  zoneLabel: {
    position: 'absolute',
    top: 6,
    left: 8,
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  huddle: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -30 }, { translateY: -16 }],
    width: 60,
  },
  huddleMark: { fontSize: 15 },
  huddleLabel: { fontSize: 9, color: colors.textMuted, marginTop: 2 },
  desk: {
    position: 'absolute',
    width: 26,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    transform: [{ translateX: -13 }, { translateY: 6 }],
  },
  agentWrap: {
    position: 'absolute',
    width: WRAP_WIDTH,
    alignItems: 'center',
  },
  agentPressable: { alignItems: 'center' },
  avatarStack: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowEllipse: {
    position: 'absolute',
    bottom: -4,
    width: 24,
    height: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  avatarCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  avatarSelected: { borderColor: colors.highlight, borderWidth: 2 },
  avatarHighlight: {
    position: 'absolute',
    top: 4,
    left: 6,
    width: AVATAR_SIZE * 0.5,
    height: AVATAR_SIZE * 0.35,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  avatarEmoji: { fontSize: 16 },
  statusDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 9,
    height: 9,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.surfaceAlt,
  },
  agentName: { marginTop: 4, fontSize: 10, color: colors.textMuted, fontWeight: '600' },
});
