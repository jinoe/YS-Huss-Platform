<script>
import PostDetail from '../../components/board/PostDetail.vue'
import results from '../../data/results.js'

export default {
  name: 'ResultDetailView',
  components: { PostDetail },
  computed: {
    post() {
      return results.find((item) => String(item.id) === this.$route.params.id) || null
    }
  }
}
</script>

<template>
  <PostDetail :post="post" list-to="/share" />
</template>
