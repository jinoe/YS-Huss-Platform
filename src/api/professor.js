import http from './http'

export function myOfferings() {
  return http.get('/v1/professor/offerings')
}

export function createOffering(payload) {
  return http.post('/v1/professor/offerings', payload)
}

export function updateOffering(offeringId, payload) {
  return http.patch(`/v1/professor/offerings/${offeringId}`, payload)
}

export function addMaterial(offeringId, payload) {
  return http.post(`/v1/professor/offerings/${offeringId}/materials`, payload)
}

export function deleteMaterial(offeringId, materialId) {
  return http.delete(`/v1/professor/offerings/${offeringId}/materials/${materialId}`)
}

export function updateWeekActivity(offeringId, weekNo, payload) {
  return http.put(`/v1/professor/offerings/${offeringId}/weeks/${weekNo}`, payload)
}

export function addNotice(offeringId, payload) {
  return http.post(`/v1/professor/offerings/${offeringId}/notices`, payload)
}

export function updateNotice(offeringId, noticeId, payload) {
  return http.patch(`/v1/professor/offerings/${offeringId}/notices/${noticeId}`, payload)
}

export function deleteNotice(offeringId, noticeId) {
  return http.delete(`/v1/professor/offerings/${offeringId}/notices/${noticeId}`)
}

export function addNoticeAttachment(offeringId, noticeId, payload) {
  return http.post(`/v1/professor/offerings/${offeringId}/notices/${noticeId}/attachments`, payload)
}

export function deleteNoticeAttachment(offeringId, noticeId, attachmentId) {
  return http.delete(`/v1/professor/offerings/${offeringId}/notices/${noticeId}/attachments/${attachmentId}`)
}

export function roster(offeringId) {
  return http.get(`/v1/professor/offerings/${offeringId}/roster`)
}

export function listSyllabi(offeringId) {
  return http.get(`/v1/professor/offerings/${offeringId}/syllabi`)
}

export function parseSyllabus(offeringId, payload) {
  return http.post(`/v1/professor/offerings/${offeringId}/syllabus/parse`, payload)
}

export function editSyllabus(syllabusId, payload) {
  return http.patch(`/v1/professor/syllabi/${syllabusId}`, payload)
}

export function publishSyllabus(syllabusId) {
  return http.post(`/v1/professor/syllabi/${syllabusId}/publish`)
}
