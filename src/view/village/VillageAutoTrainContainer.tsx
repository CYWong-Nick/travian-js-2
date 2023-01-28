import { useLiveQuery } from "dexie-react-hooks";
import moment from "moment";
import { FC } from "react";
import { v4 } from "uuid";
import { db } from "../../database/db";
import { BuildingEnum, buildings } from "../../static-data/building";
import { getBuildingTrainableTroops } from "../../static-data/troop";
import { AutoTrainSchedule } from "../../types/DatabaseTypes";
import { Village } from "../../types/VillageTypes";
import Button from "../common/Button";
import useItemList from "../common/hooks/useItemList";
import useItem from "../common/hooks/useItem";
import Input, { Scale } from "../common/Input";
import Dropdown from "../common/Dropdown";

interface VillageAutoTrainContainerProps {
    village: Village
}

const VillageAutoTrainContainer: FC<VillageAutoTrainContainerProps> = ({
    village
}) => {
    const autoTrainSchedules = useLiveQuery(() => db.autoTrainSchedule.where('villageId').equals(village.id).toArray(), [village.id])
    const buildingList = [BuildingEnum.Barracks, BuildingEnum.GreatBarracks, BuildingEnum.Stable, BuildingEnum.GreatStable, BuildingEnum.Workshop]
    const { getListItem, updateListItem, removeListItem, itemList } = useItemList(autoTrainSchedules)
    const { item, updateItem, resetItem } = useItem<AutoTrainSchedule>({
        id: '',
        villageId: village.id,
        buildingId: BuildingEnum.Barracks,
        troopId: 't1',
        count: 0,
        minInterval: 0,
        maxInterval: 0,
        nextTrainTime: Date.now()
    })

    const handleUpdateItem = async (id: string) => {
        const item = getListItem(id)
        if (item) {
            await db.autoTrainSchedule.put(item)
            removeListItem(id)
        }
    }

    const handleRemoveItem = async (id: string) => {
        await db.autoTrainSchedule.delete(id)
        removeListItem(id)
    }

    const handleAddNewItem = async () => {
        await db.autoTrainSchedule.add({
            ...item,
            id: v4()
        })
        resetItem()
    }

    return <div>
        <h3>Auto Train Schedule</h3>
        <table>
            <thead>
                <tr>
                    <th>Building</th>
                    <th>Troop</th>
                    <th>Count</th>
                    <th>Interval</th>
                    <th>Next</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    itemList.map(item => {
                        return <tr key={item.id}>
                            <td>
                                <Dropdown
                                    value={item.buildingId}
                                    options={buildingList.map(key => ({ key, value: buildings[key].name }))}
                                    onChange={value => updateListItem(item.id, 'buildingId', value)}
                                />
                            </td>
                            <td>
                                <Dropdown
                                    value={item.troopId}
                                    options={getBuildingTrainableTroops(village.tribe, item.buildingId).map(e => ({ key: e.troopId, value: e.name }))}
                                    onChange={value => updateListItem(item.id, 'troopId', value)}
                                />
                            </td>
                            <td>
                                <Input scale={Scale.XS} value={item.count} onChange={value => updateListItem(item.id, 'count', parseInt(value) || 0)} />
                            </td>
                            <td>
                                <Input scale={Scale.XS} value={item.minInterval} onChange={value => updateListItem(item.id, 'minInterval', parseInt(value) || 0)} />
                                <span> - </span>
                                <Input scale={Scale.XS} value={item.maxInterval} onChange={value => updateListItem(item.id, 'maxInterval', parseInt(value) || 0)} />
                            </td>
                            <td>
                                {moment(item.nextTrainTime).format()}
                            </td>
                            <td>
                                <Button onClick={() => handleUpdateItem(item.id)}>Save</Button>
                                <Button onClick={() => handleRemoveItem(item.id)}>x</Button>
                            </td>
                        </tr>
                    })
                }
                <tr>
                    <td>
                        <Dropdown
                            value={item.buildingId}
                            options={buildingList.map(key => ({ key, value: buildings[key].name }))}
                            onChange={value => updateItem('buildingId', value)}
                        />
                    </td>
                    <td>
                        <Dropdown
                            value={item.troopId}
                            options={getBuildingTrainableTroops(village.tribe, item.buildingId).map(e => ({ key: e.troopId, value: e.name }))}
                            onChange={value => updateItem('troopId', value)}
                        />
                    </td>
                    <td>
                        <Input scale={Scale.XS} value={item.count} onChange={value => updateItem('count', parseInt(value) || 0)} />
                    </td>
                    <td>
                        <Input scale={Scale.XS} value={item.minInterval} onChange={value => updateItem('minInterval', parseInt(value) || 0)} />
                        <span> - </span>
                        <Input scale={Scale.XS} value={item.maxInterval} onChange={value => updateItem('maxInterval', parseInt(value) || 0)} />
                    </td>
                    <td></td>
                    <td>
                        <Button onClick={handleAddNewItem}>+</Button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
}

export default VillageAutoTrainContainer