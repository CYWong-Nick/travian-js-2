export enum BuildingLocation {
    Field = 'Field',
    Town = 'Town'
}

export enum BuildingCategory {
    Infrastructure = "Infrastructure",
    Military = "Military",
    Resources = "Resources",
    Others = "Others",
}

export interface Building {
    id: string
    name: string
    location: BuildingLocation
    category: BuildingCategory
}

export interface CommonBuildingLevelAttributes {
    id: string
    buildingId: string
    level: number
    lumber: number
    clay: number
    iron: number
    crop: number
    cropConsumption: number
    culturePoint: number
    time: number
}

export interface FieldLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '1' | '2' | '3' | '4'
    production: number
}

export interface ProductionBoosterLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '5' | '6' | '7' | '8' | '9'
    productionFactor: number
}

export interface StorageLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '10' | '11' | '23' | '38' | '39'
    capacity: number
}

export interface TournamentSquareLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '14'
    troopSpeedFactor: number
}

export interface MainBuildingLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '15'
    constructionTimeFactor: number
}

export interface MarketplaceLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '17'
    merchantCount: number
}

export interface EmbassyLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '18'
    memberCount: number
}

export interface TroopsProductionLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '19' | '20' | '21' | '29' | '30' | '41' | '46' | '48'
    trainingTimeFactor: number
}

export interface TownHallLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '24'
    smallCelebrationCooldown: number
    greatCelebrationCooldown: number
}

export interface TradeOfficeLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '28'
    merchantCapacityFactor: number
}

export interface DefensiveBuildingLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '25' | '26' | '43'
    defense: number
}

export interface WallLevelAttributes extends Omit<DefensiveBuildingLevelAttributes, 'buildingId'> {
    buildingId: '31' | '32' | '33' | '42' | '44' | '47'
    defenseFactor: number
}

export interface StonemasonsLodgeLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '34'
    durabilityFactor: number
}

export interface BreweryLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '35'
    attackFactor: number
}

export interface TrapperLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '36'
    trapCount: number
}

export interface WaterworksLevelAttributes extends CommonBuildingLevelAttributes {
    buildingId: '45'
    oasisBonusFactor: number
}

export type BuildingLevelAttributes =
    CommonBuildingLevelAttributes
    | FieldLevelAttributes
    | ProductionBoosterLevelAttributes
    | StorageLevelAttributes
    | TournamentSquareLevelAttributes
    | MainBuildingLevelAttributes
    | MarketplaceLevelAttributes
    | EmbassyLevelAttributes
    | TroopsProductionLevelAttributes
    | TownHallLevelAttributes
    | TradeOfficeLevelAttributes
    | DefensiveBuildingLevelAttributes
    | WallLevelAttributes
    | StonemasonsLodgeLevelAttributes
    | BreweryLevelAttributes
    | TrapperLevelAttributes
    | WaterworksLevelAttributes