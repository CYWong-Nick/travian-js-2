import { AdventureFeature, FeatureName } from "../../../types/DatabaseTypes"
import { featureDao, useFeature } from "./featureDao"

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