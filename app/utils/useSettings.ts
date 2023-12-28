import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"

export enum CheckInterval {
  LONG = "long",
  SHORT = "short",
}

export type AppSettings = {
  checkInterval: CheckInterval
  autoLaunchCritical: boolean
  checkOnForeground: boolean
  monitorAlwaysVisible: boolean
}

const longCheckInterval = 3600000 // 1 hour
const shortCheckInterval = 10000 // 10 seconds

// Change these to modify the default values for the monitor settings
const defaultAppSettings: AppSettings = {
  checkInterval: CheckInterval.LONG,
  autoLaunchCritical: false,
  checkOnForeground: true,
  monitorAlwaysVisible: false,
}

const defaultAppSettingsString = JSON.stringify(defaultAppSettings)

export const checkIntervalFromSettings = (settings: AppSettings) => {
  return settings.checkInterval === CheckInterval.LONG ? longCheckInterval : shortCheckInterval
}

const retrieveAppSettingsStringAsync = async () => {
  let settingsString = defaultAppSettingsString
  try {
    settingsString = (await AsyncStorage.getItem("@appSettings")) || defaultAppSettingsString
    return settingsString
  } catch (_e: any) {
    return defaultAppSettingsString
  }
}

const storeAppSettingsStringAsync = async (settingsString: string) => {
  return await AsyncStorage.setItem("@appSettings", settingsString)
}

export const useSettings = () => {
  const [localSettingsString, setLocalSettingsString] = useState<string>(defaultAppSettingsString)
  const [initialized, setInitialized] = useState<boolean>(false)

  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      retrieveAppSettingsStringAsync().then((settingsString) => {
        setLocalSettingsString(settingsString)
      })
    }
  }, [initialized])

  const changeSettings = (settings: AppSettings) => {
    const settingsString = JSON.stringify(settings)
    storeAppSettingsStringAsync(settingsString).then(() => {
      setLocalSettingsString(settingsString)
    })
  }

  return {
    settings: JSON.parse(localSettingsString),
    changeSettings,
  }
}
