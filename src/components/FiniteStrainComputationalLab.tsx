import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props={notation:NotationMode;language:Language;onBack?:()=>void}
type Mode='hyper'|'tangent'|'branch'|'imperfection'

const text={
ru:{
 title:'Вычислительная лаборатория конечных деформаций и устойчивости',
 lead:'В этой лаборатории собраны ключевые идеи главы. Меняй модель и параметры, наблюдай отклик и проверяй, как связаны гиперупругость, касательная жёсткость, критические состояния и чувствительность к несовершенствам.',
 key:'ОДНА ЛАБОРАТОРИЯ — ЧЕТЫРЕ УРОВНЯ НЕЛИНЕЙНОГО АНАЛИЗА',
 keyText:'Задача не в том, чтобы подобрать “красивую” кривую, а в том, чтобы увидеть, какой механизм отвечает за наблюдаемое поведение.',
 hyper:'Гиперупругий отклик',tangent:'Касательная жёсткость',branch:'Посткритическая ветвь',imperfection:'Несовершенство',
 stretch:'растяжение λ',mu:'параметр μ',alpha:'показатель α',load:'нагрузка N',kmat:'материальная жёсткость',gamma:'геометрический коэффициент',eps:'несовершенство ε',
 stress:'напряжение',tangentValue:'касательная жёсткость',critical:'критическая нагрузка',state:'состояние',
 stable:'устойчиво',near:'около критического',unstable:'неустойчиво',
 sceneKicker:'ИНТЕГРИРОВАННАЯ ЛАБОРАТОРИЯ',sceneTitle:'выбери режим и исследуй нелинейный отклик как единую систему',
 task:'ИССЛЕДОВАТЕЛЬСКОЕ ЗАДАНИЕ',taskTitle:'Найди набор параметров, при котором система сначала жёсткая, затем приближается к критике, а малое несовершенство заметно меняет путь.',
 taskText:'Сравни режимы между собой и сформулируй, какой параметр отвечает за материал, какой — за геометрию, а какой — за выбор посткритической ветви.',
 conclusion:'ВЫВОД',conclusionTitle:'Конечные деформации и устойчивость нельзя изучать по одной кривой.',
 conclusionText:'Нужно одновременно видеть конститутивный отклик, касательную жёсткость, геометрию ветвей и чувствительность к малым возмущениям.',
 deepen:'Углубиться',deepenText:'В реальной задаче эти уровни связаны через нелинейную краевую постановку: материал определяет внутренние силы, текущая геометрия влияет на касательную жёсткость, а алгоритм продолжения определяет, какую часть равновесного пути удаётся вычислить.',
 back:'← D12',interactive:'ИНТЕРАКТИВНО'
},
en:{
 title:'Computational laboratory for finite strain and stability',
 lead:'This laboratory combines the key ideas of the chapter. Change models and parameters, observe the response, and examine how hyperelasticity, tangent stiffness, critical states, and imperfection sensitivity are connected.',
 key:'ONE LABORATORY — FOUR LEVELS OF NONLINEAR ANALYSIS',
 keyText:'The goal is not to fit a visually appealing curve but to identify which mechanism controls the observed behavior.',
 hyper:'Hyperelastic response',tangent:'Tangent stiffness',branch:'Post-critical branch',imperfection:'Imperfection',
 stretch:'stretch λ',mu:'parameter μ',alpha:'exponent α',load:'load N',kmat:'material stiffness',gamma:'geometric coefficient',eps:'imperfection ε',
 stress:'stress',tangentValue:'tangent stiffness',critical:'critical load',state:'state',
 stable:'stable',near:'near critical',unstable:'unstable',
 sceneKicker:'INTEGRATED LABORATORY',sceneTitle:'select a mode and investigate nonlinear response as one connected system',
 task:'RESEARCH TASK',taskTitle:'Find parameters for which the system is initially stiff, then approaches a critical state, while a small imperfection noticeably changes the path.',
 taskText:'Compare the modes and identify which parameter controls material response, which controls geometry, and which controls post-critical branch selection.',
 conclusion:'CONCLUSION',conclusionTitle:'Finite strain and stability cannot be understood from a single curve.',
 conclusionText:'Constitutive response, tangent stiffness, branch geometry, and sensitivity to small perturbations must be considered together.',
 deepen:'Go deeper',deepenText:'In a full problem these levels are coupled through a nonlinear boundary-value problem: material response determines internal forces, current geometry affects tangent stiffness, and the continuation algorithm determines which part of the equilibrium path can be computed.',
 back:'← D12',interactive:'INTERACTIVE'
}} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function FiniteStrainComputationalLab({notation,language,onBack}:Props){
 const copy=text[language]
 const [mode,setMode]=useState<Mode>('hyper')
 const [stretch,setStretch]=useState(1.25)
 const [mu,setMu]=useState(1.2)
 const [alpha,setAlpha]=useState(2.5)
 const [load,setLoad]=useState(3.5)
 const [kmat,setKmat]=useState(8)
 const [gamma,setGamma]=useState(1.4)
 const [eps,setEps]=useState(.03)

 const data=useMemo(()=>{
   const stress=mu*(Math.pow(stretch,alpha-1)-Math.pow(stretch,-alpha/2-1))
   const kt=kmat-gamma*load
   const crit=kmat/gamma
   const state=kt>.2?copy.stable:kt>=-.2?copy.near:copy.unstable
   const q=Math.cbrt(eps+Math.max(load/crit-1,0)*.25)
   return {stress,kt,crit,state,q}
 },[stretch,mu,alpha,load,kmat,gamma,eps,copy])

 const formula=notation==='Python'
 ? "sigma = mu*(lam**(alpha-1)-lam**(-alpha/2-1))"
 : notation==='Index'
 ? 'σ = σ(λ; μ, α),   K^T_ab = K^mat_ab + K^geo_ab'
 : 'σ = σ(λ; μ, α),   K_T = K_mat + K_geo'

 const curve=useMemo(()=>Array.from({length:100},(_,i)=>{
   const l=.65+i/99*1.45
   const s=mu*(Math.pow(l,alpha-1)-Math.pow(l,-alpha/2-1))
   const x=8+i/99*84
   const y=52-Math.max(-2.5,Math.min(2.5,s))/2.5*18
   return {x,y}
 }),[mu,alpha])
 const curvePath=curve.map((p,i)=>`${i?'L':'M'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')

 return <section className="module-view module-view-stacked"><div className="lesson-copy">
  <div className="lesson-index">D13</div><h1>{copy.title}</h1><p className="lead">{copy.lead}</p>
  <div className="concept-card"><span>{copy.key}</span><strong>{copy.keyText}</strong></div>
  <div className="definition"><div className="formula">{formula}</div><p>{copy.keyText}</p></div>
  <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
  {onBack&&<button className="text-button" onClick={onBack}>{copy.back}</button>}
 </div><div className="scene-column">
  <div className="scene-card">
   <div className="scene-head"><div><span className="scene-kicker">{copy.sceneKicker}</span><h2>{copy.sceneTitle}</h2></div><div className="live-badge">{copy.interactive}</div></div>
   <div className="mode-switcher">
    <button className={mode==='hyper'?'active':''} onClick={()=>setMode('hyper')}>{copy.hyper}</button>
    <button className={mode==='tangent'?'active':''} onClick={()=>setMode('tangent')}>{copy.tangent}</button>
    <button className={mode==='branch'?'active':''} onClick={()=>setMode('branch')}>{copy.branch}</button>
    <button className={mode==='imperfection'?'active':''} onClick={()=>setMode('imperfection')}>{copy.imperfection}</button>
   </div>
   <svg className="balance-scene" viewBox="0 0 100 62">
    <rect x="5" y="5" width="90" height="52" rx="8" fill="#111318"/>
    <line x1="8" y1="52" x2="93" y2="52" stroke="#69717C" strokeWidth=".55"/>
    <line x1="8" y1="52" x2="8" y2="11" stroke="#69717C" strokeWidth=".55"/>
    {mode==='hyper'&&<path d={curvePath} fill="none" stroke="#A9E3D2" strokeWidth="1.5"/>}
    {mode==='tangent'&&<>
      <line x1="12" y1={45-data.kt*3} x2="88" y2={45-data.kt*3} stroke="#A9E3D2" strokeWidth="1.5"/>
      <line x1="12" y1="45" x2="88" y2="45" stroke="#F28C52" strokeDasharray="2 2" strokeWidth=".8"/>
    </>}
    {mode==='branch'&&<path d="M 18 49 C 36 43, 45 31, 51 20 C 57 9, 69 18, 82 34" fill="none" stroke="#A9E3D2" strokeWidth="1.5"/>}
    {mode==='imperfection'&&<>
      <path d="M 50 50 C 49 39, 43 28, 34 17 M 50 50 C 51 39, 57 28, 66 17" fill="none" stroke="#69717C" strokeDasharray="2 2" strokeWidth=".9"/>
      <path d={`M 50 50 C ${50+data.q*8} 38, ${54+data.q*14} 28, ${58+data.q*18} 17`} fill="none" stroke="#A9E3D2" strokeWidth="1.5"/>
    </>}
    <text x="10" y="13" fill="#F4F2EC" fontSize="2.1">{mode==='hyper'?'σ(λ)':mode==='tangent'?'K_T':mode==='branch'?'λ(u)':'q(λ)'}</text>
   </svg>
   <div className="transport-metrics">
    <div><span>{copy.stress}</span><strong>{fmt(data.stress)}</strong></div>
    <div><span>{copy.tangentValue}</span><strong>{fmt(data.kt)}</strong></div>
    <div><span>{copy.critical}</span><strong>{fmt(data.crit)}</strong></div>
    <div><span>{copy.state}</span><strong>{data.state}</strong></div>
   </div>
   <div className="control-stack">
    {(mode==='hyper')&&<>
      <label><span>{copy.stretch}<strong>{fmt(stretch,2)}</strong></span><input type="range" min=".7" max="2.1" step=".01" value={stretch} onChange={e=>setStretch(Number(e.target.value))}/></label>
      <label><span>{copy.mu}<strong>{fmt(mu,2)}</strong></span><input type="range" min=".2" max="3" step=".05" value={mu} onChange={e=>setMu(Number(e.target.value))}/></label>
      <label><span>{copy.alpha}<strong>{fmt(alpha,2)}</strong></span><input type="range" min="1.2" max="6" step=".1" value={alpha} onChange={e=>setAlpha(Number(e.target.value))}/></label>
    </>}
    {(mode==='tangent'||mode==='branch')&&<>
      <label><span>{copy.load}<strong>{fmt(load,2)}</strong></span><input type="range" min="0" max="8" step=".05" value={load} onChange={e=>setLoad(Number(e.target.value))}/></label>
      <label><span>{copy.kmat}<strong>{fmt(kmat,2)}</strong></span><input type="range" min="1" max="15" step=".1" value={kmat} onChange={e=>setKmat(Number(e.target.value))}/></label>
      <label><span>{copy.gamma}<strong>{fmt(gamma,2)}</strong></span><input type="range" min=".2" max="3" step=".05" value={gamma} onChange={e=>setGamma(Number(e.target.value))}/></label>
    </>}
    {mode==='imperfection'&&<>
      <label><span>{copy.eps}<strong>{fmt(eps,3)}</strong></span><input type="range" min="-.15" max=".15" step=".005" value={eps} onChange={e=>setEps(Number(e.target.value))}/></label>
      <label><span>{copy.load}<strong>{fmt(load,2)}</strong></span><input type="range" min="0" max="8" step=".05" value={load} onChange={e=>setLoad(Number(e.target.value))}/></label>
    </>}
   </div>
  </div>
  <div className="bottom-grid"><div className="prediction-card"><span>{copy.task}</span><strong>{copy.taskTitle}</strong><p>{copy.taskText}</p></div><div className="author-card"><span>{copy.conclusion}</span><strong>{copy.conclusionTitle}</strong><p>{copy.conclusionText}</p></div></div>
 </div></section>
}
