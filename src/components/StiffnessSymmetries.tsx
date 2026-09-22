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
    back:'← C04',
    title:'Симметрии тензора жёсткости: от 81 компоненты к 21',
    lead:'Формально тензор Cᵢⱼₖₗ в 3D имеет 81 компоненту. Но физические и энергетические симметрии резко уменьшают число независимых коэффициентов.',
    key:'НЕ КАЖДАЯ КОМПОНЕНТА Cᵢⱼₖₗ НЕЗАВИСИМА',
    keyText:'Малые симметрии дают 36 независимых коэффициентов, а большая симметрия — 21 для гиперупругого линейного отклика.',
    minor:'Малые симметрии',
    minorText:'Симметрия напряжений и деформаций приводит к Cᵢⱼₖₗ = Cⱼᵢₖₗ = Cᵢⱼₗₖ.',
    major:'Большая симметрия',
    majorText:'Если существует квадратичный упругий потенциал, смешанные производные энергии совпадают и Cᵢⱼₖₗ = Cₖₗᵢⱼ.',
    sceneKicker:'СОКРАЩЕНИЕ ЧИСЛА КОЭФФИЦИЕНТОВ',
    sceneTitle:'включай симметрии и смотри, сколько независимых компонент остаётся',
    raw:'без симметрий',
    minorOn:'малые симметрии',
    majorOn:'большая симметрия',
    components:'независимых компонент',
    warning:'ВАЖНО',
    warningTitle:'Число 21 не следует только из симметрии σ.',
    warningText:'Переход 36 → 21 требует большой симметрии, которая связана с существованием упругого потенциала и взаимностью работы.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Почему нельзя автоматически считать Cᵢⱼₖₗ = Cₖₗᵢⱼ для любой линейной модели?',
    questionText:'Потому что большая симметрия — дополнительное энергетическое свойство. Она не следует только из симметрии напряжений и деформаций.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Симметрии тензора жёсткости — это физические ограничения, а не просто сокращение записи.',
    conclusionText:'Следующий шаг — изотропная линейная упругость, где 21 коэффициент сокращается всего до двух.',
    deepen:'Углубиться',
    deepenText:'После малых симметрий пары индексов (ij) и (kl) можно рассматривать как индексы шестимерного пространства симметричных тензоров, поэтому 𝓒 представляется матрицей 6×6 — 36 коэффициентов. Большая симметрия делает эту матрицу симметричной, оставляя 6·7/2 = 21 независимый коэффициент.',
    research:'Исследовательское замечание',
    researchText:'Для касательной жёсткости нелинейной гиперупругой модели большая симметрия обычно сохраняется при корректной энергетической формулировке. В неассоциативных, активных или неравновесных моделях структура касательной может быть более сложной.',
    interactive:'ИНТЕРАКТИВНО',
    next:'Перейти к изотропной линейной упругости →',
  },
  en: {
    back:'← C04',
    title:'Stiffness-tensor symmetries: from 81 components to 21',
    lead:'Formally, Cᵢⱼₖₗ has 81 components in 3D. Physical and energetic symmetries reduce the number of independent coefficients dramatically.',
    key:'NOT EVERY Cᵢⱼₖₗ COMPONENT IS INDEPENDENT',
    keyText:'Minor symmetries reduce the count to 36, and major symmetry reduces it to 21 for an elastic energy-based response.',
    minor:'Minor symmetries',
    minorText:'Symmetry of stress and strain gives Cᵢⱼₖₗ = Cⱼᵢₖₗ = Cᵢⱼₗₖ.',
    major:'Major symmetry',
    majorText:'If a quadratic elastic potential exists, mixed derivatives of energy coincide and Cᵢⱼₖₗ = Cₖₗᵢⱼ.',
    sceneKicker:'REDUCING INDEPENDENT COEFFICIENTS',
    sceneTitle:'toggle symmetries and see how many independent components remain',
    raw:'no symmetries',
    minorOn:'minor symmetries',
    majorOn:'major symmetry',
    components:'independent components',
    warning:'IMPORTANT',
    warningTitle:'The number 21 does not follow from stress symmetry alone.',
    warningText:'The reduction 36 → 21 requires major symmetry associated with an elastic potential and work reciprocity.',
    question:'CHECKPOINT',
    questionTitle:'Why can Cᵢⱼₖₗ = Cₖₗᵢⱼ not be assumed for every linear model?',
    questionText:'Because major symmetry is an additional energetic property. It does not follow from stress and strain symmetry alone.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Stiffness-tensor symmetries are physical restrictions, not merely notational compression.',
    conclusionText:'Next comes isotropic linear elasticity, where 21 coefficients reduce to only two.',
    deepen:'Go deeper',
    deepenText:'After minor symmetries, the index pairs (ij) and (kl) may be treated as indices of the six-dimensional space of symmetric tensors, so 𝓒 becomes a 6×6 matrix with 36 coefficients. Major symmetry makes this matrix symmetric, leaving 6·7/2 = 21 independent coefficients.',
    research:'Research note',
    researchText:'For the tangent stiffness of a nonlinear hyperelastic model, major symmetry is typically retained under a consistent energy-based formulation. Non-associative, active, or nonequilibrium models may have more complicated tangent structure.',
    interactive:'INTERACTIVE',
    next:'Continue to isotropic linear elasticity →',
  }
} as const

