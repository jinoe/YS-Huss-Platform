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

- [x] **Phase 1** — 데이터 모델 신설(`courses.js`/`enrollments.js`/`kpiIndicators.js`) + `currentUser.js` 역할 확장 + `CurriculumSubjectView` `courses.js` 참조로 리팩터 + 역할 토글 UI(`PortalLayout`)
- [x] **Phase 2** — 수강편람(`/portal/courses`) + 강의실 상세(`/portal/courses/:id`, role별 분기 + 로스터 + CSV)
- [x] **Phase 3** — `PortalHomeView` role별 "수강/담당 과목" 섹션
- [x] **Phase 4** — KPI 대시보드(`/portal/kpi`) + 필터 + CSV 2종
- [x] **Phase 5** — 수강신청(`/portal/registration`), 아래 참고
- [x] **Phase 6** — 강의계획서 작성(`/portal/courses/:id/syllabus`), 아래 참고
- [x] **Phase 7** — 포탈 로그인 게이트(`/portal/login`) + 강의계획서 보기/수정 토글 + 관리자 수강신청 내역 CSV, 아래 참고

## Phase 5 — 수강신청(`/portal/registration`)

- 참고 이미지: `docs/portalscreenshot.png`(연세포털 수강신청 화면). 별도 페이지로 신규 추가 — 두 페이지의 UI 톤이 서로 다르므로 하나로 합치지 않음. 수강신청 액션(버튼)은 이 페이지로 일원화하고, 기존 수강편람(`/portal/courses`)에 있던 인라인 수강신청 버튼/컬럼은 제거해 순수 조회용 표로 정리함(중복 액션 지점 방지).
- **`courses.js` 필드 확장**: `courseCode`(개설전공 약어+id), `section`, `grade`, `sessionType`, `cancelled`, `lectureTime`, `room`, `language`, `deliveryMode`, `evaluationMethod`, `exchangeAllowed`, `note`를 파일 하단에서 프로그래매틱하게 파생 부여(수기 작성 아님). `language`/`exchangeAllowed`는 `name`이 영문 제목인지에서 논리적으로 유도(영문 강의 → 교환학생 수강가능 Y). `cancelled`는 데모용으로 2개 과목만 지정.
- **페이지 구성**: 안내문(접기/펼치기) → **수강신청 목록**(현재 학생이 이미 신청한 과목 요약표, 총 건수·학점) → 검색 필터바(학년도/학기·대학·개설전공·학년·학점 + 키워드 필드선택(학정번호/교과목명/담당교수)+검색어 + 영어강의/온라인강의 전체조회 바로가기 + 조회 버튼, "초안 필터 → 조회 클릭 후 표에 반영" 방식, 드롭다운은 폭에 맞춰 인라인 배치·검색어 입력창만 남는 공간을 채움) → 결과표(스크린샷처럼 셀마다 테두리를 그려 구분감을 줌, 총건수 표시, 엑셀 다운로드) → 학생 role에서만 수강신청 액션 컬럼(사각형에 가까운 회색 버튼, hover 시 대각선 하이라이트가 스치는 효과).
- **주의(재발 방지)**: `isEnrolled`/`수강신청 목록`을 처음엔 `queries.js`의 `isStudentEnrolledByName`/`enrollmentsForStudentName` 헬퍼로 구현했더니, 그 헬퍼들이 `enrollments.js`를 별도로 import한 "일반 배열" 참조를 읽어서 Vue가 그 읽기를 반응형으로 추적하지 못해 수강신청 버튼을 눌러도 화면이 갱신되지 않는 버그가 있었음(데이터는 실제로 바뀌지만 리렌더가 안 됨). 컴포넌트 자신의 `this.enrollments`(반응형 프록시)를 직접 필터링하는 방식으로 바꿔서 해결 — 이 페이지처럼 등록 직후 즉시 UI에 반영돼야 하는 화면에서는 `queries.js` 조인 헬퍼 대신 `this.enrollments`를 직접 읽을 것.
- 수강신청 로직은 `enrollments`에 push하는 방식(`registrationOpen && !cancelled && !isEnrolled`일 때만 신청 가능).
- 스크린샷의 학정번호 하단 4개 아이콘(동일교과/개요/계획/마일), 범례·캠퍼스 안내도 팝업 등 실제 기능이 없는 장식 UI는 생략.

