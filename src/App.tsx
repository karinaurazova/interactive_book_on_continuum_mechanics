import { useState } from 'react'
import { ScaleExplorer } from './components/ScaleExplorer'
import { CutTheBody } from './components/CutTheBody'
import { TractionLab } from './components/TractionLab'
import { OrientationMap } from './components/OrientationMap'
import { CauchyTetrahedron } from './components/CauchyTetrahedron'
import { StressComponents } from './components/StressComponents'
import { AngularMomentumBalance } from './components/AngularMomentumBalance'
import { TractionDecomposition } from './components/TractionDecomposition'
import { BasisTransform } from './components/BasisTransform'
import { PrincipalStresses } from './components/PrincipalStresses'
import { StressInvariants } from './components/StressInvariants'
import { StressDecomposition } from './components/StressDecomposition'
import { MohrCircle } from './components/MohrCircle'
import { ComputationalLab } from './components/ComputationalLab'
import { FinalChallenge } from './components/FinalChallenge'
import { ui, type Language, type NotationMode } from './i18n'

type ModuleId = 'M00' | 'M01' | 'M02' | 'M03' | 'M04' | 'M05' | 'M06' | 'M07' | 'M08' | 'M09' | 'M10' | 'M11' | 'M12' | 'M13' | 'M14'

const moduleIds: ModuleId[] = ['M00', 'M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12', 'M13', 'M14']

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
              <span>15 / 15</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '100%' }} />
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
              onNext={() => setActive('M03')}
            />
          )}

          {active === 'M03' && (
            <OrientationMap
              notation={notation}
              language={language}
              onBack={() => setActive('M02')}
              onNext={() => setActive('M04')}
            />
          )}

          {active === 'M04' && (
            <CauchyTetrahedron
              notation={notation}
              language={language}
              onBack={() => setActive('M03')}
              onNext={() => setActive('M05')}
            />
          )}

          {active === 'M05' && (
            <StressComponents
              notation={notation}
              language={language}
              onBack={() => setActive('M04')}
              onNext={() => setActive('M06')}
            />
          )}

          {active === 'M06' && (
            <AngularMomentumBalance
              notation={notation}
              language={language}
              onBack={() => setActive('M05')}
              onNext={() => setActive('M07')}
            />
          )}

          {active === 'M07' && (
            <TractionDecomposition
              notation={notation}
              language={language}
              onBack={() => setActive('M06')}
              onNext={() => setActive('M08')}
            />
          )}

          {active === 'M08' && (
            <BasisTransform
              notation={notation}
              language={language}
              onBack={() => setActive('M07')}
              onNext={() => setActive('M09')}
            />
          )}

          {active === 'M09' && (
            <PrincipalStresses
              notation={notation}
              language={language}
              onBack={() => setActive('M08')}
              onNext={() => setActive('M10')}
            />
          )}

          {active === 'M10' && (
            <StressInvariants
              notation={notation}
              language={language}
              onBack={() => setActive('M09')}
              onNext={() => setActive('M11')}
            />
          )}

          {active === 'M11' && (
            <StressDecomposition
              notation={notation}
              language={language}
              onBack={() => setActive('M10')}
              onNext={() => setActive('M12')}
            />
          )}

          {active === 'M12' && (
            <MohrCircle
              notation={notation}
              language={language}
              onBack={() => setActive('M11')}
              onNext={() => setActive('M13')}
            />
          )}

          {active === 'M13' && (
            <ComputationalLab
              notation={notation}
              language={language}
              onBack={() => setActive('M12')}
              onNext={() => setActive('M14')}
            />
          )}

          {active === 'M14' && (
            <FinalChallenge
              notation={notation}
              language={language}
              onBack={() => setActive('M13')}
            />
          )}
        </main>
      </div>
    </div>
  )
}
