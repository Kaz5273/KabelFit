/**
 * Tests unitaires pour useSessionStore
 * @jest-environment node
 */

import type { Session } from "@/database/types";
import { useSessionStore } from "@/stores/useSessionStore";

// Mock session data
const mockSession: Session = {
  id: 1,
  program_id: 1,
  name: "Session Test",
  day_of_week: "Monday",
  duration_minutes: 45,
  order: 1,
  description: "Test description",
  created_at: "2024-01-01T00:00:00.000Z",
};

const mockSession2: Session = {
  id: 2,
  program_id: 1,
  name: "Session Test 2",
  day_of_week: "Wednesday",
  duration_minutes: 60,
  order: 2,
  description: "Test description 2",
  created_at: "2024-01-02T00:00:00.000Z",
};

describe("useSessionStore", () => {
  // Reset store before each test
  beforeEach(() => {
    useSessionStore.getState().reset();
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useSessionStore.getState();

      expect(state.sessions).toEqual([]);
      expect(state.currentSession).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.filters).toEqual({});
    });
  });

  describe("setSessions", () => {
    it("should set sessions array", () => {
      const sessions = [mockSession, mockSession2];

      useSessionStore.getState().setSessions(sessions);

      expect(useSessionStore.getState().sessions).toEqual(sessions);
      expect(useSessionStore.getState().sessions).toHaveLength(2);
    });

    it("should clear error when setting sessions", () => {
      useSessionStore.getState().setError("Previous error");
      useSessionStore.getState().setSessions([mockSession]);

      expect(useSessionStore.getState().error).toBeNull();
    });
  });

  describe("addSession", () => {
    it("should add a session to the list", () => {
      useSessionStore.getState().addSession(mockSession);

      expect(useSessionStore.getState().sessions).toContainEqual(mockSession);
      expect(useSessionStore.getState().sessions).toHaveLength(1);
    });

    it("should append session to existing sessions", () => {
      useSessionStore.getState().setSessions([mockSession]);
      useSessionStore.getState().addSession(mockSession2);

      expect(useSessionStore.getState().sessions).toHaveLength(2);
      expect(useSessionStore.getState().sessions[1]).toEqual(mockSession2);
    });
  });

  describe("updateSession", () => {
    it("should update an existing session", () => {
      useSessionStore.getState().setSessions([mockSession]);

      useSessionStore.getState().updateSession(1, { name: "Updated Name" });

      expect(useSessionStore.getState().sessions[0].name).toBe("Updated Name");
    });

    it("should update currentSession if it matches the updated session", () => {
      useSessionStore.getState().setSessions([mockSession]);
      useSessionStore.getState().setCurrentSession(mockSession);

      useSessionStore.getState().updateSession(1, { duration_minutes: 90 });

      expect(useSessionStore.getState().currentSession?.duration_minutes).toBe(
        90,
      );
    });

    it("should not update currentSession if ids do not match", () => {
      useSessionStore.getState().setSessions([mockSession, mockSession2]);
      useSessionStore.getState().setCurrentSession(mockSession);

      useSessionStore
        .getState()
        .updateSession(2, { name: "Updated Session 2" });

      expect(useSessionStore.getState().currentSession?.name).toBe(
        "Session Test",
      );
    });
  });

  describe("removeSession", () => {
    it("should remove a session from the list", () => {
      useSessionStore.getState().setSessions([mockSession, mockSession2]);

      useSessionStore.getState().removeSession(1);

      expect(useSessionStore.getState().sessions).toHaveLength(1);
      expect(useSessionStore.getState().sessions[0].id).toBe(2);
    });

    it("should clear currentSession if it was removed", () => {
      useSessionStore.getState().setSessions([mockSession]);
      useSessionStore.getState().setCurrentSession(mockSession);

      useSessionStore.getState().removeSession(1);

      expect(useSessionStore.getState().currentSession).toBeNull();
    });
  });

  describe("Filters", () => {
    it("should set filters", () => {
      useSessionStore
        .getState()
        .setFilters({ programId: 1, dayOfWeek: "Monday" });

      expect(useSessionStore.getState().filters).toEqual({
        programId: 1,
        dayOfWeek: "Monday",
      });
    });

    it("should merge filters with existing ones", () => {
      useSessionStore.getState().setFilters({ programId: 1 });
      useSessionStore.getState().setFilters({ searchQuery: "test" });

      expect(useSessionStore.getState().filters).toEqual({
        programId: 1,
        searchQuery: "test",
      });
    });

    it("should clear all filters", () => {
      useSessionStore
        .getState()
        .setFilters({ programId: 1, dayOfWeek: "Monday" });
      useSessionStore.getState().clearFilters();

      expect(useSessionStore.getState().filters).toEqual({});
    });
  });

  describe("Loading and Error States", () => {
    it("should set loading state", () => {
      useSessionStore.getState().setLoading(true);
      expect(useSessionStore.getState().isLoading).toBe(true);

      useSessionStore.getState().setLoading(false);
      expect(useSessionStore.getState().isLoading).toBe(false);
    });

    it("should set error message", () => {
      useSessionStore.getState().setError("Test error");
      expect(useSessionStore.getState().error).toBe("Test error");
    });
  });

  describe("reset", () => {
    it("should reset store to initial state", () => {
      // Set some state
      useSessionStore.getState().setSessions([mockSession]);
      useSessionStore.getState().setCurrentSession(mockSession);
      useSessionStore.getState().setLoading(true);
      useSessionStore.getState().setError("Error");
      useSessionStore.getState().setFilters({ programId: 1 });

      // Reset
      useSessionStore.getState().reset();

      const state = useSessionStore.getState();
      expect(state.sessions).toEqual([]);
      expect(state.currentSession).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.filters).toEqual({});
    });
  });
});
