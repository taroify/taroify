import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { InputProps } from "@tarojs/components/types/Input"
import * as React from "react"
import { useState } from "react"
import Search, { type SearchInstance } from "../index"
import SearchAction from "../search-action"
import SearchInput from "../search-input"
import SearchLabel from "../search-label"
import SearchContext from "../search.context"

jest.mock("@tarojs/components", () => {
  const components = jest.requireActual("@tarojs/components")
  function Input(props: InputProps) {
    const { className, disabled, name, nativeProps, value, onInput, onFocus, onBlur, onConfirm } =
      props
    const { autocomplete, readonly, ...inputProps } = nativeProps ?? {}
    return (
      <div className={className}>
        <input
          {...inputProps}
          aria-label={props.ariaLabel}
          type={props.confirmType === "search" ? "search" : "text"}
          name={name}
          autoComplete={autocomplete as string}
          readOnly={Boolean(readonly)}
          disabled={disabled}
          value={value ?? ""}
          onClick={props.onClick as never}
          onChange={() => {}}
          onInput={(event) =>
            onInput?.({
              type: "input",
              detail: { value: event.currentTarget.value },
            } as never)
          }
          onFocus={(event) => onFocus?.({ detail: { value: event.currentTarget.value } } as never)}
          onBlur={(event) => onBlur?.({ detail: { value: event.currentTarget.value } } as never)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onConfirm?.({
                detail: { value: event.currentTarget.value },
                preventDefault: () => event.preventDefault(),
              } as never)
            }
          }}
        />
      </div>
    )
  }
  return Object.create(components, { Input: { value: Input } })
})

