import { AutoBuildFeature, FeatureName } from "../../../types/DatabaseTypes";
import { featureDao, useFeature } from "./featureDao";

const autoTroopEvadeFeatureDefault: AutoBuildFeature = {
    id: FeatureName.AutoBuild,
    name: FeatureName.AutoBuild,
    enabled: true
}

export const autoBuildFeatureDao = () => featureDao(autoTroopEvadeFeatureDefault)
export const useAutoBuildFeature = () => useFeature(autoTroopEvadeFeatureDefault)
