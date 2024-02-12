import React, { ComponentType, FC, useMemo } from "react"
import {
  GestureResponderEvent,
  Image,
  ImageStyle,
  StyleProp,
  SwitchProps,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated"
import { colors, spacing } from "../theme"
import { iconRegistry, IconTypes } from "./Icon"
import { Text, TextProps } from "./Text"

type Variants = "checkbox" | "switch" | "radio"

interface BaseToggleProps extends Omit<TouchableOpacityProps, "style"> {
  /**
   * The variant of the toggle.
   * Options: "checkbox", "switch", "radio"
   * Default: "checkbox"
   */
  variant?: unknown
  /**
   * A style modifier for different input states.
   */
  status?: "error" | "disabled"
  /**
   * If false, input is not editable. The default value is true.
   */
  editable?: TextInputProps["editable"]
  /**
   * The value of the field. If true the component will be turned on.
   */
  value?: boolean
  /**
   * Invoked with the new value when the value changes.
   */
  onValueChange?: SwitchProps["onValueChange"]
  /**
   * Style overrides for the container
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * Style overrides for the input wrapper
   */
  inputWrapperStyle?: StyleProp<ViewStyle>
  /**
   * Optional input wrapper style override.
   * This gives the inputs their size, shape, "off" background-color, and outer border.
   */
  inputOuterStyle?: ViewStyle
  /**
   * Optional input style override.
   * This gives the inputs their inner characteristics and "on" background-color.
   */
  inputInnerStyle?: ViewStyle
  /**
   * The position of the label relative to the action component.
   * Default: right
   */
  labelPosition?: "left" | "right"
  /**
   * The label text to display if not using `labelTx`.
   */
  label?: TextProps["text"]
  /**
   * Label text which is looked up via i18n.
   */
  labelTx?: TextProps["tx"]
  /**
   * Optional label options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  labelTxOptions?: TextProps["txOptions"]
  /**
   * Style overrides for label text.
   */
  labelStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the label Text component.
   */
  LabelTextProps?: TextProps
  /**
   * The helper text to display if not using `helperTx`.
   */
  helper?: TextProps["text"]
  /**
   * Helper text which is looked up via i18n.
   */
  helperTx?: TextProps["tx"]
  /**
   * Optional helper options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  helperTxOptions?: TextProps["txOptions"]
  /**
   * Pass any additional props directly to the helper Text component.
   */
  HelperTextProps?: TextProps
}

interface CheckboxToggleProps extends BaseToggleProps {
  variant?: "checkbox"
  /**
   * Optional style prop that affects the Image component.
   */
  inputDetailStyle?: ImageStyle
  /**
   * Checkbox-only prop that changes the icon used for the "on" state.
   */
  checkboxIcon?: IconTypes
}

interface RadioToggleProps extends BaseToggleProps {
  variant?: "radio"
  /**
   * Optional style prop that affects the dot View.
   */
  inputDetailStyle?: ViewStyle
}

interface SwitchToggleProps extends BaseToggleProps {
  variant?: "switch"
  /**
   * Switch-only prop that adds a text/icon label for on/off states.
   */
  switchAccessibilityMode?: "text" | "icon"
  /**
   * Optional style prop that affects the knob View.
   * Note: `width` and `height` rules should be points (numbers), not percentages.
   */
  inputDetailStyle?: Omit<ViewStyle, "width" | "height"> & { width?: number; height?: number }
}

export type ToggleProps = CheckboxToggleProps | RadioToggleProps | SwitchToggleProps

interface ToggleInputProps {
  on: boolean
  status: BaseToggleProps["status"]
  disabled: boolean
  outerStyle: ViewStyle
  innerStyle: ViewStyle
  detailStyle: Omit<ViewStyle & ImageStyle, "overflow">
  switchAccessibilityMode?: SwitchToggleProps["switchAccessibilityMode"]
  checkboxIcon?: CheckboxToggleProps["checkboxIcon"]
}

/**
 * Renders a boolean input.
 * This is a controlled component that requires an onValueChange callback that updates the value prop in order for the component to reflect user actions. If the value prop is not updated, the component will continue to render the supplied value prop instead of the expected result of any user actions.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Toggle.md)
 */
export function Toggle(props: ToggleProps) {
  const {
    variant = "checkbox",
    editable = true,
    status,
    value,
    onPress,
    onValueChange,
    labelPosition = "right",
    helper,
    helperTx,
    helperTxOptions,
    HelperTextProps,
    containerStyle: $containerStyleOverride,
    inputWrapperStyle: $inputWrapperStyleOverride,
    ...WrapperProps
  } = props

  const { switchAccessibilityMode } = props as SwitchToggleProps
  const { checkboxIcon } = props as CheckboxToggleProps

  const disabled = editable === false || status === "disabled" || props.disabled

  const Wrapper = useMemo(
    () => (disabled ? View : TouchableOpacity) as ComponentType<TouchableOpacityProps | ViewProps>,
    [disabled],
  )
  const ToggleInput = useMemo(() => ToggleInputs[variant] || (() => null), [variant])

  const $containerStyles = [$containerStyleOverride]
  const $inputWrapperStyles = [$inputWrapper, $inputWrapperStyleOverride]
  const $helperStyles = [
    $helper,
    status === "error" && { color: colors.error },
    HelperTextProps?.style,
  ]

  function handlePress(e: GestureResponderEvent) {
    if (disabled) return
    onValueChange?.(!value)
    onPress?.(e)
  }

  return (
    <Wrapper
      activeOpacity={0.6}
      accessibilityRole={variant}
      accessibilityState={{ checked: value, disabled }}
      {...WrapperProps}
      style={$containerStyles}
      onPress={handlePress}
    >
      <View style={$inputWrapperStyles}>
        {labelPosition === "left" && <FieldLabel {...props} labelPosition={labelPosition} />}

        <ToggleInput
          on={!!value}
          disabled={!!disabled}
          status={status}
          outerStyle={props.inputOuterStyle ?? {}}
          innerStyle={props.inputInnerStyle ?? {}}
          detailStyle={props.inputDetailStyle ?? {}}
          switchAccessibilityMode={switchAccessibilityMode}
          checkboxIcon={checkboxIcon}
        />

        {labelPosition === "right" && <FieldLabel {...props} labelPosition={labelPosition} />}
      </View>

      {!!(helper || helperTx) && (
        <Text
          preset="formHelper"
          text={helper}
          tx={helperTx}
          txOptions={helperTxOptions}
          {...HelperTextProps}
          style={$helperStyles}
        />
      )}
    </Wrapper>
  )
}

const ToggleInputs: Record<Variants, FC<ToggleInputProps>> = {
  checkbox: Checkbox,
  switch: Switch,
  radio: Radio,
}

function Checkbox(props: ToggleInputProps) {
  const {
    on,
    status,
    disabled,
    checkboxIcon,
    outerStyle: $outerStyleOverride,
    innerStyle: $innerStyleOverride,
    detailStyle: $detailStyleOverride,
  } = props

  const offBackgroundColor = [
    disabled && colors.background,
    status === "error" && colors.errorBackground,
    colors.background,
  ].filter(Boolean)[0]

  const outerBorderColor = [
    disabled && colors.tint,
    status === "error" && colors.error,
    !on && colors.border,
    colors.border,
  ].filter(Boolean)[0]

  const onBackgroundColor = [
    disabled && colors.transparent,
    status === "error" && colors.errorBackground,
    colors.background,
  ].filter(Boolean)[0]

  const iconTintColor = [
    disabled && colors.tint,
    status === "error" && colors.error,
    colors.textDim,
  ].filter(Boolean)[0]

  return (
    <View
      style={[
        $inputOuterVariants.checkbox,
        { backgroundColor: offBackgroundColor, borderColor: outerBorderColor },
        $outerStyleOverride,
      ]}
    >
      <Animated.View
        style={[
          $checkboxInner,
          { backgroundColor: onBackgroundColor },
          $innerStyleOverride,
          useAnimatedStyle(() => ({ opacity: withTiming(on ? 1 : 0) }), [on]),
        ]}
      >
        <Image
          source={checkboxIcon ? iconRegistry[checkboxIcon] : iconRegistry.check}
          style={[
            $checkboxDetail,
            !!iconTintColor && { tintColor: iconTintColor },
            $detailStyleOverride,
          ]}
        />
      </Animated.View>
    </View>
  )
}

function Radio(props: ToggleInputProps) {
  const {
    on,
    status,
    disabled,
    outerStyle: $outerStyleOverride,
    innerStyle: $innerStyleOverride,
    detailStyle: $detailStyleOverride,
  } = props

  const offBackgroundColor = [
    disabled && colors.transparent,
    status === "error" && colors.errorBackground,
    colors.background,
  ].filter(Boolean)[0]

  const outerBorderColor = [
    disabled && colors.tint,
    status === "error" && colors.error,
    !on && colors.separator,
    colors.separator,
  ].filter(Boolean)[0]

  const onBackgroundColor = [
    disabled && colors.background,
    status === "error" && colors.errorBackground,
    colors.background,
  ].filter(Boolean)[0]

  const dotBackgroundColor = [
    disabled && colors.tint,
    status === "error" && colors.error,
    colors.textDim,
  ].filter(Boolean)[0]

  return (
    <View
      style={[
        $inputOuterVariants.radio,
        { backgroundColor: offBackgroundColor, borderColor: outerBorderColor },
        $outerStyleOverride,
      ]}
    >
      <Animated.View
        style={[
          $radioInner,
          { backgroundColor: onBackgroundColor },
          $innerStyleOverride,
          useAnimatedStyle(() => ({ opacity: withTiming(on ? 1 : 0) }), [on]),
        ]}
      >
        <View
          style={[$radioDetail, { backgroundColor: dotBackgroundColor }, $detailStyleOverride]}
        />
      </Animated.View>
    </View>
  )
}

function Switch(props: ToggleInputProps) {
  const {
    on,
    status,
    disabled,
    outerStyle: $outerStyleOverride,
    innerStyle: $innerStyleOverride,
    detailStyle: $detailStyleOverride,
  } = props

  const knobSizeFallback = 2

  const knobWidth = [$detailStyleOverride?.width, $switchDetail?.width, knobSizeFallback].find(
    (v) => typeof v === "number",
  )

  const knobHeight = [$detailStyleOverride?.height, $switchDetail?.height, knobSizeFallback].find(
    (v) => typeof v === "number",
  )

  const offBackgroundColor = [
    disabled && colors.background,
    status === "error" && colors.errorBackground,
    colors.separator,
  ].filter(Boolean)[0]

  const onBackgroundColor = [
    disabled && colors.background,
    status === "error" && colors.errorBackground,
    colors.separator,
  ].filter(Boolean)[0]

  const knobBackgroundColor = (function () {
    if (on) {
      return [
        $detailStyleOverride?.backgroundColor,
        status === "error" && colors.error,
        disabled && colors.tint,
        colors.text,
      ].filter(Boolean)[0]
    } else {
      return [
        $innerStyleOverride?.backgroundColor,
        disabled && colors.tint,
        status === "error" && colors.error,
        colors.textDim,
      ].filter(Boolean)[0]
    }
  })()

  const $animatedSwitchKnob = useAnimatedStyle(() => {
    const offsetLeft = ($innerStyleOverride?.paddingStart ||
      $innerStyleOverride?.paddingLeft ||
      $switchInner?.paddingStart ||
      $switchInner?.paddingLeft ||
      0) as number

    const offsetRight = ($innerStyleOverride?.paddingEnd ||
      $innerStyleOverride?.paddingRight ||
      $switchInner?.paddingEnd ||
      $switchInner?.paddingRight ||
      0) as number

    const start = withTiming(on ? "100%" : "0%")
    const marginStart = withTiming(on ? -(knobWidth || 0) - offsetRight : 0 + offsetLeft)

    return { start, marginStart }
  }, [on, knobWidth])

  return (
    <View
      style={[
        $inputOuterVariants.switch,
        { backgroundColor: offBackgroundColor },
        $outerStyleOverride,
      ]}
    >
      <Animated.View
        style={[
          $switchInner,
          { backgroundColor: onBackgroundColor },
          $innerStyleOverride,
          useAnimatedStyle(() => ({ opacity: withTiming(on ? 1 : 0) }), [on]),
        ]}
      />

      <SwitchAccessibilityLabel {...props} role="on" />
      <SwitchAccessibilityLabel {...props} role="off" />

      <Animated.View
        style={[
          $switchDetail,
          $detailStyleOverride,
          $animatedSwitchKnob,
          { width: knobWidth, height: knobHeight },
          { backgroundColor: knobBackgroundColor },
        ]}
      />
    </View>
  )
}

function SwitchAccessibilityLabel(props: ToggleInputProps & { role: "on" | "off" }) {
  const { on, disabled, status, switchAccessibilityMode, role, innerStyle, detailStyle } = props

  if (!switchAccessibilityMode) return null

  const shouldLabelBeVisible = (on && role === "on") || (!on && role === "off")

  const $switchAccessibilityStyle: StyleProp<ViewStyle> = [
    $switchAccessibility,
    role === "off" && { end: "5%" },
    role === "on" && { left: "5%" },
  ]

  const color = (function () {
    if (disabled) return colors.tint
    if (status === "error") return colors.error
    if (!on) return innerStyle?.backgroundColor || colors.text
    return detailStyle?.backgroundColor || colors.text
  })()

  return (
    <View style={$switchAccessibilityStyle}>
      {switchAccessibilityMode === "text" && shouldLabelBeVisible && (
        <View
          style={[
            role === "on" && $switchAccessibilityLine,
            role === "on" && { backgroundColor: color },
            role === "off" && $switchAccessibilityCircle,
            role === "off" && { borderColor: color },
          ]}
        />
      )}

      {switchAccessibilityMode === "icon" && shouldLabelBeVisible && (
        <Image
          style={[$switchAccessibilityIcon, { tintColor: color }]}
          source={role === "off" ? iconRegistry.hidden : iconRegistry.view}
        />
      )}
    </View>
  )
}

function FieldLabel(props: BaseToggleProps) {
  const {
    status,
    label,
    labelTx,
    labelTxOptions,
    LabelTextProps,
    labelPosition,
    labelStyle: $labelStyleOverride,
  } = props

  if (!label && !labelTx && !LabelTextProps?.children) return null

  const $labelStyle = [
    $label,
    status === "error" && { color: colors.error },
    labelPosition === "right" && $labelRight,
    labelPosition === "left" && $labelLeft,
    $labelStyleOverride,
    LabelTextProps?.style,
  ]

  return (
    <Text
      preset="formLabel"
      text={label}
      tx={labelTx}
      txOptions={labelTxOptions}
      {...LabelTextProps}
      style={$labelStyle}
    />
  )
}

const $inputWrapper: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $inputOuterBase: ViewStyle = {
  height: 24 * spacing.scale,
  width: 24 * spacing.scale,
  borderWidth: 2 * spacing.scale,
  alignItems: "center",
  overflow: "hidden",
  flexGrow: 0,
  flexShrink: 0,
  justifyContent: "space-between",
  flexDirection: "row",
}

const $inputOuterVariants: Record<Variants, StyleProp<ViewStyle>> = {
  checkbox: [$inputOuterBase, { borderRadius: 4 * spacing.scale }],
  radio: [$inputOuterBase, { borderRadius: 12 * spacing.scale }],
  switch: [
    $inputOuterBase,
    {
      height: 32 * spacing.scale,
      width: 56 * spacing.scale,
      borderRadius: 16 * spacing.scale,
      borderWidth: 0,
    },
  ],
}

const $checkboxInner: ViewStyle = {
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
}

const $checkboxDetail: ImageStyle = {
  width: 20 * spacing.scale,
  height: 20 * spacing.scale,
  resizeMode: "contain",
}

const $radioInner: ViewStyle = {
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
}

const $radioDetail: ViewStyle = {
  width: 12 * spacing.scale,
  height: 12 * spacing.scale,
  borderRadius: 6 * spacing.scale,
}

const $switchInner: ViewStyle = {
  width: "100%",
  height: "100%",
  alignItems: "center",
  borderColor: colors.transparent,
  overflow: "hidden",
  position: "absolute",
  paddingStart: 4 * spacing.scale,
  paddingEnd: 4 * spacing.scale,
}

const $switchDetail: SwitchToggleProps["inputDetailStyle"] = {
  borderRadius: 12 * spacing.scale,
  position: "absolute",
  width: 24 * spacing.scale,
  height: 24 * spacing.scale,
}

const $helper: TextStyle = {
  marginTop: spacing.xs,
}

const $label: TextStyle = {
  flex: 1,
}

const $labelRight: TextStyle = {
  marginStart: spacing.md,
}

const $labelLeft: TextStyle = {
  marginEnd: spacing.md,
}

const $switchAccessibility: TextStyle = {
  width: "40%",
  justifyContent: "center",
  alignItems: "center",
}

const $switchAccessibilityIcon: ImageStyle = {
  width: 14 * spacing.scale,
  height: 14 * spacing.scale,
  resizeMode: "contain",
}

const $switchAccessibilityLine: ViewStyle = {
  width: 2 * spacing.scale,
  height: 12 * spacing.scale,
}

const $switchAccessibilityCircle: ViewStyle = {
  borderWidth: 2 * spacing.scale,
  width: 12 * spacing.scale,
  height: 12 * spacing.scale,
  borderRadius: 6 * spacing.scale,
}
