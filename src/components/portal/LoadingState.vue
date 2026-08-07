<script>
export default {
  name: 'LoadingState',
  props: {
    label: {
      type: String,
      default: '불러오는 중...'
    }
  }
}
</script>

<template>
  <div class="loading-state">
    <span class="loading-spinner" />
    <span class="loading-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 0;
  color: var(--color-muted);
  font-size: 14px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: loading-spin 0.7s linear infinite;
}

@keyframes loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
