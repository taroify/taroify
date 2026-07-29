const { execSync } = require("node:child_process")
const { version } = require("../lerna.json")

execSync(`pnpm version ${version} --no-git-tag-version`, {
  stdio: "inherit",
})

execSync(`pnpm version ${version} --no-git-tag-version`, {
  cwd: "site",
  stdio: "inherit",
})
