import { compile } from "sass"
import { prefixClassname } from "../../styles"

describe("<Checkbox /> styles", () => {
  it("keeps a checkbox visible in the value area of a cell", () => {
    const style = document.createElement("style")
    style.textContent = [
      compile(require.resolve("../../cell/index.scss")).css,
      compile(require.resolve("../index.scss")).css,
    ].join("\n")
    document.head.append(style)
    document.body.innerHTML = `
      <div class="${prefixClassname("checkbox-group")}">
        <div class="${prefixClassname("cell__value")}"></div>
      </div>
    `

    try {
      const value = document.querySelector(`.${prefixClassname("cell__value")}`)

      expect(value).not.toBeNull()
      expect(getComputedStyle(value as Element).flex).toBe("0 0 auto")
    } finally {
      document.body.replaceChildren()
      style.remove()
    }
  })
})
