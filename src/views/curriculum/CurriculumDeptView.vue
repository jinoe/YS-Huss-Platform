<script>
export default {
  name: 'CurriculumDeptView',
  data() {
    return {
      departments: [
        {
          code: 'CS',
          name: '문화사회학과 (Culture & Society)',
          mission: 'Culture, Society and Innovation',
          identity: '아시아의 문화와 사회를 비판적으로 읽고 혁신적으로 재해석하는 학과',
          signature: '인문·사료 텍스트 + 동시대 문화·미디어 텍스트 · 역사학·문헌 분석·문화연구',
          tracks: '아시아학 전공'
        },
        {
          code: 'QF',
          name: '계량금융학과 (Quantitative Finance)',
          mission: 'Quantitative Finance and Innovation',
          identity: '불확실성을 시계열로 계량하고 금융의 미래를 혁신하는 학과',
          signature: '금융 시계열 데이터 · 계량경제·금융공학, AI 금융·대체데이터',
          tracks: '계량위험관리 전공'
        },
        {
          code: 'DT',
          name: '디자인기술학과 (Design & Technology)',
          mission: 'Design, Technology and Innovation',
          identity: '디자인(CDM·IID)과 기술(CTM)을 제품·서비스·벤처 혁신으로 잇는 학과',
          signature: '컬처 데이터·모션 데이터·비즈니스 데이터 · 디자인 리서치, HCI, 비즈니스 애널리틱스',
          tracks: '문화디자인경영(CDM) · 정보인터랙션디자인(IID) · 창의기술경영(CTM) 3트랙'
        },
        {
          code: 'SG',
          name: '지속거버넌스학과 (Sustainability & Governance)',
          mission: 'Sustainability, Governance and Innovation',
          identity: '지속가능성과 정의를 거버넌스·사회혁신으로 설계하고 계산사회과학으로 진단하는 학과',
          signature: '정책·담론·사회 데이터 · 계산사회과학(통계·ML·LLM)',
          tracks: '통합사회과학 전공 (舊 지속개발협력·과학기술정책·사회정의리더십 통합)'
        }
      ]
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>HASS 혁신학과 (Division of Innovation)</h3>
    <p class="intro-text">
      언더우드국제대학 HASS Division은 기존 3학부 8전공을 4개 혁신학과로 재편하여, 인문·사회·예술·정량의
      지혜로 각 도메인의 혁신을 설계합니다.
    </p>
    <div class="dept-list">
      <div v-for="d in departments" :key="d.code" class="dept-card">
        <div class="dept-head">
          <span class="dept-code">{{ d.code }}</span>
          <div>
            <p class="dept-name">{{ d.name }}</p>
            <p class="dept-mission">{{ d.mission }}</p>
          </div>
        </div>
        <p class="dept-identity">{{ d.identity }}</p>
        <p class="dept-row"><strong>시그니처</strong> {{ d.signature }}</p>
        <p class="dept-row"><strong>보유 전공/트랙</strong> {{ d.tracks }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 12px;
}

.intro-text {
  color: var(--color-muted);
  line-height: 1.7;
  margin: 0 0 24px;
}

.dept-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dept-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.dept-head {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 12px;
}

.dept-code {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--color-primary-dark);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
}

.dept-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary);
  margin: 0;
}

.dept-mission {
  font-size: 12px;
  color: var(--color-muted);
  margin: 2px 0 0;
}

.dept-identity {
  font-size: 13px;
  color: var(--color-text);
  line-height: 1.6;
  margin: 0 0 12px;
}

.dept-row {
  font-size: 13px;
  color: var(--color-text);
  margin: 6px 0;
  line-height: 1.6;
}
</style>
