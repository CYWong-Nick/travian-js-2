import { db } from '../../database/db'
import { buildings, getBuildingLevelAttributes } from '../../static-data/building'
import { BuildingLocation } from '../../types/BuildingTypes'
import { CurrentPageEnum } from '../../types/CommonTypes'
import { getBuildableTypes, isSufficientResource } from '../../utils/BotUtils'
import { ActionQueueManager } from '../action'
import { Action, ActionContext } from '../../types/ActionTypes'
import UpgradeAction from '../build/UpgradeAction'
import NavigateToBuildingAction from '../navigation/NavigateToBuildingAction'
import NavigateToFieldAction from '../navigation/NavigateToFieldAction'
import NavigateToTownAction from '../navigation/NavigateToTownAction'
import SwitchVillageAction from '../navigation/SwitchVillageAction'
import BuildAction from '../build/BuildAction'
import NavigateToNewBuildingCategoryAction from '../navigation/NavigateToNewBuildingCategoryAction'

class ScanBuildQueueAction extends Action<any> {
    name = 'ScanBuildQueueAction'
    
    shouldRun = async (ctx: ActionContext, params: any) => {
        const count = await db.actionQueue.count()
        return count === 0 && ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async () => {
        const villages = await db.villages.toArray()
        const manager = ActionQueueManager.begin()

        for (const village of villages) {
            const currentBuildQueue = await db.currentBuildQueue.where('villageId').equals(village.id).toArray()
            const buildableTypes = getBuildableTypes(village, currentBuildQueue)
            const buildQueueItems = (await db.buildQueue.where('villageId').equals(village.id).sortBy('seq'))
            const availableBuildItem = buildQueueItems.find(e => buildableTypes.includes(buildings[e.buildingId].location))

            if (buildableTypes.length && availableBuildItem) {
                const building = buildings[availableBuildItem.buildingId]
                const buildingAttributes = getBuildingLevelAttributes(availableBuildItem.buildingId, availableBuildItem.targetLevel)

                if (isSufficientResource(village, buildingAttributes)) {
                    const isNewBuilding = availableBuildItem.targetLevel === 1 && building.location === BuildingLocation.Town

                    manager.add(SwitchVillageAction, { villageId: village.id })
                        .add(building.location === BuildingLocation.Field ? NavigateToFieldAction : NavigateToTownAction, {})
                        .add(NavigateToBuildingAction, { buildingId: availableBuildItem.buildingId, position: availableBuildItem.position, navigateIfEmpty: isNewBuilding })

                    if (isNewBuilding) {
                        manager.add(NavigateToNewBuildingCategoryAction, { category: building.category })
                    }

                    manager.add(isNewBuilding ? BuildAction : UpgradeAction, { buildItemId: availableBuildItem.id })
                }
            }
        }

        await manager.done()
        return true
    }
}

export default new ScanBuildQueueAction()