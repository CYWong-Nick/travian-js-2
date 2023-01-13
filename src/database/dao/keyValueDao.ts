import { useLiveQuery } from "dexie-react-hooks"
import { v4 } from "uuid"
import { db } from "../db"

export enum ConfigKey {
    NextUserProfileScanTime = 'NextUserProfileScanTime',
    NextRaidReportScanTime = 'NextRaidReportScanTime',
    NextPlusOverviewScanTime = 'NextPlusOverviewScanTime',
    NextRallyPointIncomingAttackScanTime = 'NextRallyPointIncomingAttackScanTime',
    PlayerName = 'PlayerName',
    LoginName = 'LoginName',
    LoginPassword = 'LoginPassword'
}

const keyValueDao = <T extends string | number>(key: ConfigKey, defaultValue: T) => {
    const getValue = async (): Promise<T> => {
        const record = await db.keyValueConfig.where('key').equals(key).first()
        return record?.value as T || defaultValue
    }

    const setValue = async (value: T) => {
        const record = await db.keyValueConfig.where('key').equals(key).first()
        db.keyValueConfig.put({
            id: record?.id || v4(),
            key,
            value
        })
    }

    return {
        getValue,
        setValue
    }
}

export const useKeyValueLiveQuery = (key: ConfigKey) => {
    return useLiveQuery(() => db.keyValueConfig.where('key').equals(key).first())?.value
}

export default keyValueDao