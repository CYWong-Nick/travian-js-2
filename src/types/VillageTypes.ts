import { Tribe } from "./CommonTypes";

export interface Village {
    id: string;
    name: string;
    coordX: number;
    coordY: number;
    isActive: boolean;
    isCapital: boolean
    tribe: Tribe
    layout: VillageFieldLayoutEnum
    lumber: number
    clay: number
    iron: number
    crop: number
    lumberCapacity: number
    clayCapacity: number
    ironCapacity: number
    cropCapacity: number
    enableResourceEvade: boolean
    resourceEvadeTargetVillageId: string
    hasPlusAttackWarning: boolean
    nextRallyPointAttackScanTime: number
}

export enum VillageFieldType {
    Lumber = 'Lumber',
    Clay = 'Clay',
    Iron = 'Iron',
    Crop = 'Crop',
    Unknown = "Unknown"
}

export type VillageFieldLayout = Record<number, VillageFieldType>

export enum VillageFieldLayoutEnum {
    Unknown = 'Unknown',
    F3339 = 'F3339',
    F3456 = 'F3456',
    F4446 = 'F4446',
    F4536 = 'F4536',
    F5346 = 'F5346',
    F15C = 'F15C',
    F4437 = 'F4437',
    F3447 = 'F3447',
    F4347 = "F4347",
    F3546 = "F3546",
    F4356 = "F4356",
    F5436 = "F5436",
    F18C = "F18C"
}