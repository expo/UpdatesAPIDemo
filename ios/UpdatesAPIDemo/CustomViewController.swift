import UIKit
import EXUpdates
import ExpoModulesCore

/**
 Custom view controller that handles React Native and expo-updates initialization
 */
public class CustomViewController: UIViewController, AppControllerDelegate {
  let appDelegate = AppDelegate.shared()

  /**
   If updates is enabled, the initializer starts the expo-updates system,
   and view initialization is deferred to the expo-updates completion handler (onSuccess())
   */
  public convenience init() {
    self.init(nibName: nil, bundle: nil)
    self.view.backgroundColor = .clear
    if AppDelegate.isRunningWithPackager() {
      // No expo-updates, just create the view
      createView()
    } else {
      // Set the updatesController property in AppDelegate so its bundleURL() method
      // works as expected
      appDelegate.updatesController = AppController.sharedInstance
      AppController.sharedInstance.delegate = self
      AppController.sharedInstance.start()
    }
  }

  required public override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
    super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
  }

  @available(*, unavailable)
  required public init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  /**
   expo-updates completion handler creates the root view and adds it to the controller's view
   */
  public func appController(
    _ appController: AppControllerInterface,
    didStartWithSuccess success: Bool
  ) {
    createView()
  }

  private func createView() {
    let rootView = appDelegate.rootViewFactory.view(
      withModuleName: "main",
      initialProperties: appDelegate.initialProps,
      launchOptions: appDelegate.launchOptions
    )
    self.view.addSubview(rootView)
    let controller = self
    controller.view.clipsToBounds = true
    controller.view.addSubview(rootView)
    rootView.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      rootView.topAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.topAnchor),
      rootView.bottomAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.bottomAnchor),
      rootView.leadingAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.leadingAnchor),
      rootView.trailingAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.trailingAnchor)
    ])
  }
}
