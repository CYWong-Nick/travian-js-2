import { db } from "../database/db";
import { buildings } from "../static-data/building";
import { BuildingLocation, BuildingLevelAttributes } from "../types/BuildingTypes";
import { CurrentPageEnum, Tribe } from "../types/CommonTypes";
import { CurrentBuildQueueItem } from "../types/DatabaseTypes";
import { Village } from "../types/VillageTypes";

export const getCurrentPage = (): CurrentPageEnum => {
    const pathname = window.location.pathname

    if (pathname.startsWith('/profile')) {
        return CurrentPageEnum.UserProfile
    }

    switch (pathname) {
        case '/dorf1.php': {
            return CurrentPageEnum.Field
        }
        case '/dorf2.php': {
            return CurrentPageEnum.Town
        }
        case '/build.php': {
            return CurrentPageEnum.Building
        }
        case '/report':
        case '/report/overview': {
            return CurrentPageEnum.Report
        }
        case '/report/offensive': {
            return CurrentPageEnum.OffensiveReport
        }
        case '/report/scouting': {
            return CurrentPageEnum.ScoutReport
        }
        case '/': {
            return CurrentPageEnum.Login
        }
        case '/village/statistics':
        case '/village/statistics/overview': {
            return CurrentPageEnum.PlusOverview
        }
        case '/village/statistics/resources': {
            return CurrentPageEnum.PlusResources
        }
        case '/hero/adventures': {
            return CurrentPageEnum.Adventure
        }
        default: {
            return CurrentPageEnum.Unknown
        }
    }
}

export const getCurrentVillage = async (): Promise<Village> => {
    const villages = await db.villages.toArray()
    return villages.find(v => v.isActive)!
}

export const sleep = (seconds: number) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export const getBuildableTypes = (village: Village, currentBuildingQueue: CurrentBuildQueueItem[]): BuildingLocation[] => {
    const actualBuildQueue = currentBuildingQueue.filter(e => e.targetCompletionTime > Date.now())

    if (village.tribe === Tribe.Romans) {
        if (actualBuildQueue.length === 3)
            return []

        const fieldCount = actualBuildQueue.filter(e => buildings[e.buildingId].location === BuildingLocation.Field).length
        const townCount = actualBuildQueue.filter(e => buildings[e.buildingId].location === BuildingLocation.Town).length
        const availableTypes: BuildingLocation[] = []
        if (fieldCount < 2) {
            availableTypes.push(BuildingLocation.Field)
        }
        if (townCount < 2) {
            availableTypes.push(BuildingLocation.Town)
        }
        return availableTypes
    } else {
        if (actualBuildQueue.length < 2) {
            return [BuildingLocation.Field, BuildingLocation.Town]
        } else {
            return []
        }
    }
}

export const isSufficientResource = (village: Village, levelAttirbutes: BuildingLevelAttributes) => {
    return village.lumber >= levelAttirbutes.lumber
        && village.clay >= levelAttirbutes.clay
        && village.iron >= levelAttirbutes.iron
        && village.crop >= levelAttirbutes.crop
}

const checkInBuilding = (buildingId: string, position: number | null, additionalMatch?: Record<string, string>): boolean => {
    const url = new URL(window.location.href)

    const isBuildingIdMatch = buildingId === url.searchParams.get('gid')

    const positionStr = url.searchParams.get('id')
    const isPositionMatch = buildingId === '16'
        || !position
        || (!!positionStr && parseInt(positionStr) === position)

    const isQueryParamMatch = !additionalMatch
        || Object.entries(additionalMatch)
            .every(([key, value]) =>
                url.searchParams.get(key) === value
            )

    return getCurrentPage() === CurrentPageEnum.Building
        && isBuildingIdMatch
        && isPositionMatch
        && isQueryParamMatch
}

export const isInBuilding = (buildingId: string, additionalMatch?: Record<string, string>): boolean => {
    return checkInBuilding(buildingId, null, additionalMatch)
}

export const isInBuildingAtPosition = (buildingId: string, position: number | null, additionalMatch?: Record<string, string>): boolean => {
    return checkInBuilding(buildingId, position, additionalMatch)
}