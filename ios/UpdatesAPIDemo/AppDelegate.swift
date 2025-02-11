import ExpoModulesCore
import EXUpdates
import React
import UIKit

@UIApplicationMain
class AppDelegate: EXAppDelegateWrapper, UNUserNotificationCenterDelegate {
  var launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  // AppDelegate keeps a nullable reference to the updates controller
  var updatesController: (any InternalAppControllerInterface)?

  override func bundleURL() -> URL? {
    if let jsBundle = updatesController?.launchAssetUrl() {
      return jsBundle
    }
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  }

  static func shared() -> AppDelegate {
    guard let delegate = UIApplication.shared.delegate as? AppDelegate else {
      fatalError("Could not get app delegate")
    }
    return delegate
  }

  /**
   Application launch initializes the custom view controller: all React Native
   and updates initialization is handled there
   */
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    self.launchOptions = launchOptions
    self.moduleName = "main"
    self.initialProps = [:]
    self.rootViewFactory = createRCTRootViewFactory()

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
