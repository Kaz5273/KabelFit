import * as Yup from 'yup';

/**
 * Schéma de validation pour un exercice
 */
export const exerciseSchema = Yup.object().shape({
  name: Yup.string()
    .required('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  
  muscle_group: Yup.string()
    .notRequired(),
  
  sets: Yup.number()
    .notRequired()
    .positive('Le nombre de séries doit être positif')
    .integer('Le nombre de séries doit être un entier')
    .max(50, 'Maximum 50 séries'),
  
  reps: Yup.number()
    .notRequired()
    .positive('Le nombre de répétitions doit être positif')
    .integer('Le nombre de répétitions doit être un entier')
    .max(500, 'Maximum 500 répétitions'),
  
  rest_minutes: Yup.number()
    .notRequired()
    .positive('Le temps de repos doit être positif')
    .max(60, 'Maximum 60 minutes de repos'),
  
  description: Yup.string()
    .notRequired()
    .max(500, 'La description ne peut pas dépasser 500 caractères'),
});

/**
 * Schéma de validation pour une séance
 */
export const sessionSchema = Yup.object().shape({
  name: Yup.string()
    .required('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  
  day_of_week: Yup.string()
    .notRequired()
    .oneOf(
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', undefined],
      'Jour de la semaine invalide'
    ),
  
  duration_minutes: Yup.number()
    .required('La durée est requise')
    .positive('La durée doit être positive')
    .integer('La durée doit être un entier')
    .min(1, 'Minimum 1 minute')
    .max(300, 'Maximum 300 minutes (5 heures)'),
  
  order: Yup.number()
    .required('L\'ordre est requis')
    .positive('L\'ordre doit être positif')
    .integer('L\'ordre doit être un entier')
    .min(1, 'L\'ordre minimum est 1'),
  
  description: Yup.string()
    .notRequired()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères'),
});

/**
 * Types pour les valeurs des formulaires
 */
export interface ExerciseFormValues {
  name: string;
  muscle_group?: string;
  sets?: number;
  reps?: number;
  rest_minutes?: number;
  description?: string;
}

export interface SessionFormValues {
  name: string;
  day_of_week?: string;
  duration_minutes: number;
  order: number;
  description?: string;
}
