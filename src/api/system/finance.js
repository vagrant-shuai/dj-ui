import request from '@/utils/request'

// 查询财务单管理列表
export function listFinance(query) {
  return request({
    url: '/system/finance/list',
    method: 'get',
    params: query
  })
}

// 查询财务单管理详细
export function getFinance(id) {
  return request({
    url: '/system/finance/' + id,
    method: 'get'
  })
}

// 新增财务单管理
export function addFinance(data) {
  return request({
    url: '/system/finance',
    method: 'post',
    data: data
  })
}

// 修改财务单管理
export function updateFinance(data) {
  return request({
    url: '/system/finance',
    method: 'put',
    data: data
  })
}

// 删除财务单管理
export function delFinance(id) {
  return request({
    url: '/system/finance/' + id,
    method: 'delete'
  })
}
