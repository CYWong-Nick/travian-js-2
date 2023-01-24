import keyBy from "lodash.keyby"
import { v4 } from "uuid"
import { db } from "../database/db"
import { ActionQueueItem } from "../types/DatabaseTypes"
import { Action } from "../types/ActionTypes"
import UpgradeAction from "./build/UpgradeAction"
import ScanBuildQueueAction from "./default-action/ScanBuildQueueAction"
import UpdateFieldBasicInfoAction from "./default-action/UpdateFieldBasicInfoAction"
import UpdateFieldBuildingInfoAction from "./default-action/UpdateFieldBuildingInfoAction"
import UpdateTownBasicInfoAction from "./default-action/UpdateTownBasicInfoAction"
import UpdateTownBuildingInfoAction from "./default-action/UpdateTownBuildingInfoAction"
import UpdateVillageBasicInfo from "./default-action/UpdateVillageBasicInfo"
import UpdateVillageListAction from "./default-action/UpdateVillageListAction"
import NavigateToBuildingAction from "./navigation/NavigateToBuildingAction"
import NavigateToFieldAction from "./navigation/NavigateToFieldAction"
import NavigateToTownAction from "./navigation/NavigateToTownAction"
import SwitchVillageAction from "./navigation/SwitchVillageAction"
import NavigateToPlusOverviewAction from "./navigation/NavigateToPlusOverviewAction"
import NavigateToPlusResourcesAction from "./navigation/NavigateToPlusResourcesAction"
import ScanPlusStatisticsAction from "./default-action/ScanPlusStatisticsAction"
import UpdatePlusOverviewAction from "./default-action/UpdatePlusOverviewAction"
import UpdatePlusResourcesAction from "./default-action/UpdatePlusResourcesAction"
import DisableRaidLossAction from "./raid/DisableRaidLossAction"
import RaidAction from "./raid/RaidAction"
import ScanRaidLossAction from "./default-action/ScanRaidLossAction"
import ScanRaidScheduleAction from "./default-action/ScanRaidScheduleAction"
import NavigateToRallyPointFarmListAction from "./navigation/NavigateToRallyPointFarmListAction"
import BuildAction from "./build/BuildAction"
import NavigateToNewBuildingCategoryAction from "./navigation/NavigateToNewBuildingCategoryAction"
import AutoBuildAction from "./build/AutoBuildAction"
import UpdateUserProfileAction from "./default-action/UpdateUserProfileAction"
import ScanUserProfileAction from "./default-action/ScanUserProfileAction"
import NavigateToUserProfileAction from "./navigation/NavigateToUserProfileAction"
import NavigateToRallyPointOverviewAction from "./navigation/NavigateToRallyPointOverviewAction"
import NavigateToRallyPointIncomingAttackTroopsAction from "./navigation/NavigateToRallyPointIncomingAttackTroopsAction"
import ScanRallyPointIncomingAttackAction from "./default-action/ScanRallyPointIncomingAttackAction"
import UpdateRallyPointIncomingAttackTroopsAction from "./default-action/UpdateRallyPointIncomingAttackTroopsAction"
import AutoLoginAction from "./default-action/AutoLoginAction"
import UpdateHeroInfoAction from "./default-action/UpdateHeroInfoAction"
import AdventureAction from "./adventure/AdventureAction"
import ScanAdventureAction from "./default-action/ScanAdventureAction"
import NavigateToAdventureAction from "./navigation/NavigateToAdventureAction"
import NavigateToMarketSendResourceAction from "./navigation/NavigateToMarketSendResourceAction"
import ScanResourceEvadeAction from "./default-action/ScanResourceEvadeAction"
import SendResourceAction from "./market/SendResourceAction"
import ScanTrainScheduleAction from "./train/ScanTrainScheduleAction"
import TrainAction from "./train/TrainAction"

