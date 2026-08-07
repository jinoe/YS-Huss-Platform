<script>
export default {
  name: 'AlertModal',
  props: {
    message: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: 'error' // 'error' | 'warning' | 'success'
    }
  },
  emits: ['close'],
  mounted() {
    window.addEventListener('keydown', this.onKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown)
  },
  methods: {
    close() {
      this.$emit('close')
    },
    onKeydown(event) {
      if (event.key === 'Escape' && this.message) this.close()
    }
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="message" class="modal-overlay" @click.self="close">
      <div class="modal-box">
        <p class="modal-message" :class="variant">{{ message }}</p>
        <button type="button" class="modal-confirm" @click="close">확인</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1100;
}

.modal-box {
  width: 100%;
  max-width: 360px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.modal-message {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text);
  white-space: pre-wrap;
}

.modal-message.error {
  color: #c0392b;
}

.modal-message.warning {
  color: #8a6d00;
}

.modal-message.success {
  color: var(--color-primary);
}

.modal-confirm {
  align-self: flex-end;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
</style>
