import React from "react"
import { shallow } from "enzyme"
import { IMaskInputProps } from "../../../types"
import { MaskInput } from "../MaskInput"

Object.defineProperty(document, "fonts", {
  value: {
    ready: Promise.resolve(),
  },
  writable: true,
})

describe("MaskInput", () => {
  const defaultProps: IMaskInputProps = {
    value: "value",
    separators: ["/"],
    mask: "value",
    placeholder: "placeholder",
    readOnly: false,
    errors: ["error"],
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("snapshot", () => {
    expect(shallow(<MaskInput {...defaultProps} />))
      .toMatchSnapshot()
  })

  test("should render error container", () => {
    const setErrors = jest.fn()

    jest.spyOn(React, "useState")
      .mockImplementationOnce(() => [["error"], setErrors])

    const component = shallow(<MaskInput {...defaultProps} withErrors />)

    expect(component.find(".errorContainer").length).toBe(1)
  })
})
