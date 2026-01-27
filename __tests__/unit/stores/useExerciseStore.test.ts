/**
 * Tests unitaires pour useExerciseStore
 * @jest-environment node
 */

import type { Exercise } from "@/database/types";
import { useExerciseStore } from "@/stores/useExerciseStore";

// Mock exercise data
const mockExercise: Exercise = {
  id: 1,
  session_id: 1,
  name: "Push-ups",
  muscle_group: "Chest",
  sets: 3,
  reps: 12,
  rest_minutes: 1.5,
  description: "Standard push-ups",
  order: 1,
  created_at: "2024-01-01T00:00:00.000Z",
};

const mockExercise2: Exercise = {
  id: 2,
  session_id: 1,
  name: "Squats",
  muscle_group: "Legs",
  sets: 4,
  reps: 15,
  rest_minutes: 2,
  description: "Bodyweight squats",
  order: 2,
  created_at: "2024-01-02T00:00:00.000Z",
};

describe("useExerciseStore", () => {
  beforeEach(() => {
    useExerciseStore.getState().reset();
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useExerciseStore.getState();

      expect(state.exercises).toEqual([]);
      expect(state.currentExercise).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.filters).toEqual({});
    });
  });

  describe("setExercises", () => {
    it("should set exercises array", () => {
      const exercises = [mockExercise, mockExercise2];

      useExerciseStore.getState().setExercises(exercises);

      expect(useExerciseStore.getState().exercises).toEqual(exercises);
      expect(useExerciseStore.getState().exercises).toHaveLength(2);
    });
  });

  describe("addExercise", () => {
    it("should add an exercise to the list", () => {
      useExerciseStore.getState().addExercise(mockExercise);

      expect(useExerciseStore.getState().exercises).toContainEqual(
        mockExercise,
      );
    });
  });

  describe("updateExercise", () => {
    it("should update an existing exercise", () => {
      useExerciseStore.getState().setExercises([mockExercise]);

      useExerciseStore.getState().updateExercise(1, { sets: 5, reps: 20 });

      const updated = useExerciseStore.getState().exercises[0];
      expect(updated.sets).toBe(5);
      expect(updated.reps).toBe(20);
    });

    it("should also update currentExercise if it matches", () => {
      useExerciseStore.getState().setExercises([mockExercise]);
      useExerciseStore.getState().setCurrentExercise(mockExercise);

      useExerciseStore
        .getState()
        .updateExercise(1, { name: "Diamond Push-ups" });

      expect(useExerciseStore.getState().currentExercise?.name).toBe(
        "Diamond Push-ups",
      );
    });
  });

  describe("removeExercise", () => {
    it("should remove an exercise from the list", () => {
      useExerciseStore.getState().setExercises([mockExercise, mockExercise2]);

      useExerciseStore.getState().removeExercise(1);

      expect(useExerciseStore.getState().exercises).toHaveLength(1);
      expect(useExerciseStore.getState().exercises[0].id).toBe(2);
    });

    it("should clear currentExercise if removed", () => {
      useExerciseStore.getState().setExercises([mockExercise]);
      useExerciseStore.getState().setCurrentExercise(mockExercise);

      useExerciseStore.getState().removeExercise(1);

      expect(useExerciseStore.getState().currentExercise).toBeNull();
    });
  });

  describe("Filters", () => {
    it("should set and merge filters", () => {
      useExerciseStore.getState().setFilters({ sessionId: 1 });
      useExerciseStore.getState().setFilters({ muscleGroup: "Chest" });

      expect(useExerciseStore.getState().filters).toEqual({
        sessionId: 1,
        muscleGroup: "Chest",
      });
    });

    it("should clear filters", () => {
      useExerciseStore.getState().setFilters({ sessionId: 1 });
      useExerciseStore.getState().clearFilters();

      expect(useExerciseStore.getState().filters).toEqual({});
    });
  });
});
