<script>
const COURSES_BY_UNIVERSITY = {
  kw: [
    { group: '기존/개편', name: '디지털시대의 국어', type: '전공', credit: 3, method: '오프 - 블렌디드 70:30', professor: '김소영' },
    { group: '기존/개편', name: '현대사회 문제론', type: '전공', credit: 3, method: '오프라인', professor: '정진경' },
    { group: '기존/개편', name: '옛글과 콘텐츠 기획', type: '전공', credit: 3, method: '오프라인', professor: '강혜진' },
    { group: '기존/개편', name: '글로벌이슈와 정책', type: '전공', credit: 3, method: '오프라인', professor: '전진호' },
    { group: '기존/개편', name: '국제통상개론', type: '전공', credit: 3, method: '오프라인', professor: '팀티칭' },
    { group: '기존/개편', name: 'Gen-AI기반텍스트마이닝과전략개발', type: '전공', credit: 3, method: '동영상 - 온라인', professor: '김상연' },
    { group: '기존/개편', name: '빅데이터프로그래밍', type: '전공', credit: 3, method: '오프라인', professor: '임동혁' },
    { group: '신규 개발(16)', name: '그래픽내러티브', type: '전공', credit: 3, method: '온 - 블렌디드 70:30', professor: '신승한' },
    { group: '신규 개발(16)', name: '동아시아 환경과 에너지 협력', type: '전공', credit: 3, method: '오프 - 블렌디드 50:50', professor: '전진호' },
    { group: '신규 개발(16)', name: '인공지능과 인지과학', type: '전공', credit: 3, method: '동영상 (VOD)', professor: '황동욱' }
  ],
  kookmin: [
    { group: '기존/개편', name: 'GIS 기반 사회현상 분석', type: '전공', credit: 3, method: '오프라인', professor: '준비중' }
  ],
  sunmoon: [
    { group: '기존/개편', name: '국제협력과 지역사회', type: '전공', credit: 3, method: '오프라인', professor: '준비중' }
  ],
  yeungnam: [
    { group: '기존/개편', name: '세계를 잇는 외국어', type: '전공', credit: 3, method: '오프라인', professor: '준비중' }
  ],
  honam: [
    { group: '기존/개편', name: '지속가능발전과 지역사회', type: '전공', credit: 3, method: '오프라인', professor: '준비중' }
  ]
}

export default {
  name: 'CurriculumSubjectView',
  data() {
    return {
      activeUniversity: 'kw',
      keyword: '',
      universities: [
        { key: 'kw', label: '광운대학교' },
        { key: 'kookmin', label: '국민대학교' },
        { key: 'sunmoon', label: '선문대학교' },
        { key: 'yeungnam', label: '영남대학교' },
        { key: 'honam', label: '호남대학교' }
      ]
    }
  },
  computed: {
    currentCourses() {
      const courses = COURSES_BY_UNIVERSITY[this.activeUniversity] || []
      const keyword = this.keyword.trim()
      if (!keyword) return courses
      return courses.filter((c) => c.name.includes(keyword) || c.professor.includes(keyword))
    }
  },
  methods: {
    selectUniversity(key) {
      this.activeUniversity = key
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
      <h3>{{ universities.find((u) => u.key === activeUniversity)?.label }}</h3>
      <input v-model="keyword" type="text" class="search-input" placeholder="교과목명 또는 담당교수 검색" />
    </div>
    <table class="subject-table">
      <thead>
        <tr>
          <th>구분</th>
          <th>교과목명</th>
          <th>이수구분</th>
          <th>학점</th>
          <th>교육방법 (변경될 수 있음)</th>
          <th>담당교수</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in currentCourses" :key="course.name">
          <td>{{ course.group }}</td>
          <td class="name">{{ course.name }}</td>
          <td>{{ course.type }}</td>
          <td>{{ course.credit }}</td>
          <td>{{ course.method }}</td>
          <td>{{ course.professor }}</td>
        </tr>
        <tr v-if="!currentCourses.length">
          <td colspan="6" class="empty">검색 결과가 없습니다.</td>
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

.subject-table .empty {
  padding: 40px 0;
  color: var(--color-muted);
  text-align: center;
}

.subject-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
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
