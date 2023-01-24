import { useState } from "react"

const useNewItem = <T extends object>(initialValue: T) => {
    const [state, setState] = useState<T>(initialValue)

    const updateNewItem = (key: keyof T, value: any) => {
        setState(s => ({
            ...s,
            [key]: value
        }))
    }

    const resetNewItem = () => {
        setState(initialValue)
    }

    return {
        newItem: state,
        updateNewItem,
        resetNewItem
    }
}

export default useNewItem