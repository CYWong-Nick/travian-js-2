import { FC } from "react";
import styled from "styled-components";
import RowContainer from "../../common/RowContainer";
import AdventureFeatureSettingContainer from "./AdventureFeatureSettingContainer";
import AutoLoginFeatureSettingContainer from "./AutoLoginFeatureSettingContainer";
import PlusOverviewScannerFeatureSettingContainer from "./PlusOverviewScannerFeatureSettingContainer";

const Container = styled.div({
    backgroundColor: 'lightgrey',
    'table tbody tr td, table tbody tr th': {
        backgroundColor: 'lightgrey'
    }
})

const FeatureSettingContainer: FC = () => {
    return <Container>
        <h3>Feature Settings</h3>
        <RowContainer>
            <AdventureFeatureSettingContainer />
            <AutoLoginFeatureSettingContainer />
            <PlusOverviewScannerFeatureSettingContainer />
        </RowContainer>
    </Container>
}

export default FeatureSettingContainer