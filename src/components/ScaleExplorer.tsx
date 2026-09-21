import { useMemo, useState } from 'react'

type Props = {
  notation: 'Tensor' | 'Index' | 'Matrix' | 'Python'
  onNext: () => void
}

const particles = Array.from({ length: 54 }, (_, i) => ({
  x: 8 + ((i * 37) % 86),
  y: 10 + ((i * 53) % 78),
  r: 1.2 + ((i * 17) % 5) * 0.18,
}))

function notationText(mode: Props['notation']) {
  if (mode === 'Index') return 'vᵢ(x, t)'
  if (mode === 'Matrix') return '[ v₁  v₂  v₃ ]ᵀ'
  if (mode === 'Python') return 'v = velocity(x, t)'
  return '𝐯(𝐱, t)'
}

export function ScaleExplorer({ notation, onNext }: Props) {
  const [scale, setScale] = useState(28)
  const continuum = scale / 100
  const particleOpacity = Math.max(0.08, 1 - continuum * 1.15)
  const fieldOpacity = Math.max(0, (continuum - 0.18) / 0.82)

  const regime = useMemo(() => {
    if (scale < 35) return 'микроструктура'
    if (scale < 70) return 'область усреднения'
    return 'континуальное описание'
  }, [scale])

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <div className="lesson-index">M00 / 01</div>
        <h1>От реального вещества к континууму</h1>
        <p className="lead">
          Механика сплошной среды не утверждает, что вещество непрерывно на любом масштабе.
          Она заменяет микроструктуру полевым описанием там, где такое усреднение физически оправдано.
        </p>

        <div className="concept-card">
          <span>КЛЮЧЕВАЯ МЫСЛЬ</span>
          <strong>Непрерывность — это модель масштаба, а не отрицание микроструктуры.</strong>
        </div>

        <div className="definition">
          <div className="definition-label">Поля</div>
          <div className="formula">ρ(𝐱,t) &nbsp;&nbsp; {notationText(notation)} &nbsp;&nbsp; T(𝐱,t)</div>
          <p>
            Каждой точке пространства и моменту времени сопоставляется значение физической величины.
          </p>
        </div>

        <button className="primary-button" onClick={onNext}>
          Перейти к мысленному разрезу →
        </button>
      </div>

      <div className="scene-column">
        <div className="scene-card">
          <div className="scene-head">
            <div>
              <span className="scene-kicker">SCALE EXPLORER</span>
              <h2>{regime}</h2>
            </div>
            <div className="live-badge">LIVE</div>
          </div>

          <svg className="continuum-scene" viewBox="0 0 100 70" role="img" aria-label="Переход от дискретной микроструктуры к непрерывному полю">
            <defs>
              <linearGradient id="field" x1="0" x2="1">
                <stop offset="0%" stopColor="#2864FF" stopOpacity="0.16" />
                <stop offset="52%" stopColor="#A9E3D2" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#2864FF" stopOpacity="0.32" />
              </linearGradient>
              <filter id="soft">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>

            <rect x="3" y="5" width="94" height="60" rx="8" fill="#111318" />
            <path
              d="M8 48 C22 22, 35 58, 49 28 C62 3, 77 51, 94 18 L94 60 L8 60 Z"
              fill="url(#field)"
              opacity={fieldOpacity}
              filter="url(#soft)"
            />
            <path
              d="M6 43 C22 29, 33 49, 48 32 C63 15, 77 43, 95 24"
              fill="none"
              stroke="#A9E3D2"
              strokeWidth="0.75"
              opacity={fieldOpacity * 0.85}
            />
            <path
              d="M6 50 C20 38, 37 57, 53 38 C68 20, 82 50, 95 35"
              fill="none"
              stroke="#2864FF"
              strokeWidth="0.75"
              opacity={fieldOpacity * 0.8}
            />

            {particles.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={p.r}
                fill={i % 4 === 0 ? '#A9E3D2' : '#F4F2EC'}
                opacity={particleOpacity}
              />
            ))}

            {fieldOpacity > 0.2 && (
              <>
                <circle cx="63" cy="34" r="1.5" fill="#2864FF" />
                <line x1="63" y1="34" x2="73" y2="27" stroke="#A9E3D2" strokeWidth="1.4" />
                <polygon points="73,27 69.8,27.8 71.8,30" fill="#A9E3D2" />
                <text x="74" y="25" fill="#F4F2EC" fontSize="4">v(x)</text>
              </>
            )}
          </svg>

          <div className="slider-row">
            <span>micro</span>
            <input
              aria-label="Scale"
              type="range"
              min="0"
              max="100"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            />
            <span>continuum</span>
          </div>

          <div className="metrics">
            <div>
              <span>масштаб</span>
              <strong>{scale}%</strong>
            </div>
            <div>
              <span>частицы</span>
              <strong>{Math.round(particleOpacity * 100)}%</strong>
            </div>
            <div>
              <span>поле</span>
              <strong>{Math.round(fieldOpacity * 100)}%</strong>
            </div>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="prediction-card">
            <span>PREDICTION</span>
            <strong>Когда дискретные детали перестают быть частью полезного описания?</strong>
            <p>Двигай масштаб и найди область, где поле становится информативнее отдельных частиц.</p>
          </div>

          <div className="warning-card">
            <span>НЕ ПЕРЕПУТАТЬ</span>
            <strong>Континуум ≠ «вещество реально непрерывно».</strong>
            <p>Это идеализация, корректность которой зависит от масштаба задачи.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
