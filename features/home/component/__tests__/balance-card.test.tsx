import React from "react";
import { render } from "@testing-library/react-native";
import { BalanceCard } from "../balance-card";

describe("BalanceCard", () => {
  // Child text nodes are hidden with importantForAccessibility="no-hide-descendants"
  // so assertions target the compound accessibilityLabel on the card container.

  it("includes the available balance in its accessibility label", () => {
    const { getByRole } = render(
      <BalanceCard balance={500000} pendingBalance={25000} currency="GBP" />,
    );
    // 500000 pence → £5,000.00
    expect(getByRole("summary").props.accessibilityLabel).toContain(
      "£5,000.00",
    );
  });

  it("includes the pending balance in its accessibility label", () => {
    const { getByRole } = render(
      <BalanceCard balance={500000} pendingBalance={25000} currency="GBP" />,
    );
    // 25000 pence → £250.00
    expect(getByRole("summary").props.accessibilityLabel).toContain("£250.00");
  });

  it("includes both balance values in a single compound label", () => {
    const { getByRole } = render(
      <BalanceCard balance={100000} pendingBalance={5000} currency="GBP" />,
    );
    const label = getByRole("summary").props.accessibilityLabel;
    expect(label).toContain("£1,000.00");
    expect(label).toContain("£50.00");
  });
});
