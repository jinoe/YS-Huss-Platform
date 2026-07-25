// 학생정보 테이블(임시 DB) — 컨소시엄 5개교 × 20명 = 100명.
// enrollments.js(수강신청 테이블)가 이 테이블의 id(PK)를 studentId(FK)로 참조해서 조인함(src/data/queries.js).
// id(PK, 숫자)와 studentNumber(학번, 문자열)는 별개다 — FK는 항상 id를 가리킴.
const SURNAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍']
const GIVEN_NAMES = ['민준', '서준', '도윤', '예준', '시우', '주원', '하준', '지호', '건우', '현우', '우진', '선우', '연우', '유준', '정우', '승현', '준영', '재원', '태윤', '로운']

export const UNIVERSITIES = [
  { key: 'yonsei', label: '연세대학교', domain: 'yonsei.ac.kr', depts: ['산업디자인학과', '미디어아트학과', '경영학과', '컴퓨터과학과'] },
  { key: 'gongju', label: '국립공주대학교', domain: 'kongju.ac.kr', depts: ['디자인학과', '컴퓨터공학과', '국어국문학과', '행정학과'] },
  { key: 'dongeui', label: '동의대학교', domain: 'deu.ac.kr', depts: ['콘텐츠디자인학과', '신소재공학과', '경영학과', '간호학과'] },
  { key: 'ewha', label: '이화여자대학교', domain: 'ewha.ac.kr', depts: ['디자인학부', '사회학과', '심리학과', '국제학부'] },
  { key: 'handong', label: '한동대학교', domain: 'handong.ac.kr', depts: ['소프트웨어학과', '국제개발협력학과', '경영경제학부', '글로벌리더십학부'] }
]

// 포털 데모 로그인(역할 랜덤 변경)에 쓰이는 8명 — 별도 목록이 아니라 이 표의 특정 슬롯에 실제로 앉혀서
// enrollments.js/counselingSessions.js 등 다른 테이블과 동일한 PK를 공유하게 함
const HERO_SLOTS = {
  yonsei: [
    { name: '이진호', studentNumber: '2021123456', department: '산업디자인학과', email: 'jinho.lee@yonsei.ac.kr', phone: '010-1234-5678' },
    { name: '박서연', studentNumber: '2022114567', department: '미디어아트학과', email: 'seoyeon.park@yonsei.ac.kr', phone: '010-2345-6789' }
  ],
  gongju: [
    { name: '최민준', studentNumber: '2021098234', department: '디자인학과', email: 'minjun.choi@kongju.ac.kr', phone: '010-3456-7890' }
  ],
  dongeui: [
    { name: '김하늘', studentNumber: '2022087345', department: '콘텐츠디자인학과', email: 'haneul.kim@deu.ac.kr', phone: '010-4567-8901' },
    { name: '이도현', studentNumber: '2021043789', department: '신소재공학과', email: 'dohyun.lee@deu.ac.kr', phone: '010-8901-2345' }
  ],
  ewha: [
    { name: '황지민', studentNumber: '2022065567', department: '디자인학부', email: 'jimin.hwang@ewha.ac.kr', phone: '010-6789-0123' }
  ],
  handong: [
    { name: '오세훈', studentNumber: '2021076456', department: '소프트웨어학과', email: 'sehoon.oh@handong.ac.kr', phone: '010-5678-9012' },
    { name: '신유진', studentNumber: '2022054678', department: '국제개발협력학과', email: 'yujin.shin@handong.ac.kr', phone: '010-7890-1234' }
  ]
}

const RESERVED_NAMES = new Set(Object.values(HERO_SLOTS).flat().map((h) => h.name))

const students = []
let sid = 1
for (const uni of UNIVERSITIES) {
  const heroes = HERO_SLOTS[uni.key] || []
  for (let i = 0; i < 20; i++) {
    const hero = heroes[i]
    if (hero) {
      students.push({
        id: sid,
        studentNumber: hero.studentNumber,
        name: hero.name,
        university: uni.key,
        department: hero.department,
        email: hero.email,
        phone: hero.phone
      })
      sid++
      continue
    }

    let name
    let attempt = 0
    do {
      const surname = SURNAMES[(sid + attempt * 3) % SURNAMES.length]
      const given = GIVEN_NAMES[(sid * 3 + attempt * 7) % GIVEN_NAMES.length]
      name = surname + given
      attempt++
    } while (RESERVED_NAMES.has(name) || students.some((s) => s.name === name))

    students.push({
      id: sid,
      studentNumber: `20${21 + (i % 4)}${String(100000 + sid).slice(-6)}`,
      name,
      university: uni.key,
      department: uni.depts[i % uni.depts.length],
      email: `student${sid}@${uni.domain}`,
      phone: `010-${String(1000 + sid).padStart(4, '0')}-${String(9000 + sid).padStart(4, '0')}`
    })
    sid++
  }
}

export function studentById(id) {
  return students.find((s) => s.id === id)
}

export function studentByName(name) {
  return students.find((s) => s.name === name)
}

export function universityLabel(key) {
  const uni = UNIVERSITIES.find((u) => u.key === key)
  return uni ? uni.label : key
}

export default students
