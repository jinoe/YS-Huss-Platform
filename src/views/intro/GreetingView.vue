<script>
export default {
  name: 'GreetingView'
}
</script>

<template>
  <section class="page">
    <h3>사업단장 인사말</h3>
    <p class="lead">
      미래문해력을 갖춘, 인간 중심 미래사회 전환을 주도하는<br />
      전과정 문제설계형 융합인재의 양성
    </p>
    <div class="greeting-body">
      <p>안녕하십니까, 연세대학교 HUSS 사업단장 강연아입니다.</p>
      <p>
        본 컨소시엄은 교육부 인문사회융합인재양성사업(HUSS)의 일환으로, 연세대학교(주관)와 국립공주대학교, 동의대학교,
        이화여자대학교, 한동대학교가 함께하는 「인간 중심 미래사회를 위한 서사·상상력·문화 전략 융합인재양성
        컨소시엄」입니다. 우리는 미래사회의 잠재적 문제를 선제적으로 발굴하고, 인간 중심의 대안을 설계·구현·확산할
        수 있는 다음 세대 인재를 양성하고자 출범했습니다.
      </p>
      <p>
        AI 시대의 미래는 단순히 예측하거나 수용하는 대상이 아닙니다. 우리 컨소시엄은 미래통찰 상상력, 인간가치
        해석력, 대안 구성 설계력, 인문사회기반 AI·디지털 기술 활용력, 사회전환 실행 역량을 통합한 FLASH 핵심역량을
        바탕으로, 미래를 서사적으로 상상하고 해석하며 실천으로 이어갈 수 있는 문제설계형 융합인재를 길러내고
        있습니다.
      </p>
      <p>
        다섯 개 대학은 각자의 특화 역량 — 연세대학교의 총괄·AI 구현, 국립공주대학교의 미래 서사·영상·미디어,
        동의대학교의 지역 리빙랩·문화 혁신, 이화여자대학교의 가치·윤리·포용적 문화전략, 한동대학교의 디자인
        실행·서비스 구현 — 을 연계하여 공동 교육과정과 공유형 교육생태계를 구축·운영하고 있습니다.
      </p>
      <p>
        앞으로도 본 컨소시엄은 인간 중심 미래사회 전환을 위한 혁신적 인재 양성에 최선을 다하겠습니다. 지속적인
        관심과 성원을 부탁드립니다. 감사합니다.
      </p>
    </div>
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 20px;
}

.lead {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.6;
  margin: 0 0 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.greeting-body p {
  color: var(--color-text);
  line-height: 1.8;
  margin: 0 0 20px;
}
</style>
