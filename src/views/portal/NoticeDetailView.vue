<script>
import session from '../../data/session.js'
import LoadingState from '../../components/portal/LoadingState.vue'
import AlertModal from '../../components/portal/AlertModal.vue'
import ConfirmModal from '../../components/portal/ConfirmModal.vue'
import * as coursesApi from '../../api/courses.js'
import * as professorApi from '../../api/professor.js'

export default {
  name: 'NoticeDetailView',
  components: { LoadingState, AlertModal, ConfirmModal },
  data() {
    return {
      session,
      course: null,
      notice: null,
      loading: true,
      loadError: '',
      actionError: '',
      editing: false,
      editForm: { title: '', content: '' },
      noticeToDelete: false,
      attachmentToDelete: null,
      busy: false
    }
  },
  async created() {
    await this.loadNotice()
  },
  computed: {
    isProfessor() {
      return this.session.role === 'professor'
    },
    courseId() {
      return Number(this.$route.params.id)
    },
    noticeId() {
      return Number(this.$route.params.noticeId)
    }
  },
  methods: {
    async loadNotice() {
      this.loading = true
      this.loadError = ''
      try {
        this.course = await coursesApi.detail(this.courseId)
        this.notice = this.course.notices.find((n) => n.id === this.noticeId) || null
        if (!this.notice) this.loadError = '공지를 찾을 수 없습니다.'
      } catch (e) {
        this.loadError = '공지를 불러오지 못했습니다.'
        console.error('[api] courses.detail', e)
      }
      this.loading = false
    },
    startEdit() {
      this.editForm = { title: this.notice.title, content: this.notice.content }
      this.editing = true
    },
    cancelEdit() {
      this.editing = false
    },
    async saveEdit() {
      if (this.busy) return
      this.busy = true
      this.actionError = ''
      try {
        await professorApi.updateNotice(this.courseId, this.notice.id, {
          title: this.editForm.title,
          content: this.editForm.content
        })
        this.notice.title = this.editForm.title
        this.notice.content = this.editForm.content
        this.editing = false
      } catch (e) {
        this.actionError = '공지 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'
        console.error('[api] professor.updateNotice', e)
      }
      this.busy = false
    },
    async confirmDeleteNotice() {
      if (this.busy) return
      this.busy = true
      this.noticeToDelete = false
      this.actionError = ''
      try {
        await professorApi.deleteNotice(this.courseId, this.notice.id)
        this.$router.push(`/portal/courses/${this.courseId}`)
      } catch (e) {
        this.actionError = '공지 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.'
        console.error('[api] professor.deleteNotice', e)
        this.busy = false
      }
    },
    async attachFile(event) {
      const file = event.target.files[0]
      if (!file || this.busy) return
      this.busy = true
      this.actionError = ''
      try {
        const result = await professorApi.addNoticeAttachment(this.courseId, this.notice.id, { file_name: file.name })
        this.notice.attachments.push({ id: result.id, fileName: result.fileName })
      } catch (e) {
        this.actionError = '첨부파일 등록에 실패했습니다. 잠시 후 다시 시도해주세요.'
        console.error('[api] professor.addNoticeAttachment', e)
      }
      event.target.value = ''
      this.busy = false
    },
    async confirmDeleteAttachment() {
      if (this.busy) return
      this.busy = true
      const attachment = this.attachmentToDelete
      this.attachmentToDelete = null
      this.actionError = ''
      try {
        await professorApi.deleteNoticeAttachment(this.courseId, this.notice.id, attachment.id)
        this.notice.attachments = this.notice.attachments.filter((a) => a.id !== attachment.id)
      } catch (e) {
        this.actionError = '첨부파일 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.'
        console.error('[api] professor.deleteNoticeAttachment', e)
      }
      this.busy = false
    }
  }
}
</script>

