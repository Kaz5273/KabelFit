import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createProgram } from '@/database';
import type { TrainingType, DifficultyLevel } from '@/database';

const trainingTypes: TrainingType[] = ['Strength', 'Cardio', 'HIIT', 'Yoga', 'Other'];
const difficultyLevels: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .required('Le nom est requis'),
  type: Yup.string()
    .oneOf(trainingTypes, 'Type invalide')
    .required('Le type est requis'),
  duration_weeks: Yup.number()
    .min(1, 'Minimum 1 semaine')
    .max(52, 'Maximum 52 semaines')
    .required('La durée est requise'),
  sessions_per_week: Yup.number()
    .min(1, 'Minimum 1 séance')
    .max(7, 'Maximum 7 séances')
    .required('Le nombre de séances est requis'),
  difficulty_level: Yup.string()
    .oneOf(difficultyLevels, 'Niveau invalide')
    .required('Le niveau est requis'),
  description: Yup.string()
    .max(200, 'La description ne peut pas dépasser 200 caractères'),
});

interface FormValues {
  name: string;
  type: TrainingType;
  duration_weeks: string;
  sessions_per_week: string;
  difficulty_level: DifficultyLevel;
  description: string;
}

export default function CreateProgramScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: FormValues = {
    name: '',
    type: 'Strength',
    duration_weeks: '4',
    sessions_per_week: '3',
    difficulty_level: 'Beginner',
    description: '',
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await createProgram({
        name: values.name,
        type: values.type,
        duration_weeks: parseInt(values.duration_weeks, 10),
        sessions_per_week: parseInt(values.sessions_per_week, 10),
        difficulty_level: values.difficulty_level,
        description: values.description || undefined,
      });
      Alert.alert('Succès', 'Programme créé avec succès', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le programme');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Créer un Programme</Text>
          <View style={styles.placeholder} />
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}>
              {/* Nom du programme */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom du programme *</Text>
                <TextInput
                  style={[styles.input, touched.name && errors.name && styles.inputError]}
                  placeholder="Ex: Programme Force"
                  placeholderTextColor={Colors.dark.textMuted}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* Type d'entraînement */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Type d'entraînement *</Text>
                <View style={styles.chipContainer}>
                  {trainingTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.chip, values.type === type && styles.chipSelected]}
                      onPress={() => setFieldValue('type', type)}>
                      <Text
                        style={[styles.chipText, values.type === type && styles.chipTextSelected]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Niveau de difficulté */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Niveau *</Text>
                <View style={styles.chipContainer}>
                  {difficultyLevels.map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[styles.chip, values.difficulty_level === level && styles.chipSelected]}
                      onPress={() => setFieldValue('difficulty_level', level)}>
                      <Text
                        style={[
                          styles.chipText,
                          values.difficulty_level === level && styles.chipTextSelected,
                        ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Durée et séances */}
              <View style={styles.rowGroup}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Durée (semaines) *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.duration_weeks && errors.duration_weeks && styles.inputError,
                    ]}
                    placeholder="4"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={values.duration_weeks}
                    onChangeText={handleChange('duration_weeks')}
                    onBlur={handleBlur('duration_weeks')}
                    keyboardType="numeric"
                  />
                  {touched.duration_weeks && errors.duration_weeks && (
                    <Text style={styles.errorText}>{errors.duration_weeks}</Text>
                  )}
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Séances/semaine *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.sessions_per_week && errors.sessions_per_week && styles.inputError,
                    ]}
                    placeholder="3"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={values.sessions_per_week}
                    onChangeText={handleChange('sessions_per_week')}
                    onBlur={handleBlur('sessions_per_week')}
                    keyboardType="numeric"
                  />
                  {touched.sessions_per_week && errors.sessions_per_week && (
                    <Text style={styles.errorText}>{errors.sessions_per_week}</Text>
                  )}
                </View>
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description (optionnel)</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    touched.description && errors.description && styles.inputError,
                  ]}
                  placeholder="Décrivez votre programme..."
                  placeholderTextColor={Colors.dark.textMuted}
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                {touched.description && errors.description && (
                  <Text style={styles.errorText}>{errors.description}</Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={() => handleSubmit()}
                activeOpacity={0.8}
                disabled={isSubmitting}>
                <Ionicons name="checkmark" size={22} color={Colors.dark.background} />
                <Text style={styles.submitText}>
                  {isSubmitting ? 'Création...' : 'Créer le programme'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  rowGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.backgroundCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.dark.text,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.dark.primary,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  errorText: {
    color: Colors.dark.primary,
    fontSize: 12,
    marginTop: 6,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.dark.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  chipSelected: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  chipText: {
    color: Colors.dark.textMuted,
    fontSize: 14,
  },
  chipTextSelected: {
    color: Colors.dark.background,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dark.primary,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: Colors.dark.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
