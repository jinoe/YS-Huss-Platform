<script>
export default {
  name: 'ClubView',
  data() {
    return {
      clubs: [
        {
          name: '미래문해력 서포터즈',
          items: ['SNS 홍보', '수강 후기 공유', '우수 프로젝트 확산']
        }
      ]
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>동아리</h3>
    <div class="club-list">
      <div v-for="club in clubs" :key="club.name" class="club-card">
        <h5>{{ club.name }}</h5>
        <ul>
          <li v-for="item in club.items" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 20px;
}

.club-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.club-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.club-card h5 {
  font-size: 16px;
  margin: 0 0 12px;
  color: var(--color-primary);
}

.club-card ul {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.8;
}
</style>
