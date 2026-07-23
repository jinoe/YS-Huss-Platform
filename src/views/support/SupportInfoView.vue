<script>
export default {
  name: 'SupportInfoView',
  data() {
    return {
      requirements: [
        { type: '나노디그리', condition: 'HUSS 마이크로디그리 교과목 중 6학점(2과목) 이수' },
        { type: '마이크로디그리', condition: 'HUSS 교과목 중 9학점(3과목) 이수' }
      ]
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>지원제도</h3>

    <h4>마이크로디그리 / 나노디그리 수여</h4>
    <p class="desc">희망하는 전문 분야와 역량에 따라 교과 과정 설계가 가능합니다. 자세한 사항은 교육과정 &gt; 마이크로디그리 메뉴에서 확인할 수 있습니다.</p>

    <h4>이수요건</h4>
    <table class="req-table">
      <thead>
        <tr>
          <th>구분</th>
          <th>이수요건</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in requirements" :key="r.type">
          <td>{{ r.type }}</td>
          <td>{{ r.condition }}</td>
        </tr>
      </tbody>
    </table>

    <div class="info-grid">
      <div class="info-card">
        <h5>프로그램 인증서 수여</h5>
        <p>비교과 프로그램 참여 시 인증서 수여. 인증서 발급은 LMS 홈페이지에서 가능합니다.</p>
      </div>
      <div class="info-card">
        <h5>표준현장실습학기제(인턴)</h5>
        <p>직무능력향상과 취업역량강화를 위한 표준현장실습학기제 운영. 실무 경험 제공 및 학점 인정.</p>
      </div>
      <div class="info-card">
        <h5>장학금</h5>
        <p>성적 및 활동 우수자에게 장학금을 수여합니다.</p>
      </div>
      <div class="info-card">
        <h5>마일리지</h5>
        <p>비교과 활동 참여에 따른 마일리지 적립 제도입니다.</p>
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
  margin: 28px 0 12px;
  color: var(--color-primary);
}

h4:first-of-type {
  margin-top: 0;
}

.desc {
  font-size: 14px;
  color: var(--color-muted);
  line-height: 1.7;
  margin: 0;
}

.req-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.req-table th,
.req-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
}

.req-table th {
  background: var(--bg-soft);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 28px;
}

.info-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.info-card h5 {
  font-size: 14px;
  margin: 0 0 8px;
}

.info-card p {
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
