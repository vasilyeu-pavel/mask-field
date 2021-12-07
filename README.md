# React mask-field

React mask-field has simply interface and supports in all famous browsers

**Features** 

- **can change mask color from css rules**
- can works with different masks
- can takes different validators 
- can works with copy/paste events
- supports dynamic changed masks
- supports all major browsers
- doesn't has no external dependencies 
  **(has been checked since safari - ios12)**

[demo](https://mask-52cec.firebaseapp.com/)

![example](img/example.gif)
 

### Setup

Install the package
`npm i mask-field --save`

### Use

Exports by default MaskField component

```
import MaskField from "mask-field"
import "mask-field/lib/index.css"
```

**importing styles are required for correct work**

MaskField has interface look like simple native input with two additional props (`mask`, `separators`)

`mask` is showing how transformed value
`separators` are array of symbols who must be a skipped

We just should need to paste MaskField in yours component and hand over needed props 

```
<MaskField
  value={value}
  mask={mask}
  separators={separators}
  onChange={onChange}
  placeholder="placeholder"
  modifiers={modifiers}
/>
```

### Props

| Prop | Required | Type | Description | Example |
| :--- | :---: | :---: | :---: | ---: |
| `mask` | true | string | pattern | "xxx (xx) xxx xx xx" |
| `separators` | true | string[] | to skipping symbols | [" ", "(", ")"] |
| `value` | true | string | input value | - |
| `onChange` | true | func | on change cb | - |
| `validators` | false | func[] | validators list which will are calling by chain (default [isNumber]) (value: string): string | undefined | [isNumber] |
| `placeholder` | false | string | are showing with empty input | - |
| `modifiers` | false | string | are setting custom styles | - |
| `modifiersErrors` | false | string | are setting custom styles for errors container | - |
| `withErrors` | false | bool | trigger for visible errors block (default false) | true |
| `errors` | false | string[] | errors array | ["Value is not a number"] |
| `disabled` | false | bool | flag for disable input | true |
| `readOnly` | false | bool | flag for set readOnly | true |


### Advance

If you want to use custom react input component - mask exports additional wrapper.

```
import { MaskWrapper } from "mask-field"
import "mask-field/lib/index.css"
```

You should wrap your custom input and hand over props

example:

```
<MaskWrapper
  value={value}
  mask={mask}
  errors={errors}
  separators={[" "]}
  onChange={onChange}
  modifiers={modifiers}
>
  {({
    maskInputStyle,
    maskInputWrapperStyle,
    inputRef,
    value,
    handleMaskChange,
  }) => (
      <Input
        type="tel"
        wrapperModifiers={maskInputWrapperStyle}
        modifiers={joinClasses("input", maskInputStyle)}
        value={value}
        required={required}
        onChange={handleMaskChange}
        name={name}
        readOnly={readOnly}
        disabled={isDisabled}
        tabIndex={tabIndex}
        onBlur={onBlur}
        inputRef={inputRef}
      />
    )
  }
</MaskWrapper>
```

**Mask Wrapper returns function with arguments which are needed to hand out in custom input**

### Mask utils

If you want using simply function to transform value to custom mask or cut all separators
You can import `prepareValueFromMask, prepareValueToMask`  

`import { prepareValueFromMask, prepareValueToMask } from "mask-field""`

example:

```
const value = "375292222222"
const mask = "xxx (xx) xxx xx xx"
const separators = [" ", "(", ")"]

prepareValueToMask(value, mask, [" "])
  .toBe("375 (29) 222 22 22")
```

```
prepareValueFromMask("12/01/2000", ["/"]))
  .toBe("12012000")
```
