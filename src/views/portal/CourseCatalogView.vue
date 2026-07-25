<script>
import courses from '../../data/courses.js'
import enrollments from '../../data/enrollments.js'
import session from '../../data/session.js'
import { isStudentEnrolledByName } from '../../data/queries.js'
import { studentProfile } from '../../data/currentUser.js'

export default {
  name: 'CourseCatalogView',
  data() {
    return {
      session,
      courses,
      enrollments,
      activeUniversity: 'yonsei',
      keyword: '',
      universities: [
        { key: 'yonsei', label: '연세대학교' },
        { key: 'gongju', label: '국립공주대학교' },
        { key: 'dongeui', label: '동의대학교' },
        { key: 'ewha', label: '이화여자대학교' },
        { key: 'handong', label: '한동대학교' }
      ]
    }
  },
  computed: {
    isStudent() {
      return this.session.role === 'student'
    },
    currentCourses() {
      const list = this.courses.filter((c) => c.university === this.activeUniversity)
      const keyword = this.keyword.trim()
      if (!keyword) return list
      return list.filter((c) => c.name.includes(keyword) || c.professor.includes(keyword))
    }
  },
  methods: {
    selectUniversity(key) {
      this.activeUniversity = key
    },
    isEnrolled(course) {
      return isStudentEnrolledByName(this.session.studentName, course.id, course.semester)
    },
    applyRegistration(course) {
      if (this.isEnrolled(course)) return
      this.enrollments.push({
        id: Date.now(),
        courseId: course.id,
        semester: course.semester,
        ...studentProfile(this.session.studentName),
        status: '수강'
      })
    }
  }
}
</script>

<template>
  <section>
    <div class="tabs">
      <button
        v-for="uni in universities"
        :key="uni.key"
        class="tab"
        :class="{ active: uni.key === activeUniversity }"
        @click="selectUniversity(uni.key)"
      >
        {{ uni.label }}
      </button>
    </div>
    <div class="subject-toolbar">
      <h3>{{ universities.find((u) => u.key === activeUniversity)?.label }} 수강편람</h3>
      <input v-model="keyword" type="text" class="search-input" placeholder="교과목명 또는 담당교수 검색" />
    </div>
    <table class="subject-table">
      <thead>
        <tr>
          <th>공통교과 풀</th>
          <th>교과목명</th>
          <th>이수구분</th>
          <th>학점</th>
          <th>DIVE 단계</th>
          <th>담당교수</th>
          <th>학기</th>
          <th v-if="isStudent">수강신청</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in currentCourses" :key="course.id">
          <td>{{ course.group }}</td>
          <td class="name">
            <router-link :to="`/portal/courses/${course.id}`">{{ course.name }}</router-link>
          </td>
          <td>{{ course.type }}</td>
          <td>{{ course.credit }}</td>
          <td>{{ course.method }}</td>
          <td>{{ course.professor }}</td>
          <td>{{ course.semester }}</td>
          <td v-if="isStudent">
            <button
              v-if="course.registrationOpen && !isEnrolled(course)"
              type="button"
              class="btn-apply"
              @click="applyRegistration(course)"
            >
              수강신청
            </button>
            <span v-else-if="isEnrolled(course)" class="applied">신청완료</span>
            <span v-else class="closed">-</span>
          </td>
        </tr>
        <tr v-if="!currentCourses.length">
          <td :colspan="isStudent ? 8 : 7" class="empty">검색 결과가 없습니다.</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
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

.subject-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.subject-toolbar h3 {
  margin: 0;
}

h3 {
  font-size: 22px;
  margin: 0 0 16px;
}

.search-input {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  min-width: 240px;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.subject-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: #fff;
}

.subject-table th {
  background: var(--bg-soft);
  padding: 12px 8px;
  border-bottom: 2px solid var(--color-text);
}

.subject-table td {
  padding: 10px 8px;
  border-bottom: 1px solid var(--color-border);
  text-align: center;
}

.subject-table td.name {
  text-align: left;
}

.subject-table td.name a {
  color: var(--color-primary);
  font-weight: 600;
}

.subject-table td.name a:hover {
  text-decoration: underline;
}

.subject-table .empty {
  padding: 40px 0;
  color: var(--color-muted);
  text-align: center;
}

.btn-apply {
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
}

.applied {
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 700;
}

.closed {
  color: var(--color-muted);
}

@media (max-width: 768px) {
  .subject-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  .search-input {
    min-width: 0;
    width: 100%;
  }
}
</style>
