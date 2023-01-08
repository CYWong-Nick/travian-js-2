import { useLiveQuery } from "dexie-react-hooks";
import moment from "moment";
import { FC, useState } from "react";
import styled from "styled-components";
import { v4 } from "uuid";
import { ConfigKey, useKeyValueLiveQuery } from "../../database/dao/keyValueDao";
import { db } from "../../database/db";
import { NotificationChannelType, NotificationTarget, RaidSchedule } from "../../types/DatabaseTypes";

const StyledSettingViewContainer = styled.div({
    display: 'flex',
    flexDirection: 'column',
})

const FlexRowContainer = styled.div({
    display: 'flex',
    flexDirection: 'row',
    columnGap: 10
})

const SettingViewContainer: FC = () => {

    const raidSchedules = useLiveQuery(() => db.raidSchedule.orderBy('prefix').toArray(), [])
    const [raidScheduleUpdates, setRaidScheduleUpdates] = useState<Record<string, RaidSchedule>>({})
    const [newRaidSchedule, setNewRaidSchedule] = useState<RaidSchedule>({
        id: '',
        prefix: '',
        minInterval: 0,
        maxInterval: 0,
        nextFarmTime: 0
    })

    const nextPlusOverview = useKeyValueLiveQuery(ConfigKey.NextPlusOverviewScanTime)
    const nextRaidReportCheck = useKeyValueLiveQuery(ConfigKey.NextRaidReportScanTime)
    const nextUserProfileUpdate = useKeyValueLiveQuery(ConfigKey.NextUserProfileScanTime)

    const notificationTargets = useLiveQuery(() => db.notificationTarget.toArray())
    const [notificationTargetUpdates, setNotificationTargetUpdates] = useState<Record<string, NotificationTarget>>({})
    const [newNotificationTarget, setNewNotificationTarget] = useState<NotificationTarget>({
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

    const updateNewNotificationState = (key: keyof NotificationTarget, value: any) => {
        setNewNotificationTarget(e => ({
            ...e,
            [key]: value
        }))
    }

    const addNotificationTarget = async () => {
        await db.notificationTarget.add({
            ...newNotificationTarget,
            id: v4()
        })

        setNewNotificationTarget({
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
    }

    const updateExistingNotificationState = (id: string, key: keyof NotificationTarget, value: any) => {
        setNotificationTargetUpdates(e => ({
            ...e,
            [id]: {
                ...notificationTargets?.find(n => n.id === id),
                ...e[id],
                [key]: value
            }
        }))
    }

    const saveNotificationTarget = (id: string) => {
        const item = notificationTargetUpdates[id]
        if (!item)
            return

        db.notificationTarget.put(item)
    }

    const deleteNotificationTarget = (id: string) => {
        db.notificationTarget.delete(id)
    }

    const updateNewRaidState = (key: keyof RaidSchedule, value: any) => {
        setNewRaidSchedule(e => ({
            ...e,
            [key]: value
        }))
    }

    const addRaid = async () => {
        await db.raidSchedule.add({
            ...newRaidSchedule,
            id: v4()
        })

        setNewRaidSchedule({
            id: '',
            prefix: '',
            minInterval: 0,
            maxInterval: 0,
            nextFarmTime: 0
        })
    }

    const updateExistingRaidState = (id: string, key: keyof RaidSchedule, value: any) => {
        setRaidScheduleUpdates(e => ({
            ...e,
            [id]: {
                ...raidSchedules?.find(rs => rs.id === id),
                ...e[id],
                [key]: value
            }
        }))
    }

    const saveRaid = (id: string) => {
        const item = raidScheduleUpdates[id]
        if (!item)
            return

        db.raidSchedule.put(item)
    }

    const deleteRaid = (id: string) => {
        db.raidSchedule.delete(id)
    }

    return <StyledSettingViewContainer>
        <FlexRowContainer>
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
                        {raidSchedules?.map(e => {
                            const item = raidScheduleUpdates[e.id] || e

                            return <tr key={item.id}>
                                <td>
                                    <input value={item.prefix} onChange={e => updateExistingRaidState(item.id, 'prefix', e.target.value)} />
                                </td>
                                <td>
                                    <input value={item.minInterval} onChange={e => updateExistingRaidState(item.id, 'minInterval', parseInt(e.target.value) || 0)} />
                                    <span> - </span>
                                    <input value={item.maxInterval} onChange={e => updateExistingRaidState(item.id, 'maxInterval', parseInt(e.target.value) || 0)} />
                                </td>
                                <td>{moment(item.nextFarmTime).format()}</td>
                                <td>
                                    <button onClick={() => saveRaid(item.id)}>Save</button>
                                    <button onClick={() => deleteRaid(item.id)}>x</button>
                                </td>
                            </tr>
                        })}
                        <tr>
                            <td>
                                <input value={newRaidSchedule.prefix} onChange={e => updateNewRaidState('prefix', e.target.value)} />
                            </td>
                            <td>
                                <input value={newRaidSchedule.minInterval} onChange={e => updateNewRaidState('minInterval', parseInt(e.target.value) || 0)} />
                                <span> - </span>
                                <input value={newRaidSchedule.maxInterval} onChange={e => updateNewRaidState('maxInterval', parseInt(e.target.value) || 0)} />
                            </td>
                            <td>-</td>
                            <td>
                                <button onClick={() => addRaid()}>+</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </FlexRowContainer>
        <FlexRowContainer>
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
                    {notificationTargets?.map(e => {
                        const item = notificationTargetUpdates[e.id] || e
                        return <tr key={item.id}>
                            <td>
                                <select value={item.channelType} onChange={e => updateExistingNotificationState(item.id, 'channelType', e.target.value)}>
                                    {Object.values(NotificationChannelType).map(e => <option value={e}>{e}</option>)}
                                </select>
                            </td>
                            <td>
                                {item.channelType === NotificationChannelType.Telegram &&
                                    <>
                                        <div>
                                            <label>Telegram Chat ID</label>
                                            <input value={item.telegramChatId} onChange={e => updateExistingNotificationState(item.id, 'telegramChatId', e.target.value)} />
                                        </div>
                                        <div>
                                            <label>Telegram Bot Token</label>
                                            <input value={item.telegramToken} onChange={e => updateExistingNotificationState(item.id, 'telegramToken', e.target.value)} />
                                        </div>
                                    </>
                                }
                                 {item.channelType === NotificationChannelType.Discord &&
                                    <>
                                        <div>
                                            <label>Discord Webhook ID</label>
                                            <input value={item.discordWebhookId} onChange={e => updateExistingNotificationState(item.id, 'discordWebhookId', e.target.value)} />
                                        </div>
                                        <div>
                                            <label>Discord Webhook Token</label>
                                            <input value={item.discordWebhookToken} onChange={e => updateExistingNotificationState(item.id, 'discordWebhookToken', e.target.value)} />
                                        </div>
                                    </>
                                }
                            </td>
                            <td>
                                <span>Alert</span>
                                <input type="checkbox" checked={item.alertAttack} onChange={() => updateExistingNotificationState(item.id, 'alertAttack', !item.alertAttack)} />
                                <input type="checkbox" checked={item.alertScout} onChange={() => updateExistingNotificationState(item.id, 'alertScout', !item.alertScout)} />
                                <input type="checkbox" checked={item.alertResourceCapacity} onChange={() => updateExistingNotificationState(item.id, 'alertResourceCapacity', !item.alertResourceCapacity)} />
                                <input type="checkbox" checked={item.alertEmptyBuild} onChange={() => updateExistingNotificationState(item.id, 'alertEmptyBuild', !item.alertEmptyBuild)} />
                            </td>
                            <td>
                                <button onClick={() => saveNotificationTarget(item.id)}>Save</button>
                                <button onClick={() => deleteNotificationTarget(item.id)}>x</button>
                            </td>
                        </tr>
                    })}

                    <tr>
                        <td>
                            <select value={newNotificationTarget.channelType} onChange={e => updateNewNotificationState('channelType', e.target.value)}>
                                {Object.values(NotificationChannelType).map(e => <option value={e}>{e}</option>)}
                            </select>
                        </td>
                        <td>
                            {newNotificationTarget.channelType === NotificationChannelType.Telegram &&
                                <>
                                    <div>
                                        <label>Telegram Chat ID</label>
                                        <input value={newNotificationTarget.telegramChatId} onChange={e => updateNewNotificationState('telegramChatId', e.target.value)} />
                                    </div>
                                    <div>
                                        <label>Telegram Bot Token</label>
                                        <input value={newNotificationTarget.telegramToken} onChange={e => updateNewNotificationState('telegramToken', e.target.value)} />
                                    </div>
                                </>
                            }
                            {newNotificationTarget.channelType === NotificationChannelType.Discord &&
                                <>
                                    <div>
                                        <label>Discord Webhook ID</label>
                                        <input value={newNotificationTarget.discordWebhookId} onChange={e => updateNewNotificationState('discordWebhookId', e.target.value)} />
                                    </div>
                                    <div>
                                        <label>Discord Webhook Token</label>
                                        <input value={newNotificationTarget.discordWebhookToken} onChange={e => updateNewNotificationState('discordWebhookToken', e.target.value)} />
                                    </div>
                                </>
                            }
                        </td>
                        <td>
                            <div>
                                <label>Alert Attack</label>
                                <input type="checkbox" checked={newNotificationTarget.alertAttack} onChange={() => updateNewNotificationState('alertAttack', !newNotificationTarget.alertAttack)} />
                            </div>
                            <div>
                                <label>Alert Scout</label>
                                <input type="checkbox" checked={newNotificationTarget.alertScout} onChange={() => updateNewNotificationState('alertScout', !newNotificationTarget.alertScout)} />
                            </div>
                            <div>
                                <label>Alert Resource Capacity</label>
                                <input type="checkbox" checked={newNotificationTarget.alertResourceCapacity} onChange={() => updateNewNotificationState('alertResourceCapacity', !newNotificationTarget.alertResourceCapacity)} />
                            </div>
                            <div>
                                <label>Alert Empty Build Queue</label>
                                <input type="checkbox" checked={newNotificationTarget.alertEmptyBuild} onChange={() => updateNewNotificationState('alertEmptyBuild', !newNotificationTarget.alertEmptyBuild)} />
                            </div>
                        </td>
                        <td>
                            <button onClick={() => addNotificationTarget()}>+</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </FlexRowContainer>
    </StyledSettingViewContainer>
}

export default SettingViewContainer

