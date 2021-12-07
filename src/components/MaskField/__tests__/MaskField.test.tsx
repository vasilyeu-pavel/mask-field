import React from "react"
import { shallow } from "enzyme"
import { IMaskInputProps } from "../../../types"
import { MaskField } from "../MaskField"

Object.defineProperty(document, "fonts", {
  value: {
    ready: Promise.resolve(),
  },
  writable: true,
})

describe("MaskField", () => {
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
    expect(shallow(<MaskField {...defaultProps} />))
      .toMatchSnapshot()
  })

  test("should render error container", () => {
    const setErrors = jest.fn()

    jest.spyOn(React, "useState")
      .mockImplementationOnce(() => [["error"], setErrors])

    const component = shallow(<MaskField {...defaultProps} withErrors />)

    expect(component.find(".errorContainer").length).toBe(1)
  })
})
