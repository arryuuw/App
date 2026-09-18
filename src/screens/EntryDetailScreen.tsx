import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { JournalEntry, MOODS } from '../types/entry';
import { deleteEntry, getEntries, updateEntry } from '../storage/entries';
import { getReflection } from '../api/reflection';
import { colors, radius, spacing, font } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EntryDetail'>;

export default function EntryDetailScreen({ route, navigation }: Props) {
  const { entryId } = route.params;
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loadingReflection, setLoadingReflection] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getEntries().then((all) => {
        if (!active) return;
        setEntry(all.find((e) => e.id === entryId) ?? null);
      });
      return () => {
        active = false;
      };
    }, [entryId])
  );

  if (!entry) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Entry not found.</Text>
      </SafeAreaView>
    );
  }

  const mood = MOODS.find((m) => m.key === entry.mood);
  const date = new Date(entry.createdAt).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const retryReflection = async () => {
    setLoadingReflection(true);
    try {
      const { reflection, prompt } = await getReflection(entry.text, entry.mood);
      await updateEntry(entry.id, { reflection, prompt });
      setEntry({ ...entry, reflection, prompt });
    } catch (e) {
      Alert.alert('Could not get a reflection', 'Check your connection and try again.');
    } finally {
      setLoadingReflection(false);
    }
  };

  const onDelete = () => {
    Alert.alert('Delete entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteEntry(entry.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Pressable onPress={onDelete} hitSlop={12}>
          <Text style={styles.delete}>Delete</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.moodRow}>
          <Text style={styles.emoji}>{mood?.emoji}</Text>
          <View>
            <Text style={styles.moodLabel}>{mood?.label}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>

        <Text style={styles.text}>{entry.text}</Text>

        <View style={styles.reflectionCard}>
          <Text style={styles.reflectionTitle}>✨ AI Reflection</Text>
          {loadingReflection ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing(1) }} />
          ) : entry.reflection ? (
            <>
              <Text style={styles.reflectionText}>{entry.reflection}</Text>
              {entry.prompt ? (
                <Text style={styles.promptText}>💭 {entry.prompt}</Text>
              ) : null}
            </>
          ) : (
            <View>
              <Text style={styles.reflectionText}>
                No reflection yet.
              </Text>
              <Pressable onPress={retryReflection} style={styles.retryBtn}>
                <Text style={styles.retryText}>Get reflection</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  missing: { color: colors.textMuted, textAlign: 'center', marginTop: spacing(6) },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(2.5),
    paddingTop: spacing(1),
    paddingBottom: spacing(1.5),
  },
  back: { color: colors.text, fontSize: font.body },
  delete: { color: colors.danger, fontSize: font.body },
  body: { padding: spacing(2.5), paddingBottom: spacing(6) },
  moodRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing(2) },
  emoji: { fontSize: 36, marginRight: spacing(1.5) },
  moodLabel: { color: colors.text, fontSize: font.heading, fontWeight: '700' },
  date: { color: colors.textMuted, fontSize: font.small, marginTop: 2 },
  text: { color: colors.text, fontSize: font.body, lineHeight: 24 },
  reflectionCard: {
    marginTop: spacing(3),
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: colors.border,
  },
  reflectionTitle: { color: colors.text, fontWeight: '700', marginBottom: spacing(1) },
  reflectionText: { color: colors.text, fontSize: font.body, lineHeight: 22 },
  promptText: {
    color: colors.primary,
    fontSize: font.small,
    marginTop: spacing(1.5),
    fontStyle: 'italic',
  },
  retryBtn: {
    marginTop: spacing(1.5),
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: radius.pill,
  },
  retryText: { color: colors.primary, fontWeight: '600' },
});
