import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchProductList ,fetchProductDetail, fetchProductUpdate, fetchProductDelete, fetchProductCreate } from '../apis/productApi'


export const useProductStore = defineStore('product', () => {
    const productList = ref([])
    const currentProduct = ref({})

    const ProductList = async () => {
        const res = await fetchProductList()
        productList.value = res.data
    }

    const ProductDetail = async (id) => {
        const res = await fetchProductDetail(id)
        currentProduct.value = res.data
    }

    const ProductUpdate = async (id, data) => {
        await fetchProductUpdate(id, data)
        fetchProductList()
    }

    const ProductDelete = async (id) => {
        await fetchProductDelete(id)
        fetchProductList()
    }

    const ProductCreate = async (data) => {
        await fetchProductCreate(data)
        fetchProductCreate()
    }
    return {
        productList,
        currentProduct,
        ProductList,
        ProductDetail,
        ProductUpdate,
        ProductDelete,
        ProductCreate
    }
})