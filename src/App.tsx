import { useState } from 'react'
import { chapterById, moduleById, type ModuleId } from './content/catalog'
import { ui, type Language, type NotationMode } from './i18n'

export default function App() {
  const [active, setActive] = useState<ModuleId>('M00')
  const [notation, setNotation] = useState<NotationMode>('Tensor')
  const [language, setLanguage] = useState<Language>('ru')

  const copy = ui[language]
  const activeModule = moduleById[active]
  const chapter = chapterById[activeModule.chapterId]
  const moduleIndex = chapter.moduleIds.indexOf(active)
  const completedCount = moduleIndex + 1
  const progress = Math.round((completedCount / chapter.moduleIds.length) * 100)

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

          <div className="notation-switch" aria-label={copy.notationLabel}>
            {(['Tensor', 'Index', 'Matrix', 'Python'] as const).map((item) => (
              <button
                key={item}
                className={notation === item ? 'notation active' : 'notation'}
                onClick={() => setNotation(item)}
              >
                {copy.notationNames[item]}
              </button>
            ))}
          </div>
          <div className="version">v0.2</div>
        </div>
      </header>

      <div className="workspace">
        <aside className="module-nav">
          <div className="nav-label">{chapter.title[language]}</div>

          {chapter.moduleIds.map((id) => (
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
              <span>{completedCount} / {chapter.moduleIds.length}</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </aside>

        <main className="lesson">
          {activeModule.render({
            notation,
            language,
            goTo: setActive,
          })}
        </main>
      </div>
    </div>
  )
}
