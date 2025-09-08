// src/apis/user.js
import { ref } from 'vue'
import request from '../utils/request'

// 用户列表数据
export const userList = ref([])
// 当前编辑的用户数据
export const userById = ref({ username: '', name: '', role: '', phone: '', password: '' })
// 新增用户数据
export const newUser = ref({ username: '', name: '', role: '', phone: '', password: '' })
// 对话框显示状态
export const showUpdateUserDialog = ref(false)
export const showAddUserDialog = ref(false)

// 获取用户列表
export const fetchUserList = async () => {
  try {
    const data = await request.get('/user/list')
    userList.value = data
    return data
  } catch (error) {
    console.error('获取用户列表失败', error)
    throw error
  }
}

// 根据ID获取用户
export const fetchUserById = async (id) => {
  try {
    const data = await request.get(`/user/${id}`)
    userById.value = data
    return data
  } catch (error) {
    console.error('获取用户失败', error)
    throw error
  }
}

// 新增用户
export const handleAddUser = async () => {
  try {
    await request.post('/user/add', newUser.value)
    showAddUserDialog.value = false
    newUser.value = { username: '', name: '', role: '', phone: '', password: '' }
    return fetchUserList() // 重新加载列表
  } catch (error) {
    console.error('新增用户失败', error)
    throw error
  }
}

// 编辑用户
export const handleEdit = async () => {
  try {
    await request.put('/user/update', userById.value)
    showUpdateUserDialog.value = false
    userById.value = { username: '', name: '', role: '', phone: '', password: '' }
    return fetchUserList() // 重新加载列表
  } catch (error) {
    console.error('编辑失败', error)
    throw error
  }
}

// 删除用户
export const handleDelete = async (id) => {
  try {
    await request.delete(`/user/delete/${id}`)
    return fetchUserList() // 重新加载列表
  } catch (error) {
    console.error('删除失败', error)
    throw error
  }
}

// 取消用户编辑
export const cancelUserUpdate = () => {
  showUpdateUserDialog.value = false
  userById.value = { username: '', name: '', role: '', phone: '', password: '' }
}
