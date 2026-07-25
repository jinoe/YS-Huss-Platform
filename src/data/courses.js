const courses = [
  { id: 1, university: 'yonsei', group: 'Futures Narrative Studio', name: 'Culture and Storytelling', type: '공통교과', credit: 3, method: 'D', professor: '전진호', semester: '2026-2', registrationOpen: true, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 2, university: 'yonsei', group: 'Futures Narrative Studio', name: 'AI Motion and Visual Narratives', type: '공통교과', credit: 3, method: 'D-V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 3, university: 'yonsei', group: 'Futures Narrative Studio', name: '사변적사고와 프로세스', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 4, university: 'yonsei', group: 'Future Problem Framing', name: 'Sustainable Development for Future', type: '공통교과', credit: 3, method: 'I', professor: '김소영', semester: '2026-2', registrationOpen: true, capacity: 25, syllabus: { uploaded: false, fileName: '' } },
  { id: 5, university: 'yonsei', group: 'Future Problem Framing', name: '데이터기반 통합디자인리서치', type: '공통교과', credit: 3, method: 'I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 6, university: 'yonsei', group: 'Future Problem Framing', name: '스페큘레이티브 디자인', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 7, university: 'yonsei', group: 'Experience & Service Design', name: 'Future Experience Design', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 8, university: 'yonsei', group: 'Experience & Service Design', name: 'User Experience Research Methods', type: '공통교과', credit: 3, method: 'I-V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 9, university: 'yonsei', group: 'Experience & Service Design', name: 'Idea Visualization', type: '공통교과', credit: 3, method: 'V', professor: '신승한', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 10, university: 'yonsei', group: 'AI Prototyping Lab', name: '인공지능기반디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },

  { id: 11, university: 'gongju', group: 'Futures Narrative Studio', name: '디자인픽션 프로젝트', type: '공통교과', credit: 3, method: 'D', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 12, university: 'gongju', group: 'Futures Narrative Studio', name: '동시대 문학과 영상 분석', type: '공통교과', credit: 3, method: 'D-I', professor: '전진호', semester: '2026-2', registrationOpen: true, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 13, university: 'gongju', group: 'Future Problem Framing', name: '데이터 기반 여론분석과 미래 예측', type: '공통교과', credit: 3, method: 'I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 14, university: 'gongju', group: 'Future Problem Framing', name: '알고리즘 권력', type: '공통교과', credit: 3, method: 'I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 15, university: 'gongju', group: 'Experience & Service Design', name: '사용자경험디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 16, university: 'gongju', group: 'AI Prototyping Lab', name: '생성형AI를 활용한 디지털콘텐츠디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 17, university: 'gongju', group: 'AI Prototyping Lab', name: '인터랙티브영상 콘텐츠', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },

  { id: 18, university: 'dongeui', group: 'Futures Narrative Studio', name: '이야기로 미래읽기', type: '공통교과', credit: 3, method: 'D-I', professor: '황동욱', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 19, university: 'dongeui', group: 'Future Problem Framing', name: 'AI시대의 인간과 사회', type: '공통교과', credit: 3, method: 'I', professor: '김소영', semester: '2026-2', registrationOpen: true, capacity: 20, syllabus: { uploaded: false, fileName: '' } },
  { id: 20, university: 'dongeui', group: 'Future Problem Framing', name: 'Futures Literacy Lab', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 21, university: 'dongeui', group: 'AI Prototyping Lab', name: 'AI미래시뮬레이션', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 22, university: 'dongeui', group: 'AI Prototyping Lab', name: '지능형정보검색과 실습', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 23, university: 'dongeui', group: 'Ethics by Design', name: '메타리터러시와 디지털시민성', type: '공통교과', credit: 3, method: 'I-E', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },

  { id: 24, university: 'ewha', group: 'Futures Narrative Studio', name: '미래를 상상하는 인간', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 25, university: 'ewha', group: 'Future Problem Framing', name: '미래 윤리: 기술, 생명, AI의 규범', type: '공통교과', credit: 3, method: 'I', professor: '김소영', semester: '2026-2', registrationOpen: true, capacity: 30, syllabus: { uploaded: true, fileName: '미래윤리_강의계획서.pdf' } },
  { id: 26, university: 'ewha', group: 'Ethics by Design', name: '포용적 미래 설계 캡스톤', type: '공통교과', credit: 3, method: 'I-E', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 27, university: 'ewha', group: 'Ethics by Design', name: '통합적 분쟁이해와 조정', type: '공통교과', credit: 3, method: 'I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 28, university: 'ewha', group: 'Ethics by Design', name: '여성과 사회정의', type: '공통교과', credit: 3, method: 'I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },

  { id: 29, university: 'handong', group: 'Futures Narrative Studio', name: 'AX 내러티브 모션 그래픽스 1', type: '공통교과', credit: 3, method: 'D-V', professor: '정진경', semester: '2026-2', registrationOpen: true, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 30, university: 'handong', group: 'Future Problem Framing', name: 'Design Thinking', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 31, university: 'handong', group: 'Future Problem Framing', name: 'Design for Future Product 1', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 32, university: 'handong', group: 'Experience & Service Design', name: 'AX 라이프 디자인 스튜디오 1', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 33, university: 'handong', group: 'Experience & Service Design', name: 'Future Life UX Design', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 34, university: 'handong', group: 'AI Prototyping Lab', name: 'AX Native Design', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 35, university: 'handong', group: 'AI Prototyping Lab', name: '스마트 인터페이스 디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } },
  { id: 36, university: 'handong', group: 'AI Prototyping Lab', name: '그래픽 디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중', semester: '2026-2', registrationOpen: false, capacity: 30, syllabus: { uploaded: false, fileName: '' } }
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

export default courses
