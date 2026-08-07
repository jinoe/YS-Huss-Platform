import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CurriculumLayout from '../views/curriculum/CurriculumLayout.vue'
import IntroLayout from '../views/intro/IntroLayout.vue'
import SupportLayout from '../views/support/SupportLayout.vue'
import ShareLayout from '../views/share/ShareLayout.vue'
import BulletinLayout from '../views/bulletin/BulletinLayout.vue'
import session, { getTier, clearSession } from '../data/session.js'
import * as authApi from '../api/auth.js'

// 사이드바 탭별 접근 가능 tier. PortalLayout.vue의 navItems와 반드시 짝을 맞춰야 한다.
// 정리 문서: frontend/docs/portal-roles.md
const TIER_STUDENT = 'student'
const TIER_PROFESSOR = 'professor'
const TIER_CORE_PROFESSOR = 'core-professor'
const TIER_STAFF = 'staff'
const TIER_SYSTEM_ADMIN = 'system-admin'
const ALL_TIERS = [TIER_STUDENT, TIER_PROFESSOR, TIER_CORE_PROFESSOR, TIER_STAFF, TIER_SYSTEM_ADMIN]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/intro',
      component: IntroLayout,
      children: [
        {
          path: '',
          name: 'intro-greeting',
          component: () => import('../views/intro/GreetingView.vue')
        },
        {
          path: 'vision',
          name: 'intro-vision',
          component: () => import('../views/intro/VisionView.vue')
        },
        {
          path: 'withus',
          name: 'intro-withus',
          component: () => import('../views/intro/WithusView.vue')
        },
        {
          path: 'consortium',
          name: 'intro-consortium',
          component: () => import('../views/intro/ConsortiumView.vue')
        },
        {
          path: 'organization',
          name: 'intro-organization',
          component: () => import('../views/intro/OrganizationView.vue')
        },
        {
          path: 'contact',
          name: 'intro-contact',
          component: () => import('../views/intro/ContactView.vue')
        }
      ]
    },
    {
      path: '/curriculum',
      component: CurriculumLayout,
      children: [
        {
          path: '',
          name: 'curriculum-intro',
          component: () => import('../views/curriculum/CurriculumIntroView.vue')
        },
        {
          path: 'subject',
          name: 'curriculum-subject',
          component: () => import('../views/curriculum/CurriculumSubjectView.vue')
        },
        {
          path: 'microdegree',
          name: 'curriculum-microdegree',
          component: () => import('../views/curriculum/CurriculumMicrodegreeView.vue')
        },
        {
          path: 'program',
          name: 'curriculum-program',
          component: () => import('../views/curriculum/CurriculumProgramView.vue')
        }
      ]
    },
    {
      path: '/support',
      component: SupportLayout,
      children: [
        {
          path: '',
          name: 'support-info',
          component: () => import('../views/support/SupportInfoView.vue')
        },
        {
          path: 'club',
          name: 'support-club',
          component: () => import('../views/support/ClubView.vue')
        },
        {
          path: 'job',
          name: 'support-job',
          component: () => import('../views/support/JobInfoView.vue')
        },
        {
          path: 'job/:id',
          name: 'support-job-detail',
          component: () => import('../views/support/JobDetailView.vue')
        }
      ]
    },
    {
      path: '/share',
      component: ShareLayout,
      children: [
        {
          path: '',
          name: 'share-result',
          component: () => import('../views/share/ResultView.vue')
        },
        {
          path: 'newsletter',
          name: 'share-newsletter',
          component: () => import('../views/share/NewsletterView.vue')
        },
        {
          path: 'cardnews',
          name: 'share-cardnews',
          component: () => import('../views/share/CardnewsView.vue')
        },
        {
          path: 'cardnews/:id',
          name: 'share-cardnews-detail',
          component: () => import('../views/share/CardnewsDetailView.vue')
        },
        {
          path: ':id',
          name: 'share-result-detail',
          component: () => import('../views/share/ResultDetailView.vue')
        }
      ]
    },
    {
      path: '/bulletin',
      component: BulletinLayout,
      children: [
        {
          path: '',
          name: 'bulletin-notice',
          component: () => import('../views/bulletin/NoticeView.vue')
        },
        {
          path: 'partner-notice',
          name: 'bulletin-partner-notice',
          component: () => import('../views/bulletin/PartnerNoticeView.vue')
        },
        {
          path: 'data',
          name: 'bulletin-data',
          component: () => import('../views/bulletin/DataRoomView.vue')
        },
        {
          path: 'faq',
          name: 'bulletin-faq',
          component: () => import('../views/bulletin/FaqView.vue')
        },
        {
          path: 'schedule',
          name: 'bulletin-schedule',
          component: () => import('../views/bulletin/ScheduleView.vue')
        },
        {
          path: 'partner-notice/:id',
          name: 'bulletin-partner-notice-detail',
          component: () => import('../views/bulletin/PartnerNoticeDetailView.vue')
        },
        {
          path: 'data/:id',
          name: 'bulletin-data-detail',
          component: () => import('../views/bulletin/DataRoomDetailView.vue')
        },
        {
          path: ':id',
          name: 'bulletin-notice-detail',
          component: () => import('../views/bulletin/NoticeDetailView.vue')
        }
      ]
    },
    {
      path: '/portal/login',
      name: 'portal-login',
      component: () => import('../views/portal/PortalLoginView.vue'),
      meta: { bare: true }
    },
    {
      path: '/portal',
      component: () => import('../views/portal/PortalLayout.vue'),
      meta: { bare: true },
      children: [
        {
          path: '',
          name: 'portal-home',
          component: () => import('../views/portal/PortalHomeView.vue'),
          meta: { tiers: ALL_TIERS }
        },
        {
          path: 'courses',
          name: 'portal-courses',
          component: () => import('../views/portal/CourseCatalogView.vue'),
          meta: { tiers: [TIER_STUDENT, TIER_PROFESSOR, TIER_CORE_PROFESSOR, TIER_STAFF] }
        },
        {
          path: 'courses/:id',
          name: 'portal-course-detail',
          component: () => import('../views/portal/CourseDetailView.vue'),
          meta: { tiers: [TIER_STUDENT, TIER_PROFESSOR, TIER_CORE_PROFESSOR, TIER_STAFF] }
        },
        {
          path: 'courses/:id/syllabus',
          name: 'portal-course-syllabus',
          component: () => import('../views/portal/SyllabusView.vue'),
          meta: { tiers: [TIER_STUDENT, TIER_PROFESSOR, TIER_CORE_PROFESSOR, TIER_STAFF] }
        },
        {
          path: 'courses/:id/notices/:noticeId',
          name: 'portal-notice-detail',
          component: () => import('../views/portal/NoticeDetailView.vue'),
          meta: { tiers: [TIER_STUDENT, TIER_PROFESSOR, TIER_CORE_PROFESSOR, TIER_STAFF] }
        },
        {
          path: 'registration',
          name: 'portal-registration',
          component: () => import('../views/portal/RegistrationView.vue'),
          meta: { tiers: [TIER_STUDENT] }
        },
        {
          path: 'kpi',
          name: 'portal-kpi',
          component: () => import('../views/portal/KpiDashboardView.vue'),
          meta: { tiers: [TIER_CORE_PROFESSOR, TIER_STAFF, TIER_SYSTEM_ADMIN] }
        },
        {
          path: 'microdegree',
          name: 'portal-microdegree',
          component: () => import('../views/portal/MicrodegreeSimulatorView.vue'),
          meta: { tiers: [TIER_STUDENT] }
        },
        {
          path: 'counseling',
          name: 'portal-counseling',
          component: () => import('../views/portal/CounselingView.vue'),
          meta: { tiers: [TIER_STUDENT, TIER_PROFESSOR, TIER_CORE_PROFESSOR] }
        },
        {
          path: 'subjects',
          name: 'portal-subjects',
          component: () => import('../views/portal/SubjectManagementView.vue'),
          meta: { tiers: [TIER_PROFESSOR, TIER_CORE_PROFESSOR] }
        },
        {
          path: 'admin',
          name: 'portal-admin',
          component: () => import('../views/portal/AdminDashboardView.vue'),
          meta: { tiers: [TIER_CORE_PROFESSOR, TIER_STAFF, TIER_SYSTEM_ADMIN] }
        }
      ]
    }
  ]
})

