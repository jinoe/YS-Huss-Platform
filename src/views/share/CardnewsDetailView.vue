<script>
import PostDetail from '../../components/board/PostDetail.vue'
import cardnews from '../../data/cardnews.js'

export default {
  name: 'CardnewsDetailView',
  components: { PostDetail },
  computed: {
    post() {
      return cardnews.find((item) => String(item.id) === this.$route.params.id) || null
    }
  }
}
</script>

<template>
  <PostDetail :post="post" list-to="/share/cardnews" />
</template>
