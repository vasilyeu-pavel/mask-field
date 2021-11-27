/* eslint @typescript-eslint/no-magic-numbers: 0 */

import { INPUT, LEFT, RIGHT } from "../constant"
import {
  getCharsInfo,
  getCursorPosition,
  getMaskOptions,
  getMaskValue,
  getSeparatorsArroundCursor,
  handleMaskClick,
  handleValidators,
  isNumber,
  makeHandleKeyDown,
  makePasteHandler,
  prepareValueFromMask,
  prepareValueToMask,
} from "../utils"

const setCursorPosition = jest.fn()

describe("getSeparatorsArroundCursor", () => {
  it("should return counts of separators", () => {
    expect(getSeparatorsArroundCursor(
      "xxx (xx) xxx xx xx",
      [" ", "(", ")"],
      3,
    )).toEqual({
      minus: 0,
      plus: 2,
    })

    expect(getSeparatorsArroundCursor(
      "xxx (xx) xxx xx xx",
      [" ", "(", ")"],
      4,
    )).toEqual({
      minus: 1,
      plus: 1,
    })

    expect(getSeparatorsArroundCursor(
      "xxx (xx) xxx xx xx",
      [" ", "(", ")"],
      1,
    )).toEqual({
      minus: 0,
      plus: 0,
    })

    expect(getSeparatorsArroundCursor(
      "xxx (xx) xxx xx xx",
      [" ", "(", ")"],
      5,
    )).toEqual({
      minus: 2,
      plus: 0,
    })

    expect(getSeparatorsArroundCursor(
      "xxx (xx) xxx xx xx",
      [" ", "(", ")"],
      6,
    )).toEqual({
      minus: 0,
      plus: 0,
    })

    expect(getSeparatorsArroundCursor(
      "xxx (xx) xxx xx xx",
      [" ", "(", ")"],
      4,
    )).toEqual({
      minus: 1,
      plus: 1,
    })
  })
})

describe("handleKeyDown", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it(`should key down ${LEFT}`, () => {
    makeHandleKeyDown(setCursorPosition)({
      key: LEFT,
      preventDefault: jest.fn(),
      target: {
        selectionStart: 1,
      },
    } as any)

    expect(setCursorPosition).toHaveBeenCalledWith(0)
  })

  it(`should key down ${RIGHT}`, () => {
    const countsCalled = 2

    makeHandleKeyDown(setCursorPosition)({
      key: RIGHT,
      preventDefault: jest.fn(),
      target: {
        selectionStart: 1,
      },
    } as any)

    expect(setCursorPosition).toHaveBeenCalledWith(countsCalled)
  })
})

describe("isNumber", () => {
  it("should return true", () => {
    expect(isNumber("1")).toBe(undefined)
    expect(isNumber("12")).toBe(undefined)
    expect(isNumber("32332")).toBe(undefined)
  })

  it("should return false", () => {
    expect(isNumber("f1")).toBe("Value is not a number")
    expect(isNumber("-12")).toBe("Value is not a number")
    expect(isNumber("+32332")).toBe("Value is not a number")
    expect(isNumber("32 332")).toBe("Value is not a number")
  })
})

