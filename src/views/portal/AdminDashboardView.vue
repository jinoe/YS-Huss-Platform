<script>
import subjectApprovals from '../../data/subjectApprovals.js'
import counselingSessions from '../../data/counselingSessions.js'
import enrollments, { REGISTRATION_PERIOD_START, REGISTRATION_PERIOD_DAYS } from '../../data/enrollments.js'
import { joinedEnrollments } from '../../data/queries.js'

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
      enrollments,
      activeTab: 'subjects',
      tabs: [
        { key: 'subjects', label: '교과목 승인' },
        { key: 'counseling', label: '상담 관리' },
        { key: 'enrollments', label: '수강신청 내역' }
      ],
      selectedDate: REGISTRATION_PERIOD_START['2026-2'],
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
    registrationPeriodMin() {
      return REGISTRATION_PERIOD_START['2026-2']
    },
    registrationPeriodMax() {
      const d = new Date(`${REGISTRATION_PERIOD_START['2026-2']}T00:00:00`)
      d.setDate(d.getDate() + REGISTRATION_PERIOD_DAYS - 1)
      return d.toISOString().slice(0, 10)
    },
    dayEnrollments() {
      const list = this.enrollments.filter((e) => e.registeredAt === this.selectedDate)
      return joinedEnrollments(list)
    },
    universityBreakdown() {
      const counts = {}
      for (const e of this.dayEnrollments) {
        counts[e.universityLabel] = (counts[e.universityLabel] || 0) + 1
      }
      return Object.entries(counts).map(([label, count]) => ({ label, count }))
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
        { label: '인간중심 AI 미래경험 디자인 이수율', percent: 67 },
        { label: 'AX 라이프 혁신 디자인 이수율', percent: 33 }
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
    downloadDayEnrollmentsCsv() {
      const header = ['학기', '수강신청일', '소속 대학', '학생명', '학번', '학과', '교과목명', '담당교수', '상태']
      const rows = this.dayEnrollments.map((e) => [
        e.semester,
        e.registeredAt,
        e.universityLabel,
        e.studentName,
        e.studentNumber,
        e.department,
        e.courseName,
        e.courseProfessor,
        e.status
      ])
      const csv = [header, ...rows].map((row) => row.join(',')).join('\n')
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `수강신청내역_${this.selectedDate}.csv`
      link.click()
      URL.revokeObjectURL(url)
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

    <template v-else-if="activeTab === 'counseling'">
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

    <template v-else-if="activeTab === 'enrollments'">
      <h4>수강신청 내역 (날짜별 조회)</h4>
      <p class="enrollment-desc">타 대학에 전달할 일자별 수강신청 내역을 조회하고 CSV로 내려받습니다. 수강신청 기간: {{ registrationPeriodMin }} ~ {{ registrationPeriodMax }}</p>
      <div class="enrollment-toolbar">
        <label class="date-picker">
          <span>조회 날짜</span>
          <input type="date" v-model="selectedDate" :min="registrationPeriodMin" :max="registrationPeriodMax" />
        </label>
        <div class="university-breakdown">
          <span v-for="b in universityBreakdown" :key="b.label" class="breakdown-pill">{{ b.label }} {{ b.count }}건</span>
        </div>
        <span class="enrollment-count">총 {{ dayEnrollments.length }}건</span>
        <button type="button" class="btn-secondary" @click="downloadDayEnrollmentsCsv" :disabled="!dayEnrollments.length">CSV 다운로드</button>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            <th>학기</th>
            <th>소속 대학</th>
            <th>학생명</th>
            <th>학번</th>
            <th>학과</th>
            <th>교과목명</th>
            <th>담당교수</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in dayEnrollments" :key="e.id">
            <td>{{ e.semester }}</td>
            <td>{{ e.universityLabel }}</td>
            <td class="name">{{ e.studentName }}</td>
            <td>{{ e.studentNumber }}</td>
            <td>{{ e.department }}</td>
            <td>{{ e.courseName }}</td>
            <td>{{ e.courseProfessor }}</td>
            <td>{{ e.status }}</td>
          </tr>
          <tr v-if="!dayEnrollments.length">
            <td colspan="8" class="empty">선택한 날짜에 수강신청 내역이 없습니다.</td>
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
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
}

.kpi-card.highlight {
  border-color: var(--color-accent);
  background: var(--bg-soft);
}

.kpi-card.highlight::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 28px;
  height: 5px;
  background: var(--color-yellow);
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

.enrollment-desc {
  font-size: 13px;
  color: var(--color-muted);
  margin: -4px 0 16px;
}

.enrollment-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.date-picker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-muted);
  font-weight: 700;
}

.date-picker input {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 13px;
  font-family: inherit;
  color: var(--color-text);
}

.date-picker input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.university-breakdown {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.breakdown-pill {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  color: var(--color-muted);
}

.enrollment-count {
  font-size: 13px;
  color: var(--color-muted);
  margin-left: auto;
}

.btn-secondary {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-muted);
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
