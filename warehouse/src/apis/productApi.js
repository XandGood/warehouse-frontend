import request from '../utils/request'


export const fetchProductList = () => {
  return request({
    url: '/product/list',
    method: 'get'
  })
}

export const fetchProductDetail =  (id) => {
  return request({
    url: `/product/${id}`,
    method: 'get',
  })
}

export const fetchProductUpdate =  (productData) => {
  return request({
    url: `/product/update`,
    method: 'put',
    data: productData
  })
}

export const fetchProductDelete =  (id) => {
  return request({
    url: `/product/delete/${id}`,
    method: 'delete',
  })
}

export const fetchProductCreate =  (productData) => {
  return request({
    url: '/product/create',
    method: 'post',
    data: productData
  })
}