/* eslint-disable no-multi-str */
const fs = require("fs/promises")
const glob = require("glob")
const path = require("path")

const assetsModulePreamble =
  'import { ImageSourcePropType } from "react-native"\n\
\n\
export type ImageAsset = {\n\
  name: string\n\
  directory: string\n\
  image: ImageSourcePropType\n\
}\n\
\n\
export const assets: ImageAsset[] = '

const usage = () => {
  console.log("Usage: rewrite-asset-component.js <fileglob1> <fileglob2>...")
  console.log("          Add images to ExpoAssets component, where files are png or jpg images inside the app directory.")
  console.log("       rewrite-asset-component.js --no-images")
  console.log("          Remove all images from ExpoAssets component")
  console.log("       rewrite-asset-component.js")
  console.log("          Add only embedded images to ExpoAssets component")
}

const globToAssetPath = (globParam) => {
  const assets = []
  const paths = glob.sync(path.join(projectRoot, globParam))
  for (const imagePath of paths) {
    assets.push(path.relative(projectRoot, imagePath))
  }
  return assets
}

const assetPathToString = (assetPath) => {
  assetPathComponents = assetPath.split("/")
  return `{
    name: "${path.basename(assetPath)}",
    directory: "${assetPathComponents[assetPathComponents.length - 2]}",
    image: require("../../../${assetPath}")
  }`
}

const assetsToString = (assets) => {
  return `[\n${assets.map((a) => assetPathToString(a))}\n]\n`
}

const params = process.argv.filter((a, i) => i > 1)
const projectRoot = path.resolve(__dirname, "..")

let assetsToImportSet = new Set(globToAssetPath("app/embeddedImages/*.jpg"))

while (params.length) {
  if (params[0] == '--no-images') { // no images
    assetsToImportSet = new Set([]);
    break;
  } else if (params[0].startsWith("app") && (params[0].endsWith("jpg") || params[0].endsWith("png"))) {
    globToAssetPath(params[0]).forEach((imagePath) => assetsToImportSet.add(imagePath))
    params.shift()
  } else {
    usage()
    process.exit(0)
  }
}

const assetsToImport = [...assetsToImportSet]

const assetsModulePath = path.resolve(projectRoot, "app", "components", "ExpoAssets", "assets.ts")

const assetsModuleText = `${assetsModulePreamble}${assetsToString(assetsToImport)}`

fs.writeFile(assetsModulePath, assetsModuleText, { encoding: "utf-8" })
