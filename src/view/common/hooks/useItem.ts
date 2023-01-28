import { useState } from "react"

const useItem = <T extends object>(defaultValue: T) => {
    const [state, setState] = useState<T | undefined>()

    const updateItem = (key: keyof T, value: any) => {
        setState(s => ({
            ...defaultValue,
            ...s,
            [key]: value
        }))
    }

    const resetItem = () => {
        setState(undefined)
    }

    return {
        item: state || defaultValue,
        updateItem,
        resetItem
    }
}

export default useItem