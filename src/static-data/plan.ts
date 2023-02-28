import { v4 } from "uuid";
import { db } from "../database/db";
import { BuildQueueItem, VillageBuilding } from "../types/DatabaseTypes";
import { Village, VillageFieldLayoutEnum, VillageFieldType } from "../types/VillageTypes";
import { getBuildingLevelAttributes } from "./building";
import { villageFieldLayout } from "./village";

const fieldTypeToBuildingId = (type: VillageFieldType): string => {
    switch (type) {
        case VillageFieldType.Lumber: {
            return '1'
        }
        case VillageFieldType.Clay: {
            return '2'
        }
        case VillageFieldType.Iron: {
            return '3'
        }
        case VillageFieldType.Crop: {
            return '4'
        }
        default: {
            return ''
        }
    }
}

type BuildPlanItem = Pick<BuildQueueItem, 'buildingId' | 'targetLevel'> & { position?: number }

export const getPlanFields = (layout: VillageFieldLayoutEnum, iteration: number): BuildPlanItem[] => {
    const result: BuildPlanItem[] = []
    for (let i = 1; i <= 18; i++) {
        const field = villageFieldLayout[layout][i]
        result.push({
            buildingId: fieldTypeToBuildingId(field),
            targetLevel: iteration,
        })
    }
    return result
}

