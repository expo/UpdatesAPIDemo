import App from "./app/app"
import React from "react"
import * as SplashScreen from "expo-splash-screen"

// SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  // return <App hideSplashScreen={SplashScreen.hideAsync} />
  return <App hideSplashScreen={async () => {}} />
}

export default IgniteApp
