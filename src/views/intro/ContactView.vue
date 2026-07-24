<script>
export default {
  name: 'ContactView'
}
</script>

<template>
  <section class="page">
    <h3>찾아오시는 길</h3>
    <div class="map-placeholder">연세대학교</div>
    <div class="info-list">
      <p><strong>주소</strong> 서울특별시 서대문구 연세로 50 연세대학교</p>
      <p><strong>주관학부</strong> 언더우드국제대학</p>
    </div>
  </section>
</template>

<style scoped>
h3 {
  font-size: 22px;
  margin: 0 0 20px;
}

.map-placeholder {
  aspect-ratio: 16 / 7;
  background: var(--bg-soft);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
  font-size: 14px;
  margin-bottom: 24px;
}

.info-list p {
  font-size: 14px;
  line-height: 1.8;
  margin: 0 0 8px;
}
</style>
