import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

const text = {
  ru: {
    back: '← M07',
    title: 'Смена базиса',
    lead: 'Тензор напряжений не зависит от выбранной системы координат, но его компоненты зависят. Поэтому при вращении базиса физическое состояние остаётся тем же, а матрица компонент меняется.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'Матрица — это представление тензора в конкретном базисе, а не сам тензор.',
    rule: 'Правило преобразования',
    ruleText: 'Для ортонормированного базиса при пассивном повороте координат используем σ′ = QᵀσQ.',
    invariant: 'Что остаётся тем же',
    invariantText: 'Физический тензор, его главные значения и инварианты не зависят от выбора базиса.',
    sceneKicker: 'СМЕНА БАЗИСА',
    sceneTitle: 'вращай координатные оси, не меняя физическое состояние',
    angle: 'угол поворота базиса',
    labBasis: 'исходный базис',
    rotatedBasis: 'новый базис',
    original: 'исходная матрица',
    transformed: 'матрица в новом базисе',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Почему компоненты σ₁₂ и σ′₁₂ могут отличаться, хотя физическое напряжённое состояние одно и то же?',
    questionText: 'Поверни базис и сравни матрицы. Следи за тем, что сам объект на сцене не меняется.',
    conclusion: 'ИТОГ',
    conclusionTitle: 'Тензор — геометрический объект; матрица — его координатное описание.',
    conclusionText: 'Это различие критично для дальнейшего понимания главных направлений и инвариантов.',
    interactive: 'ИНТЕРАКТИВНО',
    aria: 'Один и тот же тензор напряжений в двух повернутых базисах',
    next: 'Перейти к главным напряжениям →',
  },
  en: {
    back: '← M07',
    title: 'Change of basis',
    lead: 'The stress tensor does not depend on the chosen coordinate system, but its components do. Rotating the basis leaves the physical state unchanged while changing the component matrix.',
    key: 'KEY IDEA',
    keyText: 'A matrix is a representation of a tensor in a chosen basis; it is not the tensor itself.',
    rule: 'Transformation rule',
    ruleText: 'For an orthonormal basis under a passive coordinate rotation we use σ′ = QᵀσQ.',
    invariant: 'What stays unchanged',
    invariantText: 'The physical tensor, its principal values, and its invariants do not depend on the chosen basis.',
    sceneKicker: 'CHANGE OF BASIS',
    sceneTitle: 'rotate the coordinate axes without changing the physical state',
    angle: 'basis rotation angle',
    labBasis: 'original basis',
    rotatedBasis: 'rotated basis',
    original: 'original matrix',
    transformed: 'matrix in rotated basis',
    question: 'CHECKPOINT',
    questionTitle: 'Why can σ₁₂ and σ′₁₂ differ even though the physical stress state is the same?',
    questionText: 'Rotate the basis and compare the matrices. Notice that the physical object itself does not change.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'A tensor is a geometric object; a matrix is its coordinate representation.',
    conclusionText: 'This distinction is essential for principal directions and invariants.',
    interactive: 'INTERACTIVE',
    aria: 'The same stress tensor represented in two rotated bases',
    next: 'Continue to principal stresses →',
  },
} as const

const sigma = [
  [1.3, 0.5],
  [0.5, 0.7],
]

function fmt(v: number) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(2)
}

function transform(theta: number) {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  const Q = [
    [c, -s],
    [s, c],
  ]
  const a00 = sigma[0][0] * Q[0][0] + sigma[0][1] * Q[1][0]
  const a01 = sigma[0][0] * Q[0][1] + sigma[0][1] * Q[1][1]
  const a10 = sigma[1][0] * Q[0][0] + sigma[1][1] * Q[1][0]
  const a11 = sigma[1][0] * Q[0][1] + sigma[1][1] * Q[1][1]

  return [
    [
      Q[0][0] * a00 + Q[1][0] * a10,
      Q[0][0] * a01 + Q[1][0] * a11,
    ],
    [
      Q[0][1] * a00 + Q[1][1] * a10,
      Q[0][1] * a01 + Q[1][1] * a11,
    ],
  ]
}

