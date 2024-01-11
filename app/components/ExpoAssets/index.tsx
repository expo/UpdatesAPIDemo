import * as React from "react"
import { FlatList, Image, View, ImageStyle, TextStyle, ViewStyle, Platform } from "react-native"
import { assets, ImageAsset } from "./assets"
import { ExpoDemoCard } from "../ExpoDemoCard"
import { Text } from "../Text"
import { spacing } from "../../theme"

const renderImage = ({ item }: { item: ImageAsset }) => {
  return (
    <View style={$imageContainer}>
      <Text style={$text}>{item.directory}</Text>
      <Text style={$text}>{item.name}</Text>
      <Image source={item.image} height={$image.height} width={$image.width} style={$image} />
    </View>
  )
}

const imageKey = (item: ImageAsset) => `${item.directory}/${item.name}`

export const ExpoAssets: () => JSX.Element = () => {
  if (assets.length === 0) {
    return <View />
  }
  return (
    <ExpoDemoCard
      title="Image Assets"
      ContentComponent={
        <FlatList
          nestedScrollEnabled
          horizontal={Platform.isTV}
          data={assets}
          keyExtractor={imageKey}
          renderItem={renderImage}
          numColumns={Platform.isTV ? undefined : 3}
        />
      }
    />
  )
}

const $image: ImageStyle & { width: number; height: number } = {
  width: spacing.xxl,
  height: spacing.xxl,
  margin: spacing.xxs,
}

const $imageContainer: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  margin: spacing.xxs,
  padding: spacing.xxs,
}

const $text: TextStyle = {
  fontSize: spacing.sm,
  flexWrap: "wrap",
  lineHeight: spacing.md,
}
