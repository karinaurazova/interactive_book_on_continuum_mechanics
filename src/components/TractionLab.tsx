import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    back: '← M01',
    title: 'Вектор напряжения на площадке',
    lead: 'Рассмотрим площадку с единичной нормалью n. Для заданного напряжённого состояния вектор напряжения t зависит от ориентации этой площадки и может быть разложен на нормальную и касательную составляющие.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'Одно и то же напряжённое состояние проявляется по-разному на площадках разной ориентации.',
    active: 'Активная запись',
    activeText: 'При повороте площадки изменяется нормаль n, затем t = σn, а вместе с ним — нормальная и касательная части.',
    values: 'Численные значения',
    sceneTitle: 'вращай площадку и наблюдай изменение отклика',
    orientation: 'ориентация площадки',
    normalPart: 'нормальная часть',
    tangentPart: 'касательная часть',
    prediction: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    predictionTitle: 'Можно ли подобрать ориентацию, при которой касательная часть станет очень малой?',
    predictionText: 'Поворачивай площадку и наблюдай за |τ|. Это мост к главным направлениям напряжений.',
    note: 'СВЯЗЬ ПРЕДСТАВЛЕНИЙ',
    noteTitle: 'Геометрия, формула и численный результат описывают один и тот же объект.',
    noteText: 'При изменении ориентации площадки одновременно меняются её нормаль, вектор напряжения и его разложение на нормальную и касательную части.',
    aria: 'Вращаемая площадка, нормаль и вектор напряжения',
  },
  en: {
    back: '← M01',
    title: 'Traction Lab',
    lead: 'This is the first truly live object of the chapter: a plane with normal n, the traction vector t, and its normal and tangential components.',
    key: 'KEY IDEA',
    keyText: 'The same stress state manifests differently on planes with different orientations.',
    active: 'Active notation',
    activeText: 'As the plane rotates, the normal n changes, then t = σn changes, together with its normal and tangential parts.',
    values: 'Numerical values',
    sceneTitle: 'rotate the plane and watch the response change',
    orientation: 'plane orientation',
    normalPart: 'normal component',
    tangentPart: 'tangential component',
    prediction: 'PREDICTION',
    predictionTitle: 'Can you find an orientation for which the tangential component becomes very small?',
    predictionText: 'Rotate the plane and watch |τ|. This is the bridge to principal stress directions.',
    note: 'LINK BETWEEN REPRESENTATIONS',
    noteTitle: 'Geometry, equations, and numerical values describe the same object.',
    noteText: 'Changing the plane orientation simultaneously changes its normal, the traction vector, and its decomposition into normal and tangential parts.',
    aria: 'Rotating plane, normal, and traction vector',
  },
} as const

function fmt(value: number) {
  const rounded = Math.abs(value) < 1e-10 ? 0 : value
  return rounded.toFixed(2)
}

function matrixTimesVector(sigma: number[][], n: [number, number]) {
  return [
    sigma[0][0] * n[0] + sigma[0][1] * n[1],
    sigma[1][0] * n[0] + sigma[1][1] * n[1],
  ] as [number, number]
}

