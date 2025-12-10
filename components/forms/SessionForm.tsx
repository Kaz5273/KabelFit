import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { sessionSchema, type SessionFormValues } from '@/utils/validationSchemas';
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

interface SessionFormData {
  name: string;
  day_of_week: string;
  duration_minutes: string;
  description: string;
  order: string;
}

interface SessionFormProps {
  programId: number;
  initialData?: Partial<SessionFormData>;
  onSubmit: (data: SessionFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const DAYS_OF_WEEK = [
  { key: 'Monday', label: 'Lundi' },
  { key: 'Tuesday', label: 'Mardi' },
  { key: 'Wednesday', label: 'Mercredi' },
  { key: 'Thursday', label: 'Jeudi' },
  { key: 'Friday', label: 'Vendredi' },
  { key: 'Saturday', label: 'Samedi' },
  { key: 'Sunday', label: 'Dimanche' },
];

/**
 * Formulaire de création/édition de séance avec Formik + Yup
 */
export function SessionForm({
  programId,
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = 'Enregistrer',
}: SessionFormProps) {
  const initialValues: SessionFormValues = {
    name: initialData.name || '',
    day_of_week: initialData.day_of_week || undefined,
    duration_minutes: initialData.duration_minutes ? Number(initialData.duration_minutes) : 45,
    order: initialData.order ? Number(initialData.order) : 1,
    description: initialData.description || undefined,
  };

  const handleFormSubmit = (values: SessionFormValues) => {
    // Convertir les valeurs au format attendu par le parent
    const formData: SessionFormData = {
      name: values.name,
      day_of_week: values.day_of_week || '',
      duration_minutes: values.duration_minutes.toString(),
      order: values.order.toString(),
      description: values.description || '',
    };
    onSubmit(formData);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={sessionSchema}
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
            {/* Nom de la séance */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>
                Nom de la séance <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <TextInput
                style={[styles.input, touched.name && errors.name && styles.inputError]}
                placeholder="Ex: Séance Full Body, Cardio HIIT..."
                placeholderTextColor={Colors.dark.textMuted}
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              {touched.name && errors.name && (
                <ThemedText style={styles.errorText}>{errors.name}</ThemedText>
              )}
            </View>

            {/* Jour de la semaine */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Jour de la semaine</ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsContainer}
              >
                {DAYS_OF_WEEK.map((day) => (
                  <TouchableOpacity
                    key={day.key}
                    style={[
                      styles.chip,
                      values.day_of_week === day.key && styles.chipActive,
                    ]}
                    onPress={() => setFieldValue('day_of_week', day.key)}
                  >
                    <ThemedText
                      style={[
                        styles.chipText,
                        values.day_of_week === day.key && styles.chipTextActive,
                      ]}
                    >
                      {day.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Durée */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>
                Durée (en minutes) <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <TextInput
                style={[styles.input, touched.duration_minutes && errors.duration_minutes && styles.inputError]}
                placeholder="Ex: 45"
                placeholderTextColor={Colors.dark.textMuted}
                keyboardType="numeric"
                value={values.duration_minutes.toString()}
                onChangeText={(text) => setFieldValue('duration_minutes', text ? Number(text) : 0)}
                onBlur={handleBlur('duration_minutes')}
              />
              {touched.duration_minutes && errors.duration_minutes && (
                <ThemedText style={styles.errorText}>{errors.duration_minutes}</ThemedText>
              )}
            </View>

            {/* Ordre */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>
                Ordre dans le programme <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <TextInput
                style={[styles.input, touched.order && errors.order && styles.inputError]}
                placeholder="Ex: 1, 2, 3..."
                placeholderTextColor={Colors.dark.textMuted}
                keyboardType="numeric"
                value={values.order.toString()}
                onChangeText={(text) => setFieldValue('order', text ? Number(text) : 1)}
                onBlur={handleBlur('order')}
              />
              {touched.order && errors.order && (
                <ThemedText style={styles.errorText}>{errors.order}</ThemedText>
              )}
              <ThemedText style={styles.hint}>
                Position de cette séance dans le programme
              </ThemedText>
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Description</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Objectifs et instructions pour cette séance..."
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
  hint: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
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
