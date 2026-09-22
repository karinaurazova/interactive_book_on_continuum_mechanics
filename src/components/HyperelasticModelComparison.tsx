import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props = {
  notation: NotationMode
  language: Language
  onBack?: () => void
  onNext?: () => void
}

type Protocol = 'uniaxial' | 'biaxial'

const text = {
  ru: {
    title:'Neo-Hookean и Mooney–Rivlin: что меняет I₂',
    lead:'Две изотропные гиперупругие модели могут одинаково описывать часть экспериментов и при этом заметно расходиться на другом пути деформирования. Именно поэтому одной кривой растяжения недостаточно для идентификации нелинейного материала.',
    key:'ОДИН МАЛОДЕФОРМАЦИОННЫЙ МОДУЛЬ — РАЗНЫЕ НЕЛИНЕЙНЫЕ ПРЕДСКАЗАНИЯ',
    keyText:'Neo-Hookean зависит только от I₁, а Mooney–Rivlin — от I₁ и I₂. При одинаковом малодеформационном модуле различие проявляется по мере роста деформации и зависит от протокола.',
    models:'Две модели',
    modelsText:'Для несжимаемого материала: Ψ_NH = μ/2 (I₁−3), а Ψ_MR = C₁(I₁−3)+C₂(I₂−3), где μ = 2(C₁+C₂).',
    ident:'Почему нужна многорежимная калибровка',
    identText:'Одноосный тест может плохо различать параметры, которые сильнее проявляются при двухосном растяжении или других путях деформирования.',
    protocol:'протокол',
    uniaxial:'одноосное растяжение',
    biaxial:'равнодвухосное растяжение',
    lambda:'растяжение λ',
    mu:'μ',
    alpha:'доля I₂, α',
    I1:'I₁',
    I2:'I₂',
    nh:'P Neo-Hookean',
    mr:'P Mooney–Rivlin',
    diff:'разница',
    sceneKicker:'MODEL COMPARISON',
    sceneTitle:'одинаковый μ, разные зависимости от инвариантов',
    checkpoint:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    checkpointTitle:'Почему один удачный fit ещё не доказывает корректность модели?',
    checkpointText:'Потому что несколько моделей могут совпасть на одном пути нагружения. Их нужно проверять на независимых протоколах, где активируются разные комбинации инвариантов.',
    conclusion:'ВЫВОД',
    conclusionTitle:'I₂ добавляет чувствительность к форме деформированного состояния.',
    conclusionText:'Следующий шаг — посмотреть семейство Ogden, где энергия задаётся напрямую через главные растяжения и позволяет гибко описывать сильную нелинейность.',
    deepen:'Углубиться',
    deepenText:'Для несжимаемого одноосного растяжения λ₂=λ₃=λ⁻¹ᐟ², поэтому I₁=λ²+2/λ и I₂=2λ+1/λ². Для равнодвухосного растяжения λ₃=λ⁻², и сочетание I₁/I₂ меняется иначе.',
    research:'Исследовательское замечание',
    researchText:'Практическая идентифицируемость параметров зависит не только от числа параметров модели, но и от информативности экспериментальных путей. Это прямой мост к планированию эксперимента и inverse modeling.',
    warning:'ВАЖНО',
    warningTitle:'Больше параметров не означает автоматически лучшую физическую модель.',
    warningText:'Дополнительный параметр полезен только тогда, когда данные способны его идентифицировать и модель проходит проверку вне калибровочного режима.',
    back:'← D03',
    next:'D05 → Ogden',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    title:'Neo-Hookean and Mooney–Rivlin: what does I₂ change?',
    lead:'Two isotropic hyperelastic models can fit part of the data equally well and still diverge strongly along another deformation path. This is why a single tensile curve is not enough to identify nonlinear material behavior.',
    key:'SAME SMALL-STRAIN MODULUS — DIFFERENT NONLINEAR PREDICTIONS',
    keyText:'Neo-Hookean depends only on I₁, whereas Mooney–Rivlin depends on I₁ and I₂. With the same small-strain modulus, differences emerge at larger deformation and depend on loading path.',
    models:'Two models',
    modelsText:'For an incompressible material: Ψ_NH = μ/2 (I₁−3), while Ψ_MR = C₁(I₁−3)+C₂(I₂−3), with μ = 2(C₁+C₂).',
    ident:'Why multi-mode calibration matters',
    identText:'A uniaxial test may poorly distinguish parameters that become much more visible under biaxial stretch or other deformation paths.',
    protocol:'protocol',
    uniaxial:'uniaxial tension',
    biaxial:'equibiaxial tension',
    lambda:'stretch λ',
    mu:'μ',
    alpha:'I₂ fraction, α',
    I1:'I₁',
    I2:'I₂',
    nh:'P Neo-Hookean',
    mr:'P Mooney–Rivlin',
    diff:'difference',
    sceneKicker:'MODEL COMPARISON',
    sceneTitle:'same μ, different invariant dependence',
    checkpoint:'CHECKPOINT',
    checkpointTitle:'Why does one successful fit not prove a model is adequate?',
    checkpointText:'Because several models can match one loading path. They should be tested on independent protocols that activate different invariant combinations.',
    conclusion:'CONCLUSION',
    conclusionTitle:'I₂ adds sensitivity to the shape of the deformation state.',
    conclusionText:'Next we move to the Ogden family, where energy is written directly in terms of principal stretches and can capture stronger nonlinear behavior.',
    deepen:'Go deeper',
    deepenText:'For incompressible uniaxial tension, λ₂=λ₃=λ⁻¹ᐟ², so I₁=λ²+2/λ and I₂=2λ+1/λ². Under equibiaxial stretch, λ₃=λ⁻² and the I₁/I₂ combination changes differently.',
    research:'Research note',
    researchText:'Practical parameter identifiability depends not only on model size but also on how informative the experimental paths are. This directly connects constitutive modeling with experimental design and inverse modeling.',
    warning:'IMPORTANT',
    warningTitle:'More parameters do not automatically mean a better physical model.',
    warningText:'An extra parameter is useful only when the data can identify it and the model survives validation outside the calibration regime.',
    back:'← D03',
    next:'D05 → Ogden',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=3){ return (Math.abs(v)<1e-12?0:v).toFixed(d) }

function invariants(lambda:number, protocol:Protocol){
  if(protocol==='uniaxial'){
    return {
      I1: lambda*lambda + 2/lambda,
      I2: 2*lambda + 1/(lambda*lambda),
    }
  }
  return {
    I1: 2*lambda*lambda + 1/Math.pow(lambda,4),
    I2: Math.pow(lambda,4) + 2/(lambda*lambda),
  }
}

function energy(lambda:number, protocol:Protocol, mu:number, alpha:number, model:'nh'|'mr'){
  const {I1,I2}=invariants(lambda,protocol)
  if(model==='nh') return .5*mu*(I1-3)
  const C1=.5*mu*(1-alpha)
  const C2=.5*mu*alpha
  return C1*(I1-3)+C2*(I2-3)
}

function nominal(lambda:number, protocol:Protocol, mu:number, alpha:number, model:'nh'|'mr'){
  const h=1e-5
  const a=Math.max(lambda-h,.50001)
  const b=lambda+h
  return (energy(b,protocol,mu,alpha,model)-energy(a,protocol,mu,alpha,model))/(b-a)
}

export function HyperelasticModelComparison({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [protocol,setProtocol]=useState<Protocol>('uniaxial')
  const [lambda,setLambda]=useState(1.35)
  const [mu,setMu]=useState(20)
  const [alpha,setAlpha]=useState(.35)

  const data=useMemo(()=>{
    const inv=invariants(lambda,protocol)
    const pNh=nominal(lambda,protocol,mu,alpha,'nh')
    const pMr=nominal(lambda,protocol,mu,alpha,'mr')
    return {...inv,pNh,pMr,diff:pMr-pNh}
  },[lambda,protocol,mu,alpha])

  const formula =
    notation==='Index' ? 'Ψ_MR = C₁(I₁−3)+C₂(I₂−3),   μ = 2(C₁+C₂)' :
    notation==='Matrix' ? 'Ψ_NH = μ/2(I₁−3),   Ψ_MR = C₁(I₁−3)+C₂(I₂−3)' :
    notation==='Python' ? 'W_nh=.5*mu*(I1-3); W_mr=C1*(I1-3)+C2*(I2-3)' :
    'Ψ_NH = μ/2(I₁−3),   Ψ_MR = C₁(I₁−3)+C₂(I₂−3)'

  const curve = Array.from({length:91},(_,i)=>{
    const l=.7+i*(.9/90)
    return {
      l,
      nh:nominal(l,protocol,mu,alpha,'nh'),
      mr:nominal(l,protocol,mu,alpha,'mr'),
    }
  })
  const vals=curve.flatMap(p=>[p.nh,p.mr])
  const ymin=Math.min(...vals,0), ymax=Math.max(...vals,0)
  const span=Math.max(ymax-ymin,1e-6)
  const pathFor=(which:'nh'|'mr')=>curve.map((p,i)=>{
    const x=8+(p.l-.7)/.9*84
    const y=52-(p[which]-ymin)/span*39
    return `${i===0?'M':'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ')

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <div className="lesson-index">D04</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.models}</div>
          <div className="formula">{formula}</div>
          <p>{copy.modelsText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.ident}</div>
          <p>{copy.identText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

        <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
        <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>

        <ApplicationLinks language={language} items={[
          {ru:'Эластомеры',en:'Elastomers'},
          {ru:'Биомеханика мягких тканей',en:'Soft-tissue biomechanics'},
          {ru:'Идентификация параметров',en:'Parameter identification'},
          {ru:'Планирование эксперимента',en:'Experimental design'},
        ]}/>

        <div className="mini-toggle-row" style={{marginTop:20}}>{onBack && <button className="text-button" onClick={onBack}>{copy.back}</button>}{onNext && <button className="primary-button" onClick={onNext}>{copy.next}</button>}</div>
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

          <div className="mini-toggle-row" style={{marginBottom:14}}>
            <button className={protocol==='uniaxial'?'toggle active':'toggle'} onClick={()=>setProtocol('uniaxial')}>{copy.uniaxial}</button>
            <button className={protocol==='biaxial'?'toggle active':'toggle'} onClick={()=>setProtocol('biaxial')}>{copy.biaxial}</button>
          </div>

          <svg className="balance-scene" viewBox="0 0 100 60" role="img">
            <rect x="5" y="5" width="90" height="50" rx="8" fill="#111318"/>
            <line x1="8" y1="52" x2="94" y2="52" stroke="#69717C" strokeWidth=".6"/>
            <line x1="8" y1="52" x2="8" y2="10" stroke="#69717C" strokeWidth=".6"/>
            <path d={pathFor('nh')} fill="none" stroke="#2864FF" strokeWidth="1.3"/>
            <path d={pathFor('mr')} fill="none" stroke="#A9E3D2" strokeWidth="1.3"/>
            <text x="11" y="13" fill="#2864FF" fontSize="2.3">Neo-Hookean</text>
            <text x="11" y="17" fill="#A9E3D2" fontSize="2.3">Mooney–Rivlin</text>
            <text x="82" y="56" fill="#F4F2EC" fontSize="2.2">λ</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.lambda}<strong>{fmt(lambda,2)}</strong></span><input type="range" min=".7" max="1.6" step=".01" value={lambda} onChange={e=>setLambda(Number(e.target.value))}/></label>
            <label><span>{copy.mu}<strong>{fmt(mu,1)}</strong></span><input type="range" min="2" max="60" step="1" value={mu} onChange={e=>setMu(Number(e.target.value))}/></label>
            <label><span>{copy.alpha}<strong>{fmt(alpha,2)}</strong></span><input type="range" min="0" max=".8" step=".01" value={alpha} onChange={e=>setAlpha(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.I1}</span><strong>{fmt(data.I1)}</strong></div>
            <div><span>{copy.I2}</span><strong>{fmt(data.I2)}</strong></div>
            <div><span>{copy.diff}</span><strong>{fmt(data.diff)}</strong></div>
          </div>

          <div className="transport-metrics metrics-secondary">
            <div><span>{copy.nh}</span><strong>{fmt(data.pNh)}</strong></div>
            <div><span>{copy.mr}</span><strong>{fmt(data.pMr)}</strong></div>
            <div><span>{copy.protocol}</span><strong>{protocol==='uniaxial'?copy.uniaxial:copy.biaxial}</strong></div>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="prediction-card">
            <span>{copy.checkpoint}</span>
            <strong>{copy.checkpointTitle}</strong>
            <p>{copy.checkpointText}</p>
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