describe("Search on H5", () => {
  it("keeps the container id and supports the existing input and cancel events", async () => {
    const onCancel = jest.fn()
    const onChange = jest.fn()
    const onSearch = jest.fn()
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    render(
      <Search
        id="top-search"
        label="Items"
        action
        onCancel={onCancel}
        onChange={onChange}
        onSearch={onSearch}
        onFocus={onFocus}
        onBlur={onBlur}
      />,
    )

    const input = await screen.findByRole("searchbox")
    expect(document.getElementById("top-search")).toContainElement(input)
    expect(input).not.toHaveAttribute("id")
    expect(screen.getByText("Items").tagName).not.toBe("LABEL")

    fireEvent.focus(input)
    fireEvent.input(input, { target: { value: "abc" } })
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13 })
    fireEvent.blur(input)
    fireEvent.click(screen.getByText("取消"))

    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: "abc" } }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue("abc")
  })

  it("sets native input attributes, associates the label and exposes focus and blur", async () => {
    const ref = React.createRef<SearchInstance>()
    render(
      <Search
        ref={ref}
        id="container"
        inputId="keyword"
        name="q"
        autoComplete="off"
        label="Keyword"
        left={<input aria-label="Other input" />}
      />,
    )

    const input = await screen.findByLabelText("Keyword")
    expect(input).toBe(document.getElementById("keyword"))
    expect(document.querySelectorAll("#keyword")).toHaveLength(1)
    expect(input).toHaveAttribute("name", "q")
    expect(input).toHaveAttribute("autocomplete", "off")
    expect(document.getElementById("container")?.firstElementChild).toBe(
      screen.getByLabelText("Other input"),
    )

    act(() => ref.current?.focus())
    expect(input).toHaveFocus()
    act(() => ref.current?.blur())
    expect(input).not.toHaveFocus()
  })

  it("adds input and icon click handlers without replacing the custom icon handler", async () => {
    const onClick = jest.fn()
    const onClickInput = jest.fn()
    const onClickLeftIcon = jest.fn()
    const onClickRightIcon = jest.fn()
    const onCustomIconClick = jest.fn()
    const { container } = render(
      <Search
        onClick={onClick}
        onClickInput={onClickInput}
        onClickLeftIcon={onClickLeftIcon}
        onClickRightIcon={onClickRightIcon}
        rightIcon={
          <button type="button" onClick={onCustomIconClick}>
            Scan
          </button>
        }
      />,
    )

    fireEvent.click(await screen.findByRole("searchbox"))
    fireEvent.click(container.querySelector(".taroify-form-item__icon")!)
    fireEvent.click(screen.getByRole("button", { name: "Scan" }))
    expect(onClickInput).toHaveBeenCalledTimes(1)
    expect(onClickLeftIcon).toHaveBeenCalledTimes(1)
    expect(onCustomIconClick).toHaveBeenCalledTimes(1)
    expect(onClickRightIcon).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledTimes(3)
  })

  it("formats the input on blur when requested", async () => {
    const onChange = jest.fn()
    render(
      <Search formatter={(value) => value.trim()} formatTrigger="onBlur" onChange={onChange} />,
    )

    const input = await screen.findByRole("searchbox")
    fireEvent.input(input, { target: { value: " words " } })
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: " words " }) }),
    )
    fireEvent.blur(input)
    await waitFor(() => expect(input).toHaveValue("words"))
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: "words" }) }),
    )
  })

  it.each(["uncontrolled", "controlled"])(
    "clears %s input before notifying cancellation",
    async (mode) => {
      const onClear = jest.fn()
      const onChange = jest.fn()
      const onCancel = jest.fn()

      function Example() {
        const [value, setValue] = useState("")
        return (
          <Search
            action
            actionText="Dismiss"
            clearOnCancel
            clearTrigger="always"
            value={mode === "controlled" ? value : undefined}
            onChange={(event) => {
              onChange(event.detail.value)
              setValue(event.detail.value)
            }}
            onCancel={onCancel}
            onClear={onClear}
          />
        )
      }

      render(<Example />)
      const input = await screen.findByRole("searchbox")
      fireEvent.input(input, { target: { value: "words" } })
      expect(input).toHaveValue("words")
      fireEvent.click(screen.getByText("Dismiss"))

      await waitFor(() => expect(input).toHaveValue(""))
      expect(onChange.mock.calls).toEqual([["words"], [""]])
      expect(onChange.mock.invocationCallOrder[1]).toBeLessThan(
        onCancel.mock.invocationCallOrder[0],
      )
      expect(onClear).not.toHaveBeenCalled()
    },
  )

  it.each(["readonly", "disabled"] as const)("preserves the value when %s", async (state) => {
    const onClear = jest.fn()
    const onChange = jest.fn()
    const onCancel = jest.fn()
    const { container } = render(
      <Search
        {...{ [state]: true }}
        value="words"
        action
        clearOnCancel
        clearTrigger="always"
        onCancel={onCancel}
        onChange={onChange}
        onClear={onClear}
      />,
    )
    const input = await screen.findByRole("searchbox")
    expect(container.querySelector(".taroify-input__clear")).toBeNull()
    fireEvent.click(screen.getByText("取消"))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalled()
    expect(onClear).not.toHaveBeenCalled()
    expect(input).toHaveValue("words")
  })

  it("leaves custom actions in charge of their click behavior", async () => {
    const onCancel = jest.fn()
    const onChange = jest.fn()
    const onCustomClick = jest.fn()
    render(
      <Search
        value="words"
        action={
          <button type="button" onClick={onCustomClick}>
            Go
          </button>
        }
        actionText="Dismiss"
        clearOnCancel
        onCancel={onCancel}
        onChange={onChange}
      />,
    )
    await screen.findByRole("searchbox")
    fireEvent.click(screen.getByRole("button", { name: "Go" }))
    expect(onCustomClick).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.queryByText("Dismiss")).toBeNull()
  })

  it("keeps the deprecated round shape working and supports square and rounded", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {})
    try {
      const { container, rerender } = render(<Search shape="round" />)
      const content = container.querySelector(".taroify-search__content")
      expect(content).toHaveClass("taroify-search__content--rounded")
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('shape="rounded"'))

      rerender(<Search shape="rounded" />)
      expect(content).toHaveClass("taroify-search__content--rounded")

      rerender(<Search shape="square" />)
      expect(content).toHaveClass("taroify-search__content--square")
      expect(content).not.toHaveClass("taroify-search__content--rounded")
      expect(warn).toHaveBeenCalledTimes(1)
    } finally {
      warn.mockRestore()
    }
  })
})

it("preserves the standalone search action, input and label modules", () => {
  const onCancel = jest.fn()
  const onClick = jest.fn()
  render(
    <SearchContext.Provider value={{ onCancel }}>
      <SearchLabel className="extra-label">Keyword</SearchLabel>
      <SearchInput className="extra-input" value="abc" />
      <SearchAction />
      <SearchAction onClick={onClick}>Close</SearchAction>
    </SearchContext.Provider>,
  )

  expect(screen.getByText("Keyword")).toHaveClass("taroify-search__label", "extra-label")
  expect(screen.getByRole("textbox")).toHaveValue("abc")
  expect(screen.getByRole("textbox").parentElement).toHaveClass("extra-input")
  fireEvent.click(screen.getByText("取消"))
  fireEvent.click(screen.getByText("Close"))
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(onCancel).toHaveBeenCalledTimes(2)
})
