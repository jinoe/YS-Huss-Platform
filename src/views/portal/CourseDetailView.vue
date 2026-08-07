<script>
import session from '../../data/session.js'
import SyllabusDocument from '../../components/portal/SyllabusDocument.vue'
import LoadingState from '../../components/portal/LoadingState.vue'
import AlertModal from '../../components/portal/AlertModal.vue'
import ConfirmModal from '../../components/portal/ConfirmModal.vue'
import * as coursesApi from '../../api/courses.js'
import * as enrollmentsApi from '../../api/enrollments.js'
import * as professorApi from '../../api/professor.js'

const UNIVERSITY_LABELS = {
  yonsei: '연세대학교',
  gongju: '국립공주대학교',
  dongeui: '동의대학교',
  ewha: '이화여자대학교',
  handong: '한동대학교'
}

export default {
  name: 'CourseDetailView',
  components: { SyllabusDocument, LoadingState, AlertModal, ConfirmModal },
  data() {
    return {
      session,
      course: null,
      loading: true,
      loadError: '',
      activeTab: 'weeks',
      expandedWeek: null,
      editingWeek: null,
      weekEditForm: { title: '', content: '' },
      materialToDelete: null,
      showNoticeForm: false,
      noticeForm: { title: '', content: '' },
      actionError: '',
      actionNotice: '',
      actionNoticeVariant: 'warning',
      // 네트워크가 느릴 때 버튼을 두 번 눌러 같은 요청이 중복 전송되는 걸 막는
      // 공용 플래그 — 공지 등록이 두 번 눌려 두 개 생기는 문제가 실제로 있었다.
      busy: false,
      roster: [],
      rosterLoading: false,
      rosterError: ''
    }
  },
  async created() {
    await this.loadCourse()
    if (this.isProfessor) this.loadRoster()
  },
  computed: {
    universityLabel() {
      return this.course ? UNIVERSITY_LABELS[this.course.university] : ''
    },
    isProfessor() {
      return this.session.role === 'professor'
    },
    isCourseFull() {
      return (this.course.seatsTaken || 0) >= (this.course.capacity || 0)
    },
    isWaitlistFull() {
      return (this.course.waitlistTaken || 0) >= (this.course.waitlistCapacity || 0)
    },
    tabs() {
      const base = [
        { key: 'weeks', label: '주차별 학습활동' },
        { key: 'syllabus', label: '강의계획서' }
      ]
      if (this.isProfessor) base.push({ key: 'roster', label: '수강생 명단' })
      return base
    }
  },
  methods: {
    async loadCourse() {
      this.loading = true
      this.loadError = ''
      try {
        this.course = await coursesApi.detail(Number(this.$route.params.id))
      } catch (e) {
        this.loadError = '과목 정보를 불러오지 못했습니다.'
        console.error('[api] courses.detail', e)
      }
      this.loading = false
    },
    async loadRoster() {
      this.rosterLoading = true
      this.rosterError = ''
      try {
        this.roster = await professorApi.roster(Number(this.$route.params.id))
      } catch (e) {
        this.rosterError = '수강생 명단을 불러오지 못했습니다.'
        console.error('[api] professor.roster', e)
      }
      this.rosterLoading = false
    },
    uniLabel(key) {
      return UNIVERSITY_LABELS[key] || key
    },
    selectTab(key) {
      this.activeTab = key
      if (key === 'roster' && this.isProfessor && !this.roster.length && !this.rosterLoading) {
        this.loadRoster()
      }
    },
    toggleWeek(week) {
      this.expandedWeek = this.expandedWeek === week ? null : week
    },
    async uploadMaterial(event, week) {
      const file = event.target.files[0]
      if (!file || this.busy) return
      this.busy = true
      this.actionError = ''
      try {
        const result = await professorApi.addMaterial(this.course.id, { week_no: week, file_name: file.name })
        this.course.weeks[week - 1].materials.push({ id: result.id, fileName: result.fileName })
      } catch (e) {
        this.actionError = '자료 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.'
        console.error('[api] professor.addMaterial', e)
      }
      event.target.value = ''
      this.busy = false
    },
    removeMaterial(week, material) {
      this.materialToDelete = { week, material }
    },
    async confirmDeleteMaterial() {
      if (this.busy) return
      this.busy = true
      const { week, material } = this.materialToDelete
      this.materialToDelete = null
      this.actionError = ''
      try {
        await professorApi.deleteMaterial(this.course.id, material.id)
        const w = this.course.weeks[week - 1]
        w.materials = w.materials.filter((m) => m.id !== material.id)
      } catch (e) {
        this.actionError = '자료 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.'
        console.error('[api] professor.deleteMaterial', e)
      }
      this.busy = false
    },
    startEditWeek(w) {
      this.editingWeek = w.week
      this.weekEditForm = { title: w.topic || '', content: w.activity || '' }
    },
    cancelEditWeek() {
      this.editingWeek = null
    },
    async saveEditWeek(week) {
      if (this.busy) return
      this.busy = true
      this.actionError = ''
      try {
        await professorApi.updateWeekActivity(this.course.id, week, {
          title: this.weekEditForm.title || null,
          content: this.weekEditForm.content || null
        })
        const w = this.course.weeks[week - 1]
        w.topic = this.weekEditForm.title || null
        w.activity = this.weekEditForm.content || null
        this.editingWeek = null
      } catch (e) {
        this.actionError = '주차별 학습활동 저장에 실패했습니다. 잠시 후 다시 시도해주세요.'
        console.error('[api] professor.updateWeekActivity', e)
      }
      this.busy = false
    },
    toggleNoticeForm() {
      this.showNoticeForm = !this.showNoticeForm
      this.noticeForm = { title: '', content: '' }
    },
    async submitNotice() {
      if (this.busy) return
      this.busy = true
      this.actionError = ''
      try {
        await professorApi.addNotice(this.course.id, {
          title: this.noticeForm.title,
          content: this.noticeForm.content
        })
        const detail = await coursesApi.detail(this.course.id)
        this.course.notices = detail.notices
        this.noticeForm = { title: '', content: '' }
        this.showNoticeForm = false
      } catch (e) {
        this.actionError = '공지 등록에 실패했습니다. 잠시 후 다시 시도해주세요.'
        console.error('[api] professor.addNotice', e)
      }
      this.busy = false
    },
    async applyRegistration() {
      if (
        this.course.isEnrolled ||
        this.course.isWaitlisted ||
        this.busy ||
        (this.isCourseFull && this.isWaitlistFull)
      ) {
        return
      }
      this.busy = true
      this.actionError = ''
      this.actionNotice = ''
      try {
        const result = await enrollmentsApi.create(this.course.id)
        if (result.enrollment.status === 'waitlisted') {
          this.course.isWaitlisted = true
          this.course.waitlistTaken = (this.course.waitlistTaken || 0) + 1
        } else {
          this.course.isEnrolled = true
          this.course.seatsTaken = (this.course.seatsTaken || 0) + 1
        }
        this.actionNotice = result.warning || '수강신청이 완료되었습니다.'
        this.actionNoticeVariant = result.warning ? 'warning' : 'success'
      } catch (e) {
        this.actionError = e?.response?.data?.detail?.message || '수강신청에 실패했습니다.'
      }
      this.busy = false
    },
    async cancelWaitlist() {
      if (this.busy) return
      this.busy = true
      this.actionError = ''
      try {
        const mine = await enrollmentsApi.mine()
        const enrollment = mine.find((e) => e.offeringId === this.course.id && e.status === 'waitlisted')
        if (enrollment) {
          await enrollmentsApi.cancel(enrollment.id)
          this.course.isWaitlisted = false
          this.course.waitlistTaken = Math.max(0, (this.course.waitlistTaken || 0) - 1)
        }
      } catch (e) {
        this.actionError = '대기 철회에 실패했습니다. 잠시 후 다시 시도해주세요.'
      }
      this.busy = false
    },
    downloadRosterCsv() {
      const header = ['이름', '학번', '소속 대학', '학과', '이메일', '상태', '학점교류']
      const rows = this.roster.map((r) => [
        r.name,
        r.studentNumber,
        r.universityLabel,
        r.department || '',
        r.email,
        r.status,
        r.isCreditExchange ? 'O' : ''
      ])
      const csv = [header, ...rows].map((row) => row.join(',')).join('\n')
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${this.course.name}_수강생명단.csv`
      link.click()
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<template>
  <section v-if="loading" class="page">
    <LoadingState />
  </section>
  <section v-else-if="course" class="page">
    <div class="course-header">
      <span class="university-badge">{{ universityLabel }}</span>
      <span class="stage-badge">DIVE {{ course.method }}</span>
      <h2>{{ course.name }}</h2>
      <p class="group">{{ course.group }}</p>
    </div>

    <div class="notice-preview">
      <div class="notice-preview-header">
        <span>과목공지</span>
        <button v-if="isProfessor" type="button" class="notice-preview-more" @click="toggleNoticeForm">{{ showNoticeForm ? '×' : '+' }}</button>
      </div>
      <form v-if="showNoticeForm" class="notice-form" @submit.prevent="submitNotice">
        <input v-model="noticeForm.title" type="text" class="notice-edit-title" placeholder="제목" required />
        <textarea v-model="noticeForm.content" rows="4" class="notice-edit-content" placeholder="내용을 입력하세요" required />
        <div class="form-actions">
          <button type="button" class="btn-secondary" :disabled="busy" @click="toggleNoticeForm">취소</button>
          <button type="submit" class="btn-primary" :disabled="busy">{{ busy ? '등록 중...' : '등록' }}</button>
        </div>
      </form>
      <ul class="notice-preview-list">
        <li v-for="n in course.notices" :key="n.id">
          <router-link :to="`/portal/courses/${course.id}/notices/${n.id}`" class="notice-preview-row">
            <span class="notice-preview-title">{{ n.title }}</span>
            <span class="notice-preview-date">{{ String(n.date).slice(0, 10).replaceAll('-', '/') }}</span>
          </router-link>
        </li>
        <li v-if="!course.notices.length" class="notice-preview-empty">등록된 공지가 없습니다.</li>
      </ul>
    </div>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="tab"
        :class="{ active: tab.key === activeTab }"
        @click="selectTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="activeTab === 'weeks'" class="section">
      <div v-if="isProfessor || course.isEnrolled" class="week-block">
        <div class="week-block-header">주차별 학습활동</div>
        <div v-for="w in course.weeks" :key="w.week" class="week-row">
          <button type="button" class="week-header" @click="toggleWeek(w.week)">
            <span>{{ w.week }}주차<template v-if="w.topic"> · {{ w.topic }}</template></span>
            <span class="week-count">{{ w.materials.length }}개 자료</span>
          </button>
          <div v-if="expandedWeek === w.week" class="week-body">
            <div v-if="isProfessor" class="week-actions">
              <template v-if="editingWeek === w.week">
                <button type="button" class="btn-secondary" :disabled="busy" @click="cancelEditWeek">취소</button>
                <button type="button" class="btn-primary" :disabled="busy" @click="saveEditWeek(w.week)">{{ busy ? '저장 중...' : '저장' }}</button>
              </template>
              <template v-else>
                <button type="button" class="btn-secondary" @click="startEditWeek(w)">제목/내용 편집</button>
                <label class="btn-secondary upload-btn">
                  자료 업로드
                  <input type="file" class="file-input" @change="uploadMaterial($event, w.week)" />
                </label>
              </template>
            </div>
            <template v-if="isProfessor && editingWeek === w.week">
              <input v-model="weekEditForm.title" type="text" class="week-edit-title" placeholder="주차 제목" />
              <textarea v-model="weekEditForm.content" rows="3" class="week-edit-content" placeholder="학습활동 내용" />
            </template>
            <p v-else-if="w.activity" class="week-activity">{{ w.activity }}</p>
            <div v-for="m in w.materials" :key="m.id" class="material-item">
              <span>📄 {{ m.fileName }}</span>
              <button v-if="isProfessor" type="button" class="material-remove" @click="removeMaterial(w.week, m)">삭제</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="course.isWaitlisted" class="apply-box">
        <p>대기열에 등록되어 있습니다. 자리가 나면 순서대로 자동 등록됩니다.</p>
        <button type="button" class="btn-secondary" :disabled="busy" @click="cancelWaitlist">{{ busy ? '처리 중...' : '대기철회' }}</button>
      </div>
      <div v-else-if="course.registrationOpen && !isCourseFull" class="apply-box">
        <p>이 과목은 현재 수강신청 기간입니다.</p>
        <button type="button" class="btn-primary" :disabled="busy" @click="applyRegistration">{{ busy ? '신청 중...' : '수강신청' }}</button>
      </div>
      <div v-else-if="course.registrationOpen && isCourseFull && !isWaitlistFull" class="apply-box">
        <p>정원이 마감되어 대기 신청만 가능합니다.</p>
        <button type="button" class="btn-primary" :disabled="busy" @click="applyRegistration">{{ busy ? '신청 중...' : '대기신청' }}</button>
      </div>
      <div v-else-if="course.registrationOpen && isCourseFull" class="apply-box">
        <p>정원 및 대기 인원이 모두 마감되었습니다.</p>
      </div>
      <div v-else class="apply-box">
        <p>수강신청 기간이 아니거나 아직 수강 중이 아닙니다.</p>
      </div>
    </div>

    <div v-else-if="activeTab === 'syllabus'" class="section">
      <SyllabusDocument :course="course" :editable="isProfessor" @saved="loadCourse" />
    </div>

    <div v-else-if="activeTab === 'roster'" class="section roster-card">
      <div class="roster-header">
        <button type="button" class="btn-secondary" @click="downloadRosterCsv" :disabled="!roster.length">CSV 다운로드</button>
      </div>
      <LoadingState v-if="rosterLoading" />
      <p v-if="rosterError" class="action-error">{{ rosterError }}</p>
      <table class="roster-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>학번</th>
            <th>소속 대학</th>
            <th>학과</th>
            <th>이메일</th>
            <th>상태</th>
            <th>학점교류</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in roster" :key="r.studentNumber">
            <td class="name">{{ r.name }}</td>
            <td>{{ r.studentNumber }}</td>
            <td>{{ r.universityLabel }}</td>
            <td>{{ r.department || '-' }}</td>
            <td>{{ r.email }}</td>
            <td>{{ r.status }}</td>
            <td>{{ r.isCreditExchange ? 'O' : '' }}</td>
          </tr>
          <tr v-if="!rosterLoading && !roster.length">
            <td colspan="7" class="empty">수강 이력이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  <section v-else class="page">
    <p class="not-found">{{ loadError || '과목을 찾을 수 없습니다.' }}</p>
    <router-link to="/portal/courses" class="back-link">← 수강편람 목록</router-link>
  </section>
  <AlertModal :message="actionError" @close="actionError = ''" />
  <AlertModal :message="actionNotice" :variant="actionNoticeVariant" @close="actionNotice = ''" />
  <ConfirmModal
    :message="materialToDelete ? '이 자료를 삭제할까요?' : ''"
    @confirm="confirmDeleteMaterial"
    @cancel="materialToDelete = null"
  />
</template>

<style scoped>
/* .page는 더 이상 콘텐츠를 흰 카드로 한 번 더 감싸지 않는다 — 이미
   course-header(네이비)/notice-preview/week-block가 각자 자기 테두리를
   갖고 있어서, 여기에 또 흰 배경을 씌우면 "흰 박스 안에 흰 박스"로
   겹쳐 보인다는 지적이 있었다. 회색 바탕 위에 각 섹션이 자기 카드로만
   구분되도록 배경 없이 여백만 준다. */
.page {
  padding: 12px 16px 32px;
}

.back-link {
  display: inline-block;
  border: none;
  background: none;
  padding: 0;
  font-family: inherit;
  font-size: 13px;
  color: var(--color-muted);
  margin-bottom: 20px;
  cursor: pointer;
}

.back-link:hover {
  color: var(--color-primary);
}

.course-header {
  position: relative;
  background: linear-gradient(160deg, var(--color-primary-dark), var(--color-primary));
  color: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  overflow: hidden;
}

.course-header::before {
  content: '';
  position: absolute;
  left: 24px;
  bottom: 0;
  width: 48px;
  height: 6px;
  background: var(--color-yellow);
}

.university-badge,
.stage-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  padding: 4px 10px;
  margin-right: 8px;
}

.course-header h2 {
  margin: 14px 0 4px;
  font-size: 24px;
}

.group {
  margin: 0;
  opacity: 0.85;
  font-size: 13px;
}

.action-error {
  margin: 0 0 20px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  background: #fdecea;
  color: #c0392b;
}

.section {
  margin-bottom: 32px;
}

.section h3 {
  font-size: 15px;
  color: var(--color-muted);
  margin: 0 0 12px;
  font-weight: 700;
}

.upload-btn {
  position: relative;
  cursor: pointer;
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.material-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.material-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
}

.material-remove {
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  font-size: 12px;
  color: var(--color-muted);
  cursor: pointer;
}

.material-remove:hover {
  color: #c0392b;
}

.notice-preview {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.notice-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  background: var(--bg-soft);
  color: var(--color-primary);
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.2px;
}

.notice-preview-more {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  line-height: 1;
  font-size: 14px;
  color: var(--color-muted);
  cursor: pointer;
  transition: background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease;
}

.notice-preview-more:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.notice-preview-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.notice-preview-list li {
  padding: 14px 18px;
  border-top: 1px solid var(--color-border);
  font-size: 13px;
  transition: background-color 0.12s ease;
}

.notice-preview-list li:hover {
  background: var(--bg-soft);
}

.notice-preview-list li:first-child {
  border-top: none;
}

.notice-preview-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.notice-preview-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.12s ease;
}

.notice-preview-list li:hover .notice-preview-title {
  color: var(--color-primary);
}

.notice-preview-date {
  flex-shrink: 0;
  color: var(--color-muted);
  font-size: 12px;
}

.notice-preview-empty {
  padding: 20px 18px;
  color: var(--color-muted);
  font-size: 13px;
  text-align: center;
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

.week-block {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
}

.week-block-header {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 700;
  background: var(--bg-soft);
  border-bottom: 1px solid var(--color-border);
}

.week-row {
  border-bottom: 1px solid var(--color-border);
}

.week-row:last-child {
  border-bottom: none;
}

.week-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  background: #fff;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 700;
}

.week-header:hover {
  background: var(--bg-soft);
}

.week-count {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-muted);
}

.week-body {
  padding: 4px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid var(--color-border);
}

.week-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 10px;
}

.week-activity {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--color-text);
  line-height: 1.6;
}

.week-empty {
  margin: 8px 0;
  font-size: 13px;
  color: var(--color-muted);
}

.notice-form {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--color-border);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px 14px;
  background: var(--bg-soft);
  border-top: 1px solid var(--color-border);
}

.form-actions .btn-primary,
.form-actions .btn-secondary {
  padding: 6px 16px;
  font-size: 12px;
}

/* 공지 작성 폼 — 메일 쓰기처럼 상단 제목줄 + 하단 본문이 하나의 박스
   안에서 구분선만으로 나뉘는 형태(각 필드를 따로 둥근 박스로 감싸지 않음). */
.notice-edit-title,
.notice-edit-content {
  width: 100%;
  border: none;
  border-radius: 0;
  padding: 12px 14px;
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text);
  background: #fff;
}

.notice-edit-title {
  font-weight: 700;
  border-bottom: 1px solid var(--color-border);
}

.notice-edit-content {
  resize: vertical;
  min-height: 90px;
}

.notice-edit-title:focus,
.notice-edit-content:focus {
  outline: none;
}

.week-edit-title,
.week-edit-content {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text);
  margin-bottom: 8px;
}

.week-edit-content {
  resize: vertical;
}

.apply-box {
  background: #fff;
  border: 1px dashed var(--color-border);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

.apply-box p {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--color-muted);
}

.roster-card {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 16px;
}

.roster-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.roster-header h3 {
  margin: 0;
}

.roster-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.roster-table th {
  background: var(--bg-soft);
  padding: 10px 8px;
  border-bottom: 2px solid var(--color-text);
}

.roster-table td {
  padding: 10px 8px;
  border-bottom: 1px solid var(--color-border);
  text-align: center;
}

.roster-table td.name {
  font-weight: 600;
}

.roster-table .empty {
  padding: 30px 0;
  color: var(--color-muted);
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
  padding: 8px 14px;
  font-size: 12px;
  color: var(--color-muted);
}

.btn-secondary:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.btn-secondary:disabled,
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.not-found {
  color: var(--color-muted);
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .course-header {
    flex-basis: 100%;
  }
  .info-grid {
    flex-basis: 100%;
  }
  .info-item {
    flex-basis: calc(50% - 6px);
  }
  .roster-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
