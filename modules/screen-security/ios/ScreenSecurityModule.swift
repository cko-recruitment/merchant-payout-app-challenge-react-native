import ExpoModulesCore
import UIKit
import LocalAuthentication

public class ScreenSecurityModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ScreenSecurity")

    Events("onScreenshotTaken")

    AsyncFunction("getDeviceId") { () -> String in
      return UIDevice.current.identifierForVendor?.uuidString ?? UUID().uuidString
    }

    AsyncFunction("isBiometricAuthenticated") { (promise: Promise) in
      let context = LAContext()
      var error: NSError?

      guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
        promise.reject("BIOMETRIC_UNAVAILABLE", "Biometrics are not set up on this device.")
        return
      }

      context.evaluatePolicy(
        .deviceOwnerAuthenticationWithBiometrics,
        localizedReason: "Authenticate to confirm payout"
      ) { success, authError in
        if success {
          promise.resolve(true)
        } else {
          promise.resolve(false)
        }
      }
    }

    OnStartObserving {
      NotificationCenter.default.addObserver(
        forName: UIApplication.userDidTakeScreenshotNotification,
        object: nil,
        queue: .main
      ) { [weak self] _ in
        self?.sendEvent("onScreenshotTaken")
      }
    }

    OnStopObserving {
      NotificationCenter.default.removeObserver(
        self,
        name: UIApplication.userDidTakeScreenshotNotification,
        object: nil
      )
    }
  }
}