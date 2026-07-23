import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CurriculumLayout from '../views/curriculum/CurriculumLayout.vue'
import IntroLayout from '../views/intro/IntroLayout.vue'
import SupportLayout from '../views/support/SupportLayout.vue'
import ShareLayout from '../views/share/ShareLayout.vue'
import BulletinLayout from '../views/bulletin/BulletinLayout.vue'

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
          path: 'department',
          name: 'curriculum-department',
          component: () => import('../views/curriculum/CurriculumDeptView.vue')
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
      path: '/portal',
      component: () => import('../views/portal/PortalLayout.vue'),
      meta: { bare: true },
      children: [
        {
          path: '',
          name: 'portal-home',
          component: () => import('../views/portal/PortalHomeView.vue')
        },
        {
          path: 'microdegree',
          name: 'portal-microdegree',
          component: () => import('../views/portal/MicrodegreeSimulatorView.vue')
        },
        {
          path: 'counseling',
          name: 'portal-counseling',
          component: () => import('../views/portal/CounselingView.vue')
        },
        {
          path: 'subjects',
          name: 'portal-subjects',
          component: () => import('../views/portal/SubjectManagementView.vue')
        },
        {
          path: 'admin',
          name: 'portal-admin',
          component: () => import('../views/portal/AdminDashboardView.vue')
        }
      ]
    }
  ]
})

export default router