describe("getMaskOptions", () => {
  it("should return array of indexes", () => {
    expect(getMaskOptions("__/__/__", ["/"])).toEqual({
      separators: [
        {
          position: 2,
          separator: "/",
        },
        {
          position: 5,
          separator: "/",
        },
      ],
      // 1 - CHAR_VALUE_TEMPLATE
      // 2 - CHAR_SEPARATOR_TEMPLATE
      template: [1, 1, 2, 1, 1, 2, 1, 1],
    })

    expect(getMaskOptions("xx xxx xxx xx", [" "])).toEqual({
      separators: [
        {
          position: 2,
          separator: " ",
        },
        {
          position: 6,
          separator: " ",
        },
        {
          position: 10,
          separator: " ",
        },
      ],
      // 1 - CHAR_VALUE_TEMPLATE
      // 2 - CHAR_SEPARATOR_TEMPLATE
      template: [1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1],
    })

    expect(getMaskOptions("xx (xxx) xxx xx", [" ", "(", ")"])).toEqual({
      separators: [
        {
          position: 2, // eslint-disable-line @typescript-eslint/no-magic-numbers
          separator: " ",
        },
        {
          position: 3, // eslint-disable-line @typescript-eslint/no-magic-numbers
          separator: "(",
        },
        {
          position: 7, // eslint-disable-line @typescript-eslint/no-magic-numbers
          separator: ")",
        },
        {
          position: 8, // eslint-disable-line @typescript-eslint/no-magic-numbers
          separator: " ",
        },
        {
          position: 12, // eslint-disable-line @typescript-eslint/no-magic-numbers
          separator: " ",
        },
      ],
      // 1 - CHAR_VALUE_TEMPLATE
      // 2 - CHAR_SEPARATOR_TEMPLATE
      template: [1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1],
    })

    expect(getMaskOptions("xxxxxxxx-xx", ["-"])).toEqual({
      separators: [
        {
          position: 8,
          separator: "-",
        },
      ],
      // 1 - CHAR_VALUE_TEMPLATE
      // 2 - CHAR_SEPARATOR_TEMPLATE
      template: [1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
    })
  })
})

describe("prepareValueFromMask", () => {
  it("should splice all separator", () => {
    expect(prepareValueFromMask("11/11/11", ["/"])).toBe("111111")
    expect(prepareValueFromMask("xx xxx xxx xx", [" "])).toBe("xxxxxxxxxx")
    expect(prepareValueFromMask("xxxxxxxx-xx", ["-"])).toBe("xxxxxxxxxx")
  })
})

describe("prepareValueToMask", () => {
  it("should prepare value to mask style", () => {
    expect(prepareValueToMask("111111", "__/__/__", ["/"]))
      .toStrictEqual({ maskedValue: "11/11/11", originalValue: "111111" })

    expect(prepareValueToMask("1231", "xx xxx xxx xx", [" "]))
      .toStrictEqual({ maskedValue: "12 31", originalValue: "1231" })

    expect(prepareValueToMask("1", "xx xxx xxx xx", [" "]))
      .toStrictEqual({ maskedValue: "1", originalValue: "1" })
  })
})

describe("handleMaskClick", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should call setCursorPosition", () => {
    const handleMaskFocus = jest.fn()
    const focus = jest.fn()
    const valueToMaskStyle = "12"
    const selectionStart = 1

    handleMaskClick({
      valueToMaskStyle,
      setCursorPosition,
      handleMaskFocus,
      isTouch: false,
    })({
      focus,
      tagName: INPUT,
      selectionStart,
    } as any)

    expect(handleMaskFocus).toHaveBeenCalledWith(true)
    expect(focus).toHaveBeenCalled()
    expect(setCursorPosition).toHaveBeenCalledWith(selectionStart)
  })

  it("should returned if click not on input", () => {
    const handleMaskFocus = jest.fn()
    const focus = jest.fn()
    const valueToMaskStyle = "12"
    const selectionStart = 1

    handleMaskClick({
      valueToMaskStyle,
      setCursorPosition,
      handleMaskFocus,
      isTouch: false,
    })({
      focus,
      tagName: "SPAN",
      selectionStart,
    } as any)

    expect(handleMaskFocus).not.toHaveBeenCalled()
    expect(focus).toHaveBeenCalled()
    expect(setCursorPosition).not.toHaveBeenCalled()
  })

  it("should call moveCursorToEnd with maskValue length", () => {
    const handleMaskFocus = jest.fn()
    const focus = jest.fn()
    const valueToMaskStyle = "12"
    const selectionStart = undefined

    handleMaskClick({
      valueToMaskStyle,
      setCursorPosition,
      handleMaskFocus,
      isTouch: false,
    })({
      focus,
      tagName: INPUT,
      selectionStart,
    } as any)

    expect(handleMaskFocus).toHaveBeenCalledWith(true)
    expect(focus).toHaveBeenCalled()
    expect(setCursorPosition).toHaveBeenCalledWith(2)
  })
})

