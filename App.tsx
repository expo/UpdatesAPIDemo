import App from "./app/app"
import React from "react"
import * as SplashScreen from "expo-splash-screen"
import { Observe, ObserveRoot } from "expo-observe"

Observe.configure({ dispatchInDebug: true })

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

export default ObserveRoot.wrap(IgniteApp)
