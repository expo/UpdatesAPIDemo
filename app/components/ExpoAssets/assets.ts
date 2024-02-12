import { ImageSourcePropType } from "react-native"

export type ImageAsset = {
  name: string
  directory: string
  image: ImageSourcePropType
}

export const assets: ImageAsset[] = [
{
    name: "red_blue.jpg",
    directory: "embeddedImages",
    image: require("../../../app/embeddedImages/red_blue.jpg")
  },{
    name: "red_green.jpg",
    directory: "embeddedImages",
    image: require("../../../app/embeddedImages/red_green.jpg")
  }
]
