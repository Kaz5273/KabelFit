/**
 * Système de couleurs unifié pour l'application KabelFit
 * Palette principale: Crimson (#DC143C) avec thème sombre
 */

import { Platform } from 'react-native';

const primaryColor = '#DC143C'; // Crimson red
const primaryDark = '#B22222'; // Firebrick
const primaryLight = '#FF6B6B';

export const Colors = {
  light: {
    // Mode clair avec palette crimson
    text: '#000000',
    textSecondary: '#666666',
    textMuted: '#999999',
    background: '#FFFFFF',
    backgroundLight: '#F5F5F5',
    backgroundCard: '#FFFFFF',
    tint: primaryColor,
    icon: '#666666',
    tabIconDefault: '#666666',
    tabIconSelected: primaryColor,
    primary: primaryColor,
    primaryDark: primaryDark,
    primaryLight: primaryLight,
    border: '#E0E0E0',
    divider: '#F0F0F0',
    success: '#00C853',
    warning: '#FFB300',
    error: '#DC143C',
  },
  dark: {
    // Mode sombre (thème principal de l'app)
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textMuted: '#666666',
    background: '#000000',
    backgroundLight: '#1A1A1A',
    backgroundCard: '#0D0D0D',
    tint: primaryColor,
    icon: '#B0B0B0',
    tabIconDefault: '#666666',
    tabIconSelected: primaryColor,
    primary: primaryColor,
    primaryDark: primaryDark,
    primaryLight: primaryLight,
    border: '#333333',
    divider: '#222222',
    success: '#00C853',
    warning: '#FFB300',
    error: '#DC143C',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
