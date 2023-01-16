import moment from "moment"
import keyValueDao, { ConfigKey } from "../database/dao/keyValueDao"
import { db } from "../database/db"
import { IncomingAttack, IncomingAttackUnit, NotificationChannelType, NotificationTarget } from "../types/DatabaseTypes"

class Notification {

    getMessaageHeader = async () => {
        const playerName = await keyValueDao<string>(ConfigKey.PlayerName, '').getValue()
        return `[${playerName} (${window.location.host}) @ ${moment().format()}]`
    }

    doSendTelegram = async (target: NotificationTarget, content: string) => {
        const header = await this.getMessaageHeader()
        await fetch(`https://api.telegram.org/bot${target.telegramToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "chat_id": target.telegramChatId,
                "text": `<b>${header}</b>\n${content}`,
                "parse_mode": "HTML"
            })
        })
    }

    doSendDiscord = async (target: NotificationTarget, content: string) => {
        const header = await this.getMessaageHeader()
        await fetch(`https://discord.com/api/webhooks/${target.discordWebhookId}/${target.discordWebhookToken}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: `${header}\n${content}` })
        })
    }

    doSend = async (target: NotificationTarget, content: string) => {
        switch (target.channelType) {
            case NotificationChannelType.Telegram: {
                await this.doSendTelegram(target, content)
                break
            }
            case NotificationChannelType.Discord: {
                await this.doSendDiscord(target, content)
                break
            }
        }
    }

    notifyPlusAttack = async (villageName: string) => {
        const targets = (await db.notificationTarget.toArray()).filter(e => e.alertAttack)
        for (const target of targets) {
            await this.doSend(target, `A wild plus attack alert appears at village ${villageName}!`)
        }
    }

    notificationRallyPointAttack = async (villageName: string, attack: IncomingAttack, units: IncomingAttackUnit[]) => {
        const targets = (await db.notificationTarget.toArray()).filter(e => e.alertAttack)
        for (const target of targets) {
            await this.doSend(target,
                `
Village ${villageName} is under attack, landing at ${moment(attack.arrivalLocalTime).format()}.
Attack type: ${attack.type}
Attacker: ${attack.attackerName} (${attack.attackerCoordX}|${attack.attackerCoordY})
Units: 
${units.map(u => `- ${u.unitName}: ${u.unitCount}`).join('\n')}
            `)
        }
    }
}

export default new Notification()