import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void}
type TangentMode='consistent'|'secant'|'constant'

const text={
ru:{title:'Нелинейный МКЭ: остаток, касательная жёсткость и метод Ньютона',lead:'В гиперупругой задаче внутренние силы зависят от текущего состояния деформации, поэтому равновесие записывается как нелинейное уравнение R(u)=0. Решатель должен обновлять не только перемещения, но и касательную жёсткость.',key:'МЕТОД НЬЮТОНА РАБОТАЕТ ХОРОШО ТОЛЬКО С ПРАВИЛЬНОЙ КАСАТЕЛЬНОЙ',keyText:'Согласованная касательная — это производная остатка по неизвестным. Она обеспечивает характерную быструю сходимость Ньютона вблизи решения.',residual:'Остаток равновесия',residualText:'R(u)=f_int(u)−f_ext. Решение найдено, когда внутренние и внешние силы уравновешены и R≈0.',tangent:'Касательная жёсткость',tangentText:'K_T=∂R/∂u содержит материальный и геометрический вклады. На каждой итерации решается K_T Δu = −R.',mode:'тип касательной',consistent:'согласованная',secant:'секущая',constant:'постоянная',load:'нагрузка',nonlin:'нелинейность β',guess:'начальное приближение u₀',iteration:'итерация',resnorm:'|R|',u:'u',converged:'сошлось',notconverged:'не сошлось',sceneKicker:'ИТЕРАЦИИ НЬЮТОНА',sceneTitle:'сравни скорость сходимости при разных вариантах касательной жёсткости',checkpoint:'ВОПРОС ДЛЯ ПРОВЕРКИ',checkpointTitle:'Почему секущая или постоянная жёсткость обычно сходятся медленнее?',checkpointText:'Потому что они не равны локальной производной остатка. Направление и масштаб шага становятся менее точными, поэтому теряется квадратичная сходимость.',conclusion:'ВЫВОД',conclusionTitle:'Нелинейный МКЭ — это совместная работа кинематики, материала и решателя.',conclusionText:'Следующий шаг — разделить материальную и геометрическую части касательной жёсткости и понять, откуда появляется потеря устойчивости.',deepen:'Углубиться',deepenText:'В полной нелинейной постановке K_T = K_mat + K_geo. K_mat связан с производной конститутивного закона, а K_geo — с текущим напряжённым состоянием и геометрией.',research:'Исследовательское замечание',researchText:'Автоматическое дифференцирование удобно именно потому, что позволяет получать согласованный касательный оператор непосредственно из энергетического потенциала и уменьшать риск ошибок в ручном выводе.',warning:'ВАЖНО',warningTitle:'Сходимость решателя не гарантирует физическую корректность решения.',warningText:'Можно получить малый остаток для плохо поставленной модели, неадекватных граничных условий или нефизичных параметров. Численная сходимость — только один уровень проверки.',back:'← D07',interactive:'ИНТЕРАКТИВНО'},
en:{title:'Nonlinear FEM: residual, tangent stiffness, and Newton method',lead:'In a hyperelastic problem, internal forces depend on the current deformation state, so equilibrium becomes a nonlinear equation R(u)=0. The solver must update both displacements and tangent stiffness.',key:'NEWTON WORKS WELL ONLY WITH THE RIGHT TANGENT',keyText:'The consistent tangent is the derivative of the residual with respect to the unknowns. Near the solution it gives the characteristic fast Newton convergence.',residual:'Equilibrium residual',residualText:'R(u)=f_int(u)−f_ext. The solution is reached when internal and external forces balance and R≈0.',tangent:'Tangent stiffness',tangentText:'K_T=∂R/∂u contains material and geometric contributions. Each iteration solves K_T Δu = −R.',mode:'tangent type',consistent:'consistent',secant:'secant',constant:'constant',load:'load',nonlin:'nonlinearity β',guess:'initial guess u₀',iteration:'iteration',resnorm:'|R|',u:'u',converged:'converged',notconverged:'not converged',sceneKicker:'NEWTON ITERATIONS',sceneTitle:'compare convergence speed for different tangent choices',checkpoint:'CHECKPOINT',checkpointTitle:'Why are secant or constant stiffness usually slower?',checkpointText:'Because they are not the local derivative of the residual. Step direction and scale are less accurate, so quadratic convergence is lost.',conclusion:'CONCLUSION',conclusionTitle:'Nonlinear FEM couples kinematics, material response, and the solver.',conclusionText:'Next we separate material and geometric tangent contributions and connect them to instability.',deepen:'Go deeper',deepenText:'In a fully nonlinear formulation K_T = K_mat + K_geo. K_mat comes from the constitutive derivative, while K_geo depends on the current stress state and geometry.',research:'Research note',researchText:'Automatic differentiation is attractive because it can generate a consistent tangent directly from the energy potential and reduce errors in manual derivations.',warning:'IMPORTANT',warningTitle:'Solver convergence does not guarantee physical correctness.',warningText:'A small residual can still occur for a poorly posed model, inadequate boundary conditions, or nonphysical parameters. Numerical convergence is only one validation layer.',back:'← D07',interactive:'INTERACTIVE'}
} as const

