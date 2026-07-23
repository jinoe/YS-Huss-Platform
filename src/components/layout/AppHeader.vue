<script>
import yonseiLogoWhite from '../../assets/yonsei-logo-white.png'
import yonseiLogoDark from '../../assets/yonsei-logo-dark.png'

export default {
  name: 'AppHeader',
  data() {
    return {
      isScrolled: false,
      navItems: [
        {
          labelKey: 'nav.intro.title',
          to: '/intro',
          children: [
            { labelKey: 'nav.intro.greeting', to: '/intro' },
            { labelKey: 'nav.intro.vision', to: '/intro/vision' },
            { labelKey: 'nav.intro.withus', to: '/intro/withus' },
            { labelKey: 'nav.intro.consortium', to: '/intro/consortium' },
            { labelKey: 'nav.intro.organization', to: '/intro/organization' },
            { labelKey: 'nav.intro.contact', to: '/intro/contact' }
          ]
        },
        {
          labelKey: 'nav.curriculum.title',
          to: '/curriculum',
          children: [
            { labelKey: 'nav.curriculum.intro', to: '/curriculum' },
            { labelKey: 'nav.curriculum.department', to: '/curriculum/department' },
            { labelKey: 'nav.curriculum.subject', to: '/curriculum/subject' },
            { labelKey: 'nav.curriculum.microdegree', to: '/curriculum/microdegree' },
            { labelKey: 'nav.curriculum.program', to: '/curriculum/program' }
          ]
        },
        {
          labelKey: 'nav.support.title',
          to: '/support',
          children: [
            { labelKey: 'nav.support.info', to: '/support' },
            { labelKey: 'nav.support.club', to: '/support/club' },
            { labelKey: 'nav.support.job', to: '/support/job' }
          ]
        },
        {
          labelKey: 'nav.share.title',
          to: '/share',
          children: [
            { labelKey: 'nav.share.result', to: '/share' },
            { labelKey: 'nav.share.newsletter', to: '/share/newsletter' },
            { labelKey: 'nav.share.cardnews', to: '/share/cardnews' }
          ]
        },
        {
          labelKey: 'nav.bulletin.title',
          to: '/bulletin',
          children: [
            { labelKey: 'nav.bulletin.notice', to: '/bulletin' },
            { labelKey: 'nav.bulletin.partnerNotice', to: '/bulletin/partner-notice' },
            { labelKey: 'nav.bulletin.data', to: '/bulletin/data' },
            { labelKey: 'nav.bulletin.faq', to: '/bulletin/faq' },
            { labelKey: 'nav.bulletin.schedule', to: '/bulletin/schedule' }
          ]
        }
      ]
    }
  },
  computed: {
    isHome() {
      return this.$route.path === '/'
    },
    isOverlay() {
      return this.isHome && !this.isScrolled
    },
    partnerLogoSrc() {
      return this.isOverlay ? yonseiLogoWhite : yonseiLogoDark
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    this.handleScroll()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 40
    },
    toggleLang() {
      this.$i18n.locale = this.$i18n.locale === 'ko' ? 'en' : 'ko'
    }
  }
}
</script>

<template>
  <header class="app-header" :class="{ overlay: isOverlay, solid: !isOverlay }">
    <div class="container main-bar">
      <div class="logo-group">
        <router-link to="/" class="logo">
          <span class="logo-mark">HUSS</span>
          <span class="logo-sub">{{ $t('header.subtitle') }}</span>
        </router-link>
        <span class="logo-divider">|</span>
        <span class="partner-logo">
          <img :src="partnerLogoSrc" alt="연세대학교" />
        </span>
      </div>
      <nav class="main-nav">
        <div v-for="item in navItems" :key="item.to" class="nav-item">
          <router-link :to="item.to">{{ $t(item.labelKey) }}</router-link>
          <div v-if="item.children" class="submenu">
            <router-link
              v-for="child in item.children"
              :key="child.labelKey"
              :to="child.to"
              class="submenu-link"
            >
              {{ $t(child.labelKey) }}
            </router-link>
          </div>
        </div>
      </nav>
      <div class="header-actions">
        <button type="button" class="lang-toggle" @click="toggleLang">{{ $t('header.langToggle') }}</button>
        <router-link to="/portal" target="_blank" class="lms-link">{{ $t('header.lms') }}</router-link>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 50;
  height: 72px;
  display: flex;
  align-items: center;
  background: transparent;
  border-bottom: 1px solid transparent;
  box-shadow: none;
  transition: background-color 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.main-bar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.logo {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-divider {
  font-size: 20px;
  font-weight: 300;
  color: var(--color-border);
  transition: color 0.25s ease;
}

.partner-logo {
  display: flex;
  align-items: center;
}

.partner-logo img {
  height: 36px;
  width: auto;
  display: block;
}

.logo-mark {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: 1px;
  transition: color 0.25s ease;
}

.logo-sub {
  font-size: 12px;
  color: var(--color-muted);
  transition: color 0.25s ease;
}

.main-nav {
  display: flex;
  gap: 32px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  position: relative;
}

.nav-item > a {
  display: block;
  padding: 26px 4px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  transition: color 0.25s ease;
}

.nav-item > a:hover,
.nav-item > a.router-link-active {
  color: var(--color-accent);
}

.submenu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 190px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  padding: 8px 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.18s ease;
}

.nav-item:hover .submenu {
  opacity: 1;
  visibility: visible;
}

.submenu-link {
  display: block;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
}

.submenu-link:hover {
  background: var(--bg-soft);
  color: var(--color-accent);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.lang-toggle {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-muted);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 6px 14px;
  background: #fff;
  transition: color 0.25s ease, border-color 0.25s ease;
}

.lms-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-muted);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 6px 16px;
  flex-shrink: 0;
  transition: color 0.25s ease, border-color 0.25s ease;
}

/* Solid state: white background, used on inner pages and once scrolled on home */
.app-header.solid {
  background: #fff;
  border-bottom-color: var(--color-border);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

/* Overlay state: transparent over the home hero, only before scrolling */
.app-header.overlay {
  background: transparent;
  border-bottom-color: rgba(255, 255, 255, 0.2);
}

.app-header.overlay .logo-mark {
  color: #fff;
}

.app-header.overlay .logo-sub {
  color: rgba(255, 255, 255, 0.75);
}

.app-header.overlay .logo-divider {
  color: rgba(255, 255, 255, 0.4);
}

.app-header.overlay .nav-item > a {
  color: rgba(255, 255, 255, 0.9);
}

.app-header.overlay .nav-item > a:hover,
.app-header.overlay .nav-item > a.router-link-active {
  color: #fff;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.app-header.overlay .lms-link {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
}

.app-header.overlay .lang-toggle {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
  background: transparent;
}

@media (max-width: 768px) {
  .main-bar {
    flex-wrap: wrap;
    gap: 12px;
  }
  /* Keep the mobile header compact: drop the subtitle and partner logo,
     otherwise the row wraps to 3 lines and overflows the fixed header height */
  .logo-sub,
  .logo-divider,
  .partner-logo {
    display: none;
  }
  .main-nav {
    order: 3;
    flex-basis: 100%;
    justify-content: flex-start;
    gap: 16px;
    flex-wrap: wrap;
  }
  .nav-item > a {
    padding: 4px 0;
    font-size: 14px;
  }
  /* Hover dropdowns don't work well on touch — hide them on mobile */
  .submenu {
    display: none;
  }
}
</style>
