import { lightTheme, darkTheme } from "@expo/styleguide-base"
import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { spacing, typography } from "../theme"
import { Button } from "./Button"
import { Card, CardProps } from "./Card"
import { Text } from "./Text"
import { Toggle } from "./Toggle"

export interface ExpoDemoCardAction {
  label: string
  onPress: () => void
}

export interface ExpoDemoCardBooleanSetting {
  value: boolean
  label: string
  onChange: (newValue: boolean) => void
}

export interface ExpoDemoCardChoiceSetting {
  value: any
  choices: {
    label: string
    value: any
  }[]
  onChange: (newValue: any) => void
}

export type ExpoDemoCardVariant = "default" | "success" | "warning" | "danger" | "info"

export interface ExpoDemoCardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  variant?: ExpoDemoCardVariant
  inverted?: boolean
  title?: string
  description?: string
  actions?: ExpoDemoCardAction[]
  booleanSettings?: ExpoDemoCardBooleanSetting[]
  choiceSettings?: ExpoDemoCardChoiceSetting[]
}

/**
 * Describe your component here
 */
export const ExpoDemoCard: (props: ExpoDemoCardProps & CardProps) => JSX.Element = ({
  style,
  variant = "default",
  inverted = false,
  title,
  description = "",
  ContentComponent,
  actions = [],
  booleanSettings = [],
  choiceSettings = [],
}) => {
  const {
    $button,
    $buttonRow,
    $buttonText,
    $buttonPressed,
    $buttonTextPressed,
    $card,
    $cardHeading,
    $cardHeadingText,
    $cardContentText,
  } = internalStyles(variant, inverted)

  const $styles = [$card, style]

  const renderHeader = (title: string) => (
    <View style={$cardHeading}>
      <Text text={title} style={$cardHeadingText} />
    </View>
  )

  const renderAction = (a: ExpoDemoCardAction) => (
    <Button
      key={a.label}
      style={$button}
      text={a.label}
      textStyle={$buttonText}
      pressedStyle={$buttonPressed}
      pressedTextStyle={$buttonTextPressed}
      onPress={a.onPress}
    />
  )

  const renderBoolean = (s: ExpoDemoCardBooleanSetting) => (
    <Toggle
      key={s.label}
      containerStyle={$toggleContainer}
      label={s.label}
      labelStyle={$cardContentText}
      value={s.value}
      variant="checkbox"
      onValueChange={() => s.onChange(!s.value)}
    />
  )

  const renderChoice = (s: ExpoDemoCardChoiceSetting) =>
    s.choices.map((c) => (
      <Toggle
        key={c.label}
        containerStyle={$toggleContainer}
        label={c.label}
        labelStyle={$cardContentText}
        variant="radio"
        value={c.value === s.value}
        onValueChange={() => s.onChange(c.value)}
      />
    ))

  const renderFooter = () => (
    <View>
      <View style={$buttonRow}>{actions.map((a) => renderAction(a))}</View>
      <View style={$settingsContainer}>
        {[
          ...booleanSettings.map((b) => renderBoolean(b)),
          ...choiceSettings.map((c) => renderChoice(c)),
        ]}
      </View>
    </View>
  )

  return title ? (
    ContentComponent ? (
      <Card
        style={$styles}
        HeadingComponent={renderHeader(title)}
        ContentComponent={ContentComponent}
        contentStyle={$cardContentText}
        FooterComponent={renderFooter()}
      />
    ) : (
      <Card
        style={$styles}
        HeadingComponent={renderHeader(title)}
        content={description}
        contentStyle={$cardContentText}
        FooterComponent={renderFooter()}
      />
    )
  ) : (
    <Card
      style={$styles}
      content={description}
      contentStyle={$cardContentText}
      FooterComponent={renderFooter()}
    />
  )
}

const $toggleContainer: ViewStyle = {
  margin: spacing.xxs,
}

const $settingsContainer: ViewStyle = {
  width: "100%",
}

const internalStyles = (variant: ExpoDemoCardVariant, inverted: boolean) => {
  const theme = inverted ? darkTheme : lightTheme

  const $buttonRow: ViewStyle = {
    flexDirection: "row",
  }
  const $button: ViewStyle = {
    minHeight: 30,
    borderRadius: 10,
    margin: 10,
    backgroundColor: theme.icon[variant],
  }

  const $buttonPressed: ViewStyle = {
    minHeight: 30,
    borderRadius: 10,
    margin: 10,
    backgroundColor: theme.background[variant],
  }

  const $buttonText: TextStyle = {
    fontSize: spacing.sm,
    color: theme.background[variant],
  }

  const $buttonTextPressed: TextStyle = {
    fontSize: spacing.sm,
    color: theme.icon[variant],
  }

  const $card: ViewStyle = {
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: theme.background[variant],
    borderColor: theme.border[variant],
  }

  const $cardHeading: ViewStyle = {
    alignItems: "center",
    borderBottomWidth: 1.0,
    padding: spacing.sm,
    borderColor: theme.border[variant],
  }

  const $cardHeadingText: TextStyle = {
    color: theme.text[variant],
  }

  const $cardContentText: TextStyle = {
    fontFamily: typography.primary.normal,
    fontSize: spacing.sm,
    color: theme.text[variant],
    lineHeight: spacing.md,
  }

  return {
    $button,
    $buttonRow,
    $buttonText,
    $buttonPressed,
    $buttonTextPressed,
    $card,
    $cardHeading,
    $cardHeadingText,
    $cardContentText,
  }
}
