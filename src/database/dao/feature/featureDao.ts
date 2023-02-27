import { useLiveQuery } from "dexie-react-hooks"
import { Feature } from "../../../types/DatabaseTypes"
import { db } from "../../db"

export const featureDao = <T extends Feature>(defaultValue: T) => {
    const getValue = async (): Promise<T> => {
        const result = await db.features.get(defaultValue.id)
        return result as T || defaultValue
    }

    const setValue = async (feature: T) => {
        await db.features.put(feature)
    }

    return {
        getValue,
        setValue
    }
}

export const useFeature = <T extends Feature>(defaultValue: T): T => {
    const value = useLiveQuery(() => db.features.get(defaultValue.id), [], defaultValue)
    return value as T || defaultValue
}