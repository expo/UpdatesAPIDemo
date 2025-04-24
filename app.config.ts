import { ExpoConfig, ConfigContext } from "@expo/config"

const config = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "UpdatesAPIDemo",
  slug: "UpdatesAPIDemo",
  updates: {
    ...config.updates,
    disableAntiBrickingMeasures: process.env.PREVIEW === "1",
  },
})

export default config
