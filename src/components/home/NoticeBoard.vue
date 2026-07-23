<script>
import notices from '../../data/notices.js'
import partnerNotices from '../../data/partnerNotices.js'

export default {
  name: 'NoticeBoard',
  data() {
    return {
      boards: [
        {
          titleKey: 'home.noticeTitle',
          basePath: '/bulletin',
          items: notices.slice(0, 5)
        },
        {
          titleKey: 'home.partnerNoticeTitle',
          basePath: '/bulletin/partner-notice',
          items: partnerNotices.slice(0, 5)
        }
      ]
    }
  }
}
</script>

<template>
  <section class="notice-section">
    <div class="container notice-grid">
      <div v-for="board in boards" :key="board.titleKey" class="board">
        <h3>{{ $t(board.titleKey) }}</h3>
        <ul>
          <li v-for="item in board.items" :key="item.id">
            <router-link :to="`${board.basePath}/${item.id}`" class="item-title">{{ item.title }}</router-link>
            <span class="item-date">{{ item.date }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.notice-section {
  padding: 0 0 64px;
}

.notice-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.board {
  position: relative;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.board::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 5px;
  background: var(--color-primary);
}

.board h3 {
  margin: 0 0 16px;
  font-size: 18px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-text);
}

.board ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.board li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 14px;
}

.item-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text);
}

.item-title:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

.item-date {
  flex-shrink: 0;
  color: var(--color-muted);
  font-size: 12px;
}

@media (max-width: 768px) {
  .notice-grid {
    grid-template-columns: 1fr;
  }
}
</style>
