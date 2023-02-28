import { useLiveQuery } from "dexie-react-hooks";
import { FC, useState } from "react";
import { db } from "../../database/db";
import VillageList from "./VillageList";
import styled from 'styled-components'
import VillageInfoContainer from "./VillageInfoContainer";

const VillagePageStyledContainer = styled.div({
    display: 'flex',
    flexDirection: 'row'
})

const VillagePageContainer: FC = () => {
    const villages = useLiveQuery(() => db.villages.toArray())
    const [selectedVillageId, setSelectedVillageId] = useState<string>()

    const village = selectedVillageId ?
        villages?.find(v => v.id === selectedVillageId)
        : villages?.find(v => v.isActive)

    return <VillagePageStyledContainer>
        {villages && village &&
            <VillageList
                villages={villages}
                selectedVillageId={village.id}
                onChange={setSelectedVillageId}
            />
        }
        {village &&
            <VillageInfoContainer
                key={village.id}
                village={village}
            />
        }
    </VillagePageStyledContainer>
}

export default VillagePageContainer