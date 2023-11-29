const path = require("path")
const fs = require("fs/promises")
const spawnAsync = require("@expo/spawn-async")

const usage = () => {
  console.log("Usage: push-update.js ")
  console.log("  Parameters:")
  console.log(
    "    <--message|-m> (message) (required) Sets the message passed into the EAS update command",
  )
  console.log(
    "    <--critical|-c> (optional) If present, increments the criticalIndex counter to mark this update as critical",
  )
  console.log(
    "    <--breakTheApp|-b> (optional) If present, introduces a bug in App.tsx that will cause a crash",
  )
}

const incrementCriticalIndexIfNeeded = async (critical, projectRoot) => {
  const criticalIndexPath = path.resolve(projectRoot, ".criticalIndex")
  let criticalIndex = 0
  try {
    const criticalIndexText = await fs.readFile(criticalIndexPath, { encoding: "utf-8" })
    criticalIndex = parseInt(criticalIndexText, 10)
  } catch (_error) {}
  const updatedCriticalIndex = critical ? criticalIndex + 1 : criticalIndex
  await fs.writeFile(criticalIndexPath, `${updatedCriticalIndex}`, { encoding: "utf-8" })
  return updatedCriticalIndex
}

const pushUpdateAsync = async (message, critical, breakTheApp, projectRoot) => {
  console.log("Modifying app.json...")
  const appJsonPath = path.resolve(projectRoot, "app.json")
  const appJsonOriginalText = await fs.readFile(appJsonPath, { encoding: "utf-8" })
  const appJsonOriginal = JSON.parse(appJsonOriginalText)
  const criticalIndex = await incrementCriticalIndexIfNeeded(critical, projectRoot)
  const appJson = {
    expo: {
      ...appJsonOriginal.expo,
      extra: {
        ...appJsonOriginal.expo.extra,
        message,
        criticalIndex,
      },
    },
  }
  const appJsonText = JSON.stringify(appJson, null, 2)
  await fs.rm(appJsonPath)
  await fs.writeFile(appJsonPath, appJsonText, { encoding: "utf-8" })

  const appTsxPath = path.resolve(projectRoot, "App.tsx")
  const appTsxOriginalText = await fs.readFile(appTsxPath, { encoding: "utf-8" })
  if (breakTheApp) {
    const appTsxText = appTsxOriginalText.replace("<App", "<Bogus")
    await fs.rm(appTsxPath)
    await fs.writeFile(appTsxPath, appTsxText, { encoding: "utf-8" })
  }
  console.log("Publishing update...")

  await spawnAsync("eas", ["update", `--message=${message}`, "--branch=main"], {
    stdio: "inherit",
    path: projectRoot,
  })

  console.log("Restoring original App.tsx...")
  await fs.rm(appTsxPath)
  await fs.writeFile(appTsxPath, appTsxOriginalText, { encoding: "utf-8" })

  console.log("Done.")
}

const params = process.argv.filter((a, i) => i > 0)
const projectRoot = path.resolve(__dirname, "..")

let message = ""
let critical = false
let breakTheApp = false

while (params.length) {
  if (params[0] === "--message" || params[0] === "-m") {
    message = params[1]
    params.shift()
  }
  if (params[0] === "--critical" || params[0] === "-c") {
    critical = true
  }
  if (params[0] === "--breakTheApp" || params[0] === "-b") {
    breakTheApp = true
  }
  params.shift()
}

if (message.length === 0) {
  usage()
  process.exit(0)
}

console.log(`message = ${message}`)
console.log(`critical = ${critical}`)
console.log(`breakTheApp = ${breakTheApp}`)

pushUpdateAsync(message, critical, breakTheApp, projectRoot).catch((error) =>
  console.log(`Error in script: ${error}`),
)
