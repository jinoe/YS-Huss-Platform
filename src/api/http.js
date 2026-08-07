import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  // Neon 서버리스 DB가 유휴 상태에서 깨어날 때(cold start) 실측 60~70초까지 걸렸다.
  // 여유 있게 잡는다. 10초/30초로는 첫 요청이 자주 타임아웃되어 로그인 실패로 오인됐다.
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json'
  }
})

function getOrCreateSessionId() {
  let id = sessionStorage.getItem('hussSessionId')
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem('hussSessionId', id)
  }
  return id
}

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['X-HUSS-Session'] = getOrCreateSessionId()
  return config
})

// 액세스 토큰 만료(15분) 시 401을 그대로 사용자에게 흘려보내지 않고 조용히
// 재발급 후 원 요청을 한 번 재시도한다. 리프레시 자체가 401이면(리프레시
// 토큰도 만료) 세션을 정리하고 로그인 화면으로 보낸다.
// 동시에 여러 요청이 401을 맞아도 리프레시 호출은 한 번만 나가도록
// refreshPromise를 공유한다.
let refreshPromise = null

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) throw new Error('no refresh token')
  // 순환 참조를 피하려고 axios를 직접 쓴다(auth.js가 http.js를 다시 import하면 순환).
  const { data } = await axios.post(
    `${http.defaults.baseURL}/v1/auth/refresh`,
    { refresh_token: refreshToken },
    { headers: { 'Content-Type': 'application/json' } }
  )
  localStorage.setItem('accessToken', data.access_token)
  localStorage.setItem('refreshToken', data.refresh_token)
  return data.access_token
}

http.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    console.error('[API Error]', error?.response?.status, error?.response?.data || error.message)
    const original = error.config
    const isRefreshCall = original?.url?.includes('/auth/refresh')
    if (error?.response?.status === 401 && !isRefreshCall && !original?._retried) {
      original._retried = true
      try {
        if (!refreshPromise) refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null })
        const newToken = await refreshPromise
        original.headers.Authorization = `Bearer ${newToken}`
        return http(original)
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        if (!window.location.pathname.startsWith('/portal/login')) {
          window.location.href = '/portal/login'
        }
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default http
