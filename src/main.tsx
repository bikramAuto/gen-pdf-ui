import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Home from './components/Home'
import Documentation from './components/Documentation'
import './styles/global.css'

function Root() {
  // If ?id= is present, go straight to App so SetPassword renders
  const hasSetPasswordParam = new URLSearchParams(window.location.search).has('id')
  const [view, setView] = useState<'home' | 'editor' | 'documentation'>(hasSetPasswordParam ? 'editor' : 'home')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('editorTheme') as 'light' | 'dark') || 'light')

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('editorTheme', newTheme)
  }

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.style.colorScheme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.colorScheme = 'light'
    }
  }, [theme])

  if (view === 'editor') {
    return <App onGoToHome={() => setView('home')} theme={theme} onToggleTheme={toggleTheme} />
  }
  
  if (view === 'documentation') {
    return <Documentation onBack={() => setView('home')} onGoToEditor={() => setView('editor')} theme={theme} onToggleTheme={toggleTheme} />
  }

  return <Home onGoToEditor={() => setView('editor')} onGoToDocs={() => setView('documentation')} theme={theme} onToggleTheme={toggleTheme} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
