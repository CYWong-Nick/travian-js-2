import keyBy from 'lodash.keyby'
import { db } from '../../database/db'
import { Tribe, CurrentPageEnum } from '../../types/CommonTypes'
import { Village, VillageFieldLayoutEnum } from '../../types/VillageTypes'
import { Action, ActionContext } from '../../types/ActionTypes'
import notification from '../../notification/notification'

const defaultVillage = {
    lumber: 0,
    clay: 0,
    iron: 0,
    crop: 0,
    lumberCapacity: 0,
    clayCapacity: 0,
    ironCapacity: 0,
    cropCapacity: 0,
    tribe: Tribe.Unknown,
    layout: VillageFieldLayoutEnum.Unknown,
}

class UpdateVillageListAction extends Action<any> {
    shouldRun = async (ctx: ActionContext, params: any) => {
        return ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async () => {
        const villages = keyBy(await db.villages.toArray(), 'id')

        const updatedVillages: Village[] = []

        for (const listEntryEle of $('.villageList .listEntry')) {
            const hasAttacks = listEntryEle.classList.contains('attack')
            const coordEle = $(listEntryEle).find('.coordinatesGrid')[0]

            const villageId = coordEle.getAttribute('data-did')
            const name = coordEle.getAttribute('data-villagename')
            const coordX = coordEle.getAttribute('data-x')
            const coordY = coordEle.getAttribute('data-y')

            if (!villageId || !name || !coordX || !coordY)
                continue

            const village = villages[villageId]

            let plusAttackStartTime
            if (hasAttacks) {
                if (village?.plusAttackStartTime) {
                    plusAttackStartTime = village?.plusAttackStartTime
                } else {
                    await notification.notifyPlusAttack(name)
                    plusAttackStartTime = Date.now()
                }
            } else {
                plusAttackStartTime = 0
            }

            updatedVillages.push({
                ...defaultVillage,
                ...village,
                id: villageId,
                name,
                coordX: parseInt(coordX),
                coordY: parseInt(coordY),
                isActive: listEntryEle.classList.contains('active'),
                plusAttackStartTime
            })
        }

        await db.villages.bulkPut(updatedVillages)
        const ids = updatedVillages.map(e => e.id)
        await db.villages.bulkDelete(Object.keys(villages).filter(e => !ids.includes(e)))

        return true
    }
}

export default new UpdateVillageListAction()