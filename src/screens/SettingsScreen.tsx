import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Linking } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing, font } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Free plan</Text>
          <Text style={styles.cardBody}>
            Unlimited journaling, 5 AI reflections per week. Upgrade for
            unlimited AI reflections and mood insights.
          </Text>
          <Pressable style={styles.upgradeBtn}>
            <Text style={styles.upgradeText}>Upgrade — $4.99/mo</Text>
          </Pressable>
          <Text style={styles.note}>
            (Payments aren't wired up yet — see the publishing guide for
            how to connect RevenueCat / StoreKit before launch.)
          </Text>
        </View>

        <View style={styles.linksSection}>
          <Pressable onPress={() => Linking.openURL('https://example.com/privacy')}>
            <Text style={styles.link}>Privacy Policy</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL('https://example.com/terms')}>
            <Text style={styles.link}>Terms of Use</Text>
          </Pressable>
        </View>
      </View>
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
  },
  back: { color: colors.text, fontSize: font.body, width: 40 },
  title: { color: colors.text, fontSize: font.heading, fontWeight: '700' },
  body: { padding: spacing(2.5) },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing(2.5),
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { color: colors.text, fontSize: font.heading, fontWeight: '700' },
  cardBody: { color: colors.textMuted, fontSize: font.body, marginTop: spacing(1), lineHeight: 21 },
  upgradeBtn: {
    marginTop: spacing(2),
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing(1.5),
    alignItems: 'center',
  },
  upgradeText: { color: '#fff', fontWeight: '700', fontSize: font.body },
  note: { color: colors.textMuted, fontSize: font.small, marginTop: spacing(1.5), fontStyle: 'italic' },
  linksSection: { marginTop: spacing(3), gap: spacing(1.5) },
  link: { color: colors.primary, fontSize: font.body },
});
