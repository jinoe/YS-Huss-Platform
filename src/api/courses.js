import http from './http'

export function list(params) {
  return http.get('/v1/courses', { params })
}

export function detail(offeringId) {
  return http.get(`/v1/courses/${offeringId}`)
}

export function launch(offeringId) {
  return http.get(`/v1/courses/${offeringId}/launch`)
}
