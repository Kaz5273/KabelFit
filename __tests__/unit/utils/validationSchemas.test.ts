/**
 * Tests unitaires pour les schémas de validation
 * @jest-environment node
 */

import { exerciseSchema, sessionSchema } from "@/utils/validationSchemas";

describe("Validation Schemas", () => {
  describe("exerciseSchema", () => {
    it("should validate a valid exercise", async () => {
      const validExercise = {
        name: "Push-ups",
        muscle_group: "Chest",
        sets: 3,
        reps: 12,
        rest_minutes: 1.5,
        description: "Standard push-ups",
      };

      await expect(
        exerciseSchema.validate(validExercise),
      ).resolves.toBeDefined();
    });

    it("should require name field", async () => {
      const invalidExercise = {
        sets: 3,
        reps: 12,
      };

      await expect(exerciseSchema.validate(invalidExercise)).rejects.toThrow(
        "Le nom est requis",
      );
    });

    it("should enforce minimum name length of 2 characters", async () => {
      const invalidExercise = {
        name: "A",
      };

      await expect(exerciseSchema.validate(invalidExercise)).rejects.toThrow(
        "Le nom doit contenir au moins 2 caractères",
      );
    });

    it("should enforce maximum name length of 100 characters", async () => {
      const invalidExercise = {
        name: "A".repeat(101),
      };

      await expect(exerciseSchema.validate(invalidExercise)).rejects.toThrow(
        "Le nom ne peut pas dépasser 100 caractères",
      );
    });

    it("should require sets to be positive", async () => {
      const invalidExercise = {
        name: "Push-ups",
        sets: -1,
      };

      await expect(exerciseSchema.validate(invalidExercise)).rejects.toThrow(
        "Le nombre de séries doit être positif",
      );
    });

    it("should require reps to be a positive integer", async () => {
      const invalidExercise = {
        name: "Push-ups",
        reps: 0,
      };

      await expect(exerciseSchema.validate(invalidExercise)).rejects.toThrow(
        "Le nombre de répétitions doit être positif",
      );
    });

    it("should enforce maximum reps of 500", async () => {
      const invalidExercise = {
        name: "Push-ups",
        reps: 501,
      };

      await expect(exerciseSchema.validate(invalidExercise)).rejects.toThrow(
        "Maximum 500 répétitions",
      );
    });

    it("should allow exercise with only required fields", async () => {
      const minimalExercise = {
        name: "Plank",
      };

      await expect(
        exerciseSchema.validate(minimalExercise),
      ).resolves.toBeDefined();
    });
  });

  describe("sessionSchema", () => {
    it("should validate a valid session", async () => {
      const validSession = {
        name: "Morning Workout",
        day_of_week: "Monday",
        duration_minutes: 45,
        order: 1,
        description: "Full body workout",
      };

      await expect(sessionSchema.validate(validSession)).resolves.toBeDefined();
    });

    it("should require name field", async () => {
      const invalidSession = {
        duration_minutes: 45,
        order: 1,
      };

      await expect(sessionSchema.validate(invalidSession)).rejects.toThrow(
        "Le nom est requis",
      );
    });

    it("should require duration_minutes field", async () => {
      const invalidSession = {
        name: "Workout",
        order: 1,
      };

      await expect(sessionSchema.validate(invalidSession)).rejects.toThrow(
        "La durée est requise",
      );
    });

    it("should require order field", async () => {
      const invalidSession = {
        name: "Workout",
        duration_minutes: 45,
      };

      await expect(sessionSchema.validate(invalidSession)).rejects.toThrow(
        "L'ordre est requis",
      );
    });

    it("should validate day_of_week values", async () => {
      const invalidSession = {
        name: "Workout",
        day_of_week: "InvalidDay",
        duration_minutes: 45,
        order: 1,
      };

      await expect(sessionSchema.validate(invalidSession)).rejects.toThrow(
        "Jour de la semaine invalide",
      );
    });

    it("should accept valid day_of_week values", async () => {
      const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      for (const day of days) {
        const session = {
          name: "Workout",
          day_of_week: day,
          duration_minutes: 45,
          order: 1,
        };
        await expect(sessionSchema.validate(session)).resolves.toBeDefined();
      }
    });

    it("should enforce minimum duration of 1 minute", async () => {
      const invalidSession = {
        name: "Workout",
        duration_minutes: 0,
        order: 1,
      };

      await expect(sessionSchema.validate(invalidSession)).rejects.toThrow(
        "Minimum 1 minute",
      );
    });

    it("should enforce maximum duration of 300 minutes", async () => {
      const invalidSession = {
        name: "Workout",
        duration_minutes: 301,
        order: 1,
      };

      await expect(sessionSchema.validate(invalidSession)).rejects.toThrow(
        "Maximum 300 minutes (5 heures)",
      );
    });

    it("should enforce maximum description length", async () => {
      const invalidSession = {
        name: "Workout",
        duration_minutes: 45,
        order: 1,
        description: "A".repeat(1001),
      };

      await expect(sessionSchema.validate(invalidSession)).rejects.toThrow(
        "La description ne peut pas dépasser 1000 caractères",
      );
    });
  });
});
