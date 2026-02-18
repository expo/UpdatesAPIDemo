# InterfaceDemo Module

A local Expo module that demonstrates how to use the `expo-updates-interface` native API (`EXUpdatesInterface` on iOS, `expo-updates-interface` on Android) to access updates state and metadata from a custom native module.

See [the interface documentation](https://github.com/expo/expo/tree/main/packages/expo-updates-interface/README.md) for more details.

## What it does

This module subscribes to the native updates controller via `UpdatesControllerRegistry` and exposes the following to JavaScript:

- **`getRuntimeVersion()`** - Returns the current runtime version string.
- **`getEmbeddedUpdateId()`** - Returns the UUID of the embedded (built-in) update.
- **`getLaunchedUpdateId()`** - Returns the UUID of the currently launched update.
- **`getLaunchAssetPath()`** - Returns the file path of the launched JS bundle asset.
- **State change events** - Listens for native updates state changes (e.g. download started, download complete) and re-emits them to JavaScript, including download duration measurement.

## React hook

The module provides a `useLastNativeInterfaceStateChange()` hook that returns the latest state change from the native updates interface, including runtime version, update IDs, launch asset path, and the most recent state change event type and manifest.

## Structure

- [`InterfaceDemo.ts`](./src/InterfaceDemo.ts) - TypeScript API, event handling, and React hook
- [`InterfaceDemoModule.swift`](./ios/InterfaceDemoModule.swift) - iOS native implementation using `EXUpdatesInterface`
- [`InterfaceDemoModule.kt`](./android/src/main/java/expo/modules/interfacedemo/InterfaceDemoModule.kt) - Android native implementation using `expo-updates-interface`
