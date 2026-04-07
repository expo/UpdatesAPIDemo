package expo.modules.interfacedemo

import android.os.Bundle
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.types.Enumerable
import expo.modules.updatesinterface.*

class InterfaceDemoModule : Module(), UpdatesStateChangeListener {
  private var hasListener: Boolean = false
  private var updatesController: UpdatesInterface? = null
  private var subscription: UpdatesStateChangeSubscription? = null
  private var lastDownloadTime: Double? = null

  override fun definition() = ModuleDefinition {
    Name("InterfaceDemo")

    Events<InterfaceDemoEvent>()

    OnStartObserving(InterfaceDemoEvent.StateChange) {
      UpdatesControllerRegistry.controller?.get()?.let {
        updatesController = it
        subscription = it.subscribeToUpdatesStateChanges(this@InterfaceDemoModule)
        updateLastDownloadTimeIfNeeded()
        hasListener = true
      }
    }

    OnStopObserving(InterfaceDemoEvent.StateChange) {
      subscription?.remove()
      hasListener = false
      updatesController = null
      subscription = null
    }

    Function("getLaunchedUpdateId") {
      return@Function updatesController?.launchedUpdateId?.toString()
    }

    Function("getEmbeddedUpdateId") {
      return@Function updatesController?.embeddedUpdateId?.toString()
    }

    Function("getRuntimeVersion") {
      return@Function updatesController?.runtimeVersion
    }

    Function("getLaunchAssetPath") {
      return@Function updatesController?.launchAssetPath
    }

    Function("getLastDownloadTime") {
      return@Function lastDownloadTime
    }
  }

  override fun updatesStateDidChange(event: Map<String, Any>) {
    updateLastDownloadTimeIfNeeded()
    if (hasListener) {
      val demoEvent = InterfaceDemoEventData(type = event["type"] as? String ?: "")
      sendEvent(InterfaceDemoEvent.StateChange, demoEvent.toBundle())
    }
  }

  private fun updateLastDownloadTimeIfNeeded() {
    val context = subscription?.getContext() as? UpdatesNativeInterfaceStateContext ?: return
    val startTime = context.downloadStartTime ?: return
    val finishTime = context.downloadFinishTime ?: return
    lastDownloadTime = (finishTime.time - startTime.time).toDouble() / 1000.0
  }
}

data class InterfaceDemoEventData(val type: String) {
  val timestamp: Long = System.currentTimeMillis()

  fun toBundle(): Bundle {
    return Bundle().apply {
      putString("type", type)
      putLong("timestamp", timestamp)
    }
  }
}

enum class InterfaceDemoEvent(val eventName: String) : Enumerable {
  StateChange("InterfaceDemo.updatesInterfaceStateChangeEvent")
}
