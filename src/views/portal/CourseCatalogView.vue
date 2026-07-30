<script>
import courses from '../../data/courses.js'
import { SEMESTERS } from '../../data/enrollments.js'
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
  name: 'CourseCatalogView',
  components: { SyllabusModal },
  data() {
    return {
      courses,
      semesters: SEMESTERS,
      universities: UNIVERSITIES,
      keywordFields: KEYWORD_FIELDS,
      modalCourse: null,
      draft: defaultFilters(),
      applied: defaultFilters()
    }
  },
  computed: {
    groups() {
      return Array.from(new Set(this.courses.map((c) => c.group)))
    },
    currentCourses() {
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
    runQuery() {
      this.applied = { ...this.draft }
    },
    quickFilter(type) {
      this.draft = defaultFilters()
      if (type === 'english') this.draft.language = '영어'
      if (type === 'online') this.draft.deliveryMode = '온라인강의'
      this.applied = { ...this.draft }
    }
  }
}
</script>

<template>
  <section>
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

    <h3>수강편람 <span class="count">총 {{ currentCourses.length }}건</span></h3>
    <table class="subject-table">
      <thead>
        <tr>
          <th>공통교과 풀</th>
          <th>교과목명</th>
          <th>이수구분</th>
          <th>학점</th>
          <th>담당교수</th>
          <th>학기</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in currentCourses" :key="course.id">
          <td>{{ course.group }}</td>
          <td class="name">
            <button type="button" class="name-link" @click="modalCourse = course">{{ course.name }}</button>
          </td>
          <td>{{ course.type }}</td>
          <td>{{ course.credit }}</td>
          <td>{{ course.professor }}</td>
          <td>{{ course.semester }}</td>
        </tr>
        <tr v-if="!currentCourses.length">
          <td colspan="6" class="empty">검색 결과가 없습니다.</td>
        </tr>
      </tbody>
    </table>
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
