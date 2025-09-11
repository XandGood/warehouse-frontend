<template>
  <el-container style="height: 100vh">
    <el-header class="views-header">
            <div class="header-container">
                <div class="header-title">
                    <h3>产品列表</h3>
                </div>
            </div>
        </el-header>
      <el-main>
        <!-- 产品列表（默认显示） -->
        <div v-if="activeComponent === 'productList'">
          <el-button type="primary" @click="showAddProductDialog = true">新增产品</el-button>
          <el-table :data="productStore.productList"  style="margin-top: 10px;">
            <el-table-column prop="name" label="产品类型"></el-table-column>
            <el-table-column prop="code" label="编号"></el-table-column>
            <el-table-column prop="category" label="分类"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="text" @click="handleEdit(scope.row.id)">编辑</el-button>
                <el-button type="text" @click="productStore.ProductDelete(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 新增产品对话框-->
        <el-dialog title="新增产品" v-model="showAddProductDialog" width="30%">
          <el-form  :model="productStore.newProduct" label-width="80px">
            <el-form-item label="产品类型">
              <el-input v-model="productStore.newProduct.name"></el-input>
            </el-form-item>
            <el-form-item label="编号">
              <el-input v-model="productStore.newProduct.code"></el-input>
            </el-form-item>
            <el-form-item label="分类">
              <el-input v-model="productStore.newProduct.category"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="productStore.newProduct.specification"></el-input>
            </el-form-item>
            <el-form-item label="单位">
              <el-input v-model="productStore.newProduct.unit"></el-input>
            </el-form-item>
            <el-form-item label="预警数量">
              <el-input v-model="productStore.newProduct.warning_stock" type="number"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="resetNewProduct()">取消</el-button>
            <el-button type="primary" @click="productStore.ProductCreate(productStore.newProduct),showAddProductDialog = false">保存</el-button>
          </template>
        </el-dialog>

        <!-- 编辑产品对话框 -->
        <el-dialog title="修改产品" v-model="showUpdateProductDialog" width="30%">
          <el-form :data="currentProduct" label-width="80px">
            <el-form-item label="产品类型">
              <el-input v-model="currentProduct.name"></el-input>
            </el-form-item>
            <el-form-item label="编号">
              <el-input v-model="currentProduct.code"></el-input>
            </el-form-item>
            <el-form-item label="分类">
              <el-input v-model="currentProduct.category"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="currentProduct.specification"></el-input>
            </el-form-item>
            <el-form-item label="单位">
              <el-input v-model="currentProduct.unit"></el-input>
            </el-form-item>
            <el-form-item label="预警数量">
              <el-input v-model="currentProduct.warning_stock" type="number"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="showUpdateProductDialog = false">取消</el-button>
            <el-button type="primary" @click="productStore.ProductUpdate(currentProduct),showUpdateProductDialog = false">保存</el-button>
          </template>
        </el-dialog>
      </el-main>
    </el-container>
</template>

<script setup>
import { ref ,onBeforeMount} from 'vue';
import { useProductStore } from '../../stores/productStore';

const activeComponent = ref('productList');

const productStore = useProductStore();
const showAddProductDialog = ref(false);
const showUpdateProductDialog = ref(false);
const currentProduct = ref();

onBeforeMount(() => {
  productStore.ProductList();
})

const handleEdit = async (id) => {
  currentProduct.value = await productStore.ProductDetail(id);
  showUpdateProductDialog.value = true;
  console.log(currentProduct.value);
};

const resetNewProduct = () => {
    currentProduct.value = {}
    showAddProductDialog.value = false
}

</script>