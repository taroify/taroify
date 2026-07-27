import Popup from "../../popup"
import ToastComponent from "../toast"
import Toast from ".."
import "../style"

jest.mock("../../styles/style", () => ({}))
jest.mock("../../loading/style", () => ({}))
jest.mock("../../popup/style", () => ({}))
jest.mock("../index.scss", () => ({}))

describe("Toast entry", () => {
  it("exposes the component and imperative helpers", () => {
    expect(Toast).toBe(ToastComponent)
    expect(Toast.Backdrop).toBe(Popup.Backdrop)
    expect(Toast.open).toEqual(expect.any(Function))
    expect(Toast.loading).toEqual(expect.any(Function))
    expect(Toast.success).toEqual(expect.any(Function))
    expect(Toast.fail).toEqual(expect.any(Function))
    expect(Toast.close).toEqual(expect.any(Function))
    expect(Toast.setDefaultOptions).toEqual(expect.any(Function))
    expect(Toast.resetDefaultOptions).toEqual(expect.any(Function))
    expect(Toast.allowMultiple).toEqual(expect.any(Function))
  })
})
