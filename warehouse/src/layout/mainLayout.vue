<template>
  <el-container class="layout-container">
    <el-aside width="200px" style="background-color: #304156;">
      <div style="background-color: #304156;height:auto;padding: 0;margin: 0; display: flex; align-items: center; justify-content: center; color: white;">
        <h4><a href="/HomePage">仓库管理系统</a></h4>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        router
        background-color="#304156"
        text-color="white"
        active-text-color="#eeeeee"
        style="border-right: none; overflow: hidden;"
      >
        <el-sub-menu index="1">
          <template #title>用户管理</template>
          <el-menu-item index="/user">用户列表</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>库存管理</template>
          <el-menu-item index="/inventory">库存列表</el-menu-item>
          <el-menu-item index="/inventory/add">新增库存</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>订单管理</template>
          <el-menu-item index="/order">订单列表</el-menu-item>
          <el-menu-item index="/order/add">新增订单</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>入库管理</template>
          <el-menu-item index="/inbound">入库列表</el-menu-item>
          <el-menu-item index="/inbound/add">新增入库</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="5">
          <template #title>出库管理</template>
          <el-menu-item index="/outbound">出库列表</el-menu-item>
          <el-menu-item index="/outbound/add">新增出库</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="6">
          <template #title>仓库管理</template>
          <el-menu-item index="/warehouse">仓库列表</el-menu-item>
          <el-menu-item index="/warehouse/add">新增仓库</el-menu-item>
        </el-sub-menu>
        <!-- 可以继续添加其他菜单项 -->
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              {{username}}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, onMounted, ref} from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const username = ref('')

onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.push('/login')
  }
  username.value = localStorage.getItem('username')
})

const activeMenu = computed(() => route.path)

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.el-header {
  background-color: #304156;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 40px;
}
.header-right {
  display: flex;
  align-items: center;
}
.user-info {
  cursor: pointer;
  color:#eee
}

.el-aside {
  width: 200px !important; /* 固定侧边栏宽度 */
  background-color: #304156;
  display: flex;
  flex-direction: column;
  border-right: none;
  overflow: hidden; /* 防止侧边栏出现滚动条 */
}

.el-aside h4 a {
  color: white;
  text-decoration: none; 
  display: inline-block; 
  padding: 0;
  margin: 0;
  font-size: inherit; 
  font-weight: inherit; 
}

.el-aside h4 a:hover {
  color: #f0f0f0; 
}

/* 侧边栏标题区域 */
.el-aside > div:first-child {
  flex-shrink: 0; /* 防止标题区域被压缩 */
  height: 60px; /* 固定标题区域高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

/* 菜单容器 */
.el-menu-vertical {
  flex: 1; /* 占据剩余空间 */
  overflow-y: auto; /* 只在垂直方向出现滚动条 */
  overflow-x: hidden; /* 防止水平方向出现滚动条 */
  border-right: none;
}

</style>

