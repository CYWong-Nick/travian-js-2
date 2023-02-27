import moment from "moment";
import { FC } from "react";
import { ConfigKey, useKeyValueLiveQuery } from "../../database/dao/keyValueDao";
import ColumnContainer from "../common/ColumnContainer";
import RowContainer from "../common/RowContainer";
import FeatureSettingContainer from "./feature/FeatureSettingContainer";
import NotificationChannelContainer from "./NotificationChannelContainer";
import RaidSettingContainer from "./RaidSettingContainer";

const SettingViewContainer: FC = () => {
    const nextPlusOverview = useKeyValueLiveQuery(ConfigKey.NextPlusOverviewScanTime)
    const nextRaidReportCheck = useKeyValueLiveQuery(ConfigKey.NextRaidReportScanTime)
    const nextUserProfileUpdate = useKeyValueLiveQuery(ConfigKey.NextUserProfileScanTime)

    return <ColumnContainer>
        <RowContainer>
            <div>
                <h3>General</h3>
                <table>
                    <tbody>
                        <tr>
                            <th>Next plus statistics check</th>
                            <td>{moment(nextPlusOverview).format()}</td>
                        </tr>
                        <tr>
                            <th>Next raid report check</th>
                            <td>{moment(nextRaidReportCheck).format()}</td>
                        </tr>
                        <tr>
                            <th>Next user profile update</th>
                            <td>{moment(nextUserProfileUpdate).format()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <RaidSettingContainer />
        </RowContainer>
        <RowContainer>
            <NotificationChannelContainer />
        </RowContainer>
        <RowContainer>
            <FeatureSettingContainer />
        </RowContainer>
    </ColumnContainer>
}

export default SettingViewContainer

