import { FC } from "react";
import styled from "styled-components";

export enum Scale {
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL'
}

interface ScaleProps {
    scale?: Scale
}

const scaleToWidth = (scale?: Scale) => {
    switch (scale) {
        case Scale.XS:
            return 50
        case Scale.S:
            return 100
        case Scale.M:
            return 200
        case Scale.L:
            return 300
        case Scale.XL:
            return 500
        default:
            return undefined
    }
}

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: string | number
    onChange: (value: string) => any
}

const StyledInput = styled.input<ScaleProps>(props => ({
    width: scaleToWidth(props.scale)
}))

const Input: FC<InputProps & ScaleProps> = ({
    value,
    onChange,
    scale,
    ...props
}) => {
    return <StyledInput value={value} onChange={e => onChange(e.target.value)} scale={scale} {...props} />
}

export default Input