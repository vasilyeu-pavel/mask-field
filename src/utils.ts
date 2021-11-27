import {
  CHAR_SEPARATOR_TEMPLATE,
  CHAR_VALUE_TEMPLATE,
  INPUT,
  LEFT,
  MIN_MAX_LENGTH,
  PRESS_KEY_EVENTS,
  RIGHT,
} from "./constant"
import {
  TSeparators,
  TSetCursorPosition,
  TValidator,
} from "./types"

export const makeHandleKeyDown = (setCursorPosition: (value: number) => void) =>
  (e: KeyboardEvent) => {
    if (!PRESS_KEY_EVENTS.includes(e.key)) return

    e.preventDefault()

    const { selectionStart } = e.target as HTMLInputElement
    const cursorPosition = selectionStart || 0

    switch (e.key) {
      case LEFT: {
        if (cursorPosition - 1 < 0) return

        return setCursorPosition(cursorPosition - 1)
      }
      // eslint-disable-next-line no-fallthrough
      case RIGHT: return setCursorPosition(cursorPosition + 1)
    }
  }

export const isNumber = (value: string): string | undefined => {
  if (!/^\d+$/.test(value)) {
    return "Value is not a number"
  }
}

export const getMaskOptions = (
  mask: string,
  separators: string[],
  startPosition = 0,
  finishedPosition?: number,
) => {
  const result: {
    separators: {
      separator: string,
      position: number,
    }[],
    template: number[],
  } = {
    separators: [],
    template: [],
  }

  for (let i = startPosition; i < (finishedPosition || mask.length); i++) { // eslint-disable-line no-plusplus,max-len
    const char = mask[i]

    if (separators.includes(char)) {
      result.separators.push({ separator: char, position: i })
      result.template.push(CHAR_SEPARATOR_TEMPLATE)
    } else {
      result.template.push(CHAR_VALUE_TEMPLATE)
    }
  }

  return result
}

/**
 * prepares mask value to origin view
 * "12/32/12" -> "123212"
 * @param value
 */
export const prepareValueFromMask = (value: string, separators: string[]): string => {
  let preparedValue = value

  separators.forEach(separator => {
    preparedValue = preparedValue.replace(new RegExp(`\\${separator}`, "g"), "")
  })

  return preparedValue
}

/**
 * prepares value to mask style
 * маска "__/__/__"
 * value "123" -> "12/3"
 * @param value
 */
export const prepareValueToMask = (
  value: string,
  mask: string,
  separators: string[],
): {
  maskedValue: string,
  originalValue: string,
} => {
  const originalValue = prepareValueFromMask(value, separators)
  const indexes = getMaskOptions(mask, separators).separators
  const arr = originalValue.split("")

  indexes.forEach(({ position, separator }) => {
    if (position < arr.length) {
      arr.splice(position, 0, separator)
    }
  })

  return {
    maskedValue: arr.join(""),
    originalValue,
  }
}

/**
 * var for saved cursorPosition when was called click on label/span
 */
let tmp: number | null = null

/**
 * saves current cursor position on click by input field
 */
export const handleMaskClick = (
  {
    valueToMaskStyle,
    setCursorPosition,
    handleMaskFocus,
    isTouch,
  }: {
      valueToMaskStyle: string,
      setCursorPosition: TSetCursorPosition,
      handleMaskFocus: (isFocus: boolean) => void,
      isTouch: boolean,
    },
) => (target: HTMLInputElement | null) => {
  if (!target) return

  // set focus
  // needs for firefox when we set cursor ff trying to highlight all input text
  target.focus()

  if (target.tagName !== INPUT) {
    // saving where move cursor after click on input
    tmp = valueToMaskStyle.length

    // on touch events aren't skipping because they didn't call two times
    if (!isTouch) return
  }

  // if we saved tmp position we should call with this value
  // another case we can use current cursor position from input (selectionStart)
  const value = tmp || target.selectionStart || 0

  setCursorPosition(value)

  handleMaskFocus(true)
  // reset tmp
  tmp = null
}

export /**
 * MASK MAIN METHOD (CORE)
 * moves cursor
 * returns value in mask style
 */
