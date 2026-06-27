/**
 * Sentinel Nigeria - Emergency Reporting App
 * @format
 */

import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NewAppScreen } from '@react-native/new-app-screen';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { SettingsScreen } from './src/screens/SettingsScreen';

type Tab = 'home' | 'settings';

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { isDarkMode, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {activeTab === 'home' ? (
        <HomeScreen insets={insets} />
      ) : (
        <SettingsScreen />
      )}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} insets={insets} />
    </View>
  );
}

function HomeScreen({ insets }: { insets: { top: number; bottom: number; left: number; right: number } }) {
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          Sentinel Nigeria
        </Text>
      </View>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={insets}
      />
    </View>
  );
}

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  insets: { top: number; bottom: number; left: number; right: number };
}

function TabBar({ activeTab, onTabChange, insets }: TabBarProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabChange('home')}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'home' }}
      >
        <Text
          style={[
            styles.tabLabel,
            { color: activeTab === 'home' ? colors.primary : colors.textSecondary },
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabChange('settings')}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'settings' }}
      >
        <Text
          style={[
            styles.tabLabel,
            { color: activeTab === 'settings' ? colors.primary : colors.textSecondary },
          ]}
        >
          Settings
        </Text>
      </TouchableOpacity>
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
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default App;
