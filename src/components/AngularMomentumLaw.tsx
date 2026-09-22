import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

const text = {
  ru: {
    back:'← B02',
    title:'Баланс момента импульса и симметрия напряжений',
    lead:'После баланса линейного импульса нужно потребовать, чтобы локально не оставалось нескомпенсированного момента. Для классического неполярного континуума это приводит к симметрии тензора Коши.',
    key:'МОМЕНТ НАКЛАДЫВАЕТ ДОПОЛНИТЕЛЬНОЕ УСЛОВИЕ',
    keyText:'При отсутствии распределённых пар и моментных напряжений локальный баланс момента импульса даёт σ = σᵀ.',
    integral:'Интегральная форма',
    integralText:'Производная момента импульса материальной области равна моменту массовых и поверхностных сил.',
    local:'Локальное следствие',
    localText:'После использования баланса линейного импульса антисимметричная часть классического тензора напряжений должна исчезнуть.',
    sceneKicker:'МОМЕНТ ИМПУЛЬСА',
    sceneTitle:'сравни парные касательные напряжения и остаточный момент',
    sigma12:'σ₁₂',
    sigma21:'σ₂₁',
    skew:'антисимметричная часть',
    residual:'остаточный момент',
    symmetryError:'‖σ−σᵀ‖',
    balanced:'момент сбалансирован',
    unbalanced:'момент не сбалансирован',
    warning:'ВАЖНО',
    warningTitle:'Симметрия σ — следствие модели, а не универсальное свойство любого тензора.',
    warningText:'Она следует для классического неполярного континуума без независимых моментных взаимодействий. В теориях Коссера и теориях с моментными напряжениями тензор напряжений может быть несимметричным.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Можно ли иметь σ₁₂ ≠ σ₂₁ и при этом удовлетворять классическому локальному балансу момента?',
    questionText:'Нет, если отсутствуют дополнительные моментные взаимодействия: разность σ₁₂−σ₂₁ создаёт ненулевой локальный момент.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Баланс момента импульса замыкает классическую структуру напряжений условием σ = σᵀ.',
    conclusionText:'Следующий шаг — баланс энергии, где появится работа напряжений и внутренняя энергия.',
    deepen:'Углубиться',
    deepenText:'В 3D локальный баланс момента можно записать через символ Леви–Чивиты. Для классического континуума он приводит к εᵢⱼₖ σⱼₖ = 0, что эквивалентно исчезновению антисимметричной части σ и условию σᵢⱼ = σⱼᵢ.',
    research:'Исследовательское замечание',
    researchText:'В микрополярных средах и средах Коссера существуют дополнительные вращательные степени свободы и моментные напряжения. Тогда баланс момента содержит дополнительные члены, а силовой тензор напряжений не обязан быть симметричным.',
    interactive:'ИНТЕРАКТИВНО',
    next:'Перейти к балансу энергии →',
  },
  en: {
    back:'← B02',
    title:'Angular momentum balance and stress symmetry',
    lead:'After linear momentum balance, the continuum must also have no unresolved local moment. For a classical non-polar continuum this leads to symmetry of the Cauchy stress tensor.',
    key:'ANGULAR MOMENTUM ADDS AN EXTRA CONDITION',
    keyText:'In the absence of distributed couples and couple stresses, local angular momentum balance gives σ = σᵀ.',
    integral:'Integral form',
    integralText:'The time derivative of angular momentum of a material region equals the moment of body and surface forces.',
    local:'Local consequence',
    localText:'After using linear momentum balance, the antisymmetric part of the classical stress tensor must vanish.',
    sceneKicker:'ANGULAR MOMENTUM',
    sceneTitle:'compare paired shear stresses and the residual moment',
    sigma12:'σ₁₂',
    sigma21:'σ₂₁',
    skew:'antisymmetric part',
    residual:'residual moment',
    symmetryError:'‖σ−σᵀ‖',
    balanced:'moment balanced',
    unbalanced:'moment unbalanced',
    warning:'IMPORTANT',
    warningTitle:'Stress symmetry is a model consequence, not a universal tensor property.',
    warningText:'It holds for a classical non-polar continuum without independent couple interactions. In Cosserat and couple-stress theories the force-stress tensor may be nonsymmetric.',
    question:'CHECKPOINT',
    questionTitle:'Can σ₁₂ ≠ σ₂₁ satisfy the classical local angular momentum balance?',
    questionText:'No, if no additional couple interactions are present: σ₁₂−σ₂₁ produces a nonzero local moment.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Angular momentum balance closes the classical stress structure with σ = σᵀ.',
    conclusionText:'Next we move to energy balance, where stress power and internal energy enter.',
    deepen:'Go deeper',
    deepenText:'In 3D the local angular momentum balance can be written with the Levi–Civita symbol. For a classical continuum it gives εᵢⱼₖ σⱼₖ = 0, equivalent to vanishing antisymmetric stress and σᵢⱼ = σⱼᵢ.',
    research:'Research note',
    researchText:'Micropolar and Cosserat media introduce rotational degrees of freedom and couple stresses. Angular momentum balance then contains additional terms, and the force-stress tensor need not be symmetric.',
    interactive:'INTERACTIVE',
    next:'Continue to energy balance →',
  }
} as const