const getCursorPosition = (
  {
    nextMaskValue,
    toMove,
    prevMaskValue,
    separators,
    cursorPosition,
    toMoveCursorAfterPasted,
    mask,
  }: {
      nextMaskValue: string,
      toMove: number, // default from input
      prevMaskValue: string,
      separators: TSeparators,
      cursorPosition: number,
      toMoveCursorAfterPasted: number,
      mask: string,
    },
): {
  toMoveCursor: number,
  toInsertValue: string,
} => {
  const diff = nextMaskValue.length - prevMaskValue.length

  const originalDiff = (prepareValueFromMask(nextMaskValue, separators).length -
      prepareValueFromMask(prevMaskValue, separators).length)

  let toMoveCursor = nextMaskValue.length

  const {
    plus,
    minus,
  } = getSeparatorsArroundCursor(mask, separators, cursorPosition)

  // paste mode
  if (toMoveCursorAfterPasted) {
    // was added to cursor position available offsets for sliced pasted string
    // empty field -> paste 123 -> 12/3
    // (toMoveCursorAfterPasted = 4 about 3 digits from value and one of separator)

    return {
      toMoveCursor: cursorPosition + toMoveCursorAfterPasted,
      toInsertValue: nextMaskValue,
    }
  }

  // remove all separators (left) (backspace)
  if (cursorPosition > toMove && separators.includes(nextMaskValue[toMove])) {
    const removedSymbols = 1

    // 12/|2 => 1|2
    // 12/| => 1|
    toMoveCursor = cursorPosition - minus - removedSymbols

    return {
      toMoveCursor,
      // was removed prev symbol if you touch backspace after separator // 123 |41 -> 12|4 1
      toInsertValue: nextMaskValue
        .split("")
        .filter((a, i) => !!(i !== toMoveCursor))
        .join(""),
    }
  }

  // remove one symbol left
  // 123| => 12| (diff=1)
  // 12/3| => 12| (diff=2)
  if (diff < 0) {
    const isRemoveToLeft = cursorPosition > toMove
    const removedChar = 1
    const prevChar = 1
    let toMoveCursor = toMove

    if (isRemoveToLeft && separators.includes(mask[cursorPosition - removedChar - prevChar])) {
      const {
        minus,
      } = getSeparatorsArroundCursor(mask, separators, cursorPosition - prevChar)

      toMoveCursor = toMove - minus
    }

    return {
      toMoveCursor,
      toInsertValue: nextMaskValue,
    }
  }

  // remove all separator by delete btn (right)
  // 12|/45 => 12/|5
  if (toMove === cursorPosition && separators.includes(nextMaskValue[cursorPosition])) {
    toMoveCursor = cursorPosition + plus

    return {
      // 123| 3 -> 123 | -> 123|
      // toMoveCursor - 4 toInsertValue - 3(123) -> should set toInsertValue.length
      toMoveCursor: toMoveCursor > nextMaskValue.length ? nextMaskValue.length : toMoveCursor,
      // was removed next symbol if you touch delete before separator // 123| 3 -> 123 | -> 123|
      // and should prepare new input value to mask style (remove separators)
      toInsertValue: prepareValueToMask(
        nextMaskValue
          .split("")
          .filter((a, i) => !!(i !== toMoveCursor))
          .join(""),
        mask,
        separators,
      ).maskedValue,
    }
  }

  // add
  if (diff > 0) {
    // добавить диф и сместить на кол-во сепараторов если след. сепаратор

    return {
      toMoveCursor: cursorPosition + plus + originalDiff,
      toInsertValue: nextMaskValue,
    }
  }

  // was called when input was full
  if (diff === 0 && toMoveCursor !== cursorPosition) {
    // 1|2/12/1992 => 13|/21/2199
    toMoveCursor = toMove

    if (separators.includes(nextMaskValue[cursorPosition])) {
      // 12|/12/1992 => 12/31/2199
      toMoveCursor = toMove + plus
    }

    return {
      toMoveCursor,
      toInsertValue: nextMaskValue,
    }
  }

  return {
    toMoveCursor,
    toInsertValue: nextMaskValue,
  }
}

/**
 * validators
 * comes value and array validators and returns Array error or undefined
 * if not one of each validator not found error
 * @param value
 */
export const handleValidators = (value: string) =>
  (validators: TValidator[]): Array<string> | undefined => {
    const errorsFromValidators = validators.reduce((
      acc: Array<string>,
      validator: TValidator,
    ) => {
      const error = validator(value)

      value.length && error && acc.push(error)

      return acc
    }, [])

    if (!errorsFromValidators.length) return

    return errorsFromValidators
  }

