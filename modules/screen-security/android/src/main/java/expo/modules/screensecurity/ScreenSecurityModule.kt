package expo.modules.screensecurity

import android.app.Activity
import android.database.ContentObserver
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import android.provider.Settings
import android.util.Log
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import java.util.concurrent.Executor

class ScreenSecurityModule : Module() {
  private var screenCaptureCallback: Any? = null
  private var screenshotObserver: ContentObserver? = null

  override fun definition() = ModuleDefinition {
    Name("ScreenSecurity")

    Events("onScreenshotTaken")

    Function("getDeviceId") {
      val context = appContext.reactContext
      if (context != null) {
        Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID) ?: "unknown"
      } else {
        "unknown"
      }
    }

    AsyncFunction("isBiometricAuthenticated") { promise: Promise ->
      val activity = appContext.currentActivity as? FragmentActivity
      if (activity == null) {
        promise.reject("ACTIVITY_UNAVAILABLE", "No foreground activity available")
        return@AsyncFunction
      }

      val biometricManager = BiometricManager.from(activity)
      when (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.BIOMETRIC_WEAK)) {
        BiometricManager.BIOMETRIC_SUCCESS -> {
          val executor: Executor = ContextCompat.getMainExecutor(activity)
          val biometricPrompt = BiometricPrompt(activity, executor,
            object : BiometricPrompt.AuthenticationCallback() {
              override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                super.onAuthenticationSucceeded(result)
                promise.resolve(true)
              }
              override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                super.onAuthenticationError(errorCode, errString)
                promise.reject("AUTH_FAILED", errString.toString())
              }
              override fun onAuthenticationFailed() {
                super.onAuthenticationFailed()
                promise.reject("AUTH_FAILED", "Authentication failed")
              }
            })

          val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Biometric Authentication")
            .setSubtitle("Authenticate to approve this payout")
            .setNegativeButtonText("Cancel")
            .build()
            
          activity.runOnUiThread {
            biometricPrompt.authenticate(promptInfo)
          }
        }
        else -> {
          promise.reject("BIOMETRICS_UNAVAILABLE", "Biometrics not available on this device")
        }
      }
    }

    OnActivityEntersForeground {
      val activity = appContext.currentActivity
      Log.d("ScreenSecurity", "OnActivityEntersForeground — SDK: ${Build.VERSION.SDK_INT}, activity: $activity")

      if (Build.VERSION.SDK_INT >= 34 && activity != null) {
        // Android 14+: Use the official ScreenCaptureCallback API
        if (screenCaptureCallback == null) {
          val callback = Activity.ScreenCaptureCallback {
            Log.d("ScreenSecurity", "ScreenCaptureCallback fired — sending onScreenshotTaken event")
            activity.runOnUiThread { sendEvent("onScreenshotTaken") }
          }
          screenCaptureCallback = callback
          activity.registerScreenCaptureCallback(activity.mainExecutor, callback)
          Log.d("ScreenSecurity", "ScreenCaptureCallback registered successfully")
        }
      } else {
        // Android 10–13: Watch MediaStore for new screenshot images
        Log.d("ScreenSecurity", "Using ContentObserver fallback for SDK ${Build.VERSION.SDK_INT}")
        val context = appContext.reactContext ?: return@OnActivityEntersForeground
        if (screenshotObserver == null) {
          screenshotObserver = object : ContentObserver(Handler(Looper.getMainLooper())) {
            // Deduplicate: track last URI to avoid double-firing
            private var lastUri: String? = null

            override fun onChange(selfChange: Boolean, uri: Uri?) {
              uri ?: return
              val uriStr = uri.toString()
              Log.d("ScreenSecurity", "ContentObserver.onChange fired — uri: $uriStr")

              // Debounce duplicate events for same URI
              if (uriStr == lastUri) return
              lastUri = uriStr

              // Small delay: file may not be fully written on first onChange
              Handler(Looper.getMainLooper()).postDelayed({
                try {
                  val projection = arrayOf(
                    MediaStore.Images.Media.DISPLAY_NAME,
                    MediaStore.Images.Media.RELATIVE_PATH
                  )
                  val cursor = context.contentResolver.query(uri, projection, null, null, null)
                  if (cursor == null) {
                    Log.w("ScreenSecurity", "cursor is null — likely missing READ permission or media not ready")
                    // Fallback: treat any new image as screenshot if we can't read metadata
                    sendEvent("onScreenshotTaken")
                    return@postDelayed
                  }
                  cursor.use {
                    if (it.moveToFirst()) {
                      val name = it.getString(it.getColumnIndexOrThrow(MediaStore.Images.Media.DISPLAY_NAME)) ?: ""
                      val relativePath = it.getString(it.getColumnIndexOrThrow(MediaStore.Images.Media.RELATIVE_PATH)) ?: ""
                      Log.d("ScreenSecurity", "Media added — name: $name, path: $relativePath")
                      val isScreenshot = name.contains("screenshot", ignoreCase = true) ||
                        relativePath.contains("screenshot", ignoreCase = true) ||
                        relativePath.contains("Screenshots", ignoreCase = true)
                      if (isScreenshot) {
                        Log.d("ScreenSecurity", "Screenshot detected! Sending event.")
                        sendEvent("onScreenshotTaken")
                      }
                    } else {
                      // 0 rows: file committed to MediaStore but metadata not yet readable.
                      // A new image was added while user is on Payouts screen — treat as screenshot.
                      Log.w("ScreenSecurity", "cursor returned 0 rows — firing event as precaution")
                      sendEvent("onScreenshotTaken")
                    }
                  }
                } catch (e: Exception) {
                  Log.e("ScreenSecurity", "Error querying MediaStore: ${e.message}")
                }
              }, 300)
            }
          }
          context.contentResolver.registerContentObserver(
            MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
            true,
            screenshotObserver!!
          )
          Log.d("ScreenSecurity", "ContentObserver registered successfully")
        }
      }
    }

    OnActivityEntersBackground {
      val activity = appContext.currentActivity
      if (Build.VERSION.SDK_INT >= 34 && activity != null && screenCaptureCallback != null) {
        activity.unregisterScreenCaptureCallback(screenCaptureCallback as Activity.ScreenCaptureCallback)
        screenCaptureCallback = null
        Log.d("ScreenSecurity", "ScreenCaptureCallback unregistered")
      }
      screenshotObserver?.let {
        appContext.reactContext?.contentResolver?.unregisterContentObserver(it)
        screenshotObserver = null
        Log.d("ScreenSecurity", "ContentObserver unregistered")
      }
    }
  }
}
