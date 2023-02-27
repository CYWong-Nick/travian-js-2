import { FC } from "react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
    checked: boolean
    onChange: (value: boolean) => any
}

const Checkbox: FC<CheckboxProps> = ({
    checked,
    onChange,
    ...props
}) => {
    return <input type="checkbox" checked={checked} onChange={e => onChange(!checked)} {...props} />
}

export default Checkbox