<script>
export default {
  name: 'NewsletterView'
}
</script>

<template>
  <section class="page">
    <h3>뉴스레터</h3>
    <div class="empty-state">게시글이 없습니다.</div>
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 20px;
}

.empty-state {
  padding: 80px 0;
  text-align: center;
  color: var(--color-muted);
  font-size: 14px;
  border-top: 1px solid var(--color-border);
}
</style>
