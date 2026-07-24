<script>
import counselingSessions from '../../data/counselingSessions.js'
import notices from '../../data/notices.js'
import { CURRENT_STUDENT } from '../../data/currentUser.js'

export default {
  name: 'PortalHomeView',
  data() {
    return {
      stats: [
        { label: '이수 학점', value: 12 },
        { label: '진행중 과정', value: 2 },
        { label: '예정 상담', value: 1 }
      ],
      notices: [
        { tag: '학사', title: '2026학년도 2학기 마이크로디그리 신청 안내', date: '2026-07-20' },
        { tag: '상담', title: '학사지도 상담 예약 시스템 오픈 안내', date: '2026-07-15' },
        { tag: '전체', title: 'HUSS 포탈 베타 오픈 안내', date: '2026-07-10' }
      ],
      quickLinks: [
        { label: '공지사항', to: '/bulletin' },
        { label: '자료실', to: '/bulletin' },
        { label: 'FAQ', to: '/bulletin' },
        { label: '사업단 홈페이지', to: '/' }
      ],
      recommendations: [
        { title: 'AI Motion and Visual Narratives', type: '교과목', reason: '인간중심 AI 미래경험 디자인 트랙을 이수 중인 회원님께 추천합니다.' },
        { title: 'AI 해커톤', type: '비교과', reason: '최근 참여 이력을 기반으로 추천합니다.' },
        { title: 'Future Life UX Design', type: '교과목', reason: 'AX 라이프 혁신 디자인 트랙에 관심 있는 학생에게 추천합니다.' }
      ]
    }
  },
  computed: {
    notifications() {
      const upcomingCounseling = counselingSessions.filter(
        (s) => s.studentName === CURRENT_STUDENT && s.status === '예정'
      ).length
      const recentNotices = notices.filter((n) => n.date >= '2026-07-01').length
      return [
        { label: '학사 알림', count: 0 },
        { label: '상담 예약 알림', count: upcomingCounseling },
        { label: '신규 공지', count: recentNotices }
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
        <h2 class="user-name">이진호 님</h2>
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
      <h3>공지사항</h3>
      <ul class="notice-list">
        <li v-for="notice in notices" :key="notice.title">
          <span class="notice-tag">{{ notice.tag }}</span>
          <span class="notice-title">{{ notice.title }}</span>
          <span class="notice-date">{{ notice.date }}</span>
        </li>
      </ul>

      <h3>추천 교과목·프로그램</h3>
      <div class="recommend-grid">
        <div v-for="item in recommendations" :key="item.title" class="recommend-card">
          <span class="notice-tag">{{ item.type }}</span>
          <p class="recommend-title">{{ item.title }}</p>
          <p class="recommend-reason">{{ item.reason }}</p>
        </div>
      </div>

      <h3>바로가기</h3>
      <div class="quick-buttons">
        <router-link v-for="link in quickLinks" :key="link.label" :to="link.to" target="_blank" class="quick-btn">
          {{ link.label }}
        </router-link>
      </div>
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

.notice-list {
  list-style: none;
  margin: 0;
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
  height: 5px;
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
  .recommend-grid {
    grid-template-columns: 1fr;
  }
}
</style>
