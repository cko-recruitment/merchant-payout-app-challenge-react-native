import { NativeModule, requireNativeModule } from "expo";

import { ScreenSecurityModuleEvents } from "./ScreenSecurity.types";

declare class ScreenSecurityModule extends NativeModule<ScreenSecurityModuleEvents> {
  getDeviceId(): string;
  isBiometricAuthenticated(): Promise<boolean>;
}

// This call loads the native module object from the JSI.
// Falls back to a no-op implementation when the native module is unavailable
// (e.g. Expo Go, simulators without the native build).
function resolveModule(): ScreenSecurityModule {
  try {
    return requireNativeModule<ScreenSecurityModule>("ScreenSecurity");
  } catch {
    console.warn(
      "[ScreenSecurity] Native module not found — using JS fallback.",
    );
    return {
      getDeviceId: () => "fallback-id",
      isBiometricAuthenticated: async () => false,
      addListener: () => ({ remove: () => {} }),
      removeListeners: () => {},
    } as unknown as ScreenSecurityModule;
  }
}

export default resolveModule();
