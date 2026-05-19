import { type FormEvent, useState } from 'react'
import './App.css'

type Screen = 'login' | 'home' | 'tablas' | 'localidades'

type UserProfile = {
  nombre: string
  identificacion: string
  usuario: string
}

const MOCK_USER = {
  usuario: 'admin',
  password: '1234',
  nombre: 'Angel Perez',
  identificacion: '1020304050',
}

function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [userInput, setUserInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const okUser = userInput.trim() === MOCK_USER.usuario
    const okPass = passwordInput === MOCK_USER.password

    if (!okUser || !okPass) {
      setError('Usuario o contrasena incorrectos')
      return
    }

    setCurrentUser({
      nombre: MOCK_USER.nombre,
      identificacion: MOCK_USER.identificacion,
      usuario: MOCK_USER.usuario,
    })
    setError('')
    setScreen('home')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setUserInput('')
    setPasswordInput('')
    setError('')
    setScreen('login')
  }

  return (
    <main className="app">
      {screen === 'login' && (
        <section className="card">
          <h1>Iniciar sesion</h1>
          <p>Ingresa usuario y contrasena</p>

          <form onSubmit={handleLogin} className="form">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
            />

            <label htmlFor="password">Contrasena</label>
            <input
              id="password"
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="1234"
              autoComplete="current-password"
              required
            />

            {error && <p className="error">{error}</p>}

            <button type="submit" className="primary">
              Entrar
            </button>
          </form>

          <small className="hint">Demo: admin / 1234</small>
        </section>
      )}

      {screen !== 'login' && currentUser && (
        <section className="card">
          <header className="topbar">
            <strong>Panel</strong>
            <button type="button" className="ghost" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </header>

          {screen === 'home' && (
            <>
              <h1>Home</h1>

              <div className="profile">
                <p>
                  <span>Nombre:</span> {currentUser.nombre}
                </p>
                <p>
                  <span>Identificacion:</span> {currentUser.identificacion}
                </p>
                <p>
                  <span>Usuario:</span> {currentUser.usuario}
                </p>
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="primary"
                  onClick={() => setScreen('tablas')}
                >
                  Ir a Tablas
                </button>
                <button
                  type="button"
                  className="primary"
                  onClick={() => setScreen('localidades')}
                >
                  Ir a Localidades
                </button>
              </div>
            </>
          )}

          {screen === 'tablas' && (
            <>
              <h1>Tablas</h1>
              <p className="screen-text">
                Aqui puedes agregar tu contenido de tablas.
              </p>
              <button
                type="button"
                className="ghost"
                onClick={() => setScreen('home')}
              >
                Volver a Home
              </button>
            </>
          )}

          {screen === 'localidades' && (
            <>
              <h1>Localidades</h1>
              <p className="screen-text">
                Aqui puedes agregar tu contenido de localidades.
              </p>
              <button
                type="button"
                className="ghost"
                onClick={() => setScreen('home')}
              >
                Volver a Home
              </button>
            </>
          )}
        </section>
      )}
    </main>
  )
}

export default App
