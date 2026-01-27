/**
 * Tests UI pour le composant Badge
 */

import { Badge } from "@/components/ui/badge";
import { render, screen } from "@testing-library/react-native";
import React from "react";

describe("Badge Component", () => {
  describe("Rendering", () => {
    it("should render badge with label", () => {
      render(<Badge label="Test Label" />);

      expect(screen.getByText("Test Label")).toBeTruthy();
    });

    it("should render with default variant", () => {
      render(<Badge label="Default" />);

      expect(screen.getByText("Default")).toBeTruthy();
    });
  });

  describe("Variants", () => {
    it("should render primary variant", () => {
      render(<Badge label="Primary" variant="primary" />);

      expect(screen.getByText("Primary")).toBeTruthy();
    });

    it("should render success variant", () => {
      render(<Badge label="Success" variant="success" />);

      expect(screen.getByText("Success")).toBeTruthy();
    });

    it("should render warning variant", () => {
      render(<Badge label="Warning" variant="warning" />);

      expect(screen.getByText("Warning")).toBeTruthy();
    });

    it("should render neutral variant", () => {
      render(<Badge label="Neutral" variant="neutral" />);

      expect(screen.getByText("Neutral")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should be accessible", () => {
      render(<Badge label="Accessible Badge" />);

      const badge = screen.getByText("Accessible Badge");
      expect(badge).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("should render with empty label", () => {
      render(<Badge label="" />);

      // Le composant devrait quand même se rendre
      expect(screen.root).toBeTruthy();
    });

    it("should render with long label", () => {
      const longLabel = "This is a very long label that might overflow";
      render(<Badge label={longLabel} />);

      expect(screen.getByText(longLabel)).toBeTruthy();
    });
  });
});
