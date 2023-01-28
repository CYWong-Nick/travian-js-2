import { FC, useEffect } from "react";
import { KeyValue } from "../../types/CommonTypes";

interface DropdownProps {
    value: string
    options: KeyValue[]
    onChange: (value: string) => any
}

const Dropdown: FC<DropdownProps> = ({
    value,
    options,
    onChange
}) => {
    useEffect(() => {
        if (options.length && !options.find(o => o.key === value)) {
            onChange(options[0].key)
        }
    }, [value, options, onChange])

    return <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o =>
            <option key={o.key} value={o.key}>{o.value}</option>
        )}
    </select>
}

export default Dropdown