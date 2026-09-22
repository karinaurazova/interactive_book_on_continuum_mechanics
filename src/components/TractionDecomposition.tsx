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
    back: '← M06',
    title: 'Нормальная и касательная части вектора напряжения',
    lead: 'Для заданной площадки вектор напряжения t можно разложить на часть, направленную вдоль нормали n, и часть, лежащую в касательной плоскости.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'Нормальная часть — это проекция t на n, а касательная часть — остаток после вычитания этой проекции.',
    projection: 'Нормальная проекция',
    projectionText: 'Скаляр σₙ = t·n задаёт нормальную компоненту, а вектор σₙn — саму нормальную часть traction.',
    shear: 'Касательная часть',
    shearText: 'Вектор τ = t − σₙn ортогонален n и лежит в касательной плоскости площадки.',
    sceneKicker: 'РАЗЛОЖЕНИЕ ВЕКТОРА',
    sceneTitle: 'вращай площадку и следи за проекцией',
    angle: 'ориентация площадки',
    showNormal: 'нормальная часть',
    showTangential: 'касательная часть',
    sigmaN: 'σₙ',
    tau: '|τ|',
    traction: '|t|',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Когда касательная часть становится равной нулю?',
    questionText: 'Ищи ориентацию, при которой t становится коллинеарным n.',
    conclusion: 'ИТОГ',
    conclusionTitle: 'Если τ = 0, площадка является главной для данного напряжённого состояния.',
    conclusionText: 'К этому условию мы вернёмся позже при поиске главных напряжений и направлений.',
    interactive: 'ИНТЕРАКТИВНО',
    aria: 'Разложение вектора напряжения на нормальную и касательную части',
    next: 'Перейти к смене базиса →',
  },
  en: {
    back: '← M06',
    title: 'Normal and tangential parts of traction',
    lead: 'For a given plane, the traction vector t can be decomposed into a part along the normal n and a part lying in the tangent plane.',
    key: 'KEY IDEA',
    keyText: 'The normal part is the projection of t onto n; the tangential part is the remainder after subtracting that projection.',
    projection: 'Normal projection',
    projectionText: 'The scalar σₙ = t·n gives the normal component, while σₙn is the corresponding normal vector part of traction.',
    shear: 'Tangential part',
    shearText: 'The vector τ = t − σₙn is orthogonal to n and lies in the tangent plane.',
    sceneKicker: 'VECTOR DECOMPOSITION',
    sceneTitle: 'rotate the plane and track the projection',
    angle: 'plane orientation',
    showNormal: 'normal part',
    showTangential: 'tangential part',
    sigmaN: 'σₙ',
    tau: '|τ|',
    traction: '|t|',
    question: 'CHECKPOINT',
    questionTitle: 'When does the tangential part become zero?',
    questionText: 'Find an orientation for which t becomes collinear with n.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'If τ = 0, the plane is principal for the given stress state.',
    conclusionText: 'We will return to this condition when introducing principal stresses and directions.',
    interactive: 'INTERACTIVE',
    aria: 'Decomposition of traction into normal and tangential parts',
    next: 'Continue to change of basis →',
  },
} as const

function fmt(v: number) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(2)
}

