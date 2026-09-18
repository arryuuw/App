import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Mood } from '../types/entry';
import { MoodPicker } from '../components/MoodPicker';
import { saveEntry, updateEntry } from '../storage/entries';
import { getReflection } from '../api/reflection';
import { colors, radius, spacing, font } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NewEntry'>;

export default function NewEntryScreen({ navigation }: Props) {
  const [mood, setMood] = useState<Mood | null>(null);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = mood !== null && text.trim().length > 0 && !saving;

  const onSave = async () => {
    if (!mood) return;
    setSaving(true);
    const entry = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      mood,
      text: text.trim(),
    };

    try {
      await saveEntry(entry);
      try {
        const { reflection, prompt } = await getReflection(entry.text, mood);
        await updateEntry(entry.id, { reflection, prompt });
      } catch (aiError) {
        // Entry is already saved; AI reflection is a bonus, not a blocker.
      }
      navigation.replace('EntryDetail', { entryId: entry.id });
    } catch (e) {
      Alert.alert('Could not save entry', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
          <Text style={styles.title}>New entry</Text>
          <Pressable onPress={onSave} disabled={!canSave} hitSlop={12}>
            {saving ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text
                style={[styles.save, !canSave && styles.saveDisabled]}
              >
                Save
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.body}>
          <Text style={styles.label}>How are you feeling?</Text>
          <MoodPicker value={mood} onChange={setMood} />

          <Text style={[styles.label, { marginTop: spacing(3) }]}>
            What's on your mind?
          </Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Write freely — your AI reflection appears after you save."
            placeholderTextColor={colors.textMuted}
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { color: colors.text, fontSize: font.heading, fontWeight: '700' },
  cancel: { color: colors.textMuted, fontSize: font.body },
  save: { color: colors.primary, fontSize: font.body, fontWeight: '700' },
  saveDisabled: { opacity: 0.4 },
  body: { flex: 1, padding: spacing(2.5) },
  label: { color: colors.text, fontSize: font.body, fontWeight: '600', marginBottom: spacing(1) },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing(2),
    color: colors.text,
    fontSize: font.body,
    minHeight: 180,
  },
});
