// src/store/userStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  fetchUserList, 
  fetchUserById, 
  handleAddUser, 
  handleEdit, 
  handleDelete 
} from '../apis/userApi'


export const useUserStore = defineStore('user', () => {
  // 核心状态
  const userList = ref([])
  const newUser = ref({ username: '', password: '', name: '', role: '',phone: ''}) // 新增用户表单
  const currentUser = ref({}) // 当前编辑的用户
  const isLoading = ref(false)  // 加载状态
  const error = ref(null)       // 错误信息

  // 重置错误状态
  const resetError = () => {
    error.value = null
  }

  // 获取用户列表
  async function loadUserList() {
    resetError()
    isLoading.value = true
    try {
      userList.value = await fetchUserList()
    } catch (err) {
      error.value = '获取用户列表失败：' + (err.message || '未知错误')
      console.error('加载用户列表失败', err)
    } finally {
      isLoading.value = false
    }
  }

  // 根据ID获取用户
  async function loadUserById(id) {
    if (!id) {
      error.value = '用户ID不能为空'
      return
    }
    
    resetError()
    isLoading.value = true
    try {
      currentUser.value = await fetchUserById(id)
      
    } catch (err) {
      error.value = '获取用户详情失败：' + (err.message || '未知错误')
      console.error(`加载ID为${id}的用户失败`, err)
    } finally {
      isLoading.value = false
    }
  }

  // 新增用户
  async function addUser(userData) {
    if (!userData) {
      error.value = '用户数据不能为空'
      return false
    }
    resetError()
    isLoading.value = true
    try {
      await handleAddUser(userData)
      await loadUserList() // 新增后刷新列表
      newUser.value = { username: '', password: '', name: '', role: '', phone: '' }
      return true // 操作成功返回true
    } catch (err) {
      error.value = '新增用户失败：' + (err.message || '未知错误')
      console.error('新增用户失败', err)
      return false // 操作失败返回false
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户
  async function updateUser(userData) {
    if (!userData?.id) {
      error.value = '用户ID不能为空'
      return false
    }
    
    resetError()
    isLoading.value = true
    try {
      
      await handleEdit(userData)
      await loadUserList() // 更新后刷新列表
      return true
    } catch (err) {
      error.value = '更新用户失败：' + (err.message || '未知错误')
      console.error(`更新ID为${userData.id}的用户失败`, err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 删除用户
  async function deleteUser(id) {
    if (!id) {
      error.value = '用户ID不能为空'
      return false
    }
    
    resetError()
    isLoading.value = true
    try {
      await handleDelete(id)
      await loadUserList() // 删除后刷新列表
      return true
    } catch (err) {
      error.value = '删除用户失败：' + (err.message || '未知错误')
      console.error(`删除ID为${id}的用户失败`, err)
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  const resetNewUser = () => {
    newUser.value = { username: '', password: '', name: '', role: '', phone: '' }
  }
  const cancelUserUpdate = ()=>{
    currentUser.value = { username: '', password: '', name: '', role: '', phone: '' }
  }



  return {
    newUser,
    userList,
    currentUser,
    isLoading,
    error,
    resetNewUser,
    loadUserList,
    loadUserById,
    addUser,
    updateUser,
    deleteUser,
    resetError,
    cancelUserUpdate,
  }
})