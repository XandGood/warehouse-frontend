// src/store/userStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchUserList, fetchUserById, handleAddUser, handleEdit, handleDelete,cancelUserUpdate } from '../apis/user'

export const useUserStore = defineStore('user', () => {
  const userList = ref([])
  const currentUser = ref({})
  
  async function loadUserList() {
    userList.value = await fetchUserList()
  }
  
  async function loadUserById(id) {
    currentUser.value = await fetchUserById(id)
  }
  
  async function addUser(userData) {
    await handleAddUser(userData)
    await loadUserList()
  }
  
  async function updateUser(userData) {
    await handleEdit(userData)
    await loadUserList()
  }
  
  async function deleteUser(id) {
    await handleDelete(id)
    await loadUserList()
  }
  async function cancelUserUpdate() {
    currentUser.value = {}
  }
  
  return {
    userList,
    currentUser,
    loadUserList,
    loadUserById,
    addUser,
    updateUser,
    deleteUser,
    cancelUserUpdate
  }
})
