import { Table } from "dexie"
import { v4 } from "uuid"
import { UseItemResult } from "./useItem"
import { UseItemListResult } from "./useItemList"

const useDbCrud = <T>(
    table: Table,
    { getListItem, removeListItem }: UseItemListResult<T>,
    { item, resetItem }: UseItemResult<T>
) => {
    const saveNewItem = async () => {
        if (!item) {
            return
        }

        await table.add({
            ...item,
            id: v4()
        })

        resetItem()
    }

    const putItem = async (id: string) => {
        const item = getListItem(id)
        if (!item) {
            return
        }
        await table.put(item)
        removeListItem(id)
    }

    const deleteItem = async (id: string) => {
        await table.delete(id)
        removeListItem(id)
    }

    return {
        saveNewItem,
        putItem,
        deleteItem
    }
}

export default useDbCrud