import request from '@/utils/request'

// 查询发货单管理列表
export function listOrder(query) {
  return request({
    url: '/system/order/list',
    method: 'get',
    params: query
  })
}

// 查询发货单管理详细
export function getOrder(id) {
  return request({
    url: '/system/order/' + id,
    method: 'get'
  })
}

// 新增发货单管理
export function addOrder(data) {
  return request({
    url: '/system/order',
    method: 'post',
    data: data
  })
}

// 修改发货单管理
export function updateOrder(data) {
  return request({
    url: '/system/order',
    method: 'put',
    data: data
  })
}

// 删除发货单管理
export function delOrder(id) {
  return request({
    url: '/system/order/' + id,
    method: 'delete'
  })
}
