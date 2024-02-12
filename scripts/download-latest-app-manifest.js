const path = require("path")
const fs = require("fs/promises")
const fetch = require("node-fetch")
const spawnAsync = require("@expo/spawn-async")

const projectRoot = path.resolve(__dirname, "..")

const tmpDirForBuild = path.join(process.env.TMPDIR, "tmpDirForBuild")

console.log(tmpDirForBuild)

const main = async () => {
  try {
    await fs.rmdir(tmpDirForBuild, { recursive: true, force: true })
  } catch (_e) {}
  await fs.mkdir(tmpDirForBuild)

  const { stdout } = await spawnAsync(
    "eas",
    ["build:list", "--json", "--non-interactive", "--limit", "1", "--platform", "android"],
    {
      stdio: "pipe",
      path: projectRoot,
    },
  )
  const buildMetadata = JSON.parse(stdout)
  if (buildMetadata.length !== 1) {
    throw new Error("No build")
  }

  console.log("Downloading latest Android build artifact")

  const buildUrl = buildMetadata[0].artifacts.buildUrl
  const response = await fetch(buildUrl, { method: "GET" })
  const buffer = await response.buffer()

  console.log(`Writing build artifact to ${tmpDirForBuild}...`)
  const outputPath = path.join(tmpDirForBuild, "out.apk")
  await fs.writeFile(outputPath, buffer)

  await console.log(`Unpacking artifact with apktool...`)
  await spawnAsync("apktool", ["d", "out.apk"], {
    cwd: tmpDirForBuild,
    stdio: "inherit",
  })

  console.log(`Copying app.manifest to project directory...`)
  const sourceManifestPath = path.resolve(tmpDirForBuild, "out", "assets", "app.manifest")
  const destManifestPath = path.join(projectRoot, "app.manifest")
  await fs.copyFile(sourceManifestPath, destManifestPath)

  console.log("Done")
}

main()
