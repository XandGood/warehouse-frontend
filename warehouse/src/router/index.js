
import { createRouter, createWebHistory } from 'vue-router'

// 路由规则
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/user/UserLogin.vue') // 登录页
  },
  {
    path: '/',
    redirect: '/login',
    component: () => import('../layout/mainLayout.vue'), // 首页（需登录访问）
    meta: { requiresAuth: true }, // 标记需要登录
    children: [
      {
        path: '/HomePage',
        name: 'HomePage',
        component: () => import('../views/HomePage.vue') // 首页
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('../views/user/UserList.vue')
      },
      {
        path: '/product',
        name: 'Product',
        component: () => import('../views/product/ProductList.vue')
      },
      {
        path: '/inventory',
        name: 'Inventory',
        component: () => import('../views/inventory/InventoryList.vue')
      },
      {
        path: '/warehouse',
        name: 'Warehouse',
        component: () => import('../views/warehouse/WarehouseList.vue')
      },
      {
        path: '/inventory_record',
        name: 'InventoryRecord',
        component: () => import('../views/inventory_record/InventoryRecordList.vue')
      },
      {
        path: '/new_inventory',
        name: 'NewInventory',
        component: () => import('../views/NewInventory.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫（验证登录状态）
router.beforeEach((to, from, next) => {
  // 如果路由需要登录，且本地无Token，跳转到登录页
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    next('/login')
  } else {
    next()
  }
})

export default router