import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    back: '← M09',
    title: 'Инварианты тензора напряжений',
    lead: 'При смене базиса компоненты тензора меняются, но некоторые скалярные комбинации компонент остаются неизменными. Эти величины называют инвариантами.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'Инварианты позволяют описывать свойства тензора независимо от выбора координат.',
    formulas: 'Три основных инварианта',
    formulasText: 'Для тензора напряжений используем I₁ = tr(σ), I₂ = 1/2[(tr σ)² − tr(σ²)] и I₃ = det(σ).',
    meaning: 'Почему это важно',
    meaningText: 'Если две матрицы описывают один и тот же тензор в разных ортонормированных базисах, их компоненты могут отличаться, но I₁, I₂ и I₃ совпадают.',
    sceneKicker: 'ИНВАРИАНТЫ',
    sceneTitle: 'вращай базис и проверяй, что I₁, I₂, I₃ не меняются',
    angle: 'угол поворота базиса',
    original: 'исходная матрица',
    transformed: 'матрица в новом базисе',
    invariant: 'инвариант',
    stable: 'не изменился',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Что должно произойти с I₁, I₂ и I₃ при вращении ортонормированного базиса?',
    questionText: 'Поверни базис на любой угол и сравни значения до и после преобразования.',
    conclusion: 'ИТОГ',
    conclusionTitle: 'Компоненты зависят от базиса, инварианты — нет.',
    conclusionText: 'Именно поэтому инварианты особенно полезны в формулировках критериев и конститутивных моделей.',
    interactive: 'ИНТЕРАКТИВНО',
    aria: 'Проверка инвариантов тензора напряжений при вращении базиса',
  },
  en: {
    back: '← M09',
    title: 'Stress invariants',
    lead: 'Under a change of basis, tensor components change, but certain scalar combinations of the components remain unchanged. These quantities are called invariants.',
    key: 'KEY IDEA',
    keyText: 'Invariants describe tensor properties independently of the chosen coordinates.',
    formulas: 'Three principal invariants',
    formulasText: 'For the stress tensor we use I₁ = tr(σ), I₂ = 1/2[(tr σ)² − tr(σ²)], and I₃ = det(σ).',
    meaning: 'Why this matters',
    meaningText: 'If two matrices represent the same tensor in different orthonormal bases, their entries may differ while I₁, I₂, and I₃ remain identical.',
    sceneKicker: 'INVARIANTS',
    sceneTitle: 'rotate the basis and verify that I₁, I₂, I₃ stay fixed',
    angle: 'basis rotation angle',
    original: 'original matrix',
    transformed: 'matrix in rotated basis',
    invariant: 'invariant',
    stable: 'unchanged',
    question: 'CHECKPOINT',
    questionTitle: 'What should happen to I₁, I₂, and I₃ under an orthonormal basis rotation?',
    questionText: 'Rotate the basis to any angle and compare the values before and after transformation.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'Components depend on the basis; invariants do not.',
    conclusionText: 'This is why invariants are so useful in criteria and constitutive models.',
    interactive: 'INTERACTIVE',
    aria: 'Verification of stress invariants under basis rotation',
  },
} as const

const sigma = [
  [1.30, 0.50, 0.18],
  [0.50, 0.85, 0.22],
  [0.18, 0.22, 0.62],
]

function fmt(v: number) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(3)
}

function matMul(a: number[][], b: number[][]) {
  return a.map((row) =>
    b[0].map((_, j) => row.reduce((sum, value, k) => sum + value * b[k][j], 0)),
  )
}

function transpose(a: number[][]) {
  return a[0].map((_, i) => a.map((row) => row[i]))
}

function rotationZ(theta: number) {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return [
    [c, -s, 0],
    [s, c, 0],
    [0, 0, 1],
  ]
}

function transform(theta: number) {
  const Q = rotationZ(theta)
  return matMul(transpose(Q), matMul(sigma, Q))
}

function invariants(a: number[][]) {
  const i1 = a[0][0] + a[1][1] + a[2][2]
  const a2 = matMul(a, a)
  const trA2 = a2[0][0] + a2[1][1] + a2[2][2]
  const i2 = 0.5 * (i1 * i1 - trA2)
  const i3 =
    a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) -
    a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) +
    a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0])
  return [i1, i2, i3]
}

export function StressInvariants({ notation, language, onBack }: Props) {
  const copy = text[language]
  const [thetaDeg, setThetaDeg] = useState(34)
  const theta = thetaDeg * Math.PI / 180
  const transformed = useMemo(() => transform(theta), [theta])

  const invOriginal = useMemo(() => invariants(sigma), [])
  const invTransformed = useMemo(() => invariants(transformed), [transformed])

  const notationLine =
    notation === 'Index' ? 'I₁ = σᵢᵢ,   I₂ = 1/2[(σᵢᵢ)² − σᵢⱼσⱼᵢ],   I₃ = det σ' :
    notation === 'Matrix' ? 'I₁ = tr[σ],   I₂ = 1/2[(tr[σ])² − tr([σ]²)],   I₃ = det[σ]' :
    notation === 'Python' ? 'I1 = np.trace(sigma); I2 = 0.5*(I1**2 - np.trace(sigma @ sigma)); I3 = np.linalg.det(sigma)' :
    'I₁ = tr σ,   I₂ = 1/2[(tr σ)² − tr(σ²)],   I₃ = det σ'

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">M10 / 11</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.formulas}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.formulasText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.meaning}</div>
          <p>{copy.meaningText}</p>
        </div>
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

          <div className="invariant-matrix-grid">
            <div className="invariant-matrix-card">
              <span>{copy.original}</span>
              <div className="invariant-3x3">
                {sigma.flatMap((r, i) => r.map((v, j) => (
                  <strong key={`orig-${i}-${j}`}>{fmt(v)}</strong>
                )))}
              </div>
            </div>

            <div className="invariant-matrix-card active">
              <span>{copy.transformed}</span>
              <div className="invariant-3x3">
                {transformed.flatMap((r, i) => r.map((v, j) => (
                  <strong key={`new-${i}-${j}`}>{fmt(v)}</strong>
                )))}
              </div>
            </div>
          </div>

          <div className="control-stack">
            <label>
              <span>{copy.angle} <strong>{thetaDeg}°</strong></span>
              <input type="range" min="-180" max="180" step="1" value={thetaDeg} onChange={(e) => setThetaDeg(Number(e.target.value))} />
            </label>
          </div>

          <div className="invariant-cards">
            {[0, 1, 2].map((i) => (
              <div className="invariant-card" key={i}>
                <span>I{i + 1}</span>
                <strong>{fmt(invTransformed[i])}</strong>
                <small>{copy.stable}</small>
                <div className="invariant-compare">
                  {fmt(invOriginal[i])} = {fmt(invTransformed[i])}
                </div>
              </div>
            ))}
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
