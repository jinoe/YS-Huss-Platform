<script>
export default {
  name: 'ContactView'
}
</script>

<template>
  <section class="page">
    <h3>찾아오시는 길</h3>
    <div class="map-wrap">
      <iframe
        class="map-frame"
        src="https://www.google.com/maps?q=37.5663937,126.9387066&z=16&output=embed"
        title="연세대학교 위치 지도"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      />
    </div>
    <a
      class="map-link"
      href="https://www.google.com/maps/search/?api=1&query=Yonsei+University,+50+Yonsei-ro,+Seodaemun-gu,+Seoul"
      target="_blank"
      rel="noopener"
    >Google 지도에서 크게 보기 ↗</a>
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

.map-wrap {
  aspect-ratio: 16 / 7;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.map-frame {
  width: 100%;
  height: 100%;
  border: 0;
}

.map-link {
  display: inline-block;
  font-size: 13px;
  color: var(--color-primary);
  margin-bottom: 24px;
}

.info-list p {
  font-size: 14px;
  line-height: 1.8;
  margin: 0 0 8px;
}
</style>
