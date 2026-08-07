<script>
import { KPI_UNIVERSITIES, KPI_YEARS } from '../../data/kpiIndicators.js'
import LoadingState from '../../components/portal/LoadingState.vue'
import * as kpiApi from '../../api/kpi.js'

const UNIVERSITY_LABELS = Object.fromEntries(KPI_UNIVERSITIES.map((u) => [u.key, u.label]))
const GROUP_COLORS = ['var(--color-primary)', 'var(--color-muted)', 'var(--color-yellow)', 'var(--color-border)']

export default {
  name: 'KpiDashboardView',
  components: { LoadingState },
  data() {
    return {
      universities: KPI_UNIVERSITIES,
      years: KPI_YEARS,
      selectedUniversity: 'yonsei',
      selectedYear: '1차년도',
      indicators: [],
      loading: true,
      loadError: ''
    }
  },
  computed: {
    universityLabel() {
      return UNIVERSITY_LABELS[this.selectedUniversity]
    },
    coreGroups() {
      return this.groupBy(this.indicators.filter((i) => i.category === '핵심'))
    },
    autonomousGroups() {
      return this.groupBy(this.indicators.filter((i) => i.category === '자율'))
    },
    enteredCount() {
      return this.indicators.filter((i) => i.actual != null).length
    },
    avgAchievementRate() {
      const rates = this.indicators
        .filter((i) => i.target != null && i.actual != null)
        .map((i) => (i.actual / i.target) * 100)
      if (!rates.length) return null
      return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
    }
  },
  created() {
    this.syncKpiSnapshots()
  },
  methods: {
    selectUniversity(key) {
      this.selectedUniversity = key
      this.syncKpiSnapshots()
    },
    selectYear(year) {
      this.selectedYear = year
      this.syncKpiSnapshots()
    },
    async syncKpiSnapshots() {
      this.loading = true
      this.loadError = ''
      const yearNo = this.years.indexOf(this.selectedYear) + 1
      try {
        this.indicators = await kpiApi.snapshots({ university: this.selectedUniversity, year: yearNo })
      } catch (e) {
        // 학생 계정은 백엔드가 403을 준다(KPI는 교수/관리자 전용) — 그런 경우도 메시지로 안내한다.
        this.loadError =
          e?.response?.status === 403
            ? 'KPI는 교수·관리자 계정만 열람할 수 있습니다.'
            : 'KPI 데이터를 불러오지 못했습니다.'
        this.indicators = []
        console.error('[api] kpi.snapshots', e)
      }
      this.loading = false
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
    downloadDashboardCsv() {
      const header = ['대학', '연차', '구분', '그룹', '지표명', '단위', '목표', '실적']
      const rows = this.indicators.map((i) => [
        this.universityLabel,
        i.year,
        i.category,
        i.group,
        i.name,
        i.unit,
        i.target ?? '',
        i.actual ?? ''
      ])
      const csv = [header, ...rows].map((row) => row.join(',')).join('\n')
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `KPI_${this.universityLabel}_${this.selectedYear}.csv`
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
            <p class="subtitle">대학별 목표 대비 달성 현황</p>
          </div>
          <button type="button" class="btn-secondary" @click="downloadDashboardCsv" :disabled="!indicators.length">대시보드 CSV 다운로드</button>
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

        <LoadingState v-if="loading" />
        <p v-if="!loading && loadError" class="load-error">{{ loadError }}</p>

        <template v-if="!loading && !loadError">
          <div class="summary-grid">
            <div class="summary-card">
              <span class="summary-label">평균 달성률</span>
              <span class="summary-value">{{ avgAchievementRate != null ? avgAchievementRate + '%' : '—' }}</span>
              <span class="summary-sub">목표 설정 지표 {{ indicators.filter((i) => i.target != null).length }}개 기준</span>
            </div>
            <div class="summary-card">
              <span class="summary-label">실적 입력 항목</span>
              <span class="summary-value">{{ enteredCount }}</span>
              <span class="summary-sub">전체 {{ indicators.length }}개 지표 중</span>
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
        </template>
      </div>
    </div>

    <!--
      수강신청 현황(전체 학생 목록): 전 대학·전체 학생의 수강신청 내역을 한 번에 조회하는 관리자용
      API가 아직 없어 주석 처리. 실데이터가 생기면 복원.
    -->
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

.load-error {
  margin: 0 0 16px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fdecea;
  color: #c0392b;
  font-size: 13px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
}
</style>