function fmt(v:number,d=5){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

function solve(load:number,beta:number,u0:number,mode:TangentMode){
 const hist:{i:number,u:number,r:number}[]=[]
 let u=u0
 let prevU=u0-.08
 let prevR=prevU+beta*prevU*prevU*prevU-load
 for(let i=0;i<12;i++){
   const r=u+beta*u*u*u-load
   hist.push({i,u,r:Math.abs(r)})
   if(Math.abs(r)<1e-8) break
   let k=1+3*beta*u*u
   if(mode==='secant'){
     const den=u-prevU
     if(Math.abs(den)>1e-10) k=(r-prevR)/den
   }
   if(mode==='constant') k=1
   if(!Number.isFinite(k)||Math.abs(k)<1e-8) k=1
   prevU=u; prevR=r
   const du=-r/k
   u+=Math.max(-1.5,Math.min(1.5,du))
 }
 return hist
}

export function NonlinearFEMNewton({notation,language,onBack}:Props){
 const copy=text[language]
 const [mode,setMode]=useState<TangentMode>('consistent')
 const [load,setLoad]=useState(1.2)
 const [beta,setBeta]=useState(2.5)
 const [guess,setGuess]=useState(.15)

 const hist=useMemo(()=>solve(load,beta,guess,mode),[load,beta,guess,mode])
 const last=hist[hist.length-1]
 const converged=last.r<1e-6

 const formula=notation==='Python'
 ? 'du = solve(K_tangent(u), -R(u)); u += du'
 : notation==='Index'
 ? 'K_ab Δu_b = −R_a,   K_ab = ∂R_a/∂u_b'
 : 'K_T(u_n) Δu = −R(u_n),   u_{n+1}=u_n+Δu'

 const maxR=Math.max(...hist.map(h=>h.r),1e-8)
 const points=hist.map((h,i)=>{const x=10+i/Math.max(hist.length-1,1)*80;const y=51-Math.min(1,h.r/maxR)*36;return `${i?'L':'M'} ${x.toFixed(2)} ${y.toFixed(2)}`}).join(' ')

 return <section className="module-view module-view-stacked"><div className="lesson-copy">
 <div className="lesson-index">D08</div><h1>{copy.title}</h1><p className="lead">{copy.lead}</p>
 <div className="concept-card"><span>{copy.key}</span><strong>{copy.keyText}</strong></div>
 <div className="definition"><div className="definition-label">{copy.residual}</div><div className="formula">R(u)=f_int(u)−f_ext</div><p>{copy.residualText}</p></div>
 <div className="definition"><div className="definition-label">{copy.tangent}</div><div className="formula">{formula}</div><p>{copy.tangentText}</p></div>
 <div className="warning-card kinematics-warning"><span>{copy.warning}</span><strong>{copy.warningTitle}</strong><p>{copy.warningText}</p></div>
 <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote><DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>
 <ApplicationLinks language={language} items={[{ru:'Нелинейный МКЭ',en:'Nonlinear FEM'},{ru:'Гиперупругость',en:'Hyperelasticity'},{ru:'Автоматическое дифференцирование',en:'Automatic differentiation'},{ru:'Устойчивость конструкций',en:'Structural stability'}]}/>
 {onBack&&<button className="text-button" onClick={onBack}>{copy.back}</button>}
 </div><div className="scene-column"><div className="scene-card">
 <div className="scene-head"><div><span className="scene-kicker">{copy.sceneKicker}</span><h2>{copy.sceneTitle}</h2></div><div className="live-badge">{copy.interactive}</div></div>
 <div className="mini-toggle-row" style={{marginBottom:14}}>
 <button className={mode==='consistent'?'toggle active':'toggle'} onClick={()=>setMode('consistent')}>{copy.consistent}</button>
 <button className={mode==='secant'?'toggle active':'toggle'} onClick={()=>setMode('secant')}>{copy.secant}</button>
 <button className={mode==='constant'?'toggle active':'toggle'} onClick={()=>setMode('constant')}>{copy.constant}</button>
 </div>
 <svg className="balance-scene" viewBox="0 0 100 60"><rect x="5" y="5" width="90" height="50" rx="8" fill="#111318"/><line x1="9" y1="52" x2="94" y2="52" stroke="#69717C" strokeWidth=".6"/><line x1="9" y1="52" x2="9" y2="10" stroke="#69717C" strokeWidth=".6"/><path d={points} fill="none" stroke="#A9E3D2" strokeWidth="1.4"/><text x="11" y="13" fill="#F4F2EC" fontSize="2.3">{copy.resnorm}</text><text x="76" y="56" fill="#F4F2EC" fontSize="2.1">{copy.iteration} →</text></svg>
 <div className="control-stack">
 <label><span>{copy.load}<strong>{fmt(load,2)}</strong></span><input type="range" min=".2" max="3" step=".05" value={load} onChange={e=>setLoad(Number(e.target.value))}/></label>
 <label><span>{copy.nonlin}<strong>{fmt(beta,2)}</strong></span><input type="range" min=".2" max="6" step=".1" value={beta} onChange={e=>setBeta(Number(e.target.value))}/></label>
 <label><span>{copy.guess}<strong>{fmt(guess,2)}</strong></span><input type="range" min="-1" max="2" step=".05" value={guess} onChange={e=>setGuess(Number(e.target.value))}/></label>
 </div>
 <div className="transport-metrics"><div><span>{copy.iteration}</span><strong>{last.i}</strong></div><div><span>{copy.u}</span><strong>{fmt(last.u)}</strong></div><div><span>{copy.resnorm}</span><strong>{last.r.toExponential(2)}</strong></div></div>
 <div className="transport-metrics metrics-secondary"><div><span>{copy.mode}</span><strong>{mode==='consistent'?copy.consistent:mode==='secant'?copy.secant:copy.constant}</strong></div><div><span>{language==='ru'?'статус':'status'}</span><strong>{converged?copy.converged:copy.notconverged}</strong></div><div><span>R(u)</span><strong>{fmt(last.u+beta*last.u**3-load)}</strong></div></div>
 </div><div className="bottom-grid"><div className="prediction-card"><span>{copy.checkpoint}</span><strong>{copy.checkpointTitle}</strong><p>{copy.checkpointText}</p></div><div className="author-card"><span>{copy.conclusion}</span><strong>{copy.conclusionTitle}</strong><p>{copy.conclusionText}</p></div></div></div></section>
}