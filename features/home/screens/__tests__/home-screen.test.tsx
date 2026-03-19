import React from "react";
import { render } from "@testing-library/react-native";
import { HomeScreen } from "../home-screen";

jest.mock("@/hooks/use-merchant-data");
jest.mock("@/coordinator/useCoordinator", () => ({
  useCoordinator: () => ({ navigateTo: jest.fn() }),
  AppRoute: { TransactionHistoryModal: "TransactionModal" },
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

import { useMerchantData } from "@/hooks/use-merchant-data";
const mockUseMerchantData = useMerchantData as jest.MockedFunction<
  typeof useMerchantData
>;

const mockData = {
  available_balance: 500000,
  pending_balance: 25000,
  currency: "GBP" as const,
  activity: [],
};

describe("HomeScreen", () => {
  it("shows the loading indicator while data is being fetched", () => {
    mockUseMerchantData.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    // ActivityIndicator has accessibilityLabel="loading" (the translated key)
    const { getByLabelText } = render(<HomeScreen />);
    expect(getByLabelText("loading")).toBeTruthy();
  });

  it("shows the error view when the merchant fetch fails", () => {
    mockUseMerchantData.mockReturnValue({
      data: null,
      loading: false,
      error: "Network error",
      refetch: jest.fn(),
    });

    // ErrorView card has accessible={true} and a compound label
    const { getByLabelText } = render(<HomeScreen />);
    expect(getByLabelText("error.title. error.message")).toBeTruthy();
  });

  it("renders the balance card when data loads successfully", () => {
    mockUseMerchantData.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    const { getByRole } = render(<HomeScreen />);
    // BalanceCard has accessibilityRole="summary"
    expect(getByRole("summary")).toBeTruthy();
  });
});
