const courses = [
  { id: 1, university: 'yonsei', group: 'Futures Narrative Studio', name: 'Culture and Storytelling', type: '공통교과', credit: 3, method: 'D', professor: '전진호', semester: '2026-2', registrationOpen: true, capacity: 30 },
  { id: 2, university: 'yonsei', group: 'Futures Narrative Studio', name: 'AI Motion and Visual Narratives', type: '공통교과', credit: 3, method: 'D-V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 3, university: 'yonsei', group: 'Futures Narrative Studio', name: '사변적사고와 프로세스', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 4, university: 'yonsei', group: 'Future Problem Framing', name: 'Sustainable Development for Future', type: '공통교과', credit: 3, method: 'I', professor: '김소영', semester: '2026-2', registrationOpen: true, capacity: 25 },
  { id: 5, university: 'yonsei', group: 'Future Problem Framing', name: '데이터기반 통합디자인리서치', type: '공통교과', credit: 3, method: 'I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 6, university: 'yonsei', group: 'Future Problem Framing', name: '스페큘레이티브 디자인', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 7, university: 'yonsei', group: 'Experience & Service Design', name: 'Future Experience Design', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 8, university: 'yonsei', group: 'Experience & Service Design', name: 'User Experience Research Methods', type: '공통교과', credit: 3, method: 'I-V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 9, university: 'yonsei', group: 'Experience & Service Design', name: 'Idea Visualization', type: '공통교과', credit: 3, method: 'V', professor: '신승한', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 10, university: 'yonsei', group: 'AI Prototyping Lab', name: '인공지능기반디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },

  { id: 11, university: 'gongju', group: 'Futures Narrative Studio', name: '디자인픽션 프로젝트', type: '공통교과', credit: 3, method: 'D', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 12, university: 'gongju', group: 'Futures Narrative Studio', name: '동시대 문학과 영상 분석', type: '공통교과', credit: 3, method: 'D-I', professor: '전진호', semester: '2026-2', registrationOpen: true, capacity: 30 },
  { id: 13, university: 'gongju', group: 'Future Problem Framing', name: '데이터 기반 여론분석과 미래 예측', type: '공통교과', credit: 3, method: 'I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 14, university: 'gongju', group: 'Future Problem Framing', name: '알고리즘 권력', type: '공통교과', credit: 3, method: 'I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 15, university: 'gongju', group: 'Experience & Service Design', name: '사용자경험디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 16, university: 'gongju', group: 'AI Prototyping Lab', name: '생성형AI를 활용한 디지털콘텐츠디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 17, university: 'gongju', group: 'AI Prototyping Lab', name: '인터랙티브영상 콘텐츠', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },

  { id: 18, university: 'dongeui', group: 'Futures Narrative Studio', name: '이야기로 미래읽기', type: '공통교과', credit: 3, method: 'D-I', professor: '황동욱', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 19, university: 'dongeui', group: 'Future Problem Framing', name: 'AI시대의 인간과 사회', type: '공통교과', credit: 3, method: 'I', professor: '김소영', semester: '2026-2', registrationOpen: true, capacity: 20 },
  { id: 20, university: 'dongeui', group: 'Future Problem Framing', name: 'Futures Literacy Lab', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 21, university: 'dongeui', group: 'AI Prototyping Lab', name: 'AI미래시뮬레이션', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 22, university: 'dongeui', group: 'AI Prototyping Lab', name: '지능형정보검색과 실습', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 23, university: 'dongeui', group: 'Ethics by Design', name: '메타리터러시와 디지털시민성', type: '공통교과', credit: 3, method: 'I-E', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },

  { id: 24, university: 'ewha', group: 'Futures Narrative Studio', name: '미래를 상상하는 인간', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 25, university: 'ewha', group: 'Future Problem Framing', name: '미래 윤리: 기술, 생명, AI의 규범', type: '공통교과', credit: 3, method: 'I', professor: '김소영', semester: '2026-2', registrationOpen: true, capacity: 30 },
  { id: 26, university: 'ewha', group: 'Ethics by Design', name: '포용적 미래 설계 캡스톤', type: '공통교과', credit: 3, method: 'I-E', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 27, university: 'ewha', group: 'Ethics by Design', name: '통합적 분쟁이해와 조정', type: '공통교과', credit: 3, method: 'I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 28, university: 'ewha', group: 'Ethics by Design', name: '여성과 사회정의', type: '공통교과', credit: 3, method: 'I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },

  { id: 29, university: 'handong', group: 'Futures Narrative Studio', name: 'AX 내러티브 모션 그래픽스 1', type: '공통교과', credit: 3, method: 'D-V', professor: '정진경', semester: '2026-2', registrationOpen: true, capacity: 30 },
  { id: 30, university: 'handong', group: 'Future Problem Framing', name: 'Design Thinking', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 31, university: 'handong', group: 'Future Problem Framing', name: 'Design for Future Product 1', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 32, university: 'handong', group: 'Experience & Service Design', name: 'AX 라이프 디자인 스튜디오 1', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 33, university: 'handong', group: 'Experience & Service Design', name: 'Future Life UX Design', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 34, university: 'handong', group: 'AI Prototyping Lab', name: 'AX Native Design', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 35, university: 'handong', group: 'AI Prototyping Lab', name: '스마트 인터페이스 디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 },
  { id: 36, university: 'handong', group: 'AI Prototyping Lab', name: '그래픽 디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30 }
]

// 정규학기 16주차 구성 + 과목공지 게시판을 모든 과목에 기본 부여(빈 상태) — 강의실 페이지의 주차별 학습활동/과목공지 탭에서 사용
courses.forEach((c) => {
  c.weeks = Array.from({ length: 16 }, (_, i) => ({ week: i + 1, materials: [] }))
  c.notices = []
})

// 데모용으로 실제 진행 중인 것처럼 보이도록 일부 과목만 시드 데이터 채움(김소영 교수 담당 과목 중심)
const seedWeeks = (courseId, entries) => {
  const course = courses.find((c) => c.id === courseId)
  if (!course) return
  for (const [week, materials] of entries) {
    course.weeks[week - 1].materials = materials
  }
}

const seedNotices = (courseId, notices) => {
  const course = courses.find((c) => c.id === courseId)
  if (!course) return
  course.notices = notices
}

seedWeeks(4, [
  [1, ['1주차_OT_강의개요.pdf']],
  [2, ['2주차_참고자료.pdf', '2주차_강의노트.pdf']],
  [3, ['3주차_사례연구.pdf']]
])
seedNotices(4, [
  { id: 1, title: '1주차 오리엔테이션 안내', content: '첫 수업은 온라인으로 진행됩니다. 강의실 링크는 개강 전 별도 공지합니다.', date: '2026-08-25' },
  { id: 2, title: '1차 과제 제출 기한 안내', content: '1차 과제는 9월 15일 23:59까지 제출 바랍니다.', date: '2026-09-01' }
])

seedWeeks(19, [[1, ['1주차_강의자료.pdf']]])
seedNotices(19, [{ id: 1, title: '개강 안내', content: '2026-2학기 개강일은 9월 1일입니다.', date: '2026-08-20' }])

seedWeeks(25, [
  [1, ['1주차_강의계획서_요약.pdf']],
  [2, ['2주차_읽기자료.pdf']]
])

// 수강신청 화면(RegistrationView, 연세포털 수강신청 화면 참고)에서 쓰는 컬럼들.
// 실제 필드(name/group/professor)에서 논리적으로 유도 가능한 값은 유도하고, 나머지는 id 기반 결정적 패턴으로 채운다.
const GROUP_CODE = {
  'Futures Narrative Studio': 'FNS',
  'Future Problem Framing': 'FPF',
  'Experience & Service Design': 'ESD',
  'AI Prototyping Lab': 'APL',
  'Ethics by Design': 'EBD'
}

const BUILDINGS = {
  yonsei: ['백양관', '삼성학술정보관'],
  gongju: ['산학협력관', '자연과학관'],
  dongeui: ['창학관', '인당관'],
  ewha: ['포스코관', '이화·삼성교육문화관'],
  handong: ['벤처관', 'ITC']
}

const DAYS = ['월', '화', '수', '목', '금']
const CANCELLED_IDS = new Set([9, 30]) // 폐강 데모용으로 지정한 2개 과목

function isEnglishTitle(name) {
  const ascii = (name.match(/[A-Za-z]/g) || []).length
  const hangul = (name.match(/[가-힣]/g) || []).length
  return ascii > hangul
}

courses.forEach((c) => {
  const groupCode = GROUP_CODE[c.group] || 'GEN'
  const buildings = BUILDINGS[c.university] || BUILDINGS.yonsei
  const day = DAYS[c.id % DAYS.length]
  const startPeriod = 1 + (c.id % 7)
  const english = isEnglishTitle(c.name)
  const cancelled = CANCELLED_IDS.has(c.id)

  c.courseCode = `${groupCode}${1000 + c.id}`
  c.section = '01'
  c.grade = 0
  c.sessionType = '학기'
  c.cancelled = cancelled
  c.lectureTime = `${day}${startPeriod},${startPeriod + 1},${startPeriod + 2}`
  c.room = `${buildings[c.id % buildings.length]} ${100 * (1 + (c.id % 4)) + (c.id % 9) * 10}호`
  c.language = english ? '영어' : '한국어'
  c.deliveryMode = '대면강의'
  c.evaluationMethod = '상대평가'
  c.exchangeAllowed = english ? 'Y' : 'N'
  c.note = cancelled ? '폐강되었습니다. 차학기 재개설 예정입니다.' : ''

  if (cancelled) c.registrationOpen = false
})

// 강의계획서(SyllabusView, docs/강의 계획서 예시.pdf 양식 참고) 데이터. 기본은 전부 빈 값(아직 작성 전) —
// 담당교수가 SyllabusView에서 직접 입력하면 이 객체가 채워진다. course.language(수업 언어)는 위에서 이미
// 파생시켰으므로 여기서 중복으로 두지 않고 템플릿에서 course.language를 그대로 참조한다.
function blankSyllabus() {
  return {
    registeredAt: '',
    updatedAt: '',
    examSchedule: { midterm: '', final: '' },
    professorContact: { phone: '', email: '', office: '', officeHours: '' },
    ta: { name: '', phone: '' },
    overview: '',
    methodRatio: { lecture: '', practice: '', presentation: '', discussion: '', teamProject: '' },
    evalRatio: { midterm: '', final: '', quiz: '', individual: '', team: '', attendance: '', etc: '' },
    assignments: [],
    prerequisite: '',
    onlineSite: '',
    textbooks: [],
    notes: '',
    weeklyPlan: Array.from({ length: 16 }, (_, i) => ({ week: i + 1, period: '', content: '', remark: '' }))
  }
}

courses.forEach((c) => {
  c.syllabus = blankSyllabus()
})

// 데모용으로 하나만 완성된 강의계획서를 시드(미래 윤리: 기술, 생명, AI의 규범, 김소영 교수)
const demoSyllabus = courses.find((c) => c.id === 25).syllabus
demoSyllabus.registeredAt = '2026-07-10 14:00:21'
demoSyllabus.updatedAt = '2026-07-15 09:32:10'
demoSyllabus.examSchedule = { midterm: '10월 중간고사 기간', final: '12월 기말고사 기간' }
demoSyllabus.professorContact = { phone: '02-3277-1234', email: 'sykim@ewha.ac.kr', office: '포스코관 305호', officeHours: '수요일 15:00-17:00 (사전예약)' }
demoSyllabus.ta = { name: '', phone: '' }
demoSyllabus.overview =
  '본 과목은 인공지능·생명공학 등 미래 기술이 제기하는 윤리적 쟁점을 사례 중심으로 다룬다. 자율주행, 생성형 AI, 유전자 편집 등 실제 이슈를 통해 규범적 판단 기준을 세우고, 팀 토론과 프로젝트를 통해 실무에 적용 가능한 윤리 의사결정 역량을 기른다.'
demoSyllabus.methodRatio = { lecture: 40, practice: 10, presentation: 20, discussion: 30, teamProject: 0 }
demoSyllabus.evalRatio = { midterm: 30, final: 30, quiz: 0, individual: 20, team: 0, attendance: 10, etc: 10 }
demoSyllabus.assignments = [
  { title: '윤리 딜레마 케이스 분석', dueDate: '2026-10-15', type: '개별 리포트 / LMS 제출' },
  { title: '기말 팀 프로젝트 발표', dueDate: '2026-12-10', type: '팀 발표자료 / 온라인 제출' }
]
demoSyllabus.prerequisite = '없음'
demoSyllabus.onlineSite = 'LearnUs'
demoSyllabus.textbooks = [
  { type: '주교재', title: '미래 윤리와 인공지능', author: '김소영 외', publisher: '이화여자대학교출판문화원', year: '2025', isbn: '979-11-1234-567-8' }
]
demoSyllabus.notes = '토론 중심 수업으로 매주 사전 읽기자료를 반드시 확인해야 합니다.'
demoSyllabus.weeklyPlan[0] = { week: 1, period: '2026-09-01 ~ 2026-09-07', content: '오리엔테이션 및 미래 윤리 개관', remark: '개강' }
demoSyllabus.weeklyPlan[1] = { week: 2, period: '2026-09-08 ~ 2026-09-14', content: '자율주행과 트롤리 딜레마', remark: '' }
demoSyllabus.weeklyPlan[2] = { week: 3, period: '2026-09-15 ~ 2026-09-21', content: '생성형 AI와 저작권/책임 소재', remark: '' }
demoSyllabus.weeklyPlan[7] = { week: 8, period: '2026-10-20 ~ 2026-10-26', content: '중간고사', remark: '중간시험' }
demoSyllabus.weeklyPlan[15] = { week: 16, period: '2026-12-15 ~ 2026-12-21', content: '기말고사', remark: '기말시험' }

export default courses
