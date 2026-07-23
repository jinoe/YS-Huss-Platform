<script>
export default {
  name: 'ConsortiumView',
  data() {
    return {
      competencies: ['통합역량', '지구리터러시역량', '변화관리역량', '거버넌스역량', '공정가치역량', '사회기여역량'],
      strategies: ['교육체계 구축', '교육방법 혁신', '대내외 연계협력 확대', '학사제도 개선 및 행정 효율화'],
      universities: [
        {
          name: '광운대',
          role: '허브 · 초연결지향·초융합지향 강의 인프라 개발 전문',
          depts: '국제통상학부, 국제학부, 법학부, 행정학과, 미디어커뮤니케이션학부, 국어국문학과, 영어산업학과, 정보융합학부'
        },
        {
          name: '국민대',
          role: '수도권 · 기후변화전문 융합교육 전문 교과과정 플랫폼 전문',
          depts: '한국어문학부, 한국역사학과, 사회학과, 행정학과, 경영정보학부, 정치외교학과, KIBS, 임산생명공학과, 건설시스템공학부'
        },
        {
          name: '선문대',
          role: '충청 · SW전문가 국제화선도 교육콘텐츠 개발 전문',
          depts: '외국어학부, 경영학과, 국제관계학과, 글로벌 관광학부, 건축학부(건축학전공)'
        },
        {
          name: '영남대',
          role: '경상 · 세계화선도 한국어 전문, 지역콘텐츠 전문',
          depts: '사회학과, 경영학과, 글로벌교육학부, 무역학과, 화학공학부'
        },
        {
          name: '호남대',
          role: '전라 · 융합인재양성 교수법혁신, 국제교류 전문',
          depts: '교양대학 교양학부, 경영학부, 관광경영학과, 글로벌 한국어교육학과, 토목환경공학과'
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
      <strong>비전</strong> · 글로벌 지속가능 공생과 성장을 주도하는 인문사회융합 전문인재양성 컨소시엄
    </p>
    <p class="vision-text">
      <strong>목표</strong> · 글로벌 공생에 기여하는 지속가능 자원 대응력, 지속가능 산업 이해력, 지속가능 (국제)사회
      포용력을 갖춘 핵심 융합인재 2,500명 양성
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
