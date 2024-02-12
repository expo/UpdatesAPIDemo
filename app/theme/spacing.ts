/**
  Use these spacings for margins/paddings and other whitespace throughout your app.
 */
import { Platform } from "react-native"

const scale = Platform.isTV ? (Platform.OS === "ios" ? 1.3 : 0.7) : 0.9

export const spacing = {
  xxxs: 2 * scale,
  xxs: 4 * scale,
  xs: 8 * scale,
  sm: 12 * scale,
  md: 16 * scale,
  lg: 24 * scale,
  xl: 32 * scale,
  xxl: 48 * scale,
  xxxl: 64 * scale,
  scale,
} as const

export type Spacing = keyof typeof spacing
