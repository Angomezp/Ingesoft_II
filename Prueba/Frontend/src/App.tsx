import { useEffect, type FormEvent, useState } from 'react'
import './App.css'

type Screen = 'login' | 'home' | 'tablas' | 'localidades'

type VersionResponse = {
  endpointVersion: string
  localVersionConfigured: boolean
  comparison?: 'equal' | 'higher' | 'lower'
  message?: string
  error?: string
}

type UserProfile = {
  nombre: string
  identificacion: string
  usuario: string
}

function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [userInput, setUserInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [versionMessage, setVersionMessage] = useState('')
  const [localidades, setLocalidades] = useState<Array<any>>([])
  const [localidadesError, setLocalidadesError] = useState('')
  const [loadingLocalidades, setLoadingLocalidades] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadVersion = async () => {
      try {
        const response = await fetch('/version')
        const data = (await response.json()) as VersionResponse

        if (!response.ok) {
          throw new Error(data.error ?? 'No se pudo consultar la versión')
        }

        if (!isMounted) {
          return
        }

        if (!data.localVersionConfigured) {
          localStorage.setItem('app.version', data.endpointVersion)
          setVersionMessage('')
          return
        }

        setVersionMessage(data.message ?? '')
      } catch {
        if (isMounted) {
          setVersionMessage('No se pudo consultar la versión')
        }
      }
    }

    loadVersion()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const loadLocalidades = async () => {
      if (screen !== 'localidades') return
      setLoadingLocalidades(true)
      setLocalidadesError('')
      try {
        const resp = await fetch('/localidades')
        if (!resp.ok) {
          const txt = await resp.text().catch(() => '')
          throw new Error(txt || `Status ${resp.status}`)
        }
        const data = await resp.json()
        // Normalizar: si viene objeto con array dentro, buscar el array
        let items: any[] = []
        if (Array.isArray(data)) items = data
        else if (Array.isArray(data?.data)) items = data.data
        else if (Array.isArray(data?.result)) items = data.result
        else if (data && typeof data === 'object') {
          // intentar encontrar la primera propiedad que sea array
          const arr = Object.values(data).find((v) => Array.isArray(v)) as any
          if (Array.isArray(arr)) items = arr
        }

        if (!isMounted) return
        setLocalidades(items)
      } catch (err: any) {
        if (!isMounted) return
        setLocalidadesError(String(err?.message ?? err))
      } finally {
        if (isMounted) setLoadingLocalidades(false)
      }
    }

    loadLocalidades()

    return () => {
      isMounted = false
    }
  }, [screen])

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError('')

    try {
      const resp = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userInput.trim(), password: passwordInput }),
      })

      const data = await resp.json()

      if (!resp.ok) {
        setError(data?.message ?? 'No se pudo iniciar sesion')
        return
      }

      // esperado: { ok: true, user: { NombreUsuario, Identificacion, NombreCompleto, TokenJWT? }, TokenJWT? }
      const user = data.user
      if (!user) {
        setError('Respuesta invalida del servidor')
        return
      }

      // token puede estar en raíz o en user; normalizar
      const tokenFromResp = data?.TokenJWT ?? user?.TokenJWT ?? data?.token ?? null
      setToken(tokenFromResp ?? null)

      setCurrentUser({
        nombre: user.NombreCompleto ?? user.NombreUsuario,
        identificacion: user.Identificacion ?? '',
        usuario: user.NombreUsuario,
      })
      setScreen('home')
    } catch ( err ) {
      console.error('Login error:', err)
      setError('Error de conexion con el servidor')
    }
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
      {versionMessage && <div className="version-banner">{versionMessage}</div>}

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
              {!token ? (
                <p className="screen-text error">
                  No hay jwt en el login, por lo tanto no se puede hacer la peticion a este endpoint
                </p>
              ) : (
                <p className="screen-text">Aqui puedes agregar tu contenido de tablas.</p>
              )}
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
              {loadingLocalidades ? (
                <p>Cargando localidades...</p>
              ) : localidadesError ? (
                <p className="error">{localidadesError}</p>
              ) : (
                <ul>
                  {localidades.length === 0 && <li>No hay localidades</li>}
                  {localidades.map((l, idx) => (
                    <li key={idx}>
                      <strong>{l.AbreviacionCiudad ?? l.abreviacionCiudad ?? ''}</strong>
                      : {l.NombreCompleto ?? l.nombreCompleto ?? ''}
                    </li>
                  ))}
                </ul>
              )}

              <button type="button" className="ghost" onClick={() => setScreen('home')}>
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
