import React from "react"
import { MaskField } from "../MaskField"
import { ComponentMeta, ComponentStory } from "@storybook/react"

export default {
  title: "MaskField",
  component: MaskField,
} as ComponentMeta<typeof MaskField>

const Template: ComponentStory<typeof MaskField> = args => <MaskField {...args} />

export const Phone = Template.bind({})

Phone.args = {
  separators: [" "],
  mask: "xxx xx xxx xx xx",
  value: "",
  onChange: (maskedValue, originalValue) => console.log({
    maskedValue, originalValue,
  }),
}
