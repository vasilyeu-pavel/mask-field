import { ChangeEvent, InputHTMLAttributes, MutableRefObject, ReactNode } from "react"

export const typeCasting = <T>(data: unknown) => data as T

interface IInput extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
    errors?: string[] | null;
    modifiers?: string;
}

export type TSetCursorPosition = (value: number) => void
export type TSeparator = string
export type TSeparators = TSeparator[]

export interface IChildrenProps {
    maskInputStyle: string;
    maskInputWrapperStyle: string;
    handleMaskChange: (e: ChangeEvent<HTMLInputElement>) => void;
    inputRef: MutableRefObject<HTMLInputElement>;
    value: string;
}

export type TValidator = (value: string) => string | undefined

export interface IMaskWrapperProps extends Omit<IInput, "onChange" | "value"> {
    mask: string;
    value: string;
    children: (props: IChildrenProps) => ReactNode;
    separators: TSeparators;
    onChange: (maskedValue: string, originalValue: string) => void;
    validators?: TValidator[];
    handleErrors?: (errors?: string[]) => void;
}

export interface IMaskInputProps extends
    Omit<IMaskWrapperProps, "children">
{
    type?: string;
    withErrors?: boolean;
    modifiersErrors?: string;
}
