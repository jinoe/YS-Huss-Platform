import { createI18n } from 'vue-i18n'

const messages = {
  ko: {
    nav: {
      intro: { title: '사업소개', greeting: '사업단장 인사말', vision: '비전 및 목표', withus: 'FLASH 인재상', consortium: '컨소시엄 구성', organization: '사업단 조직도', contact: '찾아오시는 길' },
      curriculum: { title: '교육과정', intro: '교육과정 소개', subject: '개설과목', microdegree: '마이크로디그리', program: '비교과프로그램' },
      support: { title: '학생지원', info: '지원제도', club: '동아리', job: '취업정보' },
      share: { title: '성과공유', result: '우수성과', newsletter: '뉴스레터', cardnews: '카드뉴스' },
      bulletin: { title: '정보광장', notice: '공지사항', partnerNotice: '참여대학 공지', data: '자료실', faq: 'FAQ', schedule: '사업단 일정' }
    },
    header: {
      subtitle: '인문사회융합인재양성사업단',
      lms: 'LMS',
      langToggle: 'ENG'
    },
    footer: {
      address: '서울특별시 서대문구 연세로 50 연세대학교',
      policy: '개인정보처리방침',
      copyright: 'COPYRIGHT ⓒ YONSEI UNIVERSITY. ALL RIGHTS RESERVED'
    },
    home: {
      performanceTitle: '우수성과',
      noticeTitle: '공지사항',
      partnerNoticeTitle: '참여대학 공지',
      scheduleTitle: '사업단 일정',
      apply: '신청하기',
      cardnews: '카드뉴스',
      faq: 'FAQ'
    },
    portal: {
      sidebar: { mypage: '마이페이지', courses: '수강편람', registration: '수강신청', microdegree: '나노디그리 시뮬레이터', counseling: '학사지도·상담', subjects: '교과목 관리', kpi: 'KPI 대시보드', admin: '관리자' },
      exit: '홈페이지 바로가기',
      logout: '로그아웃',
      notice: '공지사항',
      quicklinks: '바로가기',
      recommend: '추천 교과목·프로그램',
      tier: { student: '학생', professor: '일반교수', 'core-professor': '핵심교수', staff: '운영진', 'system-admin': '관리자' }
    }
  },
  en: {
    nav: {
      intro: { title: 'About', greeting: "Director's Message", vision: 'Vision & Goals', withus: 'FLASH Talent', consortium: 'Consortium', organization: 'Organization', contact: 'Location' },
      curriculum: { title: 'Curriculum', intro: 'Overview', subject: 'Courses', microdegree: 'Microdegree', program: 'Extracurricular' },
      support: { title: 'Student Support', info: 'Support Programs', club: 'Clubs', job: 'Careers' },
      share: { title: 'Achievements', result: 'Highlights', newsletter: 'Newsletter', cardnews: 'Card News' },
      bulletin: { title: 'Information', notice: 'Notices', partnerNotice: 'Partner Notices', data: 'Resources', faq: 'FAQ', schedule: 'Schedule' }
    },
    header: {
      subtitle: 'Humanities Utmost Sharing System',
      lms: 'LMS',
      langToggle: 'KOR'
    },
    footer: {
      address: '50 Yonsei-ro, Seodaemun-gu, Seoul, Yonsei University',
      policy: 'Privacy Policy',
      copyright: 'COPYRIGHT ⓒ YONSEI UNIVERSITY. ALL RIGHTS RESERVED'
    },
    home: {
      performanceTitle: 'Highlights',
      noticeTitle: 'Notices',
      partnerNoticeTitle: 'Partner Notices',
      scheduleTitle: 'Program Schedule',
      apply: 'Apply Now',
      cardnews: 'Card News',
      faq: 'FAQ'
    },
    portal: {
      sidebar: { mypage: 'My Page', courses: 'Course Catalog', registration: 'Course Registration', microdegree: 'Microdegree Simulator', counseling: 'Advising & Counseling', subjects: 'Course Management', kpi: 'KPI Dashboard', admin: 'Admin' },
      exit: 'Visit Main Site',
      logout: 'Log Out',
      notice: 'Notices',
      quicklinks: 'Quick Links',
      recommend: 'Recommended for You',
      tier: { student: 'Student', professor: 'Professor', 'core-professor': 'Core Professor', staff: 'Staff', 'system-admin': 'Admin' }
    }
  }
}

export default createI18n({
  legacy: false,
  locale: 'ko',
  fallbackLocale: 'ko',
  messages
})
