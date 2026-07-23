<script>
import BoardTable from '../../components/board/BoardTable.vue'
import dataroom from '../../data/dataroom.js'

export default {
  name: 'DataRoomView',
  components: { BoardTable },
  data() {
    return {
      posts: dataroom
    }
  }
}
</script>

<template>
  <section class="page">
    <h3>자료실</h3>
    <BoardTable :items="posts" base-path="/bulletin/data" />
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 20px;
}
</style>
