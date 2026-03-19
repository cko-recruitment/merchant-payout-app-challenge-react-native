import { registerWebModule, NativeModule } from 'expo';

import { ScreenSecurityModuleEvents } from './ScreenSecurity.types';

class ScreenSecurityModule extends NativeModule<ScreenSecurityModuleEvents> {
  getDeviceId(): string {
    return 'web-device';
  }

  async isBiometricAuthenticated(): Promise<boolean> {
    // Web does not support biometric authentication — always resolve true.
    return true;
  }
}

export default registerWebModule(ScreenSecurityModule, 'ScreenSecurity');
