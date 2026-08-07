<script>
import session from '../../data/session.js'
import * as authApi from '../../api/auth.js'
import AlertModal from '../../components/portal/AlertModal.vue'

export default {
  name: 'PortalLoginView',
  components: { AlertModal },
  data() {
    return {
      email: '',
      password: '',
      error: '',
      submitting: false
    }
  },
  methods: {
    async login() {
      this.error = ''
      this.submitting = true
      try {
        const tokens = await authApi.login(this.email, this.password)
        session.accessToken = tokens.access_token
        session.refreshToken = tokens.refresh_token
        localStorage.setItem('accessToken', tokens.access_token)
        localStorage.setItem('refreshToken', tokens.refresh_token)

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
        this.$router.push('/portal')
      } catch (e) {
        this.error = e?.response?.data?.detail || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<template>
  <div class="login-page">
    <span class="login-watermark">HUSS</span>
    <div class="login-card">
      <div class="login-photo">
        <p class="login-slogan">나는 <strong>HUSS인</strong><br />나의 미래를 만든다!</p>
        <p class="login-subslogan">진리와 자유를 향한 미래융합의 도전</p>
      </div>
      <div class="login-form">
        <div class="login-brand">
          <img src="../../assets/yonsei-logo-dark.png" alt="연세대학교" class="login-logo" />
          <span class="login-brand-text">HUSS 포탈</span>
        </div>
        <form @submit.prevent="login">
          <input v-model="email" type="email" placeholder="이메일 (Email)" />
          <input v-model="password" type="password" placeholder="비밀번호 (Password)" />
          <button type="submit" class="login-submit" :disabled="submitting">
            {{ submitting ? '로그인 중...' : '로그인(Login)' }}
          </button>
        </form>
        <p class="login-demo-hint">
          데모 계정(비밀번호 전부 huss1234!)<br />
          학생: student@yonsei.ac.kr · 일반교수: professor@yonsei.ac.kr<br />
          핵심교수: admin@yonsei.ac.kr · 운영진: staff@yonsei.ac.kr<br />
          관리자: super@yonsei.ac.kr
        </p>
        <p class="login-footnote">이용 후 반드시 로그아웃 해주세요.<br />Please be sure to log out after use.</p>
      </div>
    </div>
    <AlertModal :message="error" @close="error = ''" />
  </div>
</template>

<style scoped>
.login-page {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(160deg, var(--color-primary-dark), var(--color-primary)) fixed;
  overflow: hidden;
}

.login-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 22vw;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.06);
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}

.login-card {
  position: relative;
  width: 100%;
  max-width: 900px;
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.login-photo {
  position: relative;
  flex: 0 0 42%;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(160deg, var(--color-primary-dark), var(--color-primary));
  color: #fff;
  overflow: hidden;
}

.login-photo::before {
  content: '';
  position: absolute;
  left: 24px;
  bottom: 0;
  width: 48px;
  height: 6px;
  background: var(--color-yellow);
}

.login-slogan {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 12px;
}

.login-subslogan {
  font-size: 13px;
  opacity: 0.85;
  margin: 0;
}

.login-form {
  flex: 1;
  padding: 40px 40px 32px;
  display: flex;
  flex-direction: column;
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.login-logo {
  height: 28px;
}

.login-brand-text {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-text);
}

.login-form form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.login-form input {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text);
}

.login-form input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.login-submit {
  background: var(--color-primary-dark);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.login-submit:hover {
  background: var(--color-primary);
}

.login-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-demo-hint {
  margin: 16px 0 0;
  font-size: 12px;
  color: var(--color-muted);
  line-height: 1.6;
  background: var(--bg-soft);
  border-radius: 8px;
  padding: 10px 12px;
}

.login-footnote {
  margin: 24px 0 0;
  font-size: 12px;
  color: var(--color-muted);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
  }
  .login-photo {
    flex-basis: auto;
    padding: 28px 24px;
  }
  .login-watermark {
    font-size: 40vw;
  }
}
</style>
