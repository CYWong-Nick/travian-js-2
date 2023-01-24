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
    name = 'UpdateVillageListAction'
    
    shouldRun = async (ctx: ActionContext, params: any) => {
        return ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async () => {
        const villages = keyBy(await db.villages.toArray(), 'id')

        const updatedVillages: Village[] = []

        for (const listEntryEle of $('.villageList .listEntry')) {
            const coordEle = $(listEntryEle).find('.coordinatesGrid')[0]

            const villageId = coordEle.getAttribute('data-did')
            const name = coordEle.getAttribute('data-villagename')
            const coordX = coordEle.getAttribute('data-x')
            const coordY = coordEle.getAttribute('data-y')

            if (!villageId || !name || !coordX || !coordY)
                continue

            const village = villages[villageId]
            
            const hasPlusAttackWarning = listEntryEle.classList.contains('attack')
            const isNewPlusAttackWarning = hasPlusAttackWarning && !village?.hasPlusAttackWarning
            if (isNewPlusAttackWarning) {
                await notification.notifyPlusAttack(name)
            }

            updatedVillages.push({
                ...defaultVillage,
                ...village,
                id: villageId,
                name,
                coordX: parseInt(coordX),
                coordY: parseInt(coordY),
                isActive: listEntryEle.classList.contains('active'),
                hasPlusAttackWarning,
                nextRallyPointAttackScanTime: isNewPlusAttackWarning ? Date.now() : (village?.nextRallyPointAttackScanTime || 0)
            })
        }

        await db.villages.bulkPut(updatedVillages)
        const ids = updatedVillages.map(e => e.id)
        await db.villages.bulkDelete(Object.keys(villages).filter(e => !ids.includes(e)))

        return true
    }
}

export default new UpdateVillageListAction()