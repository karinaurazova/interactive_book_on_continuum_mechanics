import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

type TaskId = 'mass' | 'momentum' | 'angular' | 'dissipation' | 'weak'

const text = {
  ru: {
    back:'← B09',
    title:'Итоговая самопроверка по законам баланса',
    lead:'Здесь нет готовых ответов. Меняй параметры и доводи каждую систему до состояния, в котором соответствующий закон выполнен.',
    key:'ПРОВЕРЯЕМ НЕ ЗАПОМИНАНИЕ, А МЕХАНИЧЕСКОЕ МЫШЛЕНИЕ',
    keyText:'Пять задач охватывают массу, импульс, момент импульса, диссипацию и слабую форму.',
    mass:'Баланс массы',
    massText:'Подбери скорость изменения плотности так, чтобы Dρ/Dt + ρ div v = 0.',
    momentum:'Линейный импульс',
    momentumText:'Подбери ускорение так, чтобы ρa = div σ + ρb.',
    angular:'Момент импульса',
    angularText:'Добейся симметрии парных касательных напряжений.',
    dissipation:'Второй закон',
    dissipationText:'Сделай диссипацию неотрицательной.',
    weak:'Слабая форма',
    weakText:'Уравняй внутреннюю и внешнюю виртуальные работы.',
    density:'ρ',
    divv:'div v',
    drhodt:'Dρ/Dt',
    body:'b',
    divsigma:'div σ',
    acceleration:'a',
    sigma12:'σ₁₂',
    sigma21:'σ₂₁',
    power:'σ:D',
    free:'ρDψ/Dt',
    thermal:'тепловой вклад',
    internal:'внутренняя работа',
    external:'внешняя работа',
    residual:'невязка',
    complete:'выполнено',
    progress:'прогресс',
    finish:'Глава пройдена',
    finishText:'Все ключевые балансы и ограничения приведены к физически корректному состоянию.',
    hint:'Условие',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← B09',
    title:'Final self-check on balance laws',
    lead:'There are no preset answers here. Adjust parameters until each system satisfies the relevant law.',
    key:'TEST MECHANICAL REASONING, NOT MEMORIZATION',
    keyText:'Five tasks cover mass, momentum, angular momentum, dissipation, and the weak form.',
    mass:'Mass balance',
    massText:'Choose the density rate so that Dρ/Dt + ρ div v = 0.',
    momentum:'Linear momentum',
    momentumText:'Choose acceleration so that ρa = div σ + ρb.',
    angular:'Angular momentum',
    angularText:'Make the paired shear stresses symmetric.',
    dissipation:'Second law',
    dissipationText:'Make dissipation nonnegative.',
    weak:'Weak form',
    weakText:'Match internal and external virtual work.',
    density:'ρ',
    divv:'div v',
    drhodt:'Dρ/Dt',
    body:'b',
    divsigma:'div σ',
    acceleration:'a',
    sigma12:'σ₁₂',
    sigma21:'σ₂₁',
    power:'σ:D',
    free:'ρDψ/Dt',
    thermal:'thermal term',
    internal:'internal work',
    external:'external work',
    residual:'residual',
    complete:'complete',
    progress:'progress',
    finish:'Chapter complete',
    finishText:'All key balances and restrictions are in a physically admissible state.',
    hint:'Condition',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=4){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function BalanceFinalChallenge({notation,language,onBack}:Props){
  const copy=text[language]

  const [rho,setRho]=useState(1.0)
  const [divv,setDivv]=useState(.35)
  const [drhodt,setDrhodt]=useState(-.15)

  const [body,setBody]=useState(.15)
  const [divsigma,setDivsigma]=useState(.55)
  const [acc,setAcc]=useState(.30)

  const [s12,setS12]=useState(.45)
  const [s21,setS21]=useState(.20)

  const [power,setPower]=useState(.55)
  const [free,setFree]=useState(.35)
  const [thermal,setThermal]=useState(-.05)

  const [internal,setInternal]=useState(.62)
  const [external,setExternal]=useState(.42)

  const data=useMemo(()=>{
    const massResidual=drhodt+rho*divv
    const momentumResidual=rho*acc-divsigma-rho*body
    const angularResidual=s12-s21
    const dissipation=power-free+thermal
    const weakResidual=internal-external
    const done={
      mass:Math.abs(massResidual)<.02,
      momentum:Math.abs(momentumResidual)<.02,
      angular:Math.abs(angularResidual)<.02,
      dissipation:dissipation>=-.001,
      weak:Math.abs(weakResidual)<.02,
    }
    const count=Object.values(done).filter(Boolean).length
    return {massResidual,momentumResidual,angularResidual,dissipation,weakResidual,done,count}
  },[rho,divv,drhodt,body,divsigma,acc,s12,s21,power,free,thermal,internal,external])

  const tasks:{id:TaskId,title:string,text:string,value:number}[]=[
    {id:'mass',title:copy.mass,text:copy.massText,value:data.massResidual},
    {id:'momentum',title:copy.momentum,text:copy.momentumText,value:data.momentumResidual},
    {id:'angular',title:copy.angular,text:copy.angularText,value:data.angularResidual},
    {id:'dissipation',title:copy.dissipation,text:copy.dissipationText,value:data.dissipation},
    {id:'weak',title:copy.weak,text:copy.weakText,value:data.weakResidual},
  ]

  const statusColor=(id:TaskId)=>data.done[id]?'#A9E3D2':'#DD7A2B'

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">B10 / 10</div>
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
            <div>
              <div className="challenge-task-list">
                {tasks.map(task=>(
                  <div key={task.id} className={data.done[task.id]?'challenge-task done':'challenge-task'}>
                    <div className="challenge-task-status">{data.done[task.id]?'✓':'•'}</div>
                    <div>
                      <strong>{task.title}</strong>
                      <p>{task.text}</p>
                      <small>{copy.residual}: {fmt(task.value)}</small>
                    </div>
                  </div>
                ))}
              </div>

              {data.count===5 && (
                <div className="challenge-finish">
                  <strong>{copy.finish}</strong>
                  <p>{copy.finishText}</p>
                </div>
              )}
            </div>

            <div className="control-stack">
              <div className="challenge-progress-card">
                <strong>{copy.mass}</strong>
                <label><span>{copy.density} <b>{fmt(rho,2)}</b></span><input type="range" min=".5" max="1.8" step=".01" value={rho} onChange={e=>setRho(Number(e.target.value))}/></label>
                <label><span>{copy.divv} <b>{fmt(divv,2)}</b></span><input type="range" min="-.8" max=".8" step=".01" value={divv} onChange={e=>setDivv(Number(e.target.value))}/></label>
                <label><span>{copy.drhodt} <b>{fmt(drhodt,2)}</b></span><input type="range" min="-1.2" max="1.2" step=".01" value={drhodt} onChange={e=>setDrhodt(Number(e.target.value))}/></label>
              </div>

              <div className="challenge-progress-card">
                <strong>{copy.momentum}</strong>
                <label><span>{copy.divsigma} <b>{fmt(divsigma,2)}</b></span><input type="range" min="-.8" max="1.2" step=".01" value={divsigma} onChange={e=>setDivsigma(Number(e.target.value))}/></label>
                <label><span>{copy.body} <b>{fmt(body,2)}</b></span><input type="range" min="-.8" max=".8" step=".01" value={body} onChange={e=>setBody(Number(e.target.value))}/></label>
                <label><span>{copy.acceleration} <b>{fmt(acc,2)}</b></span><input type="range" min="-1.2" max="1.2" step=".01" value={acc} onChange={e=>setAcc(Number(e.target.value))}/></label>
              </div>

              <div className="challenge-progress-card">
                <strong>{copy.angular}</strong>
                <label><span>{copy.sigma12} <b>{fmt(s12,2)}</b></span><input type="range" min="-.8" max=".8" step=".01" value={s12} onChange={e=>setS12(Number(e.target.value))}/></label>
                <label><span>{copy.sigma21} <b>{fmt(s21,2)}</b></span><input type="range" min="-.8" max=".8" step=".01" value={s21} onChange={e=>setS21(Number(e.target.value))}/></label>
              </div>

              <div className="challenge-progress-card">
                <strong>{copy.dissipation}</strong>
                <label><span>{copy.power} <b>{fmt(power,2)}</b></span><input type="range" min="-.8" max="1.2" step=".01" value={power} onChange={e=>setPower(Number(e.target.value))}/></label>
                <label><span>{copy.free} <b>{fmt(free,2)}</b></span><input type="range" min="-.8" max="1.2" step=".01" value={free} onChange={e=>setFree(Number(e.target.value))}/></label>
                <label><span>{copy.thermal} <b>{fmt(thermal,2)}</b></span><input type="range" min="-.8" max=".8" step=".01" value={thermal} onChange={e=>setThermal(Number(e.target.value))}/></label>
              </div>

              <div className="challenge-progress-card">
                <strong>{copy.weak}</strong>
                <label><span>{copy.internal} <b>{fmt(internal,2)}</b></span><input type="range" min="0" max="1.2" step=".01" value={internal} onChange={e=>setInternal(Number(e.target.value))}/></label>
                <label><span>{copy.external} <b>{fmt(external,2)}</b></span><input type="range" min="0" max="1.2" step=".01" value={external} onChange={e=>setExternal(Number(e.target.value))}/></label>
              </div>
            </div>
          </div>

          <svg className="balance-scene" viewBox="0 0 100 35" role="img">
            <rect x="5" y="5" width="90" height="25" rx="8" fill="#111318"/>
            {tasks.map((task,i)=>{
              const x=13+i*17
              return <g key={task.id}>
                <circle cx={x} cy="17.5" r="5.8" fill="rgba(244,242,236,.04)" stroke={statusColor(task.id)} strokeWidth="1"/>
                <text x={x-1.6} y="19" fill={statusColor(task.id)} fontSize="3">{i+1}</text>
                {i<tasks.length-1 && <line x1={x+5.8} y1="17.5" x2={x+11.2} y2="17.5" stroke="#505764" strokeWidth=".8"/>}
              </g>
            })}
          </svg>
        </div>
      </div>
    </section>
  )
}