describe("getCursorPosition", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return correct cursor position", () => {
    expect(getCursorPosition({
      nextMaskValue: "01/01/1999",
      toMove: 10,
      prevMaskValue: "01/01/199",
      separators: ["/"],
      cursorPosition: 9,
      toMoveCursorAfterPasted: 0,
      mask: "xx/xx/xxxx",
    })).toEqual({
      toMoveCursor: 10,
      toInsertValue: "01/01/1999",
    })

    expect(getCursorPosition({
      nextMaskValue: "01/01/19",
      toMove: 8,
      prevMaskValue: "01/01/199",
      separators: ["/"],
      cursorPosition: 9,
      toMoveCursorAfterPasted: 0,
      mask: "xx/xx/xxxx",
    })).toEqual({
      toMoveCursor: 8,
      toInsertValue: "01/01/19",
    })

    expect(getCursorPosition({
      nextMaskValue: "11/22/999",
      toMove: 2,
      prevMaskValue: "11/22/999",
      separators: ["/"],
      cursorPosition: 3,
      toMoveCursorAfterPasted: 0,
      mask: "xx/xx/xxxx",
    })).toEqual({
      toMoveCursor: 1,
      toInsertValue: "1/22/999",
    })

    expect(getCursorPosition({
      nextMaskValue: "11//22/999",
      toMove: 2,
      prevMaskValue: "11//22/999",
      separators: ["/"],
      cursorPosition: 3,
      toMoveCursorAfterPasted: 0,
      mask: "xx/xx/xxxx",
    })).toEqual({
      toMoveCursor: 1,
      toInsertValue: "1//22/999",
    })

    expect(getCursorPosition({
      nextMaskValue: "11/22/999",
      toMove: 2,
      prevMaskValue: "11/22/999",
      separators: ["/"],
      cursorPosition: 2,
      toMoveCursorAfterPasted: 0,
      mask: "xx/xx/xxxx",
    })).toEqual({
      toMoveCursor: 3,
      toInsertValue: "11/29/99",
    })

    expect(getCursorPosition({
      nextMaskValue: "11//22/999",
      toMove: 2,
      prevMaskValue: "11//22/999",
      separators: ["/"],
      cursorPosition: 2,
      toMoveCursorAfterPasted: 0,
      mask: "xx//xx/xxxx",
    })).toEqual({
      toMoveCursor: 4,
      toInsertValue: "11//29/99",
    })

    // paste
    expect(getCursorPosition({
      nextMaskValue: "11/44",
      toMove: 4,
      prevMaskValue: "11",
      separators: ["/"],
      cursorPosition: 2,
      toMoveCursorAfterPasted: 3,
      mask: "xx/xx/xxxx",
    })).toEqual({
      toMoveCursor: 5,
      toInsertValue: "11/44",
    })
  })
})

describe("handleValidators", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should not return errors", () => {
    expect(handleValidators("12")([isNumber])).toBe(undefined)
    expect(handleValidators("1")([isNumber])).toBe(undefined)
    expect(handleValidators("123213213")([isNumber])).toBe(undefined)
  })

  it("should return errors", () => {
    expect(handleValidators("12f")([isNumber])).toEqual(["Value is not a number"])
    expect(handleValidators("1f")([isNumber])).toEqual(["Value is not a number"])
    expect(handleValidators("123213213f")([isNumber])).toEqual(["Value is not a number"])
  })
})

