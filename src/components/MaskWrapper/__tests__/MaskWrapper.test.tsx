import React from "react"
import { mount, shallow } from "enzyme"
import { IMaskWrapperProps, typeCasting } from "../../../types"
import { setCSSVar } from "../../../utils"
import { MaskWrapper } from "../MaskWrapper"

jest.mock("../../../utils", () => {
  const originalModule = jest.requireActual("../../../utils")

  return {
    ...originalModule,
    setCSSVar: jest.fn(),
  }
})

jest.mock("react", () => {
  const originalModule = jest.requireActual("react")

  return {
    ...originalModule,
    useState: jest.fn(),
  }
})

Object.defineProperty(document, "fonts", {
  value: {
    ready: Promise.resolve(),
  },
  writable: true,
})

const mask = "YYYYMMDD-NNNN"

const defaultProps = typeCasting<IMaskWrapperProps>({
  mask,
  placeholder: "Personal number",
  value: "1",
  children: function fakeChildren () { return <input /> },
  separators: ["-"],
  onChange: jest.fn(),
  errors: null,
  modifiers: "mask",
  handleErrors: jest.fn(),
})

describe("MaskWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("snapshot", () => {
    jest.spyOn(React, "useState")
      .mockImplementationOnce(() => ["YYYY", jest.fn()])
      .mockImplementationOnce(() => [false, jest.fn()])
      .mockImplementationOnce(() => [0, jest.fn()])
      .mockImplementationOnce(() => ["", jest.fn()])
      .mockImplementationOnce(() => ["", jest.fn()])

    const component = shallow(<MaskWrapper {...defaultProps} />)

    expect(component).toMatchSnapshot()
    expect(component.find(".focus").length).toBe(0)
  })

  test("should exist focus class", () => {
    jest.spyOn(React, "useState")
      .mockImplementationOnce(() => ["YYYY", jest.fn()])
      .mockImplementationOnce(() => [true, jest.fn()])
      .mockImplementationOnce(() => [0, jest.fn()])
      .mockImplementationOnce(() => ["", jest.fn()])
      .mockImplementationOnce(() => ["", jest.fn()])

    const component = shallow(<MaskWrapper {...defaultProps} />)

    expect(component.find(".focus").length).toBe(1)
  })

  test("should exist error class", () => {
    jest.spyOn(React, "useState")
      .mockImplementationOnce(() => ["YYYY", jest.fn()])
      .mockImplementationOnce(() => [true, jest.fn()])
      .mockImplementationOnce(() => [0, jest.fn()])
      .mockImplementationOnce(() => ["", jest.fn()])
      .mockImplementationOnce(() => ["", jest.fn()])

    const component = shallow(<MaskWrapper {...defaultProps} errors={["error"]} />)

    expect(component.find(".wrong").length).toBe(1)
  })

  test("should set maskValue in useEffect", () => {
    const value = "101"
    const offsetWidth = 100

    const setMaskValue = jest.fn()

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: offsetWidth,
    })

    jest.spyOn(React, "useState")
      .mockImplementationOnce(() => ["10", setMaskValue])
      .mockImplementationOnce(() => [true, jest.fn()])
      .mockImplementationOnce(() => [1, jest.fn()])
      .mockImplementationOnce(() => [value, jest.fn()])
      .mockImplementationOnce(() => ["", jest.fn()])

    jest.spyOn(React, "useRef").mockImplementationOnce(() => ({ current: null }))

    mount(<MaskWrapper {...defaultProps} value={value} />)

    expect(setMaskValue).toHaveBeenCalledWith("YMMDD-NNNN")
  })

  test("should set defaultMask in useEffect (!value)", () => {
    const value = ""
    const offsetWidth = 100

    const setMaskValue = jest.fn()

    jest.spyOn(React, "useState")
      .mockImplementationOnce(() => ["12", setMaskValue])
      .mockImplementationOnce(() => [true, jest.fn()])
      .mockImplementationOnce(() => [1, jest.fn()])
      .mockImplementationOnce(() => [value, jest.fn()])
      .mockImplementationOnce(() => ["", jest.fn()])

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: offsetWidth,
    })

    jest.spyOn(React, "useRef").mockImplementationOnce(() => ({ current: null }))

    mount(<MaskWrapper {...defaultProps} value={value} />)

    expect(setMaskValue).toHaveBeenCalledWith(mask)
  })

  test("should call setCssVar in useEffect", () => {
    const value = "101"
    const maskValue = "101"
    const offsetWidth = 100

    const setMaskValue = jest.fn()

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: offsetWidth,
    })

    jest.spyOn(React, "useState")
      .mockImplementationOnce(() => [maskValue, setMaskValue])
      .mockImplementationOnce(() => [true, jest.fn()])
      .mockImplementationOnce(() => [1, jest.fn()])
      .mockImplementationOnce(() => [value, jest.fn()])
      .mockImplementationOnce(() => ["", jest.fn()])

    mount(<MaskWrapper {...defaultProps} value={value} />)

    expect(setCSSVar).toBeCalledTimes(1)
  })

  test("should call setCssVar in useEffect 2 counts", async () => {
    const value = "101"
    const maskValue = "101"
    const offsetWidth = 100
    const countsCalled = 2

    const setMaskValue = jest.fn()

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: offsetWidth,
    })

    jest.spyOn(React, "useState")
      .mockImplementationOnce(() => [maskValue, setMaskValue])
      .mockImplementationOnce(() => [true, jest.fn()])
      .mockImplementationOnce(() => [1, jest.fn()])
      .mockImplementationOnce(() => [value, jest.fn()])
      .mockImplementationOnce(() => ["", jest.fn()])

    await mount(<MaskWrapper {...defaultProps} value={value} />)

    expect(setCSSVar).toBeCalledTimes(countsCalled)
  })

  test("should call moveCursorToEnd in useEffect", async () => {
    const value = "101"
    const offsetWidth = 100
    const cursorPosition = value.length
    const setCursorPosition = jest.fn()

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: offsetWidth,
    })

    jest.spyOn(React, "useState")
      .mockImplementationOnce(() => [value, jest.fn()])
      .mockImplementationOnce(() => [true, jest.fn()])
      .mockImplementationOnce(() => [1, setCursorPosition])
      .mockImplementationOnce(() => [value, jest.fn()])
      .mockImplementationOnce(() => ["", jest.fn()])

    mount(<MaskWrapper {...defaultProps} value={value} />)

    expect(setCursorPosition).toBeCalledWith(cursorPosition)
  })

  test("should call setValueToMaskStyle in useEffect", async () => {
    const value = "10112321333"
    const offsetWidth = 100
    const setValueToMaskStyle = jest.fn()

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: offsetWidth,
    })

    jest.spyOn(React, "useState")
      .mockImplementationOnce(() => [value, jest.fn()])
      .mockImplementationOnce(() => [true, jest.fn()])
      .mockImplementationOnce(() => [1, jest.fn()])
      .mockImplementationOnce(() => [value, setValueToMaskStyle])
      .mockImplementationOnce(() => ["", jest.fn()])

    mount(<MaskWrapper {...defaultProps} value={value} />)

    expect(setValueToMaskStyle).toBeCalledWith("10112321-333")
  })
})
