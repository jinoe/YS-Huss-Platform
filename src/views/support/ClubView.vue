<script>
export default {
  name: 'ClubView',
  data() {
    return {
      clubs: [
        {
          name: '글로벌공생 서포터즈',
          items: [
            '글로벌 공생 HUSS 사업을 모니터링하며 프로그램의 수요자 맞춤형 개발을 돕는 서포터즈 선발',
            '홍보 활동으로 학생 참여와 관심 독려',
            '콘텐츠 제작 및 프로그램 지원',
            '임명장 및 장학금 지원'
          ]
        },
        {
          name: '공동학습공동체',
          items: ['학생의 자발적 참여로 이루어지는 학습공동체 튜터링 지원']
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
