# huss

Vue 3 프로젝트 (Vite 기반).

## 스택

- Vue 3, **Options API** 사용 (Composition API/`<script setup>` 사용하지 않음)
- Vite
- Vue Router (`vue-router`)
- axios
- vue-i18n(국/영 다국어, `legacy:false` 모드지만 Options API에서도 `this.$t()`/템플릿 `$t()` 그대로 사용 가능 — 컴포넌트에 `useI18n()` 등 Composition API 코드 추가할 필요 없음)

## 명령어

```bash
npm run dev      # 개발 서버
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
```

## 버전 관리

- **Semantic Versioning** (`MAJOR.MINOR.PATCH`, `package.json`의 `version` 필드). 백엔드(`huss-backend`)도 동일 규칙으로 독립적으로 버전을 관리한다 — 두 레포는 서로 다른 배포 단위라 버전이 항상 같이 움직이지 않아도 된다.
- 정식 오픈(5개 대학 대상 실배포) 전까지는 `0.x.y`를 유지한다. `1.0.0`은 정식 오픈 시점에만 올린다.
- `PATCH`(`0.1.x`): 버그 수정. `MINOR`(`0.x.0`): 기능/화면 단위 추가. `MAJOR`: 정식 오픈 전엔 올리지 않음.
- **브랜치**: 기존 관행대로 `main` 단일 브랜치에 직접 커밋한다(별도 `develop` 없음). Vercel은 `main` push를 그대로 프로덕션에 반영한다.
- 의미 있는 단위(데모·마일스톤 직전 등)로 `package.json` 버전을 올리고 `git tag vX.Y.Z`를 찍는다. 이 시점이 랩미팅/보고서에서 "이 버전 기준"이라고 참조할 체크포인트가 된다.
- **커밋 메시지**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:` 등 접두사 + 한글 설명). `huss-backend`도 동일 컨벤션을 쓴다.

## 구조

- `src/App.vue` — 루트 컴포넌트. `$route.meta.bare`가 true면 마케팅 `AppHeader`/`AppFooter` 없이 `<router-view/>`만 렌더링 (포탈 섹션용)
- `src/router/index.js` — 라우트 정의. 마케팅 사이트의 5개 섹션(`/intro`, `/curriculum`, `/support`, `/share`, `/bulletin`)이 전부 동일한 패턴: `<Section>Layout.vue`(배너+사이드바+`<router-view/>`) + 하위 페이지 여러 개. 새 섹션이나 하위 페이지를 추가할 땐 이 패턴을 그대로 따라가면 됨
- `src/views/` — 라우트에 매핑되는 페이지 컴포넌트, 섹션별로 폴더 분리(`intro/`, `curriculum/`, `support/`, `share/`, `bulletin/`, `portal/`)
- `src/views/intro/` — 사업소개: `IntroLayout.vue` + `GreetingView`(사업단장 인사말), `VisionView`(비전/목표), `WithusView`(WITHUS 인재상), `ConsortiumView`(컨소시엄 구성), `OrganizationView`(조직도), `ContactView`(찾아오시는 길). 전부 광운대 실사이트 텍스트를 그대로 옮겨옴
- `src/views/curriculum/` — 교육과정 섹션: `CurriculumLayout.vue`(배너+사이드바+`<router-view/>`) + 하위 페이지(`CurriculumIntroView`, `CurriculumDeptView`, `CurriculumSubjectView`, `CurriculumMicrodegreeView`, `CurriculumProgramView`). `CurriculumSubjectView`는 대학별 탭(광운대/국민대/선문대/영남대/호남대) + 개설과목 표 + 교과목명/담당교수 검색 입력(대학 필터링 후 클라이언트 사이드로 추가 필터링, `keyword` computed)
- `src/views/support/` — 학생지원: `SupportLayout.vue` + `SupportInfoView`(지원제도), `ClubView`(동아리), `JobInfoView`(취업정보, `BoardTable` 사용), `JobDetailView`(게시글 상세, `/support/job/:id`)
- `src/views/share/` — 성과공유: `ShareLayout.vue` + `ResultView`(우수성과 카드), `NewsletterView`(뉴스레터 — 실사이트 그대로 empty state), `CardnewsView`(카드뉴스 그리드+페이지네이션), `ResultDetailView`/`CardnewsDetailView`(게시글 상세, `PostDetail` 공통 컴포넌트 사용). 라우트는 `/share/:id`(우수성과 상세), `/share/cardnews/:id`. 카드 클릭 시 상세로 이동하며, 홈 화면 `PerformanceSection`도 동일 데이터를 가져다 써서 우수성과 카드를 클릭하면 상세로 연결됨
- `src/data/results.js`, `cardnews.js` — 우수성과/카드뉴스 목데이터(제목/날짜/이미지/본문). 실제 huss.kw.ac.kr 성과공유 게시글에서 썸네일 이미지를 다운로드해(`src/assets/share/result-*.jpg`, `cardnews-*.png|jpg`, `sips`로 각각 640×480·480×480 크롭) 목업 항목 제목과 매칭시켜 넣음 — 순수 내부 데모용으로 임시 사용, 실제 배포 전 자체 사진으로 교체 필요(hero 이미지와 동일한 사유)
- `src/views/bulletin/` — 정보광장: `BulletinLayout.vue` + `NoticeView`/`PartnerNoticeView`(`BoardTable` 사용), `DataRoomView`(자료실), `FaqView`(아코디언, 목업 Q&A — 실사이트는 FAQ가 비어있어서 패턴 시연용으로 채움), `ScheduleView`(사업단 일정 — 이전/다음 달 버튼 있는 풀 캘린더, 홈 화면 `ScheduleSection`과 별개 구현), `NoticeDetailView`/`PartnerNoticeDetailView`/`DataRoomDetailView`(게시글 상세, `PostDetail` 공통 컴포넌트 사용). 라우트는 `/bulletin/:id`(공지사항 상세), `/bulletin/partner-notice/:id`, `/bulletin/data/:id`
- `src/components/board/BoardTable.vue` — 게시판 리스트 공통 컴포넌트(번호/제목/등록일/작성자/조회수). `items`, `basePath` prop을 받으며 제목이 `router-link`로 `${basePath}/${row.id}` 상세 페이지로 연결됨. 모바일(≤768px)에서 작성자·조회수 컬럼 숨김. 취업정보/공지사항/참여대학공지/자료실 4곳에서 재사용
- `src/components/board/PostDetail.vue` — 게시글 상세 공통 프레젠테이션 컴포넌트. `post`(제목/날짜/본문 + 선택적으로 작성자/조회수/`image`)와 `listTo`(목록 버튼 경로) prop만 받고, `post`가 없으면(잘못된 id) "게시글을 찾을 수 없습니다" 표시. 작성자·조회수·이미지는 있을 때만 렌더링되므로 게시판형(공지사항 등)과 카드형(우수성과·카드뉴스, `image` 필드 있음) 양쪽에서 재사용 가능. 실제 데이터 조회는 각 섹션의 `*DetailView.vue`(예: `NoticeDetailView.vue`, `ResultDetailView.vue`)가 담당 — `src/data/*.js`에서 `$route.params.id`로 항목을 찾아 넘겨줌
- `src/data/notices.js`, `partnerNotices.js`, `jobs.js`, `dataroom.js`, `results.js`, `cardnews.js` — 게시판/카드형 목데이터를 컴포넌트 밖으로 분리한 유일한 예외. 목록 뷰(`NoticeView`, `ResultView` 등)와 상세 뷰(`NoticeDetailView`, `ResultDetailView` 등)가 동일한 배열을 import해서 같이 써야 게시글 상세보기가 동작하므로, 상세보기가 있는 이 6곳만 데이터를 `src/data/`에 두고 각 컴포넌트 `data()`에서 import해서 쓰는 방식으로 예외 처리함(다른 페이지는 기존 컨벤션대로 컴포넌트 내부에 목업 데이터 유지). 각 항목은 `id`(라우트 파라미터로 사용) 필드를 반드시 가짐
- `src/views/portal/` — **홍보 사이트와 분리된 실제 플랫폼(LMS류) 섹션**. `/portal` 라우트에 `meta: { bare: true }`가 붙어 있어 마케팅 헤더/푸터 없이 `PortalLayout.vue` 하나만 렌더링됨. 메인 사이트에서는 `AppHeader`의 "LMS" 링크가 `<router-link to="/portal" target="_blank">`로 새 탭에서 열림 — 연세대 LearnUs, 건국대 TLS처럼 홍보 사이트와 완전히 분리된 별도 페이지처럼 보이게 하는 목적. 지금은 같은 Vue 앱 안에서 라우트/레이아웃만 분리한 상태 — 나중에 백엔드에서 실제로 배포를 분리하고 싶으면 그때 레포/도메인을 쪼개면 됨
  - `PortalLayout.vue` — **표준 대시보드 셸**: 왼쪽 고정 사이드바(네이비, `ServiceIcon` 아이콘 + 라벨, 활성 라우트 하이라이트) + 상단 타이틀바(현재 페이지명을 `$route.path` 매칭으로 자동 표시 + 언어 토글(ENG/KOR)+사용자/로그아웃) + `<router-view/>` 콘텐츠 영역. 포탈 하위 페이지 5개(마이페이지/나노디그리 시뮬레이터/학사지도·상담/교과목 관리/관리자) 전부 이 사이드바로 이동 — 예전엔 페이지마다 "← 마이페이지" 백링크가 있었는데, 기능이 늘어날 걸 고려해서 사이드바 nav로 교체함. 모바일(≤900px)에서는 사이드바가 상단 가로 아이콘 바로 축소(라벨 숨김). 사이드바 라벨/로그아웃/바로가기 문구는 전부 `$t('portal.*')` 키 사용 — 마케팅 헤더와 별개 레이아웃이라 언어 토글 버튼도 여기 자체적으로 하나 더 있음(같은 전역 vue-i18n 인스턴스라 클릭하면 마케팅 사이트와 동일하게 즉시 전환)
  - `PortalHomeView.vue` — 마이페이지(포탈 랜딩). 2단 레이아웃: 왼쪽 프로필 카드(이름/이수학점 등 통계)+알림 pill, 오른쪽 공지사항+**추천 교과목·프로그램**(신규, 3개 카드+추천 이유 한 줄, 정적 카피지만 나노디그리 진행상황과 그럴듯하게 연결되게 작성)+바로가기(마케팅 사이트로 새 탭 이동). 알림 pill 중 "상담 예약 알림"은 `counselingSessions`에서 현재 학생(`CURRENT_STUDENT`)의 `예정` 건수, "신규 공지"는 `notices.js`에서 최근(2026-07-01 이후) 건수로 computed — "학사 알림"만 별도 이벤트 소스가 없어 정적 유지. 사이드바가 생기면서 예전에 있던 "서비스 타일 그리드"는 사이드바 nav와 중복이라 제거함
  - `MicrodegreeSimulatorView.vue`(나노디그리 시뮬레이터) — 트랙 탭(AI융합/글로벌통상, `CurriculumSubjectView`와 동일한 `.tab`/`.tab.active` 패턴) + 이수학점/필요학점/이수율 요약 카드 + 진행률 바(`.progress-track`/`.progress-fill` + 나노디그리 학점 위치를 표시하는 `.progress-marker`) + 3단 커리큘럼맵(기초/심화/캡스톤, `grid-template-columns: repeat(3,1fr)`) + 과목 카드 상태 뱃지(완료/진행중/미이수, 페이지 전용 scoped CSS). 트랙마다 `nanoCredits`(6, 학점 총량만 충족하면 인증)와 `requiredCredits`(9, 마이크로디그리 기준 — 학점+필수과목 전부 필요)를 분리해서 `nanoMet`/`microMet` 두 조건을 각각 표시(나노/마이크로디그리 이수 요건이 다르다는 project-brief 기준 반영). "시뮬레이션 모드" 토글 on 시 미이수 과목 클릭 → `course.simulated` 플래그로 가상 이수 처리, computed로 재계산. 목데이터는 컴포넌트 `data()` 내부(다른 페이지와 공유 안 함)
  - `CounselingView.vue`(학사지도·상담) — 3탭(상담 신청/내 예약 목록/상담 이력, 동일 `.tab` 패턴). **이 프로젝트 최초의 폼**을 여기서 도입(`.form-group` + `<input>/<select>/<textarea>`, `border:1px solid var(--color-border)` 스타일, `.btn-primary`/`.btn-secondary`) — 이후 교과목 관리가 이 폼 컨벤션을 그대로 재사용. `src/data/counselingSessions.js`(여러 학생 명의로 시드된 공유 배열)를 import해서 `studentName === CURRENT_STUDENT`로 필터링한 게 "내 예약/이력"이고, 이 페이지는 그 필터링된 뷰만 다룸 — 전체 학생 상담은 관리자 페이지가 담당(아래). 상담신청 제출 시 공유 배열에 새 행 push 후 "내 예약 목록" 탭으로 자동 전환, 취소 버튼은 상태를 `취소`로 변경(삭제 아님). 상담 이력 탭은 `완료` 상태만 필터링해 만족도(별점)+메모 표시
  - `AdminDashboardView.vue`(관리자) — KPI 카드 4개(나노디그리 취득률은 정적, 상담 완료율은 `counselingSessions`에서 `완료/(전체-취소)`로 computed, 운영중 교과목 수/승인대기 건수는 `subjectApprovals`에서 computed) + 탭 2개("교과목 승인"/"상담 관리", `.tab` 패턴 재사용). 교과목 승인 탭: 기존 승인대기 큐 테이블(승인/반려 버튼이 `subjectApprovals` 항목 상태를 직접 변경). 상담 관리 탭: **전체 학생**의 `counselingSessions`를 테이블로(학생명 컬럼 포함), `예정` 건에 완료 처리/취소 버튼 — project-brief 5.1의 "사업단 및 교강사용 상담 관리 화면" 요구사항을 여기서 충족(학생 쪽 `CounselingView`가 자기 것만 보는 셀프서비스라면, 이쪽은 스태프가 전체를 보는 관리 화면). 두 탭 아래 공통으로 "운영 통계"(나노디그리 트랙 이수율 + 상담 유형별 신청 비율, `counselingSessions`에서 computed) + "홈페이지 이용 현황"(페이지별 조회수 mock, `.bar-track`/`.bar-fill` 재사용, 차트 라이브러리 없음) + "리포트 생성" 버튼(클릭 시 현재 KPI·승인대기·상담통계를 텍스트로 모아 `Blob`+`URL.createObjectURL`로 `.txt` 파일 다운로드 — 신규 의존성 없이 브라우저 API만 사용, 실제 자동화는 아니지만 클릭 시 실제 파일이 내려받아지는 기능)
  - `SubjectManagementView.vue`(교과목 관리) — `src/data/subjectApprovals.js`를 import해서 그대로 mutate(관리자 페이지와 동일 배열 공유). 담당과목 테이블(등록 시 `승인대기` 상태로 push → 관리자 큐에 즉시 반영) + 등록폼(Counseling에서 정의한 폼 컨벤션 재사용) + **수정 기능**(`editingId` data 필드, "수정" 버튼 클릭 시 폼에 기존 값 프리필 → 저장 시 push 대신 `Object.assign`으로 해당 레코드 갱신, 폼 상단 타이틀/제출 버튼 라벨이 등록/수정 모드에 따라 전환). 삭제도 계속 지원
  - 4개 페이지 모두 상태 뱃지는 값 어휘가 서로 달라(완료/진행중/미이수 vs 예정/완료/취소 vs 승인대기/운영중/반려) 공통 컴포넌트로 빼지 않고 페이지별 scoped CSS로 각자 스타일링(의도적 선택, 프로젝트의 "성급한 추상화 금지" 컨벤션 유지). 로그인 역할(학생/교강사/관리자) 구분 없이 사이드바 5개 메뉴 전부 노출되는 단일 뷰로 유지 — 아직 인증/권한 백엔드가 없어 역할 전환 UI는 도입하지 않음
  - `src/data/subjectApprovals.js`, `counselingSessions.js` — `src/data/*.js` 공유 예외의 용례를 게시판 목록+상세 쌍 너머로 확장: 교과목 관리(등록)→관리자(승인) 워크플로우, 학생 상담 신청→관리자 상담 관리 워크플로우가 각각 같은 배열을 여러 페이지에서 mutate. `src/data/currentUser.js`(`CURRENT_STUDENT = '이진호'`)가 "지금 로그인한 학생이 누구인지"를 나타내는 유일한 소스 — `PortalLayout.vue` topbar에 하드코딩된 "이진호님"과 동일 인물 개념이며, `CounselingView`/`PortalHomeView`가 이 값으로 전체 데이터 중 "내 것"만 필터링함. **주의**: 브라우저에서 QA할 때 `goto`로 URL을 직접 이동하면 전체 페이지가 새로고침되어 모듈이 재초기화되므로 이 공유 상태가 리셋됨 — 반드시 사이드바 `router-link` 클릭(SPA 네비게이션)으로 이동해야 승인↔등록, 상담 완료 처리↔학생 이력 연동이 유지되는 걸 확인할 수 있음
  - `src/components/portal/ServiceIcon.vue` — 사이드바/타일용 심플 라인 아이콘 컴포넌트 (`name` prop으로 microdegree/counseling/subjects/admin/mypage/extra 중 선택, 이모지 대신 인라인 SVG 사용)
- `src/components/layout/` — `AppHeader.vue`, `AppFooter.vue` (홍보 사이트 전용, 포탈에는 안 씀)
- `src/components/home/` — 홈 화면 섹션 컴포넌트 (`HeroCarousel`, `PerformanceSection`, `NoticeBoard`, `ScheduleSection`). `NoticeBoard`는 `src/data/notices.js`·`partnerNotices.js`를 그대로 가져다 앞 5개만 보여주며, 제목 클릭 시 정보광장 게시글 상세 페이지로 이동(목록 페이지와 데이터를 공유하므로 항상 실제 존재하는 글로 연결됨)
- `src/i18n/index.js` — 국/영 다국어. `createI18n({ legacy:false, locale:'ko', fallbackLocale:'ko', messages:{ko,en} })`, `src/main.js`에서 `app.use(i18n)`. **범위는 "핵심 chrome"만**: `AppHeader`/`AppFooter`/홈 섹션들(`HeroCarousel`/`PerformanceSection`/`NoticeBoard`/`ScheduleSection`)/포탈 셸(`PortalLayout`/`PortalHomeView`의 라벨) — 나머지 페이지(사업소개~정보광장 본문, 포탈 하위 4개 페이지 본문)는 의도적으로 한국어 고정. 번역 대상은 컴포넌트 `data()`에 `labelKey`/`titleKey` 문자열로 두고 템플릿에서 `$t(item.labelKey)`처럼 참조(하드코딩 라벨을 직접 두지 않음). 언어 전환은 `this.$i18n.locale = 'en'`처럼 **`.value` 없이** 대입 — `legacy:false`라도 전역 주입된 `$i18n.locale`은 getter/setter로 ref를 자동 언랩하는 래퍼라서 `.value`를 붙이면 문자열에 `.value`를 쓰려다 에러남(한 번 겪은 버그, `AppHeader.vue`/`PortalLayout.vue`의 `toggleLang()` 참고)
- `src/api/http.js` — axios 공통 인스턴스 (baseURL, 인터셉터). **아직 실제 백엔드 연동 안 함** — 현재 데모 화면은 전부 컴포넌트 내 목업 데이터로 렌더링
- `src/api/*.js` — 페이지별 API 모듈 스캐폴드. 각 모듈은 `http.js`를 import해서 사용 (예: `src/api/home.js`, 아직 화면에서 호출 안 함)
- `src/main.js` — 앱 엔트리포인트
- `src/style.css` — 전역 스타일, 색상 변수. **연세대학교 디자인센터 전용색상 기준을 그대로 채택**(`https://rus.yonsei.ac.kr/designcenter/design_con/signature_color.do` 참고, HUSS가 연세대 산하 컨소시엄이라는 설정과 일관되게): `--color-primary`/`--color-accent`(YONSEI Blue `#003876`), `--color-primary-dark`(그라데이션용으로 파생시킨 더 어두운 블루 `#001f42`, 공식 팔레트엔 없지만 배너 그라데이션에 필요해서 추가), `--color-text`(YONSEI Black `#231f20`), `--color-muted`(YONSEI Medium Dark Gray `#707274`), `--color-border`(YONSEI Silver `#c9cacc`), `--bg-soft`(Silver 계열에서 더 밝게 파생시킨 배경용 회색 `#f2f3f3`), `--color-yellow`(YONSEI Yellow `#fdba30`, 강조 배지/CTA 포인트 전용). Red(Pantone 1797C)는 가이드 자체가 "금지표시/주차장" 용도로 한정하고 있어서 도입 안 함. 예전엔 "여러 색 섞지 말고 절제된 톤 하나로"가 원칙이었지만, 연세대 공식 브랜드 컬러를 최대한 따르기로 결정하면서 Yellow를 공식 서브컬러로 허용함(임의로 고른 색이 아니라 가이드에 있는 색이라 예외)
- **그래픽 모티브** — 연세대 디자인센터의 "그래픽 모티브"(`.../design_con/graphic_motive.do`) 중 심벌 네거티브 스페이스에서 파생된 사각 블록/바 모티브를 차용. 두 가지 변형을 일관되게 사용: (1) 네이비 배경 위에는 `--color-yellow` 바(`.motif-bar`, 좌측 24px 지점·하단 고정·48×6px) — 5개 섹션 배너(`.page-banner`)와 포탈 마이페이지 프로필 카드(`.profile-card`)에 적용. (2) 흰 배경/카드 위에는 `--color-primary` 바(썸네일 `::before`, 상단좌측 고정·28×6px 내외) — 홈 우수성과 카드(`PerformanceSection`), 공지사항 게시판(`NoticeBoard`), 성과공유 우수성과/카드뉴스 카드(`ResultView`/`CardnewsView`), 포탈 추천 카드(`PortalHomeView` `.recommend-card`)에 적용. 관리자 대시보드의 강조 KPI 카드(`AdminDashboardView` `.kpi-card.highlight`)만 예외적으로 Yellow 바를 사용(흰 배경이지만 "강조" 의미를 살리려고). 컨테이너에 `border-radius`가 있으면 모티브 바를 감싸는 요소에 `overflow:hidden`을 같이 둬야 라운드 코너 밖으로 삐져나오지 않음 — 새 카드/배너에 모티브를 추가할 땐 이 패턴 그대로 복붙(공용 컴포넌트로 안 뺌, 프로젝트의 "성급한 추상화 금지" 컨벤션과 동일한 이유)

## 컨벤션

- 새 컴포넌트는 Options API(`export default { data, computed, methods, ... }`) 형식으로 작성
- API를 실제로 연동할 때는 직접 axios를 쓰지 않고, 페이지별 `src/api/<page>.js` 모듈을 통해서 호출. 그 모듈은 `src/api/http.js`의 공통 인스턴스를 사용
- API base URL은 `.env`의 `VITE_API_BASE_URL`로 설정
- 데모 단계에서는 목업 데이터를 각 컴포넌트의 `data()`에 직접 둠 (백엔드 연동 시 `api/*.js` 호출로 교체 예정)
- 참고 사이트: 광운대 HUSS 홈페이지(https://huss.kw.ac.kr/) — 상단 유틸바 → 로고+메인내비(사업소개/교육과정/학생지원/성과공유/정보광장) → 히어로 캐러셀 → 우수성과 카드 → 공지사항/참여대학공지 2단 → 사업단일정(캘린더)+CTA 버튼 → 푸터 구조를 그대로 참고
- 홈 히어로(`HeroCarousel.vue`)는 연세대(yonsei.ac.kr) 스타일 참고: 풀블리드 배경 위에 큰 굵은 타이틀 + 슬라이드 카운터("01 / 04")·이전/다음 버튼. 검색창은 제거함(쓸모없다는 피드백). 슬라이드 4개 전부 연세대 메인 배너에서 임시로 받아온 실제 사진(`src/assets/hero-sample.jpg` ~ `hero-sample-4.jpg`, 1920×700로 크롭)을 배경으로 씀 — `slides` 배열의 `image` 필드가 있으면 `.hero-photo`(사진+어두운 그라디언트 오버레이), 없으면 `.hero-bg`(추상 그라디언트+격자)를 렌더링. 실제 광운대/HUSS 사진이 생기면 이 자리를 교체할 것. (참고: 처음엔 특정 인물이 나온 광고 사진과 연세대 로고+QS 랭킹이 박제된 그래픽 2장은 제외했었으나, 사용자가 "그냥 써, 느낌만 볼려고"라고 명시적으로 요청해서 전부 포함시킴 — 순수 내부용 데모라 임시로 넣은 것, 실제 배포 전엔 자체 사진으로 교체 필요)
- 메인 nav(`사업소개/교육과정/학생지원/성과공유/정보광장`)는 항목마다 `children` 배열을 가지고 있고, 호버 시 `.submenu` 드롭다운이 뜸(CSS `:hover`만으로 구현, JS 상태 없음). `.nav-item > a`가 최상위 링크, `.submenu-link`가 드롭다운 안 링크 — 색상 규칙을 겹쳐 쓰지 않으려면 이 두 선택자를 구분해서 스타일링할 것. 5개 섹션 전부 실제 하위 라우트가 있어서 서브메뉴 링크가 각자 다른 페이지로 연결됨(예: 사업소개 > 컨소시엄 구성 → `/intro/consortium`). 모바일(≤768px)에서는 호버가 없으므로 `.submenu`를 `display:none`으로 숨김
- 섹션 레이아웃(`IntroLayout`/`CurriculumLayout`/`SupportLayout`/`ShareLayout`/`BulletinLayout`)의 `.layout-grid`는 데스크톱에서 `grid-template-columns: 220px 1fr`, 모바일(≤768px)에서 `1fr`로 전환하는데, 그리드 트랙은 기본적으로 자식의 min-content 크기 아래로 줄어들지 않는 게 CSS 스펙 동작이라(`minmax(auto,1fr)`) 사이드바에 줄바꿈 안 되는 긴 라벨이나 표(`white-space:nowrap`)가 있으면 모바일에서 그리드 전체가 화면 밖으로 넘치는 버그가 있었음(발견 당시 375px 뷰포트에서 실제 페이지 폭이 640px+로 벌어짐). 다섯 레이아웃 전부 모바일 미디어쿼리에 `.sidebar, .content { min-width: 0; }`를 추가해 고침 — 새 섹션 레이아웃을 추가하거나 사이드바/본문에 폭이 넓은 콘텐츠(표, 긴 텍스트)를 넣을 땐 이 두 클래스에 `min-width:0`이 있는지 꼭 확인할 것
- `AppHeader`는 항상 `position: fixed`(높이 72px)로 최상단에 고정. 홈(`/`)이고 스크롤이 40px 미만일 때만 투명 오버레이(`.overlay`, 흰 텍스트, 그림자 없음)로 히어로 위에 뜨고, 그 외(스크롤됐거나 다른 페이지)에는 흰 배경 + `box-shadow`로 전환(`.solid`). `<main>`은 `padding-top: 72px`로 고정 헤더 자리를 확보하고, `HeroCarousel`만 `margin-top: -72px`로 그 여백을 되돌려 히어로가 화면 맨 위부터 풀블리드로 시작하게 함 — 헤더 높이를 바꾸면 이 두 값도 같이 맞춰야 함
- 로고 영역: "HUSS" 옆에 `|` 구분선 + 연세대 로고(투명 배경, height 36px). 헤더 상태에 따라 이미지 자체를 교체함 — 오버레이(네이비 히어로 위)일 땐 `src/assets/yonsei-logo-white.png`, 흰 배경(solid)일 땐 `src/assets/yonsei-logo-dark.png` (`AppHeader.vue`의 `partnerLogoSrc` computed). **모바일(≤768px)에서는 부제/구분선/연세대 로고를 전부 숨김** — 다 보이면 헤더 콘텐츠가 3줄로 줄바꿈되면서 고정 높이(72px)를 넘어 `align-items: center`로 인해 로고가 화면 위로 넘쳐 잘리는 버그가 있었음. 헤더에 요소를 더 추가할 때는 모바일에서 줄바꿈 줄 수가 늘어나지 않는지 꼭 확인할 것

## 참고 문서

- `docs/` — 사업계획서 등 참고 문서 보관 위치
- `docs/project-brief.md` — HUSS 프로젝트 배경, 업무분장, 일정 정리 (원본: `docs/huss.pdf`)
