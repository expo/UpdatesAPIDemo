import ExpoModulesCore
import EXUpdatesInterface

let demoEventName = "InterfaceDemo.updatesInterfaceStateChangeEvent"

public class InterfaceDemoModule: Module, UpdatesStateChangeListener {
  private var updatesController: (any UpdatesInterface)?
  private var hasListener: Bool = false
  private var subscription: UpdatesStateChangeSubscription?
  private var lastDownloadTime: Double?

  public func updatesStateDidChange(_ event: [String : Any]) {
    updateLastDownloadTimeIfNeeded()
    if (hasListener) {
      sendEvent(demoEventName, InterfaceDemoEvent(type: event["type"] as? String ?? "").toMap)
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

struct InterfaceDemoEvent {
  let type: String
  let timestamp: Int

  init(type: String) {
    self.type = type
    self.timestamp = Int(Date.now.timeIntervalSince1970 * 1000)
  }

  var toMap: [String: Any] {
    return ["type": type, "timestamp": timestamp]
  }
}
