import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import DocsPage from './components/DocsPage'
import './styles/global.css'

function Root() {
  const [view, setView] = useState<'docs' | 'editor'>('docs')

  if (view === 'editor') {
    return <App onGoToDocs={() => setView('docs')} />
  }
  return <DocsPage onGoToEditor={() => setView('editor')} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
