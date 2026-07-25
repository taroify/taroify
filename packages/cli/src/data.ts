import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { CliError, ErrorCodes } from "./error.js"
import type { Meta } from "./types.js"

const dataDirectory = path.resolve(fileURLToPath(new URL("../data/", import.meta.url)))
const metaPath = path.join(dataDirectory, "meta.json")
let metaCache: Meta | null = null
const fileCache = new Map<string, string>()

export function readDataFile(relativePath: string): string {
  const cached = fileCache.get(relativePath)
  if (cached !== undefined) return cached

  const absolutePath = path.resolve(dataDirectory, relativePath)
  if (
    path.isAbsolute(relativePath) ||
    (absolutePath !== dataDirectory && !absolutePath.startsWith(`${dataDirectory}${path.sep}`))
  ) {
    throw new CliError(
      {
        code: ErrorCodes.INTERNAL_ERROR,
        message: `离线数据包含无效路径：${relativePath}`,
      },
      1,
    )
  }
  if (!existsSync(absolutePath)) {
    throw new CliError({
      code: ErrorCodes.INTERNAL_ERROR,
      message: `缺少离线数据 ${absolutePath}，请重新安装或构建 @taroify/cli。`,
    })
  }
  const content = readFileSync(absolutePath, "utf8")
  fileCache.set(relativePath, content)
  return content
}

export function loadMeta(): Meta {
  if (metaCache) return metaCache
  if (!existsSync(metaPath)) {
    throw new CliError({
      code: ErrorCodes.INTERNAL_ERROR,
      message: `缺少离线数据 ${metaPath}，请重新安装或构建 @taroify/cli。`,
    })
  }
  metaCache = JSON.parse(readFileSync(metaPath, "utf8")) as Meta
  return metaCache
}
