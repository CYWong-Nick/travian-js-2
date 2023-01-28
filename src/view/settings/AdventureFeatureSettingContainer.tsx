import moment from "moment";
import { FC } from "react";
import { adventureFeatureDao, useAdventureFeature } from "../../database/dao/featureDao";
import Button from "../common/Button";
import useItem from "../common/hooks/useItem";
import Input, { Scale } from "../common/Input";

const AdventureFeatureSettingContainer: FC = () => {
    const { setValue } = adventureFeatureDao()
    const feature = useAdventureFeature()
    const { item, updateItem, resetItem } = useItem(feature)

    const handleSave = async () => {
        await setValue(item)
        resetItem()
    }

    return <div>
        <h3>Adventure</h3>
        <table>
            <tbody>
                <tr>
                    <th>Enable</th>
                    <td>
                        <input type="checkbox" checked={feature.enabled} />
                    </td>
                </tr>
                <tr>
                    <th>Maximum duration</th>
                    <td>
                        <Input value={item.maxDuration} onChange={value => updateItem('maxDuration', parseInt(value) || 0)} />
                    </td>
                </tr>
                <tr>
                    <th>Minimum hero health</th>
                    <td>
                        <Input value={item.minHeroHealth} onChange={value => updateItem('minHeroHealth', parseInt(value) || 0)} />
                    </td>
                </tr>
                <tr>
                    <th>Scan interval</th>
                    <td>
                        <Input scale={Scale.XS} value={item.minScanInterval} onChange={value => updateItem('minScanInterval', parseInt(value) || 0)} />
                        <span> - </span>
                        <Input scale={Scale.XS} value={item.maxScanInterval} onChange={value => updateItem('maxScanInterval', parseInt(value) || 0)} />
                    </td>
                </tr>
                <tr>
                    <th>Next scan</th>
                    <td>{moment(item.nextScan).format()}</td>
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

export default AdventureFeatureSettingContainer