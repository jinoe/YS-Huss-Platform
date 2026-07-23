<script>
export default {
  name: 'ContactView'
}
</script>

<template>
  <section class="page">
    <h3>찾아오시는 길</h3>
    <div class="map-placeholder">광운대학교 한울관</div>
    <div class="info-list">
      <p><strong>주소</strong> 우) 01897 서울시 노원구 광운로 20 광운대학교 한울관 220호</p>
      <p><strong>대표 전화</strong> 02-940-8271</p>
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
