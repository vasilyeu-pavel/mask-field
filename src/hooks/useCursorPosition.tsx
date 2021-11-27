import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react"
import { makeHandleKeyDown, makePasteHandler } from "../utils"

export interface IProps {
  setCursorPosition: (value: number) => void;
  setPastedValue: (value: string) => void;
  handleMaskFocus: (isFocus: boolean) => void;
  cursorPosition: number;
  isFocus: boolean;
}

function useCursorPosition <T extends HTMLInputElement> (
  {
    cursorPosition,
    setCursorPosition,
    isFocus,
    setPastedValue,
    handleMaskFocus,
  }: IProps,
): MutableRefObject<T> {
  const inputRef = useRef() as MutableRefObject<T>

  const handleKeyDown = useMemo(() => makeHandleKeyDown(setCursorPosition), [setCursorPosition])

  const handleClick = useCallback((e: MouseEvent) => {
    const { selectionStart } = e.target as HTMLInputElement

    setCursorPosition(selectionStart || 0)
  }, [setCursorPosition])

  const handleBlur = useCallback(() => {
    handleMaskFocus(false)
  }, [handleMaskFocus])

  const handlePaste = useMemo(() => makePasteHandler(setPastedValue), [setPastedValue])

  /**
   * эффект listen key up on arrow btn <= & => and shifts cursor by just one symbol
   */
  useEffect(() => {
    if (inputRef && inputRef.current) {
      const input = inputRef.current

      input.addEventListener("keydown", handleKeyDown)
      input.addEventListener("paste", handlePaste)
      input.addEventListener("click", handleClick)
      input.addEventListener("blur", handleBlur)

      return () => {
        input.removeEventListener("keydown", handleKeyDown)
        input.removeEventListener("paste", handlePaste)
        input.removeEventListener("click", handleClick)
        input.removeEventListener("blur", handleBlur)
      }
    }
  }, [setCursorPosition, handleKeyDown, handlePaste, handleClick, handleBlur])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      const input = inputRef.current

      isFocus && input.setSelectionRange(cursorPosition, cursorPosition)
    }
  }, [cursorPosition, isFocus])

  return inputRef
}

export default useCursorPosition
