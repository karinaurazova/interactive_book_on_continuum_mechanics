import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    back: '← M11',
    title: 'Круг Мора',
    lead: 'Круг Мора связывает ориентацию площадки с парой величин (σₙ, τ). Каждой площадке в физическом пространстве соответствует точка на окружности в пространстве напряжений.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'При повороте площадки на угол θ соответствующая точка на круге Мора поворачивается на угол 2θ.',
    formulas: 'Преобразование напряжений',
    formulasText: 'Для плоского напряжённого состояния σₙ и τ выражаются через cos 2θ и sin 2θ. Поэтому в пространстве (σ, τ) возникает окружность.',
    geometry: 'Геометрия круга',
    geometryText: 'Центр круга равен среднему нормальному напряжению C=(σ₁₁+σ₂₂)/2, а радиус R определяет диапазон нормальных и касательных напряжений.',
    sceneKicker: 'КРУГ МОРА',
    sceneTitle: 'вращай площадку и следи за точкой (σₙ, τ)',
    angle: 'угол площадки',
    physical: 'физическая площадка',
    mohr: 'пространство (σ, τ)',
    sigmaN: 'σₙ',
    tau: 'τ',
    center: 'центр C',
    radius: 'радиус R',
    doubleAngle: 'угол на круге',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Почему на круге появляется именно удвоенный угол 2θ?',
    questionText: 'Посмотри на формулы преобразования: ориентация входит через cos 2θ и sin 2θ.',
    conclusion: 'ИТОГ',
    conclusionTitle: 'Круг Мора — это геометрическое представление закона преобразования напряжений.',
    conclusionText: 'Крайние точки по оси σ дают главные напряжения, а верхняя и нижняя точки соответствуют максимальным по модулю касательным напряжениям.',
    interactive: 'ИНТЕРАКТИВНО',
    ariaPhysical: 'Площадка с вращающейся нормалью и вектором напряжения',
    ariaMohr: 'Круг Мора с движущейся точкой нормального и касательного напряжения',
  },
  en: {
    back: '← M11',
    title: 'Mohr circle',
    lead: 'Mohr circle links plane orientation to the pair (σₙ, τ). Each physical plane corresponds to a point on a circle in stress space.',
    key: 'KEY IDEA',
    keyText: 'When the physical plane rotates by θ, the corresponding point on Mohr circle rotates by 2θ.',
    formulas: 'Stress transformation',
    formulasText: 'For a 2D stress state, σₙ and τ depend on cos 2θ and sin 2θ. This produces a circle in (σ, τ) space.',
    geometry: 'Circle geometry',
    geometryText: 'The center is the mean normal stress C=(σ₁₁+σ₂₂)/2, while the radius R sets the range of normal and shear stresses.',
    sceneKicker: 'MOHR CIRCLE',
    sceneTitle: 'rotate the plane and track the point (σₙ, τ)',
    angle: 'plane angle',
    physical: 'physical plane',
    mohr: '(σ, τ) space',
    sigmaN: 'σₙ',
    tau: 'τ',
    center: 'center C',
    radius: 'radius R',
    doubleAngle: 'angle on circle',
    question: 'CHECKPOINT',
    questionTitle: 'Why does the doubled angle 2θ appear on Mohr circle?',
    questionText: 'Look at the transformation equations: orientation enters through cos 2θ and sin 2θ.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'Mohr circle is a geometric representation of the stress-transformation law.',
    conclusionText: 'The extreme points on the σ-axis give the principal stresses; the top and bottom points correspond to maximum shear magnitude.',
    interactive: 'INTERACTIVE',
    ariaPhysical: 'Plane with rotating normal and traction vector',
    ariaMohr: 'Mohr circle with moving normal and shear stress point',
  },
} as const

const sigma11 = 1.30
const sigma22 = 0.70
const sigma12 = 0.50

function fmt(v: number) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(3)
}

