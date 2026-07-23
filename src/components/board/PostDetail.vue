<script>
export default {
  name: 'PostDetail',
  props: {
    post: {
      type: Object,
      default: null
    },
    listTo: {
      type: String,
      required: true
    },
    listLabel: {
      type: String,
      default: '목록'
    }
  }
}
</script>

<template>
  <section class="page">
    <div v-if="post" class="post-detail">
      <header class="post-header">
        <span v-if="post.notice" class="notice-badge">공지</span>
        <h3>{{ post.title }}</h3>
        <div class="post-meta">
          <span v-if="post.author">{{ post.author }}</span>
          <span>{{ post.date }}</span>
          <span v-if="post.views !== undefined">조회 {{ post.views }}</span>
        </div>
      </header>
      <img v-if="post.image" :src="post.image" :alt="post.title" class="post-image" />
      <div class="post-content">{{ post.content }}</div>
      <div class="post-actions">
        <router-link :to="listTo" class="list-button">{{ listLabel }}</router-link>
      </div>
    </div>
    <div v-else class="not-found">
      <p>게시글을 찾을 수 없습니다.</p>
      <router-link :to="listTo" class="list-button">{{ listLabel }}</router-link>
    </div>
  </section>
</template>

<style scoped>
.post-header {
  padding-bottom: 20px;
  border-bottom: 2px solid var(--color-text);
}

.notice-badge {
  display: inline-block;
  background: var(--color-accent);
  color: #fff;
  font-size: 11px;
  border-radius: 999px;
  padding: 2px 8px;
  margin-bottom: 8px;
}

.post-header h3 {
  font-size: 20px;
  margin: 0 0 12px;
  line-height: 1.4;
}

.post-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--color-muted);
}

.post-image {
  display: block;
  width: 100%;
  max-width: 640px;
  margin: 24px auto 0;
  border-radius: 8px;
}

.post-content {
  padding: 32px 4px;
  min-height: 160px;
  font-size: 14px;
  line-height: 1.9;
  color: var(--color-text);
  white-space: pre-line;
  border-bottom: 1px solid var(--color-border);
}

.post-actions {
  padding-top: 20px;
  display: flex;
  justify-content: center;
}

.not-found {
  padding: 80px 0;
  text-align: center;
  color: var(--color-muted);
}

.not-found p {
  margin-bottom: 20px;
}

.list-button {
  display: inline-block;
  padding: 10px 28px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.list-button:hover {
  background: var(--bg-soft);
}
</style>
