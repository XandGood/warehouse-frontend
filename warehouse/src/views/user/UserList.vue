<template>
  <el-container style="height: 100vh;">
    <el-header class="views-header">
            <div class="header-container">
                <div class="header-title">
                    <h3>用户列表</h3>
                </div>
            </div>
        </el-header>
    <el-container>
      <el-main>
        <!-- 用户列表（默认显示） -->
        <div v-if="activeComponent === 'userList'">
          <el-button type="primary" @click="showAddUserDialog = true">新增用户</el-button>
          <el-table :data="userStore.userList"  style="margin-top: 10px;">
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="role" label="角色">
                <template #default="scope">
                  {{ scope.row.role === 'ADMIN' ? '管理员' : '普通用户' }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="text" @click="handleEdit(scope.row.id)">编辑</el-button>
                <el-button type="text" @click="userStore.deleteUser(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 新增用户对话框-->
        <el-dialog title="新增用户" v-model="showAddUserDialog" width="30%">
          <el-form  :model="userStore.newUser" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="userStore.newUser.username"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="userStore.newUser.name"></el-input>
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="userStore.newUser.role" placeholder="请选择角色">
                <el-option label="管理员" value="ADMIN"></el-option>
                <el-option label="普通用户" value="OPERATOR"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话号码">
              <el-input v-model="userStore.newUser.phone"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input type="password" v-model="userStore.newUser.password"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="showAddUserDialog = false,userStore.resetNewUser()">取消</el-button>
            <el-button type="primary" @click="userStore.addUser(userStore.newUser),showAddUserDialog = false">保存</el-button>
          </template>
        </el-dialog>

        <!-- 编辑用户对话框 -->
        <el-dialog title="修改用户" v-model="showUpdateUserDialog" width="30%">
          <el-form :data="userStore.currentUser" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="userStore.currentUser.username"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="userStore.currentUser.name"></el-input>
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="userStore.currentUser.role">
                <el-option label="管理员" value="ADMIN"></el-option>
                <el-option label="普通用户" value="OPERATOR"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话号码">
              <el-input v-model="userStore.currentUser.phone"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="userStore.currentUser.password"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="userStore.cancelUserUpdate()">取消</el-button>
            <el-button type="primary" @click="userStore.updateUser(userStore.currentUser),showUpdateUserDialog = false">保存</el-button>
          </template>
        </el-dialog>

      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useUserStore } from '../../stores/userStore';


const showAddUserDialog = ref(false)
const showUpdateUserDialog = ref(false)

const userStore = useUserStore()
const activeComponent = ref('userList')

const handleEdit = async (id) => {
  await userStore.loadUserById(id) // 等待接口返回
  showUpdateUserDialog.value = true
  
}

// 页面加载时获取用户列表
onBeforeMount(() => {
  userStore.loadUserList()
})



</script>

<style scoped>
.el-header {
  padding: 0 20px;
}
</style>