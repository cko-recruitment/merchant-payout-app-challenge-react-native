import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PayoutsScreen } from "../payouts";

jest.mock("@/coordinator/useCoordinator", () => ({
  useCoordinator: () => ({ navigateTo: jest.fn() }),
  AppRoute: {},
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("@/features/payouts/hooks/use-payout");
// Screen-security is a native module unavailable in Jest
jest.mock("@/modules/screen-security", () => ({
  default: {
    addListener: () => ({ remove: jest.fn() }),
    isBiometricAuthenticated: jest.fn().mockResolvedValue(true),
  },
}));

import { usePayout } from "@/features/payouts/hooks/use-payout";
const mockUsePayout = usePayout as jest.MockedFunction<typeof usePayout>;

const defaultPayout = {
  isLoading: false,
  error: null,
  submitPayout: jest.fn(),
  reset: jest.fn(),
};

describe("PayoutsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePayout.mockReturnValue(defaultPayout);
  });

  it("disables the Send Money button when the form is empty", () => {
    const { getByRole } = render(<PayoutsScreen />);
    // isValid=false → accessibilityState.disabled=true
    expect(getByRole("button", { name: "payouts.sendMoney" })).toBeDisabled();
  });

  it("enables the Send Money button when a valid amount and IBAN are entered", () => {
    const { getByRole, UNSAFE_getByProps, getByTestId } = render(
      <PayoutsScreen />,
    );

    // Inputs sit inside importantForAccessibility="no-hide-descendants" wrappers;
    // UNSAFE_getByProps bypasses accessibility-tree filtering.
    fireEvent.changeText(UNSAFE_getByProps({ testID: "amount-input" }), "100");
    fireEvent.changeText(
      UNSAFE_getByProps({ testID: "iban-input" }),
      "GB29NWBK60161331926819",
    );

    expect(
      getByRole("button", { name: "payouts.sendMoney" }),
    ).not.toBeDisabled();
  });

  it("shows the confirmation modal after pressing Send Money with valid inputs", () => {
    const { getByRole, UNSAFE_getByProps, getByTestId } = render(
      <PayoutsScreen />,
    );

    fireEvent.changeText(UNSAFE_getByProps({ testID: "amount-input" }), "100");
    fireEvent.changeText(
      UNSAFE_getByProps({ testID: "iban-input" }),
      "GB29NWBK60161331926819",
    );
    fireEvent.press(getByRole("button", { name: "payouts.sendMoney" }));

    expect(getByTestId("modal-cancel")).toBeTruthy();
  });
});
