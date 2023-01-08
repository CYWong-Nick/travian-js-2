import { useLiveQuery } from "dexie-react-hooks";
import { FC } from "react";
import styled from "styled-components";
import { v4 } from "uuid";
import buildQueueDao from "../../database/dao/buildQueueDao";
import { db } from "../../database/db";
import { Village } from "../../types/VillageTypes";
import { toField, toTown } from "../../utils/NavigationUtils";
import { parseIntIgnoreSep } from "../../utils/NumberUtils";

const StyledButton = styled.button({
    backgroundColor: 'navy',
    color: 'white',
    borderRadius: 5,
    padding: '5px 50px',
    marginTop: 10
})

const NewBuildingButtonContainer: FC = () => {
    const villages = useLiveQuery(() => db.villages.toArray())
    const activeVillage = villages?.find(v => v.isActive)
    const position = new URL(window.location.href).searchParams.get('id')

    if (!position || !activeVillage)
        return <></>

    return <NewBuildingButton village={activeVillage} position={parseInt(position)} />
}

interface NewBuildingButtonProps {
    village: Village
    position: number
}

const NewBuildingButton: FC<NewBuildingButtonProps> = ({
    village,
    position
}) => {
    const building = useLiveQuery(() => db.villageBuildings.where({ villageId: village.id, position }).first())

    const handleQueueItem = async (e: EventTarget) => {
        const contract = $(e).parent().parent().find('.contractNew')[0]
        const buildingId = '' + parseIntIgnoreSep(contract.id)

        const villageBuilding = {
            id: v4(),
            villageId: village.id,
            buildingId,
            level: 0,
            position
        }
        await db.villageBuildings.add(villageBuilding)
        await buildQueueDao.addBuildingToQueue(villageBuilding)

        toTown()
    }

    if (building) {
        return <></>
    }

    return <StyledButton onClick={e => handleQueueItem(e.target)}>Queue</StyledButton>
}

export default NewBuildingButtonContainer