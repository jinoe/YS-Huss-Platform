<script>
import session from '../../data/session.js'

export default {
  name: 'PortalLoginView',
  data() {
    return {
      studentId: '',
      password: ''
    }
  },
  methods: {
    login() {
      // 임시 인증: 백엔드가 없어 ID/PW 값과 무관하게 로그인 버튼을 누르면 바로 통과시킨다.
      session.isAuthenticated = true
      this.$router.push('/portal')
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
          <input v-model="studentId" type="text" placeholder="학번(교번) (ID No.)" />
          <input v-model="password" type="password" placeholder="비밀번호 (Password)" />
          <button type="submit" class="login-submit">로그인(Login)</button>
        </form>
        <p class="login-footnote">이용 후 반드시 로그아웃 해주세요.<br />Please be sure to log out after use.</p>
      </div>
    </div>
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
