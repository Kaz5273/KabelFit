/**
 * Hook pour forcer le mode sombre sur le web
 * Retourne toujours 'dark' au lieu de suivre les préférences système
 */
export function useColorScheme() {
  return 'dark' as const;
}