export const getSeparatorsArroundCursor = (
  mask: string,
  separators: TSeparators,
  cursorPosition: number,
): {
  minus: number,
  plus: number,
} => {
  const template = getMaskOptions(mask, separators).template

  const counts = {
    plus: 0,
    minus: 0,
  }

  let isAvailablePlus = true
  let isAvailableMinus = true

  for (let i = cursorPosition; i < template.length; i++) { // eslint-disable-line no-plusplus
    if (template[i] === CHAR_SEPARATOR_TEMPLATE && isAvailablePlus) {
      counts.plus = counts.plus + 1
    }

    if (template[i] === CHAR_VALUE_TEMPLATE && isAvailablePlus) {
      isAvailablePlus = false
    }
  }

  for (let i = cursorPosition - 1; i >= 1; i--) { // eslint-disable-line no-plusplus
    if (template[i] === CHAR_SEPARATOR_TEMPLATE && isAvailableMinus) {
      counts.minus = counts.minus + 1
    }

    if (template[i] === CHAR_VALUE_TEMPLATE && isAvailableMinus) {
      isAvailableMinus = false
    }
  }

  return counts
}

/**
 * return real counts char and separators
 * for example: you want paste 444 to mask xx/xx/xxxx
 * should return chars: 2, separators: 1
 */
export const getCharsInfo = (
  mask: string,
  separators: TSeparators,
  cursorPosition: number,
  pastedValue: string,
): {
  chars: number,
  separators: number,
} => {
  const template = getMaskOptions(mask, separators).template

  const counts = {
    chars: 0,
    separators: 0,
  }

  for (let i = cursorPosition; i < template.length; i++) { // eslint-disable-line no-plusplus
    if (template[i] === CHAR_VALUE_TEMPLATE && pastedValue.length > counts.chars) {
      counts.chars = counts.chars + 1
    }

    if (template[i] === CHAR_SEPARATOR_TEMPLATE && pastedValue.length > counts.chars) {
      counts.separators = counts.separators + 1
    }
  }

  return counts
}

/**
 * comes value from input event and prepares to mask style and moves cursor to need position
 * example 123 -> 12/3
 */
export const getMaskValue = (
  {
    value,
    selectionStart,
    mask,
    separators,
    validators,
    prevMaskValue,
    cursorPosition,
    errorsCB,
    pastedValue,
  }: {
      value: string,
      mask: string,
      separators: TSeparators,
      validators: TValidator[],
      selectionStart: number,
      prevMaskValue: string,
      pastedValue: string,
      cursorPosition: number,
      errorsCB: (errors: string[]) => void,
    },
): { toMoveCursor: number, toInsertValue: string } | null => {
  // should prepared entered value to mask
  // for example to be __/__/__ mask
  // we entered 22| and would edition 223|
  // 223| we prepared to 22/3
  const {
    maskedValue,
    originalValue,
  } = prepareValueToMask(value, mask, separators)

  const errorsFromValidators: string[] = []

  const maxCursorPosition = mask.length || MIN_MAX_LENGTH

  const slicedMaskValue = maskedValue.slice(0, maxCursorPosition)

  let toMoveCursorAfterPasted = 0

  if (pastedValue) {
    const counts = getCharsInfo(
      mask,
      separators,
      cursorPosition,
      pastedValue,
    )

    toMoveCursorAfterPasted = counts.chars + counts.separators
  }

  const errorsFromCustomValidators = handleValidators(
    prepareValueFromMask(slicedMaskValue, separators),
  )(validators)

  if (errorsFromCustomValidators && errorsFromCustomValidators.length) {
    errorsFromValidators.push(...errorsFromCustomValidators)
  }

  if (originalValue.length && errorsFromValidators.length) {
    errorsCB(errorsFromValidators)

    return null
  }

  return getCursorPosition({
    nextMaskValue: slicedMaskValue,
    toMove: selectionStart,
    prevMaskValue,
    separators,
    cursorPosition,
    toMoveCursorAfterPasted,
    mask,
  })
}

export const makePasteHandler = (setPastedValue: (value: string) => void) =>
  (e: ClipboardEvent) => {
    // Get pasted data via clipboard API
    const clipboardData = e.clipboardData || (window as any).clipboardData
    const pastedData = clipboardData.getData("Text")

    setPastedValue(pastedData)
  }

export const joinClasses = (...props) => props.filter(Boolean).join(" ")

export const setCSSVar = (label: HTMLLabelElement, name: string, value: string) => {
  label.style.setProperty(name, value)
}
