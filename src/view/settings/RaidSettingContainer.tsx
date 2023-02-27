import { useLiveQuery } from "dexie-react-hooks";
import moment from "moment";
import { FC } from "react";
import { db } from "../../database/db";
import { RaidSchedule } from "../../types/DatabaseTypes";
import useDbCrud from "../common/hooks/useDbCrud";
import useItem from "../common/hooks/useItem";
import useItemList from "../common/hooks/useItemList";

const RaidSettingContainer: FC = () => {
    const raidSchedules = useLiveQuery(() => db.raidSchedule.orderBy('prefix').toArray(), [])
    const useItemListResult = useItemList(raidSchedules)
    const { itemList, updateListItem } = useItemListResult
    const useItemResult = useItem<RaidSchedule>({
        id: '',
        prefix: '',
        minInterval: 0,
        maxInterval: 0,
        nextFarmTime: 0
    })
    const { item, updateItem } = useItemResult
    const { saveNewItem, putItem, deleteItem } = useDbCrud(db.raidSchedule, useItemListResult, useItemResult)

    return (
        <div>
            <h3>Raid</h3>
            <table>
                <thead>
                    <tr>
                        <th>Prefix</th>
                        <th>Interval (sec)</th>
                        <th>Next farm time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {itemList.map(item => {
                        return <tr key={item.id}>
                            <td>
                                <input value={item.prefix} onChange={e => updateListItem(item.id, 'prefix', e.target.value)} />
                            </td>
                            <td>
                                <input value={item.minInterval} onChange={e => updateListItem(item.id, 'minInterval', parseInt(e.target.value) || 0)} />
                                <span> - </span>
                                <input value={item.maxInterval} onChange={e => updateListItem(item.id, 'maxInterval', parseInt(e.target.value) || 0)} />
                            </td>
                            <td>{moment(item.nextFarmTime).format()}</td>
                            <td>
                                <button onClick={() => putItem(item.id)}>Save</button>
                                <button onClick={() => deleteItem(item.id)}>x</button>
                            </td>
                        </tr>
                    })}
                    <tr>
                        <td>
                            <input value={item.prefix} onChange={e => updateItem('prefix', e.target.value)} />
                        </td>
                        <td>
                            <input value={item.minInterval} onChange={e => updateItem('minInterval', parseInt(e.target.value) || 0)} />
                            <span> - </span>
                            <input value={item.maxInterval} onChange={e => updateItem('maxInterval', parseInt(e.target.value) || 0)} />
                        </td>
                        <td>-</td>
                        <td>
                            <button onClick={() => saveNewItem()}>+</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default RaidSettingContainer