export function MohrCircle({ notation, language, onBack }: Props) {
  const copy = text[language]
  const [thetaDeg, setThetaDeg] = useState(20)
  const theta = thetaDeg * Math.PI / 180

  const n = useMemo<[number, number]>(() => [Math.cos(theta), Math.sin(theta)], [theta])
  const m: [number, number] = [-n[1], n[0]]

  const traction = useMemo<[number, number]>(() => [
    sigma11 * n[0] + sigma12 * n[1],
    sigma12 * n[0] + sigma22 * n[1],
  ], [n])

  const sigmaN = traction[0] * n[0] + traction[1] * n[1]
  const tau = traction[0] * m[0] + traction[1] * m[1]

  const center = 0.5 * (sigma11 + sigma22)
  const halfDiff = 0.5 * (sigma11 - sigma22)
  const radius = Math.sqrt(halfDiff * halfDiff + sigma12 * sigma12)
  const principal1 = center + radius
  const principal2 = center - radius
  const mohrRotation = -2 * thetaDeg

  const notationLine =
    notation === 'Index' ? 'σₙ = nᵢσᵢⱼnⱼ,   τ = mᵢσᵢⱼnⱼ' :
    notation === 'Matrix' ? 'σₙ = nᵀσn,   τ = mᵀσn' :
    notation === 'Python' ? 'sigma_n = n @ sigma @ n; tau = m @ sigma @ n' :
    'σₙ = 𝐧·σ𝐧,   τ = 𝐦·σ𝐧'

  const physicalCx = 50
  const physicalCy = 36
  const planeHalf = 18
  const planeA = { x: physicalCx - m[0] * planeHalf, y: physicalCy + m[1] * planeHalf }
  const planeB = { x: physicalCx + m[0] * planeHalf, y: physicalCy - m[1] * planeHalf }
  const nEnd = { x: physicalCx + n[0] * 16, y: physicalCy - n[1] * 16 }
  const tEnd = { x: physicalCx + traction[0] * 11, y: physicalCy - traction[1] * 11 }

  const chartCx = 50
  const chartCy = 36
  const chartR = 23
  const xMin = center - radius * 1.25
  const xMax = center + radius * 1.25
  const yMin = -radius * 1.25
  const yMax = radius * 1.25

  const mapX = (x: number) => 12 + ((x - xMin) / (xMax - xMin)) * 76
  const mapY = (y: number) => 61 - ((y - yMin) / (yMax - yMin)) * 50

  const pointX = mapX(sigmaN)
  const pointY = mapY(tau)
  const centerX = mapX(center)
  const centerY = mapY(0)
  const principal1X = mapX(principal1)
  const principal2X = mapX(principal2)

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">M12 / 13</div>
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
          <div className="definition-label">{copy.geometry}</div>
          <div className="formula">C = (σ₁₁+σ₂₂)/2,   R = √[((σ₁₁−σ₂₂)/2)²+σ₁₂²]</div>
          <p>{copy.geometryText}</p>
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

          <div className="mohr-layout">
            <div className="mohr-panel">
              <span>{copy.physical}</span>
              <svg className="mohr-physical-scene" viewBox="0 0 100 72" role="img" aria-label={copy.ariaPhysical}>
                <rect x="6" y="7" width="88" height="58" rx="9" fill="#111318" />
                <line x1={planeA.x} y1={planeA.y} x2={planeB.x} y2={planeB.y} stroke="#6C7480" strokeWidth="1.1" />
                <circle cx={physicalCx} cy={physicalCy} r="1.2" fill="#F4F2EC" />
                <line x1={physicalCx} y1={physicalCy} x2={nEnd.x} y2={nEnd.y} stroke="#2864FF" strokeWidth="1.6" />
                <text x={nEnd.x + 1.2} y={nEnd.y - 1} fill="#F4F2EC" fontSize="3.7">n</text>
                <line x1={physicalCx} y1={physicalCy} x2={tEnd.x} y2={tEnd.y} stroke="#A9E3D2" strokeWidth="1.9" />
                <text x={tEnd.x + 1.2} y={tEnd.y - 1} fill="#F4F2EC" fontSize="3.7">t</text>
                <text x="11" y="15" fill="#8E96A3" fontSize="3.2">θ = {thetaDeg}°</text>
              </svg>
            </div>

            <div className="mohr-panel">
              <span>{copy.mohr}</span>
              <svg className="mohr-circle-scene" viewBox="0 0 100 72" role="img" aria-label={copy.ariaMohr}>
                <rect x="6" y="7" width="88" height="58" rx="9" fill="#111318" />

                <line x1="11" y1={centerY} x2="90" y2={centerY} stroke="#59616D" strokeWidth="0.7" />
                <line x1={centerX} y1="10" x2={centerX} y2="63" stroke="#59616D" strokeWidth="0.7" />

                <ellipse
                  cx={centerX}
                  cy={centerY}
                  rx={(mapX(center + radius) - mapX(center))}
                  ry={(mapY(0) - mapY(radius))}
                  fill="none"
                  stroke="#A9E3D2"
                  strokeWidth="1.2"
                />

                <line x1={centerX} y1={centerY} x2={pointX} y2={pointY} stroke="#2864FF" strokeWidth="1.1" strokeDasharray="2 1.4" />
                <circle cx={pointX} cy={pointY} r="2.2" fill="#2864FF" />
                <text x={pointX + 2.3} y={pointY - 1.5} fill="#F4F2EC" fontSize="3.2">(σₙ, τ)</text>

                <circle cx={principal1X} cy={centerY} r="1.5" fill="#F4F2EC" />
                <circle cx={principal2X} cy={centerY} r="1.5" fill="#F4F2EC" />
                <text x={principal1X - 2} y={centerY + 5} fill="#8E96A3" fontSize="3">σ₁</text>
                <text x={principal2X - 2} y={centerY + 5} fill="#8E96A3" fontSize="3">σ₂</text>

                <text x="83" y={centerY - 2} fill="#8E96A3" fontSize="3.1">σ</text>
                <text x={centerX + 2} y="12" fill="#8E96A3" fontSize="3.1">τ</text>
                <text x="11" y="15" fill="#8E96A3" fontSize="3.2">Δφ = {mohrRotation}°</text>
              </svg>
            </div>
          </div>

          <div className="control-stack">
            <label>
              <span>{copy.angle} <strong>{thetaDeg}°</strong></span>
              <input type="range" min="-90" max="90" step="1" value={thetaDeg} onChange={(e) => setThetaDeg(Number(e.target.value))} />
            </label>
          </div>

          <div className="mohr-metrics">
            <div><span>{copy.sigmaN}</span><strong>{fmt(sigmaN)}</strong></div>
            <div><span>{copy.tau}</span><strong>{fmt(tau)}</strong></div>
            <div><span>{copy.center}</span><strong>{fmt(center)}</strong></div>
            <div><span>{copy.radius}</span><strong>{fmt(radius)}</strong></div>
            <div><span>{copy.doubleAngle}</span><strong>{mohrRotation}°</strong></div>
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
