import axios from 'axios'

// 创建Axios实例
const request = axios.create({
  baseURL: '/api', // 后端接口地址（根据你的实际端口修改）
  timeout: 5000
})

// 请求拦截器（添加Token）
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}` // 按后端要求的格式携带Token
  }
  return config
})

// 响应拦截器（处理错误）
request.interceptors.response.use(
  response => response.data, // 直接返回接口数据
  error => {
    if (error.response?.status === 401) {
      // Token无效/过期，清除本地存储并跳转到登录页
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request