import * as React from "react"
import { Image, View, ImageStyle, TextStyle, ViewStyle } from "react-native"
import { assets, ImageAsset } from "./assets"
import { ExpoDemoCard } from "../ExpoDemoCard"
import { Text } from "../Text"

const renderImage = ({ item }: { item: ImageAsset }) => {
  return (
    <View key={imageKey(item)} style={$imageContainer}>
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
        <View style={$imageList}>{assets.map((item) => renderImage({ item }))}</View>
      }
    />
  )
}

const $image: ImageStyle & { width: number; height: number } = {
  width: 50,
  height: 50,
}

const $imageContainer: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  margin: 5,
}

const $imageList: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  width: "100%",
}

const $text: TextStyle = {
  fontSize: 10,
  flexWrap: "wrap",
  lineHeight: 15,
}
