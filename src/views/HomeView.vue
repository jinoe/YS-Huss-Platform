<script>
import HeroCarousel from '../components/home/HeroCarousel.vue'
import PerformanceSection from '../components/home/PerformanceSection.vue'
import NoticeBoard from '../components/home/NoticeBoard.vue'
import ScheduleSection from '../components/home/ScheduleSection.vue'

export default {
  name: 'HomeView',
  components: {
    HeroCarousel,
    PerformanceSection,
    NoticeBoard,
    ScheduleSection
  }
}
</script>

<template>
  <div>
    <HeroCarousel />
    <PerformanceSection />
    <NoticeBoard />
    <ScheduleSection />
  </div>
</template>
