<template>
  <el-container class="dashboard-container">
    <!-- 顶部标题栏 -->
    <el-header class="dashboard-header">
      <div class="header-content">
        <h1>仓库数据仪表盘</h1>
      </div>
    </el-header>

    <!-- 主要内容区域 -->
    <el-main class="dashboard-main">
      <!-- 数据概览卡片 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-label">总库存数量</div>
              <div class="stat-value">{{ inventoryStore.totalStock }}</div>
            </div>
            <div class="stat-icon">
              <el-icon><Box /></el-icon>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-label">入库数量</div>
              <div class="stat-value">{{ inventoryRecordStore.inventoryRecordTotalIN }}</div>
            </div>
            <div class="stat-icon">
              <el-icon><ArrowUp /></el-icon>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-label">出库数量</div>
              <div class="stat-value">{{ inventoryRecordStore.inventoryRecordTotalOUT }}</div>
            </div>
            <div class="stat-icon">
              <el-icon><ArrowDown /></el-icon>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-label">库存预警</div>
              <div class="stat-value">{{ warningCount }}</div>
            </div>
            <div class="stat-icon">
              <el-icon><Warning /></el-icon>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 图表区域 -->
      <el-row :gutter="20" class="charts-row">
        <!-- 库存分类占比 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
                <div class="chart-header">
              <span>库存分类占比</span>
            </div>
            </template>
            <div class="chart-container">
              <div ref="categoryChartRef" class="chart" />
            </div>
          </el-card>
        </el-col>

        <!-- 仓库使用率 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
            <div class="chart-header">
              <span>仓库区域使用率</span>
            </div>
            </template>
            <div class="chart-container">
              <div ref="warehouseChartRef" class="chart" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted, watch ,onBeforeMount} from 'vue'
import * as echarts from 'echarts'
import { 
  Box, ArrowUp, ArrowDown, Warning, 
//   RefreshCw, Download, Filter 
} from '@element-plus/icons-vue'
import { useProductStore } from '../stores/productStore'
import { useInventoryStore } from '../stores/inventoryStore'
import { useInventoryRecordStore } from '../stores/inventory_recordStore'
import { useWarehouseStore } from '../stores/warehouseStore'


const productStore = useProductStore()
const inventoryStore = useInventoryStore()
const inventoryRecordStore = useInventoryRecordStore()
const warehouseStore = useWarehouseStore()



const warningCount = ref(0)
const categoryData = ref([])


//根据productList和InventoryList计算库存预警数量
const warningCounting = (productList, inventoryList) => {
  let count = 0
  for (let product of productList) {
    const inventory = inventoryList.find(i => i.product_id === product.id)
    if (inventory && inventory.quantity < product.warning_stock) {
      count++
    }
  }
  return count
}

//根据productlist和InventoryList中id和product_id之间的联系，得到每个category的总库存数量
const getCategoryChart = (productList, InventoryList) => {
  const categoryData = {}
  for (let product of productList) {
    const inventory = InventoryList.find(i => i.product_id === product.id)
    if (inventory) {
      if (!categoryData[product.category]) {
        categoryData[product.category] = 0
      }
      categoryData[product.category] += inventory.quantity
    }
  }
  return Object.entries(categoryData).map(([name, value]) => ({ name, value }))
}

// 根据warehouseList和InventoryList中id和warehouse_id之间的联系，得到每个仓库的总库存数量,返回一个数组，每个元素是一个数字
const getWarehouseCount = (warehouseList, InventoryList) => {
  const warehouseCount = {}
  for (let warehouse of warehouseList) {
    const inventory = InventoryList.filter(i => i.warehouse_id === warehouse.id)
    if (inventory) {
      if (!warehouseCount[warehouse.id]) {
        warehouseCount[warehouse.id] = 0
      }
      for (let i of inventory) {
        warehouseCount[warehouse.id] += i.quantity
      }
    }
  }
  return Object.entries(warehouseCount).map(([id, value]) => ({ id, value }))
}      


const warehouseData = ref([])

// 图表实例
const categoryChartRef = ref(null)
const warehouseChartRef = ref(null)


let categoryChart = null
let warehouseChart = null



onBeforeMount(async () => {
    await inventoryStore.getInventory()
    await productStore.ProductList()
    await inventoryRecordStore.getInventoryRecordList()
    await warehouseStore.getWarehouse()
    const ProductList = productStore.productList
    const InventoryList = inventoryStore.inventoryList
    const warehouseList = warehouseStore.warehouseList
    warningCount.value = await warningCounting(ProductList, InventoryList)
    categoryData.value = await getCategoryChart(ProductList, InventoryList)
    warehouseData.value = await getWarehouseCount(warehouseList, InventoryList)
    initCategoryChart()
    initWarehouseChart()
})




