<script>
import PostDetail from '../../components/board/PostDetail.vue'
import jobs from '../../data/jobs.js'

export default {
  name: 'JobDetailView',
  components: { PostDetail },
  computed: {
    post() {
      return jobs.find((item) => String(item.id) === this.$route.params.id) || null
    }
  }
}
</script>

<template>
  <PostDetail :post="post" list-to="/support/job" />
</template>