export const defaultActions: string[] = [
    AutoLoginAction,
    UpdateVillageListAction,
    UpdateVillageBasicInfo,
    UpdateHeroInfoAction,
    UpdateFieldBasicInfoAction,
    UpdateFieldBuildingInfoAction,
    UpdateTownBasicInfoAction,
    UpdateTownBuildingInfoAction,
    UpdatePlusOverviewAction,
    UpdatePlusResourcesAction,
    UpdateUserProfileAction,
    UpdateRallyPointIncomingAttackTroopsAction
].map(action => action.name)

export const defaultScanners: string[] = [
    ScanResourceEvadeAction,
    ScanUserProfileAction,
    ScanRaidScheduleAction,
    ScanRaidLossAction,
    ScanBuildQueueAction,
    ScanTrainScheduleAction,
    ScanPlusStatisticsAction,
    ScanRallyPointIncomingAttackAction,
    ScanAdventureAction
].map(action => action.name)

export const actionRegistry: Record<string, Action<any>> = keyBy([
    AutoLoginAction,
    UpdateVillageListAction,
    UpdateVillageBasicInfo,
    UpdateHeroInfoAction,
    UpdateFieldBasicInfoAction,
    UpdateFieldBuildingInfoAction,
    UpdateTownBasicInfoAction,
    UpdateTownBuildingInfoAction,
    UpdatePlusOverviewAction,
    UpdatePlusResourcesAction,
    UpdateUserProfileAction,
    DisableRaidLossAction,
    UpdateRallyPointIncomingAttackTroopsAction,
    ScanRaidScheduleAction,
    ScanRaidLossAction,
    ScanBuildQueueAction,
    ScanUserProfileAction,
    ScanAdventureAction,
    ScanPlusStatisticsAction,
    ScanRallyPointIncomingAttackAction,
    ScanAdventureAction,
    ScanResourceEvadeAction,
    ScanTrainScheduleAction,
    SwitchVillageAction,
    NavigateToBuildingAction,
    NavigateToNewBuildingCategoryAction,
    NavigateToFieldAction,
    NavigateToTownAction,
    NavigateToPlusOverviewAction,
    NavigateToPlusResourcesAction,
    NavigateToRallyPointFarmListAction,
    NavigateToRallyPointOverviewAction,
    NavigateToRallyPointIncomingAttackTroopsAction,
    NavigateToUserProfileAction,
    NavigateToAdventureAction,
    NavigateToMarketSendResourceAction,
    AutoBuildAction,
    BuildAction,
    UpgradeAction,
    RaidAction,
    AdventureAction,
    SendResourceAction,
    TrainAction
], e => e.name)

export class ActionQueueManager {
    itemsFromBeginning: ActionQueueItem[] = []
    items: ActionQueueItem[] = []

    static begin = () => {
        return new ActionQueueManager()
    }

    addFromBeginning = <T>(action: Action<T>, param: T) => {
        this.itemsFromBeginning.push({
            id: v4(),
            action: action.name,
            param: param ? JSON.stringify(param) : '',
            seq: 0
        })

        return this
    }

    add = <T>(action: Action<T>, param: T) => {
        this.items.push({
            id: v4(),
            action: action.name,
            param: param ? JSON.stringify(param) : '',
            seq: 0
        })

        return this
    }

    done = async () => {
        if (this.itemsFromBeginning.length) {
            await db.transaction('rw', 'actionQueue', async () => {
                const firstItem = await db.actionQueue.orderBy('seq').first()
                const firstSeq = firstItem?.seq || 0
                db.actionQueue.bulkAdd(
                    this.itemsFromBeginning.map((e, i) => ({
                        ...e,
                        seq: firstSeq - i - 1
                    }))
                )
            })
        }

        if (this.items.length) {
            await db.transaction('rw', 'actionQueue', async () => {
                const lastItem = await db.actionQueue.orderBy('seq').last()
                const lastSeq = lastItem?.seq || -1
                db.actionQueue.bulkAdd(
                    this.items.map((e, i) => ({
                        ...e,
                        seq: lastSeq + i + 1
                    }))
                )
            })
        }
    }
}