<script>
export default {
  name: 'ConsortiumView',
  data() {
    return {
      competencies: [
        '미래상상·예측력(Futures Imagination & Foresight)',
        '인문기반 AI 문해력(Literacy in Humanities-Grounded AI)',
        '대안설계 지능(Alternative Design Intelligence)',
        '사회전환 실행역량(Societal Transformation Agency)',
        '인간중심 의미해석력(Human-centered Sensemaking)'
      ],
      strategies: ['공통 교육과정 운영', '단계형 학습모델 운영', '디그리·인증체계 운영', '캡스톤 및 성과확산 운영', '진로·연구 연계 체계 구축'],
      universities: [
        {
          name: '연세대학교',
          role: '주관 · 수도권 · 총괄·통합·AI 구현',
          depts: '언더우드국제대학 융합인문사회과학부 — 창의기술경영(CTM), 문화디자인경영(CDM), 정보인터랙션디자인(IID), 지속개발협력(SDC), 과학기술정책(STP), 사회정의리더십(JCL), 계량위험관리(QRM), 아시아학(AS)'
        },
        {
          name: '국립공주대학교',
          role: '참여 · 충청권 · 미래 서사·영상·미디어',
          depts: '통합디자인학과, 영상학과, 애니메이션전공'
        },
        {
          name: '동의대학교',
          role: '참여 · 동남권 · 지역 리빙랩·문화 혁신',
          depts: '국어국문학과, 문헌정보학과, 심리학과, 영화학과'
        },
        {
          name: '이화여자대학교',
          role: '참여 · 수도권 · 가치·윤리·포용적 문화전략',
          depts: '스크랜튼학부, 국제학부, 뇌인지과학부, 기독교학과, 여성학과'
        },
        {
          name: '한동대학교',
          role: '참여 · 대경강원권 · 디자인 실행·서비스 구현',
          depts: '제품디자인전공, 시각디자인전공, 건축전공, 전산전공, UX융합전공'
        }
      ]
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>컨소시엄 구성</h3>

    <p class="vision-text">
      <strong>비전</strong> · 미래문해력 기반 공동 교육과정과 공유형 교육생태계로 인간 중심 미래사회 전환을 주도하는
      융합인재양성 컨소시엄
    </p>
    <p class="vision-text">
      <strong>목표</strong> · 미래사회의 잠재적 문제를 선제적으로 발굴하고 인간 중심의 대안을 설계·구현·확산할 수 있는
      전과정 문제설계형 융합인재 4,000명 이상 양성
    </p>

    <h4>핵심 역량</h4>
    <div class="chip-row">
      <span v-for="c in competencies" :key="c" class="chip">{{ c }}</span>
    </div>

    <h4>핵심 추진전략</h4>
    <div class="chip-row">
      <span v-for="s in strategies" :key="s" class="chip strategy">{{ s }}</span>
    </div>

    <h4>참여대학(참여학과)</h4>
    <div class="university-list">
      <div v-for="u in universities" :key="u.name" class="university-card">
        <div class="university-head">
          <span class="university-name">{{ u.name }}</span>
          <span class="university-role">{{ u.role }}</span>
        </div>
        <p class="university-depts">{{ u.depts }}</p>
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

.vision-text {
  font-size: 14px;
  line-height: 1.7;
  margin: 0 0 8px;
  color: var(--color-text);
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
  color: var(--color-text);
}

.chip.strategy {
  background: var(--color-primary-dark);
  color: #fff;
}

.university-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.university-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px 20px;
}

.university-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.university-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary);
}

.university-role {
  font-size: 12px;
  color: var(--color-muted);
}

.university-depts {
  font-size: 13px;
  color: var(--color-text);
  line-height: 1.6;
  margin: 0;
}
</style>
