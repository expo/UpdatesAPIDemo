import { requireNativeModule } from "expo"
import { ExpoUpdatesManifest } from "expo/config"
import { useCallback, useEffect, useRef, useState } from "react"

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
export type NativeInterfaceState = {
  runtimeVersion: string
  embeddedUpdateId: string
  launchedUpdateId: string
  launchAssetPath: string
  lastDownloadTime: number | null
  recentEvents: NativeInterfaceStateEvent[]
}

export type NativeInterfaceStateEvent = {
  type?: string | null
  manifest?: ExpoUpdatesManifest | null
  timestamp: number
}

const _stateChangeListeners = new Set<(event: any) => void>()

// Reemits native state change events
function handleNativeStateChangeEvent(params: any) {
  const newParams = typeof params === "string" ? JSON.parse(params) : { ...params }

  _stateChangeListeners.forEach((listener) => listener(newParams))
}

export function useNativeInterfaceStateChanges(): NativeInterfaceState {
  if (!interfaceDemoModule) {
    return {
      runtimeVersion: "unavailable",
      embeddedUpdateId: "unavailable",
      launchedUpdateId: "unavailable",
      launchAssetPath: "unavailable",
      lastDownloadTime: null,
      recentEvents: [],
    }
  }
  const recentEvents = useRef<NativeInterfaceStateEvent[]>([])
  const runtimeVersion = getRuntimeVersion()
  const embeddedUpdateId = getEmbeddedUpdateId()
  const [state, setState] = useState<NativeInterfaceState>({
    runtimeVersion,
    embeddedUpdateId,
    launchedUpdateId: getLaunchedUpdateId(),
    launchAssetPath: getLaunchAssetPath(),
    lastDownloadTime: getLastDownloadTime(),
    recentEvents: recentEvents.current,
  })
  const listener = useCallback((event: any) => {
    console.log(`Interface demo event: ${JSON.stringify(event, null, 2)}`)
    if (event.type === "downloadProgress") {
      return
    }
    recentEvents.current.push({
      type: event.type,
      manifest: event.manifest,
      timestamp: event.timestamp,
    })
    recentEvents.current.sort((a, b) => {
      return a.timestamp < b.timestamp ? -1 : 1
    })
    if (recentEvents.current.length > 10) {
      recentEvents.current.shift()
    }
    const lastDownloadTime = getLastDownloadTime()
    if (lastDownloadTime !== null) {
      setState((currentState) => ({
        ...currentState,
        lastDownloadTime,
      }))
    }
    setState((currentState) => ({
      ...currentState,
      launchedUpdateId: getLaunchedUpdateId(),
      launchAssetPath: getLaunchAssetPath(),
      recentEvents: [...recentEvents.current],
    }))
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

export function getLastDownloadTime() {
  return interfaceDemoModule?.getLastDownloadTime()
}
