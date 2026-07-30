<script>
import SyllabusDocument from './SyllabusDocument.vue'

export default {
  name: 'SyllabusModal',
  components: { SyllabusDocument },
  props: {
    course: {
      type: Object,
      default: null
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
      if (event.key === 'Escape' && this.course) this.close()
    }
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="course" class="modal-overlay" @click.self="close">
      <div class="modal-box">
        <div class="modal-bar">
          <span class="modal-title">{{ course.name }}</span>
          <button type="button" class="modal-close" @click="close">닫기 ✕</button>
        </div>
        <div class="modal-scroll">
          <SyllabusDocument :course="course" />
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
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
  z-index: 1000;
}

.modal-box {
  width: 100%;
  max-width: 900px;
  max-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  background: #fff;
}

.modal-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: #000;
  flex-shrink: 0;
}

.modal-title {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-close {
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  color: #fff;
  padding: 5px 12px;
  font-size: 12px;
  cursor: pointer;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.15);
}

.modal-scroll {
  overflow-y: auto;
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }
  .modal-box {
    max-height: 100vh;
  }
}
</style>
