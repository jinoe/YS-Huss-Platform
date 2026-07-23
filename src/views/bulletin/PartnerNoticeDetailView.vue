<script>
import PostDetail from '../../components/board/PostDetail.vue'
import partnerNotices from '../../data/partnerNotices.js'

export default {
  name: 'PartnerNoticeDetailView',
  components: { PostDetail },
  computed: {
    post() {
      return partnerNotices.find((item) => String(item.id) === this.$route.params.id) || null
    }
  }
}
</script>

<template>
  <PostDetail :post="post" list-to="/bulletin/partner-notice" />
</template>
