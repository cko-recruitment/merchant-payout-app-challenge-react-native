import { renderHook, act } from "@testing-library/react-native";
import { useCoordinator, AppRoute } from "../useCoordinator";

const mockPush = jest.fn();
const mockDismiss = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    dismiss: mockDismiss,
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useCoordinator", () => {
  it('navigates to "/" when route is Home', () => {
    const { result } = renderHook(() => useCoordinator());
    act(() => {
      result.current.navigateTo(AppRoute.Home);
    });
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it('navigates to "/modal" when route is TransactionHistoryModal', () => {
    const { result } = renderHook(() => useCoordinator());
    act(() => {
      result.current.navigateTo(AppRoute.TransactionHistoryModal);
    });
    expect(mockPush).toHaveBeenCalledWith("/modal");
  });

  it("calls router.dismiss when route is Cancel", () => {
    const { result } = renderHook(() => useCoordinator());
    act(() => {
      result.current.navigateTo(AppRoute.Cancel);
    });
    expect(mockDismiss).toHaveBeenCalled();
  });

  it("warns and does not navigate for unknown route", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { result } = renderHook(() => useCoordinator());
    act(() => {
      result.current.navigateTo("Unknown" as AppRoute);
    });
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockDismiss).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith("Unknown route: Unknown");
    warnSpy.mockRestore();
  });
});
