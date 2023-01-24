import { useState } from "react"

const useItemList = <T extends { id: string }>(initialValues?: T[]) => {
    const [state, setState] = useState<Record<string, T>>({})

    const getItem = (id: string): T | undefined => {
        return state[id] || initialValues?.find(e => e.id === id)
    }

    const updateItem = (id: string, key: keyof T, value: any) => {
        setState(s => ({
            ...s,
            [id]: {
                ...initialValues?.find(e => e.id === id),
                ...s[id],
                [key]: value
            }
        }))
    }

    const removeItem = (id: string) => {
        setState(s => {
            const newState = { ...s }
            delete newState[id]
            return newState
        })
    }

    const itemList = (initialValues || [])
        .map(e => getItem(e.id) || e)

    return {
        getItem,
        updateItem,
        removeItem,
        itemList
    }
}

export default useItemList
