<script>
import BoardTable from '../../components/board/BoardTable.vue'
import partnerNotices from '../../data/partnerNotices.js'

export default {
  name: 'PartnerNoticeView',
  components: { BoardTable },
  data() {
    return {
      posts: partnerNotices
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>참여대학 공지</h3>
    <BoardTable :items="posts" base-path="/bulletin/partner-notice" />
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 20px;
}
</style>
