import http from './http'

export function create(offeringId) {
  return http.post('/v1/enrollments', { offering_id: offeringId })
}

export function mine() {
  return http.get('/v1/enrollments/mine')
}

export function cancel(enrollmentId) {
  return http.delete(`/v1/enrollments/${enrollmentId}`)
}
