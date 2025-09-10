import request from '../utils/request';

export const getInventoryRecord = () => {
    return request({
        url: '/inventory_record/list ',
        method: 'get'
    })
}

export const addInventoryRecord = (data) => {
    return request({
        url: '/inventory_record/add',
        method: 'post',
        data
    })
}

export const deleteInventoryRecord = (id) => {
    return request({
        url: '/inventory_record/delete',
        method: 'delete',
        params: {
            id
        }
    })
}