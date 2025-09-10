import { defineStore } from 'pinia'
import { ref  ,computed} from 'vue'
import { getInventoryRecord,addInventoryRecord,deleteInventoryRecord } from '../apis/inventory_recordApi'

export const useInventoryRecordStore = defineStore('inventoryRecord', () => {
    const inventoryRecordList = ref([])
    const inventoryRecord = ref({})
    const inventoryRecordLoading = ref(false)
    
    const getInventoryRecordList = async () => {
        inventoryRecordLoading.value = true
        const response = await getInventoryRecord()
        inventoryRecordList.value = response
    }

    const addInventoryRecordItem = async (inventoryRecord) => {
        await addInventoryRecord(inventoryRecord)
        await getInventoryRecordList()
    }
    const deleteInventoryRecordItem = async (id) => {
        await deleteInventoryRecord(id)
        await getInventoryRecordList()
    }
    
    //计算所有type为in的元素quantity的总和
    const inventoryRecordTotalIN = computed(() => {
        return inventoryRecordList.value
            .filter(record => record.type === 'IN')
            .reduce((total, record) => total + record.quantity, 0);
    })

    const inventoryRecordTotalOUT = computed(() => {
        return inventoryRecordList.value
            .filter(record => record.type === 'OUT')
            .reduce((total, record) => total + record.quantity, 0);
    })
    return {
        inventoryRecordList,
        inventoryRecord,
        inventoryRecordLoading,
        inventoryRecordTotalIN,
        inventoryRecordTotalOUT,
        getInventoryRecordList,
        addInventoryRecordItem,
        deleteInventoryRecordItem
    }
})   
