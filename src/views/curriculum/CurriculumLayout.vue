<script>
export default {
  name: 'CurriculumLayout',
  data() {
    return {
      sidebarItems: [
        { label: '교육과정 소개', to: '/curriculum' },
        { label: '글로벌지속가능융합학과', to: '/curriculum/department' },
        { label: '개설과목', to: '/curriculum/subject' },
        { label: '마이크로디그리', to: '/curriculum/microdegree' },
        { label: '비교과프로그램', to: '/curriculum/program' }
      ]
    }
  },
  computed: {
    currentLabel() {
      const matched = this.sidebarItems.find((item) => item.to === this.$route.path)
      return matched ? matched.label : ''
    }
  },
  methods: {
    isActive(to) {
      return this.$route.path === to
    }
  }
}
</script>

<template>
  <div>
    <div class="page-banner">
      <h1>교육과정</h1>
    </div>
    <div class="container breadcrumb">
      <router-link to="/">Home</router-link>
      <span>›</span>
      <span>교육과정</span>
      <span>›</span>
      <span>{{ currentLabel }}</span>
    </div>
    <div class="container layout-grid">
      <aside class="sidebar">
        <h2>교육과정</h2>
        <nav>
          <router-link
            v-for="item in sidebarItems"
            :key="item.to"
            :to="item.to"
            class="sidebar-link"
            :class="{ active: isActive(item.to) }"
          >
            {{ item.label }}
          </router-link>
        </nav>
      </aside>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-banner {
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
  color: #fff;
  padding: 48px 24px;
  text-align: center;
}

.page-banner h1 {
  margin: 0;
  font-size: 28px;
}

.breadcrumb {
  display: flex;
  gap: 8px;
  padding: 16px 24px;
  color: var(--color-muted);
  font-size: 13px;
}

.layout-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 32px;
  padding-block: 24px 64px;
}

.sidebar h2 {
  background: var(--bg-soft);
  border-radius: 8px;
  padding: 16px;
  font-size: 18px;
  margin: 0 0 16px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
}

.sidebar-link {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
  color: var(--color-text);
}

.sidebar-link.active {
  color: var(--color-accent);
  font-weight: 700;
}

@media (max-width: 768px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }
  .sidebar,
  .content {
    min-width: 0;
  }
  .sidebar nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .sidebar-link {
    border-bottom: none;
    padding: 8px 12px;
    min-width: 0;
    overflow-wrap: break-word;
  }
}
</style>
