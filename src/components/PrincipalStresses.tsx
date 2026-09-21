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
    back: '← M08',
    title: 'Главные напряжения и главные направления',
    lead: 'Особые площадки возникают тогда, когда вектор напряжения направлен строго по нормали к площадке. На таких площадках касательная часть исчезает.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'Условие τ = 0 эквивалентно тому, что n является собственным вектором тензора напряжений.',
    eigen: 'Задача на собственные значения',
    eigenText: 'Если t = σn и одновременно t = λn, то получаем σn = λn. Значения λ — главные напряжения, а соответствующие n — главные направления.',
    characteristic: 'Характеристическое уравнение',
    characteristicText: 'Нетривиальное решение существует, когда det(σ − λI) = 0.',
    sceneKicker: 'ПОИСК ГЛАВНОГО НАПРАВЛЕНИЯ',
    sceneTitle: 'вращай n и минимизируй касательную часть',
    angle: 'угол нормали',
    shear: '|τ|',
    normalStress: 'σₙ',
    traction: '|t|',
    principal: 'главное направление найдено',
    searching: 'поиск главного направления',
    principalStress: 'главное напряжение',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Почему при τ = 0 направление n становится собственным вектором σ?',
    questionText: 'Сравни t = σn с условием коллинеарности t = λn.',
    conclusion: 'ИТОГ',
    conclusionTitle: 'Главные направления — это собственные векторы σ, главные напряжения — собственные значения.',
    conclusionText: 'В главном базисе матрица тензора становится диагональной.',
    interactive: 'ИНТЕРАКТИВНО',
    aria: 'Поиск главного направления по исчезновению касательной части вектора напряжения',
    next: 'Перейти к инвариантам →',
  },
  en: {
    back: '← M08',
    title: 'Principal stresses and principal directions',
    lead: 'Special planes occur when the traction vector is exactly normal to the plane. On such planes the tangential part vanishes.',
    key: 'KEY IDEA',
    keyText: 'The condition τ = 0 is equivalent to n being an eigenvector of the stress tensor.',
    eigen: 'Eigenvalue problem',
    eigenText: 'If t = σn and also t = λn, then σn = λn. The values λ are principal stresses and the corresponding n are principal directions.',
    characteristic: 'Characteristic equation',
    characteristicText: 'A non-trivial solution exists when det(σ − λI) = 0.',
    sceneKicker: 'FIND A PRINCIPAL DIRECTION',
    sceneTitle: 'rotate n and minimize the tangential part',
    angle: 'normal angle',
    shear: '|τ|',
    normalStress: 'σₙ',
    traction: '|t|',
    principal: 'principal direction found',
    searching: 'searching for a principal direction',
    principalStress: 'principal stress',
    question: 'CHECKPOINT',
    questionTitle: 'Why does τ = 0 make n an eigenvector of σ?',
    questionText: 'Compare t = σn with the collinearity condition t = λn.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'Principal directions are eigenvectors of σ; principal stresses are eigenvalues.',
    conclusionText: 'In the principal basis, the stress matrix is diagonal.',
    interactive: 'INTERACTIVE',
    aria: 'Searching for a principal direction by making the tangential traction vanish',
    next: 'Continue to invariants →',
  },
} as const

const sigma = [
  [1.3, 0.5],
  [0.5, 0.7],
]

function fmt(v: number) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(3)
}

function eigenvalues2x2() {
  const a = sigma[0][0]
  const b = sigma[0][1]
  const d = sigma[1][1]
  const tr = a + d
  const disc = Math.sqrt(((a - d) / 2) ** 2 + b ** 2)
  return [tr / 2 + disc, tr / 2 - disc]
}

