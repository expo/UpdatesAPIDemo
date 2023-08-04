import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { date1GreaterThanDate2 } from "./dateUtils"

/**
 * Hook that takes a date computed since restart, and persists it if is later than the value already stored.
 * If the date has never been computed, attempt to read the previously saved value from storage.
 *
 * @param dateSinceRestart The date computed since restart
 *
 * @returns the most recently computed date, either computed since restart, or retrieved from storage
 */
export const usePersistentDate = (dateSinceRestart: Date | undefined) => {
  const [localDate, setLocalDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    if (dateSinceRestart && date1GreaterThanDate2(dateSinceRestart, localDate)) {
      // Caller passed in a date, so store it and set the local copy
      storeLastUpdateCheckDateAsync(dateSinceRestart).then(() => {
        setLocalDate(dateSinceRestart)
      })
    }
  }, [dateSinceRestart, localDate])

  useEffect(() => {
    if (localDate === undefined) {
      // If no date has yet been defined, try reading it from storage
      fetchLastUpdateCheckDateAsync().then((storedDate) => {
        if (storedDate) {
          setLocalDate(storedDate)
        }
      })
    }
  }, [localDate])

  return localDate
}

const fetchLastUpdateCheckDateAsync: () => Promise<Date | undefined> = async () => {
  const dateString = await AsyncStorage.getItem("@lastUpdateCheckDate")
  return dateString ? new Date(dateString) : undefined
}

const storeLastUpdateCheckDateAsync: (date: Date) => Promise<void> = async (date) => {
  const dateString = date.toISOString()
  return await AsyncStorage.setItem("@lastUpdateCheckDate", dateString)
}