<template>
  <section v-if="loading" class="page">
    <LoadingState />
  </section>
  <section v-else-if="notice" class="page">
    <div class="notice-card">
      <div class="notice-card-header">
        <template v-if="editing">
          <input v-model="editForm.title" type="text" class="notice-edit-title" placeholder="제목" />
        </template>
        <h1 v-else class="notice-card-title">{{ notice.title }}</h1>
        <div v-if="isProfessor" class="notice-card-actions">
          <template v-if="editing">
            <button type="button" class="btn-secondary" :disabled="busy" @click="cancelEdit">취소</button>
            <button type="button" class="btn-primary" :disabled="busy" @click="saveEdit">{{ busy ? '저장 중...' : '저장' }}</button>
          </template>
          <template v-else>
            <button type="button" class="btn-secondary" @click="startEdit">수정</button>
            <button type="button" class="btn-secondary" @click="noticeToDelete = true">삭제</button>
          </template>
        </div>
      </div>
      <div class="notice-card-meta">
        <span>{{ String(notice.date).slice(0, 10).replaceAll('-', '/') }}</span>
      </div>
      <div class="notice-card-body">
        <textarea v-if="editing" v-model="editForm.content" rows="8" class="notice-edit-content" placeholder="내용을 입력하세요" />
        <p v-else class="notice-card-content">{{ notice.content }}</p>
      </div>
      <div class="notice-card-attachments">
        <span v-for="a in notice.attachments" :key="a.id" class="attachment-chip">
          📎 {{ a.fileName }}
          <button v-if="isProfessor" type="button" class="attachment-remove" @click="attachmentToDelete = a">×</button>
        </span>
        <label v-if="isProfessor" class="attachment-add">
          + 파일 첨부
          <input type="file" class="file-input" @change="attachFile" />
        </label>
        <p v-if="!notice.attachments.length && !isProfessor" class="no-attachments">첨부파일이 없습니다.</p>
      </div>
    </div>
  </section>
  <section v-else class="page">
    <p class="not-found">{{ loadError || '공지를 찾을 수 없습니다.' }}</p>
  </section>
  <AlertModal :message="actionError" @close="actionError = ''" />
  <ConfirmModal
    :message="noticeToDelete ? '이 공지를 삭제할까요?' : ''"
    @confirm="confirmDeleteNotice"
    @cancel="noticeToDelete = false"
  />
  <ConfirmModal
    :message="attachmentToDelete ? '이 첨부파일을 삭제할까요?' : ''"
    @confirm="confirmDeleteAttachment"
    @cancel="attachmentToDelete = null"
  />
</template>

<style scoped>
.page {
  padding: 12px 16px 32px;
}

.notice-card {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 28px;
}

.notice-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.notice-card-title {
  font-size: 20px;
  margin: 0;
  color: var(--color-text);
}

.notice-card-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.notice-card-meta {
  margin-top: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-muted);
  font-size: 13px;
}

.notice-card-body {
  padding: 20px 0;
  min-height: 180px;
}

.notice-card-content {
  margin: 0;
  color: var(--color-text);
  line-height: 1.8;
  white-space: pre-wrap;
}

.notice-card-attachments {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.no-attachments {
  margin: 0;
  color: var(--color-muted);
  font-size: 13px;
}

.attachment-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-soft);
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 12px;
  color: var(--color-text);
}

.attachment-remove {
  border: none;
  background: none;
  padding: 0;
  font-size: 13px;
  line-height: 1;
  color: var(--color-muted);
  cursor: pointer;
}

.attachment-remove:hover {
  color: #c0392b;
}

.attachment-add {
  display: inline-flex;
  align-items: center;
  position: relative;
  border: 1px dashed var(--color-border);
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 12px;
  color: var(--color-muted);
  cursor: pointer;
}

.attachment-add:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.notice-edit-title,
.notice-edit-content {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text);
}

.notice-edit-title {
  font-weight: 700;
  font-size: 16px;
}

.notice-edit-content {
  resize: vertical;
}

.notice-edit-title:focus,
.notice-edit-content:focus {
  outline: none;
  border-color: var(--color-accent);
}

.btn-primary {
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 700;
}

.btn-secondary {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 12px;
  color: var(--color-muted);
}

.btn-secondary:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.not-found {
  color: var(--color-muted);
  padding: 32px;
  text-align: center;
}
</style>
