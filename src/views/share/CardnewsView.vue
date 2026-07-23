<script>
import cardnews from '../../data/cardnews.js'

export default {
  name: 'CardnewsView',
  data() {
    return {
      items: cardnews
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>카드뉴스</h3>
    <div class="card-grid">
      <router-link v-for="item in items" :key="item.id" :to="`/share/cardnews/${item.id}`" class="card">
        <div class="thumb" :style="{ backgroundImage: `url(${item.image})` }" />
        <p class="title">{{ item.title }}</p>
        <p class="date">{{ item.date }}</p>
      </router-link>
    </div>
    <div class="pagination">
      <span class="active">1</span>
      <span>2</span>
    </div>
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.card {
  display: block;
  color: var(--color-text);
}

.thumb {
  position: relative;
  aspect-ratio: 1;
  background: var(--bg-soft) center / cover no-repeat;
  border-radius: 8px;
  overflow: hidden;
}

.thumb::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 5px;
  background: var(--color-primary);
}

.title {
  font-size: 12px;
  margin: 8px 0 4px;
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
  font-size: 11px;
  color: var(--color-muted);
  margin: 0;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
  font-size: 13px;
  color: var(--color-muted);
}

.pagination .active {
  color: var(--color-primary);
  font-weight: 700;
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
