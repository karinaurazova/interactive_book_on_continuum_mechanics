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
    back: '← M05',
    title: 'Почему тензор напряжений симметричен',
    lead: 'В классическом неполярном континууме локальный баланс момента импульса накладывает дополнительное условие на касательные компоненты напряжений. Для малого элемента нескомпенсированные моменты исчезают только тогда, когда парные касательные компоненты равны.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'Симметрия σ не является свойством “тензора вообще”. Она следует из баланса момента импульса при определённых физических предпосылках.',
    balance: 'Баланс момента',
    balanceText: 'Для элемента в плоскости x₁x₂ касательные напряжения σ₁₂ и σ₂₁ создают противоположные моменты. Их разность определяет остаточный момент.',
    assumptions: 'Когда это верно',
    assumptionsText: 'Классический неполярный континуум, отсутствие распределённых пар и couple stresses. В обобщённых континуумах тензор напряжений может быть несимметричным.',
    sceneKicker: 'БАЛАНС МОМЕНТА',
    sceneTitle: 'сравни σ₁₂ и σ₂₁',
    sigma12: 'σ₁₂',
    sigma21: 'σ₂₁',
    residual: 'остаточный момент',
    balanced: 'момент сбалансирован',
    unbalanced: 'есть нескомпенсированный момент',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Что произойдёт, если σ₁₂ увеличить, а σ₂₁ оставить прежним?',
    questionText: 'Измени ползунки и наблюдай направление остаточного момента.',
    conclusion: 'ИТОГ',
    conclusionTitle: 'Для классического неполярного континуума получаем σ₁₂ = σ₂₁.',
    conclusionText: 'Аналогично для остальных пар компонент: σᵢⱼ = σⱼᵢ.',
    interactive: 'ИНТЕРАКТИВНО',
    aria: 'Малый элемент с касательными напряжениями и остаточным моментом',
    next: 'Перейти к разложению вектора напряжения →',
  },
  en: {
    back: '← M05',
    title: 'Why the stress tensor is symmetric',
    lead: 'In a classical non-polar continuum, local angular-momentum balance imposes an additional condition on shear-stress components. For a small element, residual moments vanish only when paired shear components are equal.',
    key: 'KEY IDEA',
    keyText: 'Stress symmetry is not a generic property of “tensors”. It follows from angular-momentum balance under specific physical assumptions.',
    balance: 'Moment balance',
    balanceText: 'For an element in the x₁x₂ plane, σ₁₂ and σ₂₁ generate opposing moments. Their difference controls the residual moment.',
    assumptions: 'When this holds',
    assumptionsText: 'Classical non-polar continuum, no distributed couples and no couple stresses. In generalized continua the stress tensor may be non-symmetric.',
    sceneKicker: 'ANGULAR-MOMENTUM BALANCE',
    sceneTitle: 'compare σ₁₂ and σ₂₁',
    sigma12: 'σ₁₂',
    sigma21: 'σ₂₁',
    residual: 'residual moment',
    balanced: 'moment balanced',
    unbalanced: 'unbalanced moment',
    question: 'CHECKPOINT',
    questionTitle: 'What happens if σ₁₂ increases while σ₂₁ stays fixed?',
    questionText: 'Move the sliders and watch the direction of the residual moment.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'For a classical non-polar continuum, σ₁₂ = σ₂₁.',
    conclusionText: 'Likewise for all paired components: σᵢⱼ = σⱼᵢ.',
    interactive: 'INTERACTIVE',
    aria: 'Small element with shear stresses and residual moment',
    next: 'Continue to traction decomposition →',
  },
} as const

function fmt(v: number) {
  return v.toFixed(2)
}

