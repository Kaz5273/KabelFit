import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavBarProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
  items?: NavItem[];
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabPress,
  items,
}) => {
  const defaultItems: NavItem[] = [
    { id: 'home', label: 'Accueil', icon: null },
    { id: 'program', label: 'Programme', icon: null },
    { id: 'calendar', label: 'Calendrier', icon: null },
    { id: 'stats', label: 'Mes Stats', icon: null },
    { id: 'profile', label: 'Mon Profil', icon: null },
  ];

  const navItems = items || defaultItems;

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.tab}
            onPress={() => onTabPress(item.id)}
            activeOpacity={0.7}
          >
            {item.icon && (
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                {item.icon}
              </View>
            )}
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {item.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 8,
    paddingBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  iconContainer: {
    marginBottom: 4,
  },
  iconContainerActive: {
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
});
