<script>
import session, { getDisplayNameWithRole, getTier } from '../../data/session.js'
import LoadingState from '../../components/portal/LoadingState.vue'
import * as coursesApi from '../../api/courses.js'
import * as enrollmentsApi from '../../api/enrollments.js'
import * as professorApi from '../../api/professor.js'

const OPEN_ENROLLMENT_STATUSES = ['applied', 'enrolled']

export default {
  name: 'PortalHomeView',
  components: { LoadingState },
  data() {
    return {
      session,
      loading: true,
      loadError: '',
      myCourses: [],
      completedCredits: 0,
      ongoingCount: 0,
      // 상담 예약 알림/신규 공지/예정 상담: 백엔드에 상담·공지 API가 없어 항상 빈 상태(0)로 둔다.
      notifications: [
        { label: '학사 알림', count: 0 },
        { label: '상담 예약 알림', count: 0 },
        { label: '신규 공지', count: 0 }
      ],
      // 공지사항/추천 교과목: 백엔드에 대응 API가 없어 빈 상태로 둔다(더미 항목을 보여주지 않음).
      notices: [],
      recommendations: [],
      quickLinks: [
        { label: '공지사항', to: '/bulletin' },
        { label: '자료실', to: '/bulletin' },
        { label: 'FAQ', to: '/bulletin' },
        { label: '사업단 홈페이지', to: '/' }
      ]
    }
  },
  async created() {
    this.loading = true
    try {
      if (this.isProfessorRole) {
        // GET /professor/offerings는 담당 과목이 있는 교수(일반/핵심교수)만
        // 호출 가능하다 — 운영진/시스템관리자 계정은 이 API가 403을 준다.
        const offerings = await professorApi.myOfferings()
        this.myCourses = offerings.map((o) => ({
          id: o.id,
          name: o.name,
          professor: o.professor,
          credit: o.credit,
          semester: o.semester,
          group: null
        }))
      } else if (this.isStudent) {
        const [courses, enrollments] = await Promise.all([coursesApi.list(), enrollmentsApi.mine()])
        this.completedCredits = enrollments.filter((e) => e.status === 'completed').reduce((sum, e) => sum + (e.credit || 0), 0)
        const ongoing = enrollments.filter((e) => OPEN_ENROLLMENT_STATUSES.includes(e.status))
        this.ongoingCount = ongoing.length
        this.myCourses = ongoing.map((e) => ({
          id: e.offeringId,
          name: e.courseName,
          professor: e.professor,
          credit: e.credit,
          semester: e.semester,
          group: courses.find((c) => c.id === e.offeringId)?.group || null
        }))
      }
    } catch (e) {
      this.loadError = '마이페이지 정보를 불러오지 못했습니다.'
      console.error('[api] portal home', e)
    }
    this.loading = false
  },
  computed: {
    isStudent() {
      return getTier(this.session) === 'student'
    },
    isProfessorRole() {
      return (this.session.roles || []).includes('professor')
    },
    userDisplayName() {
      return getDisplayNameWithRole(this.session)
    },
    myCoursesTitle() {
      return this.isStudent ? '수강 중인 과목' : '담당 과목'
    },
    stats() {
      // 이수 학점은 학생 개념이라 학생이 아니면 보여주지 않는다
      // (교수/운영진/관리자 계정에 "이수 학점: 0"이 뜨던 걸 없앰).
      if (!this.isStudent) {
        return [
          { label: '담당 과목', value: this.myCourses.length },
          { label: '예정 상담', value: 0 }
        ]
      }
      return [
        { label: '이수 학점', value: this.completedCredits },
        { label: '진행중 과정', value: this.ongoingCount },
        { label: '예정 상담', value: 0 }
      ]
    }
  }
}
</script>

