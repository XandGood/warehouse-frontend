import request from '../utils/request'

export const getInventoryByProductId = (id) => {
    try{
        return request.get(`/inventory/ProductId/${id}`)
    }catch(error){
        console.error('获取产品列表失败', error)
        throw error
    }
}

export const getInventoryByWarehouseId = (id) => {
    try{
        return request.get(`/inventory/WarehouseId/${id}`)
    }catch(error){
        console.error('获取产品列表失败', error)
        throw error
    }
}

export const getInventoryList = () => {
    try{
        const data = request.get(`/inventory/list`)
        return data
    }catch(error){
        console.error('获取产品列表失败', error)
        throw error
    }

}