describe("getMaskValue", () => {
  it("return correct value", () => {
    const errorsCB = jest.fn()

    expect(getMaskValue({
      value: "123",
      selectionStart: 3,
      mask: "xx/xx/xx",
      separators: ["/"],
      validators: [isNumber],
      prevMaskValue: "12",
      cursorPosition: 2,
      errorsCB,
      pastedValue: "",
    })).toEqual({
      toMoveCursor: 4,
      toInsertValue: "12/3",
    })

    expect(getMaskValue({
      value: "12/",
      selectionStart: 3,
      mask: "xx/xx/xx",
      separators: ["/"],
      validators: [isNumber],
      prevMaskValue: "12/3",
      cursorPosition: 4,
      errorsCB,
      pastedValue: "",
    })).toEqual({
      toMoveCursor: 2,
      toInsertValue: "12",
    })

    expect(getMaskValue({
      value: "12",
      selectionStart: 3,
      mask: "xx/xx/xx",
      separators: ["/"],
      validators: [isNumber],
      prevMaskValue: "12/3",
      cursorPosition: 4,
      errorsCB,
      pastedValue: "",
    })).toEqual({
      toMoveCursor: 2,
      toInsertValue: "12",
    })

    // paste
    expect(getMaskValue({
      value: "",
      selectionStart: 0,
      mask: "xx/xx/xx",
      separators: ["/"],
      validators: [isNumber],
      prevMaskValue: "",
      cursorPosition: 0,
      errorsCB,
      pastedValue: "12355",
    })?.toMoveCursor).toBe(7)

    // paste to middle
    expect(getMaskValue({
      cursorPosition: 5,
      errorsCB: jest.fn(),
      mask: "DD/MM/YYYY",
      pastedValue: "44",
      prevMaskValue: "12/35",
      selectionStart: 7,
      separators: ["/"],
      validators: [isNumber],
      value: "12/3544",
    })?.toMoveCursor).toBe(8)

    expect(getMaskValue({
      cursorPosition: 3,
      errorsCB: jest.fn(),
      mask: "DD/MM/YYYY",
      pastedValue: "44",
      prevMaskValue: "12/35",
      selectionStart: 5,
      separators: ["/"],
      validators: [isNumber],
      value: "12/4435",
    })?.toMoveCursor).toBe(5)

    expect(getMaskValue({
      value: "12/35444444",
      selectionStart: 11,
      mask: "DD/MM/YYYY",
      separators: ["/"],
      validators: [isNumber],
      prevMaskValue: "12/35",
      cursorPosition: 5,
      errorsCB,
      pastedValue: "444444",
    })?.toMoveCursor).toBe(10)

    expect(getMaskValue({
      value: "12/3544444444444",
      selectionStart: 16,
      mask: "xx/xx/xxxx",
      separators: ["/"],
      validators: [isNumber],
      prevMaskValue: "12/35",
      cursorPosition: 5,
      errorsCB,
      pastedValue: "44444444444",
    })?.toMoveCursor).toBe(10)

    expect(errorsCB).toHaveBeenCalledTimes(0)
  })

  it("should call errorCB", () => {
    const errorsCB = jest.fn()

    expect(getMaskValue({
      value: "12f",
      selectionStart: 2,
      mask: "xx/xx/xx",
      separators: ["/"],
      validators: [isNumber],
      prevMaskValue: "12/3",
      cursorPosition: 4,
      errorsCB,
      pastedValue: "",
    })).toBe(null)

    expect(errorsCB).toHaveBeenCalledWith(["Value is not a number"])
  })

  it("should split value", () => {
    expect(getMaskValue({
      value: "12321321321321",
      selectionStart: 0,
      mask: "xx/xx/xx",
      separators: ["/"],
      validators: [isNumber],
      prevMaskValue: "12/32/1",
      cursorPosition: 7,
      errorsCB: jest.fn(),
      pastedValue: "",
    })).toEqual({
      toInsertValue: "12/32/13",
      toMoveCursor: 8,
    })
  })

  it("getCharsInfo", () => {
    expect(getCharsInfo(
      "xx/xx/xxxx",
      ["/"],
      0,
      "1234",
    )).toEqual({
      chars: 4,
      separators: 1,
    })

    expect(getCharsInfo(
      "xx/xx/xxxx",
      ["/"],
      0,
      "123456",
    )).toEqual({
      chars: 6,
      separators: 2,
    })

    expect(getCharsInfo(
      "xx/xx/xxxx",
      ["/"],
      0,
      "12345612321321321",
    )).toEqual({
      chars: 8,
      separators: 2,
    })

    expect(getCharsInfo(
      "xx/xx/xxxx",
      ["/"],
      3,
      "12345612321321321",
    )).toEqual({
      chars: 6,
      separators: 1,
    })
  })

  it("makePasteHandler", () => {
    const setPastedValue = jest.fn()
    const pastedData = "pastedData"

    makePasteHandler(setPastedValue)({
      clipboardData: {
        getData: jest.fn(() => pastedData),
      },
    } as any)

    expect(setPastedValue).toHaveBeenCalledWith(pastedData)
  })
})
