import { addUnit, unitToPx } from "../unit"

describe("Unit", () => {
  it("adds px to numeric values and preserves explicit units", () => {
    expect(addUnit()).toBe("")
    expect(addUnit(10)).toBe("10px")
    expect(addUnit("10")).toBe("10px")
    expect(addUnit("2em")).toBe("2em")
    expect(addUnit("20px")).toBe("20px")
  })

  // The default button contains prefix--contained --medium --default
  it("10px should be 10", () => {
    const unit = unitToPx("10px")
    expect(unit).toBe(10)
  })
})
