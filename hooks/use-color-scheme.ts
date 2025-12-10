/**
 * Hook personnalisé pour forcer le mode sombre dans l'application
 * Retourne toujours 'dark' au lieu de suivre les préférences système
 */
export function useColorScheme() {
  return 'dark' as const;
}
