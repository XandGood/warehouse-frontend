<template>
    <el-container style="height: 100vh;">
        <el-header class="views-header">
            <div class="header-container">
                <div class="header-title">
                    <h3>库存记录列表</h3>
                </div>
            </div>
        </el-header>
      <el-main>
        <div>
            <el-table :data="getInventoryRecordListWithDetails()"  style="margin-top: 10px;">
                <el-table-column prop="record_no" label="记录编号"></el-table-column>
                <el-table-column prop="productName" label="产品类型"></el-table-column>
                <el-table-column prop="warehouseName" label="仓库"></el-table-column>
                <el-table-column prop="type" label="变更类型"></el-table-column>
                <el-table-column prop="quantity" label="变更数量">
                    <template #default="scope">
                       {{ Math.abs(scope.row.quantity) }}
                    </template>
                </el-table-column>
                <el-table-column prop="operate_time" label="变更时间"></el-table-column>
                <el-table-column prop="operator" label="操作员"></el-table-column>
            </el-table>
        </div>
      </el-main>
    </el-container>
</template>
<script setup>
import { useProductStore } from '../../stores/productStore'
import { useWarehouseStore } from '../../stores/warehouseStore'
import { useInventoryRecordStore } from '../../stores/inventory_recordStore'
import { useUserStore } from '../../stores/userStore'
import { onBeforeMount} from 'vue'
const productStore = useProductStore()
const warehouseStore = useWarehouseStore()
const inventoryRecordStore = useInventoryRecordStore()
const userStore = useUserStore()
onBeforeMount(async () => {
    await inventoryRecordStore.getInventoryRecordList()
    await productStore.ProductList()
    await warehouseStore.getWarehouse()
    await userStore.loadUserList()
})


const getInventoryRecordListWithDetails = () => {
  return inventoryRecordStore.inventoryRecordList.map(inventoryRecord => {
    const product = productStore.productList.find(p => p.id === inventoryRecord.product_id)
    const warehouse = warehouseStore.warehouseList.find(w => w.id === inventoryRecord.warehouse_id)
    const user = userStore.userList.find(u => u.id === inventoryRecord.operator_id)
    return {
      ...inventoryRecord,
      productName: product?.name || '未知产品',
      warehouseName: warehouse?.name || '未知仓库',
      operator: user?.username || '未知用户'
    }
  })
}
</script>