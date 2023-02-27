import { BuildingEnum } from "../static-data/building"

export interface VillageBuilding {
    id: string
    villageId: string
    buildingId: string
    level: number
    position: number
}

export interface BuildQueueItem {
    id: string
    villageId: string
    buildingId: string
    villageBuildingId: string
    position: number
    targetLevel: number
    seq: number
}

export interface CurrentBuildQueueItem {
    id: string
    villageId: string
    buildingId: string
    targetLevel: number
    targetCompletionTime: number
}

export interface ActionQueueItem {
    id: string
    action: string
    param: any
    seq: number
}

export interface RaidSchedule {
    id: string
    prefix: string
    minInterval: number
    maxInterval: number
    nextFarmTime: number
}

export interface RaidList {
    id: string
    name: string
}

export interface RaidTarget {
    id: string
    name: string
    raidListId: string
    coordinateX: number
    coordinateY: number
    lastRaidTime: number
    lastRaidResult: RaidResult
    lastRaidBounty: number
    lastRaidCapacity: number
}

export enum RaidResult {
    Safe = 'Safe',
    Loss = 'Loss',
    TotalLoss = 'TotalLoss',
    Unknown = 'Unknown'
}

export enum NotificationChannelType {
    Telegram = "Telegram",
    Discord = "Discord"
}

export interface NotificationTarget {
    id: string
    channelType: NotificationChannelType
    telegramChatId: string
    telegramToken: string
    discordWebhookId: string
    discordWebhookToken: string
    alertScout: boolean
    alertResourceCapacity: boolean
    alertEmptyBuild: boolean
    alertAttack: boolean
}

export enum IncomingAttackType {
    Raid = "Raid",
    Attack = "Attack"
}

export interface IncomingAttack {
    id: string
    type: IncomingAttackType
    attackerName: string
    attackerCoordX: number
    attackerCoordY: number
    villageId: string
    arrivalLocalTime: number
    updatedAt: number
    resourceEvadeCompleted: boolean
    troopEvadeCompleted: boolean
}

export interface IncomingAttackUnit {
    id: string
    incomingAttackId: string
    unitName: string
    unitCount: string // Possibly '?'
}

export interface KeyValueConfig {
    id: string
    key: string
    value: string | number
}

export interface AutoTrainSchedule {
    id: string
    villageId: string
    buildingId: BuildingEnum
    troopId: string
    count: number
    minInterval: number
    maxInterval: number
    nextTrainTime: number
}

export enum FeatureName {
    Adventure = 'Adventure',
    AutoBuild = 'AutoBuild',
    PlusOverviewScanner = 'PlusOverviewScanner',
    AutoLogin = 'AutoLogin',
}

export interface AdventureFeature {
    id: FeatureName.Adventure
    name: FeatureName.Adventure
    enabled: boolean
    maxDuration: number
    minHeroHealth: number
    minScanInterval: number
    maxScanInterval: number
    nextScan: number
}

export interface AutoBuildFeature {
    id: FeatureName.AutoBuild
    name: FeatureName.AutoBuild
    enabled: boolean
}

export interface PlusOverviewScannerFeature {
    id: FeatureName.PlusOverviewScanner
    name: FeatureName.PlusOverviewScanner
    enabled: boolean
    minInterval: number
    maxInterval: number
}

export interface AutoLoginFeature {
    id: FeatureName.AutoLogin
    name: FeatureName.AutoLogin
    enabled: boolean
    username: string
    password: string
}

export type Feature =
    AdventureFeature
    | AutoBuildFeature
    | PlusOverviewScannerFeature
    | AutoLoginFeature
