import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchProductList ,fetchProductDetail, fetchProductUpdate, fetchProductDelete, fetchProductCreate } from '../apis/productApi'


export const useProductStore = defineStore('product', () => {
    const productList = ref([])
    const currentProduct = ref({})
    const newProduct = ref({})

    const ProductList = async () => {
        const res = await fetchProductList()
        productList.value = res
        return res
    }

    const ProductDetail = async (id) => {
        const res = await fetchProductDetail(id)
        return res
    }

    const ProductUpdate = async (data) => {
        await fetchProductUpdate(data)
        fetchProductList()
        
    }

    const ProductDelete = async (id) => {
        await fetchProductDelete(id)
        fetchProductList()
    }

    const ProductCreate = async (data) => {
        await fetchProductCreate(data)
        fetchProductCreate()
        newProduct.value = {}
    }

    return {
        productList,
        currentProduct,
        newProduct,
        ProductList,
        ProductDetail,
        ProductUpdate,
        ProductDelete,
        ProductCreate
    }
})