<script>
export default {
  name: 'CurriculumMicrodegreeView',
  data() {
    return {
      tiers: [
        { level: '초급', target: '인문사회·예체능·공학 등 전공 무관 참여 희망 학생', credit: '6학점', cert: '나노디그리', note: '공통 또는 특화교과 2과목 이수' },
        { level: '중급', target: '공통교과 중심으로 융합역량을 갖추고자 하는 학생', credit: '12학점', cert: '마이크로디그리', note: '공통교과 9학점 + 특화교과 3학점 권장' },
        { level: '심화', target: '미래문해력 핵심역량을 심화하고자 하는 학생', credit: '21학점', cert: '심화인증(부전공)', note: '공통교과 + 특화교과 + 프로젝트 교과' },
        { level: '고급', target: '전과정 문제설계형 융합인재 인증 희망 학생', credit: '27학점', cert: '미래문해력 융합과정 인증', note: '공통 9 + 특화 12 + 캡스톤·리빙랩 6' },
        { level: '확장', target: '전공 수준의 심화학습 희망 학생', credit: '36학점', cert: '연계전공·복수전공 검토', note: '각 대학 학칙에 따라 단계적 추진' }
      ]
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>마이크로디그리</h3>
    <p class="intro-text">
      학생의 참여 수준과 진로 목표에 따라 나노디그리부터 연계전공까지 단계적으로 확장되는 인증체계를 운영합니다.
      인증은 각 대학의 학칙과 마이크로디그리 운영 규정에 따라 이수증, 성적증명서 표기, 디지털 포트폴리오 인증으로
      연계됩니다.
    </p>
    <table class="tier-table">
      <thead>
        <tr>
          <th>구분</th>
          <th>학생 수준</th>
          <th>이수 기준</th>
          <th>인증명</th>
          <th>비고</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in tiers" :key="t.level">
          <td class="level">{{ t.level }}</td>
          <td>{{ t.target }}</td>
          <td>{{ t.credit }}</td>
          <td>{{ t.cert }}</td>
          <td>{{ t.note }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 16px;
}

.intro-text {
  color: var(--color-muted);
  line-height: 1.7;
  margin: 0 0 24px;
}

.tier-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.tier-table th {
  background: var(--bg-soft);
  padding: 12px 8px;
  border-bottom: 2px solid var(--color-text);
  text-align: left;
}

.tier-table td {
  padding: 12px 8px;
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;
}

.tier-table td.level {
  font-weight: 700;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .tier-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
