import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PayoutSuccessView } from "../payout-success-view";

describe("PayoutSuccessView", () => {
  const baseProps = {
    amount: 150000,
    currency: "GBP" as const,
    iban: "GB29NWBK60161331926819",
    onNewPayout: jest.fn(),
  };

  it("renders the formatted payout amount", () => {
    const { getByText } = render(<PayoutSuccessView {...baseProps} />);
    // 150000 pence → £1,500.00
    expect(getByText("£1,500.00")).toBeTruthy();
  });

  it("renders the destination IBAN", () => {
    const { getByText } = render(<PayoutSuccessView {...baseProps} />);
    expect(getByText("GB29NWBK60161331926819")).toBeTruthy();
  });

  it("fires onNewPayout when the New Payout button is pressed", () => {
    const onNewPayout = jest.fn();
    const { getByTestId } = render(
      <PayoutSuccessView {...baseProps} onNewPayout={onNewPayout} />,
    );

    fireEvent.press(getByTestId("new-payout-button"));
    expect(onNewPayout).toHaveBeenCalledTimes(1);
  });
});