export const getPlanBuildings = (iteration: number): BuildPlanItem[] => {
    switch (iteration) {
        case 1:
            return [
                {
                    buildingId: '15',
                    targetLevel: 1,
                },
                {
                    buildingId: '16',
                    targetLevel: 1,
                    position: 39
                },
                {
                    buildingId: '15',
                    targetLevel: 2,
                },
                {
                    buildingId: '15',
                    targetLevel: 3,
                },
                {
                    buildingId: '10',
                    targetLevel: 1,
                },
                {
                    buildingId: '11',
                    targetLevel: 1,
                },
                {
                    buildingId: '10',
                    targetLevel: 2,
                },
                {
                    buildingId: '11',
                    targetLevel: 2,
                },
                {
                    buildingId: '10',
                    targetLevel: 3,
                },
                {
                    buildingId: '11',
                    targetLevel: 3,
                },
            ]
        case 2:
            return [
                {
                    buildingId: '15',
                    targetLevel: 4,
                },
                {
                    buildingId: '15',
                    targetLevel: 5,
                },
                {
                    buildingId: '10',
                    targetLevel: 4,
                },
                {
                    buildingId: '11',
                    targetLevel: 4,
                },
                {
                    buildingId: '10',
                    targetLevel: 5,
                },
                {
                    buildingId: '11',
                    targetLevel: 5,
                },
            ]
        case 3:
            return [
                {
                    buildingId: '23',
                    targetLevel: 1,
                },
                {
                    buildingId: '23',
                    targetLevel: 2,
                },
                {
                    buildingId: '23',
                    targetLevel: 3,
                },
                {
                    buildingId: '17',
                    targetLevel: 1,
                },
                {
                    buildingId: '17',
                    targetLevel: 2,
                },
                {
                    buildingId: '17',
                    targetLevel: 3,
                },
                {
                    buildingId: '15',
                    targetLevel: 6,
                },
                {
                    buildingId: '15',
                    targetLevel: 7,
                },
                {
                    buildingId: '19',
                    targetLevel: 1,
                },
                {
                    buildingId: '19',
                    targetLevel: 2,
                },
                {
                    buildingId: '19',
                    targetLevel: 3,
                }
            ]
        case 4:
            return [
                {
                    buildingId: '23',
                    targetLevel: 4,
                },
                {
                    buildingId: '23',
                    targetLevel: 5,
                },
                {
                    buildingId: '23',
                    targetLevel: 6,
                },
                {
                    buildingId: '15',
                    targetLevel: 8,
                },
                {
                    buildingId: '15',
                    targetLevel: 9,
                },
                {
                    buildingId: '15',
                    targetLevel: 10,
                },
                {
                    buildingId: '10',
                    targetLevel: 6,
                },
                {
                    buildingId: '11',
                    targetLevel: 6,
                },
                {
                    buildingId: '10',
                    targetLevel: 7,
                },
                {
                    buildingId: '11',
                    targetLevel: 7,
                },
                {
                    buildingId: '10',
                    targetLevel: 8,
                },
                {
                    buildingId: '11',
                    targetLevel: 8,
                },
                {
                    buildingId: '17',
                    targetLevel: 4,
                },
                {
                    buildingId: '17',
                    targetLevel: 5,
                },
                {
                    buildingId: '22',
                    targetLevel: 1,
                },
                {
                    buildingId: '22',
                    targetLevel: 2,
                },
                {
                    buildingId: '22',
                    targetLevel: 3,
                }
            ]
        case 5:
            return [
                {
                    buildingId: '15',
                    targetLevel: 11,
                },
                {
                    buildingId: '15',
                    targetLevel: 12,
                },
                {
                    buildingId: '23',
                    targetLevel: 7,
                },
                {
                    buildingId: '23',
                    targetLevel: 8,
                },
                {
                    buildingId: '23',
                    targetLevel: 9,
                },
                {
                    buildingId: '23',
                    targetLevel: 10,
                },
                {
                    buildingId: '10',
                    targetLevel: 9,
                },
                {
                    buildingId: '11',
                    targetLevel: 9,
                },
                {
                    buildingId: '10',
                    targetLevel: 10,
                },
                {
                    buildingId: '11',
                    targetLevel: 10,
                },
                {
                    buildingId: '17',
                    targetLevel: 6,
                },
                {
                    buildingId: '17',
                    targetLevel: 7,
                },
                {
                    buildingId: '17',
                    targetLevel: 8,
                },
                {
                    buildingId: '22',
                    targetLevel: 4,
                },
                {
                    buildingId: '22',
                    targetLevel: 5,
                }
            ]
        case 6:
            return [
                {
                    buildingId: '15',
                    targetLevel: 13,
                },
                {
                    buildingId: '15',
                    targetLevel: 14,
                },
                {
                    buildingId: '15',
                    targetLevel: 15,
                },
                {
                    buildingId: '8',
                    targetLevel: 1
                },
                {
                    buildingId: '8',
                    targetLevel: 2
                },
                {
                    buildingId: '8',
                    targetLevel: 3
                },
                {
                    buildingId: '10',
                    targetLevel: 11,
                },
                {
                    buildingId: '11',
                    targetLevel: 11,
                },
                {
                    buildingId: '10',
                    targetLevel: 12,
                },
                {
                    buildingId: '11',
                    targetLevel: 12,
                },
                {
                    buildingId: '17',
                    targetLevel: 9,
                },
                {
                    buildingId: '17',
                    targetLevel: 10,
                },
                {
                    buildingId: '22',
                    targetLevel: 6,
                },
                {
                    buildingId: '22',
                    targetLevel: 7,
                },
                {
                    buildingId: '22',
                    targetLevel: 8,
                },
            ]
        case 7:
            return [
                {
                    buildingId: '8',
                    targetLevel: 4
                },
                {
                    buildingId: '8',
                    targetLevel: 5
                },
                {
                    buildingId: '10',
                    targetLevel: 13,
                },
                {
                    buildingId: '11',
                    targetLevel: 13,
                },
                {
                    buildingId: '10',
                    targetLevel: 14,
                },
                {
                    buildingId: '11',
                    targetLevel: 14,
                },
                {
                    buildingId: '10',
                    targetLevel: 15,
                },
                {
                    buildingId: '11',
                    targetLevel: 15,
                },
                {
                    buildingId: '17',
                    targetLevel: 11,
                },
                {
                    buildingId: '17',
                    targetLevel: 12,
                },
                {
                    buildingId: '22',
                    targetLevel: 9,
                },
                {
                    buildingId: '22',
                    targetLevel: 10,
                }
            ]
        case 8:
            return [
                {
                    buildingId: '1',
                    targetLevel: 9
                },
                {
                    buildingId: '1',
                    targetLevel: 10
                },
                {
                    buildingId: '2',
                    targetLevel: 9
                },
                {
                    buildingId: '2',
                    targetLevel: 10
                },
                {
                    buildingId: '3',
                    targetLevel: 9
                },
                {
                    buildingId: '3',
                    targetLevel: 10
                },
                {
                    buildingId: '4',
                    targetLevel: 9
                },
                {
                    buildingId: '4',
                    targetLevel: 10
                },
                {
                    buildingId: '10',
                    targetLevel: 16,
                },
                {
                    buildingId: '11',
                    targetLevel: 16,
                },
                {
                    buildingId: '10',
                    targetLevel: 17,
                },
                {
                    buildingId: '11',
                    targetLevel: 17,
                },
                {
                    buildingId: '10',
                    targetLevel: 18,
                },
                {
                    buildingId: '11',
                    targetLevel: 18,
                },
                {
                    buildingId: '17',
                    targetLevel: 13,
                },
                {
                    buildingId: '17',
                    targetLevel: 14,
                },
                {
                    buildingId: '17',
                    targetLevel: 15,
                },
                {
                    buildingId: '13',
                    targetLevel: 1,
                },
                {
                    buildingId: '13',
                    targetLevel: 2,
                },
                {
                    buildingId: '13',
                    targetLevel: 3,
                }
            ]
        case 9:
            return [
                {
                    buildingId: '20',
                    targetLevel: 1,
                },
                {
                    buildingId: '20',
                    targetLevel: 2,
                },
                {
                    buildingId: '20',
                    targetLevel: 3,
                },
                {
                    buildingId: '20',
                    targetLevel: 4,
                },
                {
                    buildingId: '20',
                    targetLevel: 5,
                },
                {
                    buildingId: '20',
                    targetLevel: 6,
                },
                {
                    buildingId: '20',
                    targetLevel: 7,
                },
                {
                    buildingId: '20',
                    targetLevel: 8,
                },
                {
                    buildingId: '20',
                    targetLevel: 9,
                },
                {
                    buildingId: '20',
                    targetLevel: 10,
                },
                {
                    buildingId: '15',
                    targetLevel: 16,
                },
                {
                    buildingId: '15',
                    targetLevel: 17,
                },
                {
                    buildingId: '15',
                    targetLevel: 18,
                },
                {
                    buildingId: '5',
                    targetLevel: 1
                },
                {
                    buildingId: '6',
                    targetLevel: 1
                },
                {
                    buildingId: '7',
                    targetLevel: 1
                },
                {
                    buildingId: '5',
                    targetLevel: 2
                },
                {
                    buildingId: '6',
                    targetLevel: 2
                },
                {
                    buildingId: '7',
                    targetLevel: 2
                },
                {
                    buildingId: '5',
                    targetLevel: 3
                },
                {
                    buildingId: '6',
                    targetLevel: 3
                },
                {
                    buildingId: '7',
                    targetLevel: 3
                },
                {
                    buildingId: '9',
                    targetLevel: 1
                },
                {
                    buildingId: '9',
                    targetLevel: 2
                },
                {
                    buildingId: '10',
                    targetLevel: 19,
                },
                {
                    buildingId: '11',
                    targetLevel: 19,
                },
                {
                    buildingId: '10',
                    targetLevel: 20,
                },
                {
                    buildingId: '11',
                    targetLevel: 20,
                },
                {
                    buildingId: '17',
                    targetLevel: 16,
                },
                {
                    buildingId: '17',
                    targetLevel: 17,
                },
                {
                    buildingId: '17',
                    targetLevel: 18,
                },
            ]
        case 10:
            return [
                {
                    buildingId: '5',
                    targetLevel: 4
                },
                {
                    buildingId: '6',
                    targetLevel: 4
                },
                {
                    buildingId: '7',
                    targetLevel: 4
                },
                {
                    buildingId: '5',
                    targetLevel: 5
                },
                {
                    buildingId: '6',
                    targetLevel: 5
                },
                {
                    buildingId: '7',
                    targetLevel: 5
                },
                {
                    buildingId: '9',
                    targetLevel: 3
                },
                {
                    buildingId: '9',
                    targetLevel: 4
                },
                {
                    buildingId: '9',
                    targetLevel: 5
                },
                {
                    buildingId: '15',
                    targetLevel: 19,
                },
                {
                    buildingId: '15',
                    targetLevel: 20,
                },
                {
                    buildingId: '17',
                    targetLevel: 19,
                },
                {
                    buildingId: '17',
                    targetLevel: 20,
                },
                {
                    buildingId: '37',
                    targetLevel: 1,
                },
                {
                    buildingId: '37',
                    targetLevel: 2,
                },
                {
                    buildingId: '37',
                    targetLevel: 3,
                },
                {
                    buildingId: '37',
                    targetLevel: 4,
                },
                {
                    buildingId: '37',
                    targetLevel: 5,
                },
                {
                    buildingId: '37',
                    targetLevel: 6,
                },
                {
                    buildingId: '37',
                    targetLevel: 7,
                },
                {
                    buildingId: '37',
                    targetLevel: 8,
                },
                {
                    buildingId: '37',
                    targetLevel: 9,
                },
                {
                    buildingId: '37',
                    targetLevel: 10,
                },
            ]
        default:
            return []
    }
}

