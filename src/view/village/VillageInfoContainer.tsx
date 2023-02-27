import { useLiveQuery } from "dexie-react-hooks";
import { FC } from "react";
import { db } from "../../database/db";
import { buildings } from "../../static-data/building";
import moment from 'moment'
import { BuildingLocation } from "../../types/BuildingTypes";
import { Village } from "../../types/VillageTypes";
import { ActionQueueManager } from "../../action/action";
import NavigateToTownAction from "../../action/navigation/NavigateToTownAction";
import AutoBuildAction from "../../action/build/AutoBuildAction";
import { toField } from "../../utils/NavigationUtils";
import VillageAutoTrainContainer from "./VillageAutoTrainContainer";
import RowContainer from "../common/RowContainer";
import ColumnContainer from "../common/ColumnContainer";
import Checkbox from "../common/Checkbox";
import useItem from "../common/hooks/useItem";
import Dropdown from "../common/Dropdown"
import Input, { Scale } from "../common/Input";
import Button from "../common/Button";

interface VillageInfoContainerProps {
    village: Village
}

const VillageInfoContainer: FC<VillageInfoContainerProps> = ({
    village
}) => {
    const villages = useLiveQuery(() => db.villages.toArray())
    const villageBuildings = useLiveQuery(() => db.villageBuildings.where('villageId').equals(village.id).sortBy('position'), [village.id])
    const buildQueue = useLiveQuery(() => db.buildQueue.where('villageId').equals(village.id).sortBy('seq'), [village.id])
    const constructions = useLiveQuery(() => db.currentBuildQueue.where('villageId').equals(village.id).sortBy('targetCompletionTime'), [village.id])
    const fields = villageBuildings?.filter(vb => buildings[vb.buildingId]?.location === BuildingLocation.Field)
    const townBuildings = villageBuildings?.filter(vb => buildings[vb.buildingId]?.location === BuildingLocation.Town)

    const { item, updateItem, resetItem } = useItem(village)

    const handleRemoveBuildQueueItem = async (id: string) => {
        const item = await db.buildQueue.get(id)
        if (!item)
            return

        if (item.targetLevel === 1 && buildings[item.buildingId].location === BuildingLocation.Town) {
            const vb = villageBuildings?.find(e => e.buildingId === item.buildingId && e.position === item.position)
            if (vb)
                db.villageBuildings.delete(vb.id)
        }
        await db.buildQueue.delete(id)
    }

    const handleBuildQueueMoveUp = (id: string) => {
        if (!buildQueue)
            return

        const curr = buildQueue.find(e => e.id === id)
        if (!curr)
            return

        const prev = buildQueue.find(e => e.seq === curr.seq - 1)
        if (!prev)
            return

        curr.seq -= 1
        prev.seq += 1

        db.buildQueue.bulkPut([prev, curr])
    }

    const handleBuildQueueMoveDown = (id: string) => {
        if (!buildQueue)
            return

        const curr = buildQueue.find(e => e.id === id)
        if (!curr)
            return

        const next = buildQueue.find(e => e.seq === curr.seq + 1)
        if (!next)
            return

        curr.seq += 1
        next.seq -= 1

        db.buildQueue.bulkPut([curr, next])
    }

    const clearBuildQueue = async () => {
        const vbRemove: string[] = []
        buildQueue?.forEach(item => {
            if (item.targetLevel === 1 && buildings[item.buildingId].location === BuildingLocation.Town) {
                const vb = villageBuildings?.find(e => e.buildingId === item.buildingId && e.position === item.position)
                if (vb) {
                    vbRemove.push(vb.id)
                }
            }
        })

        await db.villageBuildings.bulkDelete(vbRemove)
        await db.buildQueue.where('villageId').equals(village.id).delete()
    }

    const handleAutoBuild = async () => {
        await ActionQueueManager.begin()
            .add(NavigateToTownAction, {})
            .add(AutoBuildAction, {})
            .done()

        toField()
    }

    const handleSave = async () => {
        await db.villages.put(item)
        resetItem()
    }

    return <ColumnContainer>
        <RowContainer>
            <div>
                <h3>Basic Info</h3>
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td>{village.name}</td>
                        </tr>
                        <tr>
                            <th>Coords</th>
                            <td>{village.coordX}, {village.coordY}</td>
                        </tr>
                        <tr>
                            <th>Tribe</th>
                            <td>{village.tribe}</td>
                        </tr>
                        <tr>
                            <th>Field Type</th>
                            <td>{village.layout}</td>
                        </tr>
                        <tr>
                            <th>Capital</th>
                            <td>{village.isCapital ? 'Yes' : 'No'}</td>
                        </tr>
                        <tr>
                            <th>Lumber</th>
                            <td>{village.lumber} ({village.lumberCapacity})</td>
                        </tr>
                        <tr>
                            <th>Clay</th>
                            <td>{village.clay} ({village.clayCapacity})</td>
                        </tr>
                        <tr>
                            <th>Iron</th>
                            <td>{village.iron} ({village.ironCapacity})</td>
                        </tr>
                        <tr>
                            <th>Crop</th>
                            <td>{village.crop} ({village.cropCapacity})</td>
                        </tr>
                        <tr>
                            <th>Constructions</th>
                            <td>
                                {constructions?.map(e =>
                                    <div key={e.id}>
                                        {buildings[e.buildingId].name} Level {e.targetLevel} {moment(e.targetCompletionTime).format()}
                                    </div>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>Next Rally Point Attack Scan</th>
                            <td>{moment(village.nextRallyPointAttackScanTime).format()}</td>
                        </tr>
                        <tr>
                            <th>Has incoming attack</th>
                            <td>{village.hasPlusAttackWarning ? 'Yes' : 'No'}</td>
                        </tr>
                        <tr>
                            <th>Resources Evasion</th>
                            <td>
                                <RowContainer>
                                    <span>Enable</span>
                                    <Checkbox checked={item.enableResourceEvade} onChange={() => updateItem('enableResourceEvade', !item.enableResourceEvade)} />
                                </RowContainer>
                                <RowContainer>
                                    <span>Target</span>
                                    <Dropdown
                                        value={item.resourceEvadeTargetVillageId}
                                        options={
                                            (villages || []).map(v => ({
                                                key: v.id,
                                                value: v.name
                                            }))
                                        }
                                        onChange={value => updateItem('resourceEvadeTargetVillageId', value)}
                                    />
                                </RowContainer>
                            </td>
                        </tr>
                        <tr>
                            <th>Troop Evasion</th>
                            <td>
                                <RowContainer>
                                    <span>Enable</span>
                                    <Checkbox checked={item.enableTroopEvade} onChange={() => updateItem('enableTroopEvade', !item.enableTroopEvade)} />
                                </RowContainer>
                                <RowContainer>
                                    <span>Target:</span>
                                    <span>(</span>
                                    <Input scale={Scale.XS} value={item.troopEvadeTargetCoordX} onChange={value => updateItem('troopEvadeTargetCoordX', value)} />
                                    <span>, </span>
                                    <Input scale={Scale.XS} value={item.troopEvadeTargetCoordY} onChange={value => updateItem('troopEvadeTargetCoordY', value)} />
                                    <span>)</span>
                                </RowContainer>
                            </td>
                        </tr>
                        <tr>
                            <th>Actions</th>
                            <td>
                                <RowContainer>
                                    <Button onClick={handleSave}>Save</Button>
                                    <Button onClick={handleAutoBuild}>Auto Build</Button>
                                </RowContainer>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <h3>Fields</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields?.map(field =>
                            <tr key={field.id}>
                                <td>{buildings[field.buildingId].name}</td>
                                <td>{field.position}</td>
                                <td>{field.level}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div>
                <h3>Town</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {townBuildings?.map(building =>
                            <tr key={building.id}>
                                <td>{buildings[building.buildingId].name}</td>
                                <td>{building.position}</td>
                                <td>{building.level}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div>
                <h3>Build Queue <button onClick={() => clearBuildQueue()}>x</button> </h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Level</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buildQueue?.map(e =>
                            <tr key={e.id}>
                                <td>{buildings[e.buildingId].name}</td>
                                <td>{e.position}</td>
                                <td>{e.targetLevel}</td>
                                <td>
                                    <button onClick={() => handleRemoveBuildQueueItem(e.id)}>x</button>
                                    <button onClick={() => handleBuildQueueMoveUp(e.id)}>↑</button>
                                    <button onClick={() => handleBuildQueueMoveDown(e.id)}>↓</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </RowContainer>

        <RowContainer>
            <VillageAutoTrainContainer
                village={village}
            />
        </RowContainer>
    </ColumnContainer>
}

export default VillageInfoContainer