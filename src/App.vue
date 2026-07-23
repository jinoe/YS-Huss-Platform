<script>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  }
}
</script>

<template>
  <template v-if="!$route.meta.bare">
    <AppHeader />
    <main>
      <router-view />
    </main>
    <AppFooter />
  </template>
  <router-view v-else />
</template>

<style scoped>
main {
  padding-top: 72px;
}
</style>
