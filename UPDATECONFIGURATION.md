## expo-updates configuration override demo

- See the [Expo documentation guide to overriding updates URL and channel](https://docs.expo.dev/eas-update/override/)

> _WARNING:_ The use of this feature is not recommended or supported for production apps. This feature is currently primarily intended for preview environments.

### Introduction

In SDK 51 and earlier, the updates configuration is set at the time the app is built, and cannot be changed at runtime. This is by design, to ensure that the app can always be safely updated, and to prevent security issues that can occur if the configuration can be modified by the app.

However, there are important use cases that require the ability to override the updates configuration at runtime. Most importantly, we wanted to make it possible to switch between updates in a preview build, similar to what is possible in a development build.

To support this use case, we have provided two new APIs:

- A new boolean configuration option, `disableAntiBrickingMeasures`, that turns off measures built into `expo-updates` which ensure subsequent updates can always be published. With this flag set, it is possible to change the updates URL and channel at runtime. It is important to understand that when this is done, the app is no longer able to safely roll back to a previous update if there is a problem or crash caused by the new update.
- A new JS API, `Updates.setUpdateURLAndRequestHeadersOverride({ url: string, requestHeaders: Object })`. This is the API that application code should use to actually change the updates configuration at runtime.

### Quick start

Follow the quick start instructions in the [README](./README.md) document to configure the app for updates:

```bash
yarn
eas init
eas update:configure
```

Now execute `prebuild`, with the environment variable `PREVIEW` set to `1`. A [dynamic Expo configuration](./app.config.ts) has been added to the project, that will set the `disableAntiBrickingMeasures` flag when the `PREVIEW` environment variable is set.

```bash
PREVIEW=1 npx expo prebuild --clean
```

Now build the app:

```bash
# Build and run iOS
npx expo run:ios --configuration Release

# Or build and run Android
npx expo run:android --variant release
```

When the app starts, click the button "Show monitor options". It will show that updates are currently being fetched from the channel named "main".

![Simulator Screenshot - iPhone 16 - 2025-04-24 at 20 05 09](https://github.com/user-attachments/assets/66330135-3bc0-4917-8d3c-e767cfc3a51e)


If you have not done so already, create a new channel named "test". This will automatically create a branch of the same name.

```bash
eas channel:create test
```

Now publish a new update to the "test" branch:

```bash
yarn update -m "First test update" -br test
```

Now, in the app, click the button "Updates from test channel". This will change the updates configuration to fetch updates from the "test" channel, and show an alert. The new configuration will become active the next time the app exits and restarts.

![Simulator Screenshot - iPhone 16 - 2025-04-24 at 20 05 18](https://github.com/user-attachments/assets/ff112c14-cc72-42f4-8dd3-df291894d431)


Now force quit and restart the app, and you should see the new update information (including the message you set) reflected in the manifest info on the screen.

![Simulator Screenshot - iPhone 16 - 2025-04-24 at 20 07 25](https://github.com/user-attachments/assets/6165d735-5322-44f6-af5c-98206cd861f0)

