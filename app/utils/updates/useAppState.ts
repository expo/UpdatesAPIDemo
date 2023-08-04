import { useEffect, useRef } from "react"
import { AppState, AppStateStatus } from "react-native"

/**
 * Hook that returns app state, and takes a callback that is called on active state changes
 *
 * @param callback If defined, it will be called with the "activating" parameter = true when entering active state,
 * false when leaving active state
 *
 * @returns one of 'active', 'background', 'inactive', or 'unknown'
 */
export const useAppState: (callback?: (activating: boolean) => void) => AppStateStatus = (
  callback = undefined,
) => {
  const callbackRef = useRef<typeof callback>()
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const appState = useRef(AppState.currentState)

  useEffect(() => {
    const cb = (activating: boolean) => callbackRef.current && callbackRef.current(activating)

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // Foregrounding
      if (cb && appState.current !== "active" && nextAppState === "active") {
        const result = true
        cb(result)
      }
      // Backgrounding
      if (cb && appState.current === "active" && nextAppState !== "active") {
        const result = false
        cb(result)
      }
      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [callback])

  return appState.current
}
