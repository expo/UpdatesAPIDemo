import { requireNativeModule } from "expo"
import { ExpoUpdatesManifest } from "expo/config"
import { useCallback, useEffect, useState } from "react"

let interfaceDemoModule: any | undefined

try {
  interfaceDemoModule = requireNativeModule("InterfaceDemo")
  interfaceDemoModule.addListener(
    "InterfaceDemo.updatesInterfaceStateChangeEvent",
    handleNativeStateChangeEvent,
  )
} catch {
  throw new Error("Demo module not found")
}

export type NativeInterfaceStateEvent = {
  runtimeVersion: string
  embeddedUpdateId: string
  launchedUpdateId: string
  launchAssetPath: string
  lastDownloadTime: number | null
  type?: string | null
  manifest?: ExpoUpdatesManifest | null
}

const _stateChangeListeners = new Set<(event: any) => void>()

// Reemits native state change events
function handleNativeStateChangeEvent(params: any) {
  const newParams = typeof params === "string" ? JSON.parse(params) : { ...params }

  _stateChangeListeners.forEach((listener) => listener(newParams))
}

export function useLastNativeInterfaceStateChange() {
  if (!interfaceDemoModule) {
    return {
      runtimeVersion: "unavailable",
      embeddedUpdateId: "unavailable",
      launchedUpdateId: "unavailable",
      launchAssetPath: "unavailable",
      lastDownloadTime: null,
      type: "unavailable",
      manifest: null,
    }
  }
  const runtimeVersion = getRuntimeVersion()
  const embeddedUpdateId = getEmbeddedUpdateId()
  const [state, setState] = useState<NativeInterfaceStateEvent>({
    type: null,
    manifest: null,
    runtimeVersion,
    embeddedUpdateId,
    launchedUpdateId: getLaunchedUpdateId(),
    launchAssetPath: getLaunchAssetPath(),
    lastDownloadTime: null,
  })
  const listener = useCallback((event: any) => {
    setState({
      type: event.type,
      manifest: event.manifest,
      runtimeVersion,
      embeddedUpdateId,
      launchedUpdateId: getLaunchedUpdateId(),
      launchAssetPath: getLaunchAssetPath(),
      lastDownloadTime: event?.lastDownloadTime ?? null,
    })
  }, [])
  useEffect(() => {
    _stateChangeListeners.add(listener)
    return () => {
      _stateChangeListeners.delete(listener)
    }
  }, [listener])
  return state
}

export function getRuntimeVersion() {
  return interfaceDemoModule?.getRuntimeVersion() ?? "unavailable"
}

export function getEmbeddedUpdateId() {
  return interfaceDemoModule?.getEmbeddedUpdateId() ?? "unavailable"
}

export function getLaunchedUpdateId() {
  return interfaceDemoModule?.getLaunchedUpdateId() ?? "unavailable"
}

export function getLaunchAssetPath() {
  return interfaceDemoModule?.getLaunchAssetPath() ?? "unavailable"
}
