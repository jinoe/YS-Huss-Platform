const INDICATOR_DEFS = [
  { category: '핵심', group: '교육과정 개발·운영', name: '융합인재 양성분야 정규교과목 개발 건수', unit: '건', target: 11 },
  { category: '핵심', group: '교육과정 개발·운영', name: '융합인재 양성분야 정규교과목 운영 건수', unit: '건', target: 21 },
  { category: '핵심', group: '교육과정 개발·운영', name: '융합인재 양성분야 정규교과목 이수자 수', unit: '명', target: 400 },
  { category: '핵심', group: '교육과정 개발·운영', name: '사업주제 연계 표준현장실습학기제 참여 학생 비율', unit: '%', target: 2.5 },
  { category: '핵심', group: '성과 공유·확산', name: '컨소시엄 간 공유 교과목 이수자 수', unit: '명', target: 20 },
  { category: '핵심', group: '성과 공유·확산', name: '공동 활용대학 대상 교과목 운영 건수', unit: '건', target: null },
  { category: '핵심', group: '성과 공유·확산', name: '공동 활용대학 대상 교과목 이수자 수', unit: '명', target: null },
  { category: '핵심', group: '교육 콘텐츠 만족도', name: '융합인재양성분야 정규 교과목 이수자 만족도', unit: '점', target: 4.2 },
  { category: '핵심', group: '진로성과', name: '융합 인재배출 수', unit: '명', target: 70 },
  { category: '핵심', group: '진로성과', name: '취업률', unit: '%', target: null },
  { category: '핵심', group: '진로성과', name: '진학률', unit: '%', target: null },
  { category: '자율', group: '비교과프로그램', name: '비교과프로그램 운영건수', unit: '건', target: 22 },
  { category: '자율', group: '비교과프로그램', name: '비교과프로그램 참여자수', unit: '명', target: 350 },
  { category: '자율', group: 'PBL 교육과정', name: '문제해결형 교육과정(PBL) 운영 건수', unit: '건', target: 12 },
  { category: '자율', group: 'PBL 교육과정', name: '문제해결형 교육과정(PBL) 참여자수', unit: '명', target: 240 },
  { category: '자율', group: 'MOOC 콘텐츠', name: 'MOOC 콘텐츠 등록 건수', unit: '건', target: 5 },
  { category: '자율', group: 'MOOC 콘텐츠', name: 'MOOC 콘텐츠 이수자 수', unit: '명', target: 230 },
  { category: '자율', group: 'AI 활용 교육', name: 'AI 기반 문제해결 프로젝트 산출물 수', unit: '건', target: 25 },
  { category: '자율', group: 'AI 활용 교육', name: 'AI 활용 학습활동 포함 교과목 비율', unit: '%', target: 35 }
]

export const KPI_UNIVERSITIES = [
  { key: 'yonsei', label: '연세대학교' },
  { key: 'gongju', label: '국립공주대학교' },
  { key: 'dongeui', label: '동의대학교' },
  { key: 'ewha', label: '이화여자대학교' },
  { key: 'handong', label: '한동대학교' }
]

export const KPI_YEARS = ['1차년도', '2차년도', '3차년도']

// 연세대학교 1차년도는 참고 대시보드 캡처(docs/screencapture-huss-dashboard-pages-dev-*.png)와
// 동일하게 실적 입력 전(actual: null) 상태를 그대로 유지. 나머지 대학의 1차년도만 이행률을 부여해
// 대학 간 KPI 비교 데모가 가능하게 함. 2·3차년도는 아직 도래하지 않은 연차라 전 대학 공통으로 실적 없음.
const COMPLETION_RATE = {
  gongju: 0.62,
  dongeui: 0.48,
  ewha: 0.81,
  handong: 0.55
}

function roundToUnit(value, unit) {
  if (unit === '%' || unit === '점') return Math.round(value * 10) / 10
  return Math.round(value)
}

const indicators = []
let nextId = 1
for (const uni of KPI_UNIVERSITIES) {
  for (const year of KPI_YEARS) {
    for (const def of INDICATOR_DEFS) {
      let actual = null
      if (def.target != null && uni.key !== 'yonsei' && year === '1차년도') {
        actual = roundToUnit(def.target * COMPLETION_RATE[uni.key], def.unit)
      }
      indicators.push({
        id: nextId++,
        university: uni.key,
        year,
        category: def.category,
        group: def.group,
        name: def.name,
        unit: def.unit,
        target: def.target,
        actual
      })
    }
  }
}

export default indicators
