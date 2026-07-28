import type { HomeLayoutProps } from "@rspress/core/theme-original"
import { animate, cleanInlineStyles, createScope, type Scope } from "animejs"
import { useEffect, useRef, useState } from "react"
import { ComponentShowcase } from "../components/ComponentShowcase"

function HomeLayoutMarkdown() {
  return (
    <>
      {`# Taroify

> 轻量、可靠的小程序端 Taro React UI 组件库

面向多端应用的高质量组件与工具，提供完整类型提示、主题定制和一致的交互体验。

\`yarn add @taroify/core\`
`}
    </>
  )
}

function HomeLayoutInteractive(_props: HomeLayoutProps) {
  const [copied, setCopied] = useState(false)
  const root = useRef<HTMLElement>(null)
  const motionScope = useRef<Scope | null>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    motionScope.current = createScope({ root }).add((scope) => {
      animate(".tf-home-single__copy", {
        opacity: { from: 0 },
        y: { from: 20 },
        duration: 920,
        ease: "out(4)",
        onComplete: cleanInlineStyles,
      })

      scope?.add("copyFeedback", () => {
        animate(".tf-install-command", {
          scale: [1, 0.985, 1],
          duration: 360,
          ease: "out(3)",
          onComplete: cleanInlineStyles,
        })
      })
    })

    return () => {
      motionScope.current?.revert()
      motionScope.current = null
    }
  }, [])

  const copyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText("yarn add @taroify/core")
    } catch {
      // Clipboard access can be unavailable in non-secure preview environments.
    }

    setCopied(true)
    motionScope.current?.methods.copyFeedback?.()
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <main className="tf-home" ref={root}>
      <section className="tf-home-single">
        <ComponentShowcase />

        <div className="tf-home-single__copy">
          <h1>Taroify</h1>

          <h2 className="tf-home-copy-line">
            轻量、可靠的
            <br />
            <span>Taro React</span> 组件库
          </h2>

          <p className="tf-home-promise tf-home-copy-line">小程序界面，少写一点，可靠更多。</p>

          <p className="tf-home-description tf-home-copy-line">
            面向多端应用的高质量组件与工具，提供完整类型提示、主题定制和一致的交互体验。
          </p>

          <div className="tf-install-command tf-home-copy-line">
            <span aria-hidden="true">$</span>
            <code>yarn add @taroify/core</code>
            <button type="button" onClick={copyInstallCommand} aria-label="复制安装命令">
              {copied ? (
                <output className="tf-install-command__copied">已复制</output>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="8" y="8" width="11" height="11" rx="2" />
                  <path d="M16 6V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h1" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export function HomeLayout(props: HomeLayoutProps) {
  if (import.meta.env.SSG_MD) {
    return <HomeLayoutMarkdown />
  }

  return <HomeLayoutInteractive {...props} />
}
