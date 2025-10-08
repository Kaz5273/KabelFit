import { initDatabase, seedDatabase } from '@/database';
import { useEffect, useState } from 'react';

/**
 * Hook pour initialiser la base de données au démarrage de l'application
 * Retourne l'état de chargement et les erreurs éventuelles
 */
export const useDatabase = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialise la structure de la base de données
        await initDatabase();

        // Insère les exercices prédéfinis si la base est vide
        await seedDatabase();

        setIsReady(true);
      } catch (err) {
        console.error('Erreur lors de l\'initialisation de la base de données:', err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setIsLoading(false);
      }
    };

    setupDatabase();
  }, []);

  return { isLoading, error, isReady };
};
