<script>
import { SEMESTERS } from '../../data/enrollments.js'
import SyllabusModal from '../../components/portal/SyllabusModal.vue'
import LoadingState from '../../components/portal/LoadingState.vue'
import * as coursesApi from '../../api/courses.js'

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
    credit: '전체',
    keywordField: '전체',
    keyword: '',
    deliveryMode: ''
  }
}

export default {
  name: 'CourseCatalogView',
  components: { SyllabusModal, LoadingState },
  data() {
    return {
      courses: [],
      loading: true,
      loadError: '',
      semesters: SEMESTERS,
      universities: UNIVERSITIES,
      keywordFields: KEYWORD_FIELDS,
      modalCourse: null,
      draft: defaultFilters(),
      applied: defaultFilters(),
      sortKey: '',
      sortOrder: 1
    }
  },
  async created() {
    this.loading = true
    try {
      this.courses = await coursesApi.list()
    } catch (e) {
      this.loadError = '수강편람을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
      console.error('[api] courses.list', e)
    }
    this.loading = false
  },
  computed: {
    groups() {
      return Array.from(new Set(this.courses.map((c) => c.group).filter(Boolean)))
    },
    currentCourses() {
      const f = this.applied
      const keyword = f.keyword.trim().toLowerCase()
      const filtered = this.courses.filter((c) => {
        if (c.semester !== f.semester) return false
        if (f.university !== '전체' && c.university !== f.university) return false
        if (f.group !== '전체' && c.group !== f.group) return false
        if (f.credit !== '전체' && c.credit !== Number(f.credit)) return false
        if (f.deliveryMode && c.deliveryMode !== f.deliveryMode) return false
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
    runQuery() {
      this.applied = { ...this.draft }
    },
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
        if (av == null) av = ''
        if (bv == null) bv = ''
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
        return String(av).localeCompare(String(bv), 'ko') * dir
      })
    },
    async openSyllabus(course) {
      // 목록 API에는 주차별 수업내용(weeks)이 없다 — 모달을 열 때 상세 API로 한 번 더 채운다.
      this.modalCourse = course
      if (course.weeks) return
      try {
        const detail = await coursesApi.detail(course.id)
        course.weeks = detail.weeks || []
      } catch (e) {
        console.error('[api] courses.detail', e)
      }
    }
  }
}
</script>

<template>
  <section>
    <LoadingState v-if="loading" />
    <p v-if="loadError" class="load-error">{{ loadError }}</p>

    <template v-if="!loading">
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

    <h3>수강편람 <span class="count">총 {{ currentCourses.length }}건</span></h3>
    <table class="subject-table">
      <thead>
        <tr>
          <th class="sortable" @click="toggleSort('group')">공통교과 풀<span v-if="sortKey === 'group'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
          <th class="sortable" @click="toggleSort('name')">교과목명<span v-if="sortKey === 'name'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
          <th class="sortable" @click="toggleSort('type')">이수구분<span v-if="sortKey === 'type'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
          <th class="sortable" @click="toggleSort('credit')">학점<span v-if="sortKey === 'credit'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
          <th class="sortable" @click="toggleSort('professor')">담당교수<span v-if="sortKey === 'professor'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
          <th class="sortable" @click="toggleSort('semester')">학기<span v-if="sortKey === 'semester'" class="sort-arrow">{{ sortOrder === 1 ? '▲' : '▼' }}</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in currentCourses" :key="course.id">
          <td>{{ course.group }}</td>
          <td class="name">
            <button type="button" class="name-link" @click="openSyllabus(course)">{{ course.name }}</button>
          </td>
          <td>{{ course.type }}</td>
          <td>{{ course.credit }}</td>
          <td>{{ course.professor }}</td>
          <td>{{ course.semester }}</td>
        </tr>
        <tr v-if="!loading && !currentCourses.length">
          <td colspan="6" class="empty">검색 결과가 없습니다.</td>
        </tr>
      </tbody>
    </table>
    </template>
    <SyllabusModal :course="modalCourse" @close="modalCourse = null" />
  </section>
</template>

<style scoped>
.filter-bar {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
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

.load-error {
  margin: 0 0 16px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fdecea;
  color: #c0392b;
  font-size: 13px;
}

h3 {
  font-size: 22px;
  margin: 0 0 16px;
}

.count {
  font-size: 13px;
  font-weight: 400;
  color: var(--color-muted);
  margin-left: 8px;
}

.subject-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--color-border);
  font-size: 14px;
  background: #fff;
}

.subject-table th {
  background: var(--bg-soft);
  padding: 12px 8px;
  border: 1px solid var(--color-border);
  border-bottom: 2px solid var(--color-text);
}

.subject-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.subject-table th.sortable:hover {
  color: var(--color-primary);
}

.sort-arrow {
  margin-left: 4px;
  font-size: 10px;
  color: var(--color-primary);
}

.subject-table td {
  padding: 10px 8px;
  border: 1px solid var(--color-border);
  text-align: center;
}

.subject-table td.name {
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

.subject-table .empty {
  padding: 40px 0;
  color: var(--color-muted);
  text-align: center;
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
  .subject-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
