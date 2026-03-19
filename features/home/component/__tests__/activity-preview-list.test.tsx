import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ActivityPreviewList } from "../activity-preview-list";
import type { ActivityItem } from "@/types/api";

const makeItem = (id: string): ActivityItem => ({
  id,
  type: "payout",
  amount: 10000,
  currency: "GBP",
  date: "2024-01-15",
  description: `Transaction ${id}`,
  status: "completed",
});

describe("ActivityPreviewList", () => {
  it("renders at most `numberOfItems` accessible items from the list", () => {
    const items = [makeItem("1"), makeItem("2"), makeItem("3"), makeItem("4")];
    const { getAllByRole } = render(
      <ActivityPreviewList items={items} numberOfItems={3} />,
    );

    // Each RecentActivityListItem has accessibilityRole="text" on its container.
    const labels = getAllByRole("text").map(
      (el) => el.props.accessibilityLabel ?? "",
    );

    expect(labels.some((l) => l.includes("Transaction 1"))).toBe(true);
    expect(labels.some((l) => l.includes("Transaction 3"))).toBe(true);
    // 4th item should be clipped by the preview limit
    expect(labels.some((l) => l.includes("Transaction 4"))).toBe(false);
  });

  it("shows the empty-state message when there are no items", () => {
    const { getByText } = render(<ActivityPreviewList items={[]} />);
    expect(getByText("home.noRecentActivity")).toBeTruthy();
  });

  it("calls seeAllAction when the See All button is pressed", () => {
    const onSeeAll = jest.fn();
    const { getByText } = render(
      <ActivityPreviewList items={[makeItem("1")]} seeAllAction={onSeeAll} />,
    );

    fireEvent.press(getByText("home.seeAll"));
    expect(onSeeAll).toHaveBeenCalledTimes(1);
  });
});
