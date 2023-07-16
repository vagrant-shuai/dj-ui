import request from '@/utils/request'

// 查询统计单管理列表
export function listStatistics(query) {
  return request({
    url: '/system/statistics/list',
    method: 'get',
    params: query
  })
}

// 查询统计单管理详细
export function getStatistics(id) {
  return request({
    url: '/system/statistics/' + id,
    method: 'get'
  })
}

// 新增统计单管理
export function addStatistics(data) {
  return request({
    url: '/system/statistics',
    method: 'post',
    data: data
  })
}

// 修改统计单管理
export function updateStatistics(data) {
  return request({
    url: '/system/statistics',
    method: 'put',
    data: data
  })
}

// 删除统计单管理
export function delStatistics(id) {
  return request({
    url: '/system/statistics/' + id,
    method: 'delete'
  })
}