<template>
  <div class="dashboard">
    <aside class="profile-panel">
      <div class="profile-card">
        <span class="badge">HUSS</span>
        <p class="program-name">인문사회융합인재양성사업단</p>
        <h2 class="user-name">{{ userDisplayName }}</h2>
        <div class="stat-row">
          <div v-for="stat in stats" :key="stat.label" class="stat">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
      <div class="notif-list">
        <div v-for="item in notifications" :key="item.label" class="notif-pill">
          <span>{{ item.label }}</span>
          <span class="count" :class="{ zero: item.count === 0 }">{{ item.count }}</span>
        </div>
      </div>
    </aside>

    <section class="main-panel">
      <LoadingState v-if="loading" />
      <p v-if="loadError" class="load-error">{{ loadError }}</p>

      <template v-if="!loading">
      <h3>{{ myCoursesTitle }}</h3>
      <div class="course-grid">
        <router-link v-for="course in myCourses" :key="course.id" :to="`/portal/courses/${course.id}`" class="course-card">
          <span v-if="course.group" class="notice-tag">{{ course.group }}</span>
          <p class="course-title">{{ course.name }}</p>
          <p class="course-meta">{{ course.professor }} · {{ course.credit }}학점 · {{ course.semester }}</p>
          <span class="course-enter">강의실 입장 →</span>
        </router-link>
        <p v-if="!loading && !myCourses.length" class="course-empty">
          {{ isStudent ? '수강 중인 과목이 없습니다. 수강편람에서 과목을 신청해 보세요.' : '담당 중인 과목이 없습니다.' }}
        </p>
      </div>

      <h3>공지사항</h3>
      <ul class="notice-list">
        <li v-for="notice in notices" :key="notice.title">
          <span class="notice-tag">{{ notice.tag }}</span>
          <span class="notice-title">{{ notice.title }}</span>
          <span class="notice-date">{{ notice.date }}</span>
        </li>
        <li v-if="!notices.length" class="notice-empty">등록된 공지사항이 없습니다.</li>
      </ul>

      <template v-if="isStudent">
        <h3>추천 교과목·프로그램</h3>
        <div class="recommend-grid">
          <div v-for="item in recommendations" :key="item.title" class="recommend-card">
            <span class="notice-tag">{{ item.type }}</span>
            <p class="recommend-title">{{ item.title }}</p>
            <p class="recommend-reason">{{ item.reason }}</p>
          </div>
          <p v-if="!recommendations.length" class="course-empty">아직 추천 교과목이 없습니다.</p>
        </div>
      </template>

      <h3>바로가기</h3>
      <div class="quick-buttons">
        <router-link v-for="link in quickLinks" :key="link.label" :to="link.to" target="_blank" class="quick-btn">
          {{ link.label }}
        </router-link>
      </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
}

h3 {
  font-size: 15px;
  color: var(--color-muted);
  margin: 0 0 12px;
  font-weight: 700;
}

.profile-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-card {
  position: relative;
  background: linear-gradient(160deg, var(--color-primary-dark), var(--color-primary));
  color: #fff;
  border-radius: 16px;
  padding: 28px 24px;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  left: 24px;
  bottom: 0;
  width: 40px;
  height: 6px;
  background: var(--color-yellow);
}

.badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  padding: 4px 10px;
}

.program-name {
  font-size: 12px;
  opacity: 0.8;
  margin: 12px 0 4px;
}

.user-name {
  font-size: 22px;
  margin: 0 0 24px;
}

.stat-row {
  display: flex;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 16px;
}

.stat {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
}

.stat-label {
  font-size: 11px;
  opacity: 0.8;
  overflow-wrap: break-word;
}

.notif-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notif-pill {
  background: #fff;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.count {
  background: var(--color-primary);
  color: #fff;
  border-radius: 999px;
  min-width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  padding-inline: 6px;
}

.count.zero {
  background: #e5e5e5;
  color: var(--color-muted);
}

.main-panel {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
}

.load-error {
  margin: 0 0 20px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fdecea;
  color: #c0392b;
  font-size: 13px;
}

.notice-list {
  list-style: none;
  margin: 0 0 32px;
  padding: 0;
}

.notice-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 13px;
}

.notice-empty {
  color: var(--color-muted);
  padding: 10px 0;
}

.notice-tag {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--color-primary);
  background: var(--bg-soft);
  border-radius: 999px;
  padding: 2px 8px;
}

.notice-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-date {
  flex-shrink: 0;
  color: var(--color-muted);
  font-size: 12px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.course-card {
  position: relative;
  display: block;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 16px;
  overflow: hidden;
  background: #fff;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary);
}

.course-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 28px;
  height: 5px;
  background: var(--color-primary);
}

.course-title {
  font-size: 15px;
  font-weight: 700;
  margin: 10px 0 6px;
}

.course-meta {
  font-size: 12px;
  color: var(--color-muted);
  margin: 0 0 12px;
}

.course-enter {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary);
}

.course-empty {
  grid-column: 1 / -1;
  color: var(--color-muted);
  font-size: 13px;
  margin: 0;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.recommend-card {
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 16px;
  overflow: hidden;
}

.recommend-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 28px;
  height: 6px;
  background: var(--color-primary);
}

.recommend-title {
  font-size: 14px;
  font-weight: 700;
  margin: 10px 0 6px;
}

.recommend-reason {
  font-size: 12px;
  color: var(--color-muted);
  margin: 0;
  line-height: 1.5;
}

.quick-buttons {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.quick-btn {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 13px;
}

.quick-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

@media (max-width: 900px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
  .recommend-grid,
  .course-grid {
    grid-template-columns: 1fr;
  }
}
</style>
