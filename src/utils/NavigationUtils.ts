export const toField = () => {
    $(`.village.resourceView`)[0].click()
}

export const toTown = () => {
    $(`.village.buildingView`)[0].click()
}

export const toVillage = (villageId: string) => {
    $(`.listEntry[data-did=${villageId}] > a`)[0].click()
}