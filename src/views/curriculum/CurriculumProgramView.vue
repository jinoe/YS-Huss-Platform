<script>
export default {
  name: 'CurriculumProgramView',
  data() {
    return {
      programs: [
        {
          name: '미래디자인 DIVE 캠프',
          tag: '컨소시엄 공동 프로그램',
          desc: 'DIVE 4단계(상상–정의–설계–확산) 학습주기를 압축 체험하는 컨소시엄 공동 캠프'
        },
        {
          name: 'AI 해커톤',
          tag: '비교과-Advanced',
          desc: '공동 성과발표회(콜로키움)와 연계한 프로젝트 중심의 AI 해커톤'
        },
        {
          name: '퓨처스 캠프',
          tag: '비교과-Applied',
          desc: '미래 서사와 상상력을 주제로 한 확산적 참여형 프로그램'
        },
        {
          name: '글로벌 워크숍',
          tag: '비교과-Applied',
          desc: '해외 대학·기관과 연계한 글로벌 확산 프로그램'
        },
        {
          name: '지역 리빙랩 프로젝트',
          tag: '지역사회 연계',
          desc: '설계한 대안을 지역사회·산업 현장에서 실증하고 사회적으로 확산하는 프로젝트'
        }
      ]
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>비교과프로그램</h3>
    <p class="intro-text">
      교과목 이수에 머무르지 않고 캡스톤, 리빙랩, 지역사회 연계 프로그램을 통해 실제 문제해결과 사회적 확산으로
      이어지도록 설계된 비교과 프로그램입니다.
    </p>
    <div class="program-list">
      <div v-for="p in programs" :key="p.name" class="program-card">
        <div class="program-head">
          <span class="program-name">{{ p.name }}</span>
          <span class="program-tag">{{ p.tag }}</span>
        </div>
        <p class="program-desc">{{ p.desc }}</p>
      </div>
    </div>
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

.program-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.program-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px 20px;
}

.program-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.program-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--color-primary);
}

.program-tag {
  font-size: 12px;
  color: var(--color-muted);
}

.program-desc {
  font-size: 13px;
  color: var(--color-text);
  line-height: 1.6;
  margin: 0;
}
</style>
