import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getWarehouseList,addWarehouse,deleteWarehouse} from '../apis/warehouseApi'

export const useWarehouseStore = defineStore('warehouse', () => {
    const warehouseList = ref([])

    const getWarehouse = async () => {
        warehouseList.value = await getWarehouseList()
    }

    const addWarehouseItem = async (warehouse) => {
        await addWarehouse(warehouse)
        getWarehouse()
    }

    const deleteWarehouseItem = async (id) => {
        await deleteWarehouse(id)
        getWarehouse()
    }

    return {
        warehouseList,
        getWarehouse,
        addWarehouseItem,
        deleteWarehouseItem
    }
})