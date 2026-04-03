import ExpoModulesCore
import EXUpdatesInterface

let demoEventName = "InterfaceDemo.updatesInterfaceStateChangeEvent"

let MAX_CACHED_EVENTS = 100

public class InterfaceDemoModule: Module, UpdatesStateChangeListener {
  private var updatesController: (any UpdatesInterface)?
  private var hasListener: Bool = false
  private var subscription: UpdatesStateChangeSubscription?
  private var lastDownloadTime: Double?
  private var cachedEvents: [[String: Any]] = []

  public func updatesStateDidChange(_ event: [String : Any]) {
    if event["type"] as? String != "downloadProgress" {
      cachedEvents.append(event)
    }
    if cachedEvents.count > MAX_CACHED_EVENTS {
      cachedEvents.removeFirst()
    }
    updateLastDownloadTimeIfNeeded()
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

    OnStartObserving(demoEventName) {
      if let controller = UpdatesControllerRegistry.sharedInstance.controller {
        updatesController = controller
        cachedEvents = []
        subscription = controller.subscribeToUpdatesStateChanges(self)
        updateLastDownloadTimeIfNeeded()
        self.hasListener = true
      }
    }

    OnStopObserving(demoEventName) {
      subscription?.remove()
      hasListener = false
      updatesController = nil
      subscription = nil
      cachedEvents = []
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

    Function("getLastDownloadTime") {
      return lastDownloadTime
    }
  }

  private func updateLastDownloadTimeIfNeeded() {
    if let subscription = subscription,
      let context = subscription.getContext() as? UpdatesNativeInterfaceStateContext,
      let startTime = context.downloadStartTime,
      let finishTime = context.downloadFinishTime {
      lastDownloadTime = finishTime.timeIntervalSince(startTime)
    }
  }
}
