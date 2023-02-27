import { AutoBuildFeature, FeatureName } from "../../../types/DatabaseTypes";
import { featureDao, useFeature } from "./featureDao";

const autoBuildFeatureDefault: AutoBuildFeature = {
    id: FeatureName.AutoBuild,
    name: FeatureName.AutoBuild,
    enabled: true
}

export const autoBuildFeatureDao = () => featureDao(autoBuildFeatureDefault)
export const useAutoBuildFeature = () => useFeature(autoBuildFeatureDefault)
