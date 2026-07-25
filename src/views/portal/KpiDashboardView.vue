<script>
import kpiIndicators, { KPI_UNIVERSITIES, KPI_YEARS } from '../../data/kpiIndicators.js'
import courses from '../../data/courses.js'
import { SEMESTERS } from '../../data/enrollments.js'
import { joinedEnrollments } from '../../data/queries.js'

const UNIVERSITY_LABELS = Object.fromEntries(KPI_UNIVERSITIES.map((u) => [u.key, u.label]))
const GROUP_COLORS = ['var(--color-primary)', 'var(--color-muted)', 'var(--color-yellow)', 'var(--color-border)']
const ENROLLMENT_PAGE_SIZE = 20

export default {
  name: 'KpiDashboardView',
  data() {
    return {
      universities: KPI_UNIVERSITIES,
      years: KPI_YEARS,
      selectedUniversity: 'yonsei',
      selectedYear: '1차년도',
      semesterOptions: SEMESTERS,
      enrollmentYear: '2026',
      enrollmentTerm: '2',
      enrollmentPage: 1,
      filterSchool: 'all',
      filterDept: 'all',
      filterCourse: 'all'
    }
  },
  computed: {
    universityLabel() {
      return UNIVERSITY_LABELS[this.selectedUniversity]
    },
    filteredIndicators() {
      return kpiIndicators.filter(
        (i) => i.university === this.selectedUniversity && i.year === this.selectedYear
      )
    },
    coreGroups() {
      return this.groupBy(this.filteredIndicators.filter((i) => i.category === '핵심'))
    },
    autonomousGroups() {
      return this.groupBy(this.filteredIndicators.filter((i) => i.category === '자율'))
    },
    enteredCount() {
      return this.filteredIndicators.filter((i) => i.actual != null).length
    },
    avgAchievementRate() {
      const rates = this.filteredIndicators
        .filter((i) => i.target != null && i.actual != null)
        .map((i) => (i.actual / i.target) * 100)
      if (!rates.length) return null
      return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
    },
    avgContribution() {
      const relevant = this.filteredIndicators.filter((i) => i.actual != null)
      if (!relevant.length) return null
      const rates = relevant.map((i) => {
        const sum = kpiIndicators
          .filter((k) => k.year === i.year && k.name === i.name && k.actual != null)
          .reduce((s, k) => s + k.actual, 0)
        return sum ? (i.actual / sum) * 100 : 0
      })
      return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
    },
    allEnrollments() {
      return joinedEnrollments()
    },
    enrollmentYearOptions() {
      return [...new Set(this.semesterOptions.map((s) => s.split('-')[0]))]
    },
    enrollmentSemester() {
      return `${this.enrollmentYear}-${this.enrollmentTerm}`
    },
    deptOptions() {
      const list = this.allEnrollments.filter((e) => this.filterSchool === 'all' || e.university === this.filterSchool)
      return [...new Set(list.map((e) => e.department))].sort()
    },
    courseOptions() {
      return courses.filter((c) => this.filterSchool === 'all' || c.university === this.filterSchool)
    },
    filteredEnrollments() {
      return this.allEnrollments.filter((e) => {
        if (e.semester !== this.enrollmentSemester) return false
        if (this.filterSchool !== 'all' && e.university !== this.filterSchool) return false
        if (this.filterDept !== 'all' && e.department !== this.filterDept) return false
        if (this.filterCourse !== 'all' && e.courseId !== Number(this.filterCourse)) return false
        return true
      })
    },
    enrollmentTotalPages() {
      return Math.max(1, Math.ceil(this.filteredEnrollments.length / ENROLLMENT_PAGE_SIZE))
    },
    pagedEnrollments() {
      const start = (this.enrollmentPage - 1) * ENROLLMENT_PAGE_SIZE
      return this.filteredEnrollments.slice(start, start + ENROLLMENT_PAGE_SIZE)
    }
  },
  watch: {
    enrollmentSemester() {
      this.enrollmentPage = 1
    },
    filterSchool() {
      this.enrollmentPage = 1
    },
    filterDept() {
      this.enrollmentPage = 1
    },
    filterCourse() {
      this.enrollmentPage = 1
    }
  },
  methods: {
    selectUniversity(key) {
      this.selectedUniversity = key
    },
    selectYear(year) {
      this.selectedYear = year
    },
    groupBy(list) {
      const order = []
      const map = {}
      for (const item of list) {
        if (!map[item.group]) {
          map[item.group] = []
          order.push(item.group)
        }
        map[item.group].push(item)
      }
      return order.map((group, index) => ({ group, items: map[group], color: GROUP_COLORS[index % GROUP_COLORS.length] }))
    },
    progressPercent(item) {
      if (item.target == null || item.actual == null) return 0
      return Math.min(100, Math.round((item.actual / item.target) * 100))
    },
    onFilterSchoolChange() {
      this.filterDept = 'all'
      this.filterCourse = 'all'
    },
    prevEnrollmentPage() {
      if (this.enrollmentPage > 1) this.enrollmentPage--
    },
    nextEnrollmentPage() {
      if (this.enrollmentPage < this.enrollmentTotalPages) this.enrollmentPage++
    },
    downloadDashboardCsv() {
      const header = ['대학', '연차', '구분', '그룹', '지표명', '단위', '목표', '실적']
      const rows = this.filteredIndicators.map((i) => [
        this.universityLabel,
        i.year,
        i.category,
        i.group,
        i.name,
        i.unit,
        i.target ?? '',
        i.actual ?? ''
      ])
      this.downloadCsv(`KPI_${this.universityLabel}_${this.selectedYear}.csv`, header, rows)
    },
    downloadEnrollmentCsv() {
      const header = ['학기', '이름', '학번', '소속 대학', '학과', '이메일', '연락처', '과목명', '담당교수', '학점', 'DIVE 단계', '상태']
      const rows = this.filteredEnrollments.map((e) => [
        e.semester,
        e.studentName,
        e.studentNumber,
        e.universityLabel,
        e.department,
        e.email,
        e.phone,
        e.courseName,
        e.courseProfessor,
        e.courseCredit,
        e.courseMethod,
        e.status
      ])
      this.downloadCsv('수강신청_현황.csv', header, rows)
    },
    downloadCsv(filename, header, rows) {
      const csv = [header, ...rows].map((row) => row.join(',')).join('\n')
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<template>
  <section class="page">
    <div class="kpi-layout">
      <aside class="uni-list">
        <button
          v-for="uni in universities"
          :key="uni.key"
          type="button"
          class="uni-item"
          :class="{ active: uni.key === selectedUniversity }"
          @click="selectUniversity(uni.key)"
        >
          {{ uni.label }}
        </button>
      </aside>

      <div class="kpi-main">
        <div class="kpi-header">
          <div>
            <h2>{{ universityLabel }}</h2>
            <p class="subtitle">대학별 목표 대비 달성 현황 및 컨소시엄 기여도</p>
          </div>
          <button type="button" class="btn-secondary" @click="downloadDashboardCsv">대시보드 CSV 다운로드</button>
        </div>

        <div class="tabs">
          <button
            v-for="year in years"
            :key="year"
            type="button"
            class="tab"
            :class="{ active: year === selectedYear }"
            @click="selectYear(year)"
          >
            {{ year }}
          </button>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <span class="summary-label">평균 달성률</span>
            <span class="summary-value">{{ avgAchievementRate != null ? avgAchievementRate + '%' : '—' }}</span>
            <span class="summary-sub">목표 설정 지표 {{ filteredIndicators.filter((i) => i.target != null).length }}개 기준</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">실적 항목</span>
            <span class="summary-value">{{ enteredCount }}</span>
            <span class="summary-sub">누적 입력 건수</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">평균 기여도</span>
            <span class="summary-value">{{ avgContribution != null ? avgContribution + '%' : '—' }}</span>
            <span class="summary-sub">합산형 지표의 종합 대비 비중</span>
          </div>
        </div>

        <template v-for="section in [{ title: '핵심 성과지표', groups: coreGroups }, { title: '자율 성과지표', groups: autonomousGroups }]" :key="section.title">
          <h3>{{ section.title }}</h3>
          <div v-for="g in section.groups" :key="g.group" class="indicator-group">
            <p class="group-title"><span class="dot" :style="{ background: g.color }" />{{ g.group }}</p>
            <div class="indicator-grid">
              <div v-for="item in g.items" :key="item.id" class="indicator-card">
                <div class="indicator-head">
                  <span class="indicator-name">{{ item.name }}</span>
                  <span class="indicator-unit">{{ item.unit }}</span>
                </div>
                <div class="indicator-status">
                  <span>{{ item.actual != null ? `실적 ${item.actual}` : '실적 입력 전' }} / 목표 {{ item.target != null ? item.target + item.unit : '—' }}</span>
                  <span class="indicator-value">{{ item.actual != null ? item.actual + item.unit : '—' }}</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" :style="{ width: progressPercent(item) + '%' }" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="enrollment-section">
      <h3>수강신청 현황</h3>
      <p class="section-desc">수강신청(students × courses) 테이블을 학생 인적사항·강좌정보와 조인한 전체 목록입니다.</p>
      <div class="filter-row">
        <select v-model="enrollmentYear">
          <option v-for="y in enrollmentYearOptions" :key="y" :value="y">{{ y }}년</option>
        </select>
        <select v-model="enrollmentTerm">
          <option value="1">1학기</option>
          <option value="2">2학기</option>
        </select>
        <select v-model="filterSchool" @change="onFilterSchoolChange">
          <option value="all">학교 전체</option>
          <option v-for="uni in universities" :key="uni.key" :value="uni.key">{{ uni.label }}</option>
        </select>
        <select v-model="filterDept">
          <option value="all">학과 전체</option>
          <option v-for="dept in deptOptions" :key="dept" :value="dept">{{ dept }}</option>
        </select>
        <select v-model="filterCourse">
          <option value="all">과목 전체</option>
          <option v-for="course in courseOptions" :key="course.id" :value="course.id">{{ course.name }}</option>
        </select>
        <button type="button" class="btn-primary" @click="downloadEnrollmentCsv" :disabled="!filteredEnrollments.length">
          CSV 다운로드 (전체 {{ filteredEnrollments.length }}건)
        </button>
      </div>
      <table class="enrollment-table">
        <thead>
          <tr>
            <th>학기</th>
            <th>이름</th>
            <th>학번</th>
            <th>소속 대학</th>
            <th>학과</th>
            <th>과목명</th>
            <th>담당교수</th>
            <th>학점</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in pagedEnrollments" :key="e.id">
            <td>{{ e.semester }}</td>
            <td class="name">{{ e.studentName }}</td>
            <td>{{ e.studentNumber }}</td>
            <td>{{ e.universityLabel }}</td>
            <td>{{ e.department }}</td>
            <td>{{ e.courseName }}</td>
            <td>{{ e.courseProfessor }}</td>
            <td>{{ e.courseCredit }}</td>
            <td>{{ e.status }}</td>
          </tr>
          <tr v-if="!filteredEnrollments.length">
            <td colspan="9" class="empty">조건에 해당하는 수강 기록이 없습니다.</td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredEnrollments.length" class="pagination">
        <button type="button" class="btn-secondary" :disabled="enrollmentPage === 1" @click="prevEnrollmentPage">이전</button>
        <span class="pagination-info">{{ enrollmentPage }} / {{ enrollmentTotalPages }} 페이지 (전체 {{ filteredEnrollments.length }}건)</span>
        <button type="button" class="btn-secondary" :disabled="enrollmentPage === enrollmentTotalPages" @click="nextEnrollmentPage">다음</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.kpi-layout {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
}

.uni-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-right: 1px solid var(--color-border);
  padding-right: 16px;
}

.uni-item {
  text-align: left;
  border: none;
  background: transparent;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--color-muted);
}

.uni-item.active {
  background: var(--bg-soft);
  color: var(--color-primary);
  font-weight: 700;
}

.kpi-main {
  min-width: 0;
}

.kpi-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.kpi-header h2 {
  margin: 0 0 4px;
  font-size: 24px;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--color-muted);
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
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

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.summary-card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 12px;
  color: var(--color-muted);
}

