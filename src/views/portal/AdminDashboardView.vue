<script>
import LoadingState from '../../components/portal/LoadingState.vue'
import AlertModal from '../../components/portal/AlertModal.vue'
import * as adminApi from '../../api/admin.js'

export default {
  name: 'AdminDashboardView',
  components: { LoadingState, AlertModal },
  data() {
    return {
      pendingApprovals: [],
      activeCount: 0,
      loading: true,
      loadError: '',
      actionError: '',
      pendingActionIds: new Set(),
      activeTab: 'subjects',
      tabs: [
        { key: 'subjects', label: '교과목 승인' },
        { key: 'counseling', label: '상담 관리' },
        { key: 'enrollments', label: '수강신청 내역' }
      ]
    }
  },
  computed: {
    pendingCount() {
      return this.pendingApprovals.length
    }
  },
  async created() {
    await this.loadOfferings()
  },
  methods: {
    selectTab(key) {
      this.activeTab = key
    },
    async loadOfferings() {
      this.loading = true
      this.loadError = ''
      try {
        const [pending, active] = await Promise.all([
          adminApi.pendingOfferings(),
          adminApi.activeOfferings()
        ])
        this.pendingApprovals = pending
        this.activeCount = active.length
      } catch (e) {
        this.loadError = '교과목 승인 현황을 불러오지 못했습니다.'
        console.error('[api] admin offerings', e)
      }
      this.loading = false
    },
    isPending(id) {
      return this.pendingActionIds.has(id)
    },
    async approve(item) {
      if (this.isPending(item.id)) return
      this.pendingActionIds.add(item.id)
      this.actionError = ''
      try {
        await adminApi.approveOffering(item.id)
        await this.loadOfferings()
      } catch (e) {
        this.actionError = '승인에 실패했습니다.'
        console.error('[api] admin.approveOffering', e)
      }
      this.pendingActionIds.delete(item.id)
    },
    async reject(item) {
      if (this.isPending(item.id)) return
      this.pendingActionIds.add(item.id)
      this.actionError = ''
      try {
        await adminApi.rejectOffering(item.id, '관리자 반려')
        await this.loadOfferings()
      } catch (e) {
        this.actionError = '반려에 실패했습니다.'
        console.error('[api] admin.rejectOffering', e)
      }
      this.pendingActionIds.delete(item.id)
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>관리자 대시보드</h3>

    <LoadingState v-if="loading" />
    <p v-if="!loading && loadError" class="load-error">{{ loadError }}</p>
    <AlertModal :message="actionError" @close="actionError = ''" />

    <template v-if="!loading">
    <div class="kpi-grid">
      <!-- 나노디그리 취득률·상담 완료율: 백엔드에 디그리 이수판정·상담 API가 없어 빈 값으로 둔다. -->
      <div class="kpi-card">
        <span class="kpi-value">—</span>
        <span class="kpi-label">나노디그리 취득률</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-value">—</span>
        <span class="kpi-label">상담 완료율</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-value">{{ activeCount }}</span>
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
            <td>{{ item.submittedAt ? item.submittedAt.slice(0, 10) : '-' }}</td>
            <td class="actions">
              <button type="button" class="btn-approve" :disabled="isPending(item.id)" @click="approve(item)">승인</button>
              <button type="button" class="btn-reject" :disabled="isPending(item.id)" @click="reject(item)">반려</button>
            </td>
          </tr>
          <tr v-if="!loading && !pendingApprovals.length">
            <td colspan="6" class="empty">승인 대기중인 교과목이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </template>

    <!-- 상담 관리: 백엔드에 상담 API가 아직 없어 빈 상태만 표시한다. -->
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
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="6" class="empty">상담 관리 기능은 아직 백엔드와 연동되지 않았습니다.</td>
          </tr>
        </tbody>
      </table>
    </template>

    <!-- 수강신청 내역: 전체 학생·전 대학 수강신청을 날짜별로 모아 보는 관리자 전용 API가 아직 없어 빈 상태만 표시한다. -->
    <template v-else-if="activeTab === 'enrollments'">
      <h4>수강신청 내역 (날짜별 조회)</h4>
      <p class="enrollment-desc">타 대학에 전달할 일자별 수강신청 내역을 조회하고 CSV로 내려받는 기능입니다.</p>
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
          <tr>
            <td colspan="8" class="empty">전체 수강신청 내역 조회 기능은 아직 백엔드와 연동되지 않았습니다.</td>
          </tr>
        </tbody>
      </table>
    </template>

    <!--
      운영 통계(나노디그리 이수율·상담 유형 비율)와 홈페이지 이용 현황: 대응하는 백엔드 데이터가
      전혀 없어 주석 처리. 실데이터가 생기면 복원.

    <h4>운영 통계</h4>
    ...
    <h4>홈페이지 이용 현황</h4>
    ...
    -->
    </template>
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

.load-error {
  margin: 0 0 16px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fdecea;
  color: #c0392b;
  font-size: 13px;
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

.btn-approve:disabled,
.btn-reject:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.enrollment-desc {
  font-size: 13px;
  color: var(--color-muted);
  margin: -4px 0 16px;
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
}
</style>
