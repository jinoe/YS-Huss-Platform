export default {
  role: 'student', // 'student' | 'professor' — 인증 백엔드가 없어 데모용으로 상단바 토글로 전환
  studentName: '이진호', // 랜덤 변경 버튼으로 STUDENT_POOL 내에서 전환
  professorName: '김소영', // 랜덤 변경 버튼으로 PROFESSOR_POOL 내에서 전환
  isAuthenticated: false // 로그인 여부 — 실제 인증 백엔드 없이 로그인 페이지 통과 시 true로만 전환하는 임시 플래그
}
