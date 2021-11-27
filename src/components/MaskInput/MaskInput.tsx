import React, { memo, useState } from "react"
import { IMaskInputProps } from "../../types"
import { joinClasses } from "../../utils"
import MaskWrapper from "../MaskWrapper"

const styles = {
  inputWrapper: {
    height: "100%",
  },
  errorContainer: {
    display: "flex",
    FlexDirection: "column",
    marginTop: "5px",
    fontSize: "10px",
    color: "#e82f3f",
  },
}

export const MaskInput = ({
  type = "tel",
  value,
  separators,
  mask,
  placeholder,
  readOnly,
  disabled,
  errors,
  onChange,
  modifiers,
  modifiersErrors,
  withErrors,
  validators,
  ...props
}: IMaskInputProps) => {
  const [maskErrors, setErrors] = useState(errors)

  return (
    <div style={styles.inputWrapper}>
      <MaskWrapper
        value={value}
        separators={separators}
        mask={mask}
        errors={maskErrors}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        handleErrors={setErrors}
        onChange={onChange}
        modifiers={modifiers}
        validators={validators}
      >
        {({
          maskInputStyle,
          maskInputWrapperStyle,
          inputRef,
          value: maskedValue,
          handleMaskChange,
        }) => (
          <div className={maskInputWrapperStyle}>
            <input
              {...props}
              type={type}
              className={maskInputStyle}
              value={maskedValue}
              onChange={handleMaskChange}
              ref={inputRef}
              readOnly={readOnly}
              disabled={disabled}
            />
          </div>
        )}
      </MaskWrapper>
      {withErrors && maskErrors &&
        <div style={styles.errorContainer} className={joinClasses(modifiersErrors)}>
          {maskErrors.map((error, i) => (
            <span key={i}>
              {error}
            </span>
          ))}
        </div>
      }
    </div>
  )
}

export default memo(MaskInput)
