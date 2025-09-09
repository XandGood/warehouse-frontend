import request from '../utils/request'


export const fetchProductList = async () => {
  try {
    const data = await request.get('/product/list')
    return data
  } catch (error) {
    console.error('获取产品列表失败', error)
    throw error
  }
}

export const fetchProductDetail = async (id) => {
  try {
    const data = await request.get(`/product/${id}`)
    return data
  } catch (error) {
    console.error('获取产品详情失败', error)
    throw error
  }
}

export const fetchProductUpdate = async (productData) => {
  try {
    await request.put(`/product/update`,productData)
  } catch (error) {
    console.error('更新产品失败', error)
    throw error
  }
}

export const fetchProductDelete = async (id) => {
  try {
    await request.delete(`/product/delete/${id}`)
  } catch (error) {
    console.error('删除产品失败', error)
    throw error
  }
}

export const fetchProductCreate = async (productData) => {
  try {
    await request.post('/product/add', productData)
  } catch (error) {
    console.error('创建产品失败', error)
    throw error
  }
}