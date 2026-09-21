import { useState } from 'react'

type Props = {
  notation: 'Tensor' | 'Index' | 'Matrix' | 'Python'
  onBack: () => void
}

export function CutTheBody({ notation, onBack }: Props) {
  const [cut, setCut] = useState(50)
  const [angle, setAngle] = useState(0)
  const [showTraction, setShowTraction] = useState(true)

  const x = 18 + cut * 0.64
  const rad = (angle * Math.PI) / 180
  const dx = Math.sin(rad) * 18
  const dy = Math.cos(rad) * 18

  const notationLine =
    notation === 'Index' ? 'tᵢ(x,n)' :
    notation === 'Matrix' ? '[t₁ t₂ t₃]ᵀ' :
    notation === 'Python' ? 't = traction(x, n)' :
    '𝐭(𝐱,𝐧)'

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>← M00</button>
        <div className="lesson-index">M01 / 02</div>
        <h1>Мысленный разрез тела</h1>
        <p className="lead">
          Разрез не создаёт внутренние силы. Он делает взаимодействие между двумя частями тела явным и доступным для анализа.
        </p>

        <div className="concept-card">
          <span>КЛЮЧЕВАЯ МЫСЛЬ</span>
          <strong>Через одну и ту же точку можно провести бесконечно много площадок.</strong>
        </div>

        <div className="definition">
          <div className="definition-label">Локальный объект</div>
          <div className="formula">{notationLine}</div>
          <p>
            Вектор локального взаимодействия зависит не только от точки, но и от ориентации площадки.
          </p>
        </div>
      </div>

      <div className="scene-column">
        <div className="scene-card">
          <div className="scene-head">
            <div>
              <span className="scene-kicker">CUT THE BODY</span>
              <h2>внутреннее взаимодействие</h2>
            </div>
            <button
              className={showTraction ? 'toggle active' : 'toggle'}
              onClick={() => setShowTraction(!showTraction)}
            >
              traction
            </button>
          </div>

          <svg className="cut-scene" viewBox="0 0 100 70" role="img" aria-label="Мысленный разрез нагруженного тела">
            <rect x="12" y="18" width="76" height="34" rx="8" fill="#20242C" stroke="#383D48" strokeWidth="0.8" />

            <line x1="4" y1="35" x2="12" y2="35" stroke="#2864FF" strokeWidth="2" />
            <polygon points="4,35 8,32 8,38" fill="#2864FF" />
            <line x1="88" y1="35" x2="96" y2="35" stroke="#2864FF" strokeWidth="2" />
            <polygon points="96,35 92,32 92,38" fill="#2864FF" />

            <line
              x1={x - dx}
              y1={35 - dy}
              x2={x + dx}
              y2={35 + dy}
              stroke="#A9E3D2"
              strokeWidth="1.4"
            />

            <line
              x1={x}
              y1={35}
              x2={x + Math.cos(rad) * 12}
              y2={35 - Math.sin(rad) * 12}
              stroke="#2864FF"
              strokeWidth="1.1"
            />
            <text
              x={x + Math.cos(rad) * 13}
              y={34 - Math.sin(rad) * 13}
              fill="#F4F2EC"
              fontSize="4"
            >
              n
            </text>

            {showTraction && [-10, -4, 3, 9].map((offset, i) => {
              const px = x + Math.sin(rad) * offset
              const py = 35 + Math.cos(rad) * offset
              return (
                <g key={i}>
                  <line
                    x1={px - Math.cos(rad) * 7}
                    y1={py + Math.sin(rad) * 7}
                    x2={px - Math.cos(rad) * 1.5}
                    y2={py + Math.sin(rad) * 1.5}
                    stroke="#A9E3D2"
                    strokeWidth="1"
                  />
                  <line
                    x1={px + Math.cos(rad) * 7}
                    y1={py - Math.sin(rad) * 7}
                    x2={px + Math.cos(rad) * 1.5}
                    y2={py - Math.sin(rad) * 1.5}
                    stroke="#A9E3D2"
                    strokeWidth="1"
                  />
                </g>
              )
            })}
          </svg>

          <div className="control-stack">
            <label>
              <span>положение разреза <strong>{cut}%</strong></span>
              <input type="range" min="15" max="85" value={cut} onChange={(e) => setCut(Number(e.target.value))} />
            </label>
            <label>
              <span>ориентация <strong>{angle}°</strong></span>
              <input type="range" min="-55" max="55" value={angle} onChange={(e) => setAngle(Number(e.target.value))} />
            </label>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="prediction-card">
            <span>PREDICTION</span>
            <strong>Если точка та же, а площадку повернуть — останется ли локальное взаимодействие прежним?</strong>
            <p>Измени ориентацию разреза. Именно эта зависимость приведёт нас к тензору напряжений.</p>
          </div>
          <div className="author-card">
            <span>ЗАМЕТКА МАТМОДЕЛЬЕРА</span>
            <strong>Разрез — инструмент мышления.</strong>
            <p>Мы не добавляем новую физику, а делаем скрытое внутреннее взаимодействие видимым.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
