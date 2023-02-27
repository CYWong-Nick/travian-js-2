import { FC } from "react";
import { plusOverviewScannerFeatureDao, usePlusOverviewScannerFeature } from "../../../database/dao/feature/plusOverviewScannerFeatureDao";
import Button from "../../common/Button";
import Checkbox from "../../common/Checkbox";
import useItem from "../../common/hooks/useItem";
import Input from "../../common/Input";

const PlusOverviewScannerFeatureSettingContainer: FC = () => {
    const { setValue } = plusOverviewScannerFeatureDao()
    const feature = usePlusOverviewScannerFeature()
    const { item, updateItem, resetItem } = useItem(feature)

    const handleSave = async () => {
        await setValue(item)
        resetItem()
    }

    return <div>
        <h3>Plus Overview Scanner</h3>
        <table>
            <tbody>
                <tr>
                    <th>Enable</th>
                    <td>
                        <Checkbox checked={item.enabled} onChange={value => updateItem('enabled', value)} />
                    </td>
                </tr>
                <tr>
                    <th>Interval</th>
                    <td>
                        <Input value={item.minInterval} onChange={value => updateItem('minInterval', parseInt(value) || 0)} />
                        <span> - </span>
                        <Input value={item.maxInterval} onChange={value => updateItem('maxInterval', parseInt(value) || 0)} />
                    </td>
                </tr>
                <tr>
                    <th colSpan={2}>
                        <Button onClick={handleSave}>
                            Save
                        </Button>
                    </th>
                </tr>
            </tbody>
        </table>
    </div>
}

export default PlusOverviewScannerFeatureSettingContainer