import { View, ViewStyle } from "react-native"
import React from "react"
import { lightTheme, darkTheme } from "@expo/styleguide-base"
import { spacing } from "../theme"
import { ExpoDemoCardVariant } from "./ExpoDemoCard"

export const ExpoDemoProgressBar = (props: {
  fractionComplete: number
  variant: ExpoDemoCardVariant
  inverted?: boolean
}) => {
  const theme = props.inverted ? darkTheme : lightTheme
  const $progressContainer: ViewStyle = {
    flexDirection: "row",
    width: "100%",
    height: spacing.sm / 2,
    margin: 0,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: theme.icon[props.variant],
  }

  const $progressLeft: ViewStyle = {
    backgroundColor: theme.icon[props.variant],
    borderTopRightRadius: spacing.sm,
    borderBottomRightRadius: spacing.sm,
    flexDirection: "row",
    height: "100%",
  }

  const $progressRight: ViewStyle = {
    flexDirection: "row",
    height: "100%",
  }
  const progressBarStyles = {
    container: $progressContainer,
    left: [$progressLeft, { flex: props?.fractionComplete || 0.0 }],
    right: [$progressRight, { flex: 1.0 - props?.fractionComplete || 1.0 }],
  }
  return (
    <View style={progressBarStyles.container}>
      <View style={progressBarStyles.left} />
      <View style={progressBarStyles.right} />
    </View>
  )
}

export const fractionCompleteFromPosition = (
  position: number | undefined,
  duration: number | undefined,
) => {
  return duration !== undefined ? (position ?? 0) / duration : 0
}
