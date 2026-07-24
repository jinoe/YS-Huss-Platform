<script>
import results from '../../data/results.js'

export default {
  name: 'PerformanceSection',
  data() {
    return {
      items: results.slice(0, 4)
    }
  }
}
</script>

<template>
  <section class="performance">
    <div class="container">
      <h2>{{ $t('home.performanceTitle') }}</h2>
      <div v-if="items.length" class="card-grid">
        <router-link v-for="item in items" :key="item.id" :to="`/share/${item.id}`" class="card">
          <div class="thumb" :style="{ backgroundImage: `url(${item.image})` }" />
          <h3>{{ item.title }}</h3>
          <p class="date">{{ item.date }}</p>
        </router-link>
      </div>
      <div v-else class="empty-state">게시글이 없습니다.</div>
    </div>
  </section>
</template>

<style scoped>
.performance {
  padding: 64px 0;
  text-align: center;
}

.performance h2 {
  font-size: 24px;
  margin-bottom: 32px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  text-align: left;
}

.card {
  display: block;
  border-radius: 8px;
  overflow: hidden;
  color: var(--color-text);
}

.thumb {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--bg-soft) center / cover no-repeat;
}

.thumb::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 28px;
  height: 6px;
  background: var(--color-primary);
}

.card h3 {
  font-size: 14px;
  margin: 12px 0 4px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card:hover h3 {
  color: var(--color-accent);
}

.date {
  font-size: 12px;
  color: var(--color-muted);
  margin: 0;
}

.empty-state {
  padding: 48px 0;
  text-align: center;
  color: var(--color-muted);
  font-size: 14px;
  border-top: 1px solid var(--color-border);
}

@media (max-width: 900px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
