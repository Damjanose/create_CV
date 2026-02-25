# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# ---- React Native / Hermes ----
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# ---- react-native-reanimated ----
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# ---- react-native-gesture-handler ----
-keep class com.swmansion.gesturehandler.** { *; }

# ---- react-native-screens ----
-keep class com.swmansion.rnscreens.** { *; }

# ---- react-native-webview ----
-keep class com.reactnativecommunity.webview.** { *; }

# ---- react-native-svg (if used in templates) ----
-keep public class com.horcrux.svg.** { *; }

# ---- OkHttp / Okio (networking) ----
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# ---- Keep annotations ----
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keepattributes Signature
-keepattributes Exceptions
