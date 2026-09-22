import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    back:'← T07',
    title:'Контрольный объём и поток через границу',
    lead:'Если область пространства фиксирована, вещество может входить в неё и выходить из неё. Тогда изменение интегральной величины внутри контрольного объёма определяется локальным накоплением и чистым потоком через границу.',
    key:'ФИКСИРОВАННЫЙ ОБЪЁМ ≠ МАТЕРИАЛЬНАЯ ОБЛАСТЬ',
    keyText:'Для фиксированного контрольного объёма V: d/dt ∫V φ dv + ∫∂V φ v·n da описывает скорость изменения соответствующей величины у проходящего через V материала.',
    accumulation:'Накопление внутри',
    accumulationText:'Первый член показывает, как меняется интеграл по неподвижной области пространства.',
    flux:'Поток через границу',
    fluxText:'Поверхностный член учитывает перенос величины φ частицами, пересекающими границу контрольного объёма.',
    sceneKicker:'КОНТРОЛЬНЫЙ ОБЪЁМ',
    sceneTitle:'наблюдай входящий и выходящий поток через фиксированную область',
    time:'время t',
    speed:'скорость потока u',
    fieldLevel:'уровень поля φ₀',
    gradient:'градиент поля c',
    volume:'контрольный объём V',
    inlet:'вход',
    outlet:'выход',
    content:'∫V φ dv',
    accumulationValue:'d/dt ∫V φ dv',
    inletFlux:'входящий поток',
    outletFlux:'выходящий поток',
    netFlux:'чистый поток наружу',
    total:'накопление + чистый поток',
    warning:'ВАЖНО',
    warningTitle:'Знак потока задаётся внешней нормалью n.',
    warningText:'На входе v·n < 0, на выходе v·n > 0. Поэтому входящий поток входит в поверхностный интеграл со знаком минус.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Что изменится, если входящий и выходящий потоки равны?',
    questionText:'Чистый поток через границу станет нулевым. Но интегральная величина внутри всё ещё может меняться, если само поле φ явно зависит от времени.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Контрольный объём отделяет локальное накопление от переноса через границу.',
    conclusionText:'Следующий шаг — объединить material volume и control volume в общей форме транспортной теоремы Рейнольдса.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← T07',
    title:'Control volume and boundary flux',
    lead:'If a region of space is fixed, material may enter and leave it. The change of an integral quantity inside the control volume is then determined by local accumulation and net flux through the boundary.',
    key:'FIXED VOLUME ≠ MATERIAL REGION',
    keyText:'For a fixed control volume V: d/dt ∫V φ dv + ∫∂V φ v·n da describes the rate associated with the material passing through V.',
    accumulation:'Accumulation inside',
    accumulationText:'The first term measures how the integral over the fixed spatial region changes in time.',
    flux:'Boundary flux',
    fluxText:'The surface term accounts for transport of φ by particles crossing the control-volume boundary.',
    sceneKicker:'CONTROL VOLUME',
    sceneTitle:'observe inflow and outflow through a fixed region',
    time:'time t',
    speed:'flow speed u',
    fieldLevel:'field level φ₀',
    gradient:'field gradient c',
    volume:'control volume V',
    inlet:'inlet',
    outlet:'outlet',
    content:'∫V φ dv',
    accumulationValue:'d/dt ∫V φ dv',
    inletFlux:'inlet flux',
    outletFlux:'outlet flux',
    netFlux:'net outward flux',
    total:'accumulation + net flux',
    warning:'IMPORTANT',
    warningTitle:'Flux sign is set by the outward normal n.',
    warningText:'At the inlet v·n < 0, while at the outlet v·n > 0. Therefore inflow enters the surface integral with a negative sign.',
    question:'CHECKPOINT',
    questionTitle:'What changes if inlet and outlet fluxes are equal?',
    questionText:'The net boundary flux vanishes. The integral inside may still change if the field φ depends explicitly on time.',
    conclusion:'CONCLUSION',
    conclusionTitle:'A control volume separates local accumulation from transport across the boundary.',
    conclusionText:'Next we combine material and control-volume viewpoints in the general Reynolds transport theorem.',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=4){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function ControlVolumeFlux({notation,language,onBack}:Props){
  const copy=text[language]
  const [time,setTime]=useState(0.35)
  const [speed,setSpeed]=useState(0.65)
  const [phi0,setPhi0]=useState(1.0)
  const [gradient,setGradient]=useState(0.40)

  const data=useMemo(()=>{
    // fixed 1D control volume x in [0,1]
    // phi(x,t)=phi0 + 0.25 t + gradient x
    // uniform velocity v=speed
    const q=0.25
    const content=phi0+q*time+0.5*gradient
    const accumulation=q

    const phiIn=phi0+q*time
    const phiOut=phi0+q*time+gradient

    // outward normals: n=-1 at x=0, n=+1 at x=1
    const inletFlux=phiIn*speed
    const outletFlux=phiOut*speed
    const netOut=outletFlux-inletFlux
    const total=accumulation+netOut

    return {content,accumulation,phiIn,phiOut,inletFlux,outletFlux,netOut,total}
  },[time,speed,phi0,gradient])

  const notationLine =
    notation==='Index'
      ? 'd/dt ∫V φ dv + ∫∂V φ vᵢ nᵢ da'
      : notation==='Matrix'
      ? 'd/dt ∫V φ dv + ∫∂V φ v·n da'
      : notation==='Python'
      ? 'rate = d_dt(volume_integral) + boundary_flux'
      : 'd/dt ∫V φ dv + ∫∂V φ 𝐯·𝐧 da'

  const particles=Array.from({length:11},(_,i)=>{
    const x=((i/10)+speed*time*0.35)%1.35-.18
    return x
  })

  const xMap=(x:number)=>18+64*x

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">T08 / 11</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.accumulation}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.accumulationText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.flux}</div>
          <p>{copy.fluxText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
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

          <svg className="transport-scene" viewBox="0 0 100 66" role="img">
            <rect x="5" y="6" width="90" height="54" rx="9" fill="#111318"/>
            <rect x="18" y="20" width="64" height="28" rx="3" fill="rgba(40,100,255,.08)" stroke="#2864FF" strokeWidth=".85"/>
            <text x="42" y="17" fill="#8E96A3" fontSize="2.7">{copy.volume}</text>
            <text x="10" y="34" fill="#A9E3D2" fontSize="2.6">{copy.inlet}</text>
            <text x="84" y="34" fill="#A9E3D2" fontSize="2.6">{copy.outlet}</text>

            <line x1="10" y1="34" x2="18" y2="34" stroke="#A9E3D2" strokeWidth="1.2"/>
            <line x1="82" y1="34" x2="90" y2="34" stroke="#A9E3D2" strokeWidth="1.2"/>

            {particles.map((x,i)=>(
              <circle key={i} cx={xMap(x)} cy={28+(i%3)*6} r="1.15" fill={x>=0&&x<=1?"#F4F2EC":"#69717C"} />
            ))}

            <text x="18" y="56" fill="#8E96A3" fontSize="2.4">φ_in = {fmt(data.phiIn,2)}</text>
            <text x="64" y="56" fill="#8E96A3" fontSize="2.4">φ_out = {fmt(data.phiOut,2)}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.time} <strong>{fmt(time,2)}</strong></span><input type="range" min="0" max="1.2" step=".01" value={time} onChange={e=>setTime(Number(e.target.value))}/></label>
            <label><span>{copy.speed} <strong>{fmt(speed,2)}</strong></span><input type="range" min="-.9" max=".9" step=".01" value={speed} onChange={e=>setSpeed(Number(e.target.value))}/></label>
            <label><span>{copy.fieldLevel} <strong>{fmt(phi0,2)}</strong></span><input type="range" min=".2" max="1.8" step=".01" value={phi0} onChange={e=>setPhi0(Number(e.target.value))}/></label>
            <label><span>{copy.gradient} <strong>{fmt(gradient,2)}</strong></span><input type="range" min="-.9" max=".9" step=".01" value={gradient} onChange={e=>setGradient(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.content}</span><strong>{fmt(data.content)}</strong></div>
            <div><span>{copy.accumulationValue}</span><strong>{fmt(data.accumulation)}</strong></div>
            <div><span>{copy.inletFlux}</span><strong>{fmt(data.inletFlux)}</strong></div>
            <div><span>{copy.outletFlux}</span><strong>{fmt(data.outletFlux)}</strong></div>
            <div><span>{copy.netFlux}</span><strong>{fmt(data.netOut)}</strong></div>
            <div><span>{copy.total}</span><strong>{fmt(data.total)}</strong></div>
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
