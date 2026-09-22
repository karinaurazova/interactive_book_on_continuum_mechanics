import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    back:'← T09',
    title:'Итоговая самопроверка по времени и транспорту',
    lead:'Теперь собери всю временную кинематику в четырёх самостоятельных экспериментах. Нужно не выбрать ответ, а подобрать параметры так, чтобы условие действительно выполнялось, и только потом зафиксировать результат.',
    key:'РЕЖИМ САМОПРОВЕРКИ',
    keyText:'Свяжи материальную производную, градиент скорости, разложение L = D + W, изменение объёма и относительный поток через движущуюся границу.',
    task1:'Убери конвективный вклад',
    task1Text:'Подбери скорость v или градиент поля g так, чтобы v·g ≈ 0, но хотя бы одна из величин была ненулевой.',
    task2:'Найди чистый локальный поворот',
    task2Text:'Добейся ‖D‖ < 0.02 при ‖W‖ > 0.10.',
    task3:'Сохрани объём при ненулевой деформации',
    task3Text:'Сделай tr D ≈ 0, но ‖D‖ > 0.10.',
    task4:'Убери относительный поток',
    task4Text:'Подбери скорость границы w так, чтобы |v − w| < 0.02 при ненулевой скорости вещества.',
    velocity:'скорость v',
    gradient:'градиент поля g',
    stretch:'симметричная скорость s',
    shear:'сдвиговая скорость q',
    spin:'спин ω',
    boundary:'скорость границы w',
    convective:'v·g',
    normD:'‖D‖',
    normW:'‖W‖',
    traceD:'tr D',
    relative:'|v−w|',
    capture:'зафиксировать',
    reset:'сбросить',
    complete:'выполнено',
    pending:'не выполнено',
    progress:'Прогресс',
    sceneKicker:'ИТОГОВАЯ САМОПРОВЕРКА',
    sceneTitle:'четыре эксперимента по временной кинематике и транспорту',
    finish:'Глава «Время и транспорт» завершена',
    finishText:'Ты связал скорость, ускорение, материальную производную, L, D, W, J̇, дивергенцию и транспорт через движущуюся границу в единую систему.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← T09',
    title:'Final self-check on time and transport',
    lead:'Bring the whole time-dependent kinematics chapter together in four independent experiments. Do not select an answer: tune the parameters until the condition is truly satisfied, then capture it.',
    key:'SELF-CHECK MODE',
    keyText:'Connect the material derivative, velocity gradient, L = D + W, volume change, and relative transport through a moving boundary.',
    task1:'Remove the convective contribution',
    task1Text:'Choose velocity v or field gradient g so that v·g ≈ 0 while at least one remains nonzero.',
    task2:'Find pure local rotation',
    task2Text:'Reach ‖D‖ < 0.02 while ‖W‖ > 0.10.',
    task3:'Preserve volume with nonzero deformation',
    task3Text:'Reach tr D ≈ 0 while ‖D‖ > 0.10.',
    task4:'Remove relative boundary flux',
    task4Text:'Choose boundary speed w so that |v − w| < 0.02 with nonzero material speed.',
    velocity:'velocity v',
    gradient:'field gradient g',
    stretch:'symmetric rate s',
    shear:'shear rate q',
    spin:'spin ω',
    boundary:'boundary speed w',
    convective:'v·g',
    normD:'‖D‖',
    normW:'‖W‖',
    traceD:'tr D',
    relative:'|v−w|',
    capture:'capture',
    reset:'reset',
    complete:'completed',
    pending:'pending',
    progress:'Progress',
    sceneKicker:'FINAL SELF-CHECK',
    sceneTitle:'four experiments in time-dependent kinematics and transport',
    finish:'Time & transport chapter completed',
    finishText:'You connected velocity, acceleration, material derivative, L, D, W, J̇, divergence, and transport through a moving boundary into one system.',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=3){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function TransportFinalChallenge({notation,language,onBack}:Props){
  const copy=text[language]
  const [v,setV]=useState(.65)
  const [g,setG]=useState(.35)
  const [s,setS]=useState(.30)
  const [q,setQ]=useState(.22)
  const [omega,setOmega]=useState(.45)
  const [w,setW]=useState(.15)
  const [done,setDone]=useState([false,false,false,false])

  const data=useMemo(()=>{
    const convective=v*g

    const D:[[number,number],[number,number]]=[[s,q],[q,-s]]
    const W:[[number,number],[number,number]]=[[0,-omega],[omega,0]]
    const norm=(A:number[][])=>Math.sqrt(A.flat().reduce((acc,x)=>acc+x*x,0))
    const normD=norm(D)
    const normW=norm(W)
    const traceD=D[0][0]+D[1][1]
    const relative=Math.abs(v-w)

    return {convective,D,W,normD,normW,traceD,relative}
  },[v,g,s,q,omega,w])

  const conditions=[
    Math.abs(data.convective)<.02 && (Math.abs(v)>.08 || Math.abs(g)>.08),
    data.normD<.02 && data.normW>.10,
    Math.abs(data.traceD)<.02 && data.normD>.10,
    data.relative<.02 && Math.abs(v)>.08,
  ]

  const mark=(i:number)=>{
    if(!conditions[i]) return
    setDone(prev=>prev.map((x,j)=>j===i?true:x))
  }

  const completed=done.filter(Boolean).length
  const tasks=[
    [copy.task1,copy.task1Text],
    [copy.task2,copy.task2Text],
    [copy.task3,copy.task3Text],
    [copy.task4,copy.task4Text],
  ]

  const notationLine =
    notation==='Index' ? 'D/Dt = ∂/∂t + vⱼ∂/∂xⱼ,   Lᵢⱼ = Dᵢⱼ + Wᵢⱼ' :
    notation==='Matrix' ? 'D/Dt = ∂/∂t + v·∇,   L = D + W' :
    notation==='Python' ? 'material = local + v @ grad; L = D + W' :
    'D/Dt = ∂/∂t + 𝐯·∇,   𝐋 = 𝐃 + 𝐖'

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">T10 / 11</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>
        <div className="concept-card"><span>{copy.key}</span><strong>{copy.keyText}</strong></div>
        <div className="definition"><div className="definition-label">T00–T09</div><div className="formula">{notationLine}</div></div>
      </div>

      <div className="scene-column">
        <div className="scene-card">
          <div className="scene-head">
            <div><span className="scene-kicker">{copy.sceneKicker}</span><h2>{copy.sceneTitle}</h2></div>
            <div className="live-badge">{copy.interactive}</div>
          </div>

          <div className="transport-challenge-grid">
            <div>
              <div className="control-stack">
                <label><span>{copy.velocity} <strong>{fmt(v,2)}</strong></span><input type="range" min="-.9" max=".9" step=".01" value={v} onChange={e=>setV(Number(e.target.value))}/></label>
                <label><span>{copy.gradient} <strong>{fmt(g,2)}</strong></span><input type="range" min="-.9" max=".9" step=".01" value={g} onChange={e=>setG(Number(e.target.value))}/></label>
                <label><span>{copy.stretch} <strong>{fmt(s,2)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={s} onChange={e=>setS(Number(e.target.value))}/></label>
                <label><span>{copy.shear} <strong>{fmt(q,2)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={q} onChange={e=>setQ(Number(e.target.value))}/></label>
                <label><span>{copy.spin} <strong>{fmt(omega,2)}</strong></span><input type="range" min="-.9" max=".9" step=".01" value={omega} onChange={e=>setOmega(Number(e.target.value))}/></label>
                <label><span>{copy.boundary} <strong>{fmt(w,2)}</strong></span><input type="range" min="-.9" max=".9" step=".01" value={w} onChange={e=>setW(Number(e.target.value))}/></label>
              </div>

              <div className="transport-metrics">
                <div><span>{copy.convective}</span><strong>{fmt(data.convective)}</strong></div>
                <div><span>{copy.normD}</span><strong>{fmt(data.normD)}</strong></div>
                <div><span>{copy.normW}</span><strong>{fmt(data.normW)}</strong></div>
                <div><span>{copy.traceD}</span><strong>{fmt(data.traceD)}</strong></div>
                <div><span>{copy.relative}</span><strong>{fmt(data.relative)}</strong></div>
              </div>

              <button className="text-button challenge-reset" onClick={()=>{
                setV(.65); setG(.35); setS(.30); setQ(.22); setOmega(.45); setW(.15)
                setDone([false,false,false,false])
              }}>{copy.reset}</button>
            </div>

            <div className="challenge-task-list">
              {tasks.map(([title,body],i)=>(
                <div className={done[i]?'challenge-task done':'challenge-task'} key={i}>
                  <div className="challenge-task-status">{done[i]?'✓':i+1}</div>
                  <div>
                    <strong>{title}</strong>
                    <p>{body}</p>
                    <button
                      className={conditions[i]&&!done[i]?'kin-challenge-capture':'kin-challenge-capture disabled'}
                      disabled={!conditions[i]||done[i]}
                      onClick={()=>mark(i)}
                    >{copy.capture}</button>
                    <small>{done[i]?copy.complete:copy.pending}</small>
                  </div>
                </div>
              ))}

              <div className="challenge-progress-card">
                <div className="progress-head"><span>{copy.progress}</span><span>{completed} / 4</span></div>
                <div className="progress-track"><div className="progress-fill" style={{width:`${completed*25}%`}}/></div>
              </div>
            </div>
          </div>

          {completed===4 && <div className="challenge-finish"><strong>{copy.finish}</strong><p>{copy.finishText}</p></div>}
        </div>
      </div>
    </section>
  )
}
