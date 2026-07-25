# LMS 기능 확장 계획

## 배경

- 학생: 수업 내용을 볼 수 있는 수업 조회 페이지 없음 → 신설 필요
- 교수: 수강생 인적사항 확인 필요 → 수강편람에서 과목 클릭 시 로스터 노출
- 어떤 학생이 어떤 대학의 어떤 단계(DIVE) 과목을 듣는지가 대학별 KPI 측정 소스가 됨
- 참고 이미지: `docs/screencapture-huss-dashboard-pages-dev-2026-07-25-19_43_25.png` (대학별 목표 대비 실적 KPI 대시보드)

## 확정된 설계 결정

1. **로스터 공개 범위**: 교수/관리자 role에서만 노출. 학생 role은 과목 정보 + 수강신청 버튼만 보고 다른 학생 인적정보는 볼 수 없음.
2. **KPI 대시보드 배치**: `PortalLayout` 사이드바에 신규 메뉴 "KPI 대시보드" 추가, 독립 페이지(`/portal/kpi`)로 구현.
3. **과목 데이터 소스**: 포털 전용으로 신설(`src/data/courses.js`). 기존 `CurriculumSubjectView`(마케팅 사이트, 교육과정 > 개설과목)의 `COURSES_BY_UNIVERSITY`를 이 파일로 이관·확장하고, `CurriculumSubjectView`는 이 파일을 import해서 쓰도록 리팩터(중복 데이터 방지).

## 역할 전환 메커니즘 (신규)

- 아직 인증 백엔드가 없으므로 언어 토글과 동일한 패턴으로 **데모용 역할 토글**을 `PortalLayout` 상단바에 추가(학생 ↔ 교수).
- `src/data/currentUser.js` 확장:
  ```js
  export const CURRENT_STUDENT = '이진호'
  export const CURRENT_PROFESSOR = '김소영' // 기존 counselingSessions.js의 counselor 중 한 명 재사용
  export let CURRENT_ROLE = 'student' // 'student' | 'professor'
  ```
  (역할 토글 클릭 시 이 값을 뮤테이션 — 언어 토글이 `this.$i18n.locale` 직접 대입하는 것과 동일한 방식으로, 컴포넌트에서 import 후 재할당하거나 간단한 reactive 객체로 감싸는 방식 중 구현 시점에 결정)
- 관리자(`/portal/admin`)는 기존처럼 role 무관하게 항상 사이드바 노출 유지(기존 컨벤션 유지, 이번 스코프 아님).

## 신규 데이터 파일

- **`src/data/courses.js`**: `CurriculumSubjectView`의 `COURSES_BY_UNIVERSITY`를 이관 + 필드 확장
  - 기존: `group, name, type, credit, method(DIVE 단계), professor`
  - 추가: `id`, `university`, `semester`, `registrationOpen`(수강신청 기간 여부), `capacity`, `syllabus: { uploaded, fileName }`
- **`src/data/enrollments.js`**: 로스터 + KPI + CSV의 공통 소스
  - `{ id, courseId, studentName, studentId(학번), university, department, email, phone, status('수강'|'수료') }`
- **`src/data/kpiIndicators.js`**: 참고 이미지 구조 반영
  - `{ university, year('1차년도'|'2차년도'|'3차년도'), category('핵심'|'자율'), group(예: '교육과정 개발·운영'), name, unit, target, actual }`
  - `actual: null`로 두면 참고 이미지처럼 "실적 입력 전 / 목표 X" + 빈 진행바로 표시

## 신규/변경 페이지

### 1. 수강편람 — `/portal/courses` (신규, 사이드바 추가)
- `CurriculumSubjectView`와 동일한 패턴(대학 탭 + 검색) 재사용하되 `courses.js`에서 로드, 행 클릭 가능
- 클릭 → `/portal/courses/:id`(강의실)
- role=student이고 `registrationOpen=true`인 과목 행에 "수강신청" 버튼 노출(클릭 시 mock — enrollments에 현재 학생 행 추가 정도)

### 2. 강의실(과목 상세) — `/portal/courses/:id` (신규)
- 공통: 과목 개요, 시간표, 학점, DIVE 단계, 강의계획서(업로드돼 있으면 표시)
- role=student: 수강신청 버튼(미수강 + 신청기간) 또는 강의자료 영역(수강 중이면)
- role=professor/admin: 강의계획서 업로드 UI + 수강생 로스터 테이블(`enrollments`에서 `courseId` 필터) + "CSV 다운로드" 버튼(기존 `AdminDashboardView`의 Blob+`URL.createObjectURL` 패턴 재사용)

### 3. `PortalHomeView.vue` 개선
- role=student: "수강 중인 과목" 섹션을 더 크게, 각 항목이 `/portal/courses/:id`로 연결
- role=professor: 동일 위치에 "담당 과목" 섹션(같은 컴포넌트 안에서 role 분기)

### 4. KPI 대시보드 — `/portal/kpi` (신규, 사이드바 추가)
- 콘텐츠 영역 안에 컨소시엄 5개교 미니 리스트(연세대/국립공주대/동의대/이화여대/한동대) + 연차 탭(1~3차년도)
- 요약 카드 3개(평균 달성률 / 실적 항목 / 평균 기여도) — 참고 이미지와 동일 구조
- "핵심 성과지표" / "자율 성과지표" 섹션, 카테고리별 그룹 + 지표 카드(목표 대비 진행바), `kpiIndicators.js` 기반
- 필터(학교/학과/과목) + CSV 다운로드 2종:
  (a) 현재 화면 지표 스냅샷 CSV
  (b) 필터 반영 전체 수강목록 CSV(`enrollments.js` 기반)

## Phase 순서 (체크리스트)

- [ ] **Phase 1** — 데이터 모델 신설(`courses.js`/`enrollments.js`/`kpiIndicators.js`) + `currentUser.js` 역할 확장 + `CurriculumSubjectView` `courses.js` 참조로 리팩터 + 역할 토글 UI(`PortalLayout`)
- [ ] **Phase 2** — 수강편람(`/portal/courses`) + 강의실 상세(`/portal/courses/:id`, role별 분기 + 로스터 + CSV)
- [ ] **Phase 3** — `PortalHomeView` role별 "수강/담당 과목" 섹션
- [ ] **Phase 4** — KPI 대시보드(`/portal/kpi`) + 필터 + CSV 2종

## 참고

- i18n 범위 컨벤션 유지: 사이드바 신규 라벨(수강편람/강의실/KPI 대시보드, 역할 토글 문구)은 `$t()` 키로 추가(`src/i18n/index.js` ko/en), 나머지 페이지 본문은 기존 컨벤션대로 한국어 고정.
- 그래픽 모티브(네이비 배경 → yellow bar / 흰 배경 → primary bar) 컨벤션을 KPI 카드·강의실 카드에도 동일하게 적용.