## Phase 6 — 강의계획서 작성(`/portal/courses/:id/syllabus`)

- 참고 문서: `docs/강의 계획서 예시.pdf`(연세대 실제 수업계획서 양식). 기존 `CourseDetailView`의 파일 업로드 방식(PDF 다운받아 채워서 재업로드)을 완전히 대체 — 웹에서 직접 입력하는 게 더 편하다는 판단. `CourseDetailView`의 "강의계획서" 섹션은 이제 업로드 위젯 대신 이 페이지로 가는 링크("작성 완료"/"아직 작성되지 않았습니다" 상태 텍스트 + 버튼)만 남김.
- **의도적으로 프로젝트 기본 톤을 안 씀**: 이 페이지는 "별도의 문서"라는 느낌을 줘야 한다는 요구사항 때문에 둥근 모서리/소프트 그림자/옐로·블루 모티브를 전혀 쓰지 않는다. 대신 `RegistrationView`에서 검증된 "표에 굵은 선을 그어 구분감을 주는" 접근을 그대로 재사용하되 더 극단적으로 — 검은 테두리(`border:1px solid #000`), `border-radius:0`, serif 폰트, 흰 배경만 사용해 스캔한 행정서식처럼 보이게 함. 다른 포탈 페이지와 톤이 확 달라지는 게 이 페이지의 의도된 특징.
- **데이터**: `courses.js`의 `syllabus` 필드를 PDF 구조 그대로 확장(`examSchedule`, `professorContact`, `ta`, `overview`, `methodRatio`/`evalRatio`(%), `assignments`/`textbooks`(반복 행), `weeklyPlan`(16주 고정)). 과목마다 다른 값이 아닌 학교 공통 정책 문구(출석의무/장애학생지원/안전주의/수업운영안내)는 데이터로 안 두고 템플릿에 고정 텍스트로 둠. 데모로 과목 하나(id 25, 미래 윤리)만 완성된 내용을 시드하고 나머지는 전부 빈 값 — 학생 화면에서는 빈 값이 전부 "-"로 표시돼 실제 빈 서식처럼 보임.
- **role 분기**: `isProfessor`면 셀이 `<input>`/`<textarea>`로 바뀌어 그 자리에서 바로 수정 가능(셀 안에 입력 필드가 테두리 없이 녹아들게 스타일링해서 보기 모드와 레이아웃이 거의 동일). 과제/교재 행은 "+ 행 추가"/"삭제" 버튼으로 배열 조작. 처음엔 "교수 role이면 항상 편집 가능"이었는데, Phase 7에서 "수정" 버튼을 눌러야 편집 모드로 들어가는 명시적 토글로 바꿈(아래 참고).
- **주의(재발 방지, Phase 5와 동일 패턴)**: `course` computed가 컴포넌트 `data()`에 없는 `courses`를 직접 참조하면(모듈 최상단 import를 그대로 씀) Vue가 반응형으로 추적하지 못해서 과제/교재 행 추가 버튼이 화면에 반영되지 않는 문제가 있었음 — `courses`를 `data()`에 넣고 `this.courses.find(...)`로 조회하도록 고쳐서 해결. 이 프로젝트에서 공유 배열(`courses`/`enrollments` 등)을 쓰는 컴포넌트는 항상 `data()`를 통해 참조할 것.
- **공용 컴포넌트로 분리**: 문서 전체를 `src/components/portal/SyllabusDocument.vue`(props: `course`)로 빼서 `SyllabusView.vue`(단독 라우트), `CourseDetailView.vue`(강의계획서 탭, 인라인), `SyllabusModal.vue`(수강편람·수강신청에서 과목명 클릭 시 모달) 세 곳이 전부 재사용. 수강편람/수강신청에서는 이제 과목명을 눌러도 강의실로 이동하지 않고 이 모달이 뜸(`Teleport to="body"`, Escape/배경클릭/닫기버튼으로 닫힘).

