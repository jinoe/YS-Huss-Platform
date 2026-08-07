const session = {
  role: 'student', // 'student' | 'professor' — /auth/me의 profile_type으로 채움. isProfessor 분기(자료 업로드 등)에 계속 씀
  roles: [], // /auth/me의 roles 배열 원본(예: ['professor','program_admin']) — tier 판정에 씀
  studentName: '이진호', // 로그인 성공 시 /auth/me의 name으로 덮어씀(profile_type==='student')
  professorName: '김소영', // 위와 동일(profile_type==='professor')
  staffName: '', // 위와 동일(profile_type==='staff' — 운영진/시스템관리자 계정)
  isAuthenticated: false, // 로그인 여부 — PortalLoginView가 실제 /auth/login 성공 시에만 true로 전환
  // 실제 백엔드 로그인 성공 시 채워짐. 있으면 http.js가 Authorization 헤더에 자동으로 실음.
  accessToken: null,
  refreshToken: null
}

export default session

// 로그아웃/토큰 만료 시 공용 정리. 데모 계정을 같은 브라우저에서 돌아가며
// 쓰는 시나리오(랩미팅)에서, localStorage에 토큰이 남아있으면 다음 사람이
// 브라우저를 다시 열었을 때 이전 사람 세션으로 자동 로그인되는 문제가 있었다
// — 로그아웃 버튼이 session.isAuthenticated만 끄고 토큰은 안 지웠기 때문.
export function clearSession() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  session.accessToken = null
  session.refreshToken = null
  session.isAuthenticated = false
  session.roles = []
}

// 5단계 tier: student / professor(일반교수) / core-professor(핵심교수) /
// staff(운영진) / system-admin(관리자). 백엔드 role 조합으로 판정한다 —
// 별도 Role enum 값을 새로 만들지 않고 PROFESSOR+PROGRAM_ADMIN 조합으로
// "핵심교수"를 표현하는 백엔드 설계(app/seeds/demo.py의 admin@yonsei.ac.kr 참고)를 그대로 따른다.
export function getTier(s = session) {
  const roles = s.roles || []
  if (roles.includes('super_admin')) return 'system-admin'
  const isAdminRole = roles.includes('program_admin') || roles.includes('university_admin')
  const isProfessorRole = roles.includes('professor')
  if (isAdminRole && isProfessorRole) return 'core-professor'
  if (isAdminRole) return 'staff'
  if (isProfessorRole) return 'professor'
  return 'student'
}

// 상단바(PortalLayout) 표시용 이름. 내부적으로는 5단계 tier를 쓰지만, 화면에는
// "핵심교수"/"운영진" 같은 내부 용어를 노출하지 않고 학생/교수/관리자
// 3가지로만 보여준다(2026-08-06 요청). 학생은 "OOO 학생님"이 어색하다는
// 피드백으로 역할 표기 없이 "OOO님"만 표시(교수/관리자는 역할 표기 유지).
export function getDisplayName(s = session) {
  const tier = getTier(s)
  if (tier === 'student') return s.studentName
  if (tier === 'professor' || tier === 'core-professor') return `${s.professorName} 교수`
  return `${s.staffName} 관리자`
}

// 마이페이지 배너용 이름 — 여기는 학생도 역할을 붙여서 보여달라는 별도 요청(2026-08-06)이
// 있어 getDisplayName과 분리한다. 학생은 "OOO 학생님"이 어색하다는 후속 피드백으로
// "OOO 학생"(님 없이)으로 표시하고, 교수/관리자는 "OOO 교수님"/"OOO 관리자님" 유지.
export function getDisplayNameWithRole(s = session) {
  const tier = getTier(s)
  if (tier === 'student') return `${s.studentName} 학생`
  if (tier === 'professor' || tier === 'core-professor') return `${s.professorName} 교수님`
  return `${s.staffName} 관리자님`
}
