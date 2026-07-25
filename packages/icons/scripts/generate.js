// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
const { writeFileSync, appendFileSync } = require("fs")
const _ = require("lodash")
const names = require("../src/van/names")

function convertIconComponentName(name) {
  const isOutline = _.endsWith(name, "-o")
  // biome-ignore lint/style/useTemplate: <explanation>
  const newName = isOutline ? name.substring(0, _.size(name) - 2) + "-outlined" : name
  return _.upperFirst(_.camelCase(newName))
}

function createVanIconTsxContent(componentName, name) {
  return `import { createVanIconComponent } from "./van"

const ${componentName} = createVanIconComponent("${name}")
export default ${componentName}
`
}

function createVanIconTsxFile(componentName, name) {
  const tsxContent = createVanIconTsxContent(componentName, name)
  writeFileSync(`./src/${componentName}.tsx`, tsxContent)
  appendFileSync(
    "./src/index.ts",
    `export { default as ${componentName} } from "./${componentName}"
`,
  )
}

function createIconTsxFile(name) {
  const componentName = convertIconComponentName(name)
  createVanIconTsxFile(componentName, name)
  if (componentName === "Arrow") {
    createVanIconTsxFile("ArrowRight", "arrow")
  }
}

writeFileSync("./src/index.ts", 'export { VanIcon as Icon } from "./van"\n')

_.forEach(names.basic, createIconTsxFile)
_.forEach(names.outlined, createIconTsxFile)
_.forEach(names.filled, createIconTsxFile)
