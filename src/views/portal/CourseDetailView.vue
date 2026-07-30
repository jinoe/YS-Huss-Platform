<script>
import courses from '../../data/courses.js'
import enrollments from '../../data/enrollments.js'
import session from '../../data/session.js'
import { joinedEnrollments, isStudentEnrolledByName } from '../../data/queries.js'
import { studentProfile } from '../../data/currentUser.js'
import SyllabusDocument from '../../components/portal/SyllabusDocument.vue'

const UNIVERSITY_LABELS = {
  yonsei: '연세대학교',
  gongju: '국립공주대학교',
  dongeui: '동의대학교',
  ewha: '이화여자대학교',
  handong: '한동대학교'
}

export default {
  name: 'CourseDetailView',
  components: { SyllabusDocument },
  data() {
    return {
      session,
      courses,
      enrollments,
      activeTab: 'weeks',
      expandedWeek: null,
      noticeForm: { title: '', content: '' }
    }
  },
  computed: {
    course() {
      return this.courses.find((c) => c.id === Number(this.$route.params.id))
    },
    universityLabel() {
      return this.course ? UNIVERSITY_LABELS[this.course.university] : ''
    },
    isProfessor() {
      return this.session.role === 'professor'
    },
    tabs() {
      const base = [
        { key: 'weeks', label: '주차별 학습활동' },
        { key: 'notices', label: '과목공지' },
        { key: 'syllabus', label: '강의계획서' }
      ]
      if (this.isProfessor) base.push({ key: 'roster', label: '수강생 명단' })
      return base
    },
    roster() {
      if (!this.course) return []
      return joinedEnrollments(this.enrollments.filter((e) => e.courseId === this.course.id))
    },
    isEnrolled() {
      if (!this.course) return false
      return isStudentEnrolledByName(this.session.studentName, this.course.id, this.course.semester)
    }
  },
  methods: {
    uniLabel(key) {
      return UNIVERSITY_LABELS[key] || key
    },
    goBack() {
      if (window.history.state && window.history.state.back) {
        this.$router.back()
      } else {
        this.$router.push('/portal/courses')
      }
    },
    selectTab(key) {
      this.activeTab = key
    },
    toggleWeek(week) {
      this.expandedWeek = this.expandedWeek === week ? null : week
    },
    uploadMaterial(event, week) {
      const file = event.target.files[0]
      if (!file) return
      this.course.weeks[week - 1].materials.push(file.name)
      event.target.value = ''
    },
    submitNotice() {
      this.course.notices.unshift({
        id: Date.now(),
        title: this.noticeForm.title,
        content: this.noticeForm.content,
        date: new Date().toISOString().slice(0, 10)
      })
      this.noticeForm = { title: '', content: '' }
    },
    applyRegistration() {
      if (this.isEnrolled) return
      this.enrollments.push({
        id: Date.now(),
        courseId: this.course.id,
        semester: this.course.semester,
        registeredAt: new Date().toISOString().slice(0, 10),
        ...studentProfile(this.session.studentName),
        status: '수강'
      })
    },
    downloadRosterCsv() {
      const header = ['학기', '이름', '학번', '소속 대학', '학과', '이메일', '연락처', '상태']
      const rows = this.roster.map((e) => [
        e.semester,
        e.studentName,
        e.studentNumber,
        UNIVERSITY_LABELS[e.university] || e.university,
        e.department,
        e.email,
        e.phone,
        e.status
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
  <section v-if="course" class="page">
    <button type="button" class="back-link" @click="goBack">← 뒤로가기</button>

    <div class="course-header">
      <span class="university-badge">{{ universityLabel }}</span>
      <span class="stage-badge">DIVE {{ course.method }}</span>
      <h2>{{ course.name }}</h2>
      <p class="group">{{ course.group }}</p>
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
      <template v-if="isProfessor || isEnrolled">
        <div v-for="w in course.weeks" :key="w.week" class="week-row">
          <button type="button" class="week-header" @click="toggleWeek(w.week)">
            <span>{{ w.week }}주차</span>
            <span class="week-count">{{ w.materials.length }}개 자료</span>
          </button>
          <div v-if="expandedWeek === w.week" class="week-body">
            <div v-for="(m, idx) in w.materials" :key="idx" class="material-item">📄 {{ m }}</div>
            <p v-if="!w.materials.length" class="week-empty">등록된 자료가 없습니다.</p>
            <label v-if="isProfessor" class="btn-secondary upload-btn">
              자료 업로드
              <input type="file" class="file-input" @change="uploadMaterial($event, w.week)" />
            </label>
          </div>
        </div>
      </template>
      <div v-else-if="course.registrationOpen" class="apply-box">
        <p>이 과목은 현재 수강신청 기간입니다.</p>
        <button type="button" class="btn-primary" @click="applyRegistration">수강신청</button>
      </div>
      <div v-else class="apply-box">
        <p>수강신청 기간이 아니거나 아직 수강 중이 아닙니다.</p>
      </div>
    </div>

    <div v-else-if="activeTab === 'notices'" class="section">
      <form v-if="isProfessor" class="notice-form" @submit.prevent="submitNotice">
        <input v-model="noticeForm.title" type="text" placeholder="공지 제목" required />
        <textarea v-model="noticeForm.content" rows="3" placeholder="공지 내용을 입력하세요" required />
        <div class="form-actions">
          <button type="submit" class="btn-primary">공지 등록</button>
        </div>
      </form>
      <div class="notice-list">
        <div v-for="n in course.notices" :key="n.id" class="notice-item">
          <div class="notice-item-head">
            <span class="notice-title">{{ n.title }}</span>
            <span class="notice-date">{{ n.date }}</span>
          </div>
          <p class="notice-content">{{ n.content }}</p>
        </div>
        <p v-if="!course.notices.length" class="week-empty">등록된 공지가 없습니다.</p>
      </div>
    </div>

    <div v-else-if="activeTab === 'syllabus'" class="section">
      <SyllabusDocument :course="course" />
    </div>

    <div v-else-if="activeTab === 'roster'" class="section">
      <div class="roster-header">
        <button type="button" class="btn-secondary" @click="downloadRosterCsv" :disabled="!roster.length">CSV 다운로드</button>
      </div>
      <table class="roster-table">
        <thead>
          <tr>
            <th>학기</th>
            <th>이름</th>
            <th>학번</th>
            <th>소속 대학</th>
            <th>학과</th>
            <th>이메일</th>
            <th>연락처</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in roster" :key="e.id">
            <td>{{ e.semester }}</td>
            <td class="name">{{ e.studentName }}</td>
            <td>{{ e.studentNumber }}</td>
            <td>{{ uniLabel(e.university) }}</td>
            <td>{{ e.department }}</td>
            <td>{{ e.email }}</td>
            <td>{{ e.phone }}</td>
            <td>{{ e.status }}</td>
          </tr>
          <tr v-if="!roster.length">
            <td colspan="8" class="empty">수강 이력이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  <section v-else class="page">
    <p class="not-found">과목을 찾을 수 없습니다.</p>
    <router-link to="/portal/courses" class="back-link">← 수강편람 목록</router-link>
  </section>
</template>

<style scoped>
.page {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
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
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
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

.week-row {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
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

.week-empty {
  margin: 8px 0;
  font-size: 13px;
  color: var(--color-muted);
}

.notice-form {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notice-form input,
.notice-form textarea {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text);
}

.notice-form input:focus,
.notice-form textarea:focus {
  outline: none;
  border-color: var(--color-accent);
}

.notice-form textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 14px 16px;
}

.notice-item-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 6px;
}

.notice-title {
  font-size: 14px;
  font-weight: 700;
}

.notice-date {
  font-size: 12px;
  color: var(--color-muted);
  flex-shrink: 0;
}

.notice-content {
  margin: 0;
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.6;
}

.apply-box {
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

.btn-secondary:disabled {
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
