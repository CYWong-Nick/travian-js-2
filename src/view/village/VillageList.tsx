import { FC } from "react";
import styled from 'styled-components'
import { Village } from "../../types/VillageTypes";

interface VillageListProps {
    villages: Village[]
    selectedVillageId: string
    onChange: (villageId: string) => any
}

const VillageListContainer = styled.div({
    display: 'flex',
    flexDirection: 'column'
})

interface VillageOptionProps {
    selected: boolean
}

const VillageOption = styled.div<VillageOptionProps>(props => ({
    backgroundColor: props.selected ? 'navy' : 'white',
    color: props.selected ? 'white' : 'black',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    cursor: 'pointer'
}))


const VillageList: FC<VillageListProps> = ({
    villages,
    selectedVillageId,
    onChange
}) => {
    return <VillageListContainer>
        {
            villages.map(village =>
                <VillageOption
                    key={`village-list-opt-${village.id}`}
                    selected={village.id === selectedVillageId}
                    onClick={() => onChange(village.id)}
                >
                    {village.name}
                </VillageOption>
            )
        }
    </VillageListContainer>
}

export default VillageList