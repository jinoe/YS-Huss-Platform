<script>
export default {
  name: 'OrganizationView',
  data() {
    return {
      departments: [
        '언더우드국제대학 융합인문사회과학부', '창의기술경영(CTM)', '문화디자인경영(CDM)', '정보인터랙션디자인(IID)',
        '지속개발협력(SDC)', '과학기술정책(STP)', '사회정의리더십(JCL)', '계량위험관리(QRM)', '아시아학(AS)'
      ],
      committees: [
        {
          name: '사업단장협의회',
          composition: '주관·참여대학 사업단장',
          duties: ['컨소시엄 비전·목표 조정', '대학별 역할 분담', '예산·성과·학사제도 주요 의사결정'],
          schedule: '연 2회 이상 또는 주요 안건 발생 시'
        },
        {
          name: '사업관리위원회',
          composition: '각 대학 사업단장, 운영책임자, 행정실무자 등',
          duties: ['사업계획 수립·변경', '예산 집행 및 점검', '사업 성과 관리'],
          schedule: '정기회의 및 필요시 수시'
        },
        {
          name: '사업운영위원회',
          composition: '주관대학 총괄사업단, 참여대학 운영책임자, 행정실무자',
          duties: ['공동 프로그램 운영, 학사 이슈 조정', '대학별 사업 추진', '예산 집행', '프로그램 운영 관리'],
          schedule: '학기별 1회 이상'
        },
        {
          name: '교육과정위원회',
          composition: '대학별 교육과정 책임교원, 외부 교육전문가, 산업·문화기관 전문가',
          duties: ['교과 및 비교과 교육과정 심의', '공통교과·특화교과 운영 점검', '필요 시 교육학 전문가 또는 외부 산업·문화기관 전문가 참여'],
          schedule: '학기 시작 2개월 전 정례 개최'
        },
        {
          name: '자체성과관리위원회',
          composition: '내·외부 전문가, 학생대표, 성과관리 담당자',
          duties: ['대학별 성과 점검, 자체평가, 환류계획 수립', '외부위원 포함', '필요 시 외부위원장 체계 검토'],
          schedule: '학기별·연차별 평가'
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
