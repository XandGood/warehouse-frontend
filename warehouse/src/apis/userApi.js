// src/apis/user.js
import request from '../utils/request.js'

/**
 * 获取用户列表
 * @returns {Promise<Array>} 用户列表数组
 */
export const fetchUserList = async () => {
  try {
    const data  = await request.get('/user/list')
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('获取用户列表失败', error)
    // 抛出标准化错误信息
    throw new Error(error.response?.data?.message || '网络请求异常')
  }
}

/**
 * 根据ID获取用户详情
 * @param {string|number} id - 用户ID
 * @returns {Promise<Object>} 用户详情对象
 */
export const fetchUserById = async (id) => {
  if (!id) {
    throw new Error('用户ID不能为空')
  }

  try {
    const  data  = await request.get(`/user/${id}`)
    return data || {}
  } catch (error) {
    console.error(`获取ID为${id}的用户失败`, error)
    throw new Error(error.response?.data?.message || '获取用户详情失败')
  }
}

/**
 * 新增用户
 * @param {Object} userData - 用户信息对象
 * @returns {Promise<void>}
 */
export const handleAddUser = async (userData) => {
  if (!userData || typeof userData !== 'object') {
    throw new Error('用户数据格式不正确')
  }

  try {
    await request.post('/user/add', userData)
  } catch (error) {
    console.error('新增用户失败', error)
    throw new Error(error.response?.data?.message || '新增用户失败')
  }
}

/**
 * 编辑用户
 * @param {Object} userData - 包含ID的用户信息对象
 * @returns {Promise<void>}
 */
export const handleEdit = async (userData) => {
  if (!userData?.id) {
    throw new Error('用户ID不能为空')
  }

  try {
    await request.put('/user/update', userData)
  } catch (error) {
    console.error(`编辑ID为${userData.id}的用户失败`, error)
    throw new Error(error.response?.data?.message || '编辑用户失败')
  }
}

/**
 * 删除用户
 * @param {string|number} id - 用户ID
 * @returns {Promise<void>}
 */
export const handleDelete = async (id) => {
  if (!id) {
    throw new Error('用户ID不能为空')
  }

  try {
    await request.delete(`/user/delete/${id}`)
  } catch (error) {
    console.error(`删除ID为${id}的用户失败`, error)
    throw new Error(error.response?.data?.message || '删除用户失败')
  }
}