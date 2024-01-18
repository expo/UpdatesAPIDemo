## expo-updates asset selection demo

- See also the [Expo documentation guide to asset selection](https://docs.expo.dev/eas-update/asset-selection/)

### Introduction to asset selection

In SDK 49 and earlier, all assets resolved in the Metro bundler are included in every update, and are uploaded to the update server. The new experimental asset selection feature in SDK 50 allows the developer to specify that only certain assets should be included in updates. This has the potential to greatly reduce the number of assets that need to be uploaded to and downloaded from the updates server.

To use this feature, a new property `extra.updates.assetPatternsToBeBundled` should be included in your Expo config. It should define one or more file matching patterns (regular expressions). For example, suppose your `app.json` file has the patterns defined this way:

```json
    "extra": {
      "updates": {
        "assetPatternsToBeBundled": [
          "app/images/**/*.png"
        ]
      }
    }
```

In this case, all `.png` file in all subdirectories of `app/images` would be included in updates.

Assets that do not match any of the file patterns will still resolve in the Metro bundler, but will not be uploaded to the updates server. If making use of this feature, a developer needs to be certain that assets not included in updates are built into the native build of the app.

If this new property is not in your Expo config, all assets resolved by the bundler will be included in updates (SDK 49 and earlier behavior).

### Quick start

This demo makes use of a component that displays image assets. To initialize this component with the default images from `app/embeddedImages`, execute

```bash
yarn select-images
```

Then follow the quick start instructions in the [README](./README.md) document to do an initial build of the app:

```bash
yarn
eas init
eas update:configure
# Build and run iOS
npx expo run:ios --configuration Release
# Or build and run Android
npx expo run:android --variant release
```

### Embedded assets

The build will include two image files, both in the `app/embeddedImages` folder. These assets will be available to the initial build, and to all subsequent updates. When running the initial build, you will see these two images in the "Image Assets" card on the home screen.

![assets-01-embedded-images](./media/assets-01-embedded-images.jpg)

### Assets included in updates

This app has a folder `app/includedImages`. The Expo config for the app contains an `extra.updates.assetPatternsToBeBundled` setting so that only images in this folder are included in updates.

#### Add images and create an update

You can now use the `select-images` script to add images to the asset imports in `app/components/ExpoAssets/assets.ts`. All the images you add will be resolved by the Metro bundler, but only assets in `app/includedImages` will be packaged into updates.

While the app is running in the simulator/emulator, execute

```bash
# Add all JPG images in the app folder to assets.ts
yarn select-images app/*/*.jpg
# Execute an EAS update
yarn update -m "Add some images"
```

In the app, click "Show monitor options", then check the checkbox labeled "Check every 10 seconds". After a few seconds, the monitor will show at the bottom of the screen, alerting the user that an update is available, and some details about the update, including the message from `app.json`.

Click "Download" to fetch the update, and "Launch" to restart the app with the new update bundle.

The "Image Assets" card on the home screen now shows the original images from the `app/embeddedImages` folder. A new image is now included from the `app/includedImages` folder -- this folder is included in the asset selection patterns in `app.json`. The app attempts to show another new image in `app/excludedImages`. This image is resolved by the Metro bundler, but not included in the update or in the original app build, so the image does not show on the screen.

![assets-02-updated-images](./media/assets-02-updated-images.jpg)
