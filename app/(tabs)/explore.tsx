import { useState, useEffect } from 'react';
import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { Image } from 'expo-image';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function StepCounterScreen() {
  // États pour gérer les données du compteur
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentSteps, setCurrentSteps] = useState(0);
  const [todaySteps, setTodaySteps] = useState(0);
  const [stepOffset, setStepOffset] = useState(0); // Offset pour la réinitialisation

  // Vérifier si le podomètre est disponible sur l'appareil
  useEffect(() => {
    const checkAvailability = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (!isAvailable) {
        Alert.alert(
          'Podomètre non disponible',
          'Votre appareil ne supporte pas le comptage de pas.'
        );
      }
    };

    checkAvailability();
  }, []);

  // S'abonner aux mises à jour du compteur de pas en temps réel
  useEffect(() => {
    let subscription: any;

    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();

      if (isAvailable) {
        // Obtenir les pas depuis minuit (début de la journée)
        const start = new Date();
        start.setHours(0, 0, 0, 0); // Minuit aujourd'hui
        const end = new Date();

        try {
          const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
          if (pastStepCountResult) {
            setTodaySteps(pastStepCountResult.steps);
            setCurrentSteps(pastStepCountResult.steps - stepOffset);
          }
        } catch (error) {
          console.log('Erreur lors de la récupération des pas:', error);
        }

        // S'abonner aux changements en temps réel
        subscription = Pedometer.watchStepCount((result) => {
          // result.steps contient le nombre de pas depuis le dernier événement
          setCurrentSteps((prev) => prev + result.steps);
          setTodaySteps((prev) => prev + result.steps);
        });
      }
    };

    subscribe();

    // Nettoyer l'abonnement quand le composant est démonté
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [stepOffset]);

  // Fonction pour réinitialiser le compteur
  const handleReset = () => {
    Alert.alert(
      'Réinitialiser le compteur',
      'Voulez-vous vraiment remettre le compteur à zéro ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Réinitialiser',
          onPress: () => {
            setStepOffset(todaySteps); // Sauvegarder l'offset
            setCurrentSteps(0); // Remettre à zéro l'affichage
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Calculer les calories brûlées approximativement (0.04 cal par pas en moyenne)
  const caloriesBurned = Math.round(currentSteps * 0.04);

  // Calculer la distance approximative (0.75m par pas en moyenne)
  const distanceKm = ((currentSteps * 0.75) / 1000).toFixed(2);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#3b82f6', dark: '#1e3a8a' }}
      headerImage={
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80' }}
          style={styles.headerImage}
          contentFit="cover"
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Compteur de Pas 🚶
        </ThemedText>
      </ThemedView>

      {/* Statut de disponibilité */}
      {isPedometerAvailable === 'checking' && (
        <ThemedText style={styles.statusText}>
          Vérification de la disponibilité du capteur...
        </ThemedText>
      )}

      {isPedometerAvailable === 'false' && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            ⚠️ Le podomètre n'est pas disponible sur cet appareil.
          </ThemedText>
          <ThemedText style={styles.errorSubtext}>
            Cette fonctionnalité nécessite un capteur de mouvement.
          </ThemedText>
        </ThemedView>
      )}

      {isPedometerAvailable === 'true' && (
        <>
          {/* Affichage principal du nombre de pas */}
          <ThemedView style={styles.mainCounter}>
            <ThemedText type="title" style={styles.stepsNumber}>
              {currentSteps.toLocaleString()}
            </ThemedText>
            <ThemedText style={styles.stepsLabel}>pas</ThemedText>
          </ThemedView>

          {/* Statistiques additionnelles */}
          <ThemedView style={styles.statsContainer}>
            <ThemedView style={styles.statBox}>
              <IconSymbol name="flame.fill" size={32} color="#ef4444" />
              <ThemedText style={styles.statValue}>{caloriesBurned}</ThemedText>
              <ThemedText style={styles.statLabel}>Calories</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statBox}>
              <IconSymbol name="arrow.left.arrow.right" size={32} color="#3b82f6" />
              <ThemedText style={styles.statValue}>{distanceKm}</ThemedText>
              <ThemedText style={styles.statLabel}>km</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statBox}>
              <IconSymbol name="calendar" size={32} color="#10b981" />
              <ThemedText style={styles.statValue}>{todaySteps.toLocaleString()}</ThemedText>
              <ThemedText style={styles.statLabel}>Aujourd'hui</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Bouton de réinitialisation */}
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <IconSymbol name="arrow.counterclockwise" size={24} color="#fff" />
            <ThemedText style={styles.resetButtonText}>Réinitialiser</ThemedText>
          </TouchableOpacity>

          {/* Informations */}
          <ThemedView style={styles.infoContainer}>
            <ThemedText style={styles.infoTitle}>ℹ️ Comment ça marche ?</ThemedText>
            <ThemedText style={styles.infoText}>
              • Le compteur utilise le capteur de mouvement de votre iPhone
            </ThemedText>
            <ThemedText style={styles.infoText}>
              • Les pas sont comptés en temps réel pendant que l'app est ouverte
            </ThemedText>
            <ThemedText style={styles.infoText}>
              • "Aujourd'hui" affiche tous vos pas depuis minuit
            </ThemedText>
            <ThemedText style={styles.infoText}>
              • Utilisez "Réinitialiser" pour remettre le compteur à zéro
            </ThemedText>
          </ThemedView>

          {/* Objectifs suggérés */}
          <ThemedView style={styles.goalsContainer}>
            <ThemedText style={styles.goalsTitle}>🎯 Objectifs recommandés</ThemedText>
            <ThemedView style={styles.goalItem}>
              <ThemedText style={styles.goalText}>Débutant: 5,000 pas/jour</ThemedText>
              {currentSteps >= 5000 && <ThemedText style={styles.goalCheck}>✅</ThemedText>}
            </ThemedView>
            <ThemedView style={styles.goalItem}>
              <ThemedText style={styles.goalText}>Intermédiaire: 7,500 pas/jour</ThemedText>
              {currentSteps >= 7500 && <ThemedText style={styles.goalCheck}>✅</ThemedText>}
            </ThemedView>
            <ThemedView style={styles.goalItem}>
              <ThemedText style={styles.goalText}>Avancé: 10,000 pas/jour</ThemedText>
              {currentSteps >= 10000 && <ThemedText style={styles.goalCheck}>✅</ThemedText>}
            </ThemedView>
          </ThemedView>
        </>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.8,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    marginTop: 10,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  errorContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fee2e2',
    marginVertical: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#991b1b',
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#7f1d1d',
  },
  mainCounter: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    paddingVertical: 40,
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    overflow: 'visible',
  },
  stepsNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#3b82f6',
    fontFamily: Fonts.rounded,
    textAlign: 'center',
    width: '100%',
    lineHeight: 64,
  },
  stepsLabel: {
    fontSize: 20,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginVertical: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#ef4444',
    padding: 18,
    borderRadius: 12,
    marginVertical: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  infoContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    marginVertical: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748b',
    marginBottom: 6,
  },
  goalsContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    marginVertical: 10,
    marginBottom: 40,
  },
  goalsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  goalText: {
    fontSize: 15,
    color: '#64748b',
  },
  goalCheck: {
    fontSize: 20,
  },
});
