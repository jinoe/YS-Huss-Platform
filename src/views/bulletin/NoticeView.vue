<script>
import BoardTable from '../../components/board/BoardTable.vue'
import notices from '../../data/notices.js'

export default {
  name: 'NoticeView',
  components: { BoardTable },
  data() {
    return {
      posts: notices
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>공지사항</h3>
    <BoardTable :items="posts" base-path="/bulletin" />
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 20px;
}
</style>
