import { useState } from "react"

export interface UseItemListResult<T> {
    getListItem: (id: string) => T | undefined
    updateListItem: (id: string, key: keyof T, value: any) => void
    removeListItem: (id: string) => void
    itemList: T[]
}

const useItemList = <T extends { id: string }>(initialValues?: T[]): UseItemListResult<T> => {
    const [state, setState] = useState<Record<string, T>>({})

    const getListItem = (id: string): T | undefined => {
        return state[id] || initialValues?.find(e => e.id === id)
    }

    const updateListItem = (id: string, key: keyof T, value: any) => {
        setState(s => ({
            ...s,
            [id]: {
                ...initialValues?.find(e => e.id === id),
                ...s[id],
                [key]: value
            }
        }))
    }

    const removeListItem = (id: string) => {
        setState(s => {
            const newState = { ...s }
            delete newState[id]
            return newState
        })
    }

    const itemList = (initialValues || [])
        .map(e => getListItem(e.id) || e)

    return {
        getListItem,
        updateListItem,
        removeListItem,
        itemList
    }
}

export default useItemList
