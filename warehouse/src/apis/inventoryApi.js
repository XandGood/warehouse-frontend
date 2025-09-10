import request from '../utils/request'

export const getInventoryByProductId = (id) => {
    return request({
        url: `/inventory/ProductId/${id}`,
        method: 'get'
    })
}

export const getInventoryByWarehouseId = (id) => {
    return request({
        url: `/inventory/WarehouseId/${id}`,
        method: 'get'
    })
}

export const getInventoryList = () => {
    return request({
        url: '/inventory/list',
        method: 'get'
    })

}