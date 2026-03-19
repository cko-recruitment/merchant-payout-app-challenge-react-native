import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { RecentActivity } from "../recent-activity";

jest.mock("@/coordinator/useCoordinator", () => ({
  useCoordinator: () => ({ navigateTo: mockNavigateTo }),
  AppRoute: { Cancel: "Cancel" },
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("@/features/recent-activity/hooks/useRecentActivity");

const mockNavigateTo = jest.fn();

import { useRecentActivity } from "@/features/recent-activity/hooks/useRecentActivity";
const mockUseRecentActivity = useRecentActivity as jest.MockedFunction<
  typeof useRecentActivity
>;

import type { ActivityItem } from "@/types/api";

const makeItem = (id: string): ActivityItem => ({
  id,
  type: "payout",
  amount: 5000,
  currency: "GBP",
  date: "2024-03-15",
  description: `Payment ${id}`,
  status: "completed",
});

describe("RecentActivity", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows the loading indicator while transactions are fetching", () => {
    mockUseRecentActivity.mockReturnValue({
      items: [],
      loading: true,
      loadingMore: false,
      hasMore: false,
      error: null,
      fetchMore: jest.fn(),
    });

    const { getByLabelText } = render(<RecentActivity />);
    expect(getByLabelText("loading")).toBeTruthy();
  });

  it("shows the error view when the activity fetch fails", () => {
    mockUseRecentActivity.mockReturnValue({
      items: [],
      loading: false,
      loadingMore: false,
      hasMore: false,
      error: "Failed to load",
      fetchMore: jest.fn(),
    });

    const { getByLabelText } = render(<RecentActivity />);
    expect(
      getByLabelText("Error. Failed to load recent activity"),
    ).toBeTruthy();
  });

  it("renders transaction items when data loads successfully", () => {
    mockUseRecentActivity.mockReturnValue({
      items: [makeItem("1"), makeItem("2")],
      loading: false,
      loadingMore: false,
      hasMore: false,
      error: null,
      fetchMore: jest.fn(),
    });

    const { getAllByRole } = render(<RecentActivity />);
    const rows = getAllByRole("text").filter((el) =>
      el.props.accessibilityLabel?.startsWith("Payment"),
    );
    expect(rows).toHaveLength(2);
  });

  it("calls the coordinator to cancel when the Done button is pressed", () => {
    mockUseRecentActivity.mockReturnValue({
      items: [],
      loading: false,
      loadingMore: false,
      hasMore: false,
      error: null,
      fetchMore: jest.fn(),
    });

    const { getByRole } = render(<RecentActivity />);
    fireEvent.press(getByRole("button", { name: "activity.done" }));
    expect(mockNavigateTo).toHaveBeenCalledTimes(1);
  });
});
