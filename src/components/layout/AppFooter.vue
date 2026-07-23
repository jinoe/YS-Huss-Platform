<script>
export default {
  name: 'AppFooter'
}
</script>

<template>
  <footer class="app-footer">
    <div class="container">
      <p>{{ $t('footer.address') }}</p>
      <p class="policy">{{ $t('footer.policy') }}</p>
      <p class="copyright">{{ $t('footer.copyright') }}</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: auto;
  background: #f5f5f5;
  padding: 32px 0;
  color: var(--color-muted);
  font-size: 13px;
  text-align: center;
}

.policy {
  text-decoration: underline;
}

.copyright {
  margin-top: 8px;
  font-size: 12px;
}
</style>
