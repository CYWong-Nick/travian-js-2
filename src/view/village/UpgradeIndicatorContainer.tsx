import { useLiveQuery } from "dexie-react-hooks";
import { FC, useCallback } from "react";
import styled from "styled-components";
import buildQueueDao from "../../database/dao/buildQueueDao";
import { db } from "../../database/db";
import { getMaxBuildingLevel } from "../../static-data/building";
import { Village } from "../../types/VillageTypes";

interface UpgradeIndicatorContainerProps {
    position: number
}

interface StyledContainerProps {
    isCap: boolean
}

const StyledContainer = styled.div<StyledContainerProps>(prop => ({
    position: 'absolute',
    top: 20,
    backgroundColor: prop.isCap ? 'navy' : 'gold',
    color: prop.isCap ? 'white' : 'black',
    width: 25,
    textAlign: 'center',
    borderRadius: 25,
    height: 25,
    right: -20
}))

const UpgradeIndicatorContainer: FC<UpgradeIndicatorContainerProps> = ({
    position
}) => {
    const villages = useLiveQuery(() => db.villages.toArray(), [])
    const activeVillage = villages?.find(v => v.isActive)

    return activeVillage ?
        <UpgradeIndicator village={activeVillage} position={position} />
        : <></>
}

interface UpgradeIndicatorProps {
    village: Village
    position: number
}

const UpgradeIndicator: FC<UpgradeIndicatorProps> = ({
    village,
    position
}) => {
    const building = useLiveQuery(() => db.villageBuildings.where({ position, villageId: village.id }).first(), [village])
    const buildQueue = useLiveQuery(() => db.buildQueue.where({ position, villageId: village.id }).toArray(), [village, position])
    const upgradedLevel = buildQueue?.length ?
        Math.max(...buildQueue.map(e => e.targetLevel))
        : undefined

    const handleAddBuildQueue = useCallback(() => {
        building && buildQueueDao.addBuildingToQueue(building)
    }, [building])

    if (!building || building.level === getMaxBuildingLevel(building.buildingId, village.isCapital))
        return <></>

    return (
        <StyledContainer
            isCap={upgradedLevel === getMaxBuildingLevel(building.buildingId, village.isCapital)}
            onClick={e => {
                e.preventDefault()
                handleAddBuildQueue()
            }}
        >
            {upgradedLevel || '+'}
        </StyledContainer>
    )
}

export default UpgradeIndicatorContainer