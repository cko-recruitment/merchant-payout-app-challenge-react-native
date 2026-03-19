import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TCAButton } from "../tca-button";

describe("TCAButton", () => {
  it("renders the title and fires onPress when valid", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <TCAButton title="Send" onPress={onPress} isValid={true} />,
    );

    fireEvent.press(getByText("Send"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("is disabled and does not fire onPress when isValid is false", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <TCAButton title="Send" onPress={onPress} isValid={false} />,
    );

    const button = getByRole("button");
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it("uses the provided accessibilityLabel over the title", () => {
    const { getByRole } = render(
      <TCAButton
        title="Send"
        onPress={jest.fn()}
        isValid={true}
        accessibilityLabel="Submit payout"
      />,
    );

    expect(getByRole("button", { name: "Submit payout" })).toBeTruthy();
  });
});
