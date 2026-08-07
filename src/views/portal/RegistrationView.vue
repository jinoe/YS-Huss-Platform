<script>
import session from '../../data/session.js'
import { SEMESTERS } from '../../data/enrollments.js'
import SyllabusModal from '../../components/portal/SyllabusModal.vue'
import LoadingState from '../../components/portal/LoadingState.vue'
import AlertModal from '../../components/portal/AlertModal.vue'
import * as coursesApi from '../../api/courses.js'
import * as enrollmentsApi from '../../api/enrollments.js'

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

const OPEN_ENROLLMENT_STATUSES = ['applied', 'enrolled', 'waitlisted']

function defaultFilters() {
  return {
    semester: '2026-2',
    university: '전체',
    group: '전체',
    credit: '전체',
    keywordField: '전체',
    keyword: ''
  }
}

export default {
  name: 'RegistrationView',
  components: { SyllabusModal, LoadingState, AlertModal },
  data() {
    return {
      session,
      courses: [],
      enrollments: [],
      loading: true,
      loadError: '',
      alertMessage: '',
      alertVariant: 'error',
      semesters: SEMESTERS,
      universities: UNIVERSITIES,
      keywordFields: KEYWORD_FIELDS,
      noticeOpen: true,
      modalCourse: null,
      draft: defaultFilters(),
      applied: defaultFilters(),
      sortKey: '',
      sortOrder: 1,
      // 수강신청/철회 진행 중인 개설 id 집합 — 응답 오기 전 중복 클릭으로
      // 같은 요청이 두 번 나가는 걸 막는다(두 번째 요청이 서버에서 409로 실패해
      // "이미 취소된 신청입니다" 같은 에러가 뜨는 원인이었음).
      pendingOfferingIds: new Set()
    }
  },
  async created() {
    this.loading = true
    try {
      this.courses = await coursesApi.list()
    } catch (e) {
      this.loadError = '개설 교과목 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
      console.error('[api] courses.list', e)
    }
    if (this.isStudent) {
      try {
        this.enrollments = await enrollmentsApi.mine()
      } catch (e) {
        console.error('[api] enrollments.mine', e)
      }
    }
    this.loading = false
  },
  computed: {
    isStudent() {
      return this.session.role === 'student'
    },
    groups() {
      return Array.from(new Set(this.courses.map((c) => c.group).filter(Boolean)))
    },
    myEnrollments() {
      if (!this.isStudent) return []
      return this.enrollments
        .filter((e) => e.semester === this.applied.semester && OPEN_ENROLLMENT_STATUSES.includes(e.status))
        .map((e) => {
          const course = this.courses.find((c) => c.id === e.offeringId)
          return {
            id: e.id,
            offeringId: e.offeringId,
            courseCode: course?.courseCode,
            section: course?.section,
            name: e.courseName,
            credit: e.credit,
            professor: e.professor,
            lectureTime: course?.scheduleText || '미정',
            room: course?.locationText || '미정',
            status: e.status
          }
        })
    },
    myCredits() {
      return this.myEnrollments.filter((r) => r.status !== 'waitlisted').reduce((sum, r) => sum + (r.credit || 0), 0)
    },
    filteredCourses() {
      const f = this.applied
      const keyword = f.keyword.trim().toLowerCase()
      const filtered = this.courses.filter((c) => {
        if (c.semester !== f.semester) return false
        if (f.university !== '전체' && c.university !== f.university) return false
        if (f.group !== '전체' && c.group !== f.group) return false
        if (f.credit !== '전체' && c.credit !== Number(f.credit)) return false
        if (keyword) {
          const code = (c.courseCode || '').toLowerCase()
          const name = (c.name || '').toLowerCase()
          const professor = (c.professor || '').toLowerCase()
          if (f.keywordField === '학정번호' && !code.includes(keyword)) return false
          if (f.keywordField === '교과목명' && !name.includes(keyword)) return false
          if (f.keywordField === '담당교수' && !professor.includes(keyword)) return false
          if (f.keywordField === '전체' && !name.includes(keyword) && !professor.includes(keyword) && !code.includes(keyword)) {
            return false
          }
        }
        return true
      })
      return this.applySort(filtered)
    }
  },
  methods: {
    toggleSort(key) {
      if (this.sortKey === key) {
        this.sortOrder = -this.sortOrder
      } else {
        this.sortKey = key
        this.sortOrder = 1
      }
    },
    applySort(list) {
      if (!this.sortKey) return list
      const key = this.sortKey
      const dir = this.sortOrder
      return [...list].sort((a, b) => {
        let av = a[key]
        let bv = b[key]
        if (key === 'university') { av = this.uniLabel(av); bv = this.uniLabel(bv) }
        if (av == null) av = ''
        if (bv == null) bv = ''
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
        return String(av).localeCompare(String(bv), 'ko') * dir
      })
    },
    uniLabel(key) {
      const u = this.universities.find((x) => x.key === key)
      return u ? u.label : key
    },
    toggleNotice() {
      this.noticeOpen = !this.noticeOpen
    },
    runQuery() {
      this.applied = { ...this.draft }
    },
    isPending(offeringId) {
      return this.pendingOfferingIds.has(offeringId)
    },
    isFull(course) {
      return (course.seatsTaken || 0) >= (course.capacity || 0)
    },
    isWaitlistFull(course) {
      return (course.waitlistTaken || 0) >= (course.waitlistCapacity || 0)
    },
    async applyRegistration(course) {
      if (
        !course.registrationOpen ||
        course.isEnrolled ||
        course.isWaitlisted ||
        this.isPending(course.id) ||
        (this.isFull(course) && this.isWaitlistFull(course))
      ) {
        return
      }
      this.pendingOfferingIds.add(course.id)
      try {
        const result = await enrollmentsApi.create(course.id)
        if (result.enrollment.status === 'waitlisted') {
          course.isWaitlisted = true
          course.waitlistTaken = (course.waitlistTaken || 0) + 1
        } else {
          course.isEnrolled = true
          course.seatsTaken = (course.seatsTaken || 0) + 1
        }
        this.enrollments.push(result.enrollment)
        if (result.warning) {
          this.alertVariant = 'warning'
          this.alertMessage = result.warning
        } else {
          this.alertVariant = 'success'
          this.alertMessage = '수강신청이 완료되었습니다.'
        }
      } catch (e) {
        this.alertVariant = 'error'
        this.alertMessage = e?.response?.data?.detail?.message || '수강신청에 실패했습니다. 잠시 후 다시 시도해주세요.'
      }
      this.pendingOfferingIds.delete(course.id)
    },
    async cancelRegistration(course) {
      const enrollment = this.enrollments.find(
        (e) => e.offeringId === course.id && OPEN_ENROLLMENT_STATUSES.includes(e.status)
      )
      if (!enrollment) return
      await this.cancelEnrollmentById(enrollment.id, course.id)
    },
    async cancelFromMyList(row) {
      await this.cancelEnrollmentById(row.id, row.offeringId)
    },
    async cancelEnrollmentById(enrollmentId, offeringId) {
      if (this.isPending(offeringId)) return
      this.pendingOfferingIds.add(offeringId)
      try {
        await enrollmentsApi.cancel(enrollmentId)
        const course = this.courses.find((c) => c.id === offeringId)
        if (course) {
          if (course.isWaitlisted) {
            course.isWaitlisted = false
            course.waitlistTaken = Math.max(0, (course.waitlistTaken || 0) - 1)
          } else {
            course.isEnrolled = false
            course.seatsTaken = Math.max(0, (course.seatsTaken || 0) - 1)
          }
        }
        this.enrollments = this.enrollments.filter((e) => e.id !== enrollmentId)
        this.alertVariant = 'success'
        this.alertMessage = '수강철회가 완료되었습니다.'
      } catch (e) {
        this.alertVariant = 'error'
        this.alertMessage = e?.response?.data?.detail?.message || '수강철회에 실패했습니다. 잠시 후 다시 시도해주세요.'
      }
      this.pendingOfferingIds.delete(offeringId)
    },
    downloadCsv() {
      const header = ['순번', '학기', '캠퍼스', '개설전공', '과목종별', '학정번호-분반', '학점', '교과목명', '담당교수', '강의시간', '강의실', '수강인원']
      const rows = this.filteredCourses.map((c, idx) => [
        idx + 1,
        c.semester,
        this.uniLabel(c.university),
        c.group,
        c.type,
        `${c.courseCode || ''}-${c.section || ''}`,
        c.credit,
        c.name,
        c.professor,
        c.scheduleText || '미정',
        c.locationText || '미정',
        `${c.seatsTaken}/${c.capacity}`
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

    <LoadingState v-if="loading" />
    <p v-if="loadError" class="load-error">{{ loadError }}</p>

    <template v-if="!loading">
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
            <th>상태</th>
            <th>관리</th>
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
            <td>{{ row.status === 'waitlisted' ? '대기중' : '수강중' }}</td>
            <td>
              <button type="button" class="btn-withdraw" :disabled="isPending(row.offeringId)" @click="cancelFromMyList(row)">수강철회</button>
            </td>
          </tr>
          <tr v-if="!myEnrollments.length">
            <td colspan="8" class="empty">{{ applied.semester }} 학기에 신청한 과목이 없습니다.</td>
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
        <!-- 학년(grade) 필터: 백엔드 과목 데이터에 학년 필드가 없어 주석 처리. 실데이터가 생기면 복원.
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
        -->
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
              <th class="sortable" @click="toggleSort('semester')">학기<span v-if="sortKey === 'semester'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
              <th class="sortable" @click="toggleSort('university')">캠퍼스<span v-if="sortKey === 'university'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
              <th class="sortable" @click="toggleSort('group')">개설전공<span v-if="sortKey === 'group'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
              <!-- 학년: 백엔드 대응 필드 없음 -->
              <th class="sortable" @click="toggleSort('type')">과목종별<span v-if="sortKey === 'type'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
              <!-- 수업세션: 백엔드 대응 필드 없음 -->
              <th class="sortable" @click="toggleSort('courseCode')">학정번호-분반<span v-if="sortKey === 'courseCode'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
              <th class="sortable" @click="toggleSort('credit')">학점<span v-if="sortKey === 'credit'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
              <th class="sortable" @click="toggleSort('name')">교과목명<span v-if="sortKey === 'name'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
              <!-- 폐강여부: 백엔드에 개설취소 개념이 없어 대응 불가 -->
              <th class="sortable" @click="toggleSort('professor')">담당교수<span v-if="sortKey === 'professor'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
              <th class="sortable" @click="toggleSort('scheduleText')">강의시간<span v-if="sortKey === 'scheduleText'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
              <th class="sortable" @click="toggleSort('locationText')">강의실<span v-if="sortKey === 'locationText'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
              <th class="sortable" @click="toggleSort('seatsTaken')">수강인원<span v-if="sortKey === 'seatsTaken'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
              <!-- 언어 / 평가방식 / 국외교환학생수강가능 / 기타유의사항: 백엔드 대응 필드 없음 -->
              <th v-if="isStudent">수강신청</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(course, idx) in filteredCourses" :key="course.id">
              <td>{{ idx + 1 }}</td>
              <td>{{ course.semester }}</td>
              <td>{{ uniLabel(course.university) }}</td>
              <td>{{ course.group }}</td>
              <td>{{ course.type }}</td>
              <td>
                <button type="button" class="name-link" @click="modalCourse = course">{{ course.courseCode }}-{{ course.section }}</button>
              </td>
              <td>{{ course.credit }}</td>
              <td class="name">
                <button type="button" class="name-link" @click="modalCourse = course">{{ course.name }}</button>
              </td>
              <td>{{ course.professor }}</td>
              <td>{{ course.scheduleText || '미정' }}</td>
              <td>{{ course.locationText || '미정' }}</td>
              <td>{{ course.seatsTaken }}/{{ course.capacity }}</td>
              <td v-if="isStudent">
                <button
                  v-if="course.isEnrolled || course.isWaitlisted"
                  type="button"
                  class="btn-withdraw"
                  :disabled="isPending(course.id)"
                  @click="cancelRegistration(course)"
                >
                  {{ course.isWaitlisted ? '대기철회' : '수강철회' }}
                </button>
                <button
                  v-else-if="course.registrationOpen && !isFull(course)"
                  type="button"
                  class="btn-apply"
                  :disabled="isPending(course.id)"
                  @click="applyRegistration(course)"
                >
                  수강신청
                </button>
                <button
                  v-else-if="course.registrationOpen && isFull(course) && !isWaitlistFull(course)"
                  type="button"
                  class="btn-apply"
                  :disabled="isPending(course.id)"
                  @click="applyRegistration(course)"
                >
                  대기신청
                </button>
                <span v-else-if="course.registrationOpen && isFull(course)" class="closed">마감</span>
                <span v-else class="closed">-</span>
              </td>
            </tr>
            <tr v-if="!loading && !filteredCourses.length">
              <td :colspan="isStudent ? 12 : 11" class="empty">조건에 해당하는 개설교과목이 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </template>
    <SyllabusModal :course="modalCourse" @close="modalCourse = null" />
    <AlertModal :message="alertMessage" :variant="alertVariant" @close="alertMessage = ''" />
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

.load-error {
  margin: 0;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fdecea;
  color: #c0392b;
  font-size: 13px;
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
  min-width: 1100px;
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

.reg-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.reg-table th.sortable:hover {
  color: var(--color-primary);
}

.sort-arrow {
  margin-left: 4px;
  font-size: 10px;
  color: var(--color-primary);
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

.reg-table .empty {
  padding: 40px 0;
  color: var(--color-muted);
}

.btn-apply {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: var(--color-muted);
  color: #fff;
  border: none;
  border-radius: 0;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.12s ease;
}

.btn-apply:hover {
  background: var(--color-text);
}

.btn-withdraw {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 3px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-muted);
  cursor: pointer;
}

.btn-withdraw:hover {
  border-color: #c0392b;
  color: #c0392b;
}

.btn-apply:disabled,
.btn-withdraw:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-apply:disabled:hover,
.btn-withdraw:disabled:hover {
  background: var(--color-muted);
  border-color: var(--color-border);
  color: var(--color-muted);
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
