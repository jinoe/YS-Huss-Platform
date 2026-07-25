<script>
import counselingSessions from '../../data/counselingSessions.js'
import session from '../../data/session.js'

const STATUS_CLASS = { 예정: 'scheduled', 완료: 'completed', 취소: 'cancelled' }

export default {
  name: 'CounselingView',
  data() {
    return {
      session,
      activeTab: session.role === 'professor' ? 'requests' : 'apply',
      expandedId: null,
      studentTabs: [
        { key: 'apply', label: '상담 신청' },
        { key: 'reservations', label: '내 예약 목록' },
        { key: 'history', label: '상담 이력' }
      ],
      professorTabs: [
        { key: 'requests', label: '상담 신청목록' },
        { key: 'history', label: '상담 이력' }
      ],
      counselingTypes: ['학업', '진로', '나노디그리', '비교과', '외국인 학생 지원'],
      counselors: ['김소영 교수', '전진호 교수', '정진경 교수'],
      sessions: counselingSessions,
      form: { type: '', counselor: '', date: '', time: '', memo: '' }
    }
  },
  computed: {
    isProfessor() {
      return this.session.role === 'professor'
    },
    tabs() {
      return this.isProfessor ? this.professorTabs : this.studentTabs
    },
    reservations() {
      return this.sessions.filter((s) => s.studentName === this.session.studentName)
    },
    history() {
      return this.reservations.filter((s) => s.status === '완료')
    },
    myRequests() {
      const counselorName = `${this.session.professorName} 교수`
      return this.sessions.filter((s) => s.counselor === counselorName && s.status === '예정')
    },
    myHistory() {
      const counselorName = `${this.session.professorName} 교수`
      return this.sessions.filter((s) => s.counselor === counselorName && s.status === '완료')
    }
  },
  watch: {
    'session.role'(role) {
      this.activeTab = role === 'professor' ? 'requests' : 'apply'
      this.expandedId = null
    }
  },
  methods: {
    selectTab(key) {
      this.activeTab = key
    },
    statusClass(status) {
      return STATUS_CLASS[status] || ''
    },
    satisfactionStars(n) {
      if (!n) return '-'
      return '★'.repeat(n) + '☆'.repeat(5 - n)
    },
    submitForm() {
      this.sessions.unshift({
        id: Date.now(),
        studentName: this.session.studentName,
        ...this.form,
        status: '예정',
        satisfaction: null
      })
      this.form = { type: '', counselor: '', date: '', time: '', memo: '' }
      this.activeTab = 'reservations'
    },
    cancelSession(session) {
      session.status = '취소'
    },
    completeSession(session) {
      session.status = '완료'
    },
    toggleDetail(session) {
      this.expandedId = this.expandedId === session.id ? null : session.id
    }
  }
}
</script>

