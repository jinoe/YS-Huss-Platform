<script>
import results from '../../data/results.js'

export default {
  name: 'ResultView',
  data() {
    return {
      items: results
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>우수성과</h3>
    <div v-if="items.length" class="card-grid">
      <router-link v-for="item in items" :key="item.id" :to="`/share/${item.id}`" class="card">
        <div class="thumb" :style="{ backgroundImage: `url(${item.image})` }" />
        <p class="title">{{ item.title }}</p>
        <p class="date">{{ item.date }}</p>
      </router-link>
    </div>
    <div v-else class="empty-state">게시글이 없습니다.</div>
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  display: block;
  border-radius: 8px;
  color: var(--color-text);
}

.thumb {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--bg-soft) center / cover no-repeat;
  border-radius: 8px;
  overflow: hidden;
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

.title {
  font-size: 13px;
  margin: 10px 0 4px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card:hover .title {
  color: var(--color-accent);
}

.date {
  font-size: 12px;
  color: var(--color-muted);
  margin: 0;
}

.empty-state {
  padding: 80px 0;
  text-align: center;
  color: var(--color-muted);
  font-size: 14px;
  border-top: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
