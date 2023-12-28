import * as React from "react"
import { FlatList, Image, View, ImageStyle, TextStyle, ViewStyle } from "react-native"
import { assets, ImageAsset } from "./assets"
import { ExpoDemoCard } from "../ExpoDemoCard"
import { Text } from "../Text"

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
          data={assets}
          keyExtractor={imageKey}
          renderItem={renderImage}
          numColumns={3}
        />
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

const $text: TextStyle = {
  fontSize: 10,
  flexWrap: "wrap",
  lineHeight: 15,
}
