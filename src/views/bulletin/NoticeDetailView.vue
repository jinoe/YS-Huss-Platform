<script>
import PostDetail from '../../components/board/PostDetail.vue'
import notices from '../../data/notices.js'

export default {
  name: 'NoticeDetailView',
  components: { PostDetail },
  computed: {
    post() {
      return notices.find((item) => String(item.id) === this.$route.params.id) || null
    }
  }
}
</script>

<template>
  <PostDetail :post="post" list-to="/bulletin" />
</template>
