import { CurrentPageEnum } from '../../types/CommonTypes'
import { Action, ActionContext } from '../../types/ActionTypes'
import keyValueDao, { ConfigKey, HeroStatus } from '../../database/dao/keyValueDao'
import { cleanParseInt } from '../../utils/NumberUtils'

class UpdateHeroInfoAction extends Action<any> {
    name = 'UpdateHeroInfoAction'

    shouldRun = async (ctx: ActionContext, params: any) => {
        return ctx.currentPage !== CurrentPageEnum.Unknown
    }

    run = async () => {
        const adventureCountStr = $('.adventure .content').text()
        const adventureCount = adventureCountStr ? parseInt(adventureCountStr) : 0

        let heroStatus: HeroStatus = 'Unknown'
        if ($('.heroStatus .heroRunning').length) {
            heroStatus = 'Running'
        } else if ($('.heroStatus .heroHome').length) {
            heroStatus = 'Home'
        }

        //@ts-ignore
        const heroHealthStr = $($('.health .title')[0]._tippy.popper).find('.tippy-content .text')[0].innerText
        const heroHealth = heroHealthStr ? cleanParseInt(heroHealthStr) : 0

        //@ts-ignore
        const heroExpAndNextLevel = $($('.experience .title')[0]._tippy.popper).find('.tippy-content .text')[0].innerText
        const [heroExp, heroNextLevel] = heroExpAndNextLevel.split('experience').map(cleanParseInt)

        await keyValueDao<number>(ConfigKey.AdventureCount, 0).setValue(adventureCount)
        await keyValueDao<HeroStatus>(ConfigKey.HeroStatus, 'Unknown').setValue(heroStatus)
        await keyValueDao<number>(ConfigKey.HeroHealth, 0).setValue(heroHealth)
        await keyValueDao<number>(ConfigKey.HeroExp, 0).setValue(heroExp)
        await keyValueDao<number>(ConfigKey.HeroLevel, 0).setValue(heroNextLevel - 1)

        return true
    }
}

export default new UpdateHeroInfoAction()