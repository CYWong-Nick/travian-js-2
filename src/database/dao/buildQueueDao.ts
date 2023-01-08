import { v4 } from "uuid"
import { getMaxBuildingLevel } from "../../static-data/building"
import { VillageBuilding } from "../../types/DatabaseTypes"
import { db } from "../db"

class BuildQueueDao {
    addBuildingToQueue = async (building: VillageBuilding) => {
        const buildQueue = await db.buildQueue.where('villageId').equals(building.villageId).toArray()
        const village = await db.villages.get(building.villageId)

        if (!village)
            return

        const targetLevels = buildQueue.filter(e => e.villageBuildingId === building.id)
        const lastTargetLevel = targetLevels.length ?
            Math.max(...targetLevels.map(e => e.targetLevel))
            : building.level

        if (lastTargetLevel === getMaxBuildingLevel(building.buildingId, village.isCapital))
            return

        const maxSeq = Math.max(...buildQueue.map(e => e.seq), 0)

        db.buildQueue.add({
            id: v4(),
            buildingId: building.buildingId,
            villageId: building.villageId,
            villageBuildingId: building.id,
            position: building.position,
            targetLevel: lastTargetLevel + 1,
            seq: maxSeq + 1
        })
    }
}

export default new BuildQueueDao()