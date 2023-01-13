import { Action, ActionContext } from '../../types/ActionTypes';
import { RaidList, RaidResult, RaidTarget } from '../../types/DatabaseTypes';
import moment from 'moment';
import { cleanParseInt } from '../../utils/NumberUtils';
import { db } from '../../database/db';
import keyBy from 'lodash.keyby';
import { isInBuilding, sleep } from '../../utils/BotUtils';

class UpdateRaidTargetAction extends Action<any> {
    name = 'UpdateRaidTargetAction'
    
    shouldRun = async (ctx: ActionContext, params: any) => {
        return isInBuilding('16', 39, { tt: '99' })
    }

    run = async (ctx: ActionContext) => {
        while ($('div.expandCollapse.expanded.loading').length) {
            await sleep(0.5)
        }

        const raidListMap = keyBy(await db.raidList.toArray(), 'id')
        const raidTargetMap = keyBy(await db.raidTarget.toArray(), 'id')

        const raidListUpdate: RaidList[] = []
        const raidTargetUpdate: RaidTarget[] = []

        $('.villageWrapper').each((_, villageEle) => {
            $(villageEle).find('.raidList').each((_, listEle) => {
                const listId = listEle.id
                const current = raidListMap[listId]
                const listName = $(listEle).find('.listName').text()
                raidListUpdate.push({
                    ...current,
                    id: listId,
                    name: listName
                })

                $(listEle).find('.slotRow').each((idx, e) => {
                    const id = e.id
                    const target = $(e).find('.target a')
                    const href = target.attr('href')

                    if (!href)
                        return

                    const url = new URL(window.location.protocol + '//' + window.location.host + href)
                    const x = url.searchParams.get('x')
                    const y = url.searchParams.get('y')

                    if (!x || !y)
                        return

                    const lastRaidEle = $($(e).find('.lastRaid')[0])
                    let lastRaidResult = RaidResult.Unknown
                    let lastRaidBounty = 0
                    let lastRaidCapacity = 0
                    let lastRaidMoment = moment(0)

                    if (lastRaidEle.find('.iReport').length) {
                        if (lastRaidEle.find('.iReport1').length)
                            lastRaidResult = RaidResult.Safe
                        else if (lastRaidEle.find('.iReport2').length)
                            lastRaidResult = RaidResult.Loss
                        else if (lastRaidEle.find('.iReport3').length)
                            lastRaidResult = RaidResult.TotalLoss

                        const lastRaidTimeText = lastRaidEle.find('a').text()
                        const lastRaidTimeTextComponent = lastRaidTimeText.split(',')
                        const date = lastRaidTimeTextComponent[0]
                        const time = lastRaidTimeTextComponent[1]

                        lastRaidMoment = moment()
                        if (date !== 'today') {
                            const parts = date.split('.')
                            lastRaidMoment
                                .set('year', parseInt(parts[2]))
                                .set('month', parseInt(parts[1]))
                                .set('day', parseInt(parts[0]))
                        }
                        const parts = time.split(':')
                        lastRaidMoment
                            .set('hour', parseInt(parts[0]))
                            .set('minute', parseInt(parts[1]))
                            .set('second', 0)
                            .set('millisecond', 0)

                        const lastRaidResourceText = lastRaidEle.find('.carry').attr('alt')
                        if (lastRaidResourceText) {
                            const lastRaidResourceTextParts = lastRaidResourceText.split('.')
                            lastRaidBounty = cleanParseInt(lastRaidResourceTextParts[0])
                            lastRaidCapacity = cleanParseInt(lastRaidResourceTextParts[1])
                        }
                    }

                    const current = raidTargetMap[id]
                    if ((!current || current.lastRaidTime < lastRaidMoment.valueOf()) && lastRaidResult === RaidResult.TotalLoss) {
                        if (e.classList.contains('slotActive')) {
                            $(e).find('input')[0].click()
                        }
                    }

                    raidTargetUpdate.push({
                        ...current,
                        id,
                        name: target.text().trim(),
                        raidListId: listId,
                        coordinateX: parseInt(x),
                        coordinateY: parseInt(y),
                        lastRaidTime: lastRaidMoment.valueOf(),
                        lastRaidBounty,
                        lastRaidCapacity,
                        lastRaidResult,
                    })
                }).toArray()
            })
        })

        $('.stateToggleButton').filter((_, e) => e.textContent === "Deactivate selected").trigger('click')

        const raidListIds = raidListUpdate.map(e => e.id)
        await db.raidList.bulkDelete(Object.keys(raidListMap).filter(e => !raidListIds.includes(e)))
        await db.raidList.bulkPut(raidListUpdate)

        const raidTargetIds = raidTargetUpdate.map(e => e.id)
        await db.raidTarget.bulkDelete(Object.keys(raidTargetMap).filter(e => !raidTargetIds.includes(e)))
        await db.raidTarget.bulkPut(raidTargetUpdate)

        return true
    }
}

export default new UpdateRaidTargetAction()