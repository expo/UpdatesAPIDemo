import Constants from "expo-constants"
import {
  type CurrentlyRunningInfo,
  type UseUpdatesReturnType,
  getLaunchAssetPath,
} from "expo-updates"
import { ExpoConfig, ExpoUpdatesManifest } from "expo/config"

const expoConfig: ExpoConfig = require("../../../app.json").expo as unknown as ExpoConfig

export const updateUrl: string = expoConfig.updates?.url ?? ""

const isAvailableUpdateCritical = (updatesSystem: UseUpdatesReturnType) => {
  const { currentlyRunning, availableUpdate } = updatesSystem
  const criticalIndexCurrent =
    (currentlyRunning.manifest as ExpoUpdatesManifest)?.extra?.expoClient?.extra?.criticalIndex ??
    Constants?.expoConfig?.extra?.criticalIndex ??
    0

  const criticalIndexUpdate =
    (availableUpdate?.manifest as ExpoUpdatesManifest)?.extra?.expoClient?.extra?.criticalIndex ?? 0

  return criticalIndexUpdate > criticalIndexCurrent
}

const manifestMessage = (manifest: any) => {
  return manifest?.extra?.expoClient?.extra?.message ?? ""
}

// Utils for constructing display text

export const isInDevelopmentMode = (currentlyRunning: CurrentlyRunningInfo) => {
  return __DEV__ && currentlyRunning.updateId === undefined
}

const currentlyRunningTitle = (currentlyRunning: CurrentlyRunningInfo) => {
  if (isInDevelopmentMode(currentlyRunning)) {
    return "No update soup for you in dev mode"
  }
  return currentlyRunning?.isEmbeddedLaunch ? "Running the embedded bundle:" : "Running an update:"
}

const currentlyRunningDescription = (
  currentlyRunning: CurrentlyRunningInfo,
  lastCheckForUpdateTime?: Date,
) => {
  return (
    ` ID: ${currentlyRunning.updateId}\n` +
    ` Created: ${currentlyRunning.createdAt?.toISOString()}\n` +
    ` Channel: ${currentlyRunning.channel}\n` +
    ` Runtime Version: ${currentlyRunning.runtimeVersion}\n` +
    ` Message: ${manifestMessage(currentlyRunning.manifest)}\n` +
    ` Last check: ${lastCheckForUpdateTime?.toISOString()}\n` +
    ` Launch asset path: ${getLaunchAssetPath()}\n`
  )
}

const availableUpdateTitle = (updatesSystem: UseUpdatesReturnType) => {
  if (isInDevelopmentMode(updatesSystem.currentlyRunning)) {
    return "No update soup for you in dev mode"
  }
  return updatesSystem.isUpdateAvailable
    ? `${isAvailableUpdateCritical(updatesSystem) ? "A critical update" : "An update"} ${
        updatesSystem.isUpdatePending ? "has been downloaded" : "is available"
      }`
    : "App is running the latest update"
}

const availableUpdateDescription = (updatesSystem: UseUpdatesReturnType) => {
  if (isInDevelopmentMode(updatesSystem.currentlyRunning)) {
    return ""
  }
  const availableUpdate = updatesSystem.availableUpdate
  const updateDescription = availableUpdate
    ? ` ID: ${availableUpdate.updateId}\n` +
      ` Created: ${availableUpdate.createdAt?.toISOString() || ""}\n` +
      ` Message: ${manifestMessage(availableUpdate.manifest)}\n` +
      ` Critical: ${isAvailableUpdateCritical(updatesSystem)}\n`
    : "No available update\n"
  return updateDescription
}

const errorDescription = (updatesSystem: UseUpdatesReturnType) => {
  const { checkError, downloadError } = updatesSystem
  const checkErrorDescription = checkError?.message
    ? `Error on check: ${checkError?.message}\n`
    : ""
  const downloadErrorDescription = downloadError?.message
    ? `Error on download: ${downloadError?.message}\n`
    : ""
  return checkErrorDescription + downloadErrorDescription
}

export {
  availableUpdateTitle,
  availableUpdateDescription,
  errorDescription,
  currentlyRunningTitle,
  currentlyRunningDescription,
  isAvailableUpdateCritical,
  manifestMessage,
}
