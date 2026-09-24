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

const text = {
  ru:{
    title:'Релаксация напряжений и ползучесть',
    lead:'Два канонических эксперимента позволяют независимо исследовать времязависимый отклик материала: релаксацию напряжений при фиксированной деформации и ползучесть при фиксированном напряжении.',
    key:'ДВА КАНОНИЧЕСКИХ ПРОТОКОЛА',
    keyText:'Релаксация: ε=const → σ(t). Ползучесть: σ=const → ε(t).',
    relax:'Релаксация напряжений',
    relaxText:'Материал быстро деформируют и затем удерживают деформацию постоянной. Если есть память, требуемое для удержания напряжение обычно уменьшается.',
    creep:'Ползучесть',
    creepText:'Материал быстро нагружают и затем удерживают напряжение постоянным. Если есть память, деформация продолжает расти со временем.',
    sceneKicker:'ПРОТОКОЛ НАГРУЖЕНИЯ',
    sceneTitle:'Сравнение отклика при управлении деформацией и напряжением',
    modeRelax:'Релаксация',
    modeCreep:'Ползучесть',
    tau:'характерное время τ',
    amplitude:'амплитуда',
    time:'время t',
    input:'управляющая величина',
    output:'измеряемый отклик',
    warning:'ВАЖНО',
    warningTitle:'Один эксперимент редко идентифицирует модель однозначно.',
    warningText:'Разные комбинации упругих и вязких параметров могут давать похожую релаксационную кривую. Ползучесть, разгрузка и циклы добавляют независимую информацию.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Что именно нужно держать постоянным?',
    questionText:'В релаксации фиксируют деформацию, в ползучести — напряжение. Если перепутать управляющую величину, физический смысл эксперимента меняется.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Релаксация и ползучесть характеризуют разные стороны одного времязависимого конститутивного отклика.',
    conclusionText:'Далее вводятся простейшие реологические модели — модель Максвелла и модель Кельвина—Фойгта, которые по-разному воспроизводят релаксацию и ползучесть.',
    deepen:'Углубиться',
    deepenText:'В линейной вязкоупругости релаксационный модуль G(t) и функция податливости J(t) описывают разные эксперименты и связаны через свёрточные соотношения, а не простым взаимным обращением во времени.',
    research:'Исследовательское замечание',
    researchText:'Экспериментальная программа должна включать диапазон временных масштабов. Иначе параметр τ может оказаться практически неидентифицируемым.',
    next:'E02 → модель Максвелла',
    back:'← E00',
  },
  en:{
    title:'Stress relaxation and creep',
    lead:'Two canonical experiments split material memory into complementary questions: what stress does at fixed strain, and what strain does at fixed stress.',
    key:'TWO CANONICAL PROTOCOLS',
    keyText:'Relaxation: ε=const → σ(t). Creep: σ=const → ε(t).',
    relax:'Stress relaxation',
    relaxText:'The material is rapidly deformed and then held at fixed strain. With memory, the stress required to maintain that strain usually decreases.',
    creep:'Creep',
    creepText:'The material is rapidly loaded and then held at fixed stress. With memory, strain continues to increase.',
    sceneKicker:'LOADING PROTOCOL',
    sceneTitle:'switch the experiment and see which quantity becomes the response',
    modeRelax:'Relaxation',
    modeCreep:'Creep',
    tau:'characteristic time τ',
    amplitude:'amplitude',
    time:'time t',
    input:'prescribed',
    output:'response',
    warning:'IMPORTANT',
    warningTitle:'One experiment rarely identifies a model uniquely.',
    warningText:'Different elastic and viscous parameter combinations can produce similar relaxation curves. Creep, unloading, and cyclic tests add independent information.',
    question:'CHECKPOINT',
    questionTitle:'Which quantity must be held fixed?',
    questionText:'Relaxation holds strain fixed; creep holds stress fixed. Reversing the controlled quantity changes the physical experiment.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Relaxation and creep are complementary views of time-dependent mechanics.',
    conclusionText:'Next we build minimal mechanical analogues and see why Maxwell and Kelvin–Voigt respond differently to these tests.',
    deepen:'Go deeper',
    deepenText:'In linear viscoelasticity, the relaxation modulus G(t) and creep compliance J(t) describe different experiments and are linked by convolution relations rather than simple pointwise reciprocals.',
    research:'Research note',
    researchText:'An experimental program should span multiple timescales; otherwise τ may become practically unidentifiable.',
    next:'E02 → Maxwell model',
    back:'← E00',
  }
} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function RelaxationCreep({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [mode,setMode]=useState<'relax'|'creep'>('relax')
  const [tau,setTau]=useState(4)
  const [amp,setAmp]=useState(1)
  const [time,setTime]=useState(5)

  const data=useMemo(()=>{
    if(mode==='relax'){
      const response=amp*(.35+.65*Math.exp(-time/tau))
      return {input:amp,response}
    }
    const response=amp*(1+.8*(1-Math.exp(-time/tau)))
    return {input:amp,response}
  },[mode,tau,amp,time])

  const curve=Array.from({length:81},(_,i)=>{
    const t=12*i/80
    const y=mode==='relax'
      ? amp*(.35+.65*Math.exp(-t/tau))
      : amp*(1+.8*(1-Math.exp(-t/tau)))
    return [10+80*t/12,58-30*Math.min(y/1.8,1.25)]
  })
  const path=curve.map((p,i)=>(i?'L':'M')+p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' ')

  const formula =
    mode==='relax'
      ? (notation==='Python'?'sigma = eps0 * G(t)':'σ(t) = ε₀ G(t)')
      : (notation==='Python'?'eps = sigma0 * J(t)':'ε(t) = σ₀ J(t)')

  return <section className="module-view module-view-stacked">
    <div className="lesson-copy">
      <div className="lesson-index">E01</div>
      <h1>{copy.title}</h1>
      <p className="lead">{copy.lead}</p>
      <div className="concept-card"><span>{copy.key}</span><strong>{copy.keyText}</strong></div>
      <div className="definition"><div className="definition-label">{copy.relax}</div><p>{copy.relaxText}</p></div>
      <div className="definition"><div className="definition-label">{copy.creep}</div><p>{copy.creepText}</p></div>
      <div className="formula">{formula}</div>

      <div className="warning-card kinematics-warning"><span>{copy.warning}</span><strong>{copy.warningTitle}</strong><p>{copy.warningText}</p></div>
      <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
      <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>
      <ApplicationLinks language={language} items={[
        {ru:'Полимерные материалы',en:'Polymeric materials'},
        {ru:'Вязкоупругие демпферы',en:'Viscoelastic dampers'},
        {ru:'Геоматериалы',en:'Geomaterials'},
        {ru:'Мягкие ткани и биоматериалы',en:'Soft tissues and biomaterials'},
      ]}/>
      <div className="module-actions">
        {onBack&&<button className="text-button" onClick={onBack}>{copy.back}</button>}
        {onNext&&<button className="primary-button" onClick={onNext}>{copy.next}</button>}
      </div>
    </div>

    <div className="scene-column">
      <div className="scene-card">
        <div className="scene-head">
          <div><span className="scene-kicker">{copy.sceneKicker}</span><h2>{copy.sceneTitle}</h2></div>
        </div>
        <div className="mode-switcher">
          <button className={mode==='relax'?'active':''} onClick={()=>setMode('relax')}>{copy.modeRelax}</button>
          <button className={mode==='creep'?'active':''} onClick={()=>setMode('creep')}>{copy.modeCreep}</button>
        </div>
        <svg className="balance-scene" viewBox="0 0 100 68" role="img">
          <rect x="5" y="6" width="90" height="56" rx="9" fill="#111318"/>
          <line x1="10" y1="58" x2="90" y2="58" stroke="#69717C" strokeWidth=".6"/>
          <line x1="10" y1="18" x2="10" y2="58" stroke="#69717C" strokeWidth=".6"/>
          <path d={path} fill="none" stroke="#A9E3D2" strokeWidth="1.2"/>
          <line x1={10+80*time/12} y1="18" x2={10+80*time/12} y2="58" stroke="#2864FF" strokeWidth=".8" strokeDasharray="2 2"/>
        </svg>
        <div className="control-stack">
          <label><span>{copy.tau} <strong>{fmt(tau,1)}</strong></span><input type="range" min=".5" max="10" step=".1" value={tau} onChange={e=>setTau(Number(e.target.value))}/></label>
          <label><span>{copy.amplitude} <strong>{fmt(amp,2)}</strong></span><input type="range" min=".25" max="1.5" step=".01" value={amp} onChange={e=>setAmp(Number(e.target.value))}/></label>
          <label><span>{copy.time} <strong>{fmt(time,1)}</strong></span><input type="range" min="0" max="12" step=".1" value={time} onChange={e=>setTime(Number(e.target.value))}/></label>
        </div>
        <div className="transport-metrics">
          <div><span>{copy.input}</span><strong>{fmt(data.input)}</strong></div>
          <div><span>{copy.output}</span><strong>{fmt(data.response)}</strong></div>
          <div><span>t/τ</span><strong>{fmt(time/tau)}</strong></div>
        </div>
      </div>
      <div className="bottom-grid">
        <div className="prediction-card"><span>{copy.question}</span><strong>{copy.questionTitle}</strong><p>{copy.questionText}</p></div>
        <div className="author-card"><span>{copy.conclusion}</span><strong>{copy.conclusionTitle}</strong><p>{copy.conclusionText}</p></div>
      </div>
    </div>
  </section>
}
