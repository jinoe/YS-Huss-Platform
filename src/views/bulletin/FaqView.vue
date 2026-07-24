<script>
export default {
  name: 'FaqView',
  data() {
    return {
      openIndex: null,
      faqs: [
        { q: '나노디그리와 마이크로디그리의 차이는 무엇인가요?', a: 'HUSS 교과목 중 6학점(2과목)을 이수하면 나노디그리, 9학점(3과목)을 이수하면 마이크로디그리 인증서가 발급됩니다.' },
        { q: '타 대학 개설 교과목도 수강할 수 있나요?', a: '컨소시엄 참여대학(연세대·국립공주대·동의대·이화여대·한동대) 간 학점교류 협정을 통해 타 대학 개설 교과목을 수강할 수 있습니다.' },
        { q: '이수증은 어디서 발급받나요?', a: '이수증은 HUSS 포탈의 LMS 메뉴에서 온라인으로 발급받을 수 있습니다.' },
        { q: '비교과 프로그램 참여는 어떻게 신청하나요?', a: '정보광장 > 공지사항에서 모집 공고를 확인하고, 각 공고에 안내된 신청 링크를 통해 신청할 수 있습니다.' }
      ]
    }
  },
  methods: {
    toggle(index) {
      this.openIndex = this.openIndex === index ? null : index
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>FAQ</h3>
    <div class="faq-list">
      <div v-for="(faq, index) in faqs" :key="faq.q" class="faq-item">
        <button type="button" class="faq-question" @click="toggle(index)">
          <span>Q. {{ faq.q }}</span>
          <span class="chevron" :class="{ open: openIndex === index }">›</span>
        </button>
        <p v-if="openIndex === index" class="faq-answer">A. {{ faq.a }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 20px;
}

.faq-list {
  display: flex;
  flex-direction: column;
}

.faq-item {
  border-bottom: 1px solid var(--color-border);
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  text-align: left;
  padding: 18px 4px;
  font-size: 14px;
  font-weight: 600;
}

.chevron {
  transform: rotate(90deg);
  transition: transform 0.15s ease;
  color: var(--color-muted);
}

.chevron.open {
  transform: rotate(270deg);
}

.faq-answer {
  padding: 0 4px 20px;
  margin: 0;
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.7;
}
</style>
