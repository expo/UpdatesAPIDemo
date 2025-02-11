import ExpoModulesCore
import EXUpdates
import React
import UIKit

@UIApplicationMain
class AppDelegate: EXAppDelegateWrapper, UNUserNotificationCenterDelegate, AppControllerDelegate {
  var launchOptions: [UIApplication.LaunchOptionsKey: Any]?
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
   Application launch starts the expo-updates system, and view initialization
   is deferred to the expo-updates completion handler (onSuccess())
   */
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    self.launchOptions = launchOptions
    self.moduleName = "main"
    self.initialProps = [:]

    AppController.initializeWithoutStarting()
    self.updatesController = AppController.sharedInstance
    self.updatesController?.delegate = self
    self.updatesController?.start()
    return true
  }

  /**
   expo-updates completion handler initializes the custom view controller with
   a RCTRootView with the correct bundleURL
   */
  func appController(
    _ appController: AppControllerInterface,
    didStartWithSuccess success: Bool
  ) {
    self.window = UIWindow(frame: UIScreen.main.bounds)
    self.rootViewFactory = createRCTRootViewFactory()
    let rootView = rootViewFactory.view(withModuleName: "main", initialProperties: self.initialProps, launchOptions: launchOptions)
    let controller = CustomViewController()
    controller.view.clipsToBounds = true
    controller.view.addSubview(rootView)
    rootView.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      rootView.topAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.topAnchor),
      rootView.bottomAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.bottomAnchor),
      rootView.leadingAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.leadingAnchor),
      rootView.trailingAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.trailingAnchor)
    ])
    self.window.rootViewController = controller
    window.makeKeyAndVisible()
  }

  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    return super.application(app, open: url, options: options) ||
      RCTLinkingManager.application(app, open: url, options: options)
  }
}
