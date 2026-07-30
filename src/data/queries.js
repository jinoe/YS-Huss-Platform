// students.js(학생정보) + courses.js(강좌정보) + enrollments.js(수강신청)를 조인해서 쓰는 조회 헬퍼 모음.
// 각 데이터 파일은 순수 테이블만 들고 있고, 여러 테이블을 엮는 로직은 전부 여기 둔다.
import students, { studentById, studentByName, universityLabel } from './students.js'
import courses from './courses.js'
import enrollments from './enrollments.js'

export function courseById(id) {
  return courses.find((c) => c.id === id)
}

// 수강신청 한 행에 학생 인적사항 + 강좌정보를 조인한 뷰. KPI 대시보드/로스터/CSV가 전부 이걸 기반으로 함
export function joinedEnrollments(list = enrollments) {
  return list.map((e) => {
    const student = studentById(e.studentId)
    const course = courseById(e.courseId)
    return {
      id: e.id,
      semester: e.semester,
      status: e.status,
      registeredAt: e.registeredAt || '',
      studentId: e.studentId,
      courseId: e.courseId,
      studentName: student?.name || '',
      studentNumber: student?.studentNumber || '',
      university: student?.university || '',
      universityLabel: universityLabel(student?.university),
      department: student?.department || '',
      email: student?.email || '',
      phone: student?.phone || '',
      courseName: course?.name || '',
      courseProfessor: course?.professor || '',
      courseCredit: course?.credit || '',
      courseMethod: course?.method || ''
    }
  })
}

export function enrollmentsForStudentName(name, { status } = {}) {
  const student = studentByName(name)
  if (!student) return []
  return enrollments.filter((e) => e.studentId === student.id && (!status || e.status === status))
}

export function enrollmentsForCourse(courseId) {
  return enrollments.filter((e) => e.courseId === courseId)
}

export function isStudentEnrolledByName(name, courseId, semester) {
  const student = studentByName(name)
  if (!student) return false
  return enrollments.some((e) => e.studentId === student.id && e.courseId === courseId && e.semester === semester)
}

export { students, courses, enrollments, studentById, studentByName, universityLabel }
