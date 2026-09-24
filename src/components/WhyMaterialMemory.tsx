import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props = {
  notation: NotationMode
  language: Language
  onNext?: () => void
}

const text = {
  ru: {
    title:'Почему отклик материала зависит от истории нагружения?',
    lead:'Для упругого материала напряжённое состояние определяется текущей деформацией. Для материалов с времязависимым откликом этого недостаточно: напряжение при одной и той же деформации может зависеть от предшествующей истории нагружения и характерного времени процесса.',
    key:'ПАМЯТЬ МАТЕРИАЛА',
    keyText:'Конститутивное состояние в момент времени t определяется не только текущей деформацией, но и предшествующей историей её изменения.',
    elastic:'Материал без памяти',
    elasticText:'В идеализированной упругой модели достаточно знать текущее значение деформации: σ(t)=σ(ε(t)). После разгрузки восстановление определяется только текущим состоянием и не содержит собственного временного масштаба.',
    memory:'Материал с памятью',
    memoryText:'В вязкоупругой модели отклик зависит от времени и истории нагружения. Поэтому даже при фиксированной деформации напряжение может изменяться во времени вследствие релаксационных процессов.',
    sceneKicker:'УПРУГОСТЬ ↔ ПАМЯТЬ',
    sceneTitle:'Сравните отклик при одинаковой деформации для различных времён релаксации',
    strain:'ступень деформации ε₀',
    tau:'время релаксации τ',
    memoryPart:'доля времязависимого вклада',
    stressNow:'σ(t)',
    stressInf:'σ∞',
    ratio:'σ/σ₀',
    warning:'ВАЖНО',
    warningTitle:'Наличие временной зависимости само по себе не определяет вязкоупругий механизм.',
    warningText:'Необходимо различать кинематическую зависимость от времени, явную зависимость напряжений от скорости деформации и наследственную зависимость, описываемую внутренними переменными или интегральными соотношениями по истории нагружения.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Что произойдёт после мгновенной фиксации деформации?',
    questionText:'Для чисто упругого материала напряжение останется постоянным. Для релаксирующего вязкоупругого материала оно будет уменьшаться со временем.',
    conclusion:'ВЫВОД',
    conclusionTitle:'История нагружения становится частью конститутивного описания.',
    conclusionText:'Следующий шаг — сравнить два базовых эксперимента: релаксацию напряжений и ползучесть.',
    deepen:'Углубиться',
    deepenText:'Минимальное описание материала с памятью может быть задано внутренней переменной q: σ=σ(ε,q), q̇=f(ε,q). В линейной вязкоупругости альтернативой служат наследственные интегралы, связывающие текущий отклик со всей предшествующей историей деформации.',
    research:'Исследовательское замечание',
    researchText:'Одни и те же макроскопические кривые могут быть описаны разными внутренними механизмами. Поэтому идентификация параметров требует нескольких независимых протоколов нагружения.',
    interactive:'ИНТЕРАКТИВНО',
    next:'E01 → релаксация и ползучесть',
  },
  en: {
    title:'Why can a material remember its past?',
    lead:'In an elastic model, current stress is determined by current strain. In many materials, however, the same strain can correspond to different stresses depending on how fast and along which path that state was reached.',
    key:'MATERIAL MEMORY',
    keyText:'The state at time t depends not only on current strain but also on its history.',
    elastic:'Without memory',
    elasticText:'Ideal elasticity needs only the current state: σ(t)=σ(ε(t)). After unloading, the response recovers without a time-dependent tail.',
    memory:'With memory',
    memoryText:'In viscoelasticity, response depends on time and loading history. Even at fixed strain, stress may continue to evolve.',
    sceneKicker:'ELASTICITY ↔ MEMORY',
    sceneTitle:'keep the same final strain and change the memory timescale',
    strain:'strain step ε₀',
    tau:'relaxation time τ',
    memoryPart:'time-dependent fraction',
    stressNow:'σ(t)',
    stressInf:'σ∞',
    ratio:'σ/σ₀',
    warning:'IMPORTANT',
    warningTitle:'Time dependence alone does not automatically mean viscoelastic memory.',
    warningText:'Distinguish kinematics, explicit rate dependence, and genuine memory represented by internal variables or hereditary integrals.',
    question:'CHECKPOINT',
    questionTitle:'What happens after strain is suddenly held fixed?',
    questionText:'A purely elastic material keeps constant stress. A relaxing viscoelastic material shows decreasing stress with time.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Loading history becomes part of the constitutive problem.',
    conclusionText:'Next we compare the two canonical experiments: stress relaxation and creep.',
    deepen:'Go deeper',
    deepenText:'A minimal memory model can use an internal variable q: σ=σ(ε,q), q̇=f(ε,q). Linear viscoelasticity can also be written as an integral over the past strain history.',
    research:'Research note',
    researchText:'Different internal mechanisms can produce similar macroscopic curves. Parameter identification therefore benefits from multiple independent loading protocols.',
    interactive:'INTERACTIVE',
    next:'E01 → relaxation and creep',
  }
} as const

function fmt(v:number,d=3){ return (Math.abs(v)<1e-12?0:v).toFixed(d) }

