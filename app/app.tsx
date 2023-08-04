/* eslint-disable import/first */
/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import "./i18n"
import "./utils/ignoreWarnings"
import { useFonts } from "expo-font"
import React, { useEffect } from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import { UpdatesApiDemoScreen } from "./screens"
import { customFontsToLoad } from "./theme"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ViewStyle } from "react-native"

interface AppProps {
  hideSplashScreen: () => Promise<boolean>
}

/**
 * This is the root component of our app.
 */
function App(props: AppProps) {
  const { hideSplashScreen } = props

  const [areFontsLoaded, error] = useFonts(customFontsToLoad)

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.

  useEffect(() => {
    if (areFontsLoaded || error) {
      setTimeout(hideSplashScreen, 500)
    }
  }, [areFontsLoaded, error])

  if (!areFontsLoaded && !error) return null

  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={$container}>
        <UpdatesApiDemoScreen />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

export default App

const $container: ViewStyle = {
  flex: 1,
}
