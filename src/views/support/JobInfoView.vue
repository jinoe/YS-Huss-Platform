<script>
import BoardTable from '../../components/board/BoardTable.vue'
import jobs from '../../data/jobs.js'

export default {
  name: 'JobInfoView',
  components: { BoardTable },
  data() {
    return {
      posts: jobs
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>취업정보</h3>
    <BoardTable :items="posts" base-path="/support/job" />
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 20px;
}
</style>
