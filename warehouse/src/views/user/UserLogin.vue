<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>仓库管理系统</h2>
      <el-form :model="loginForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive} from 'vue'
import { useRouter } from 'vue-router'
import request from '../../utils/request'

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

const router = useRouter()

// 登录方法
const handleLogin = async () => {
  try {
    // 调用后端登录接口（注意：根据你的Controller调整URL和参数格式）
    const token = await request.post('/user/login', 
      `username=${loginForm.username}&password=${loginForm.password}`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    // 登录成功，存储Token并跳转到首页
    if (token && token !== '用户名不存在' && token !== '密码错误') {
      localStorage.setItem('token', token)
      localStorage.setItem('username', loginForm.username) // 存储用户名
      router.push('/')
    } else {
      alert(token) // 提示错误信息
    }
  } catch (error) {
    console.error('登录失败', error)
  }
}
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  text-align: center; 
  background-image: url("/images/login-bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;

}
.login-card {
  width: 400px;
}
</style>