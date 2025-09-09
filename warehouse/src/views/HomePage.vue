<template>
  <el-container class="dashboard-container">
    <!-- 顶部标题栏 -->
    <el-header class="dashboard-header">
      <div class="header-content">
        <h1>仓库数据仪表盘</h1>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateChange"
        />
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
              <div class="stat-label">今日入库</div>
              <div class="stat-value">{{ todayIn }}</div>
            </div>
            <div class="stat-icon">
              <el-icon><ArrowUp /></el-icon>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-label">今日出库</div>
              <div class="stat-value">{{ todayOut }}</div>
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
        <!-- 库存趋势图 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
            <div  class="chart-header">
              <span>库存趋势分析</span>
              <el-select v-model="stockPeriod" @change="updateStockChart">
                <el-option label="日" value="day"></el-option>
                <el-option label="周" value="week"></el-option>
                <el-option label="月" value="month"></el-option>
              </el-select>
            </div>
            </template>
            <div class="chart-container">
              <div ref="stockChartRef" class="chart" />
            </div>
          </el-card>
        </el-col>

        <!-- 库存分类占比 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
                <div class="chart-header">
            
            
              <span>库存分类占比</span>
              <el-select v-model="categoryType" @change="updateCategoryChart">
                <el-option label="数量" value="quantity"></el-option>
                <el-option label="价值" value="value"></el-option>
              </el-select>
            </div>
            </template>
            <div class="chart-container">
              <div ref="categoryChartRef" class="chart" />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="charts-row">
        <!-- 出入库对比 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
            <div class="chart-header">
              <span>出入库对比</span>
              <el-select v-model="inOutPeriod" @change="updateInOutChart">
                <el-option label="本周" value="week"></el-option>
                <el-option label="本月" value="month"></el-option>
                <el-option label="本季度" value="quarter"></el-option>
              </el-select>
            </div>
            </template>
            <div class="chart-container">
              <div ref="inOutChartRef" class="chart" />
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
import { useProductStore } from '../store/productStore'
import { useInventoryStore } from '../store/inventoryStore'


const productStore = useProductStore()
const inventoryStore = useInventoryStore()

// 日期范围
const dateRange = ref([])
// 图表相关参数
const stockPeriod = ref('week')
const categoryType = ref('quantity')
const inOutPeriod = ref('month')




const todayIn = ref(356)
const todayOut = ref(248)
const warningCount = ref(12)


// 图表实例
const stockChartRef = ref(null)
const categoryChartRef = ref(null)
const inOutChartRef = ref(null)
const warehouseChartRef = ref(null)

let stockChart = null
let categoryChart = null
let inOutChart = null
let warehouseChart = null

onBeforeMount(async () => {
    await inventoryStore.getInventory()
    await productStore.ProductList()
})


// 初始化图表
onMounted(async() => {
  
  initStockChart()
  initCategoryChart()
  initInOutChart()
  initWarehouseChart()
  
  
  // 监听窗口大小变化，重绘图表
  window.addEventListener('resize', handleResize)
})

// 处理窗口大小变化
const handleResize = () => {
  stockChart?.resize()
  categoryChart?.resize()
  inOutChart?.resize()
  warehouseChart?.resize()
  console.log(inventoryStore.totalStock)
}

// 初始化库存趋势图表
const initStockChart = () => {
  stockChart = echarts.init(stockChartRef.value)
  
  const option = {
    title: {
      text: '库存数量趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '库存数量',
        type: 'line',
        data: [15200, 15350, 15100, 15500, 15680, 15720, 15870],
        smooth: true,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#409eff'
        }
      }
    ]
  }
  
  stockChart.setOption(option)
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
        data: [
          { value: 4500, name: '电子设备' },
          { value: 3200, name: '办公用品' },
          { value: 2800, name: '原材料' },
          { value: 2500, name: '成品' },
          { value: 2870, name: '其他' }
        ],
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

// 初始化出入库对比图表
const initInOutChart = () => {
  inOutChart = echarts.init(inOutChartRef.value)
  
  const option = {
    title: {
      text: '出入库数量对比',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['入库', '出库'],
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '入库',
        type: 'bar',
        data: [1200, 1900, 1500, 2400, 2100, 3500],
        itemStyle: {
          color: '#67c23a'
        }
      },
      {
        name: '出库',
        type: 'bar',
        data: [1000, 1600, 1300, 2100, 1900, 3200],
        itemStyle: {
          color: '#f56c6c'
        }
      }
    ]
  }
  
  inOutChart.setOption(option)
}

