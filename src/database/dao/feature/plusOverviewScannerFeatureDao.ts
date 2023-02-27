import { FeatureName, PlusOverviewScannerFeature } from "../../../types/DatabaseTypes";
import { featureDao, useFeature } from "./featureDao";

const plusOverviewScannerFeatureDefault: PlusOverviewScannerFeature = {
    id: FeatureName.PlusOverviewScanner,
    name: FeatureName.PlusOverviewScanner,
    enabled: true,
    minInterval: 300,
    maxInterval: 480
}

export const plusOverviewScannerFeatureDao = () => featureDao(plusOverviewScannerFeatureDefault)
export const usePlusOverviewScannerFeature = () => useFeature(plusOverviewScannerFeatureDefault)
