<script>
export default {
  name: 'VisionView',
  data() {
    return {
      overview: [
        { label: '사업명', value: '인문사회융합 인재양성사업(HUSS)' },
        { label: '컨소시엄명', value: '인간 중심 미래사회를 위한 서사·상상력·문화 전략 융합인재양성 컨소시엄' },
        { label: '소주제', value: '미래문해력: 미래 서사 상상을 통한 인간중심사회의 선제적 설계' },
        {
          label: '참여대학',
          value: '연세대학교(주관·수도권) · 국립공주대학교(충청권) · 동의대학교(동남권) · 이화여자대학교(수도권) · 한동대학교(대경강원권)'
        }
      ],
      strategies: [
        {
          title: '미래문해력 기반 융합교육과정 개발·운영',
          items: ['공동 교과목 12개 이상 개발', '대학별 특화 교과목 연계', '상상–정의–설계–구현·확산 4단계 학습주기 운영']
        },
        {
          title: '공유형 교육생태계 및 단계적 인증체계 구축',
          items: ['학점교류·공동 강의계획서·팀티칭 기반 공유학사 마련', '나노디그리·마이크로디그리·인증체계 단계적 구축', '공유형 캡스톤과 지역사회 확산']
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
        <p>미래통찰 상상력, 인간가치 해석력, 대안 구성 설계력, 인문사회기반 AI·디지털 기술 활용력, 사회전환 실행
          역량을 통합하여 미래사회의 잠재적 문제를 선제적으로 발굴하고 인간 중심의 대안을 설계·구현·확산할 수
          있는 융합인재 양성</p>
      </div>
      <div class="goal-card">
        <span class="goal-tag">추진목표</span>
        <p>미래문해력 기반 공동 교육과정과 공유형 교육생태계를 구축하여 전과정 문제설계형 융합인재 4,000명 이상 양성</p>
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
