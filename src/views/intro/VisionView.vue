<script>
export default {
  name: 'VisionView',
  data() {
    return {
      overview: [
        { label: '사업명', value: '인문사회융합 인재양성사업' },
        { label: '목표', value: '사회적 수요를 반영한 대학 교육과정 혁신, 학생 중심 교육과정 운영 기반 마련' },
        { label: '대상', value: '대주제 별 1개씩, 5개 내외의 컨소시엄' },
        { label: '사업기간', value: '2023 ~ 2027년 2월 (컨소시엄별 3년)' },
        { label: '예산', value: '총 240억원' }
      ],
      strategies: [
        {
          title: '사회 문제 해결을 위한 융합 교육과정 개발·운영',
          items: ['다양한 융합 교과목 개발', '자율적 진로 설계 지원', '지속적인 교육과정 고도화']
        },
        {
          title: '대학의 융합·협력을 위한 기반 구축',
          items: ['융합을 위한 제도적 기반 구축', '핵심 역량 기반 컨소시엄 구성', '융합·협력 성과 확산']
        }
      ]
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>비전 및 목표</h3>

    <h4>인문사회융합 인재양성사업이란?</h4>
    <p class="intro-text">
      4차 산업혁명, 포스트 코로나 등 사회변화에 따른 문제해결을 위한 인문사회 기반 융합인재를 대학에서 경쟁력을
      갖추어 적극 육성할 수 있도록 재정 지원해 주는 사업입니다.
    </p>

    <h4>사업개요</h4>
    <table class="overview-table">
      <tbody>
        <tr v-for="row in overview" :key="row.label">
          <th>{{ row.label }}</th>
          <td>{{ row.value }}</td>
        </tr>
      </tbody>
    </table>

    <h4>사업목표</h4>
    <div class="goal-grid">
      <div class="goal-card">
        <span class="goal-tag">비전</span>
        <p>인문사회 기반 융합 인재 양성</p>
      </div>
      <div class="goal-card">
        <span class="goal-tag">추진목표</span>
        <p>사회적 수요를 반영한 대학 교육과정 혁신, 학생 중심 교육과정 운영 기반 마련</p>
      </div>
    </div>

    <h4>전략</h4>
    <div class="strategy-grid">
      <div v-for="strategy in strategies" :key="strategy.title" class="strategy-card">
        <h5>{{ strategy.title }}</h5>
        <ul>
          <li v-for="item in strategy.items" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 24px;
}

h4 {
  font-size: 16px;
  margin: 32px 0 12px;
  color: var(--color-primary);
}

h4:first-of-type {
  margin-top: 0;
}

.intro-text {
  color: var(--color-muted);
  line-height: 1.7;
  margin: 0;
}

.overview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.overview-table th,
.overview-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
}

.overview-table th {
  width: 120px;
  background: var(--bg-soft);
  font-weight: 700;
}

.goal-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.goal-card {
  background: var(--bg-soft);
  border-radius: 8px;
  padding: 20px;
}

.goal-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.goal-card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.strategy-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.strategy-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.strategy-card h5 {
  font-size: 14px;
  margin: 0 0 12px;
}

.strategy-card ul {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.8;
}

@media (max-width: 768px) {
  .goal-grid,
  .strategy-grid {
    grid-template-columns: 1fr;
  }
}
</style>
