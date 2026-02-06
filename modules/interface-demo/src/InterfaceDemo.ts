import { requireNativeModule } from "expo"
import { ExpoUpdatesManifest } from "expo/config"
import { useCallback, useEffect, useState } from "react"

let interfaceDemoModule: any | undefined

try {
  interfaceDemoModule = requireNativeModule("InterfaceDemo")
  interfaceDemoModule.addListener(
    "InterfaceDemo.updatesInterfaceStateChangeEvent",
    handleStateChangeEvent,
  )
} catch {
  console.log("Demo module not found")
}

export type DemoState = {
  runtimeVersion: string
  embeddedUpdateId: string
  launchedUpdateId: string
  type?: string | null
  manifest?: ExpoUpdatesManifest | null
}

const _stateChangeListeners = new Set<(event: any) => void>()

// Reemits native state change events
function handleStateChangeEvent(params: any) {
  const newParams = typeof params === "string" ? JSON.parse(params) : { ...params }

  _stateChangeListeners.forEach((listener) => listener(newParams))
}

export function useDemoState() {
  if (!interfaceDemoModule) {
    return {
      runtimeVersion: "unavailable",
      embeddedUpdateId: "unavailable",
      launchedUpdateId: "unavailable",
      type: "unavailable",
      manifest: null,
    }
  }
  const runtimeVersion = interfaceDemoModule.getRuntimeVersion()
  const embeddedUpdateId = interfaceDemoModule.getEmbeddedUpdateId()
  const launchedUpdateId = interfaceDemoModule.getLaunchedUpdateId()
  const [state, setState] = useState<DemoState>({
    type: null,
    manifest: null,
    runtimeVersion,
    embeddedUpdateId,
    launchedUpdateId,
  })
  const listener = useCallback((event: any) => {
    setState({
      type: event.type,
      manifest: event.manifest,
      runtimeVersion,
      embeddedUpdateId,
      launchedUpdateId,
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
