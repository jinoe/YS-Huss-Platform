<script>
export default {
  name: 'OrganizationView',
  data() {
    return {
      departments: [
        '국제학부', '국제통상학부', '미디어커뮤니케이션학부', '영어산업학과',
        '국어국문학과', '행정학과', '법학부', '정보융합학부'
      ],
      committees: [
        {
          name: '사업운영위원회',
          composition: '위원장: 광운대학교 사업단장 / 위원: 참여학과 학장, 참여학과 책임교수',
          duties: ['사업계획 수립·변경 등 중요 사안에 대해 심의·의결', '사업관련 자문'],
          schedule: '정기: 분기별 1회, 연 4회'
        },
        {
          name: '교육과정위원회',
          composition: '위원장: 참여학사조직 학장 중 1인 / 위원: 참여학과 학과장 및 책임교수 / 위촉직: 외부 전문가 2인 이상',
          duties: [
            '참여학사조직 융합전공 설계 등과 관련한 교육과정 개편 및 운영 심의',
            '교육환경·교육방법 개편 및 운영에 대한 심의',
            '비교과 기획 및 운영에 대한 심의'
          ],
          schedule: '정기: 연 2회 개최 / 수시: 필요시 위원장 요청에 따라 개최'
        },
        {
          name: '자체평가위원회',
          composition: '위원장: 광운대학교 교육혁신원장 / 위원: 교수학습센터장, 사업단 참여교수 3인 이상, 외부위원 2인 이상, 학생대표',
          duties: ['교육과정 평가 및 심의', '사업성과평가 체계 개발 및 개편', '성과평가 피드백 사안 검토', '교육환경평가'],
          schedule: '정기: 연 2회 개최 / 수시: 필요시 위원장 요청에 따라 개최'
        }
      ]
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>사업단 조직도</h3>

    <h4>참여학과</h4>
    <div class="chip-row">
      <span v-for="d in departments" :key="d" class="chip">{{ d }}</span>
    </div>

    <h4>사업운영(전담)조직</h4>
    <div class="committee-list">
      <div v-for="c in committees" :key="c.name" class="committee-card">
        <h5>{{ c.name }}</h5>
        <p class="committee-row"><strong>구성</strong> {{ c.composition }}</p>
        <p class="committee-row"><strong>주요업무</strong></p>
        <ul>
          <li v-for="d in c.duties" :key="d">{{ d }}</li>
        </ul>
        <p class="committee-row"><strong>운영계획</strong> {{ c.schedule }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 20px;
}

h4 {
  font-size: 15px;
  margin: 32px 0 12px;
  color: var(--color-primary);
}

h4:first-of-type {
  margin-top: 0;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  background: var(--bg-soft);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
}

.committee-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.committee-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.committee-card h5 {
  font-size: 16px;
  margin: 0 0 12px;
  color: var(--color-primary);
}

.committee-row {
  font-size: 13px;
  color: var(--color-text);
  margin: 8px 0;
  line-height: 1.6;
}

.committee-card ul {
  margin: 4px 0 8px;
  padding-left: 18px;
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.7;
}
</style>
