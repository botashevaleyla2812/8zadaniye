import { useEffect, useState } from 'react'
import { getProfile, getSpecializations, login, logout, register, updateProfile, type Specialization } from './api'

type Profile = {
  first_name?: string
  specialization?: string
  specialization_display?: string
  bio?: string
  fee?: string | number
}

type User = {
  id?: number
  username?: string
  profile?: Profile
}

function App() {
  const [page, setPage] = useState<'home' | 'login' | 'register' | 'profile'>('home')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<User | null>(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [specialization, setSpecialization] = useState('vocals')
  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [bio, setBio] = useState('')
  const [fee, setFee] = useState('0')

  useEffect(() => {
    if (page !== 'profile') return

    let cancelled = false
    getSpecializations()
      .then((items) => {
        if (cancelled) return
        setSpecializations(items)
        setSpecialization((current) =>
          items.some((item) => item.value === current)
            ? current
            : (items[0]?.value ?? '')
        )
      })
      .catch((error) => {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : 'Не удалось загрузить список специализаций.')
        }
      })

    return () => { cancelled = true }
  }, [page])

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await register(username, password)
      setMessage('Регистрация прошла успешно. Теперь войди в аккаунт.')
      setPassword('')
      setPage('login')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Ошибка регистрации.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await login(username, password)
      const result = await getProfile() as User
      setUser(result)
      setUsername(result?.username || username)
      setFirstName(result?.profile?.first_name || '')
      setSpecialization(result?.profile?.specialization || 'vocals')
      setBio(result?.profile?.bio || '')
      setFee(String(result?.profile?.fee ?? '0'))
      setPage('profile')
      setMessage('Ты вошла в систему!')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Ошибка входа. Проверь API.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const result = await updateProfile({
        first_name: firstName,
        specialization,
        bio,
        fee: Number(fee),
      }) as User
      setUser(result?.profile ? result : {
        ...user,
        profile: { first_name: firstName, specialization, bio, fee },
      })
      setMessage('Профиль сохранён.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось сохранить профиль.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    setLoading(true)
    setMessage('')
    try {
      await logout()
      setUser(null)
      setPassword('')
      setPage('home')
      setMessage('Ты вышла из системы.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось выйти.')
    } finally {
      setLoading(false)
    }
  }

  function openPage(nextPage: typeof page) {
    setMessage('')
    setPage(nextPage)
  }

  return (
    <div className="site">
      {loading && <div className="loading">Загрузка...</div>}

      <header className="header">
        <a className="logo" href="#" onClick={(event) => { event.preventDefault(); openPage('home') }}>MY BAND</a>
        <nav>
          <button onClick={() => openPage('home')}>Главная</button>
          {user ? (
            <>
              <button onClick={() => openPage('profile')}>Мой профиль</button>
              <button onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <>
              <button onClick={() => openPage('login')}>Войти</button>
              <button className="nav-register" onClick={() => openPage('register')}>Регистрация</button>
            </>
          )}
        </nav>
      </header>

      <main>
        {page === 'home' && (
          <section className="hero">
            <div className="hero-text">
              <p className="small-title">НАША МУЗЫКАЛЬНАЯ ГРУППА</p>
              <h1>Музыка объединяет</h1>
              <p>Добро пожаловать на наш сайт! Здесь можно узнать о группе и создать свой аккаунт.</p>
              <button className="primary" onClick={() => openPage(user ? 'profile' : 'register')}>
                {user ? 'Открыть профиль' : 'Присоединиться'}
              </button>
            </div>
          </section>
        )}

        {page === 'login' && (
          <section className="form-card">
            <h1>Вход</h1>
            <p>Войди в свой аккаунт.</p>
            <form onSubmit={handleLogin}>
              <label>Имя пользователя
                <input value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
              </label>
              <label>Пароль
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
              </label>
              <button className="primary" type="submit">Войти</button>
            </form>
            <p className="switch">Нет аккаунта? <button onClick={() => openPage('register')}>Зарегистрироваться</button></p>
          </section>
        )}

        {page === 'register' && (
          <section className="form-card">
            <h1>Регистрация</h1>
            <p>Создай аккаунт на сайте группы.</p>
            <form onSubmit={handleRegister}>
              <label>Имя пользователя
                <input value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
              </label>
              <label>Пароль
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required autoComplete="new-password" />
              </label>
              <button className="primary" type="submit">Создать аккаунт</button>
            </form>
            <p className="switch">Уже есть аккаунт? <button onClick={() => openPage('login')}>Войти</button></p>
          </section>
        )}

        {page === 'profile' && (
          <section className="form-card">
            <h1>Мой профиль</h1>
            <p>Имя пользователя: <strong>{user?.username || username}</strong></p>
            <form onSubmit={handleSaveProfile}>
              <label>Имя
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </label>
              <label>Специализация
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                  disabled={specializations.length === 0}
                >
                  {specializations.length === 0 && <option value="">Загрузка специализаций...</option>}
                  {specializations.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>
              <label>О себе
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
              </label>
              <label>Стоимость выступления
                <input type="number" min="0" step="0.01" value={fee} onChange={(e) => setFee(e.target.value)} required />
              </label>
              <button className="primary" type="submit">Сохранить изменения</button>
            </form>
            <button className="secondary" onClick={handleLogout}>Выйти из аккаунта</button>
            {user && <p className="hint">Данные профиля загружены с сервера.</p>}
          </section>
        )}

        {message && <p className="message" role="status">{message}</p>}
      </main>

      <footer>MY BAND · Учебный проект на React и TypeScript</footer>
    </div>
  )
}

export default App