// 初始化仓库使用率图表
const initWarehouseChart = () => {
  warehouseChart = echarts.init(warehouseChartRef.value)
  
  const option = {
    title: {
      text: '仓库区域使用率',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '使用率',
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
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
                { offset: 0, color: '#67c23a' },
                { offset: 1, color: '#f56c6c' }
              ]
            }
          }
        },
        axisLine: {
          lineStyle: {
            width: 40
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
          fontSize: 14
        },
        detail: {
          width: 60,
          height: 14,
          fontSize: 14,
          color: '#999',
          borderColor: '#999',
          formatter: '{value}%',
          valueAnimation: true,
          borderWidth: 1,
          borderRadius: 2,
          offsetCenter: [0, 40],
          backgroundColor: 'auto'
        },
        data: [
          { value: 78, name: 'A区' },
          { value: 65, name: 'B区' },
          { value: 92, name: 'C区' },
          { value: 45, name: 'D区' }
        ]
      }
    ]
  }
  
  warehouseChart.setOption(option)
}

// 更新图表数据
const updateStockChart = () => {
  // 根据选择的周期更新图表数据
  let xAxisData, seriesData
  
  switch(stockPeriod.value) {
    case 'day':
      xAxisData = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
      seriesData = [15600, 15620, 15580, 15700, 15750, 15800, 15850, 15870]
      break
    case 'week':
      xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      seriesData = [15200, 15350, 15100, 15500, 15680, 15720, 15870]
      break
    case 'month':
      xAxisData = ['第1周', '第2周', '第3周', '第4周']
      seriesData = [14800, 15200, 15500, 15870]
      break
  }
  
  stockChart.setOption({
    xAxis: { data: xAxisData },
    series: [{ data: seriesData }]
  })
}

const updateCategoryChart = () => {
  let seriesData
  
  if (categoryType.value === 'quantity') {
    seriesData = [
      { value: 4500, name: '电子设备' },
      { value: 3200, name: '办公用品' },
      { value: 2800, name: '原材料' },
      { value: 2500, name: '成品' },
      { value: 2870, name: '其他' }
    ]
  } else {
    seriesData = [
      { value: 45000, name: '电子设备' },
      { value: 8000, name: '办公用品' },
      { value: 15000, name: '原材料' },
      { value: 32000, name: '成品' },
      { value: 5000, name: '其他' }
    ]
  }
  
  categoryChart.setOption({
    series: [{ 
      name: categoryType.value === 'quantity' ? '库存数量' : '库存价值',
      data: seriesData 
    }]
  })
}

const updateInOutChart = () => {
  let xAxisData, inData, outData
  
  switch(inOutPeriod.value) {
    case 'week':
      xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      inData = [280, 320, 250, 380, 356, 180, 120]
      outData = [210, 260, 230, 280, 248, 150, 100]
      break
    case 'month':
      xAxisData = ['1月', '2月', '3月', '4月', '5月', '6月']
      inData = [1200, 1900, 1500, 2400, 2100, 3500]
      outData = [1000, 1600, 1300, 2100, 1900, 3200]
      break
    case 'quarter':
      xAxisData = ['Q1', 'Q2', 'Q3', 'Q4']
      inData = [4600, 8000, 7500, 9200]
      outData = [3900, 7000, 6800, 8500]
      break
  }
  
  inOutChart.setOption({
    xAxis: { data: xAxisData },
    series: [
      { data: inData },
      { data: outData }
    ]
  })
}

// 处理日期范围变化
const handleDateChange = (range) => {
  if (range) {
    console.log('日期范围变化:', range)
    // 这里可以添加根据日期范围更新数据的逻辑
  }
}

// 清理图表实例
const cleanupCharts = () => {
  window.removeEventListener('resize', handleResize)
  stockChart?.dispose()
  categoryChart?.dispose()
  inOutChart?.dispose()
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
  min-height: 100vh;
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
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header-content h1 {
  margin: 0px;
  margin-right: 10rem;
  font-size: 1.5rem;
  color: #333;
}

.dashboard-main {
  flex: 1;
  padding: 20px;
  
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