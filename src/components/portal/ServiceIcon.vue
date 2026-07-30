<script>
const PATHS = {
  microdegree: 'M12 3l9 4.5-9 4.5-9-4.5L12 3z M7 10.5v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5',
  counseling: 'M4 5h16v11H8l-4 4V5z',
  subjects: 'M5 4h11a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 3-2z M8 9h6 M8 13h6',
  admin: 'M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z M9.5 12l1.8 1.8L14.5 10',
  mypage: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6',
  courses: 'M4 19.5V6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v13.5 M6 4v16 M9 8h6 M9 12h6',
  registration: 'M7 3h10v18l-5-3-5 3z M9 9l2 2 4-4',
  kpi: 'M4 20V10 M10 20V4 M16 20v-7 M4 20h16',
  extra: 'M4 7h16 M4 12h16 M4 17h10'
}

export default {
  name: 'ServiceIcon',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    path() {
      return PATHS[this.name] || PATHS.extra
    }
  }
}
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path :d="path" />
  </svg>
</template>
