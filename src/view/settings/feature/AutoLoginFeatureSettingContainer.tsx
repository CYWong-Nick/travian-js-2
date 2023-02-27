import { FC } from "react";
import { autoLoginFeatureDao, useAutoLoginFeature } from "../../../database/dao/feature/autoLoginFeatureDao";
import Button from "../../common/Button";
import Checkbox from "../../common/Checkbox";
import useItem from "../../common/hooks/useItem";
import Input from "../../common/Input";

const AutoLoginFeatureSettingContainer: FC = () => {
    const { setValue } = autoLoginFeatureDao()
    const feature = useAutoLoginFeature()
    const { item, updateItem, resetItem } = useItem(feature)

    const handleSave = async () => {
        await setValue(item)
        resetItem()
    }

    return <div>
        <h3>Auto Login</h3>
        <table>
            <tbody>
                <tr>
                    <th>Enable</th>
                    <td>
                        <Checkbox checked={item.enabled} onChange={value => updateItem('enabled', value)} />
                    </td>
                </tr>
                <tr>
                    <th>Username</th>
                    <td>
                        <Input value={item.username} onChange={value => updateItem('username', value)} />
                    </td>
                </tr>
                <tr>
                    <th>Password</th>
                    <td>
                        <Input type="password" value={item.password} onChange={value => updateItem('password', value)} />
                    </td>
                </tr>
                <tr>
                    <th colSpan={2}>
                        <Button onClick={handleSave}>
                            Save
                        </Button>
                    </th>
                </tr>
            </tbody>
        </table>
    </div>
}

export default AutoLoginFeatureSettingContainer