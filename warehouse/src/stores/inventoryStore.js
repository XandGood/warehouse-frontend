import { defineStore } from 'pinia'
import { ref , computed } from 'vue'
import { getInventoryByProductId, getInventoryByWarehouseId ,getInventoryList} from '../apis/inventoryApi'

export const useInventoryStore = defineStore('inventory', () => {
  const productInventory = ref([])
  const warehouseInventory = ref([])
  const inventoryList = ref([])

  const getProductInventory = async (id) => {
    const res = await getInventoryByProductId(id)
    productInventory.value = res
    return res
  } 

  const getWarehouseInventory = async (id) => {
    const res = await getInventoryByWarehouseId(id)
    warehouseInventory.value = res
    return res
  }
 
  const getInventory = async () => {
    const res = await getInventoryList()
    inventoryList.value = res
  }
    // 计算总库存
    const totalStock = computed(() => {
    return inventoryList.value.reduce((total, item) => total + item.quantity, 0)
  })
  
  

  


    return {
        totalStock,
        inventoryList,
        productInventory,
        warehouseInventory,
        getProductInventory, 
        getWarehouseInventory,
        getInventory
    }
})