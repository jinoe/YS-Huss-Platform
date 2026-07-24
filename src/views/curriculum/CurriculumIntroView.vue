<script>
export default {
  name: 'CurriculumIntroView',
  data() {
    return {
      stages: [
        { code: 'D', name: 'Discovering Futures', desc: '미래 서사 및 상상 — 미래를 서사적으로 상상하고 변화의 징후를 읽어내는 단계' },
        { code: 'I', name: 'Identifying Human-centered Future Issues', desc: '인간 중심 문제 정의 — 미래사회의 잠재적 문제를 인간 중심 관점에서 발굴·정의하는 단계' },
        { code: 'V', name: 'Visioning Alternatives', desc: '경험·서비스 설계 — 문제에 대한 대안을 경험·서비스·시스템으로 설계하는 단계' },
        { code: 'E', name: 'Expanding into Society', desc: '지역사회 실험 및 사회적 확산 — 설계한 대안을 지역사회·산업 현장에서 실증하고 확산하는 단계' }
      ]
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>교육과정 소개</h3>
    <p class="intro-text">
      본 교육과정은 미래문해력을 기반으로 미래를 읽고, 문제를 발굴·정의하며, 인간 중심의 대안을 설계·구현·확산할
      수 있는 전과정 문제설계형 융합인재를 양성하기 위한 미래문해력 융합교육모델을 따릅니다.
    </p>

    <h4>1단계 · 공통 교과목을 통한 기초 관점 형성</h4>
    <p class="stage-desc">
      미래문해력의 핵심 개념과 공통 문제의식을 컨소시엄 공통 교과목으로 개발하여, 미래를 읽고 인간 중심의 관점에서
      해석할 수 있는 기초 역량을 형성합니다.
    </p>

    <h4>2단계 · 단계별 역량 심화 (DIVE 학습모델)</h4>
    <div class="stage-grid">
      <div v-for="s in stages" :key="s.code" class="stage-card">
        <span class="stage-code">{{ s.code }}</span>
        <div>
          <p class="stage-name">{{ s.name }}</p>
          <p class="stage-text">{{ s.desc }}</p>
        </div>
      </div>
    </div>

    <h4>3단계 · 대학별 특화과정을 통한 심화 교육과정</h4>
    <p class="stage-desc">
      각 참여대학은 DIVE 학습모델의 4단계 주기를 포함하는 특화과정을 개발·운영하며, 대학별 특색을 살려 4단계 중
      2개 이상의 단계에 특화된 심화과정을 제공합니다.
    </p>

    <h4>4단계 · 캡스톤 및 학·석사 연계 연구를 통한 통합적 실현</h4>
    <p class="stage-desc">
      공통 교과목과 특화과정에서 축적한 학습성과를 캡스톤, 연구형 수업, 학부–대학원 연계를 통해 통합적으로
      실현하고, 성과 발표회와 지역사회·산업·공공영역 연계를 통해 사회적으로 확산합니다.
    </p>
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

.intro-text {
  color: var(--color-muted);
  line-height: 1.7;
  margin: 0;
}

.stage-desc {
  color: var(--color-text);
  line-height: 1.7;
  margin: 0;
}

.stage-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stage-card {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px 20px;
}

.stage-code {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--color-primary-dark);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
}

.stage-name {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 4px;
}

.stage-text {
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.6;
  margin: 0;
}
</style>
