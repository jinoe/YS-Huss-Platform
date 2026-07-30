<script>
import courses from '../../data/courses.js'
import enrollments, { SEMESTERS } from '../../data/enrollments.js'
import session from '../../data/session.js'
import { studentByName, universityLabel } from '../../data/queries.js'
import { studentProfile } from '../../data/currentUser.js'
import SyllabusModal from '../../components/portal/SyllabusModal.vue'

const UNIVERSITIES = [
  { key: '전체', label: '전체' },
  { key: 'yonsei', label: '연세대학교' },
  { key: 'gongju', label: '국립공주대학교' },
  { key: 'dongeui', label: '동의대학교' },
  { key: 'ewha', label: '이화여자대학교' },
  { key: 'handong', label: '한동대학교' }
]

const KEYWORD_FIELDS = [
  { key: '전체', label: '전체' },
  { key: '학정번호', label: '학정번호' },
  { key: '교과목명', label: '교과목명' },
  { key: '담당교수', label: '담당교수' }
]

function defaultFilters() {
  return {
    semester: '2026-2',
    university: '전체',
    group: '전체',
    grade: '전체',
    credit: '전체',
    keywordField: '전체',
    keyword: '',
    language: '',
    deliveryMode: ''
  }
}

export default {
  name: 'RegistrationView',
  components: { SyllabusModal },
  data() {
    return {
      session,
      courses,
      enrollments,
      semesters: SEMESTERS,
      universities: UNIVERSITIES,
      keywordFields: KEYWORD_FIELDS,
      noticeOpen: true,
      modalCourse: null,
      draft: defaultFilters(),
      applied: defaultFilters()
    }
  },
  computed: {
    isStudent() {
      return this.session.role === 'student'
    },
    groups() {
      return Array.from(new Set(this.courses.map((c) => c.group)))
    },
    currentStudent() {
      return studentByName(this.session.studentName)
    },
    myEnrollments() {
      if (!this.isStudent || !this.currentStudent) return []
      return this.enrollments
        .filter((e) => e.studentId === this.currentStudent.id && e.status === '수강' && e.semester === this.applied.semester)
        .map((e) => {
          const course = this.courses.find((c) => c.id === e.courseId)
          return {
            id: e.id,
            courseCode: course?.courseCode,
            section: course?.section,
            name: course?.name,
            credit: course?.credit || 0,
            professor: course?.professor,
            lectureTime: course?.lectureTime,
            room: course?.room
          }
        })
    },
    myCredits() {
      return this.myEnrollments.reduce((sum, r) => sum + r.credit, 0)
    },
    filteredCourses() {
      const f = this.applied
      const keyword = f.keyword.trim().toLowerCase()
      return this.courses.filter((c) => {
        if (c.semester !== f.semester) return false
        if (f.university !== '전체' && c.university !== f.university) return false
        if (f.group !== '전체' && c.group !== f.group) return false
        if (f.grade !== '전체' && c.grade !== Number(f.grade)) return false
        if (f.credit !== '전체' && c.credit !== Number(f.credit)) return false
        if (f.language && c.language !== f.language) return false
        if (f.deliveryMode && c.deliveryMode !== f.deliveryMode) return false
        if (keyword) {
          if (f.keywordField === '학정번호' && !c.courseCode.toLowerCase().includes(keyword)) return false
          if (f.keywordField === '교과목명' && !c.name.toLowerCase().includes(keyword)) return false
          if (f.keywordField === '담당교수' && !c.professor.toLowerCase().includes(keyword)) return false
          if (
            f.keywordField === '전체' &&
            !c.name.toLowerCase().includes(keyword) &&
            !c.professor.toLowerCase().includes(keyword) &&
            !c.courseCode.toLowerCase().includes(keyword)
          ) {
            return false
          }
        }
        return true
      })
    }
  },
  methods: {
    uniLabel(key) {
      return universityLabel(key)
    },
    toggleNotice() {
      this.noticeOpen = !this.noticeOpen
    },
    runQuery() {
      this.applied = { ...this.draft }
    },
    quickFilter(type) {
      this.draft = defaultFilters()
      if (type === 'english') this.draft.language = '영어'
      if (type === 'online') this.draft.deliveryMode = '온라인강의'
      this.applied = { ...this.draft }
    },
    isEnrolled(course) {
      if (!this.currentStudent) return false
      return this.enrollments.some(
        (e) => e.studentId === this.currentStudent.id && e.courseId === course.id && e.semester === course.semester
      )
    },
    applyRegistration(course) {
      if (course.cancelled || !course.registrationOpen || this.isEnrolled(course)) return
      this.enrollments.push({
        id: Date.now(),
        courseId: course.id,
        semester: course.semester,
        registeredAt: new Date().toISOString().slice(0, 10),
        ...studentProfile(this.session.studentName),
        status: '수강'
      })
    },
    downloadCsv() {
      const header = ['순번', '학기', '캠퍼스', '개설전공', '학년', '과목종별', '수업세션', '학정번호-분반', '학점', '교과목명', '폐강여부', '담당교수', '강의시간', '강의실', '언어', '원격강의여부', '평가방식', '국외교환학생수강가능', '기타유의사항']
      const rows = this.filteredCourses.map((c, idx) => [
        idx + 1,
        c.semester,
        this.uniLabel(c.university),
        c.group,
        c.grade,
        c.type,
        c.sessionType,
        `${c.courseCode}-${c.section}`,
        c.credit,
        c.name,
        c.cancelled ? '폐강' : '',
        c.professor,
        c.lectureTime,
        c.room,
        c.language,
        c.deliveryMode,
        c.evaluationMethod,
        c.exchangeAllowed,
        c.note
      ])
      const csv = [header, ...rows].map((row) => row.join(',')).join('\n')
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `수강신청결과_${this.applied.semester}.csv`
      link.click()
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<template>
  <section class="page">
    <div class="notice-box">
      <button type="button" class="notice-toggle" @click="toggleNotice">
        <span>안내문</span>
        <span class="notice-arrow">{{ noticeOpen ? '▲ 접기' : '▼ 펼치기' }}</span>
      </button>
      <div v-if="noticeOpen" class="notice-body">
        <p>시스템 과부하 방지를 위해 수강신청 및 수강변경 기간에는 최근 학기 개설 교과목만 조회 가능합니다.</p>
        <p>(신촌) 교과목의 이수구분은 학생별로 다르게 적용될 수 있습니다. 졸업요건과 관련된 사항은 학사지원팀으로 문의하시기 바랍니다.</p>
        <p>강의실 위치는 각 대학 캠퍼스 안내를 참고하시기 바랍니다.</p>
        <p>학정번호-분반 형식: 과목그룹 약어 + 4자리 번호 - 분반</p>
      </div>
    </div>

    <div v-if="isStudent" class="my-registration">
      <div class="my-registration-header">
        <h3>수강신청 목록</h3>
        <span class="count">총 {{ myEnrollments.length }}건 · {{ myCredits }}학점</span>
      </div>
      <table class="my-table">
        <thead>
          <tr>
            <th>학정번호-분반</th>
            <th>교과목명</th>
            <th>학점</th>
            <th>담당교수</th>
            <th>강의시간</th>
            <th>강의실</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in myEnrollments" :key="row.id">
            <td>{{ row.courseCode }}-{{ row.section }}</td>
            <td class="name">{{ row.name }}</td>
            <td>{{ row.credit }}</td>
            <td>{{ row.professor }}</td>
            <td>{{ row.lectureTime }}</td>
            <td>{{ row.room }}</td>
          </tr>
          <tr v-if="!myEnrollments.length">
            <td colspan="6" class="empty">{{ applied.semester }} 학기에 신청한 과목이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="filter-bar">
      <div class="filter-grid">
        <label class="filter-item">
          <span>학년도/학기</span>
          <select v-model="draft.semester">
            <option v-for="s in semesters" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>
        <label class="filter-item">
          <span>대학(원)</span>
          <select v-model="draft.university">
            <option v-for="u in universities" :key="u.key" :value="u.key">{{ u.label }}</option>
          </select>
        </label>
        <label class="filter-item">
          <span>개설전공</span>
          <select v-model="draft.group">
            <option value="전체">전체</option>
            <option v-for="g in groups" :key="g" :value="g">{{ g }}</option>
          </select>
        </label>
        <label class="filter-item">
          <span>학년</span>
          <select v-model="draft.grade">
            <option value="전체">전체</option>
            <option value="0">전학년</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
            <option value="4">4학년</option>
          </select>
        </label>
        <label class="filter-item">
          <span>학점</span>
          <select v-model="draft.credit">
            <option value="전체">전체학점</option>
            <option value="1">1학점</option>
            <option value="2">2학점</option>
            <option value="3">3학점</option>
          </select>
        </label>
      </div>
      <div class="keyword-row">
        <label class="filter-item">
          <span>키워드</span>
          <select v-model="draft.keywordField">
            <option v-for="k in keywordFields" :key="k.key" :value="k.key">{{ k.label }}</option>
          </select>
        </label>
        <input v-model="draft.keyword" type="text" class="keyword-input" placeholder="검색어를 입력하세요" />
        <div class="filter-actions">
          <button type="button" class="btn-secondary" @click="quickFilter('english')">영어강의 전체조회</button>
          <button type="button" class="btn-secondary" @click="quickFilter('online')">온라인강의 전체조회</button>
          <button type="button" class="btn-primary" @click="runQuery">조회</button>
        </div>
      </div>
    </div>

    <div class="result-section">
      <div class="result-header">
        <h3>개설 교과목 목록 <span class="count">총건수: [{{ filteredCourses.length }}]</span></h3>
        <button type="button" class="btn-secondary" @click="downloadCsv" :disabled="!filteredCourses.length">엑셀 다운로드</button>
      </div>
      <div class="table-scroll">
        <table class="reg-table">
          <thead>
            <tr>
              <th>순번</th>
              <th>학기</th>
              <th>캠퍼스</th>
              <th>개설전공</th>
              <th>학년</th>
              <th>과목종별</th>
              <th>수업세션</th>
              <th>학정번호-분반</th>
              <th>학점</th>
              <th>교과목명</th>
              <th>폐강여부</th>
              <th>담당교수</th>
              <th>강의시간</th>
              <th>강의실</th>
              <th>언어</th>
              <th>원격강의여부</th>
              <th>평가방식</th>
              <th>국외교환학생수강가능</th>
              <th>기타유의사항</th>
              <th v-if="isStudent">수강신청</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(course, idx) in filteredCourses" :key="course.id" :class="{ cancelled: course.cancelled }">
              <td>{{ idx + 1 }}</td>
              <td>{{ course.semester }}</td>
              <td>{{ uniLabel(course.university) }}</td>
              <td>{{ course.group }}</td>
              <td>{{ course.grade === 0 ? '전학년' : course.grade }}</td>
              <td>{{ course.type }}</td>
              <td>{{ course.sessionType }}</td>
              <td>
                <button type="button" class="name-link" @click="modalCourse = course">{{ course.courseCode }}-{{ course.section }}</button>
              </td>
              <td>{{ course.credit }}</td>
              <td class="name">
                <button type="button" class="name-link" @click="modalCourse = course">{{ course.name }}</button>
              </td>
              <td class="cancelled-cell">{{ course.cancelled ? '폐강' : '' }}</td>
              <td>{{ course.professor }}</td>
              <td>{{ course.lectureTime }}</td>
              <td>{{ course.room }}</td>
              <td>{{ course.language }}</td>
              <td>{{ course.deliveryMode }}</td>
              <td>{{ course.evaluationMethod }}</td>
              <td>{{ course.exchangeAllowed }}</td>
              <td class="note">{{ course.note }}</td>
              <td v-if="isStudent">
                <button
                  v-if="course.registrationOpen && !course.cancelled && !isEnrolled(course)"
                  type="button"
                  class="btn-apply"
                  @click="applyRegistration(course)"
                >
                  <span class="btn-apply-icon">+</span>수강신청
                </button>
                <span v-else-if="isEnrolled(course)" class="applied">✓ 신청완료</span>
                <span v-else class="closed">-</span>
              </td>
            </tr>
            <tr v-if="!filteredCourses.length">
              <td :colspan="isStudent ? 20 : 19" class="empty">조건에 해당하는 개설교과목이 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <SyllabusModal :course="modalCourse" @close="modalCourse = null" />
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.notice-box {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.notice-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  background: var(--bg-soft);
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 700;
}

.notice-arrow {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-muted);
}

.notice-body {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.notice-body p {
  margin: 0;
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.6;
}

.my-registration {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
}

.my-registration-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.my-registration-header h3 {
  margin: 0;
  font-size: 16px;
}

.my-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--color-border);
  font-size: 13px;
}

.my-table th {
  background: var(--bg-soft);
  padding: 10px 8px;
  border: 1px solid var(--color-border);
  border-bottom: 2px solid var(--color-text);
}

.my-table td {
  padding: 10px 8px;
  border: 1px solid var(--color-border);
  text-align: center;
}

.my-table td.name {
  text-align: left;
  font-weight: 600;
}

.my-table .empty {
  padding: 24px 0;
  color: var(--color-muted);
}

.filter-bar {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
}

.filter-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-muted);
  font-weight: 700;
  white-space: nowrap;
}

