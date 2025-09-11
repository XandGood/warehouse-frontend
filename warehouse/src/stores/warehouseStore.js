import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getWarehouseList,addWarehouse,deleteWarehouse} from '../apis/warehouseApi'

export const useWarehouseStore = defineStore('warehouse', () => {
    const warehouseList = ref([])
    const newWarehouse = ref({ name: '', location: '', manager: ''})

    const getWarehouse = async () => {
        const data = await getWarehouseList()
        warehouseList.value = data
        console.log(data)
    }

    const addWarehouseItem = async (warehouse) => {
        await addWarehouse(warehouse)
        getWarehouse()
        newWarehouse.value = { name: '', location: '', manager: ''}
    }

    const deleteWarehouseItem = async (id) => {
        await deleteWarehouse(id)
        getWarehouse()
    }

    return {
        warehouseList,
        newWarehouse,
        getWarehouse,
        addWarehouseItem,
        deleteWarehouseItem
    }
})