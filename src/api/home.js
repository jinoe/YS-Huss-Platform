import http from './http'

export function getNotices(params) {
  return http.get('/notices', { params })
}

export function getBanners() {
  return http.get('/banners')
}