## Phase 7 — 포탈 로그인 게이트 + 강의계획서 수정 토글 + 관리자 수강신청 내역 CSV

- **로그인 게이트**: `/portal/login`(`PortalLoginView.vue`, 연세포털 로그인 화면 참고 — 사진+슬로건 좌측 패널/ID·PW 폼 우측 패널 카드, 다만 실제 안내문구는 우리 서비스와 무관해서 제거) 신설. `session.js`에 `isAuthenticated` 플래그 추가하고 `router.beforeEach`에서 `/portal/*`(로그인 페이지 제외) 접근 시 미인증이면 로그인 페이지로 리다이렉트. **아직 인증 백엔드가 없어 ID/PW 값과 무관하게 로그인 버튼 클릭 시 바로 통과**(임시). `PortalLayout`의 로그아웃 버튼도 이번에 실제로 연결(이전엔 핸들러가 없는 죽은 버튼이었음) — `isAuthenticated`를 false로 되돌리고 로그인 페이지로 이동.
  - QA 주의: `goto`로 URL을 직접 이동하면 페이지 전체가 새로고침되어 `session.js` 모듈이 재초기화되면서 `isAuthenticated`도 다시 false로 리셋됨(다른 공유 상태와 동일한 주의사항, 위 참고). 로그인 이후 테스트는 사이드바 클릭 등 SPA 네비게이션으로 이동할 것.
- **강의계획서 수정 토글**: `SyllabusDocument.vue`에 `editing`(로컬 상태) + `canEdit`(`isProfessor && editing`) computed 추가. 기존에 템플릿 전체에 흩어져 있던 `v-if="isProfessor"`(약 44곳)를 전부 `v-if="canEdit"`로 교체하고, 문서 제목 옆에 "수정"/"수정 완료" 토글 버튼을 추가 — 교수 role이어도 기본은 읽기 전용이고 버튼을 눌러야 편집 모드로 들어감.
- **관리자 수강신청 내역(CSV)**: `AdminDashboardView`에 "수강신청 내역" 탭 신설. 컨소시엄 참여 대학마다 수강신청 시스템 API 연동이 어려워서, 관리자가 그날그날의 신청 내역을 수동으로 CSV로 내려받아 각 대학에 전달하는 운영 방식을 반영한 기능.
  - `enrollments.js`에 학기별 수강신청 기간(`REGISTRATION_PERIOD_START`, 5일간 `REGISTRATION_PERIOD_DAYS`)을 정의하고, 모든 수강신청 행(`CURATED` 시딩 포함)에 그 5일 창 내의 날짜로 `registeredAt`을 결정적으로 부여. 앱에서 실제로 수강신청 버튼을 눌러 생기는 새 행(`RegistrationView`/`CourseDetailView`의 `applyRegistration`)은 `new Date()` 기준 오늘 날짜로 `registeredAt`을 채워서, 라이브 데모 중 등록한 내역도 관리자 화면에서 바로 확인 가능.
  - 화면 구성: 날짜 선택(`<input type="date">`, 수강신청 기간으로 min/max 제한) → 대학별 건수 요약 pill → 총건수 + CSV 다운로드 → 조인된 상세 테이블(학기/소속대학/학생명/학번/학과/교과목명/담당교수/상태). `queries.js`의 `joinedEnrollments()`는 원래 학교 참조하는 `enrollments`를 그대로 읽는데, Phase 5에서 겪은 반응형 버그를 피하려고 `joinedEnrollments(this.enrollments.filter(...))` 형태로 컴포넌트 자신의 반응형 `this.enrollments`를 먼저 필터링해서 넘기는 방식으로 호출.

## 참고

- i18n 범위 컨벤션 유지: 사이드바 신규 라벨(수강편람/강의실/KPI 대시보드, 역할 토글 문구)은 `$t()` 키로 추가(`src/i18n/index.js` ko/en), 나머지 페이지 본문은 기존 컨벤션대로 한국어 고정.
- 그래픽 모티브(네이비 배경 → yellow bar / 흰 배경 → primary bar) 컨벤션을 KPI 카드·강의실 카드에도 동일하게 적용.
