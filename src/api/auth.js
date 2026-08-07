import http from './http'

export function login(email, password) {
  return http.post('/v1/auth/login', { email, password })
}

export function getMe() {
  return http.get('/v1/auth/me')
}

export function refresh(refreshToken) {
  return http.post('/v1/auth/refresh', { refresh_token: refreshToken })
}
