import { useLiveQuery } from "dexie-react-hooks"
import { AdventureFeature, Feature, FeatureName } from "../../types/DatabaseTypes"
import { db } from "../db"

const featureDao = <T extends Feature>(defaultValue: T) => {
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

const useFeature = <T extends Feature>(defaultValue: T): T => {
    const value = useLiveQuery(() => db.features.get(defaultValue.id), [], defaultValue)
    return value as T || defaultValue
}

const adventureFeatureDefault: AdventureFeature = {
    id: FeatureName.Adventure,
    name: FeatureName.Adventure,
    enabled: true,
    maxDuration: 1800,
    minHeroHealth: 40,
    minScanInterval: 300,
    maxScanInterval: 600,
    nextScan: 0
}

export const adventureFeatureDao = () => featureDao(adventureFeatureDefault)
export const useAdventureFeature = () => useFeature(adventureFeatureDefault)

export const autoBuildDao = () => featureDao({
    id: FeatureName.AutoBuild,
    name: FeatureName.AutoBuild,
    enabled: true
})

export const plusOverviewScannerDao = () => featureDao({
    id: FeatureName.PlusOverviewScanner,
    name: FeatureName.PlusOverviewScanner,
    enabled: true,
    minInterval: 300,
    maxInterval: 480
})