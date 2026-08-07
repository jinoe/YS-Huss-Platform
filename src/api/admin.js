import http from './http'

export function pendingOfferings() {
  return http.get('/v1/admin/offerings', { params: { status: 'pending' } })
}

export function activeOfferings() {
  return http.get('/v1/admin/offerings', { params: { status: 'active' } })
}

export function approveOffering(offeringId) {
  return http.post(`/v1/admin/offerings/${offeringId}/approve`)
}

export function rejectOffering(offeringId, reason) {
  return http.post(`/v1/admin/offerings/${offeringId}/reject`, { reason })
}