export function WhyMaterialMemory({notation,language,onNext}:Props){
  const copy=text[language]
  const [eps0,setEps0]=useState(.10)
  const [tau,setTau]=useState(4)
  const [g,setG]=useState(.55)
  const [time,setTime]=useState(5)

  const data=useMemo(()=>{
    const E0=10
    const sigma0=E0*eps0
    const ratio=(1-g)+g*Math.exp(-time/tau)
    const sigma=sigma0*ratio
    const sigmaInf=sigma0*(1-g)
    return {sigma0,sigma,sigmaInf,ratio}
  },[eps0,tau,g,time])

  const formula =
    notation==='Index' ? 'σ_ij(t) = σ_ij^∞ + [σ_ij(0)−σ_ij^∞] exp(−t/τ)' :
    notation==='Matrix' ? 'Σ(t) = Σ∞ + (Σ₀−Σ∞) e^(−t/τ)' :
    notation==='Python' ? 'sigma = sigma_inf + (sigma0 - sigma_inf) * np.exp(-t/tau)' :
    'σ(t) = σ∞ + (σ₀ − σ∞) e^(−t/τ)'

  const pts=Array.from({length:81},(_,i)=>{
    const t=12*i/80
    const y=(1-g)+g*Math.exp(-t/tau)
    return [10+80*t/12,58-38*y]
  })
  const path=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' ')

  return <section className="module-view module-view-stacked">
    <div className="lesson-copy">
      <div className="lesson-index">E00</div>
      <h1>{copy.title}</h1>
      <p className="lead">{copy.lead}</p>
      <div className="concept-card"><span>{copy.key}</span><strong>{copy.keyText}</strong></div>

      <div className="definition">
        <div className="definition-label">{copy.elastic}</div>
        <p>{copy.elasticText}</p>
      </div>
      <div className="definition">
        <div className="definition-label">{copy.memory}</div>
        <div className="formula">{formula}</div>
        <p>{copy.memoryText}</p>
      </div>

      <div className="warning-card kinematics-warning">
        <span>{copy.warning}</span><strong>{copy.warningTitle}</strong><p>{copy.warningText}</p>
      </div>

      <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
      <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>

      <ApplicationLinks language={language} items={[
        {ru:'Полимеры и эластомеры',en:'Polymers and elastomers'},
        {ru:'Битум и асфальт',en:'Bitumen and asphalt'},
        {ru:'Геоматериалы',en:'Geomaterials'},
        {ru:'Мягкие биологические ткани',en:'Soft biological tissues'},
      ]}/>
      {onNext && <button className="primary-button" onClick={onNext}>{copy.next}</button>}
    </div>

    <div className="scene-column">
      <div className="scene-card">
        <div className="scene-head">
          <div><span className="scene-kicker">{copy.sceneKicker}</span><h2>{copy.sceneTitle}</h2></div>
          <div className="live-badge">{copy.interactive}</div>
        </div>
        <svg className="balance-scene" viewBox="0 0 100 68" role="img">
          <rect x="5" y="6" width="90" height="56" rx="9" fill="#111318"/>
          <line x1="10" y1="58" x2="90" y2="58" stroke="#69717C" strokeWidth=".6"/>
          <line x1="10" y1="18" x2="10" y2="58" stroke="#69717C" strokeWidth=".6"/>
          <path d={path} fill="none" stroke="#A9E3D2" strokeWidth="1.2"/>
          <line x1={10+80*time/12} y1="18" x2={10+80*time/12} y2="58" stroke="#2864FF" strokeWidth=".8" strokeDasharray="2 2"/>
          <text x="13" y="15" fill="#F4F2EC" fontSize="2.4">σ/σ₀ = {fmt(data.ratio)}</text>
        </svg>

        <div className="control-stack">
          <label><span>{copy.strain} <strong>{fmt(eps0,2)}</strong></span><input type="range" min=".02" max=".25" step=".005" value={eps0} onChange={e=>setEps0(Number(e.target.value))}/></label>
          <label><span>{copy.tau} <strong>{fmt(tau,1)}</strong></span><input type="range" min=".5" max="10" step=".1" value={tau} onChange={e=>setTau(Number(e.target.value))}/></label>
          <label><span>{copy.memoryPart} <strong>{fmt(g,2)}</strong></span><input type="range" min="0" max=".9" step=".01" value={g} onChange={e=>setG(Number(e.target.value))}/></label>
          <label><span>t <strong>{fmt(time,1)}</strong></span><input type="range" min="0" max="12" step=".1" value={time} onChange={e=>setTime(Number(e.target.value))}/></label>
        </div>

        <div className="transport-metrics">
          <div><span>{copy.stressNow}</span><strong>{fmt(data.sigma)}</strong></div>
          <div><span>{copy.stressInf}</span><strong>{fmt(data.sigmaInf)}</strong></div>
          <div><span>{copy.ratio}</span><strong>{fmt(data.ratio)}</strong></div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="prediction-card"><span>{copy.question}</span><strong>{copy.questionTitle}</strong><p>{copy.questionText}</p></div>
        <div className="author-card"><span>{copy.conclusion}</span><strong>{copy.conclusionTitle}</strong><p>{copy.conclusionText}</p></div>
      </div>
    </div>
  </section>
}
