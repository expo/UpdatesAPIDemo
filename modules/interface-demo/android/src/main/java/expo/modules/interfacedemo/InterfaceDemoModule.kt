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

  override fun definition() = ModuleDefinition {
    Name("InterfaceDemo")

    Events<InterfaceDemoEvent>()

    OnCreate {
      UpdatesControllerRegistry.controller?.get()?.let {
        subscription = it.subscribeToUpdatesStateChanges(this@InterfaceDemoModule)
        updatesController = it
      }
    }

    OnStartObserving(InterfaceDemoEvent.StateChange) {
      hasListener = true
    }

    OnStopObserving(InterfaceDemoEvent.StateChange) {
      hasListener = false
    }

    OnDestroy {
      subscription?.remove()
      subscription = null
      updatesController = null
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
  }

  override fun updatesStateDidChange(event: Map<String, Any>) {
    if (hasListener) {
      val payload = Bundle()
      payload.putString("type", event["type"] as String)
      val manifest = event["manifest"] as? Map<*, *>
      if (manifest != null) {
        val manifestBundle = Bundle()
        manifestBundle.putString("id", manifest["id"] as String)
        payload.putBundle("manifest", manifestBundle)
      }
      sendEvent(InterfaceDemoEvent.StateChange, payload)
    }
  }
}

enum class InterfaceDemoEvent(val eventName: String) : Enumerable {
  StateChange("InterfaceDemo.updatesInterfaceStateChangeEvent")
}
