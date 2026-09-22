import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    back:'← C10',
    title:'Итоговая самопроверка по конститутивному моделированию',
    lead:'Доведи каждую мини-задачу до физически корректного состояния. Здесь проверяется не запоминание формул, а понимание того, когда и почему модель допустима.',
    key:'ПЯТЬ ПРОВЕРОК — ОДНА ЛОГИКА ВЫБОРА МОДЕЛИ',
    keyText:'Параметры, несжимаемость, диссипация, анизотропия и граница линейного режима.',
    p1:'Согласуй E, ν с K и G',
    p2:'Приблизь J к несжимаемому пределу',
    p3:'Обеспечь неотрицательную диссипацию',
    p4:'Убери волоконный вклад поворотом структуры',
    p5:'Верни нелинейную модель в локально линейный режим',
    residual:'невязка',
    progress:'прогресс',
    complete:'глава пройдена',
    completeText:'Все пять конститутивных проверок приведены к допустимому состоянию.',
    E:'E',
    nu:'ν',
    K:'K',
    G:'G',
    J:'J',
    eta:'η',
    rate:'ε̇',
    angle:'θ',
    strain:'ε',
    nonlinear:'a',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← C10',
    title:'Final self-check on constitutive modeling',
    lead:'Bring each mini-task to a physically consistent state. This checks model reasoning rather than formula memorization.',
    key:'FIVE CHECKS — ONE MODEL-SELECTION LOGIC',
    keyText:'Parameters, incompressibility, dissipation, anisotropy, and the boundary of the linear regime.',
    p1:'Match E, ν with K and G',
    p2:'Bring J close to the incompressible limit',
    p3:'Ensure nonnegative dissipation',
    p4:'Remove the fiber contribution by rotating structure',
    p5:'Return the nonlinear model to a locally linear regime',
    residual:'residual',
    progress:'progress',
    complete:'chapter complete',
    completeText:'All five constitutive checks are in an admissible state.',
    E:'E',
    nu:'ν',
    K:'K',
    G:'G',
    J:'J',
    eta:'η',
    rate:'ε̇',
    angle:'θ',
    strain:'ε',
    nonlinear:'a',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=4){ return (Math.abs(v)<1e-12?0:v).toFixed(d) }

