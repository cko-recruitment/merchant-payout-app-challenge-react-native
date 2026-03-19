import React from "react";
import { render } from "@testing-library/react-native";
import { RecentActivityListItem } from "../recent-activity-list";
import type { ActivityItem } from "@/types/api";

const makeItem = (overrides: Partial<ActivityItem> = {}): ActivityItem => ({
  id: "txn-1",
  type: "payout",
  amount: 7500,
  currency: "GBP",
  date: "2024-03-15",
  description: "Payment to Supplier",
  status: "completed",
  ...overrides,
});

describe("RecentActivityListItem", () => {
  // The item's children are hidden from the accessibility tree via
  // importantForAccessibility="no-hide-descendants". Tests target the compound
  // accessibilityLabel on the container so they mirror what screen readers see.

  it("includes the transaction description in its accessibility label", () => {
    const { getByRole } = render(<RecentActivityListItem item={makeItem()} />);
    expect(getByRole("text").props.accessibilityLabel).toContain(
      "Payment to Supplier",
    );
  });

  it("marks positive amounts with '+' in its accessibility label", () => {
    const { getByRole } = render(
      <RecentActivityListItem item={makeItem({ amount: 5000 })} />,
    );
    expect(getByRole("text").props.accessibilityLabel).toContain("+£");
  });

  it("includes the status in its accessibility label", () => {
    const { getByRole } = render(
      <RecentActivityListItem item={makeItem({ status: "pending" })} />,
    );
    expect(getByRole("text").props.accessibilityLabel).toContain("pending");
  });
});