export function PrincipalStresses({ notation, language, onBack, onNext }: Props) {
  const copy = text[language]
  const [thetaDeg, setThetaDeg] = useState(20)

  const theta = thetaDeg * Math.PI / 180
  const n = useMemo<[number, number]>(() => [Math.cos(theta), Math.sin(theta)], [theta])
  const tangent: [number, number] = [-n[1], n[0]]

  const t = useMemo<[number, number]>(() => [
    sigma[0][0] * n[0] + sigma[0][1] * n[1],
    sigma[1][0] * n[0] + sigma[1][1] * n[1],
  ], [n])

  const sigmaN = t[0] * n[0] + t[1] * n[1]
  const tauScalar = t[0] * tangent[0] + t[1] * tangent[1]
  const tauMag = Math.abs(tauScalar)
  const tMag = Math.hypot(t[0], t[1])
  const principal = tauMag < 0.015

  const [lambda1, lambda2] = eigenvalues2x2()
  const nearestLambda = Math.abs(sigmaN - lambda1) < Math.abs(sigmaN - lambda2) ? lambda1 : lambda2

  const notationLine =
    notation === 'Index' ? 'σᵢⱼ nⱼ = λnᵢ' :
    notation === 'Matrix' ? '[σ]n = λn' :
    notation === 'Python' ? 'eigvals, eigvecs = np.linalg.eigh(sigma)' :
    'σ𝐧 = λ𝐧'

  const cx = 50
  const cy = 36
  const planeHalf = 18
  const planeA = { x: cx - tangent[0] * planeHalf, y: cy + tangent[1] * planeHalf }
  const planeB = { x: cx + tangent[0] * planeHalf, y: cy - tangent[1] * planeHalf }

  const nEnd = { x: cx + n[0] * 16, y: cy - n[1] * 16 }
  const tScale = 12
  const tEnd = { x: cx + t[0] * tScale, y: cy - t[1] * tScale }

  const tauEnd = {
    x: nEnd.x + tangent[0] * tauScalar * 8,
    y: nEnd.y - tangent[1] * tauScalar * 8,
  }

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">M09 / 10</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.eigen}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.eigenText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.characteristic}</div>
          <div className="formula">det(σ − λI) = 0</div>
          <p>{copy.characteristicText}</p>
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

          <svg className="principal-scene" viewBox="0 0 100 72" role="img" aria-label={copy.aria}>
            <rect x="6" y="7" width="88" height="58" rx="9" fill="#111318" />
            <line x1={planeA.x} y1={planeA.y} x2={planeB.x} y2={planeB.y} stroke="#6C7480" strokeWidth="1.1" />
            <circle cx={cx} cy={cy} r="1.2" fill="#F4F2EC" />

            <line x1={cx} y1={cy} x2={nEnd.x} y2={nEnd.y} stroke="#2864FF" strokeWidth="1.6" />
            <text x={nEnd.x + 1.2} y={nEnd.y - 1} fill="#F4F2EC" fontSize="3.8">n</text>

            <line x1={cx} y1={cy} x2={tEnd.x} y2={tEnd.y} stroke="#A9E3D2" strokeWidth="1.9" />
            <text x={tEnd.x + 1.2} y={tEnd.y - 1} fill="#F4F2EC" fontSize="3.8">t</text>

            {!principal && (
              <>
                <line x1={nEnd.x} y1={nEnd.y} x2={tauEnd.x} y2={tauEnd.y} stroke="#DD7A2B" strokeWidth="1.4" strokeDasharray="2 1.4" />
                <text x={tauEnd.x + 1} y={tauEnd.y - 1} fill="#F4F2EC" fontSize="3.4">τ</text>
              </>
            )}

            {principal && (
              <>
                <circle cx="80" cy="18" r="8" fill="rgba(169,227,210,0.13)" stroke="#A9E3D2" strokeWidth="0.8" />
                <text x="76.5" y="19.5" fill="#A9E3D2" fontSize="4.5">✓</text>
              </>
            )}
          </svg>

          <div className="control-stack">
            <label>
              <span>{copy.angle} <strong>{thetaDeg}°</strong></span>
              <input type="range" min="-90" max="90" step="0.5" value={thetaDeg} onChange={(e) => setThetaDeg(Number(e.target.value))} />
            </label>
          </div>

          <div className="principal-status">
            <div><span>{copy.shear}</span><strong>{fmt(tauMag)}</strong></div>
            <div><span>{copy.normalStress}</span><strong>{fmt(sigmaN)}</strong></div>
            <div><span>{copy.traction}</span><strong>{fmt(tMag)}</strong></div>
          </div>

          <div className={principal ? 'principal-badge found' : 'principal-badge searching'}>
            <strong>{principal ? copy.principal : copy.searching}</strong>
            {principal && <span>{copy.principalStress}: {fmt(nearestLambda)}</span>}
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
