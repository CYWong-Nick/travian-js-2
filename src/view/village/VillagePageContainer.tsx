import { useLiveQuery } from "dexie-react-hooks";
import { FC, useState } from "react";
import { db } from "../../database/db";
import VillageList from "./VillageList";
import styled from 'styled-components'
import VillageInfoContainer from "./VillageInfoContainer";
import { Village } from "../../types/VillageTypes";

const VillagePageStyledContainer = styled.div({
    display: 'flex',
    flexDirection: 'row'
})

const VillagePageContainer: FC = () => {
    const villages = useLiveQuery(() => db.villages.toArray())
    const activeVillage = villages?.find(v => v.isActive)
    const [selectedVillage, setSelectedVillage] = useState<Village | undefined>()

    const displayVillage = selectedVillage || activeVillage

    return <VillagePageStyledContainer>
        {villages && displayVillage &&
            <VillageList
                villages={villages}
                selectedVillageId={displayVillage.id}
                onChange={id => setSelectedVillage(villages.find(village => village.id === id))}
            />
        }
        {displayVillage &&
            <VillageInfoContainer
                village={displayVillage}
            />
        }
    </VillagePageStyledContainer>
}

export default VillagePageContainer