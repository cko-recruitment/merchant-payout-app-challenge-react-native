import { NativeModule, requireNativeModule } from 'expo';
import { ScreenSecurityModuleEvents } from './ScreenSecurity.types';

declare class ScreenSecurityModule extends NativeModule<ScreenSecurityModuleEvents> {
  getDeviceId: () => Promise<string>;
  isBiometricAuthenticated: () => Promise<boolean>;
}

export default requireNativeModule<ScreenSecurityModule>('ScreenSecurity');
