<script>
export default {
  name: 'WithusView',
  data() {
    return {
      letters: [
        {
          letter: 'W',
          title: 'Welfare promotion through just economy and appropriate technology',
          desc: '공정가치 역량과 통합 역량, 소통역량을 통해서 공정경제와 적정기술을 통한 복지 증진을 추구하는 인재'
        },
        {
          letter: 'I',
          title: 'Integration of tradition with future technology thinking',
          desc: '통합역량과 지구 리터러시 역량을 기반으로 산업/도시 전통과 미래기술을 통합하여 사고하는 인재'
        },
        {
          letter: 'T',
          title: 'Transformation management for sustainable society',
          desc: '분석 및 변화관리 역량을 토대로 변화관리를 주도하는 인재'
        },
        {
          letter: 'H',
          title: 'Human resources development for sustainability',
          desc: '도시와 산업에 대한 리터러시 역량과 소통역량, 통합역량 등을 기반으로 도시 및 산업의 지속가능한 공생과 성장을 이끄는 인재'
        },
        {
          letter: 'U',
          title: 'Uplifting the cooperation in global resources',
          desc: '거버넌스 역량, 지구 리터러시 역량을 토대로 글로벌 인적 자원 및 물적자원의 협력을 증진하는 인재'
        },
        {
          letter: 'S',
          title: 'Symbiosis between countries and regions',
          desc: '궁극적으로 국가와 지역 간의 공생과 성장에 기여하는 인재'
        }
      ]
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>WITHUS 인재상</h3>
    <div class="tag-row">
      <span class="tag">글로벌 리소스 코디네이터</span>
      <span class="tag">산업/도시의 지속가능성 전문가</span>
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
