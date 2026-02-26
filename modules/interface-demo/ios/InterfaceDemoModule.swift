import ExpoModulesCore
import EXUpdatesInterface

let demoEventName = "InterfaceDemo.updatesInterfaceStateChangeEvent"

public class InterfaceDemoModule: Module, UpdatesStateChangeListener {
  private var updatesController: (any UpdatesInterface)?
  private var hasListener: Bool = false
  private var subscription: UpdatesStateChangeSubscription?
  private var lastDownloadTime: Float?
  private var startDate: Date?

  public func updatesStateDidChange(_ event: [String : Any]) {
    if event["type"] as? String == "download" {
      startDate = Date(timeIntervalSinceNow: 0)
    }
    if startDate != nil && event["type"] as? String == "downloadCompleteWithUpdate" {
      let stopDate = Date(timeIntervalSinceNow: 0)
      lastDownloadTime = Float(stopDate.timeIntervalSince(startDate ?? Date()))
      startDate = nil
    }
    if (hasListener) {
      var mutatedEvent: [String: Any] = event
      if let lastDownloadTime = lastDownloadTime {
        mutatedEvent["lastDownloadTime"] = lastDownloadTime
      }
      sendEvent(demoEventName, mutatedEvent)
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