// 初始化图表
onMounted(async() => {
  // 监听窗口大小变化，重绘图表
  window.addEventListener('resize', handleResize)
})

// 处理窗口大小变化
const handleResize = () => {
  categoryChart?.resize()
  warehouseChart?.resize()
}


// 初始化库存分类图表
const initCategoryChart = () => {
  categoryChart = echarts.init(categoryChartRef.value)
  
  const option = {
    title: {
      text: '库存分类占比',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '库存数量',
        type: 'pie',
        radius: '70%',
        data: categoryData.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  categoryChart.setOption(option)
}

// 初始化仓库使用率图表
const initWarehouseChart = () => {
  warehouseChart = echarts.init(warehouseChartRef.value)
  
const option = {
  title: {
    text: '仓库区域使用率',
    left: 'center',
    top: 20,
    textStyle: {
      fontSize: 18,
      fontWeight: 'normal'
    },
    subtext: '实时监控各仓库空间利用情况',
    subtextStyle: {
      fontSize: 12,
      color: '#666'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#ddd',
    borderWidth: 1,
    textStyle: {
      color: '#333'
    },
    padding: 10,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
  },
  legend: {
    data: ['主仓库', '备用仓库'],
    bottom: 20,
    left: 'center',
    textStyle: {
      color: '#666'
    }
  },
  series: [
    {
      name: '使用率',
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      center: ['30%', '50%'],
      radius: '60%',
      min: 0,
      max: 500,
      pointer: {
        show: false
      },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 1, color: '#67c23a' },
              { offset: 0.4, color: '#e6a23c' },
              { offset: 0, color: '#f56c6c' }
            ]
          }
        }
      },
      axisLine: {
        lineStyle: {
          width: 20,
          color: [
            [0.6, '#f0f0f0'],
            [0.8, '#f0f0f0'],
            [1, '#f0f0f0']
          ]
        }
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      title: {
        show: true,
        offsetCenter: [0, '-10%'],
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333'
      },
      detail: {
        width: 80,
        height: 20,
        fontSize: 16,
        color: '#333',
        borderColor: 'auto',
        formatter: '{value}/500',
        valueAnimation: true,
        borderWidth: 0,
        borderRadius: 4,
        offsetCenter: [0, '40%'],
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
      },
      data: [
        { 
          value: warehouseData.value[0].value, 
          name: '主仓库',
          itemStyle: {
            color: '#409eff'
          }
        }
      ],
      animationDuration: 2000,
      animationEasing: 'cubicOut'
    },
    {
      name: '使用率',
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      center: ['70%', '50%'],
      radius: '60%',
      min: 0,
      max: 200,
      pointer: {
        show: false
      },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 1, color: '#67c23a' },
              { offset: 0.4, color: '#e6a23c' },
              { offset: 0, color: '#f56c6c' }
            ]
          }
        }
      },
      axisLine: {
        lineStyle: {
          width: 20,
          color: [
            [0.6, '#f0f0f0'],
            [0.8, '#f0f0f0'],
            [1, '#f0f0f0']
          ]
        }
      },
      // 隐藏刻度线
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      // 隐藏刻度标签
      axisLabel: {
        show: false
      },
      title: {
        show: true,
        offsetCenter: [0, '-10%'],
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333'
      },
      detail: {
        width: 80,
        height: 20,
        fontSize: 16,
        color: '#333',
        borderColor: 'auto',
        formatter: '{value}/200',
        valueAnimation: true,
        borderWidth: 0,
        borderRadius: 4,
        offsetCenter: [0, '40%'],
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
      },
      data: [
        { 
          value: warehouseData.value[1].value, 
          name: '备用仓库',
          itemStyle: {
            color: '#67c23a'
          }
        }
      ],
      animationDuration: 2000,
      animationEasing: 'cubicOut',
      animationDelay: 500
    }
  ]
};


  
  warehouseChart.setOption(option)
}

// 清理图表实例
const cleanupCharts = () => {
  window.removeEventListener('resize', handleResize)
  categoryChart?.dispose()
  warehouseChart?.dispose()
}

// 组件卸载时清理
watch(null, () => {
  cleanupCharts()
}, { immediate: false })
</script>

<style scoped>
.dashboard-container {
  height: auto;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.header-content h1 {
  margin: 0px;
  font-size: 2rem;
  color: #333;
}

.dashboard-main {
  flex: 1;
  padding: 15px;
  
  background-color: #f5f7fa;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
  overflow: hidden;
}

.stat-content {
  padding: 15px;
}

.stat-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-trend {
  font-size: 12px;
}

.stat-trend.up {
  color: #67c23a;
}

.stat-trend.down {
  color: #f56c6c;
}

.stat-trend.danger {
  color: #e6a23c;
}

.stat-trend.safe {
  color: #67c23a;
}

.stat-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  color: #409eff;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 100%;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  width: 100%;
  height: 350px;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>