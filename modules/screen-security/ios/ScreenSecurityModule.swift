import ExpoModulesCore
import LocalAuthentication
import UIKit

public class ScreenSecurityModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ScreenSecurity")

    Events("onScreenshotTaken")

    Function("getDeviceId") { () -> String in
      return UIDevice.current.identifierForVendor?.uuidString ?? "unknown"
    }

    AsyncFunction("isBiometricAuthenticated") { (promise: Promise) in
      let context = LAContext()
      var error: NSError?

      if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
        let reason = "Authenticate to approve this payout."
        context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, authenticationError in
          if success {
            promise.resolve(true)
          } else {
            promise.reject("AUTH_FAILED", authenticationError?.localizedDescription ?? "Authentication failed")
          }
        }
      } else {
        promise.reject("BIOMETRICS_UNAVAILABLE", error?.localizedDescription ?? "Biometrics not available on this device")
      }
    }

    OnCreate {
      NotificationCenter.default.addObserver(
        self,
        selector: #selector(self.handleScreenshot),
        name: UIApplication.userDidTakeScreenshotNotification,
        object: nil
      )
    }

    OnDestroy {
      NotificationCenter.default.removeObserver(self)
    }
  }

  @objc
  func handleScreenshot() {
    sendEvent("onScreenshotTaken")
  }
}
