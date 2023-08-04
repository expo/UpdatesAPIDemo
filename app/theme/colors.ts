// TODO: write documentation for colors and palette in own markdown file and add links from here
import { lightTheme, palette } from "@expo/styleguide-base"

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: lightTheme.text.default,
  /**
   * Secondary text information.
   */
  textDim: lightTheme.text.quaternary,
  /**
   * The default color of the screen background.
   */
  background: lightTheme.background.default,
  /**
   * The default border color.
   */
  border: lightTheme.border.default,
  /**
   * The main tinting color.
   */
  tint: lightTheme.icon.default,
  /**
   * A subtle color used for lines.
   */
  separator: lightTheme.border.default,
  /**
   * Error messages.
   */
  error: lightTheme.text.danger,
  /**
   * Error Background.
   *
   */
  errorBackground: lightTheme.background.danger,
}
