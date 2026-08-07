<script>
import ServiceIcon from '../../components/portal/ServiceIcon.vue'
import session, { getTier, getDisplayName, clearSession } from '../../data/session.js'

// 사이드바 탭 5단계 tier 매핑. router/index.js의 라우트별 meta.tiers와 반드시 짝을 맞춰야 한다.
// 정리 문서: frontend/docs/portal-roles.md
const NAV_ITEMS = [
  { labelKey: 'portal.sidebar.mypage', to: '/portal', icon: 'mypage', tiers: ['student', 'professor', 'core-professor', 'staff', 'system-admin'] },
  { labelKey: 'portal.sidebar.courses', to: '/portal/courses', icon: 'courses', tiers: ['student', 'professor', 'core-professor', 'staff'] },
  { labelKey: 'portal.sidebar.registration', to: '/portal/registration', icon: 'registration', tiers: ['student'] },
  { labelKey: 'portal.sidebar.microdegree', to: '/portal/microdegree', icon: 'microdegree', tiers: ['student'] },
  { labelKey: 'portal.sidebar.counseling', to: '/portal/counseling', icon: 'counseling', tiers: ['student', 'professor', 'core-professor'] },
  { labelKey: 'portal.sidebar.subjects', to: '/portal/subjects', icon: 'subjects', tiers: ['professor', 'core-professor'] },
  { labelKey: 'portal.sidebar.kpi', to: '/portal/kpi', icon: 'kpi', tiers: ['core-professor', 'staff', 'system-admin'] },
  { labelKey: 'portal.sidebar.admin', to: '/portal/admin', icon: 'admin', tiers: ['core-professor', 'staff', 'system-admin'] }
]

// 강의실(과목 상세)로 취급하는 라우트들 — 상단 타이틀·뒤로가기 표시 여부 판정에 같이 쓴다.
const CLASSROOM_ROUTE_NAMES = ['portal-course-detail', 'portal-course-syllabus', 'portal-notice-detail']

export default {
  name: 'PortalLayout',
  components: { ServiceIcon },
  data() {
    return { session }
  },
  computed: {
    tier() {
      return getTier(this.session)
    },
    navItems() {
      return NAV_ITEMS.filter((item) => item.tiers.includes(this.tier))
    },
    currentLabel() {
      // 강의실(과목 상세) 계열 화면은 마이페이지의 "강의실 입장"으로만 들어오는
      // 화면이라 수강편람 섹션이 아니다 — 사이드바 하이라이트도, 상단 타이틀도
      // 별도 취급한다.
      if (CLASSROOM_ROUTE_NAMES.includes(this.$route.name)) {
        return '강의실'
      }
      const matched = this.navItems.find((item) => this.isActive(item.to))
      return matched ? this.$t(matched.labelKey) : ''
    },
    userDisplayName() {
      return getDisplayName(this.session)
    },
    showBackButton() {
      return CLASSROOM_ROUTE_NAMES.includes(this.$route.name)
    }
  },
  methods: {
    isActive(to) {
      if (to === '/portal') return this.$route.path === '/portal'
      if (to === '/portal/courses') return this.$route.name === 'portal-courses'
      return this.$route.path.startsWith(to)
    },
    toggleLang() {
      this.$i18n.locale = this.$i18n.locale === 'ko' ? 'en' : 'ko'
    },
    goBack() {
      if (window.history.state && window.history.state.back) {
        this.$router.back()
      } else if (this.$route.name === 'portal-notice-detail') {
        this.$router.push(`/portal/courses/${this.$route.params.id}`)
      } else {
        this.$router.push('/portal/courses')
      }
    },
    logout() {
      clearSession()
      this.$router.push('/portal/login')
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
        <div class="topbar-title">
          <button v-if="showBackButton" type="button" class="topbar-back" @click="goBack">← 뒤로가기</button>
          <h1>{{ currentLabel }}</h1>
        </div>
        <div class="portal-user">
          <button type="button" class="lang-toggle" @click="toggleLang">{{ $t('header.langToggle') }}</button>
          <span>{{ userDisplayName }}님</span>
          <button type="button" @click="logout">{{ $t('portal.logout') }}</button>
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
  /* 흰색이면 아래 콘텐츠 카드(.page 등)와 구분이 안 돼서 "흰 박스가 위아래로
     겹쳐 보인다"는 지적이 있었다 — 헤더임을 분명히 하려고 프라이머리 블루
     톤을 옅게 깔아 콘텐츠 카드와 시각적으로 구분되게 했다. */
  background: linear-gradient(160deg, rgba(0, 31, 66, 0.04), rgba(0, 56, 118, 0.06));
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

.topbar-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.topbar-back {
  border: none;
  background: none;
  padding: 0;
  font-size: 13px;
  color: var(--color-muted);
  cursor: pointer;
}

.topbar-back:hover {
  color: var(--color-primary);
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