export function BasisTransform({ notation, language, onBack, onNext }: Props) {
  const copy = text[language]
  const [thetaDeg, setThetaDeg] = useState(28)
  const theta = thetaDeg * Math.PI / 180
  const transformed = useMemo(() => transform(theta), [theta])

  const c = Math.cos(theta)
  const s = Math.sin(theta)

  const notationLine =
    notation === 'Index' ? 'σ′ᵢⱼ = Qₖᵢ σₖₗ Qₗⱼ' :
    notation === 'Matrix' ? 'σ′ = Qᵀ σ Q' :
    notation === 'Python' ? 'sigma_prime = Q.T @ sigma @ Q' :
    'σ′ = QᵀσQ'

  const cx = 50
  const cy = 36
  const axis = 17
  const x1 = { x: cx + axis, y: cy }
  const x2 = { x: cx, y: cy - axis }
  const e1p = { x: cx + c * axis, y: cy - s * axis }
  const e2p = { x: cx - s * axis, y: cy - c * axis }

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">M08 / 09</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.rule}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.ruleText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.invariant}</div>
          <p>{copy.invariantText}</p>
        </div>

        <button className="primary-button" onClick={onNext}>{copy.next}</button>
      </div>

      <div className="scene-column">
        <div className="scene-card">
          <div className="scene-head">
            <div>
              <span className="scene-kicker">{copy.sceneKicker}</span>
              <h2>{copy.sceneTitle}</h2>
            </div>
            <div className="live-badge">{copy.interactive}</div>
          </div>

          <div className="basis-layout">
            <svg className="basis-scene" viewBox="0 0 100 72" role="img" aria-label={copy.aria}>
              <rect x="6" y="7" width="88" height="58" rx="9" fill="#111318" />
              <rect x="32" y="22" width="36" height="28" rx="4" fill="#20242C" stroke="#505764" strokeWidth="0.8" />

              <line x1={cx} y1={cy} x2={x1.x} y2={x1.y} stroke="#727986" strokeWidth="1.1" />
              <line x1={cx} y1={cy} x2={x2.x} y2={x2.y} stroke="#727986" strokeWidth="1.1" />
              <text x={x1.x + 1} y={x1.y + 1} fill="#8E96A3" fontSize="3.3">e₁</text>
              <text x={x2.x - 1} y={x2.y - 1} fill="#8E96A3" fontSize="3.3">e₂</text>

              <line x1={cx} y1={cy} x2={e1p.x} y2={e1p.y} stroke="#2864FF" strokeWidth="1.7" />
              <line x1={cx} y1={cy} x2={e2p.x} y2={e2p.y} stroke="#A9E3D2" strokeWidth="1.7" />
              <text x={e1p.x + 1} y={e1p.y - 1} fill="#F4F2EC" fontSize="3.5">e′₁</text>
              <text x={e2p.x + 1} y={e2p.y - 1} fill="#F4F2EC" fontSize="3.5">e′₂</text>

              <line x1="36" y1="27" x2="64" y2="45" stroke="#A9E3D2" strokeWidth="1.1" opacity="0.55" />
              <line x1="36" y1="45" x2="64" y2="27" stroke="#2864FF" strokeWidth="1.1" opacity="0.55" />
            </svg>

            <div className="basis-matrices">
              <div className="basis-matrix-card">
                <span>{copy.original}</span>
                <div className="basis-matrix-grid">
                  {sigma.flatMap((r, i) => r.map((v, j) => (
                    <strong key={`a-${i}-${j}`}>{fmt(v)}</strong>
                  )))}
                </div>
              </div>

              <div className="basis-matrix-card active">
                <span>{copy.transformed}</span>
                <div className="basis-matrix-grid">
                  {transformed.flatMap((r, i) => r.map((v, j) => (
                    <strong key={`b-${i}-${j}`}>{fmt(v)}</strong>
                  )))}
                </div>
              </div>
            </div>
          </div>

          <div className="control-stack">
            <label>
              <span>{copy.angle} <strong>{thetaDeg}°</strong></span>
              <input type="range" min="-90" max="90" step="1" value={thetaDeg} onChange={(e) => setThetaDeg(Number(e.target.value))} />
            </label>
          </div>

          <div className="basis-caption-row">
            <span>{copy.labBasis}: e₁, e₂</span>
            <span>{copy.rotatedBasis}: e′₁, e′₂</span>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="prediction-card">
            <span>{copy.question}</span>
            <strong>{copy.questionTitle}</strong>
            <p>{copy.questionText}</p>
          </div>

          <div className="author-card">
            <span>{copy.conclusion}</span>
            <strong>{copy.conclusionTitle}</strong>
            <p>{copy.conclusionText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
