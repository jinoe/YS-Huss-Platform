<script>
import LoadingState from '../../components/portal/LoadingState.vue'
import AlertModal from '../../components/portal/AlertModal.vue'
import * as professorApi from '../../api/professor.js'

const STATUS_LABELS = {
  draft: '초안',
  pending: '승인대기',
  approved: '승인됨(운영대기)',
  rejected: '반려',
  active: '운영중',
  closed: '종료',
  archived: '보관됨'
}
const STATUS_CLASS = {
  pending: 'pending',
  active: 'active',
  rejected: 'rejected'
}

export default {
  name: 'SubjectManagementView',
  components: { LoadingState, AlertModal },
  data() {
    return {
      subjects: [],
      loading: true,
      loadError: '',
      actionError: '',
      submitting: false,
      editingId: null,
      form: { name: '', type: '공통교과', credit: 3, semester: '2026-2', capacity: 30, waitlistCapacity: 0, intro: '' }
    }
  },
  async created() {
    await this.loadSubjects()
  },
  methods: {
    async loadSubjects() {
      this.loading = true
      this.loadError = ''
      try {
        this.subjects = await professorApi.myOfferings()
      } catch (e) {
        this.loadError = '담당 과목을 불러오지 못했습니다.'
        console.error('[api] professor.myOfferings', e)
      }
      this.loading = false
    },
    statusLabel(status) {
      return STATUS_LABELS[status] || status
    },
    statusClass(status) {
      return STATUS_CLASS[status] || ''
    },
    resetForm() {
      this.editingId = null
      this.form = { name: '', type: '공통교과', credit: 3, semester: '2026-2', capacity: 30, waitlistCapacity: 0, intro: '' }
    },
    editSubject(item) {
      this.editingId = item.id
      this.form = {
        name: item.name,
        type: '공통교과',
        credit: item.credit,
        semester: item.semester,
        capacity: item.capacity ?? 30,
        waitlistCapacity: item.waitlistCapacity ?? 0,
        intro: ''
      }
    },
    async submitForm() {
      if (this.submitting) return
      this.submitting = true
      this.actionError = ''
      try {
        if (this.editingId !== null) {
          await professorApi.updateOffering(this.editingId, {
            capacity: this.form.capacity,
            waitlist_capacity: this.form.waitlistCapacity
          })
        } else {
          await professorApi.createOffering({
            name_ko: this.form.name,
            term_code: this.form.semester,
            credit: this.form.credit,
            capacity: this.form.capacity,
            waitlist_capacity: this.form.waitlistCapacity,
            category: this.form.type,
            description: this.form.intro || null
          })
        }
        await this.loadSubjects()
        this.resetForm()
      } catch (e) {
        this.actionError = this.editingId !== null ? '수정에 실패했습니다.' : '등록에 실패했습니다.'
        console.error('[api] professor offering submit', e)
      }
      this.submitting = false
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>담당 과목</h3>
    <LoadingState v-if="loading" />
    <p v-if="!loading && loadError" class="load-error">{{ loadError }}</p>
    <AlertModal :message="actionError" @close="actionError = ''" />
    <table v-if="!loading" class="subject-mgmt-table">
      <thead>
        <tr>
          <th>교과목명</th>
          <th>학점</th>
          <th>학기</th>
          <th>정원</th>
          <th>대기정원</th>
          <th>상태</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in subjects" :key="item.id">
          <td class="name">{{ item.name }}</td>
          <td>{{ item.credit }}</td>
          <td>{{ item.semester }}</td>
          <td>{{ item.capacity ?? '-' }}</td>
          <td>{{ item.waitlistTaken ?? 0 }}/{{ item.waitlistCapacity ?? 0 }}</td>
          <td><span class="status" :class="statusClass(item.status)">{{ statusLabel(item.status) }}</span></td>
          <td class="actions">
            <button type="button" class="btn-edit" @click="editSubject(item)">수정</button>
          </td>
        </tr>
        <tr v-if="!loading && !subjects.length">
          <td colspan="7" class="empty">등록된 교과목이 없습니다.</td>
        </tr>
      </tbody>
    </table>
    <!-- 삭제: 백엔드에 개설 삭제 API가 없어 버튼을 두지 않는다(있으면 눌러도 실제로 아무 일도 안 일어나는 더미가 됨). -->

    <h3>{{ editingId !== null ? '교과목 수정' : '교과목 등록' }}</h3>
    <form class="subject-form" @submit.prevent="submitForm">
      <div class="form-grid">
        <div class="form-group">
          <label>교과목명</label>
          <input v-model="form.name" type="text" placeholder="예: 이야기로 미래읽기" required :disabled="editingId !== null" />
        </div>
        <div class="form-group">
          <label>학점</label>
          <select v-model.number="form.credit" :disabled="editingId !== null">
            <option :value="1">1학점</option>
            <option :value="2">2학점</option>
            <option :value="3">3학점</option>
          </select>
        </div>
        <div class="form-group">
          <label>학기</label>
          <input v-model="form.semester" type="text" placeholder="예: 2026-2" required :disabled="editingId !== null" />
        </div>
        <div class="form-group">
          <label>정원</label>
          <input v-model.number="form.capacity" type="number" min="1" required />
        </div>
        <div class="form-group">
          <label>대기정원</label>
          <input v-model.number="form.waitlistCapacity" type="number" min="0" />
        </div>
      </div>
      <div class="form-group">
        <label>과목 소개</label>
        <textarea v-model="form.intro" rows="3" placeholder="과목 개요를 간단히 작성해 주세요" :disabled="editingId !== null" />
      </div>
      <div class="form-actions">
        <button v-if="editingId !== null" type="button" class="btn-delete" :disabled="submitting" @click="resetForm">취소</button>
        <button type="submit" class="btn-primary" :disabled="submitting">{{ submitting ? '처리 중...' : (editingId !== null ? '정원 수정하기' : '등록하기') }}</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.page {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
}

h3 {
  font-size: 18px;
  margin: 0 0 16px;
}

h3 + .subject-form {
  margin-top: 0;
}

.load-error {
  margin: 0 0 16px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fdecea;
  color: #c0392b;
  font-size: 13px;
}

.subject-mgmt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-bottom: 40px;
}

.subject-mgmt-table th {
  background: var(--bg-soft);
  padding: 12px 8px;
  border-bottom: 2px solid var(--color-text);
}

.subject-mgmt-table td {
  padding: 12px 8px;
  border-bottom: 1px solid var(--color-border);
  text-align: center;
}

.subject-mgmt-table td.name {
  text-align: left;
}

.subject-mgmt-table .empty {
  padding: 40px 0;
  color: var(--color-muted);
}

.status {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
  padding: 3px 10px;
}

.status.pending {
  background: var(--bg-soft);
  color: var(--color-primary);
}

.status.active {
  background: var(--color-accent);
  color: #fff;
}

.status.rejected {
  background: #f1e2e2;
  color: #a33a3a;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-edit {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: var(--color-muted);
}

.btn-edit:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.btn-delete {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: var(--color-muted);
}

.btn-delete:hover {
  border-color: #a33a3a;
  color: #a33a3a;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

.btn-primary:disabled,
.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .subject-mgmt-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