.filter-item select,
.filter-item input {
  width: auto;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 13px;
  font-family: inherit;
  color: var(--color-text);
  font-weight: 400;
}

.filter-item select {
  min-width: 140px;
}

.filter-item select:focus,
.filter-item input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.keyword-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px dashed var(--color-border);
  flex-wrap: wrap;
}

.keyword-input {
  flex: 1;
  min-width: 160px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 13px;
  font-family: inherit;
  color: var(--color-text);
}

.keyword-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  margin-left: auto;
}

.btn-primary {
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 700;
}

.btn-secondary {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 8px;
  padding: 10px 16px;
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

.result-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.result-header h3 {
  margin: 0;
  font-size: 18px;
}

.count {
  margin-left: 8px;
  font-size: 13px;
  font-weight: 400;
  color: var(--color-muted);
}

.table-scroll {
  overflow-x: auto;
}

.reg-table {
  width: 100%;
  min-width: 1400px;
  border-collapse: collapse;
  border: 1px solid var(--color-border);
  font-size: 13px;
}

.reg-table th {
  background: var(--bg-soft);
  padding: 10px 8px;
  border: 1px solid var(--color-border);
  border-bottom: 2px solid var(--color-text);
  white-space: nowrap;
}

.reg-table td {
  padding: 10px 8px;
  border: 1px solid var(--color-border);
  text-align: center;
  white-space: nowrap;
}

.reg-table td.name {
  text-align: left;
}

.name-link {
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  color: var(--color-primary);
  font-weight: 600;
  cursor: pointer;
}

.name-link:hover {
  text-decoration: underline;
}

.reg-table td.note {
  color: var(--color-muted);
  font-size: 12px;
}

.reg-table tr.cancelled td {
  color: var(--color-muted);
}

.cancelled-cell {
  color: #c0392b;
  font-weight: 700;
}

.reg-table .empty {
  padding: 40px 0;
  color: var(--color-muted);
}

.btn-apply {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: var(--color-muted);
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.12s ease;
}

.btn-apply-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  line-height: 1;
}

.btn-apply::after {
  content: '';
  position: absolute;
  top: 0;
  left: -75%;
  width: 40%;
  height: 100%;
  background: linear-gradient(115deg, transparent, rgba(255, 255, 255, 0.7), transparent);
  transform: skewX(-20deg);
  transition: left 0.5s ease;
}

.btn-apply:hover {
  background: var(--color-text);
}

.btn-apply:hover::after {
  left: 125%;
}

.applied {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 700;
}

.closed {
  color: var(--color-muted);
}

@media (max-width: 768px) {
  .filter-item {
    width: 100%;
    justify-content: space-between;
  }
  .filter-item select {
    flex: 1;
    width: auto;
  }
  .keyword-input {
    width: 100%;
  }
  .filter-actions {
    width: 100%;
    justify-content: stretch;
    margin-left: 0;
  }
  .filter-actions button {
    flex: 1;
  }
}
</style>
