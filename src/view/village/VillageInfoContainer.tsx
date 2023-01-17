import { useLiveQuery } from "dexie-react-hooks";
import { FC, useState } from "react";
import styled from "styled-components";
import { db } from "../../database/db";
import { buildings } from "../../static-data/building";
import moment from 'moment'
import { BuildingLocation } from "../../types/BuildingTypes";
import { Village } from "../../types/VillageTypes";
import { ActionQueueManager } from "../../action/action";
import NavigateToTownAction from "../../action/navigation/NavigateToTownAction";
import AutoBuildAction from "../../action/build/AutoBuildAction";
import { toField } from "../../utils/NavigationUtils";

interface VillageInfoContainerProps {
    village: Village
}

const VillageInfoViewContainer = styled.div({
    display: 'flex',
    flexDirection: 'row',
    columnGap: 5
})

const VillageInfoContainer: FC<VillageInfoContainerProps> = ({
    village
}) => {
    const villages = useLiveQuery(() => db.villages.toArray())
    const villageBuildings = useLiveQuery(() => db.villageBuildings.where('villageId').equals(village.id).sortBy('position'), [village.id])
    const buildQueue = useLiveQuery(() => db.buildQueue.where('villageId').equals(village.id).sortBy('seq'), [village.id])
    const constructions = useLiveQuery(() => db.currentBuildQueue.where('villageId').equals(village.id).sortBy('targetCompletionTime'), [village.id])
    const fields = villageBuildings?.filter(vb => buildings[vb.buildingId]?.location === BuildingLocation.Field)
    const townBuildings = villageBuildings?.filter(vb => buildings[vb.buildingId]?.location === BuildingLocation.Town)

    const [enableResourceEvade, setEnableResourceEvade] = useState<boolean | null>(null)
    const [resourceEvadeTargetVillageId, setResourceEvadeTargetVillageId] = useState<string | null>(null)

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

    const handleSaveResourceEvasion = () => {
        db.villages.put({
            ...village,
            enableResourceEvade: enableResourceEvade ?? village.enableResourceEvade,
            resourceEvadeTargetVillageId: resourceEvadeTargetVillageId ?? village.resourceEvadeTargetVillageId
        })
    }

    return <VillageInfoViewContainer>
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
                        <th>Res. Evasion</th>
                        <td>
                            <input type="checkbox" checked={enableResourceEvade ?? village.enableResourceEvade} onClick={() => setEnableResourceEvade(!(enableResourceEvade ?? village.enableResourceEvade))} />
                            <select value={resourceEvadeTargetVillageId ?? village.resourceEvadeTargetVillageId} onChange={e => setResourceEvadeTargetVillageId(e.target.value)} >
                                {villages?.map(v =>
                                    <option key={v.id} value={v.id} >{v.name}</option>
                                )}
                            </select>
                            <button onClick={handleSaveResourceEvasion}>Save</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                <button onClick={() => handleAutoBuild()}>Auto Build</button>
            </div>
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
    </VillageInfoViewContainer>
}

export default VillageInfoContainer