.summary-value {
  font-size: 26px;
  font-weight: 800;
  color: var(--color-primary);
}

.summary-sub {
  font-size: 11px;
  color: var(--color-muted);
}

h3 {
  font-size: 18px;
  margin: 24px 0 12px;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 12px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.indicator-group {
  margin-bottom: 24px;
}

.indicator-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.indicator-card {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 14px 16px;
}

.indicator-head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
}

.indicator-unit {
  color: var(--color-muted);
  font-weight: 400;
}

.indicator-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: var(--color-muted);
  margin-bottom: 8px;
}

.indicator-value {
  font-size: 14px;
  font-weight: 800;
  color: var(--color-text);
}

.progress-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: var(--bg-soft);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 999px;
}

.enrollment-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
}

.section-desc {
  margin: -8px 0 16px;
  font-size: 12px;
  color: var(--color-muted);
}

.filter-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.filter-row select {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  color: var(--color-text);
  background: #fff;
}

.btn-primary {
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 700;
  margin-left: auto;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  color: var(--color-muted);
  flex-shrink: 0;
}

.btn-secondary:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.enrollment-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.enrollment-table th {
  background: var(--bg-soft);
  padding: 10px 8px;
  border-bottom: 2px solid var(--color-text);
}

.enrollment-table td {
  padding: 10px 8px;
  border-bottom: 1px solid var(--color-border);
  text-align: center;
}

.enrollment-table td.name {
  font-weight: 600;
}

.enrollment-table .empty {
  padding: 30px 0;
  color: var(--color-muted);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.pagination-info {
  font-size: 12px;
  color: var(--color-muted);
}

@media (max-width: 900px) {
  .kpi-layout {
    grid-template-columns: 1fr;
  }
  .uni-list {
    flex-direction: row;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    padding-right: 0;
    padding-bottom: 12px;
  }
}

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
  .indicator-grid {
    grid-template-columns: 1fr;
  }
  .enrollment-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