export function TractionLab({ notation, language, onBack }: Props) {
  const copy = text[language]
  const [theta, setTheta] = useState(28)
  const [showNormal, setShowNormal] = useState(true)
  const [showTangential, setShowTangential] = useState(true)

  const sigma = useMemo(() => [[1.2, 0.55], [0.55, 0.75]], [])
  const rad = (theta * Math.PI) / 180
  const n = useMemo<[number, number]>(() => [Math.cos(rad), Math.sin(rad)], [rad])
  const t = useMemo<[number, number]>(() => matrixTimesVector(sigma, n), [sigma, n])
  const sigmaN = useMemo(() => t[0] * n[0] + t[1] * n[1], [t, n])
  const normalComponent = useMemo<[number, number]>(() => [sigmaN * n[0], sigmaN * n[1]], [sigmaN, n])
  const tangentialComponent = useMemo<[number, number]>(
    () => [t[0] - normalComponent[0], t[1] - normalComponent[1]],
    [t, normalComponent],
  )
  const tauMag = useMemo(
    () => Math.sqrt(tangentialComponent[0] ** 2 + tangentialComponent[1] ** 2),
    [tangentialComponent],
  )

  const notationBlock =
    notation === 'Index' ? 'tᵢ = σᵢⱼ nⱼ' :
    notation === 'Matrix' ? '[t₁ t₂]ᵀ = [[σ₁₁ σ₁₂], [σ₂₁ σ₂₂]] [n₁ n₂]ᵀ' :
    notation === 'Python' ? 't = sigma @ n' :
    '𝐭 = σ𝐧'

  const centerX = 50
  const centerY = 36
  const tangentDir: [number, number] = [-n[1], n[0]]
  const planeLength = 18
  const planeX1 = centerX - tangentDir[0] * planeLength
  const planeY1 = centerY - tangentDir[1] * planeLength
  const planeX2 = centerX + tangentDir[0] * planeLength
  const planeY2 = centerY + tangentDir[1] * planeLength
  const normalScale = 16
  const tractionScale = 12
  const nx2 = centerX + n[0] * normalScale
  const ny2 = centerY - n[1] * normalScale
  const tx2 = centerX + t[0] * tractionScale
  const ty2 = centerY - t[1] * tractionScale
  const nnx2 = centerX + normalComponent[0] * tractionScale
  const nny2 = centerY - normalComponent[1] * tractionScale

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">M02 / 03</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.active}</div>
          <div className="formula">{notationBlock}</div>
          <p>{copy.activeText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.values}</div>
          <div className="formula">n = [{fmt(n[0])}; {fmt(n[1])}]</div>
          <div className="formula">t = [{fmt(t[0])}; {fmt(t[1])}]</div>
          <div className="formula">σₙ = {fmt(sigmaN)}</div>
          <div className="formula">|τ| = {fmt(tauMag)}</div>
        </div>
      </div>

      <div className="scene-column">
        <div className="scene-card">
          <div className="scene-head">
            <div>
              <span className="scene-kicker">{language === "ru" ? "ВЕКТОР НАПРЯЖЕНИЯ" : "TRACTION VECTOR"}</span>
              <h2>{copy.sceneTitle}</h2>
            </div>
            <div className="live-badge">{language === "ru" ? "ИНТЕРАКТИВНО" : "INTERACTIVE"}</div>
          </div>

          <svg className="cut-scene" viewBox="0 0 100 72" role="img" aria-label={copy.aria}>
            <rect x="18" y="16" width="64" height="40" rx="8" fill="#20242C" stroke="#383D48" strokeWidth="0.8" />
            <line x1={planeX1} y1={planeY1} x2={planeX2} y2={planeY2} stroke="#A9E3D2" strokeWidth="1.6" />
            <circle cx={centerX} cy={centerY} r="1.2" fill="#F4F2EC" />

            <line x1={centerX} y1={centerY} x2={nx2} y2={ny2} stroke="#2864FF" strokeWidth="1.4" />
            <text x={nx2 + 1} y={ny2 - 1} fill="#F4F2EC" fontSize="4">n</text>

            <line x1={centerX} y1={centerY} x2={tx2} y2={ty2} stroke="#A9E3D2" strokeWidth="1.6" />
            <text x={tx2 + 1} y={ty2 - 1} fill="#F4F2EC" fontSize="4">t</text>

            {showNormal && (
              <>
                <line x1={centerX} y1={centerY} x2={nnx2} y2={nny2} stroke="#2864FF" strokeWidth="1.2" strokeDasharray="2 1.6" />
                <text x={nnx2 + 1} y={nny2 + 4} fill="#F4F2EC" fontSize="3.5">σₙn</text>
              </>
            )}

            {showTangential && (
              <>
                <line x1={nnx2} y1={nny2} x2={tx2} y2={ty2} stroke="#6FD2BE" strokeWidth="1.2" strokeDasharray="2 1.6" />
                <text x={(nnx2 + tx2) / 2 + 1} y={(nny2 + ty2) / 2 - 1} fill="#F4F2EC" fontSize="3.5">τ</text>
              </>
            )}
          </svg>

          <div className="control-stack">
            <label>
              <span>{copy.orientation} <strong>{theta}°</strong></span>
              <input type="range" min="-80" max="80" value={theta} onChange={(e) => setTheta(Number(e.target.value))} />
            </label>

            <div className="mini-toggle-row">
              <button className={showNormal ? 'toggle active' : 'toggle'} onClick={() => setShowNormal((v) => !v)}>
                {copy.normalPart}
              </button>
              <button className={showTangential ? 'toggle active' : 'toggle'} onClick={() => setShowTangential((v) => !v)}>
                {copy.tangentPart}
              </button>
            </div>
          </div>

          <div className="metrics">
            <div><span>σ₁₁</span><strong>{fmt(sigma[0][0])}</strong></div>
            <div><span>σ₁₂ = σ₂₁</span><strong>{fmt(sigma[0][1])}</strong></div>
            <div><span>σ₂₂</span><strong>{fmt(sigma[1][1])}</strong></div>
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
