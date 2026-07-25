import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const apiVersion = "2022-11-28"
const defaultRepository = "taroify/taroify"
const releasesPerPage = 100
const updatesHeading = "## 更新内容"

function normalizeTag(tag) {
  return tag.replace(/^v(?=\d)/u, "")
}

function contributorLink(match, whitespace, username, botSuffix = "") {
  const profile = botSuffix
    ? `https://github.com/apps/${username}`
    : `https://github.com/${username}`
  return `${whitespace}[@${username}${botSuffix}](${profile})`
}

function pullRequestLink(url, number, offset, source) {
  const precedingCharacter = source[offset - 1]
  if (precedingCharacter === "(" || precedingCharacter === "[") {
    return url
  }
  return `[#${number}](${url})`
}

function normalizeReleaseBody(body) {
  return body
    .replace(/\r\n?/gu, "\n")
    .trim()
    .replace(/^<!--[\s\S]*?-->\s*/u, "")
    .replace(/^`\d{4}-\d{2}-\d{2}`\s*/u, "")
    .replaceAll("https://github.com/mallfoundry/taroify", "https://github.com/taroify/taroify")
    .replace(/^(#{1,4})(?=\s)/gmu, (heading) => `##${heading}`)
    .replace(
      /\[(?:\*\*)?(https:\/\/github\.com\/taroify\/taroify\/pull\/(\d+))(?:\*\*)?\]\(\1\)/gu,
      (match, url, number) => `[#${number}](${url})`,
    )
    .replace(/https:\/\/github\.com\/taroify\/taroify\/pull\/(\d+)/gu, pullRequestLink)
    .replace(
      /(^|[ \t])@([A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?)(\[bot\])?(?=\s|$)/gmu,
      contributorLink,
    )
    .trim()
}

function renderRelease(release) {
  const date = release.published_at?.slice(0, 10) || release.created_at?.slice(0, 10)
  const body = normalizeReleaseBody(release.body || "")
  const fallback = `[查看 GitHub Release](${release.html_url})`

  return [
    `### ${release.tag_name}`,
    "",
    ...(date ? [`\`${date}\``, ""] : []),
    body || fallback,
  ].join("\n")
}

export function addMissingReleases(source, releases) {
  const headingIndex = source.indexOf(updatesHeading)
  if (headingIndex < 0) {
    throw new Error(`Changelog is missing the "${updatesHeading}" heading`)
  }

  const existingVersions = new Set(
    [...source.matchAll(/^###\s+(v?\d[^\s]*)\s*$/gmu)].map((match) => normalizeTag(match[1])),
  )
  const missingReleases = releases.filter(
    (release) =>
      !release.draft &&
      release.published_at &&
      !existingVersions.has(normalizeTag(release.tag_name)),
  )

  if (missingReleases.length === 0) {
    return { content: source, added: [] }
  }

  const insertionIndex = headingIndex + updatesHeading.length
  const generated = missingReleases.map(renderRelease).join("\n\n")
  const content = [
    source.slice(0, insertionIndex).trimEnd(),
    generated,
    source.slice(insertionIndex).trimStart(),
  ]
    .filter(Boolean)
    .join("\n\n")

  return {
    content: content.endsWith("\n") ? content : `${content}\n`,
    added: missingReleases.map((release) => release.tag_name),
  }
}

export async function fetchPublishedReleases({
  repository = process.env.TAROIFY_CHANGELOG_REPOSITORY || defaultRepository,
  token = process.env.GITHUB_TOKEN,
  fetchImplementation = globalThis.fetch,
} = {}) {
  if (typeof fetchImplementation !== "function") {
    throw new TypeError("A fetch implementation is required to generate the changelog")
  }

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": apiVersion,
    "User-Agent": "taroify-changelog-generator",
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const releases = []
  for (let page = 1; ; page += 1) {
    const url = new URL(`https://api.github.com/repos/${repository}/releases`)
    url.searchParams.set("per_page", String(releasesPerPage))
    url.searchParams.set("page", String(page))

    const response = await fetchImplementation(url, { headers })
    if (!response.ok) {
      throw new Error(`GitHub Releases API returned ${response.status} for ${url}`)
    }

    const pageReleases = await response.json()
    if (!Array.isArray(pageReleases)) {
      throw new TypeError("GitHub Releases API returned an unexpected response")
    }

    releases.push(...pageReleases)
    if (pageReleases.length < releasesPerPage) {
      break
    }
  }

  return releases
}

export async function updateChangelog(filePath, options) {
  const [source, releases] = await Promise.all([
    readFile(filePath, "utf8"),
    fetchPublishedReleases(options),
  ])
  const result = addMissingReleases(source, releases)

  if (result.added.length > 0) {
    await writeFile(filePath, result.content)
  }

  return result
}

const scriptPath = fileURLToPath(import.meta.url)
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  const siteRoot = path.resolve(path.dirname(scriptPath), "..")
  const target = path.resolve(process.argv[2] || path.join(siteRoot, "content/changelog/index.md"))

  updateChangelog(target)
    .then(({ added }) => {
      console.log(
        added.length > 0
          ? `Added ${added.join(", ")} to ${target}`
          : `Changelog is already up to date: ${target}`,
      )
    })
    .catch((error) => {
      console.error(error)
      process.exitCode = 1
    })
}
