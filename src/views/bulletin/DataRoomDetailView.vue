<script>
import PostDetail from '../../components/board/PostDetail.vue'
import dataroom from '../../data/dataroom.js'

export default {
  name: 'DataRoomDetailView',
  components: { PostDetail },
  computed: {
    post() {
      return dataroom.find((item) => String(item.id) === this.$route.params.id) || null
    }
  }
}
</script>

<template>
  <PostDetail :post="post" list-to="/bulletin/data" />
</template>
