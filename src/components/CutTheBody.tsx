import { useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

const text = {
  ru: {
    back: '← M00',
    title: 'Мысленный разрез тела',
    lead: 'Разрез не создаёт внутренние силы. Он делает взаимодействие между двумя частями тела явным и доступным для анализа.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'Через одну и ту же точку можно провести бесконечно много площадок.',
    local: 'Локальный объект',
    localText: 'Вектор локального взаимодействия зависит не только от точки, но и от ориентации площадки.',
    next: 'Перейти к вектору напряжения →',
    scene: 'внутреннее взаимодействие',
    traction: 'векторы взаимодействия',
    position: 'положение разреза',
    orientation: 'ориентация',
    prediction: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    predictionTitle: 'Если точка та же, а площадку повернуть — останется ли локальное взаимодействие прежним?',
    predictionText: 'Измени ориентацию разреза. Именно эта зависимость приведёт нас к тензору напряжений.',
    note: 'ФИЗИЧЕСКИЙ СМЫСЛ',
    noteTitle: 'Разрез делает внутреннее взаимодействие наблюдаемым в модели.',
    noteText: 'Мысленный разрез не создаёт новые силы: он позволяет записать действие одной части тела на другую через поверхность раздела.',
    aria: 'Мысленный разрез нагруженного тела',
  },
  en: {
    back: '← M00',
    title: 'Imaginary cut through a body',
    lead: 'The cut does not create internal forces. It makes the interaction between two parts of the body explicit and available for analysis.',
    key: 'KEY IDEA',
    keyText: 'Infinitely many planes can pass through the same point.',
    local: 'Local object',
    localText: 'The local interaction vector depends not only on the point, but also on the orientation of the plane.',
    next: 'Continue to Traction Lab →',
    scene: 'internal interaction',
    traction: 'traction',
    position: 'cut position',
    orientation: 'orientation',
    prediction: 'PREDICTION',
    predictionTitle: 'If the point stays fixed but the plane rotates, does the local interaction remain the same?',
    predictionText: 'Change the cut orientation. This dependence is exactly what will lead us to the stress tensor.',
    note: 'PHYSICAL MEANING',
    noteTitle: 'The cut makes internal interaction observable in the model.',
    noteText: 'An imaginary cut does not create new forces; it lets us represent the action of one part of the body on another across the separating surface.',
    aria: 'Imaginary cut through a loaded body',
  },
} as const

export function CutTheBody({ notation, language, onBack, onNext }: Props) {
  const copy = text[language]
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
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">M01 / 02</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.local}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.localText}</p>
        </div>

        <button className="primary-button" onClick={onNext}>{copy.next}</button>
      </div>

      <div className="scene-column">
        <div className="scene-card">
          <div className="scene-head">
            <div>
              <span className="scene-kicker">{language === "ru" ? "МЫСЛЕННЫЙ РАЗРЕЗ" : "IMAGINARY CUT"}</span>
              <h2>{copy.scene}</h2>
            </div>
            <button className={showTraction ? 'toggle active' : 'toggle'} onClick={() => setShowTraction(!showTraction)}>
              {copy.traction}
            </button>
          </div>

          <svg className="cut-scene" viewBox="0 0 100 70" role="img" aria-label={copy.aria}>
            <rect x="12" y="18" width="76" height="34" rx="8" fill="#20242C" stroke="#383D48" strokeWidth="0.8" />
            <line x1="4" y1="35" x2="12" y2="35" stroke="#2864FF" strokeWidth="2" />
            <polygon points="4,35 8,32 8,38" fill="#2864FF" />
            <line x1="88" y1="35" x2="96" y2="35" stroke="#2864FF" strokeWidth="2" />
            <polygon points="96,35 92,32 92,38" fill="#2864FF" />

            <line x1={x - dx} y1={35 - dy} x2={x + dx} y2={35 + dy} stroke="#A9E3D2" strokeWidth="1.4" />
            <line x1={x} y1={35} x2={x + Math.cos(rad) * 12} y2={35 - Math.sin(rad) * 12} stroke="#2864FF" strokeWidth="1.1" />
            <text x={x + Math.cos(rad) * 13} y={34 - Math.sin(rad) * 13} fill="#F4F2EC" fontSize="4">n</text>

            {showTraction && [-10, -4, 3, 9].map((offset, i) => {
              const px = x + Math.sin(rad) * offset
              const py = 35 + Math.cos(rad) * offset
              return (
                <g key={i}>
                  <line x1={px - Math.cos(rad) * 7} y1={py + Math.sin(rad) * 7} x2={px - Math.cos(rad) * 1.5} y2={py + Math.sin(rad) * 1.5} stroke="#A9E3D2" strokeWidth="1" />
                  <line x1={px + Math.cos(rad) * 7} y1={py - Math.sin(rad) * 7} x2={px + Math.cos(rad) * 1.5} y2={py - Math.sin(rad) * 1.5} stroke="#A9E3D2" strokeWidth="1" />
                </g>
              )
            })}
          </svg>

          <div className="control-stack">
            <label>
              <span>{copy.position} <strong>{cut}%</strong></span>
              <input type="range" min="15" max="85" value={cut} onChange={(e) => setCut(Number(e.target.value))} />
            </label>
            <label>
              <span>{copy.orientation} <strong>{angle}°</strong></span>
              <input type="range" min="-55" max="55" value={angle} onChange={(e) => setAngle(Number(e.target.value))} />
            </label>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="prediction-card">
            <span>{copy.prediction}</span>
            <strong>{copy.predictionTitle}</strong>
            <p>{copy.predictionText}</p>
          </div>
          <div className="author-card">
            <span>{copy.note}</span>
            <strong>{copy.noteTitle}</strong>
            <p>{copy.noteText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
