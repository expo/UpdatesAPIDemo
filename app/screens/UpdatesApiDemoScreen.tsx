import { useUpdates } from "expo-updates"
import { lightTheme } from "@expo/styleguide-base"
import React, { useState } from "react"
import { ActivityIndicator, TextStyle, View, ViewStyle } from "react-native"

import { ExpoAssets, ExpoDemoCard, Screen, Text, UpdateMonitor } from "../components"
import { spacing } from "../theme"
import { DocsLogo } from "../svg"
import {
  currentlyRunningTitle,
  currentlyRunningDescription,
  usePersistentDate,
} from "../utils/updates"
import { CheckInterval, checkIntervalFromSettings, useSettings } from "../utils/useSettings"

const expoVariant = "default"

export function UpdatesApiDemoScreen() {
  const { currentlyRunning, isChecking, isDownloading, lastCheckForUpdateTimeSinceRestart } =
    useUpdates()

  const [showSettings, setShowSettings] = useState(false)

  const { settings, changeSettings } = useSettings()

  const setMonitorAlwaysVisible = (value: boolean) => {
    settings.monitorAlwaysVisible = value
    changeSettings(settings)
  }

  const setAutoLaunchCritical = (value: boolean) => {
    settings.autoLaunchCritical = value
    changeSettings(settings)
  }

  const setCheckOnForeground = (value: boolean) => {
    settings.checkOnForeground = value
    changeSettings(settings)
  }

  const setUpdateCheckInterval = (value: CheckInterval) => {
    settings.checkInterval = value
    changeSettings(settings)
  }

  const lastCheckForUpdateTime = usePersistentDate(lastCheckForUpdateTimeSinceRestart)

  const monitorBooleanSettings = showSettings
    ? [
        {
          label: "Monitor always visible",
          value: settings.monitorAlwaysVisible,
          onChange: setMonitorAlwaysVisible,
        },
        {
          label: "Auto launch critical updates",
          value: settings.autoLaunchCritical,
          onChange: setAutoLaunchCritical,
        },
        {
          label: "Check when app foregrounds",
          value: settings.checkOnForeground,
          onChange: setCheckOnForeground,
        },
      ]
    : []

  const monitorChoiceSettings = showSettings
    ? [
        {
          value: settings.checkInterval,
          onChange: setUpdateCheckInterval,
          choices: [
            {
              label: "Check every hour",
              value: CheckInterval.LONG,
            },
            {
              label: "Check every 10 seconds",
              value: CheckInterval.SHORT,
            },
          ],
        },
      ]
    : []

  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["bottom", "top"]}>
      <View style={$topHeading}>
        <DocsLogo width={30} height={30} color={lightTheme.icon[expoVariant]} style={$logo} />
        <Text
          testID="welcome-heading"
          style={$topHeadingText}
          text="Updates API Demo"
          preset="subheading"
        />
      </View>
      <ExpoDemoCard
        variant={expoVariant}
        title={currentlyRunningTitle(currentlyRunning)}
        description={currentlyRunningDescription(currentlyRunning, lastCheckForUpdateTime)}
        actions={[
          {
            label: showSettings ? "Hide monitor options" : "Show monitor options",
            onPress: () => setShowSettings(!showSettings),
          },
        ]}
        booleanSettings={monitorBooleanSettings}
        choiceSettings={monitorChoiceSettings}
      />
      <ExpoAssets />
      <View style={$spacer} />
      <UpdateMonitor
        alwaysVisible={settings.monitorAlwaysVisible}
        autoLaunchCritical={settings.autoLaunchCritical}
        checkOnForeground={settings.checkOnForeground}
        updateCheckInterval={checkIntervalFromSettings(settings)}
        buttonsAlwaysVisible={__DEV__}
      />
      {isChecking || isDownloading ? (
        <ActivityIndicator
          style={$activityIndicator}
          size="large"
          color={lightTheme.icon[expoVariant]}
        />
      ) : null}
    </Screen>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: lightTheme.background[expoVariant],
  justifyContent: "flex-start",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
}

const $topHeading: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignContent: "center",
  padding: 5,
}

const $logo: ViewStyle = {
  margin: 5,
}

const $topHeadingText: TextStyle = {
  marginBottom: spacing.md,
  color: lightTheme.text[expoVariant],
}

const $spacer: ViewStyle = {
  flex: 1,
}

const $activityIndicator: ViewStyle = {
  position: "absolute",
  top: 10,
  right: 10,
}
