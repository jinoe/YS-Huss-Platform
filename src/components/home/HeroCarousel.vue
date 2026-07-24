<script>
import heroSample from '../../assets/hero-sample.jpg'
import heroSample2 from '../../assets/hero-sample-2.jpg'
import heroSample3 from '../../assets/hero-sample-3.jpg'
import heroSample4 from '../../assets/hero-sample-4.jpg'

export default {
  name: 'HeroCarousel',
  data() {
    return {
      current: 0,
      timer: null,
      slides: [
        {
          title: '나노디그리 학점단위 인증제',
          titleEn: 'Nanodegree Credit Certification',
          desc: 'HUSS 사업단 나노디그리 과정 안내',
          descEn: 'An introduction to the HUSS nanodegree program',
          image: heroSample
        },
        {
          title: '인간 중심 미래사회 전환을 주도하는\n인문사회융합 전문인재양성 컨소시엄',
          titleEn: 'A Consortium Leading Human-centered\nFutures Transformation & Convergence Talent',
          desc: '미래문해력 기반 공동 교육과정으로 전과정 문제설계형 융합인재를 양성합니다',
          descEn: 'Cultivating problem-designing talent through a shared futures literacy curriculum',
          image: heroSample2
        },
        {
          title: '5개 대학이 함께하는\n컨소시엄 구성',
          titleEn: 'A Consortium of\nFive Universities',
          desc: '연세대·국립공주대·동의대·이화여대·한동대',
          descEn: 'Yonsei · Kongju National · Dongeui · Ewha Womans · Handong',
          image: heroSample3
        },
        {
          title: '"FLASH" 융합인재',
          titleEn: '"FLASH" Convergence Talent',
          desc: '미래문해력 기반 전과정 문제설계형 융합인재 교육과정',
          descEn: 'A curriculum for futures-literate, problem-designing convergence talent',
          image: heroSample4
        }
      ]
    }
  },
  computed: {
    currentSlide() {
      const slide = this.slides[this.current]
      const isEn = this.$i18n.locale === 'en'
      return {
        title: isEn ? slide.titleEn : slide.title,
        desc: isEn ? slide.descEn : slide.desc,
        image: slide.image
      }
    }
  },
  mounted() {
    this.startAutoplay()
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  methods: {
    startAutoplay() {
      this.timer = setInterval(this.next, 6000)
    },
    next() {
      this.current = (this.current + 1) % this.slides.length
    },
    prev() {
      this.current = (this.current - 1 + this.slides.length) % this.slides.length
    }
  }
}
</script>

<template>
  <section class="hero">
    <div v-if="!currentSlide.image" class="hero-bg" />
    <div
      v-else
      class="hero-photo"
      :style="{ backgroundImage: `url(${currentSlide.image})` }"
    />
    <div class="hero-inner container">
      <div class="hero-text">
        <h1>{{ currentSlide.title }}</h1>
        <p>{{ currentSlide.desc }}</p>
      </div>
      <div class="hero-controls">
        <span class="counter">{{ String(current + 1).padStart(2, '0') }} / {{ String(slides.length).padStart(2, '0') }}</span>
        <button class="ctrl-btn" @click="prev" aria-label="이전 슬라이드">‹</button>
        <button class="ctrl-btn" @click="next" aria-label="다음 슬라이드">›</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  margin-top: -72px;
  min-height: 560px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  color: #fff;
  background: var(--color-primary-dark);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.08), transparent 40%),
    radial-gradient(circle at 85% 75%, rgba(0, 56, 118, 0.45), transparent 45%),
    linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 55%, #004a99 100%);
}

.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to top, black, transparent 80%);
}

.hero-photo {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.hero-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(8, 15, 31, 0.85) 0%, rgba(8, 15, 31, 0.35) 45%, rgba(8, 15, 31, 0.15) 100%);
}

.hero-inner {
  position: relative;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding-block: 48px 56px;
}

.hero-text h1 {
  font-size: 34px;
  line-height: 1.35;
  margin: 0 0 12px;
  white-space: pre-line;
  font-weight: 800;
}

.hero-text p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
}

.hero-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.counter {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 1px;
}

.ctrl-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: transparent;
  color: #fff;
  font-size: 18px;
  line-height: 1;
}

.ctrl-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

@media (max-width: 768px) {
  .hero {
    min-height: 460px;
  }
  .hero-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  .hero-text h1 {
    font-size: 26px;
  }
}
</style>
