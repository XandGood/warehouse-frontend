import request from "../utils/request";

export const getWarehouseList = () => {
  return request({
    url: "/warehouse/list",
    method: "get",
  });
}

export const addWarehouse = (data) => {
    return request({
        url: "/warehouse/add",
        method: "post",
        data
    })
}

export const deleteWarehouse = (id) => {
    return request({
        url: "/warehouse/delete",
        method: "delete",
        params: {
            id
        }
    })
}