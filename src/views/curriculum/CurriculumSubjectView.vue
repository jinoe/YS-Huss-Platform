<script>
const COURSES_BY_UNIVERSITY = {
  yonsei: [
    { group: 'Futures Narrative Studio', name: 'Culture and Storytelling', type: '공통교과', credit: 3, method: 'D', professor: '준비중' },
    { group: 'Futures Narrative Studio', name: 'AI Motion and Visual Narratives', type: '공통교과', credit: 3, method: 'D-V', professor: '준비중' },
    { group: 'Futures Narrative Studio', name: '사변적사고와 프로세스', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중' },
    { group: 'Future Problem Framing', name: 'Sustainable Development for Future', type: '공통교과', credit: 3, method: 'I', professor: '준비중' },
    { group: 'Future Problem Framing', name: '데이터기반 통합디자인리서치', type: '공통교과', credit: 3, method: 'I', professor: '준비중' },
    { group: 'Future Problem Framing', name: '스페큘레이티브 디자인', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중' },
    { group: 'Experience & Service Design', name: 'Future Experience Design', type: '공통교과', credit: 3, method: 'V', professor: '준비중' },
    { group: 'Experience & Service Design', name: 'User Experience Research Methods', type: '공통교과', credit: 3, method: 'I-V', professor: '준비중' },
    { group: 'Experience & Service Design', name: 'Idea Visualization', type: '공통교과', credit: 3, method: 'V', professor: '준비중' },
    { group: 'AI Prototyping Lab', name: '인공지능기반디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중' }
  ],
  gongju: [
    { group: 'Futures Narrative Studio', name: '디자인픽션 프로젝트', type: '공통교과', credit: 3, method: 'D', professor: '준비중' },
    { group: 'Futures Narrative Studio', name: '동시대 문학과 영상 분석', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중' },
    { group: 'Future Problem Framing', name: '데이터 기반 여론분석과 미래 예측', type: '공통교과', credit: 3, method: 'I', professor: '준비중' },
    { group: 'Future Problem Framing', name: '알고리즘 권력', type: '공통교과', credit: 3, method: 'I', professor: '준비중' },
    { group: 'Experience & Service Design', name: '사용자경험디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중' },
    { group: 'AI Prototyping Lab', name: '생성형AI를 활용한 디지털콘텐츠디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중' },
    { group: 'AI Prototyping Lab', name: '인터랙티브영상 콘텐츠', type: '공통교과', credit: 3, method: 'V', professor: '준비중' }
  ],
  dongeui: [
    { group: 'Futures Narrative Studio', name: '이야기로 미래읽기', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중' },
    { group: 'Future Problem Framing', name: 'AI시대의 인간과 사회', type: '공통교과', credit: 3, method: 'I', professor: '준비중' },
    { group: 'Future Problem Framing', name: 'Futures Literacy Lab', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중' },
    { group: 'AI Prototyping Lab', name: 'AI미래시뮬레이션', type: '공통교과', credit: 3, method: 'V', professor: '준비중' },
    { group: 'AI Prototyping Lab', name: '지능형정보검색과 실습', type: '공통교과', credit: 3, method: 'V', professor: '준비중' },
    { group: 'Ethics by Design', name: '메타리터러시와 디지털시민성', type: '공통교과', credit: 3, method: 'I-E', professor: '준비중' }
  ],
  ewha: [
    { group: 'Futures Narrative Studio', name: '미래를 상상하는 인간', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중' },
    { group: 'Future Problem Framing', name: '미래 윤리: 기술, 생명, AI의 규범', type: '공통교과', credit: 3, method: 'I', professor: '준비중' },
    { group: 'Ethics by Design', name: '포용적 미래 설계 캡스톤', type: '공통교과', credit: 3, method: 'I-E', professor: '준비중' },
    { group: 'Ethics by Design', name: '통합적 분쟁이해와 조정', type: '공통교과', credit: 3, method: 'I', professor: '준비중' },
    { group: 'Ethics by Design', name: '여성과 사회정의', type: '공통교과', credit: 3, method: 'I', professor: '준비중' }
  ],
  handong: [
    { group: 'Futures Narrative Studio', name: 'AX 내러티브 모션 그래픽스 1', type: '공통교과', credit: 3, method: 'D-V', professor: '준비중' },
    { group: 'Future Problem Framing', name: 'Design Thinking', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중' },
    { group: 'Future Problem Framing', name: 'Design for Future Product 1', type: '공통교과', credit: 3, method: 'D-I', professor: '준비중' },
    { group: 'Experience & Service Design', name: 'AX 라이프 디자인 스튜디오 1', type: '공통교과', credit: 3, method: 'V', professor: '준비중' },
    { group: 'Experience & Service Design', name: 'Future Life UX Design', type: '공통교과', credit: 3, method: 'V', professor: '준비중' },
    { group: 'AI Prototyping Lab', name: 'AX Native Design', type: '공통교과', credit: 3, method: 'V', professor: '준비중' },
    { group: 'AI Prototyping Lab', name: '스마트 인터페이스 디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중' },
    { group: 'AI Prototyping Lab', name: '그래픽 디자인', type: '공통교과', credit: 3, method: 'V', professor: '준비중' }
  ]
}

export default {
  name: 'CurriculumSubjectView',
  data() {
    return {
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
          <th>공통교과 풀</th>
          <th>교과목명</th>
          <th>이수구분</th>
          <th>학점</th>
          <th>DIVE 단계</th>
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
