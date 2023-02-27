import { AutoLoginFeature, FeatureName } from "../../../types/DatabaseTypes";
import { featureDao, useFeature } from "./featureDao";

const autoLoginFeatureDefault: AutoLoginFeature = {
    id: FeatureName.AutoLogin,
    name: FeatureName.AutoLogin,
    enabled: false,
    username: '',
    password: ''
}

export const autoLoginFeatureDao = () => featureDao(autoLoginFeatureDefault)
export const useAutoLoginFeature = () => useFeature(autoLoginFeatureDefault)
