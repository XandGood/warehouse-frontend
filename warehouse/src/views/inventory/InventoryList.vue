<template>
    <el-container style="height: 100vh;">
        <el-header class="views-header">
            <div class="header-container">
                <div class="header-title">
                    <h3>库存管理</h3>
                </div>
            </div>
        </el-header>
        <el-main>
        <!-- 库存列表（默认显示） -->
        <div v-if="activeComponent === 'inventoryList'">
          <el-table :data="getInventoryListWithDetails()"  style="margin-top: 10px;">
            <el-table-column prop="productName" label="产品类型"></el-table-column>
            <el-table-column prop="warehouseName" label="仓库"></el-table-column>
            <el-table-column prop="quantity" label="库存数量"></el-table-column>
          </el-table>
        </div>
        </el-main>
    </el-container>
</template>
    
<script setup>
import { useProductStore } from '../../stores/productStore'
import { useWarehouseStore } from '../../stores/warehouseStore'
import { useInventoryStore } from '../../stores/inventoryStore'
import { onBeforeMount} from 'vue'


const productStore = useProductStore()
const warehouseStore = useWarehouseStore()
const inventoryStore = useInventoryStore()
const activeComponent = 'inventoryList'


onBeforeMount(async () => {
    await inventoryStore.getInventory()
    await productStore.ProductList()
    await warehouseStore.getWarehouse()

})

const getInventoryListWithDetails = () => {
  return inventoryStore.inventoryList.map(inventory => {
    const product = productStore.productList.find(p => p.id === inventory.product_id)
    const warehouse = warehouseStore.warehouseList.find(w => w.id === inventory.warehouse_id)
    return {
      ...inventory,
      productName: product?.name || '未知产品',
      warehouseName: warehouse?.name || '未知仓库'
    }
  })
}




</script>

