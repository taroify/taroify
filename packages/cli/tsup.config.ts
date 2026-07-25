import { readFileSync } from "node:fs"
import { defineConfig } from "tsup"

const { version } = JSON.parse(readFileSync("package.json", "utf8")) as {
  version: string
}

export default defineConfig({
  entry: {
    cli: "src/cli.ts",
    mcp: "src/mcp/public.ts",
  },
  format: ["esm"],
  target: "node18.18",
  platform: "node",
  splitting: false,
  dts: true,
  clean: true,
  noExternal: ["commander", "@modelcontextprotocol/sdk"],
  banner: {
    js: [
      "#!/usr/bin/env node",
      'import { createRequire } from "node:module";',
      "const require = createRequire(import.meta.url);",
    ].join("\n"),
  },
  define: {
    __CLI_VERSION__: JSON.stringify(version),
  },
})
