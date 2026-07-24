<script>
export default {
  name: 'WithusView',
  data() {
    return {
      letters: [
        {
          letter: 'F',
          title: 'Futures Imagination & Foresight',
          desc: '미래를 서사적으로 상상하고 사회·문화적 변화를 선제적으로 예측하는 역량 (국립공주대학교 미래 서사·영상·미디어 트랙과 연계)'
        },
        {
          letter: 'L',
          title: 'Literacy in Humanities-Grounded AI',
          desc: '인문사회적 통찰을 바탕으로 AI·디지털 기술을 이해하고 활용하는 역량 (연세대학교 AI 프로토타이핑 랩과 연계)'
        },
        {
          letter: 'A',
          title: 'Alternative Design Intelligence',
          desc: '미래문해력을 바탕으로 인간 중심의 대안을 구체적으로 설계·구현하는 역량 (한동대학교 UX·서비스 디자인 트랙과 연계)'
        },
        {
          letter: 'S',
          title: 'Societal Transformation Agency',
          desc: '설계한 대안을 지역사회·산업 현장에서 실천하고 사회적으로 확산하는 역량 (동의대학교 지역 리빙랩·문화 혁신 트랙과 연계)'
        },
        {
          letter: 'H',
          title: 'Human-centered Sensemaking',
          desc: '인간 중심의 관점에서 사회·문화적 의미를 해석하고 가치 전환을 읽어내는 역량 (이화여자대학교 가치·윤리·포용적 문화전략 트랙과 연계)'
        }
      ]
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>FLASH 인재상</h3>
    <div class="tag-row">
      <span class="tag">전과정 문제설계형 융합인재</span>
      <span class="tag">미래문해력 기반 실천적 종합 역량자</span>
    </div>
    <div class="letter-grid">
      <div v-for="item in letters" :key="item.letter" class="letter-card">
        <span class="letter">{{ item.letter }}</span>
        <div>
          <p class="letter-title">{{ item.title }}</p>
          <p class="letter-desc">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 16px;
}

.tag-row {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

.tag {
  background: var(--bg-soft);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 999px;
}

.letter-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.letter-card {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.letter {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--color-primary-dark);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
}

.letter-title {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 6px;
}

.letter-desc {
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .letter-card {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
