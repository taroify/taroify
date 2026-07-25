const { execSync } = require("node:child_process")
const { version } = require("../lerna.json")

execSync(`yarn version --new-version ${version} --no-git-tag-version`, {
  stdio: "inherit",
})

execSync(`yarn version --new-version ${version} --no-git-tag-version`, {
  cwd: "site",
  stdio: "inherit",
})
