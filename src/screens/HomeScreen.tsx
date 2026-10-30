import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { JournalEntry } from '../types/entry';
import { computeStreak, getEntries } from '../storage/entries';
import { EntryCard } from '../components/EntryCard';
import { colors, radius, spacing, font } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getEntries().then((e) => {
        if (!active) return;
        setEntries(e);
        setStreak(computeStreak(e));
      });
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Your journal</Text>
          <Text style={styles.subtitle}>
            {streak > 0
              ? `🔥 ${streak} day${streak === 1 ? '' : 's'} streak`
              : 'Start today’s entry'}
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <Pressable onPress={() => navigation.navigate('Workspace')} hitSlop={12}>
            <Text style={styles.settingsIcon}>🏢</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={12}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No entries yet. Tap the button below to write your first one —
              you'll get an AI reflection back instantly.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            onPress={() =>
              navigation.navigate('EntryDetail', { entryId: item.id })
            }
          />
        )}
      />

      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('NewEntry')}
      >
        <Text style={styles.fabText}>+ New entry</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing(2.5),
    paddingTop: spacing(2),
    paddingBottom: spacing(1),
  },
  title: { color: colors.text, fontSize: font.title, fontWeight: '700' },
  subtitle: { color: colors.textMuted, fontSize: font.body, marginTop: 4 },
  headerIcons: { flexDirection: 'row', gap: spacing(2) },
  settingsIcon: { fontSize: 22, marginTop: 4 },
  listContent: {
    paddingHorizontal: spacing(2.5),
    paddingTop: spacing(1),
    paddingBottom: spacing(12),
  },
  empty: { marginTop: spacing(6), paddingHorizontal: spacing(2) },
  emptyText: {
    color: colors.textMuted,
    fontSize: font.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    bottom: spacing(3),
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing(3.5),
    paddingVertical: spacing(1.75),
    borderRadius: radius.pill,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: font.body, fontWeight: '700' },
});
