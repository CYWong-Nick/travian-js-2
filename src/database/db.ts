import Dexie, { Table } from 'dexie';
import { VillageBuilding, ActionQueueItem, BuildQueueItem, CurrentBuildQueueItem, RaidSchedule, KeyValueConfig, RaidTarget, RaidList, NotificationTarget, IncomingAttack, IncomingAttackUnit, AutoTrainSchedule, Feature } from '../types/DatabaseTypes';
import { Village } from '../types/VillageTypes';

export class TravianJsDatabase extends Dexie {
    villages!: Table<Village>
    villageBuildings!: Table<VillageBuilding>
    actionQueue!: Table<ActionQueueItem>
    buildQueue!: Table<BuildQueueItem>
    currentBuildQueue!: Table<CurrentBuildQueueItem>
    raidSchedule!: Table<RaidSchedule>
    raidList!: Table<RaidList>
    raidTarget!: Table<RaidTarget>
    notificationTarget!: Table<NotificationTarget>
    incomingAttack!: Table<IncomingAttack>
    incomingAttackUnit!: Table<IncomingAttackUnit>
    autoTrainSchedule!: Table<AutoTrainSchedule>
    features!: Table<Feature>
    keyValueConfig!: Table<KeyValueConfig>

    constructor() {
        super('travianjs');
        this.version(15).stores({
            villages: '++id, name',
            villageBuildings: '++id, villageId, buildingId, position',
            actionQueue: '++id, seq',
            buildQueue: '++id, villageId, villageBuildingId, seq',
            currentBuildQueue: '++id, villageId, targetCompletionTime',
            raidSchedule: '++id, prefix',
            raidList: '++id',
            raidTarget: '++id, lastRaidResult',
            notificationTarget: '++id',
            incomingAttack: '++id, villageId',
            incomingAttackUnit: '++id, incomingAttackId',
            autoTrainSchedule: '++id, villageId',
            features: '++id',
            keyValueConfig: '++id, key'
        });
    }
}

export const db = new TravianJsDatabase();