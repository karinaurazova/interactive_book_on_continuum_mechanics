import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

type Effect = 'large' | 'nonlinear' | 'memory' | 'damage' | 'anisotropy'

const text = {
  ru: {
    back:'← C08',
    title:'Что ломается за пределами линейной упругости?',
    lead:'Линейная упругость удобна, но держится на нескольких сильных предпосылках. Когда хотя бы одна из них нарушается, нужна более общая конститутивная модель.',
    key:'ЛИНЕЙНАЯ УПРУГОСТЬ — ЭТО ЛОКАЛЬНЫЙ ПРЕДЕЛ, А НЕ УНИВЕРСАЛЬНЫЙ ЗАКОН',
    keyText:'Малые деформации, линейность, отсутствие памяти, повреждения и направленной структуры — это ограничения модели.',
    assumptions:'Какие предпосылки используются',
    assumptionsText:'Простейшая форма σ = C:ε предполагает малые деформации, линейный отклик и отсутствие зависимости от истории и внутренних переменных.',
    replacement:'Что приходит на смену',
    replacementText:'Нарушение каждой предпосылки ведёт к своему расширению: гиперупругости, вязкоупругости, моделям повреждения или анизотропным нелинейным законам.',
    sceneKicker:'ДИАГНОСТИКА МОДЕЛИ',
    sceneTitle:'включай эффекты и смотри, какая модель становится необходимой',
    large:'большие деформации',
    nonlinear:'нелинейный отклик',
    memory:'память и скорость',
    damage:'повреждение',
    anisotropy:'анизотропия',
    recommendation:'нужна модель',
    linear:'линейная упругость',
    hyper:'гиперупругость',
    visco:'вязкоупругость',
    damageModel:'модель повреждения',
    anisotropic:'анизотропная модель',
    combined:'составная нелинейная модель',
    warning:'ВАЖНО',
    warningTitle:'Нельзя выбирать более сложную модель только потому, что она “реалистичнее”.',
    warningText:'Каждое усложнение должно быть связано с наблюдаемым эффектом, идентифицируемыми параметрами и режимом эксперимента.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Почему один и тот же материал может требовать разные модели в разных экспериментах?',
    questionText:'Потому что в разных диапазонах деформации, скоростях и временах наблюдения проявляются разные механизмы.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Выбор конститутивной модели начинается с диагностики того, какие предпосылки линейной упругости нарушены.',
    conclusionText:'Следующий шаг — конститутивная лаборатория, где эти эффекты можно будет сравнить на одной сцене.',
    deepen:'Углубиться',
    deepenText:'В малой окрестности текущего состояния многие нелинейные модели можно линеаризовать и получить касательную жёсткость. Поэтому линейная упругость остаётся важным локальным инструментом даже внутри нелинейной механики.',
    research:'Исследовательское замечание',
    researchText:'Для мягких тканей часто одновременно важны большие деформации, почти несжимаемость, анизотропия и вязкоупругость. Тогда конститутивная модель становится модульной и должна быть согласована с термодинамикой и доступными экспериментальными протоколами.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← C08',
    title:'What breaks down beyond linear elasticity?',
    lead:'Linear elasticity is useful but rests on several strong assumptions. Once any of them fail, a more general constitutive model is needed.',
    key:'LINEAR ELASTICITY IS A LOCAL LIMIT, NOT A UNIVERSAL LAW',
    keyText:'Small strain, linearity, no memory, no damage, and no directional structure are model restrictions.',
    assumptions:'Underlying assumptions',
    assumptionsText:'The simplest σ = C:ε law assumes small strains, linear response, and no dependence on history or internal variables.',
    replacement:'What replaces it',
    replacementText:'Violating each assumption suggests a corresponding extension: hyperelasticity, viscoelasticity, damage models, or nonlinear anisotropic laws.',
    sceneKicker:'MODEL DIAGNOSTICS',
    sceneTitle:'toggle effects and see which model becomes necessary',
    large:'large deformation',
    nonlinear:'nonlinear response',
    memory:'memory and rate',
    damage:'damage',
    anisotropy:'anisotropy',
    recommendation:'required model',
    linear:'linear elasticity',
    hyper:'hyperelasticity',
    visco:'viscoelasticity',
    damageModel:'damage model',
    anisotropic:'anisotropic model',
    combined:'combined nonlinear model',
    warning:'IMPORTANT',
    warningTitle:'A more complex model should not be chosen merely because it is “more realistic”.',
    warningText:'Each added mechanism should correspond to an observed effect, identifiable parameters, and the experimental regime.',
    question:'CHECKPOINT',
    questionTitle:'Why can the same material require different models in different experiments?',
    questionText:'Because different strain ranges, loading rates, and observation times reveal different mechanisms.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Constitutive-model selection starts by diagnosing which linear-elastic assumptions fail.',
    conclusionText:'Next comes a constitutive laboratory where these effects can be compared on one scene.',
    deepen:'Go deeper',
    deepenText:'Many nonlinear models can be linearized locally around the current state, yielding a tangent stiffness. Linear elasticity therefore remains useful as a local tool inside nonlinear mechanics.',
    research:'Research note',
    researchText:'Soft tissues often combine large deformation, near incompressibility, anisotropy, and viscoelasticity. The constitutive model then becomes modular and must remain consistent with thermodynamics and available experimental protocols.',
    interactive:'INTERACTIVE',
  }
} as const

