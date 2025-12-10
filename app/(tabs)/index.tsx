import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const menuItems = [
  {
    id: 'programs',
    title: 'Mes Programmes',
    subtitle: 'Gérer vos programmes d\'entraînement',
    icon: 'fitness' as const,
    route: '/programs',
  },
  {
    id: 'history',
    title: 'Historique',
    subtitle: 'Voir vos séances passées',
    icon: 'time' as const,
    route: '/history',
  },
  {
    id: 'create',
    title: 'Créer un Programme',
    subtitle: 'Concevoir un nouveau programme',
    icon: 'add-circle' as const,
    route: '/create-program',
  },
  {
    id: 'stats',
    title: 'Statistiques',
    subtitle: 'Suivre votre progression',
    icon: 'stats-chart' as const,
    route: '/stats',
  },
];

export default function HomeScreen() {
  const handleMenuPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[Colors.dark.primary, '#000000']}
              style={styles.logo}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <Text style={styles.logoText}>K</Text>
            </LinearGradient>
          </View>

          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>
              Bonjour, <Text style={styles.greetingHighlight}>Athlète</Text>
            </Text>
            <Text style={styles.subtitle}>Prêt pour votre entraînement ?</Text>
          </View>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item.route)}>
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={28} color={Colors.dark.primary} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  logoContainer: {
    backgroundColor: Colors.dark.backgroundLight,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
    fontSize: 24,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  greetingHighlight: {
    color: Colors.dark.primary,
  },
  subtitle: {
    color: Colors.dark.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  menuCard: {
    backgroundColor: Colors.dark.backgroundCard,
    borderRadius: 16,
    padding: 20,
    width: '47%',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  menuIconContainer: {
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  menuSubtitle: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
});
