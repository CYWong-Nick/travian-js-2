import { FC } from "react";
import styled from 'styled-components'
import { Tab } from "./types/CommonTypes";
import Switch from "./view/common/Switch";
import useSessionStorageState from 'use-session-storage-state'

interface MenuProps {
    value: Tab
    options: Tab[]
    onChange: (option: Tab) => any
}

const MenuContainer = styled.div({
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between'
})

const MenuOptionContainer = styled.div({
    display: 'flex',
    flexDirection: 'row'
})

interface MenuOptionProps {
    selected: boolean
}

const MenuOption = styled.div<MenuOptionProps>(props => ({
    backgroundColor: props.selected ? 'navy' : 'white',
    color: props.selected ? 'white' : 'black',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    cursor: 'pointer'
}))

const Menu: FC<MenuProps> = ({
    value,
    options,
    onChange
}) => {

    const [bot, setBot] = useSessionStorageState('use-bot', {defaultValue: false});

    return <MenuContainer>
        <MenuOptionContainer>
            {
                options.map(opt =>
                    <MenuOption
                        key={`menu-opt-${opt}`}
                        selected={opt === value}
                        onClick={() => onChange(opt)}
                    >
                        {opt}
                    </MenuOption>
                )
            }
        </MenuOptionContainer>
        <div>Build: @@BUILD_TIME@@</div>
        <Switch checked={bot} onChange={setBot} />
    </MenuContainer>
}

export default Menu