export function TractionDecomposition({ notation, language, onBack, onNext }: Props) {
  const copy = text[language]
  const [theta, setTheta] = useState(26)
  const [showNormal, setShowNormal] = useState(true)
  const [showTangential, setShowTangential] = useState(true)

  const sigma = useMemo(() => [[1.25, 0.48], [0.48, 0.72]], [])
  const rad = theta * Math.PI / 180
  const n = useMemo<[number, number]>(() => [Math.cos(rad), Math.sin(rad)], [rad])
  const tangent: [number, number] = [-n[1], n[0]]

  const t = useMemo<[number, number]>(() => [
    sigma[0][0] * n[0] + sigma[0][1] * n[1],
    sigma[1][0] * n[0] + sigma[1][1] * n[1],
  ], [sigma, n])

  const sigmaN = t[0] * n[0] + t[1] * n[1]
  const normalPart: [number, number] = [sigmaN * n[0], sigmaN * n[1]]
  const tau: [number, number] = [t[0] - normalPart[0], t[1] - normalPart[1]]

  const tMag = Math.hypot(t[0], t[1])
  const tauMag = Math.hypot(tau[0], tau[1])

  const notationLine =
    notation === 'Index' ? 'σₙ = tᵢnᵢ,   τᵢ = tᵢ − σₙnᵢ' :
    notation === 'Matrix' ? 'σₙ = nᵀt,   τ = t − (nᵀt)n' :
    notation === 'Python' ? 'sigma_n = t @ n; tau = t - sigma_n * n' :
    '𝐭 = σₙ𝐧 + τ'

  const cx = 50
  const cy = 36
  const planeHalf = 18
  const planeA = { x: cx - tangent[0] * planeHalf, y: cy + tangent[1] * planeHalf }
  const planeB = { x: cx + tangent[0] * planeHalf, y: cy - tangent[1] * planeHalf }

  const scale = 13
  const nEnd = { x: cx + n[0] * 15, y: cy - n[1] * 15 }
  const tEnd = { x: cx + t[0] * scale, y: cy - t[1] * scale }
  const normalEnd = { x: cx + normalPart[0] * scale, y: cy - normalPart[1] * scale }

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">M07 / 08</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.projection}</div>
          <div className="formula">σₙ = 𝐭·𝐧</div>
          <p>{copy.projectionText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.shear}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.shearText}</p>
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

          <svg className="decomposition-scene" viewBox="0 0 100 72" role="img" aria-label={copy.aria}>
            <rect x="6" y="7" width="88" height="58" rx="9" fill="#111318" />
            <line x1={planeA.x} y1={planeA.y} x2={planeB.x} y2={planeB.y} stroke="#6C7480" strokeWidth="1.1" />
            <circle cx={cx} cy={cy} r="1.2" fill="#F4F2EC" />

            <line x1={cx} y1={cy} x2={nEnd.x} y2={nEnd.y} stroke="#2864FF" strokeWidth="1.5" />
            <text x={nEnd.x + 1.2} y={nEnd.y - 1} fill="#F4F2EC" fontSize="3.8">n</text>

            <line x1={cx} y1={cy} x2={tEnd.x} y2={tEnd.y} stroke="#A9E3D2" strokeWidth="1.9" />
            <text x={tEnd.x + 1.2} y={tEnd.y - 1} fill="#F4F2EC" fontSize="3.8">t</text>

            {showNormal && (
              <>
                <line x1={cx} y1={cy} x2={normalEnd.x} y2={normalEnd.y} stroke="#2864FF" strokeWidth="1.4" strokeDasharray="2 1.5" />
                <text x={normalEnd.x + 1.2} y={normalEnd.y + 3.2} fill="#F4F2EC" fontSize="3.4">σₙn</text>
              </>
            )}

            {showTangential && (
              <>
                <line x1={normalEnd.x} y1={normalEnd.y} x2={tEnd.x} y2={tEnd.y} stroke="#DD7A2B" strokeWidth="1.5" strokeDasharray="2 1.5" />
                <text x={(normalEnd.x + tEnd.x) / 2 + 1.2} y={(normalEnd.y + tEnd.y) / 2 - 1} fill="#F4F2EC" fontSize="3.4">τ</text>
              </>
            )}
          </svg>

          <div className="control-stack">
            <label>
              <span>{copy.angle} <strong>{theta}°</strong></span>
              <input type="range" min="-90" max="90" step="1" value={theta} onChange={(e) => setTheta(Number(e.target.value))} />
            </label>

            <div className="mini-toggle-row">
              <button className={showNormal ? 'toggle active' : 'toggle'} onClick={() => setShowNormal(v => !v)}>{copy.showNormal}</button>
              <button className={showTangential ? 'toggle active' : 'toggle'} onClick={() => setShowTangential(v => !v)}>{copy.showTangential}</button>
            </div>
          </div>

          <div className="metrics">
            <div><span>{copy.traction}</span><strong>{fmt(tMag)}</strong></div>
            <div><span>{copy.sigmaN}</span><strong>{fmt(sigmaN)}</strong></div>
            <div><span>{copy.tau}</span><strong>{fmt(tauMag)}</strong></div>
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