export const autoBuildVillage = async (village: Village) => {
    const buildings = await db.villageBuildings.where('villageId').equals(village.id).toArray()
    const upgrades = await db.buildQueue.where('villageId').equals(village.id).toArray()

    const consolidatedLevels = buildings.map(e => {
        const upgrade = upgrades.filter(up => up.position === e.position && up.buildingId === e.buildingId).map(up => up.targetLevel)
        if (upgrade.length) {
            return {
                ...e,
                level: Math.max(...upgrade)
            }
        } else {
            return e
        }
    })

    const buildItems: BuildQueueItem[] = []
    const newBuildings: VillageBuilding[] = []

    for (let i = 1; i <= 10; i++) {
        const options = [...getPlanFields(village.layout, i), ...getPlanBuildings(i)]
        const valid: BuildQueueItem[] = []
        for (const opt of options) {
            const targets = consolidatedLevels.filter(e => e.buildingId === opt.buildingId)
            const target = targets.find(e => e.level === opt.targetLevel - 1)
            if (target) {
                valid.push({
                    id: v4(),
                    villageId: village.id,
                    buildingId: opt.buildingId,
                    villageBuildingId: target.id,
                    position: target.position,
                    targetLevel: opt.targetLevel,
                    seq: 0
                })

                target.level += 1
            } else {
                if (!targets.length && opt.targetLevel === 1) {
                    let pos = 19

                    if (opt.position) {
                        pos = opt.position
                    } else {
                        const occupiedPositions = consolidatedLevels.map(e => e.position)
                        while (occupiedPositions.includes(pos)) {
                            pos++;
                        }
                        if (pos === 39) {
                            continue
                        }
                    }

                    const x: VillageBuilding = {
                        id: v4(),
                        buildingId: opt.buildingId,
                        villageId: village.id,
                        level: 0,
                        position: pos
                    }

                    valid.push({
                        id: v4(),
                        villageId: village.id,
                        buildingId: opt.buildingId,
                        villageBuildingId: x.id,
                        position: pos,
                        targetLevel: opt.targetLevel,
                        seq: 0
                    })

                    newBuildings.push(x)
                    consolidatedLevels.push({ ...x, level: 1 })
                }
            }
        }

        const sorted = valid.sort((x, y) => {
            const xRes = getBuildingLevelAttributes(x.buildingId, x.targetLevel)
            const yRes = getBuildingLevelAttributes(y.buildingId, y.targetLevel)

            return xRes.lumber - yRes.lumber + xRes.clay - yRes.clay + xRes.iron - yRes.iron + xRes.crop - yRes.crop
        })

        buildItems.push(...sorted)
    }

    const seq = Math.max(...upgrades.map(e => e.seq), 0)
    await db.buildQueue.bulkAdd(buildItems.map((e, i) => ({ ...e, seq: i + seq })))
    await db.villageBuildings.bulkAdd(newBuildings)
}