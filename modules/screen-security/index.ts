import { EventSubscription } from 'expo-modules-core';
import ScreenSecurityModule from './src/ScreenSecurityModule';

export function getDeviceId(): Promise<string> {
  return ScreenSecurityModule.getDeviceId();
}

export function isBiometricAuthenticated(): Promise<boolean> {
  return ScreenSecurityModule.isBiometricAuthenticated();
}

export function addScreenshotListener(listener: () => void): EventSubscription {
  return ScreenSecurityModule.addListener('onScreenshotTaken', listener);
}
