package expo.modules.screensecurity

import android.app.Activity
import android.os.Build
import android.provider.Settings
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ScreenSecurityModule : Module() {
  private var screenCaptureCallback: Any? = null

  override fun definition() = ModuleDefinition {
    Name("ScreenSecurity")

    Events("onScreenshotTaken")

    AsyncFunction("getDeviceId") {
      val context = requireNotNull(appContext.reactContext) { "Context not available" }
      Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
    }

    AsyncFunction("isBiometricAuthenticated") { promise: Promise ->
      val activity = appContext.currentActivity as? FragmentActivity
        ?: run {
          promise.reject("ACTIVITY_UNAVAILABLE", "Activity not available", null)
          return@AsyncFunction
        }

      val biometricManager = BiometricManager.from(activity)
      val canAuthenticate = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)

      if (canAuthenticate != BiometricManager.BIOMETRIC_SUCCESS) {
        promise.reject("BIOMETRIC_UNAVAILABLE", "Biometrics are not set up on this device.", null)
        return@AsyncFunction
      }

      val executor = ContextCompat.getMainExecutor(activity)

      val callback = object : BiometricPrompt.AuthenticationCallback() {
        override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
          promise.resolve(true)
        }

        override fun onAuthenticationFailed() {
          promise.resolve(false)
        }

        override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
          promise.resolve(false)
        }
      }

      val prompt = BiometricPrompt(activity, executor, callback)
      val promptInfo = BiometricPrompt.PromptInfo.Builder()
        .setTitle("Confirm Payout")
        .setSubtitle("Authenticate to confirm payout")
        .setNegativeButtonText("Cancel")
        .build()

      activity.runOnUiThread {
        prompt.authenticate(promptInfo)
      }
    }

    OnStartObserving {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
        val activity = appContext.currentActivity ?: return@OnStartObserving
        val callback = Activity.ScreenCaptureCallback {
          sendEvent("onScreenshotTaken")
        }
        activity.registerScreenCaptureCallback(activity.mainExecutor, callback)
        screenCaptureCallback = callback
      }
    }

    OnStopObserving {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
        val activity = appContext.currentActivity ?: return@OnStopObserving
        val callback = screenCaptureCallback as? Activity.ScreenCaptureCallback ?: return@OnStopObserving
        activity.unregisterScreenCaptureCallback(callback)
        screenCaptureCallback = null
      }
    }
  }
}