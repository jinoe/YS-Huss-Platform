import { studentByName } from './students.js'

export const STUDENT_POOL = ['이진호', '박서연', '최민준', '김하늘', '오세훈', '황지민', '신유진', '이도현']
export const PROFESSOR_POOL = ['전진호', '김소영', '신승한', '황동욱', '정진경']

// 수강신청 시 새 enrollments 레코드에 채워 넣을 studentId(FK)를 students.js(학생정보 테이블)에서 조회
export function studentProfile(name) {
  const student = studentByName(name)
  return student ? { studentId: student.id } : { studentId: null }
}
