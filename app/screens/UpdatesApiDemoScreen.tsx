import { useUpdates } from "expo-updates"
import { lightTheme } from "@expo/styleguide-base"
import React, { useState } from "react"
import { ActivityIndicator, TextStyle, View, ViewStyle } from "react-native"
import { ExpoDemoCard, Screen, Text, UpdateMonitor } from "../components"
import { spacing } from "../theme"
import { DocsLogo } from "../svg"

import {
  currentlyRunningTitle,
  currentlyRunningDescription,
  usePersistentDate,
} from "../utils/updates"

const longCheckInterval = 3600000 // 1 hour
const shortCheckInterval = 10000 // 10 seconds

// Change these to modify the default values for the monitor settings

const defaultCheckInterval = longCheckInterval
const defaultAutoLaunchCritical = false
const defaultCheckOnForeground = false
const defaultMonitorAlwaysVisible = false

const expoVariant = "default"

export function UpdatesApiDemoScreen() {
  const { currentlyRunning, isChecking, isDownloading, lastCheckForUpdateTimeSinceRestart } =
    useUpdates()

  const [showSettings, setShowSettings] = useState(false)

  const [monitorAlwaysVisible, setMonitorAlwaysVisible] = useState(defaultMonitorAlwaysVisible)
  const [autoLaunchCritical, setAutoLaunchCritical] = useState(defaultAutoLaunchCritical)
  const [checkOnForeground, setCheckOnForeground] = useState(defaultCheckOnForeground)
  const [updateCheckInterval, setUpdateCheckInterval] = useState(defaultCheckInterval)

  const lastCheckForUpdateTime = usePersistentDate(lastCheckForUpdateTimeSinceRestart)

  const monitorBooleanSettings = showSettings
    ? [
        {
          label: "Monitor always visible",
          value: monitorAlwaysVisible,
          onChange: setMonitorAlwaysVisible,
        },
        {
          label: "Auto launch critical updates",
          value: autoLaunchCritical,
          onChange: setAutoLaunchCritical,
        },
        {
          label: "Check when app foregrounds",
          value: checkOnForeground,
          onChange: setCheckOnForeground,
        },
      ]
    : []

  const monitorChoiceSettings = showSettings
    ? [
        {
          value: updateCheckInterval,
          onChange: setUpdateCheckInterval,
          choices: [
            {
              label: "Check every hour",
              value: longCheckInterval,
            },
            {
              label: "Check every 10 seconds",
              value: shortCheckInterval,
            },
          ],
        },
      ]
    : []

  return (
    <Screen contentContainerStyle={$container} safeAreaEdges={["bottom", "top"]}>
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
      <View style={$spacer} />
      <UpdateMonitor
        alwaysVisible={monitorAlwaysVisible}
        autoLaunchCritical={autoLaunchCritical}
        checkOnForeground={checkOnForeground}
        updateCheckInterval={updateCheckInterval}
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
