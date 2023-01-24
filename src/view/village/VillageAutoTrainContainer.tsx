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
import useNewItem from "../common/hooks/useNewItem";
import Input, { Scale } from "../common/Input";

interface VillageAutoTrainContainerProps {
    village: Village
}

const VillageAutoTrainContainer: FC<VillageAutoTrainContainerProps> = ({
    village
}) => {
    const autoTrainSchedules = useLiveQuery(() => db.autoTrainSchedule.where('villageId').equals(village.id).toArray(), [village.id])
    const buildingList = [BuildingEnum.Barracks, BuildingEnum.GreatBarracks, BuildingEnum.Stable, BuildingEnum.GreatStable, BuildingEnum.Workshop]
    const { getItem, updateItem, removeItem, itemList } = useItemList(autoTrainSchedules)
    const { newItem, updateNewItem, resetNewItem } = useNewItem<AutoTrainSchedule>({
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
        const item = getItem(id)
        if (item) {
            await db.autoTrainSchedule.put(item)
            removeItem(id)
        }
    }

    const handleRemoveItem = async (id: string) => {
        await db.autoTrainSchedule.delete(id)
        removeItem(id)
    }

    const handleAddNewItem = async () => {
        await db.autoTrainSchedule.add({
            ...newItem,
            id: v4()
        })
        resetNewItem()
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
                                <select value={item.buildingId} onChange={e => updateItem(item.id, 'buildingId', e.target.value)}>
                                    {buildingList.map(e =>
                                        <option key={e} value={e}>{buildings[e].name}</option>
                                    )}
                                </select>
                            </td>
                            <td>
                                <select value={item.troopId} onChange={e => updateItem(item.id, 'troopId', e.target.value)}>
                                    {getBuildingTrainableTroops(village.tribe, item.buildingId).map(o =>
                                        <option key={`${o.troopId}`} value={o.troopId}>{o.name}</option>
                                    )}
                                </select>
                            </td>
                            <td>
                                <Input scale={Scale.XS} value={item.count} onChange={value => updateItem(item.id, 'count', parseInt(value) || 0)} />
                            </td>
                            <td>
                                <Input scale={Scale.XS} value={item.minInterval} onChange={value => updateItem(item.id, 'minInterval', parseInt(value) || 0)} />
                                <span> - </span>
                                <Input scale={Scale.XS} value={item.maxInterval} onChange={value => updateItem(item.id, 'maxInterval', parseInt(value) || 0)} />
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
                        <select value={newItem.buildingId} onChange={e => updateNewItem('buildingId', e.target.value)}>
                            {buildingList.map(e =>
                                <option key={e} value={e}>{buildings[e].name}</option>
                            )}
                        </select>
                    </td>
                    <td>
                        <select value={newItem.troopId} onChange={e => updateNewItem('troopId', e.target.value)}>
                            {getBuildingTrainableTroops(village.tribe, newItem.buildingId).map(o =>
                                <option key={`${o.troopId}`} value={o.troopId}>{o.name}</option>
                            )}
                        </select>
                    </td>
                    <td>
                        <Input scale={Scale.XS} value={newItem.count} onChange={value => updateNewItem('count', parseInt(value) || 0)} />
                    </td>
                    <td>
                        <Input scale={Scale.XS} value={newItem.minInterval} onChange={value => updateNewItem('minInterval', parseInt(value) || 0)} />
                        <span> - </span>
                        <Input scale={Scale.XS} value={newItem.maxInterval} onChange={value => updateNewItem('maxInterval', parseInt(value) || 0)} />
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