<template>
  <section class="page">
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

    <template v-if="!isProfessor">
      <form v-if="activeTab === 'apply'" class="counsel-form" @submit.prevent="submitForm">
        <div class="form-grid">
          <div class="form-group">
            <label>상담 유형</label>
            <select v-model="form.type" required>
              <option value="" disabled>선택하세요</option>
              <option v-for="type in counselingTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>담당 교강사</label>
            <select v-model="form.counselor" required>
              <option value="" disabled>선택하세요</option>
              <option v-for="counselor in counselors" :key="counselor" :value="counselor">{{ counselor }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>희망 날짜</label>
            <input v-model="form.date" type="date" required />
          </div>
          <div class="form-group">
            <label>희망 시간</label>
            <input v-model="form.time" type="time" required />
          </div>
        </div>
        <div class="form-group">
          <label>상담 내용</label>
          <textarea v-model="form.memo" rows="4" placeholder="상담받고 싶은 내용을 간단히 작성해 주세요" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">신청하기</button>
        </div>
      </form>

      <table v-else-if="activeTab === 'reservations'" class="counsel-table">
        <thead>
          <tr>
            <th>유형</th>
            <th>날짜</th>
            <th>시간</th>
            <th>담당 교강사</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in reservations" :key="session.id">
            <td class="name">{{ session.type }}</td>
            <td>{{ session.date }}</td>
            <td>{{ session.time }}</td>
            <td>{{ session.counselor }}</td>
            <td><span class="status" :class="statusClass(session.status)">{{ session.status }}</span></td>
            <td>
              <button v-if="session.status === '예정'" type="button" class="btn-secondary" @click="cancelSession(session)">취소</button>
              <span v-else>-</span>
            </td>
          </tr>
          <tr v-if="!reservations.length">
            <td colspan="6" class="empty">예약 내역이 없습니다.</td>
          </tr>
        </tbody>
      </table>

      <table v-else class="counsel-table">
        <thead>
          <tr>
            <th>유형</th>
            <th>날짜</th>
            <th>시간</th>
            <th>담당 교강사</th>
            <th>만족도</th>
            <th>메모</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in history" :key="session.id">
            <td class="name">{{ session.type }}</td>
            <td>{{ session.date }}</td>
            <td>{{ session.time }}</td>
            <td>{{ session.counselor }}</td>
            <td class="stars">{{ satisfactionStars(session.satisfaction) }}</td>
            <td class="memo">{{ session.memo || '-' }}</td>
          </tr>
          <tr v-if="!history.length">
            <td colspan="6" class="empty">완료된 상담 이력이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </template>

    <template v-else>
      <table v-if="activeTab === 'requests'" class="counsel-table">
        <thead>
          <tr>
            <th>학생명</th>
            <th>유형</th>
            <th>날짜</th>
            <th>시간</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="session in myRequests" :key="session.id">
            <tr class="clickable-row" @click="toggleDetail(session)">
              <td class="name">{{ session.studentName }}</td>
              <td>{{ session.type }}</td>
              <td>{{ session.date }}</td>
              <td>{{ session.time }}</td>
              <td><span class="status" :class="statusClass(session.status)">{{ session.status }}</span></td>
              <td class="actions" @click.stop>
                <button type="button" class="btn-secondary" @click="completeSession(session)">완료 처리</button>
                <button type="button" class="btn-secondary" @click="cancelSession(session)">취소</button>
              </td>
            </tr>
            <tr v-if="expandedId === session.id" class="detail-row">
              <td colspan="6">
                <div class="detail-box">
                  <p class="detail-label">상담 신청 내용</p>
                  <p>{{ session.memo || '작성된 상담 내용이 없습니다.' }}</p>
                </div>
              </td>
            </tr>
          </template>
          <tr v-if="!myRequests.length">
            <td colspan="6" class="empty">들어온 상담 신청이 없습니다.</td>
          </tr>
        </tbody>
      </table>

      <table v-else class="counsel-table">
        <thead>
          <tr>
            <th>학생명</th>
            <th>유형</th>
            <th>날짜</th>
            <th>시간</th>
            <th>만족도</th>
            <th>상세</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="session in myHistory" :key="session.id">
            <tr class="clickable-row" @click="toggleDetail(session)">
              <td class="name">{{ session.studentName }}</td>
              <td>{{ session.type }}</td>
              <td>{{ session.date }}</td>
              <td>{{ session.time }}</td>
              <td class="stars">{{ satisfactionStars(session.satisfaction) }}</td>
              <td>{{ expandedId === session.id ? '숨기기' : '상세보기' }}</td>
            </tr>
            <tr v-if="expandedId === session.id" class="detail-row">
              <td colspan="6">
                <div class="detail-box">
                  <p class="detail-label">상담 메모</p>
                  <p>{{ session.memo || '작성된 메모가 없습니다.' }}</p>
                </div>
              </td>
            </tr>
          </template>
          <tr v-if="!myHistory.length">
            <td colspan="6" class="empty">완료된 상담 이력이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </template>
  </section>
</template>

<style scoped>
.page {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.form-group input,
.form-group select,
.form-group textarea {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text);
  background: #fff;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-accent);
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
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

.btn-secondary {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: var(--color-muted);
}

.btn-secondary:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.counsel-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.counsel-table th {
  background: var(--bg-soft);
  padding: 12px 8px;
  border-bottom: 2px solid var(--color-text);
}

.counsel-table td {
  padding: 12px 8px;
  border-bottom: 1px solid var(--color-border);
  text-align: center;
}

.counsel-table td.name {
  text-align: left;
}

.counsel-table td.memo {
  text-align: left;
  color: var(--color-muted);
}

.counsel-table .empty {
  padding: 40px 0;
  color: var(--color-muted);
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background: var(--bg-soft);
}

.detail-row td {
  background: var(--bg-soft);
  text-align: left;
}

.detail-box {
  padding: 8px 4px;
  font-size: 13px;
  line-height: 1.6;
}

.detail-label {
  margin: 0 0 4px;
  font-weight: 700;
  color: var(--color-muted);
  font-size: 12px;
}

.detail-box p:last-child {
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.stars {
  color: var(--color-yellow);
  letter-spacing: 1px;
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

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .counsel-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
