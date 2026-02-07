package expo.modules.interfacedemo

import android.os.Bundle
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.types.Enumerable
import expo.modules.updatesinterface.*
import java.net.URL

class InterfaceDemoModule : Module(), UpdatesStateChangeListener {
  private var hasListener: Boolean = false
  private var updatesController: UpdatesInterface? = null
  private var subscription: UpdatesStateChangeSubscription? = null

  override fun definition() = ModuleDefinition {
    Name("ExpoUpdatesE2ETest")

    Events<UpdatesE2EEvent>()

    OnCreate {
      UpdatesControllerRegistry.controller?.get()?.let {
        subscription = it.subscribeToUpdatesStateChanges(this@InterfaceDemoModule)
        updatesController = it
      }
    }

    OnStartObserving(UpdatesE2EEvent.StateChange) {
      hasListener = true
    }

    OnStopObserving(UpdatesE2EEvent.StateChange) {
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

    Function("getLaunchAssetUrl") {
      return@Function updatesController?.launchAssetURL
    }
  }

  override fun updatesStateDidChange(event: Map<String, Any>) {
    if (hasListener) {
      val payload = Bundle()
      payload.putString("type", event["type"] as String)
      val manifest = event["manifest"] as? Map<String, Any>
      if (manifest != null) {
        val manifestBundle = Bundle()
        manifestBundle.putString("id", manifest["id"] as String)
        payload.putBundle("manifest", manifestBundle)
      }
      sendEvent(UpdatesE2EEvent.StateChange, payload)
    }
  }
}

enum class UpdatesE2EEvent(val eventName: String) : Enumerable {
  StateChange("Expo.updatesE2EStateChangeEvent")
}