export function AngularMomentumBalance({ notation, language, onBack, onNext }: Props) {
  const copy = text[language]
  const [s12, setS12] = useState(0.55)
  const [s21, setS21] = useState(0.35)

  const residual = s12 - s21
  const balanced = Math.abs(residual) < 0.02
  const arrowScale12 = 8 + Math.abs(s12) * 11
  const arrowScale21 = 8 + Math.abs(s21) * 11

  const notationLine =
    notation === 'Index' ? 'σᵢⱼ = σⱼᵢ' :
    notation === 'Matrix' ? '[σ] = [σ]ᵀ' :
    notation === 'Python' ? 'np.allclose(sigma, sigma.T)' :
    'σ = σᵀ'

  const momentPath = useMemo(() => {
    if (balanced) return ''
    return residual > 0
      ? 'M 67 27 A 17 17 0 0 1 67 49'
      : 'M 67 49 A 17 17 0 0 0 67 27'
  }, [balanced, residual])

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">M06 / 07</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.balance}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.balanceText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.assumptions}</div>
          <p>{copy.assumptionsText}</p>
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

          <svg className="moment-scene" viewBox="0 0 100 72" role="img" aria-label={copy.aria}>
            <defs>
              <marker id="mintArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#A9E3D2" />
              </marker>
              <marker id="blueArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#2864FF" />
              </marker>
              <marker id="orangeArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#DD7A2B" />
              </marker>
            </defs>

            <rect x="31" y="20" width="38" height="32" rx="4" fill="#20242C" stroke="#505764" strokeWidth="0.9" />

            <line x1="34" y1="20" x2={34 + arrowScale12} y2="20" stroke="#A9E3D2" strokeWidth="1.7" markerEnd="url(#mintArrow)" />
            <line x1="66" y1="52" x2={66 - arrowScale12} y2="52" stroke="#A9E3D2" strokeWidth="1.7" markerEnd="url(#mintArrow)" />
            <text x="38" y="16" fill="#F4F2EC" fontSize="3.7">σ₁₂</text>

            <line x1="31" y1="49" x2="31" y2={49 - arrowScale21} stroke="#2864FF" strokeWidth="1.7" markerEnd="url(#blueArrow)" />
            <line x1="69" y1="23" x2="69" y2={23 + arrowScale21} stroke="#2864FF" strokeWidth="1.7" markerEnd="url(#blueArrow)" />
            <text x="72" y="28" fill="#F4F2EC" fontSize="3.7">σ₂₁</text>

            <line x1="50" y1="36" x2="64" y2="36" stroke="#727986" strokeWidth="0.7" />
            <line x1="50" y1="36" x2="50" y2="22" stroke="#727986" strokeWidth="0.7" />
            <text x="65" y="37" fill="#8E96A3" fontSize="3.2">x₁</text>
            <text x="48" y="20" fill="#8E96A3" fontSize="3.2">x₂</text>

            {!balanced && (
              <path
                d={momentPath}
                fill="none"
                stroke="#DD7A2B"
                strokeWidth="1.8"
                markerEnd="url(#orangeArrow)"
              />
            )}

            {balanced && (
              <>
                <circle cx="79" cy="36" r="8" fill="rgba(169,227,210,0.12)" stroke="#A9E3D2" strokeWidth="0.8" />
                <text x="75.5" y="37.5" fill="#A9E3D2" fontSize="4.5">✓</text>
              </>
            )}
          </svg>

          <div className="control-stack">
            <label>
              <span>{copy.sigma12} <strong>{fmt(s12)}</strong></span>
              <input type="range" min="-1" max="1" step="0.01" value={s12} onChange={(e) => setS12(Number(e.target.value))} />
            </label>
            <label>
              <span>{copy.sigma21} <strong>{fmt(s21)}</strong></span>
              <input type="range" min="-1" max="1" step="0.01" value={s21} onChange={(e) => setS21(Number(e.target.value))} />
            </label>
          </div>

          <div className="moment-status">
            <div>
              <span>{copy.residual}</span>
              <strong>{fmt(residual)}</strong>
            </div>
            <div className={balanced ? 'moment-badge balanced' : 'moment-badge unbalanced'}>
              {balanced ? copy.balanced : copy.unbalanced}
            </div>
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
