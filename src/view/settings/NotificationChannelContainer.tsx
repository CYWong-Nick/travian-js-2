import { useLiveQuery } from "dexie-react-hooks";
import { FC } from "react";
import { db } from "../../database/db";
import { NotificationChannelType, NotificationTarget } from "../../types/DatabaseTypes";
import useDbCrud from "../common/hooks/useDbCrud";
import useItem from "../common/hooks/useItem";
import useItemList from "../common/hooks/useItemList";

const NotificationChannelContainer: FC = () => {
    const notificationTargets = useLiveQuery(() => db.notificationTarget.toArray())
    const useItemListResult = useItemList(notificationTargets)
    const { itemList, updateListItem } = useItemListResult
    const useItemResult = useItem<NotificationTarget>({
        id: '',
        channelType: NotificationChannelType.Telegram,
        telegramChatId: '',
        telegramToken: '',
        discordWebhookId: '',
        discordWebhookToken: '',
        alertScout: false,
        alertResourceCapacity: false,
        alertEmptyBuild: false,
        alertAttack: false
    })
    const { item, updateItem } = useItemResult
    const { saveNewItem, putItem, deleteItem } = useDbCrud(db.notificationTarget, useItemListResult, useItemResult)

    return (
        <table>
            <thead>
                <tr>
                    <th>Channel Type</th>
                    <th>Channel Configurations</th>
                    <th>Notification Options</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {itemList.map(item => {
                    return <tr key={item.id}>
                        <td>
                            <select value={item.channelType} onChange={e => updateListItem(item.id, 'channelType', e.target.value)}>
                                {Object.values(NotificationChannelType).map(e => <option value={e}>{e}</option>)}
                            </select>
                        </td>
                        <td>
                            {item.channelType === NotificationChannelType.Telegram &&
                                <>
                                    <div>
                                        <label>Telegram Chat ID</label>
                                        <input value={item.telegramChatId} onChange={e => updateListItem(item.id, 'telegramChatId', e.target.value)} />
                                    </div>
                                    <div>
                                        <label>Telegram Bot Token</label>
                                        <input value={item.telegramToken} onChange={e => updateListItem(item.id, 'telegramToken', e.target.value)} />
                                    </div>
                                </>
                            }
                            {item.channelType === NotificationChannelType.Discord &&
                                <>
                                    <div>
                                        <label>Discord Webhook ID</label>
                                        <input value={item.discordWebhookId} onChange={e => updateListItem(item.id, 'discordWebhookId', e.target.value)} />
                                    </div>
                                    <div>
                                        <label>Discord Webhook Token</label>
                                        <input value={item.discordWebhookToken} onChange={e => updateListItem(item.id, 'discordWebhookToken', e.target.value)} />
                                    </div>
                                </>
                            }
                        </td>
                        <td>
                            <span>Alert</span>
                            <input type="checkbox" checked={item.alertAttack} onChange={() => updateListItem(item.id, 'alertAttack', !item.alertAttack)} />
                            <input type="checkbox" checked={item.alertScout} onChange={() => updateListItem(item.id, 'alertScout', !item.alertScout)} />
                            <input type="checkbox" checked={item.alertResourceCapacity} onChange={() => updateListItem(item.id, 'alertResourceCapacity', !item.alertResourceCapacity)} />
                            <input type="checkbox" checked={item.alertEmptyBuild} onChange={() => updateListItem(item.id, 'alertEmptyBuild', !item.alertEmptyBuild)} />
                        </td>
                        <td>
                            <button onClick={() => putItem(item.id)}>Save</button>
                            <button onClick={() => deleteItem(item.id)}>x</button>
                        </td>
                    </tr>
                })}

                <tr>
                    <td>
                        <select value={item.channelType} onChange={e => updateItem('channelType', e.target.value)}>
                            {Object.values(NotificationChannelType).map(e => <option value={e}>{e}</option>)}
                        </select>
                    </td>
                    <td>
                        {item.channelType === NotificationChannelType.Telegram &&
                            <>
                                <div>
                                    <label>Telegram Chat ID</label>
                                    <input value={item.telegramChatId} onChange={e => updateItem('telegramChatId', e.target.value)} />
                                </div>
                                <div>
                                    <label>Telegram Bot Token</label>
                                    <input value={item.telegramToken} onChange={e => updateItem('telegramToken', e.target.value)} />
                                </div>
                            </>
                        }
                        {item.channelType === NotificationChannelType.Discord &&
                            <>
                                <div>
                                    <label>Discord Webhook ID</label>
                                    <input value={item.discordWebhookId} onChange={e => updateItem('discordWebhookId', e.target.value)} />
                                </div>
                                <div>
                                    <label>Discord Webhook Token</label>
                                    <input value={item.discordWebhookToken} onChange={e => updateItem('discordWebhookToken', e.target.value)} />
                                </div>
                            </>
                        }
                    </td>
                    <td>
                        <div>
                            <label>Alert Attack</label>
                            <input type="checkbox" checked={item.alertAttack} onChange={() => updateItem('alertAttack', !item.alertAttack)} />
                        </div>
                        <div>
                            <label>Alert Scout</label>
                            <input type="checkbox" checked={item.alertScout} onChange={() => updateItem('alertScout', !item.alertScout)} />
                        </div>
                        <div>
                            <label>Alert Resource Capacity</label>
                            <input type="checkbox" checked={item.alertResourceCapacity} onChange={() => updateItem('alertResourceCapacity', !item.alertResourceCapacity)} />
                        </div>
                        <div>
                            <label>Alert Empty Build Queue</label>
                            <input type="checkbox" checked={item.alertEmptyBuild} onChange={() => updateItem('alertEmptyBuild', !item.alertEmptyBuild)} />
                        </div>
                    </td>
                    <td>
                        <button onClick={() => saveNewItem()}>+</button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default NotificationChannelContainer

