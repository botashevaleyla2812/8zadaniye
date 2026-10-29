// Все запросы к API находятся в этом файле.
const API_URL = 'https://inai-col2.fishrungames.com/api'

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  })

  const text = await response.text()
  let data: any = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      // Сервер иногда может вернуть HTML вместо JSON.
      data = null
    }
  }

  if (!response.ok) {
    const detail = data?.detail || data?.message || data?.error
    if (typeof detail === 'string') throw new Error(detail)
    if (detail) throw new Error(JSON.stringify(detail))
    if (response.status === 401 || response.status === 403) {
      throw new Error('Нет доступа. Проверь имя пользователя и пароль или войди заново.')
    }
    throw new Error(`Ошибка сервера (${response.status}). Проверь данные и попробуй ещё раз.`)
  }

  if (text && data === null) {
    throw new Error('Сервер вернул не JSON. Проверь адрес API и настройки сервера.')
  }

  return data
}

// POST /api/register/
export function register(username: string, password: string) {
  return request('/register/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

// POST /api/login/
export function login(username: string, password: string) {
  return request('/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

// POST /api/logout/
export function logout() {
  return request('/logout/', { method: 'POST' })
}

// GET /api/profile/
export function getProfile() {
  return request('/profile/')
}

// PATCH /api/profile/
export type ProfileUpdate = {
  first_name: string
  specialization: string
  bio: string
  fee: number
}

export function updateProfile(profile: ProfileUpdate) {
  return request('/profile/', {
    method: 'PATCH',
    body: JSON.stringify(profile),
  })
}

// GET /api/specializations/
export type Specialization = {
  value: string
  label: string
}

export function getSpecializations(): Promise<Specialization[]> {
  return request('/specializations/')
}
