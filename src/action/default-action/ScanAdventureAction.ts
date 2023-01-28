import { db } from '../../database/db'
import { CurrentPageEnum } from '../../types/CommonTypes'
import { ActionQueueManager } from '../action'
import { Action, ActionContext } from '../../types/ActionTypes'
import keyValueDao, { ConfigKey, HeroStatus } from '../../database/dao/keyValueDao'
import NavigateToAdventureAction from '../navigation/NavigateToAdventureAction'
import AdventureAction from '../adventure/AdventureAction'
import moment from 'moment'
import NavigateToTownAction from '../navigation/NavigateToTownAction'
import { adventureFeatureDao } from '../../database/dao/featureDao'
import { randomInteger } from '../../utils/NumberUtils'

class ScanAdventureAction extends Action<any> {
    name = 'ScanAdventureAction'

    shouldRun = async (ctx: ActionContext, params: any) => {
        const count = await db.actionQueue.count()
        return count === 0 && ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async () => {
        const { getValue, setValue } = adventureFeatureDao()
        const adventureSettings = await getValue()

        const heroStatus = await keyValueDao<HeroStatus>(ConfigKey.HeroStatus, 'Unknown').getValue()
        const heroHealth = await keyValueDao<number>(ConfigKey.HeroHealth, 0).getValue()
        const adventureCount = await keyValueDao<number>(ConfigKey.AdventureCount, 0).getValue()

        if (adventureSettings.nextScan > Date.now()
            || adventureCount === 0
            || heroHealth < adventureSettings.minHeroHealth
            || heroStatus !== 'Home'
        ) {
            return true
        }

        await ActionQueueManager.begin()
            .add(NavigateToAdventureAction, {})
            .add(AdventureAction, {})
            .add(NavigateToTownAction, {})
            .done()

        await setValue({
            ...adventureSettings,
            nextScan: moment().add(randomInteger(adventureSettings.minScanInterval, adventureSettings.maxScanInterval), 'seconds').valueOf()
        })

        return true
    }
}

export default new ScanAdventureAction()