import ExpoModulesCore
import EXUpdatesInterface

let demoEventName = "InterfaceDemo.updatesInterfaceStateChangeEvent"

public class InterfaceDemoModule: Module, UpdatesStateChangeListener {
  private var updatesController: (any UpdatesInterface)?
  private var hasListener: Bool = false
  private var subscription: UpdatesStateChangeSubscription?

  public func updatesStateDidChange(_ event: [String : Any]) {
    if (hasListener) {
      sendEvent(demoEventName, event)
    }
  }

  public required init(appContext: AppContext) {
    super.init(appContext: appContext)
  }

  public func definition() -> ModuleDefinition {
    Name("InterfaceDemo")

    Events([demoEventName])

    OnCreate {
      if let controller = UpdatesControllerRegistry.sharedInstance.controller {
        updatesController = controller
        subscription = controller.subscribeToUpdatesStateChanges(self)
      }
    }

    OnStartObserving(demoEventName) {
      hasListener = true
    }

    OnStopObserving(demoEventName) {
      hasListener = false
    }

    OnDestroy {
      subscription?.remove()
      updatesController = nil
      subscription = nil
    }

    Function("getLaunchedUpdateId") {
      return updatesController?.launchedUpdateId?.uuidString.lowercased()
    }

    Function("getEmbeddedUpdateId") {
      return updatesController?.embeddedUpdateId?.uuidString.lowercased()
    }

    Function("getRuntimeVersion") {
      return updatesController?.runtimeVersion
    }

    Function("getLaunchAssetPath") {
      return updatesController?.launchAssetPath
    }
  }
}
