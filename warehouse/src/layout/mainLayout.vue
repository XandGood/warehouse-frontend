<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        router
        background-color="#304156"
        text-color="white"
        active-text-color="#eeeeee"
      >
        <el-sub-menu index="1">
          <template #title>用户管理</template>
          <el-menu-item index="/home">用户列表</el-menu-item>
        </el-sub-menu>
        <!-- 可以继续添加其他菜单项 -->
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>仓库管理系统</div>
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
  background-color: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
}
.header-right {
  display: flex;
  align-items: center;
}
.user-info {
  cursor: pointer;
}
</style>

