<script>
import ServiceIcon from '../../components/portal/ServiceIcon.vue'
import session from '../../data/session.js'
import { STUDENT_POOL, PROFESSOR_POOL } from '../../data/currentUser.js'

export default {
  name: 'PortalLayout',
  components: { ServiceIcon },
  data() {
    return {
      session,
      navItems: [
        { labelKey: 'portal.sidebar.mypage', to: '/portal', icon: 'mypage' },
        { labelKey: 'portal.sidebar.courses', to: '/portal/courses', icon: 'courses' },
        { labelKey: 'portal.sidebar.microdegree', to: '/portal/microdegree', icon: 'microdegree' },
        { labelKey: 'portal.sidebar.counseling', to: '/portal/counseling', icon: 'counseling' },
        { labelKey: 'portal.sidebar.subjects', to: '/portal/subjects', icon: 'subjects' },
        { labelKey: 'portal.sidebar.kpi', to: '/portal/kpi', icon: 'kpi' },
        { labelKey: 'portal.sidebar.admin', to: '/portal/admin', icon: 'admin' }
      ]
    }
  },
  computed: {
    currentLabel() {
      const matched = this.navItems.find((item) => this.isActive(item.to))
      return matched ? this.$t(matched.labelKey) : ''
    },
    userDisplayName() {
      return this.session.role === 'professor' ? `${this.session.professorName} 교수` : this.session.studentName
    }
  },
  methods: {
    isActive(to) {
      if (to === '/portal') return this.$route.path === '/portal'
      return this.$route.path.startsWith(to)
    },
    toggleLang() {
      this.$i18n.locale = this.$i18n.locale === 'ko' ? 'en' : 'ko'
    },
    setRole(role) {
      this.session.role = role
    },
    randomizeIdentity() {
      if (this.session.role === 'student') {
        const pool = STUDENT_POOL.filter((name) => name !== this.session.studentName)
        this.session.studentName = pool[Math.floor(Math.random() * pool.length)]
      } else {
        const pool = PROFESSOR_POOL.filter((name) => name !== this.session.professorName)
        this.session.professorName = pool[Math.floor(Math.random() * pool.length)]
      }
      if (this.$route.path !== '/portal') this.$router.push('/portal')
    }
  }
}
</script>

<template>
  <div class="portal">
    <aside class="portal-sidebar">
      <router-link to="/portal" class="sidebar-logo">HUSS 포탈</router-link>
      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="sidebar-item"
          :class="{ active: isActive(item.to) }"
        >
          <span class="sidebar-icon">
            <ServiceIcon :name="item.icon" />
          </span>
          <span>{{ $t(item.labelKey) }}</span>
        </router-link>
      </nav>
      <router-link to="/" target="_blank" class="sidebar-exit">{{ $t('portal.exit') }}</router-link>
    </aside>
    <div class="portal-main">
      <header class="portal-topbar">
        <h1>{{ currentLabel }}</h1>
        <div class="portal-user">
          <div class="test-panel">
            <span class="test-panel-title">{{ $t('portal.test.title') }}</span>
            <div class="role-toggle">
              <button type="button" :class="{ active: session.role === 'student' }" @click="setRole('student')">{{ $t('portal.role.student') }}</button>
              <button type="button" :class="{ active: session.role === 'professor' }" @click="setRole('professor')">{{ $t('portal.role.professor') }}</button>
            </div>
            <button type="button" class="btn-random" @click="randomizeIdentity">{{ $t('portal.test.random') }}</button>
          </div>
          <button type="button" class="lang-toggle" @click="toggleLang">{{ $t('header.langToggle') }}</button>
          <span>{{ userDisplayName }}님</span>
          <button type="button">{{ $t('portal.logout') }}</button>
        </div>
      </header>
      <main class="portal-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.portal {
  min-height: 100svh;
  display: flex;
  background: var(--bg-soft);
}

.portal-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--color-primary-dark);
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
}

.sidebar-logo {
  font-weight: 800;
  font-size: 18px;
  color: #fff;
  padding: 0 12px;
  margin-bottom: 32px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.sidebar-item.active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-weight: 700;
}

.sidebar-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-icon svg {
  width: 18px;
  height: 18px;
}

.sidebar-exit {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  padding: 12px;
}

.portal-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.portal-topbar {
  background: #fff;
  border-bottom: 1px solid var(--color-border);
  padding: 20px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.portal-topbar h1 {
  font-size: 20px;
  margin: 0;
}

.portal-user {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--color-muted);
}

.portal-user button {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 12px;
  color: var(--color-muted);
}

.portal-user .lang-toggle {
  font-weight: 700;
}

.test-panel {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px dashed var(--color-border);
  border-radius: 999px;
  padding: 4px 8px 4px 12px;
}

.test-panel-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--color-muted);
  white-space: nowrap;
}

.role-toggle {
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  overflow: hidden;
}

.role-toggle button {
  flex: 1;
  border: none;
  border-radius: 0;
  background: #fff;
  padding: 4px 12px;
  font-size: 12px;
  color: var(--color-muted);
}

.role-toggle button.active {
  background: var(--color-primary);
  color: #fff;
  font-weight: 700;
}

.btn-random {
  border: 1px solid var(--color-border);
  background: var(--bg-soft);
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-muted);
}

.btn-random:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.portal-content {
  flex: 1;
  padding: 32px;
}

@media (max-width: 900px) {
  .portal {
    flex-direction: column;
  }
  .portal-sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 12px 16px;
    gap: 16px;
    overflow-x: auto;
  }
  .sidebar-logo {
    margin-bottom: 0;
    flex-shrink: 0;
  }
  .sidebar-nav {
    flex-direction: row;
    flex: none;
  }
  .sidebar-item span:last-child {
    display: none;
  }
  .sidebar-exit {
    display: none;
  }
  .portal-topbar {
    padding: 16px 20px;
  }
  .portal-content {
    padding: 20px;
  }
}
</style>
