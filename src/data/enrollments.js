// 수강신청 테이블(임시 DB) — students.js(studentId)와 courses.js(courseId)를 참조하는 순수 조인 테이블.
// 인적사항·강좌정보는 여기 두지 않고 조회 시 students.js/courses.js를 조인해서 채운다(src/data/queries.js).
import students from './students.js'
import courses from './courses.js'

// KPI 대시보드 등에서 연도·학기를 선택할 수 있는 전체 학기 목록. 2026-2가 현재 진행 중(수강신청 오픈)인 학기.
export const SEMESTERS = ['2025-1', '2025-2', '2026-1', '2026-2']

// 학기별 수강신청 기간 첫째 날(5일간 진행). 관리자 대시보드의 "수강신청 내역" 날짜별 조회/CSV 다운로드가
// 이 5일 창을 기준으로 동작한다 — 컨소시엄 참여 대학마다 수강신청 API를 직접 연동하기 어려워, 매일 그날 신청
// 내역을 관리자가 CSV로 내려받아 타 대학에 수동으로 전달하는 운영 방식을 반영한 것.
export const REGISTRATION_PERIOD_START = {
  '2025-1': '2025-02-24',
  '2025-2': '2025-08-25',
  '2026-1': '2026-02-23',
  '2026-2': '2026-08-25'
}
export const REGISTRATION_PERIOD_DAYS = 5

function registrationDateFor(semester, seed) {
  const start = REGISTRATION_PERIOD_START[semester]
  if (!start) return ''
  const offset = Math.floor(pseudoRandom(seed) * REGISTRATION_PERIOD_DAYS)
  const d = new Date(`${start}T00:00:00`)
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

// 특정 과목의 로스터/CSV 데모 스토리(컨소시엄 5개교 공동수강, 담당교수 로스터 등)를 위해 손으로 심어둔 행
const CURATED = [
  // Sustainable Development for Future (courseId 4, 연세대, 김소영 교수) — 컨소시엄 5개교 학생이 함께 수강하는 공유 교과목 데모
  { id: 1, studentId: 1, courseId: 4, semester: '2026-2', status: '수강' }, // 이진호
  { id: 2, studentId: 2, courseId: 4, semester: '2026-2', status: '수강' }, // 박서연
  { id: 3, studentId: 21, courseId: 4, semester: '2026-2', status: '수강' }, // 최민준
  { id: 4, studentId: 41, courseId: 4, semester: '2026-2', status: '수강' }, // 김하늘
  { id: 5, studentId: 81, courseId: 4, semester: '2026-2', status: '수강' }, // 오세훈
  { id: 6, studentId: 61, courseId: 4, semester: '2026-2', status: '수강' }, // 황지민
  { id: 7, studentId: 21, courseId: 4, semester: '2026-1', status: '수료' }, // 최민준
  { id: 8, studentId: 41, courseId: 4, semester: '2026-1', status: '수료' }, // 김하늘

  // AI시대의 인간과 사회 (courseId 19, 동의대, 김소영 교수)
  { id: 9, studentId: 21, courseId: 19, semester: '2026-2', status: '수강' }, // 최민준
  { id: 10, studentId: 41, courseId: 19, semester: '2026-2', status: '수강' }, // 김하늘
  { id: 11, studentId: 82, courseId: 19, semester: '2026-2', status: '수강' }, // 신유진

  // 미래 윤리: 기술, 생명, AI의 규범 (courseId 25, 이화여대, 김소영 교수)
  { id: 12, studentId: 2, courseId: 25, semester: '2026-2', status: '수강' }, // 박서연
  { id: 13, studentId: 61, courseId: 25, semester: '2026-2', status: '수강' }, // 황지민
  { id: 14, studentId: 42, courseId: 25, semester: '2026-2', status: '수강' }, // 이도현

  // Culture and Storytelling (courseId 1, 연세대, 전진호 교수) — 지난 학기 수료자
  { id: 15, studentId: 81, courseId: 1, semester: '2026-1', status: '수료' }, // 오세훈
  { id: 16, studentId: 82, courseId: 1, semester: '2026-1', status: '수료' }, // 신유진

  // 동시대 문학과 영상 분석 (courseId 12, 국립공주대, 전진호 교수) — 지난 학기 수료자
  { id: 17, studentId: 42, courseId: 12, semester: '2026-1', status: '수료' } // 이도현
]

function pseudoRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

// 위 CURATED 스토리 외에 100명 × 4개 학기 전체를 대학별 개설과목으로 채워서
// 실제 서비스처럼 신뢰도 있는 규모의 수강신청 데이터를 만든다(학교당 학기당 수십 건 이상).
const enrollments = [...CURATED]
const seen = new Set(enrollments.map((e) => `${e.studentId}-${e.courseId}-${e.semester}`))
let nextId = Math.max(...enrollments.map((e) => e.id)) + 1

for (const semester of SEMESTERS) {
  const semIndex = SEMESTERS.indexOf(semester)
  const isCurrent = semester === '2026-2'
  for (const student of students) {
    const uniCourses = courses.filter((c) => c.university === student.university)
    if (!uniCourses.length) continue
    const count = Math.min(uniCourses.length, 2 + Math.floor(pseudoRandom(student.id * 31 + semIndex * 97) * 3))
    const start = Math.floor(pseudoRandom(student.id * 17 + semIndex * 53) * uniCourses.length)
    for (let k = 0; k < count; k++) {
      const course = uniCourses[(start + k) % uniCourses.length]
      const key = `${student.id}-${course.id}-${semester}`
      if (seen.has(key)) continue
      seen.add(key)
      enrollments.push({
        id: nextId++,
        studentId: student.id,
        courseId: course.id,
        semester,
        status: isCurrent ? '수강' : '수료'
      })
    }
  }
}

// CURATED 손시딩 항목엔 registeredAt이 없으므로, 모든 행에 학기별 5일 수강신청 기간 내 날짜를 결정적으로 부여
enrollments.forEach((e) => {
  if (!e.registeredAt) e.registeredAt = registrationDateFor(e.semester, e.studentId * 13 + e.courseId * 7)
})

export default enrollments
