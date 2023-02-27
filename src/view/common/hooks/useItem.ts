import { useState } from "react"

export interface UseItemResult<T> {
    item: T
    updateItem: (key: keyof T, value: any) => void
    resetItem: () => void
}

const useItem = <T extends object>(defaultValue: T): UseItemResult<T> => {
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