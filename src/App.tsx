import { useState } from 'react'
import { ScaleExplorer } from './components/ScaleExplorer'
import { CutTheBody } from './components/CutTheBody'

type ModuleId = 'M00' | 'M01'

const modules = [
  { id: 'M00' as const, title: 'Континуум', subtitle: 'От микроструктуры к полю' },
  { id: 'M01' as const, title: 'Мысленный разрез', subtitle: 'Как увидеть внутреннее взаимодействие' },
]

export default function App() {
  const [active, setActive] = useState<ModuleId>('M00')
  const [notation, setNotation] = useState<'Tensor' | 'Index' | 'Matrix' | 'Python'>('Tensor')

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">ЗАКУЛИСЬЕ МАТМОДЕЛЬЕРА / MSS</div>
          <div className="brand">Continuum Mechanics Lab</div>
        </div>

        <div className="top-actions">
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
          <div className="nav-label">ПИЛОТНАЯ ГЛАВА</div>
          {modules.map((module) => (
            <button
              key={module.id}
              className={active === module.id ? 'module-card active' : 'module-card'}
              onClick={() => setActive(module.id)}
            >
              <span className="module-code">{module.id}</span>
              <span>
                <strong>{module.title}</strong>
                <small>{module.subtitle}</small>
              </span>
            </button>
          ))}

          <div className="progress-block">
            <div className="progress-head">
              <span>Прогресс v0.1</span>
              <span>2 / 15</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '13%' }} />
            </div>
          </div>
        </aside>

        <main className="lesson">
          {active === 'M00' ? (
            <ScaleExplorer notation={notation} onNext={() => setActive('M01')} />
          ) : (
            <CutTheBody notation={notation} onBack={() => setActive('M00')} />
          )}
        </main>
      </div>
    </div>
  )
}