export function ConstitutiveFinalChallenge({notation,language,onBack}:Props){
  const copy=text[language]

  const [E,setE]=useState(1.5)
  const [nu,setNu]=useState(.30)
  const [K,setK]=useState(1.3)
  const [G,setG]=useState(.7)

  const [J,setJ]=useState(1.035)

  const [eta,setEta]=useState(.4)
  const [rate,setRate]=useState(.2)

  const [angle,setAngle]=useState(55)

  const [eps,setEps]=useState(.18)
  const [a,setA]=useState(8)

  const data=useMemo(()=>{
    const Ktarget=E/(3*(1-2*nu))
    const Gtarget=E/(2*(1+nu))
    const paramResidual=Math.sqrt((K-Ktarget)**2+(G-Gtarget)**2)
    const incompressibleResidual=Math.abs(J-1)
    const dissipation=eta*rate*rate
    const fiberResidual=Math.cos(angle*Math.PI/180)**4
    const nonlinearRatio=Math.abs(a*eps*eps/Math.max(E,1e-8))

    const done={
      params:paramResidual<.03,
      incompressible:incompressibleResidual<.005,
      dissipation:eta>=0 && dissipation>=-1e-10,
      fiber:fiberResidual<.01,
      linear:nonlinearRatio<.05,
    }
    const count=Object.values(done).filter(Boolean).length
    return {Ktarget,Gtarget,paramResidual,incompressibleResidual,dissipation,fiberResidual,nonlinearRatio,done,count}
  },[E,nu,K,G,J,eta,rate,angle,eps,a])

  const tasks=[
    [copy.p1,data.done.params,data.paramResidual],
    [copy.p2,data.done.incompressible,data.incompressibleResidual],
    [copy.p3,data.done.dissipation,data.dissipation],
    [copy.p4,data.done.fiber,data.fiberResidual],
    [copy.p5,data.done.linear,data.nonlinearRatio],
  ] as const

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">C11</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>
      </div>

      <div className="scene-column">
        <div className="scene-card">
          <div className="scene-head">
            <div>
              <span className="scene-kicker">{copy.progress}: {data.count}/5</span>
              <h2>{copy.keyText}</h2>
            </div>
            <div className="live-badge">{copy.interactive}</div>
          </div>

          <div className="challenge-grid">
            <div className="challenge-task-list">
              {tasks.map(([title,done,value],i)=>(
                <div key={title} className={done?'challenge-task done':'challenge-task'}>
                  <div className="challenge-task-status">{done?'✓':'•'}</div>
                  <div>
                    <strong>{title}</strong>
                    <small>{copy.residual}: {fmt(value)}</small>
                  </div>
                </div>
              ))}
              {data.count===5 && (
                <div className="challenge-finish">
                  <strong>{copy.complete}</strong>
                  <p>{copy.completeText}</p>
                </div>
              )}
            </div>

            <div className="control-stack">
              <div className="challenge-progress-card">
                <strong>{copy.p1}</strong>
                <label><span>{copy.E} <b>{fmt(E,2)}</b></span><input type="range" min=".3" max="3" step=".01" value={E} onChange={e=>setE(Number(e.target.value))}/></label>
                <label><span>{copy.nu} <b>{fmt(nu,3)}</b></span><input type="range" min="-.5" max=".45" step=".005" value={nu} onChange={e=>setNu(Number(e.target.value))}/></label>
                <label><span>{copy.K} <b>{fmt(K,3)}</b></span><input type="range" min=".2" max="6" step=".01" value={K} onChange={e=>setK(Number(e.target.value))}/></label>
                <label><span>{copy.G} <b>{fmt(G,3)}</b></span><input type="range" min=".1" max="2" step=".01" value={G} onChange={e=>setG(Number(e.target.value))}/></label>
              </div>

              <div className="challenge-progress-card">
                <strong>{copy.p2}</strong>
                <label><span>{copy.J} <b>{fmt(J,4)}</b></span><input type="range" min=".95" max="1.05" step=".001" value={J} onChange={e=>setJ(Number(e.target.value))}/></label>
              </div>

              <div className="challenge-progress-card">
                <strong>{copy.p3}</strong>
                <label><span>{copy.eta} <b>{fmt(eta,3)}</b></span><input type="range" min="-.5" max="1.5" step=".01" value={eta} onChange={e=>setEta(Number(e.target.value))}/></label>
                <label><span>{copy.rate} <b>{fmt(rate,3)}</b></span><input type="range" min="-.6" max=".6" step=".01" value={rate} onChange={e=>setRate(Number(e.target.value))}/></label>
              </div>

              <div className="challenge-progress-card">
                <strong>{copy.p4}</strong>
                <label><span>{copy.angle} <b>{fmt(angle,0)}°</b></span><input type="range" min="0" max="90" step="1" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label>
              </div>

              <div className="challenge-progress-card">
                <strong>{copy.p5}</strong>
                <label><span>{copy.strain} <b>{fmt(eps,3)}</b></span><input type="range" min="0" max=".35" step=".005" value={eps} onChange={e=>setEps(Number(e.target.value))}/></label>
                <label><span>{copy.nonlinear} <b>{fmt(a,2)}</b></span><input type="range" min="0" max="15" step=".1" value={a} onChange={e=>setA(Number(e.target.value))}/></label>
              </div>
            </div>
          </div>

          <svg className="balance-scene" viewBox="0 0 100 35" role="img">
            <rect x="5" y="5" width="90" height="25" rx="8" fill="#111318"/>
            {tasks.map(([,done],i)=>{
              const x=13+i*17
              return <g key={i}>
                <circle cx={x} cy="17.5" r="5.8" fill="rgba(244,242,236,.04)" stroke={done?"#A9E3D2":"#DD7A2B"} strokeWidth="1"/>
                <text x={x-1.6} y="19" fill={done?"#A9E3D2":"#DD7A2B"} fontSize="3">{i+1}</text>
                {i<tasks.length-1 && <line x1={x+5.8} y1="17.5" x2={x+11.2} y2="17.5" stroke="#505764" strokeWidth=".8"/>}
              </g>
            })}
          </svg>
        </div>
      </div>
    </section>
  )
}
