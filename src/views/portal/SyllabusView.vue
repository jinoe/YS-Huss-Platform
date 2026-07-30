<script>
import courses from '../../data/courses.js'
import SyllabusDocument from '../../components/portal/SyllabusDocument.vue'

export default {
  name: 'SyllabusView',
  components: { SyllabusDocument },
  data() {
    return {
      courses
    }
  },
  computed: {
    course() {
      return this.courses.find((c) => c.id === Number(this.$route.params.id))
    }
  }
}
</script>

<template>
  <section v-if="course" class="page">
    <router-link :to="`/portal/courses/${course.id}`" class="back-link">← {{ course.name }}</router-link>
    <SyllabusDocument :course="course" />
  </section>
  <section v-else class="page">
    <p class="not-found">과목을 찾을 수 없습니다.</p>
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
