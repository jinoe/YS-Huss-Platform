<script>
import subjectApprovals from '../../data/subjectApprovals.js'

const STATUS_CLASS = { 승인대기: 'pending', 운영중: 'active', 반려: 'rejected' }

export default {
  name: 'SubjectManagementView',
  data() {
    return {
      subjects: subjectApprovals,
      editingId: null,
      form: { name: '', type: '전공', credit: 3, semester: '2026-2', capacity: 30, intro: '' }
    }
  },
  methods: {
    statusClass(status) {
      return STATUS_CLASS[status] || ''
    },
    resetForm() {
      this.editingId = null
      this.form = { name: '', type: '전공', credit: 3, semester: '2026-2', capacity: 30, intro: '' }
    },
    editSubject(item) {
      this.editingId = item.id
      this.form = {
        name: item.name,
        type: item.type,
        credit: item.credit,
        semester: item.semester,
        capacity: item.capacity ?? 30,
        intro: item.intro ?? ''
      }
    },
    submitForm() {
      if (this.editingId !== null) {
        const item = this.subjects.find((s) => s.id === this.editingId)
        if (item) Object.assign(item, this.form)
      } else {
        this.subjects.push({
          id: Date.now(),
          professor: '이진호',
          submittedAt: new Date().toISOString().slice(0, 10),
          status: '승인대기',
          ...this.form
        })
      }
      this.resetForm()
    },
    removeSubject(item) {
      if (!window.confirm(`'${item.name}' 과목을 삭제할까요?`)) return
      const index = this.subjects.findIndex((s) => s.id === item.id)
      if (index !== -1) this.subjects.splice(index, 1)
      if (this.editingId === item.id) this.resetForm()
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>담당 과목</h3>
    <table class="subject-mgmt-table">
      <thead>
        <tr>
          <th>교과목명</th>
          <th>구분</th>
          <th>학점</th>
          <th>학기</th>
          <th>정원</th>
          <th>상태</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in subjects" :key="item.id">
          <td class="name">{{ item.name }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.credit }}</td>
          <td>{{ item.semester }}</td>
          <td>{{ item.capacity ?? '-' }}</td>
          <td><span class="status" :class="statusClass(item.status)">{{ item.status }}</span></td>
          <td class="actions">
            <button type="button" class="btn-edit" @click="editSubject(item)">수정</button>
            <button type="button" class="btn-delete" @click="removeSubject(item)">삭제</button>
          </td>
        </tr>
        <tr v-if="!subjects.length">
          <td colspan="7" class="empty">등록된 교과목이 없습니다.</td>
        </tr>
      </tbody>
    </table>

    <h3>{{ editingId !== null ? '교과목 수정' : '교과목 등록' }}</h3>
    <form class="subject-form" @submit.prevent="submitForm">
      <div class="form-grid">
        <div class="form-group">
          <label>교과목명</label>
          <input v-model="form.name" type="text" placeholder="예: 이야기로 미래읽기" required />
        </div>
        <div class="form-group">
          <label>구분</label>
          <select v-model="form.type">
            <option value="전공">전공</option>
            <option value="교양">교양</option>
          </select>
        </div>
        <div class="form-group">
          <label>학점</label>
          <select v-model.number="form.credit">
            <option :value="1">1학점</option>
            <option :value="2">2학점</option>
            <option :value="3">3학점</option>
          </select>
        </div>
        <div class="form-group">
          <label>학기</label>
          <input v-model="form.semester" type="text" placeholder="예: 2026-2" required />
        </div>
        <div class="form-group">
          <label>정원</label>
          <input v-model.number="form.capacity" type="number" min="1" required />
        </div>
      </div>
      <div class="form-group">
        <label>과목 소개</label>
        <textarea v-model="form.intro" rows="3" placeholder="과목 개요를 간단히 작성해 주세요" />
      </div>
      <div class="form-actions">
        <button v-if="editingId !== null" type="button" class="btn-delete" @click="resetForm">취소</button>
        <button type="submit" class="btn-primary">{{ editingId !== null ? '수정하기' : '등록하기' }}</button>
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
