<template>
  <el-container style="height: 100vh;">
    <el-header class="views-header">
            <div class="header-container">
                <div class="header-title">
                    <h3>仓库列表</h3>
                </div>
            </div>
        </el-header>
    <el-main>
      <!-- 仓库列表（默认显示） -->
      <div>
        <el-button type="primary" @click="showAddWarehouseDialog = true">新增仓库</el-button>
        <el-table :data="warehouseStore.warehouseList" style="margin-top: 10px;">
          <el-table-column prop="name" label="仓库名称"></el-table-column>
          <el-table-column prop="location" label="仓库位置"></el-table-column>
          <el-table-column prop="manager" label="负责人"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="text" @click="warehouseStore.deleteWarehouseItem(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

        <!-- 新增仓库对话框-->
        <el-dialog title="新增仓库" v-model="showAddWarehouseDialog" width="30%">
          <el-form :model="warehouseStore.newWarehouse" label-width="80px">
            <el-form-item label="仓库名称">
              <el-input v-model="warehouseStore.newWarehouse.name"></el-input>
            </el-form-item>
            <el-form-item label="仓库位置">
              <el-input v-model="warehouseStore.newWarehouse.location"></el-input>
            </el-form-item>
            <el-form-item label="负责人">
              <el-input v-model="warehouseStore.newWarehouse.manager"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="showAddWarehouseDialog = false">取消</el-button>
            <el-button type="primary" @click="warehouseStore.addWarehouseItem(warehouseStore.newWarehouse),showAddWarehouseDialog = false">保存</el-button>
          </template>
        </el-dialog>
    </el-main>
    </el-container>
</template>
<script setup>
import { useWarehouseStore } from '../../stores/warehouseStore'
import { onBeforeMount , ref} from 'vue'

const showAddWarehouseDialog = ref(false);
const warehouseStore = useWarehouseStore();

onBeforeMount(async () => {
    await warehouseStore.getWarehouse()
})
</script>