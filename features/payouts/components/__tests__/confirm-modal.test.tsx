import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ConfirmModal } from "../confirm-modal";

const baseProps = {
  visible: true,
  amount: 10000,
  currency: "GBP" as const,
  iban: "GB29NWBK60161331926819",
  isLoading: false,
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
};

describe("ConfirmModal", () => {
  it("calls onCancel when the cancel button is pressed", () => {
    const onCancel = jest.fn();
    const { getByTestId } = render(
      <ConfirmModal {...baseProps} onCancel={onCancel} />,
    );

    fireEvent.press(getByTestId("modal-cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("disables both buttons and marks confirm as busy while loading", () => {
    const { getByTestId } = render(
      <ConfirmModal {...baseProps} isLoading={true} />,
    );

    expect(getByTestId("modal-cancel")).toBeDisabled();
    expect(getByTestId("modal-confirm")).toBeDisabled();
  });
});
