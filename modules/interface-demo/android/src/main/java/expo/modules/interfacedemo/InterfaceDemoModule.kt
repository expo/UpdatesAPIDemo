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
  private val cachedEvents: MutableList<Map<String, Any>> = mutableListOf()

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
    cachedEvents.add(event)
    if (cachedEvents.size > MAX_CACHED_EVENTS) {
      cachedEvents.removeAt(0)
    }
    updateLastDownloadTimeIfNeeded()
    if (hasListener) {
      sendEvent(InterfaceDemoEvent.StateChange, eventToBundle(event))
    }
  }

  private fun updateLastDownloadTimeIfNeeded() {
    val context = subscription?.getContext() as? UpdatesNativeInterfaceStateContext ?: return
    val startTime = context.downloadStartTime ?: return
    val finishTime = context.downloadFinishTime ?: return
    lastDownloadTime = (finishTime.time - startTime.time).toDouble() / 1000.0
  }

  private fun eventToBundle(event: Map<String, Any>): Bundle {
    val payload = Bundle()
    payload.putString("type", event["type"] as? String ?: "")

    val manifest = event["manifest"] as? Map<*, *>
    if (manifest != null) {
      val manifestBundle = Bundle()
      manifestBundle.putString("id", manifest["id"] as? String ?: "")
      payload.putBundle("manifest", manifestBundle)
    }

    val errorMessage = event["errorMessage"] as? String
    errorMessage?.let {
      payload.putString("errorMessage", it)
    }

    val progress = event["progress"] as? Double
    progress?.let {
      payload.putDouble("progress", it)
    }
    return payload
  }

  companion object {
    private const val MAX_CACHED_EVENTS = 100
  }
}

enum class InterfaceDemoEvent(val eventName: String) : Enumerable {
  StateChange("InterfaceDemo.updatesInterfaceStateChangeEvent")
}
