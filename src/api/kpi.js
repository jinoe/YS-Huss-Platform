import http from './http'

export function indicators() {
  return http.get('/v1/kpi/indicators')
}

export function snapshots(params) {
  return http.get('/v1/kpi/snapshots', { params })
}