export function StiffnessSymmetries({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [minor,setMinor]=useState(true)
  const [major,setMajor]=useState(true)

  const count=useMemo(()=>{
    if(!minor) return 81
    if(minor && !major) return 36
    return 21
  },[minor,major])

  const formula =
    notation==='Index'
      ? 'Cᵢⱼₖₗ = Cⱼᵢₖₗ = Cᵢⱼₗₖ,   and optionally   Cᵢⱼₖₗ = Cₖₗᵢⱼ'
      : notation==='Matrix'
      ? '[C]₆×₆,   [C] = [C]ᵀ if major symmetry holds'
      : notation==='Python'
      ? 'C = enforce_minor_symmetry(C); C = enforce_major_symmetry(C)'
      : '81 → 36 → 21'

  const widths=[81,36,21].map(v=>12+v/3)

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">C05</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.minor}</div>
          <div className="formula">{formula}</div>
          <p>{copy.minorText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.major}</div>
          <p>{copy.majorText}</p>
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

          <div className="constitutive-mode-switch constitutive-mode-switch-dark">
            <button className={minor?'constitutive-mode-button active':'constitutive-mode-button'} onClick={()=>{setMinor(!minor); if(minor) setMajor(false)}}>{copy.minorOn}</button>
            <button className={major?'constitutive-mode-button active':'constitutive-mode-button'} onClick={()=>{if(!minor) setMinor(true); setMajor(!major)}}>{copy.majorOn}</button>
          </div>

          <svg className="balance-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <text x="12" y="18" fill="#F4F2EC" fontSize="2.4">{copy.components}: {count}</text>

            <rect x="14" y="25" width={widths[0]} height="8" rx="2" fill="rgba(244,242,236,.10)"/>
            <rect x="14" y="38" width={widths[1]} height="8" rx="2" fill={minor?"rgba(40,100,255,.48)":"rgba(244,242,236,.05)"}/>
            <rect x="14" y="51" width={widths[2]} height="8" rx="2" fill={major?"rgba(169,227,210,.52)":"rgba(244,242,236,.05)"}/>

            <text x="16" y="31" fill="#F4F2EC" fontSize="2.2">81</text>
            <text x="16" y="44" fill={minor?"#2864FF":"#69717C"} fontSize="2.2">36</text>
            <text x="16" y="57" fill={major?"#A9E3D2":"#69717C"} fontSize="2.2">21</text>
          </svg>

          <div className="transport-metrics">
            <div><span>{copy.raw}</span><strong>81</strong></div>
            <div><span>{copy.minorOn}</span><strong>{minor?'36':'—'}</strong></div>
            <div><span>{copy.majorOn}</span><strong>{major?'21':'—'}</strong></div>
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