// 새로고침하면 session(메모리 상태)은 초기화되지만 localStorage의 accessToken은 남아있다.
// 토큰이 있으면 /auth/me로 한 번 검증해서 로그인 상태를 복원한다(만료/무효면 로그인 화면으로).
let rehydrateAttempted = false

async function rehydrateSession() {
  rehydrateAttempted = true
  const token = localStorage.getItem('accessToken')
  if (!token) return
  session.accessToken = token
  session.refreshToken = localStorage.getItem('refreshToken')
  try {
    const me = await authApi.getMe()
    session.role = me.profile_type === 'professor' ? 'professor' : 'student'
    session.roles = me.roles || []
    if (me.profile_type === 'professor') {
      session.professorName = me.name || session.professorName
    } else if (me.profile_type === 'staff') {
      session.staffName = me.name || session.staffName
    } else {
      session.studentName = me.name || session.studentName
    }
    session.isAuthenticated = true
  } catch (e) {
    clearSession()
  }
}

router.beforeEach(async (to) => {
  if (to.path.startsWith('/portal') && to.name !== 'portal-login' && !session.isAuthenticated) {
    if (!rehydrateAttempted) await rehydrateSession()
    if (!session.isAuthenticated) return { name: 'portal-login' }
  }
  // 역할별 탭 접근 제어: 이 역할이 볼 수 없는 탭으로 직접 URL 진입하면 마이페이지로 돌려보낸다.
  if (to.meta?.tiers && !to.meta.tiers.includes(getTier(session))) {
    return { name: 'portal-home' }
  }
})

export default router
