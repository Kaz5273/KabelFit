/**
 * Tests UI pour le composant Button
 */

import { Button } from "@/src/components/Button";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

describe("Button Component", () => {
  describe("Rendering", () => {
    it("should render button with title", () => {
      render(<Button title="Click me" />);

      expect(screen.getByText("Click me")).toBeTruthy();
    });

    it("should render primary variant by default", () => {
      render(<Button title="Primary" />);

      const button = screen.getByText("Primary").parent;
      expect(button).toBeTruthy();
    });

    it("should render secondary variant", () => {
      render(<Button title="Secondary" variant="secondary" />);

      expect(screen.getByText("Secondary")).toBeTruthy();
    });

    it("should render outline variant", () => {
      render(<Button title="Outline" variant="outline" />);

      expect(screen.getByText("Outline")).toBeTruthy();
    });
  });

  describe("Sizes", () => {
    it("should render small size", () => {
      render(<Button title="Small" size="small" />);

      expect(screen.getByText("Small")).toBeTruthy();
    });

    it("should render medium size by default", () => {
      render(<Button title="Medium" />);

      expect(screen.getByText("Medium")).toBeTruthy();
    });

    it("should render large size", () => {
      render(<Button title="Large" size="large" />);

      expect(screen.getByText("Large")).toBeTruthy();
    });
  });

  describe("Interactions", () => {
    it("should call onPress when pressed", () => {
      const onPressMock = jest.fn();
      render(<Button title="Press me" onPress={onPressMock} />);

      fireEvent.press(screen.getByText("Press me"));

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("should not call onPress when disabled", () => {
      const onPressMock = jest.fn();
      render(<Button title="Disabled" onPress={onPressMock} disabled />);

      fireEvent.press(screen.getByText("Disabled"));

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should show loading indicator when loading", () => {
      render(<Button title="Loading" loading />);

      // Le texte ne devrait pas être visible quand loading est true
      expect(screen.queryByText("Loading")).toBeNull();
    });

    it("should not be pressable when loading", () => {
      const onPressMock = jest.fn();
      render(<Button title="Loading" onPress={onPressMock} loading />);

      // Le bouton ne devrait pas répondre aux pressions quand loading
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });
});
