<script>
import SyllabusDocument from '../../components/portal/SyllabusDocument.vue'
import LoadingState from '../../components/portal/LoadingState.vue'
import * as coursesApi from '../../api/courses.js'

export default {
  name: 'SyllabusView',
  components: { SyllabusDocument, LoadingState },
  data() {
    return {
      course: null,
      loading: true,
      loadError: ''
    }
  },
  async created() {
    this.loading = true
    try {
      this.course = await coursesApi.detail(Number(this.$route.params.id))
    } catch (e) {
      this.loadError = '과목을 찾을 수 없습니다.'
      console.error('[api] courses.detail', e)
    }
    this.loading = false
  }
}
</script>

<template>
  <section v-if="loading" class="page">
    <LoadingState />
  </section>
  <section v-else-if="course" class="page">
    <router-link :to="`/portal/courses/${course.id}`" class="back-link">← {{ course.name }}</router-link>
    <SyllabusDocument :course="course" />
  </section>
  <section v-else class="page">
    <p class="not-found">{{ loadError || '과목을 찾을 수 없습니다.' }}</p>
    <router-link to="/portal/courses" class="back-link">← 수강편람 목록</router-link>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.back-link {
  display: inline-block;
  font-size: 13px;
  color: var(--color-muted);
}

.back-link:hover {
  color: var(--color-primary);
}

.not-found {
  color: var(--color-muted);
  margin-bottom: 16px;
}
</style>
