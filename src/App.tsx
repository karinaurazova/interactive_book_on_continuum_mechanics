import { useState } from 'react'
import { ScaleExplorer } from './components/ScaleExplorer'
import { CutTheBody } from './components/CutTheBody'
import { TractionLab } from './components/TractionLab'
import { ui, type Language, type NotationMode } from './i18n'

type ModuleId = 'M00' | 'M01' | 'M02'

const moduleIds: ModuleId[] = ['M00', 'M01', 'M02']

export default function App() {
  const [active, setActive] = useState<ModuleId>('M00')
  const [notation, setNotation] = useState<NotationMode>('Tensor')
  const [language, setLanguage] = useState<Language>('ru')
  const copy = ui[language]

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">{copy.eyebrow}</div>
          <div className="brand">{copy.brand}</div>
        </div>

        <div className="top-actions">
          <div className="language-switch" aria-label={copy.language}>
            {(['ru', 'en'] as const).map((lang) => (
              <button
                key={lang}
                className={language === lang ? 'language-button active' : 'language-button'}
                onClick={() => setLanguage(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="notation-switch" aria-label="Notation mode">
            {(['Tensor', 'Index', 'Matrix', 'Python'] as const).map((item) => (
              <button
                key={item}
                className={notation === item ? 'notation active' : 'notation'}
                onClick={() => setNotation(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="version">v0.1</div>
        </div>
      </header>

      <div className="workspace">
        <aside className="module-nav">
          <div className="nav-label">{copy.pilot}</div>

          {moduleIds.map((id) => (
            <button
              key={id}
              className={active === id ? 'module-card active' : 'module-card'}
              onClick={() => setActive(id)}
            >
              <span className="module-code">{id}</span>
              <span>
                <strong>{copy.modules[id].title}</strong>
                <small>{copy.modules[id].subtitle}</small>
              </span>
            </button>
          ))}

          <div className="progress-block">
            <div className="progress-head">
              <span>{copy.progress}</span>
              <span>3 / 15</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '20%' }} />
            </div>
          </div>
        </aside>

        <main className="lesson">
          {active === 'M00' && (
            <ScaleExplorer
              notation={notation}
              language={language}
              onNext={() => setActive('M01')}
            />
          )}

          {active === 'M01' && (
            <CutTheBody
              notation={notation}
              language={language}
              onBack={() => setActive('M00')}
              onNext={() => setActive('M02')}
            />
          )}

          {active === 'M02' && (
            <TractionLab
              notation={notation}
              language={language}
              onBack={() => setActive('M01')}
            />
          )}
        </main>
      </div>
    </div>
  )
}
