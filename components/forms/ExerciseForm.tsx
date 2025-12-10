import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { exerciseSchema, type ExerciseFormValues } from '@/utils/validationSchemas';
import { Formik } from 'formik';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ExerciseFormData {
  name: string;
  muscle_group: string;
  sets: string;
  reps: string;
  rest_minutes: string;
  description: string;
}

interface ExerciseFormProps {
  initialData?: Partial<ExerciseFormData>;
  onSubmit: (data: ExerciseFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const MUSCLE_GROUPS = [
  'Pectoraux',
  'Dos',
  'Épaules',
  'Biceps',
  'Triceps',
  'Jambes',
  'Abdos',
  'Cardio',
  'Full Body',
];

/**
 * Formulaire de création/édition d'exercice avec Formik + Yup
 */
export function ExerciseForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = 'Enregistrer',
}: ExerciseFormProps) {
  const initialValues: ExerciseFormValues = {
    name: initialData.name || '',
    muscle_group: initialData.muscle_group || undefined,
    sets: initialData.sets ? Number(initialData.sets) : undefined,
    reps: initialData.reps ? Number(initialData.reps) : undefined,
    rest_minutes: initialData.rest_minutes ? Number(initialData.rest_minutes) : undefined,
    description: initialData.description || undefined,
  };

  const handleFormSubmit = (values: ExerciseFormValues) => {
    // Convertir les valeurs au format attendu par le parent
    const formData: ExerciseFormData = {
      name: values.name,
      muscle_group: values.muscle_group || '',
      sets: values.sets?.toString() || '',
      reps: values.reps?.toString() || '',
      rest_minutes: values.rest_minutes?.toString() || '',
      description: values.description || '',
    };
    onSubmit(formData);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={exerciseSchema}
      onSubmit={handleFormSubmit}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit }) => (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Nom de l'exercice */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>
                Nom de l'exercice <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <TextInput
                style={[styles.input, touched.name && errors.name && styles.inputError]}
                placeholder="Ex: Pompes, Squats..."
                placeholderTextColor={Colors.dark.textMuted}
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              {touched.name && errors.name && (
                <ThemedText style={styles.errorText}>{errors.name}</ThemedText>
              )}
            </View>

            {/* Groupe musculaire */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Groupe musculaire</ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsContainer}
              >
                {MUSCLE_GROUPS.map((group) => (
                  <TouchableOpacity
                    key={group}
                    style={[
                      styles.chip,
                      values.muscle_group === group && styles.chipActive,
                    ]}
                    onPress={() => setFieldValue('muscle_group', group)}
                  >
                    <ThemedText
                      style={[
                        styles.chipText,
                        values.muscle_group === group && styles.chipTextActive,
                      ]}
                    >
                      {group}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Séries */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Nombre de séries</ThemedText>
              <TextInput
                style={[styles.input, touched.sets && errors.sets && styles.inputError]}
                placeholder="Ex: 3"
                placeholderTextColor={Colors.dark.textMuted}
                keyboardType="numeric"
                value={values.sets?.toString() || ''}
                onChangeText={(text) => setFieldValue('sets', text ? Number(text) : undefined)}
                onBlur={handleBlur('sets')}
              />
              {touched.sets && errors.sets && (
                <ThemedText style={styles.errorText}>{errors.sets}</ThemedText>
              )}
            </View>

            {/* Répétitions */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Nombre de répétitions</ThemedText>
              <TextInput
                style={[styles.input, touched.reps && errors.reps && styles.inputError]}
                placeholder="Ex: 10"
                placeholderTextColor={Colors.dark.textMuted}
                keyboardType="numeric"
                value={values.reps?.toString() || ''}
                onChangeText={(text) => setFieldValue('reps', text ? Number(text) : undefined)}
                onBlur={handleBlur('reps')}
              />
              {touched.reps && errors.reps && (
                <ThemedText style={styles.errorText}>{errors.reps}</ThemedText>
              )}
            </View>

            {/* Temps de repos */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>
                Temps de repos (en minutes)
              </ThemedText>
              <TextInput
                style={[styles.input, touched.rest_minutes && errors.rest_minutes && styles.inputError]}
                placeholder="Ex: 1.5 ou 2"
                placeholderTextColor={Colors.dark.textMuted}
                keyboardType="decimal-pad"
                value={values.rest_minutes?.toString() || ''}
                onChangeText={(text) => {
                  // Remplacer la virgule par un point pour les nombres décimaux
                  const normalizedText = text.replace(',', '.');
                  setFieldValue('rest_minutes', normalizedText ? Number(normalizedText) : undefined);
                }}
                onBlur={handleBlur('rest_minutes')}
              />
              {touched.rest_minutes && errors.rest_minutes && (
                <ThemedText style={styles.errorText}>{errors.rest_minutes}</ThemedText>
              )}
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Description</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Instructions ou notes pour cet exercice..."
                placeholderTextColor={Colors.dark.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={values.description || ''}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
              />
              {touched.description && errors.description && (
                <ThemedText style={styles.errorText}>{errors.description}</ThemedText>
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
              >
                <ThemedText style={styles.cancelButtonText}>Annuler</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={() => handleSubmit()}
              >
                <ThemedText style={styles.submitButtonText}>{submitLabel}</ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  required: {
    color: Colors.dark.primary,
  },
  input: {
    backgroundColor: Colors.dark.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.dark.text,
  },
  inputError: {
    borderColor: Colors.dark.error,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  errorText: {
    fontSize: 12,
    color: Colors.dark.error,
    marginTop: 4,
  },
  chipsContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.dark.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  chipActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  chipText: {
    fontSize: 14,
    color: Colors.dark.text,
  },
  chipTextActive: {
    color: Colors.dark.background,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.dark.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  submitButton: {
    backgroundColor: Colors.dark.primary,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.background,
  },
});
