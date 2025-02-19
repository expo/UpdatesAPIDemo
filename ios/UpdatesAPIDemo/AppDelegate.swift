import ExpoModulesCore
import EXUpdates
import React
import UIKit

@UIApplicationMain
class AppDelegate: EXAppDelegateWrapper, UNUserNotificationCenterDelegate {
  var launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  // AppDelegate keeps a nullable reference to the updates controller
  var updatesController: (any InternalAppControllerInterface)?
  let packagerUrl = URL(string:  "http://localhost:8081/index.bundle?platform=ios&dev=true")
  let bundledUrl = Bundle.main.url(forResource: "main", withExtension: "jsbundle")

  static func shared() -> AppDelegate {
    guard let delegate = UIApplication.shared.delegate as? AppDelegate else {
      fatalError("Could not get app delegate")
    }
    return delegate
  }

  override func bundleURL() -> URL? {
    if AppDelegate.isRunningWithPackager() {
      return packagerUrl
    }
    if let jsBundle = updatesController?.launchAssetUrl() {
      return jsBundle
    }
    return bundledUrl
  }

  // If this is a debug build, and native debugging not enabled,
  // then this returns true.
  public static func isRunningWithPackager() -> Bool {
    return EXAppDefines.APP_DEBUG && !UpdatesUtils.isNativeDebuggingEnabled()
  }

  // Required initialization of react-native and expo-updates
  private func initializeReactNativeAndUpdates(_ launchOptions: [UIApplication.LaunchOptionsKey: Any]?) {
    self.launchOptions = launchOptions
    self.moduleName = "main"
    self.initialProps = [:]
    // Call the superclass method to create the root view factory,
    // needed to initialize the React Native root view later
    self.rootViewFactory = createRCTRootViewFactory()
    // AppController instance must always be created first.
    // expo-updates creates a different type of controller
    // depending on whether updates is enabled, and whether
    // we are running in development mode or not.
    AppController.initializeWithoutStarting()  }

  /**
   Application launch initializes the custom view controller: all React Native
   and updates initialization is handled there
   */
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    initializeReactNativeAndUpdates(launchOptions)

    // Create custom view controller, where the React Native view will be created
    self.window = UIWindow(frame: UIScreen.main.bounds)
    let controller = CustomViewController()
    controller.view.clipsToBounds = true
    self.window.rootViewController = controller
    window.makeKeyAndVisible()

    return true
  }

  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    return super.application(app, open: url, options: options) ||
      RCTLinkingManager.application(app, open: url, options: options)
  }
}
