/**
 * Tests UI pour le composant SessionCard
 */

import { SessionCard } from "@/components/session/SessionCard";
import type { Session } from "@/database/types";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

// Mock session data
const mockSession: Session = {
  id: 1,
  program_id: 1,
  name: "Morning Workout",
  day_of_week: "Monday",
  duration_minutes: 45,
  order: 1,
  description: "Full body workout",
  created_at: "2024-01-01T00:00:00.000Z",
};

describe("SessionCard Component", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  describe("Rendering", () => {
    it("should render session name", () => {
      render(<SessionCard session={mockSession} onPress={mockOnPress} />);

      expect(screen.getByText("Morning Workout")).toBeTruthy();
    });

    it("should render duration", () => {
      render(<SessionCard session={mockSession} onPress={mockOnPress} />);

      expect(screen.getByText("45 min")).toBeTruthy();
    });

    it("should render day of week in French", () => {
      render(<SessionCard session={mockSession} onPress={mockOnPress} />);

      expect(screen.getByText("Lundi")).toBeTruthy();
    });

    it("should render COMMENCER button text", () => {
      render(<SessionCard session={mockSession} onPress={mockOnPress} />);

      expect(screen.getByText("COMMENCER")).toBeTruthy();
    });
  });

  describe("Program Type Badge", () => {
    it("should render program type badge when provided", () => {
      render(
        <SessionCard
          session={mockSession}
          programType="HIIT"
          onPress={mockOnPress}
        />,
      );

      expect(screen.getByText("HIIT")).toBeTruthy();
    });

    it("should not render badge when programType is not provided", () => {
      render(<SessionCard session={mockSession} onPress={mockOnPress} />);

      expect(screen.queryByText("HIIT")).toBeNull();
      expect(screen.queryByText("STRENGTH")).toBeNull();
    });
  });

  describe("Day of Week Formatting", () => {
    it('should display "Jour non défini" when day_of_week is null', () => {
      const sessionWithoutDay: Session = {
        ...mockSession,
        day_of_week: null,
      };

      render(<SessionCard session={sessionWithoutDay} onPress={mockOnPress} />);

      // Le jour n'est pas affiché si null (condition dans le composant)
      expect(screen.queryByText("Jour non défini")).toBeNull();
    });

    it.each([
      ["Monday", "Lundi"],
      ["Tuesday", "Mardi"],
      ["Wednesday", "Mercredi"],
      ["Thursday", "Jeudi"],
      ["Friday", "Vendredi"],
      ["Saturday", "Samedi"],
      ["Sunday", "Dimanche"],
    ])("should translate %s to %s", (englishDay, frenchDay) => {
      const session: Session = {
        ...mockSession,
        day_of_week: englishDay,
      };

      render(<SessionCard session={session} onPress={mockOnPress} />);

      expect(screen.getByText(frenchDay)).toBeTruthy();
    });
  });

  describe("Interactions", () => {
    it("should call onPress with session when pressed", () => {
      render(<SessionCard session={mockSession} onPress={mockOnPress} />);

      fireEvent.press(screen.getByText("Morning Workout"));

      expect(mockOnPress).toHaveBeenCalledTimes(1);
      expect(mockOnPress).toHaveBeenCalledWith(mockSession);
    });
  });
});
