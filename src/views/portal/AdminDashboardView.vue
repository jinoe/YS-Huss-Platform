<script>
import subjectApprovals from '../../data/subjectApprovals.js'
import counselingSessions from '../../data/counselingSessions.js'

const COUNSELING_TYPES = ['학업', '진로', '나노디그리', '비교과', '외국인 학생 지원']
const COUNSELING_STATUS_CLASS = { 예정: 'scheduled', 완료: 'completed', 취소: 'cancelled' }

const PAGE_VIEWS = [
  { label: '홈', views: 1240 },
  { label: '사업소개', views: 320 },
  { label: '교육과정', views: 540 },
  { label: '학생지원', views: 210 },
  { label: '성과공유', views: 180 },
  { label: '정보광장', views: 260 }
]

export default {
  name: 'AdminDashboardView',
  data() {
    return {
      approvals: subjectApprovals,
      sessions: counselingSessions,
      activeTab: 'subjects',
      tabs: [
        { key: 'subjects', label: '교과목 승인' },
        { key: 'counseling', label: '상담 관리' }
      ],
      nanodegreeRate: 42,
      pageViews: PAGE_VIEWS
    }
  },
  computed: {
    pendingApprovals() {
      return this.approvals.filter((item) => item.status === '승인대기')
    },
    activeSubjectCount() {
      return this.approvals.filter((item) => item.status === '운영중').length
    },
    pendingCount() {
      return this.pendingApprovals.length
    },
    counselingCompletionRate() {
      const cancelled = this.sessions.filter((s) => s.status === '취소').length
      const denom = this.sessions.length - cancelled
      const completed = this.sessions.filter((s) => s.status === '완료').length
      return denom ? Math.round((completed / denom) * 100) : 0
    },
    counselingStatusCounts() {
      return {
        scheduled: this.sessions.filter((s) => s.status === '예정').length,
        completed: this.sessions.filter((s) => s.status === '완료').length,
        cancelled: this.sessions.filter((s) => s.status === '취소').length
      }
    },
    avgSatisfaction() {
      const rated = this.sessions.filter((s) => s.status === '완료' && s.satisfaction)
      if (!rated.length) return '-'
      const avg = rated.reduce((sum, s) => sum + s.satisfaction, 0) / rated.length
      return avg.toFixed(1)
    },
    nanodegreeTrackBars() {
      return [
        { label: 'AI융합 나노디그리 이수율', percent: 67 },
        { label: '글로벌통상 나노디그리 이수율', percent: 33 }
      ]
    },
    counselingTypeBars() {
      const total = this.sessions.length || 1
      return COUNSELING_TYPES.map((type) => ({
        label: `${type} 상담 신청 비율`,
        percent: Math.round((this.sessions.filter((s) => s.type === type).length / total) * 100)
      }))
    },
    pageViewBars() {
      const max = Math.max(...this.pageViews.map((p) => p.views))
      return this.pageViews.map((p) => ({ label: p.label, percent: Math.round((p.views / max) * 100), views: p.views }))
    }
  },
  methods: {
    selectTab(key) {
      this.activeTab = key
    },
    approve(item) {
      item.status = '운영중'
    },
    reject(item) {
      item.status = '반려'
    },
    counselingStatusClass(status) {
      return COUNSELING_STATUS_CLASS[status] || ''
    },
    completeSession(session) {
      session.status = '완료'
    },
    cancelSession(session) {
      session.status = '취소'
    },
    generateReport() {
      const today = new Date().toISOString().slice(0, 10)
      const lines = [
        `HUSS 운영 리포트 (${today})`,
        '',
        `나노디그리 취득률: ${this.nanodegreeRate}%`,
        `상담 완료율: ${this.counselingCompletionRate}%`,
        `운영중 교과목: ${this.activeSubjectCount}건`,
        `승인대기: ${this.pendingCount}건`,
        '',
        '[승인대기 교과목]',
        ...(this.pendingApprovals.length
          ? this.pendingApprovals.map((a) => `- ${a.name} (${a.professor}, ${a.credit}학점, ${a.semester})`)
          : ['- 없음']),
        '',
        '[상담 현황]',
        `예정 ${this.counselingStatusCounts.scheduled}건 / 완료 ${this.counselingStatusCounts.completed}건 / 취소 ${this.counselingStatusCounts.cancelled}건`,
        `평균 만족도: ${this.avgSatisfaction}${this.avgSatisfaction !== '-' ? '/5' : ''}`,
        '',
        '[홈페이지 이용 현황]',
        ...this.pageViews.map((p) => `- ${p.label}: ${p.views.toLocaleString()}회`)
      ]
      const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `huss-report-${today}.txt`
      link.click()
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>관리자 대시보드</h3>

    <div class="kpi-grid">
      <div class="kpi-card">
        <span class="kpi-value">{{ nanodegreeRate }}%</span>
        <span class="kpi-label">나노디그리 취득률</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-value">{{ counselingCompletionRate }}%</span>
        <span class="kpi-label">상담 완료율</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-value">{{ activeSubjectCount }}</span>
        <span class="kpi-label">운영중 교과목</span>
      </div>
      <div class="kpi-card highlight">
        <span class="kpi-value">{{ pendingCount }}</span>
        <span class="kpi-label">승인대기 건수</span>
      </div>
    </div>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab"
        :class="{ active: tab.key === activeTab }"
        @click="selectTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <template v-if="activeTab === 'subjects'">
      <h4>승인대기 큐</h4>
      <table class="admin-table">
        <thead>
          <tr>
            <th>교과목명</th>
            <th>신청자</th>
            <th>학점</th>
            <th>학기</th>
            <th>신청일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pendingApprovals" :key="item.id">
            <td class="name">{{ item.name }}</td>
            <td>{{ item.professor }}</td>
            <td>{{ item.credit }}</td>
            <td>{{ item.semester }}</td>
            <td>{{ item.submittedAt }}</td>
            <td class="actions">
              <button type="button" class="btn-approve" @click="approve(item)">승인</button>
              <button type="button" class="btn-reject" @click="reject(item)">반려</button>
            </td>
          </tr>
          <tr v-if="!pendingApprovals.length">
            <td colspan="6" class="empty">승인 대기중인 교과목이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </template>

    <template v-else>
      <h4>상담 관리 (전체 학생)</h4>
      <table class="admin-table">
        <thead>
          <tr>
            <th>학생명</th>
            <th>유형</th>
            <th>날짜</th>
            <th>시간</th>
            <th>담당 교강사</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in sessions" :key="session.id">
            <td class="name">{{ session.studentName }}</td>
            <td>{{ session.type }}</td>
            <td>{{ session.date }}</td>
            <td>{{ session.time }}</td>
            <td>{{ session.counselor }}</td>
            <td><span class="status" :class="counselingStatusClass(session.status)">{{ session.status }}</span></td>
            <td class="actions">
              <template v-if="session.status === '예정'">
                <button type="button" class="btn-approve" @click="completeSession(session)">완료 처리</button>
                <button type="button" class="btn-reject" @click="cancelSession(session)">취소</button>
              </template>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <h4>운영 통계</h4>
    <div class="bar-list">
      <div v-for="bar in [...nanodegreeTrackBars, ...counselingTypeBars]" :key="bar.label" class="bar-row">
        <span class="bar-label">{{ bar.label }}</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: bar.percent + '%' }" />
        </div>
        <span class="bar-percent">{{ bar.percent }}%</span>
      </div>
    </div>

    <h4>홈페이지 이용 현황</h4>
    <div class="bar-list">
      <div v-for="bar in pageViewBars" :key="bar.label" class="bar-row">
        <span class="bar-label">{{ bar.label }}</span>
        <div class="bar-track">
          <div class="bar-fill views" :style="{ width: bar.percent + '%' }" />
        </div>
        <span class="bar-percent">{{ bar.views.toLocaleString() }}회</span>
      </div>
    </div>

    <div class="report-actions">
      <button type="button" class="btn-primary" @click="generateReport">리포트 생성</button>
    </div>
  </section>
</template>

<style scoped>
.page {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
}

h3 {
  font-size: 20px;
  margin: 0 0 20px;
}

h4 {
  font-size: 14px;
  color: var(--color-muted);
  margin: 32px 0 12px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.kpi-card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kpi-card.highlight {
  border-color: var(--color-accent);
  background: var(--bg-soft);
}

.kpi-value {
  font-size: 26px;
  font-weight: 800;
  color: var(--color-primary);
}

.kpi-label {
  font-size: 12px;
  color: var(--color-muted);
}

.tabs {
  display: flex;
  gap: 8px;
  margin-top: 28px;
  flex-wrap: wrap;
}

.tab {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 14px;
}

.tab.active {
  background: var(--color-text);
  border-color: var(--color-text);
  color: #fff;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.admin-table th {
  background: var(--bg-soft);
  padding: 12px 8px;
  border-bottom: 2px solid var(--color-text);
}

.admin-table td {
  padding: 12px 8px;
  border-bottom: 1px solid var(--color-border);
  text-align: center;
}

.admin-table td.name {
  text-align: left;
}

.admin-table .empty {
  padding: 40px 0;
  color: var(--color-muted);
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-approve {
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
}

.btn-reject {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: var(--color-muted);
}

.btn-reject:hover {
  border-color: #a33a3a;
  color: #a33a3a;
}

.status {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
  padding: 3px 10px;
}

.status.scheduled {
  background: var(--bg-soft);
  color: var(--color-primary);
}

.status.completed {
  background: var(--color-accent);
  color: #fff;
}

.status.cancelled {
  background: #f1e2e2;
  color: #a33a3a;
}

.bar-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bar-row {
  display: grid;
  grid-template-columns: 180px 1fr 60px;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.bar-label {
  color: var(--color-text);
}

.bar-track {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: var(--bg-soft);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 999px;
}

.bar-fill.views {
  background: var(--color-primary);
}

.bar-percent {
  text-align: right;
  color: var(--color-muted);
}

.report-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 28px;
}

.btn-primary {
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .admin-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  .bar-row {
    grid-template-columns: 100px 1fr 50px;
  }
  .bar-label {
    font-size: 11px;
  }
}
</style>
