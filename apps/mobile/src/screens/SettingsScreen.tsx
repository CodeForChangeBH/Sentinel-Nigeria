import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

export function SettingsScreen() {
  const { mode, isDarkMode, colors, setMode, toggleDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBackground,
            paddingTop: insets.top || 16,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>
          Settings
        </Text>
      </View>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Appearance
        </Text>
        <View
          style={[
            styles.section,
            { backgroundColor: colors.settingBackground },
          ]}
        >
          <View style={[styles.settingRow, { borderBottomColor: colors.separator }]}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Dark Mode
              </Text>
              <Text
                style={[styles.settingDescription, { color: colors.settingDescription }]}
              >
                {mode === 'system'
                  ? `Following system (${isDarkMode ? 'Dark' : 'Light'})`
                  : isDarkMode
                    ? 'On'
                    : 'Off'}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.toggleTrackOff, true: colors.toggleTrackOn }}
              thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
              ios_backgroundColor={colors.toggleTrackOff}
            />
          </View>
          <View style={[styles.modeSelector, { borderBottomWidth: 0 }]}>
            {(['system', 'light', 'dark'] as const).map((themeMode) => (
              <View key={themeMode} style={styles.modeOptionRow}>
                <View style={styles.modeTextContainer}>
                  <Text style={[styles.modeLabel, { color: colors.text }]}>
                    {themeMode === 'system'
                      ? 'System Default'
                      : themeMode === 'light'
                        ? 'Light'
                        : 'Dark'}
                  </Text>
                  <Text
                    style={[styles.modeDescription, { color: colors.textSecondary }]}
                  >
                    {themeMode === 'system'
                      ? 'Match device settings'
                      : themeMode === 'light'
                        ? 'Always use light theme'
                        : 'Always use dark theme'}
                  </Text>
                </View>
                <Switch
                  value={mode === themeMode}
                  onValueChange={() => setMode(themeMode)}
                  trackColor={{ false: colors.toggleTrackOff, true: colors.toggleTrackOn }}
                  thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
                  ios_backgroundColor={colors.toggleTrackOff}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  section: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  modeSelector: {
    padding: 8,
  },
  modeOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  modeTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  modeLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  modeDescription: {
    fontSize: 12,
    marginTop: 1,
  },
});
