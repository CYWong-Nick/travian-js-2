import { useLiveQuery } from "dexie-react-hooks";
import { FC } from "react";
import { ActionQueueManager } from "../../action/action";
import AutoBuildAction from "../../action/build/AutoBuildAction";
import NavigateToTownAction from "../../action/navigation/NavigateToTownAction";
import { db } from "../../database/db";
import { buildings } from "../../static-data/building";
import { BuildingLocation } from "../../types/BuildingTypes";
import { BuildQueueItem } from "../../types/DatabaseTypes";
import { Village } from "../../types/VillageTypes";
import { toField } from "../../utils/NavigationUtils";
import Button from "../common/Button";
import DoubleDownArrow from "../common/icons/DoubleDownArrow";
import DoubleUpArrow from "../common/icons/DoubleUpArrow";
import RowContainer from "../common/RowContainer";

interface VillageBuildQueueContainerProps {
    village: Village
}

const VillageBuildQueueContainer: FC<VillageBuildQueueContainerProps> = ({
    village
}) => {
    const buildQueue = useLiveQuery(() => db.buildQueue.where('villageId').equals(village.id).sortBy('seq'), [village.id])
    const villageBuildings = useLiveQuery(() => db.villageBuildings.where('villageId').equals(village.id).sortBy('position'), [village.id])

    const handleAutoBuild = async () => {
        await ActionQueueManager.begin()
            .add(NavigateToTownAction, {})
            .add(AutoBuildAction, {})
            .done()

        toField()
    }

    const handleBuildItemMoveToTop = async (id: string) => {
        if (!buildQueue)
            return

        const newBuildQueue = buildQueue.map(e => {
            if (e.id === id) {
                return {
                    ...e,
                    seq: 0
                }
            } else {
                return {
                    ...e,
                    seq: e.seq + 1
                }
            }
        })

        await db.buildQueue.bulkPut(newBuildQueue)
    }

    const handleBuildQueueMoveUp = async (id: string) => {
        if (!buildQueue)
            return

        const currIdx = buildQueue.findIndex(e => e.id === id)
        const prev = buildQueue[currIdx - 1]
        const curr = buildQueue[currIdx]

        if (!prev || !curr) {
            return
        }

        await db.buildQueue.bulkPut([
            {
                ...prev,
                seq: curr.seq
            },
            {
                ...curr,
                seq: prev.seq
            }
        ])
    }

    const handleBuildQueueMoveDown = async (id: string) => {
        if (!buildQueue)
            return

        const currIdx = buildQueue.findIndex(e => e.id === id)
        const curr = buildQueue[currIdx]
        const next = buildQueue[currIdx + 1]

        if (!curr || !next) {
            return
        }

        await db.buildQueue.bulkPut([
            {
                ...curr,
                seq: next.seq
            },
            {
                ...next,
                seq: curr.seq
            }
        ])
    }

    const handleBuildItemMoveToBottom = async (id: string) => {
        if (!buildQueue)
            return

        const maxSeq = Math.max(...buildQueue.map(e => e.seq))

        const newBuildQueue = buildQueue.map(e => {
            if (e.id === id) {
                return {
                    ...e,
                    seq: maxSeq + 1
                }
            } else {
                return e
            }
        })

        await db.buildQueue.bulkPut(newBuildQueue)
    }

    const doDeleteBuildQueueItems = async (items: BuildQueueItem[]) => {
        const villageBuildingRemovalIds: string[] = []

        for (const item of items) {
            if (item.targetLevel === 1 && buildings[item.buildingId].location === BuildingLocation.Town) {
                const villageBuilding = villageBuildings?.find(e => e.buildingId === item.buildingId && e.position === item.position)
                if (villageBuilding) {
                    villageBuildingRemovalIds.push(villageBuilding.id)
                }
            }
        }

        await db.villageBuildings.bulkDelete(villageBuildingRemovalIds)
        await db.buildQueue.where('id').anyOf(items.map(e => e.id)).delete()
    }

    const handleRemoveBuildQueueItem = async (id: string) => {
        const item = await db.buildQueue.get(id)
        if (!item) {
            return
        }
        doDeleteBuildQueueItems([item])
    }

    const clearBuildQueue = async () => {
        buildQueue && doDeleteBuildQueueItems(buildQueue)
    }

    return <div>
        <h3>Build Queue </h3>
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
                {buildQueue?.map((e, idx) =>
                    <tr key={e.id}>
                        <td>{buildings[e.buildingId].name}</td>
                        <td>{e.position}</td>
                        <td>{e.targetLevel}</td>
                        <td>
                            <RowContainer>
                                <Button onClick={() => handleRemoveBuildQueueItem(e.id)}>x</Button>
                                <Button onClick={() => handleBuildItemMoveToTop(e.id)} disabled={idx === 0}>
                                    <DoubleUpArrow />
                                </Button>
                                <Button onClick={() => handleBuildQueueMoveUp(e.id)} disabled={idx === 0}>↑</Button>
                                <Button onClick={() => handleBuildQueueMoveDown(e.id)} disabled={idx === buildQueue.length - 1}>↓</Button>
                                <Button onClick={() => handleBuildItemMoveToBottom(e.id)} disabled={idx === buildQueue.length - 1}>
                                    <DoubleDownArrow />
                                </Button>
                            </RowContainer>
                        </td>
                    </tr>
                )}
                <tr>
                    <td colSpan={4}>
                        <RowContainer>
                            <Button onClick={handleAutoBuild}>Auto Build</Button>
                            <Button onClick={() => clearBuildQueue()}>Clear</Button>
                        </RowContainer>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
}

export default VillageBuildQueueContainer