<script>
export default {
  name: 'ConfirmModal',
  props: {
    message: {
      type: String,
      default: ''
    }
  },
  emits: ['confirm', 'cancel'],
  mounted() {
    window.addEventListener('keydown', this.onKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown)
  },
  methods: {
    onKeydown(event) {
      if (event.key === 'Escape' && this.message) this.$emit('cancel')
    }
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="message" class="modal-overlay" @click.self="$emit('cancel')">
      <div class="modal-box">
        <p class="modal-message">{{ message }}</p>
        <div class="modal-actions">
          <button type="button" class="modal-cancel" @click="$emit('cancel')">취소</button>
          <button type="button" class="modal-confirm" @click="$emit('confirm')">확인</button>
        </div>
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

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.modal-cancel {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-muted);
  cursor: pointer;
}

.modal-confirm {
  background: #c0392b;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
</style>