export function BeyondLinearElasticity({notation,language,onBack}:Props){
  const copy=text[language]
  const [effects,setEffects]=useState<Record<Effect,boolean>>({
    large:false,
    nonlinear:false,
    memory:false,
    damage:false,
    anisotropy:false,
  })

  const toggle=(e:Effect)=>setEffects(prev=>({...prev,[e]:!prev[e]}))

  const selected=useMemo(()=>Object.entries(effects).filter(([,v])=>v).map(([k])=>k as Effect),[effects])

  const recommendation=useMemo(()=>{
    if(selected.length===0) return copy.linear
    if(selected.length>1) return copy.combined
    if(effects.memory) return copy.visco
    if(effects.damage) return copy.damageModel
    if(effects.anisotropy) return copy.anisotropic
    return copy.hyper
  },[selected,effects,copy])

  const formula =
    notation==='Index' ? 'σᵢⱼ = 𝓕ᵢⱼ(F, history, q, A, …)' :
    notation==='Matrix' ? 'σ = 𝓕(F, history, q, A, …)' :
    notation==='Python' ? 'sigma = model(F, history, internal_vars, structure)' :
    'σ = 𝓕(F, history, internal variables, structure, …)'

  const items:[Effect,string][]=[
    ['large',copy.large],
    ['nonlinear',copy.nonlinear],
    ['memory',copy.memory],
    ['damage',copy.damage],
    ['anisotropy',copy.anisotropy],
  ]

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">C09</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.assumptions}</div>
          <div className="formula">{formula}</div>
          <p>{copy.assumptionsText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.replacement}</div>
          <p>{copy.replacementText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

        <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
        <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>
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

          <div className="constitutive-mode-switch constitutive-mode-switch-dark weak-step-switch">
            {items.map(([id,label])=>(
              <button
                key={id}
                className={effects[id]?'constitutive-mode-button active':'constitutive-mode-button'}
                onClick={()=>toggle(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <svg className="balance-scene" viewBox="0 0 100 70" role="img">
            <rect x="5" y="6" width="90" height="58" rx="9" fill="#111318"/>
            <text x="12" y="18" fill="#F4F2EC" fontSize="2.4">{copy.recommendation}</text>
            <text x="12" y="27" fill="#A9E3D2" fontSize="4">{recommendation}</text>

            {items.map(([id],i)=>{
              const x=15+i*16
              const on=effects[id]
              return <g key={id}>
                <circle cx={x} cy="45" r="5.5" fill={on?"rgba(169,227,210,.16)":"rgba(244,242,236,.035)"} stroke={on?"#A9E3D2":"#505764"} strokeWidth=".8"/>
                <text x={x-1.4} y="46.2" fill={on?"#A9E3D2":"#69717C"} fontSize="2.6">{i+1}</text>
              </g>
            })}
          </svg>
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