function fmt(v:number,d=4){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function AngularMomentumLaw({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [s12,setS12]=useState(.55)
  const [s21,setS21]=useState(.35)

  const data=useMemo(()=>{
    const skew=.5*(s12-s21)
    const residual=s12-s21
    const symmetryError=Math.SQRT2*Math.abs(s12-s21)
    const balanced=Math.abs(residual)<.02
    return {skew,residual,symmetryError,balanced}
  },[s12,s21])

  const localLine =
    notation==='Index' ? 'σᵢⱼ = σⱼᵢ' :
    notation==='Matrix' ? 'σ = σᵀ' :
    notation==='Python' ? 'np.allclose(sigma, sigma.T)' :
    'σ = σᵀ'

  const integralLine =
    notation==='Index'
      ? 'd/dt ∫Ωₜ ρ εᵢⱼₖ xⱼvₖ dv = moments of surface + body forces'
      : notation==='Python'
      ? 'dL_dt = surface_moment + body_moment'
      : 'd/dt ∫Ωₜ ρ (𝐱×𝐯) dv = ∫∂Ωₜ 𝐱×(σ𝐧) da + ∫Ωₜ 𝐱×ρ𝐛 dv'

  const arrow12=9+11*Math.abs(s12)
  const arrow21=9+11*Math.abs(s21)
  const momentPath=data.balanced ? '' : data.residual>0
    ? 'M 68 27 A 17 17 0 0 1 68 49'
    : 'M 68 49 A 17 17 0 0 0 68 27'

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">B03 / 10</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.integral}</div>
          <div className="formula">{integralLine}</div>
          <p>{copy.integralText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.local}</div>
          <div className="formula">{localLine}</div>
          <p>{copy.localText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

        <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
        <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>

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

          <svg className="balance-scene" viewBox="0 0 100 70" role="img">
            <rect x="5" y="6" width="90" height="58" rx="9" fill="#111318"/>
            <rect x="34" y="23" width="28" height="24" rx="2" fill="rgba(244,242,236,.04)" stroke="#69717C" strokeWidth=".8"/>

            <line x1="34" y1="25" x2={34-arrow12} y2="25" stroke="#A9E3D2" strokeWidth="1.2"/>
            <line x1="62" y1="45" x2={62+arrow12} y2="45" stroke="#A9E3D2" strokeWidth="1.2"/>
            <line x1="36" y1="47" x2="36" y2={47+arrow21} stroke="#2864FF" strokeWidth="1.2"/>
            <line x1="60" y1="23" x2="60" y2={23-arrow21} stroke="#2864FF" strokeWidth="1.2"/>

            <text x="14" y="20" fill="#A9E3D2" fontSize="2.5">σ₁₂</text>
            <text x="66" y="18" fill="#2864FF" fontSize="2.5">σ₂₁</text>

            {!data.balanced && <path d={momentPath} fill="none" stroke="#DD7A2B" strokeWidth="1.3"/>}
            <text x="38" y="58" fill={data.balanced?"#A9E3D2":"#DD7A2B"} fontSize="2.5">
              {data.balanced?copy.balanced:copy.unbalanced}
            </text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.sigma12} <strong>{fmt(s12,2)}</strong></span><input type="range" min="-.9" max=".9" step=".01" value={s12} onChange={e=>setS12(Number(e.target.value))}/></label>
            <label><span>{copy.sigma21} <strong>{fmt(s21,2)}</strong></span><input type="range" min="-.9" max=".9" step=".01" value={s21} onChange={e=>setS21(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.skew}</span><strong>{fmt(data.skew)}</strong></div>
            <div><span>{copy.residual}</span><strong>{fmt(data.residual)}</strong></div>
            <div><span>{copy.symmetryError}</span><strong>{fmt(data.symmetryError)}</strong></div>
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
