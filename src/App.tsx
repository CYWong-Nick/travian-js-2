import { FC, useEffect, useState } from 'react';
import Menu from './Menu';
import styled, { createGlobalStyle } from 'styled-components';
import { Tab } from './types/CommonTypes';
import VillagePageContainer from './view/village/VillagePageContainer';
import ActionExecutor from './action/ActionExecutor';
import DebugInfoContainer from './view/debug/DebugInfoContainer';
import SettingViewContainer from './view/settings/SettingViewContainer';
import useSessionStorageState from 'use-session-storage-state'

const GlobalStyle = createGlobalStyle`
  .buildingSlot.a40.g31 .level {
    pointer-events: auto !important
  }
`

const ConsoleContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: 'white',
  color: 'black',
})

interface FlexItemParam {
  expand?: boolean
}

const FlexItem = styled.div<FlexItemParam>(({ expand }) =>
({
  minWidth: 300,
  border: '1px solid black',
  flex: expand ? 1 : 0,
  padding: 10
}))

const App: FC = () => {

  const [bot] = useSessionStorageState('use-bot', { defaultValue: false });

  useEffect(() => {
    ActionExecutor.run(bot)

    const interval = setInterval(() => {
      ActionExecutor.run(bot)
    }, 8000)

    return () => {
      clearInterval(interval)
    }
  }, [bot])

  const [tab, setTab] = useState(Tab.Villages)

  return (
    <ConsoleContainer>
      <GlobalStyle />
      <FlexItem expand>
        <Menu
          value={tab}
          options={Object.values(Tab)}
          onChange={setTab}
        />
        {tab === Tab.Villages && <VillagePageContainer />}
        {tab === Tab.Settings && <SettingViewContainer />}
      </FlexItem>
      <FlexItem>
        <DebugInfoContainer />
      </FlexItem>
    </ConsoleContainer>
  );
}

export default App;
