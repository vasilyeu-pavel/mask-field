import React, {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { MASK_INPUT_WIDTH, MIN_DELAY, OFFSETS } from "../../constant"
import useCursorPosition from "../../hooks/useCursorPosition"
import { IMaskWrapperProps } from "../../types"
import {
  getMaskValue,
  handleMaskClick,
  isNumber,
  joinClasses,
  prepareValueFromMask,
  prepareValueToMask,
  setCSSVar,
} from "../../utils"

import style from "./MaskWrapper.module.scss"

export const MaskWrapper = (
  {
    mask,
    placeholder,
    children,
    value,
    errors,
    separators,
    onChange,
    validators = [isNumber],
    modifiers,
    handleErrors,
    readOnly,
    disabled,
  }: IMaskWrapperProps,
) => {
  const [maskValue, setMaskValue] = useState(mask)
  const [isFocus, setIsFocus] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [valueToMaskStyle, setValueToMaskStyle] = useState("")
  const [pastedValue, setPastedValue] = useState("")

  const fakeInputRef = useRef < HTMLSpanElement | null >(null)
  const labelRef = useRef < HTMLLabelElement | null >(null)

  const handleValueToMaskStyle = useCallback((toInsertValue: string) => {
    const { maskedValue } = prepareValueToMask(toInsertValue, mask, separators)

    setValueToMaskStyle(maskedValue)
  }, [mask, separators, setValueToMaskStyle])

  /**
     * effects which came input value and prepare to mask style
     */
  useEffect(() => {
    handleValueToMaskStyle(value)
  }, [value, handleValueToMaskStyle])

  /**
     * listens mask changes, if mask was changed move cursor to end input
     */
  useEffect(() => {
    const { maskedValue } = prepareValueToMask(valueToMaskStyle, mask, separators)

    maskedValue.length && onChangeWrapper(maskedValue)
    moveCursorToEnd(maskedValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mask])

  /**
     * sets css variables which writes width to visible input
     * to continue offsets span-mask by n symbol
     * widths (offsetWidth) are gets on hidden span
     * IMPORTANT: sets css variables if all fonts was loaded
     */
  useEffect(() => {
    if (!fakeInputRef ||
            !(fakeInputRef && fakeInputRef.current) ||
            !labelRef ||
            !(labelRef && labelRef.current)
    ) return

    const fakeInput = fakeInputRef.current
    const label = labelRef.current

    setCSSVar(label, MASK_INPUT_WIDTH, "1px")

    // should set css variables if only all fonts was loaded
    document.fonts.ready.then(() => {
      const width = fakeInput.offsetWidth ? fakeInput.offsetWidth + OFFSETS : 1

      setCSSVar(label, MASK_INPUT_WIDTH, `${width}px`)
    })
  }, [maskValue, valueToMaskStyle])

  /**
     * effect which slices mask
     * if value 0 should be set mask
     */
  useEffect(() => {
    if (valueToMaskStyle) {
      setMaskValue(mask.slice(valueToMaskStyle.length))
    } else {
      setMaskValue(mask)
    }
  }, [valueToMaskStyle, mask])

  /**
     * set focus
     * * props: <focus: true/false>
     */
  const handleMaskFocus = useCallback((focus: boolean) => setIsFocus(focus), [setIsFocus])

  /**
     * move cursor to end input position
     * props: <value: string>
     */
  const moveCursorToEnd = useCallback(
    (value: string) => setCursorPosition(value.length),
    [setCursorPosition],
  )

  const errorsCB = useCallback(errors => {
    handleErrors && handleErrors(errors)

    moveCursorToEnd(valueToMaskStyle)
  }, [handleErrors, moveCursorToEnd, valueToMaskStyle])

  const onChangeWrapper = useCallback((
    insertValue: string,
    selectionStart?: number | null,
  ) => {
    !!pastedValue && setPastedValue("") // reset pasted value if pastedValue is not empty
    handleErrors && handleErrors() // reset errors

    const maskedOption = getMaskValue({
      value: insertValue,
      selectionStart: selectionStart || 0,
      mask,
      separators,
      validators,
      prevMaskValue: valueToMaskStyle,
      cursorPosition,
      errorsCB,
      pastedValue,
    })

    if (!maskedOption) return

    const { toMoveCursor, toInsertValue } = maskedOption

    setCursorPosition(toMoveCursor)
    handleValueToMaskStyle(toInsertValue)

    onChange(toInsertValue, prepareValueFromMask(toInsertValue, separators))
  }, [
    separators,
    onChange,
    mask,
    cursorPosition,
    errorsCB,
    handleValueToMaskStyle,
    validators,
    valueToMaskStyle,
    pastedValue,
    setPastedValue,
    handleErrors,
  ])

  /**
     * wrapper in  input.onChange
     *  runs validation and prepare entered value to mask style, set cursor
     *  returns:
     *  event - input event in which value was prepared to mask style ("12/12/")
     *  originalValue - value was not prepared to mask styled (1212)
     * @param e
     */
  const handleMaskChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChangeWrapper(e.target.value, e.target.selectionStart)
  }, [onChangeWrapper])

  const isTouch = "ontouchend" in window

  const clickHandler = isTouch ? {
    /**
         * setTimeout needs because touchEvent not return correct selectionStart(cursorPosition)
         * when debugging was found that he returns events but later sets new cursorPosition
         * clickEvent doesn't have this problem
         */
    onTouchEnd: ({ target }: React.SyntheticEvent<HTMLLabelElement, TouchEvent>) => setTimeout(() =>
      handleMaskClick({
        valueToMaskStyle,
        setCursorPosition,
        handleMaskFocus,
        isTouch,
      })(target as HTMLInputElement),
    MIN_DELAY,
    ),
  } : {
    onClick: ({ target }: React.SyntheticEvent<HTMLLabelElement, MouseEvent>) =>
      handleMaskClick({
        valueToMaskStyle,
        setCursorPosition,
        handleMaskFocus,
        isTouch,
      })(target as HTMLInputElement),
  }

  return (
    <label
      className={joinClasses(
        style.maskContainer,
        "mask",
        readOnly && "readOnly",
        disabled && "disabled",
        isFocus && "focus",
        errors && errors.length && "wrong",
        modifiers,
      )}
      ref={labelRef}
      {...clickHandler}
    >
      <span ref={fakeInputRef} className={joinClasses(style.fakeSpan, "mask__fake")}>
        {valueToMaskStyle}
      </span>
      {(() => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const inputRef = useCursorPosition<HTMLInputElement>({
          setCursorPosition,
          cursorPosition,
          isFocus,
          setPastedValue,
          handleMaskFocus,
        })

        return children({
          handleMaskChange,
          inputRef,
          maskInputWrapperStyle: style.maskInputWrapper,
          maskInputStyle: joinClasses(style.maskInput, "mask__input"),
          value: valueToMaskStyle,
        })
      })()}
      <span
        className={joinClasses(style.mask, "mask__tmp")}
        dangerouslySetInnerHTML={{ __html: (() => {
          if (!placeholder) return maskValue

          if (placeholder && value.length) {
            return maskValue
          } else {
            return placeholder
          }
        })().replace(/ /g, "&nbsp;"), // заменить все пробелы на html пробел
        }}
      />
    </label>
  )
}

export default memo(MaskWrapper)
