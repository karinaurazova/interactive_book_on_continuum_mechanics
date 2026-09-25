import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}
type Scheme='explicit'|'implicit'

const text={
ru:{
title:'Внутренние переменные и вычислительное обновление состояния',
lead:'В вычислительной вязкоупругости материал в каждой интеграционной точке хранит собственное внутреннее состояние. На шаге времени известны qₙ и деформация, а задача конститутивного алгоритма — получить qₙ₊₁, напряжение и касательную жёсткость согласованно с выбранным законом эволюции.',
key:'КОНСТИТУТИВНАЯ МОДЕЛЬ В МКЭ — ЭТО ЛОКАЛЬНЫЙ РЕШАТЕЛЬ СОСТОЯНИЯ',
keyText:'Глобальный решатель МКЭ передаёт в материальную точку новую деформацию; локальное обновление состояния возвращает напряжение, обновлённые внутренние переменные и алгоритмическую касательную.',
update:'Дискретное обновление',
updateText:'Для простой внутренней переменной q с законом q̇=(g(ε)−q)/τ явная схема использует правую часть в момент n, а неявная схема требует решить нелинейное или линейное локальное уравнение на qₙ₊₁.',
residual:'Локальный остаток и метод Ньютона',
residualText:'Неявное обновление удобно записывать как R(qₙ₊₁)=0. Если R нелинеен, выполняются локальные итерации Ньютона до сходимости. Это происходит независимо в каждой интеграционной точке.',
tangent:'Алгоритмическая касательная',
tangentText:'После локального обновления нужен производный отклик dσₙ₊₁/dεₙ₊₁. Именно эта алгоритмическая касательная входит в глобальный метод Ньютона в МКЭ и определяет его скорость сходимости.',
sceneKicker:'ЛОКАЛЬНЫЙ РЕШАТЕЛЬ СОСТОЯНИЯ',
sceneTitle:'Сравни явное и неявное обновление на одном шаге времени',
scheme:'схема',explicit:'явная',implicit:'неявная',
dt:'шаг Δt',tau:'время τ',epsn:'εₙ',eps1:'εₙ₊₁',qn:'qₙ',alpha:'нелинейность α',
q1:'qₙ₊₁',sigma:'σₙ₊₁',res:'|R|',iters:'итерации',tangentValue:'dσ/dε',
warning:'ВАЖНО',
warningTitle:'Устойчивость локального обновления и сходимость глобального метода Ньютона — разные вещи.',
warningText:'Неявная схема может быть устойчивой по времени, но плохая или несогласованная касательная всё равно замедлит глобальные итерации МКЭ.',
question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
questionTitle:'Почему внутренние переменные нельзя обновлять только после завершения глобального шага?',
questionText:'Потому что напряжение и касательная на каждой глобальной итерации зависят от согласованного текущего состояния материала. Отложенное обновление нарушает локальную согласованность конститутивного отклика.',
conclusion:'ВЫВОД',
conclusionTitle:'Материал в МКЭ — это отображение состояния: (εₙ₊₁,qₙ,Δt) → (σₙ₊₁,qₙ₊₁,C_alg).',
conclusionText:'Следующий шаг — перейти к идентификации параметров: какие эксперименты действительно позволяют восстановить τ, модули и нелинейные параметры без неидентифицируемости.',
deepen:'Углубиться',
deepenText:'В реальной конечнодеформационной модели вместо скаляра q хранится тензорная внутренняя переменная, например Fᵥ, Cᵥ или несколько состояний релаксационных ветвей. Локальный остаток становится тензорным, но структура алгоритма остаётся той же: пробное состояние → локальное решение → напряжение → согласованная касательная.',
research:'Исследовательское замечание',
researchText:'Для рабочего кода полезно отделять конститутивное ядро от глобального решателя МКЭ. Тогда одно и то же обновление состояния материала можно тестировать в одноточечных задачах, подключать к разным МКЭ-фреймворкам и проверять методами конечных разностей и автоматического дифференцирования.',
back:'← E09',next:'E11 → идентификация параметров'
},
en:{
title:'Internal variables and computational state update',
lead:'In computational viscoelasticity, every integration point stores its own internal state. At a time step, qₙ and the deformation history are known; the constitutive algorithm must return qₙ₊₁, stress, and a tangent consistently with the evolution law.',
key:'A CONSTITUTIVE MODEL IN FEM IS A LOCAL STATE SOLVER',
keyText:'The global FEM solver supplies a new deformation to a material point; the local обновление состояния returns stress, updated internal variables, and the algorithmic tangent.',
update:'Discrete update',
updateText:'For a simple internal variable q with q̇=(g(ε)−q)/τ, an explicit scheme evaluates the right-hand side at n, while an implicit scheme solves a local equation for qₙ₊₁.',
residual:'Local residual and Newton',
residualText:'The implicit update can be written as R(qₙ₊₁)=0. If R is nonlinear, local Newton iterations are performed until convergence independently at each integration point.',
tangent:'Algorithmic tangent',
tangentText:'After the локальное обновление we need dσₙ₊₁/dεₙ₊₁. This algorithmic tangent enters the global FEM Newton method and strongly affects convergence.',
sceneKicker:'ЛОКАЛЬНЫЙ РЕШАТЕЛЬ СОСТОЯНИЯ',
sceneTitle:'Compare explicit and implicit updates over one time step',
scheme:'scheme',explicit:'явная',implicit:'неявная',
dt:'time step Δt',tau:'time τ',epsn:'εₙ',eps1:'εₙ₊₁',qn:'qₙ',alpha:'nonlinearity α',
q1:'qₙ₊₁',sigma:'σₙ₊₁',res:'|R|',iters:'iterations',tangentValue:'dσ/dε',
warning:'IMPORTANT',
warningTitle:'Time-integration stability and global Newton convergence are different issues.',
warningText:'An implicit update may be stable in time, but an inconsistent or poor tangent can still make the global FEM iterations converge slowly.',
question:'CHECKPOINT',
questionTitle:'Why not update internal variables only after the global step converges?',
questionText:'Because stress and tangent at each global iteration depend on a consistent current material state. Delayed updates break the local consistency of the конститутивного отклика.',
conclusion:'CONCLUSION',
conclusionTitle:'A FEM material is a state map: (εₙ₊₁,qₙ,Δt) → (σₙ₊₁,qₙ₊₁,C_alg).',
conclusionText:'Next we turn to parameter identification: which experiments can actually recover relaxation times, moduli, and nonlinear parameters without practical non-identifiability.',
deepen:'Go deeper',
deepenText:'In a finite-strain model the scalar q is replaced by tensor-valued variables such as Fᵥ, Cᵥ, or several branch states. The local residual becomes tensorial, but the algorithmic structure is unchanged: пробное состояние state → local solve → stress → согласованная касательная.',
research:'Research note',
researchText:'For production code it is useful to separate the constitutive kernel from the global FEM solver. The same material update can then be benchmarked in single-point tests, reused across FE frameworks, and verified with finite-difference or automatic-differentiation checks.',
back:'← E09',next:'E11 → parameter identification'
}} as const

function fmt(v:number,d=4){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function InternalVariableUpdate({notation,language,onBack,onNext}:Props){
const c=text[language]
const [scheme,setScheme]=useState<Scheme>('implicit')
const [dt,setDt]=useState(.35)
const [tau,setTau]=useState(1)
const [epsn,setEpsn]=useState(.05)
const [eps1,setEps1]=useState(.28)
const [qn,setQn]=useState(.12)
const [alpha,setAlpha]=useState(2.5)

const data=useMemo(()=>{
 const g=(e:number)=>6*e+alpha*e*e*e
 const dg=(e:number)=>6+3*alpha*e*e
 const stress=(e:number,q:number)=>8*e+q
 let q1=qn,iters=0,res=0
 if(scheme==='explicit'){
   q1=qn+dt*(g(epsn)-qn)/tau
   res=q1-qn-dt*(g(eps1)-q1)/tau
 }else{
   let x=qn
   for(let k=0;k<12;k++){
     const R=x-qn-dt*(g(eps1)-x)/tau
     const dR=1+dt/tau
     x-=R/dR
     iters=k+1
     if(Math.abs(R)<1e-10) break
   }
   q1=x
   res=q1-qn-dt*(g(eps1)-q1)/tau
 }
 const sigma=stress(eps1,q1)
 const dqdeps=scheme==='implicit'?(dt/tau*dg(eps1))/(1+dt/tau):0
 const tangent=8+dqdeps
 const exact=(qn+(dt/tau)*g(eps1))/(1+dt/tau)
 const err=Math.abs(q1-exact)
 return{q1,sigma,res:Math.abs(res),iters,tangent,err,exact,g0:g(epsn),g1:g(eps1)}
},[scheme,dt,tau,epsn,eps1,qn,alpha])

const formula=notation==='Python'
?"R = q1 - qn - dt*(g(eps1)-q1)/tau;  dq = -R/dR_dq"
:notation==='Index'
?"R_a(q_{n+1})=q_{a,n+1}-q_{a,n}-Δt\,f_a(ε_{n+1},q_{n+1})=0"
:notation==='Matrix'
?"R(qₙ₊₁)=qₙ₊₁−qₙ−Δt f(εₙ₊₁,qₙ₊₁)=0"
:"R(qₙ₊₁) = qₙ₊₁ − qₙ − Δt f(εₙ₊₁,qₙ₊₁) = 0"

const x0=12,x1=88
const qMin=Math.min(qn,data.q1,data.exact,data.g0,data.g1)-.2
const qMax=Math.max(qn,data.q1,data.exact,data.g0,data.g1)+.2
const py=(q:number)=>54-30*(q-qMin)/Math.max(.1,qMax-qMin)
const explicitTrial=qn+dt*(data.g0-qn)/tau

return <section className="module-view module-view-stacked">
<div className="lesson-copy">
<div className="lesson-index">E10</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.update}</div><div className="formula">{formula}</div><p>{c.updateText}</p></div>
<div className="definition"><div className="definition-label">{c.residual}</div><p>{c.residualText}</p></div>
<div className="definition"><div className="definition-label">{c.tangent}</div><div className="formula">C<sub>alg</sub> = dσₙ₊₁ / dεₙ₊₁</div><p>{c.tangentText}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote>
<DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>
<ApplicationLinks language={language} items={[
{ru:'Пользовательские материалы UMAT/VUMAT',en:'UMAT/VUMAT user materials'},
{ru:'FEniCSx и собственные конститутивные ядра',en:'FEniCSx and custom constitutive kernels'},
{ru:'Нелинейный МКЭ мягких тканей',en:'Nonlinear FEM of soft tissues'},
{ru:'Автоматическое дифференцирование материалов',en:'Automatic differentiation of material models'}
]}/>
<div className="module-actions">{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{c.next}</button>}</div>
</div>

<div className="scene-column">
<div className="scene-card">
<div className="scene-head"><div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div></div>
<div className="mini-toggle-row" style={{marginBottom:14}}>
<button className={scheme==='explicit'?'toggle active':'toggle'} onClick={()=>setScheme('explicit')}>{c.explicit}</button>
<button className={scheme==='implicit'?'toggle active':'toggle'} onClick={()=>setScheme('implicit')}>{c.implicit}</button>
</div>

<svg className="balance-scene" viewBox="0 0 100 68" role="img">
<rect x="4" y="5" width="92" height="58" rx="9" fill="#111318"/>
<text x="8" y="12" fill="#F4F2EC" fontSize="2.5">state update: qₙ → qₙ₊₁</text>
<line x1={x0} y1="54" x2={x1} y2="54" stroke="#69717C" strokeWidth=".5"/>
<line x1="20" y1="18" x2="20" y2="58" stroke="#69717C" strokeWidth=".5"/>
<line x1="80" y1="18" x2="80" y2="58" stroke="#69717C" strokeWidth=".5" strokeDasharray="2 2"/>
<circle cx="20" cy={py(qn)} r="2" fill="#A9E3D2"/>
<text x="10" y={py(qn)-3} fill="#A9E3D2" fontSize="2">qₙ</text>
<circle cx="80" cy={py(data.q1)} r="2.2" fill="#2864FF"/>
<text x="82" y={py(data.q1)-1} fill="#2864FF" fontSize="2">qₙ₊₁</text>
<circle cx="80" cy={py(data.exact)} r="1.5" fill="none" stroke="#F4F2EC" strokeWidth=".7"/>
<path d={"M20 "+py(qn)+" C38 "+py(qn)+", 58 "+py(data.q1)+", 80 "+py(data.q1)} fill="none" stroke={scheme==='implicit'?'#2864FF':'#DD7A2B'} strokeWidth="1.2"/>
{scheme==='explicit'&&<><circle cx="50" cy={py(explicitTrial)} r="1.3" fill="#DD7A2B"/><text x="43" y={py(explicitTrial)-2} fill="#DD7A2B" fontSize="1.8">пробное состояние</text></>}
<text x="10" y="62" fill="#8C939D" fontSize="1.8">n</text><text x="78" y="62" fill="#8C939D" fontSize="1.8">n+1</text>

<text x="8" y="17" fill="#F4F2EC" fontSize="2.1">{scheme==='implicit'?'R(qₙ₊₁)=0':'forward step'}</text>
<text x="55" y="17" fill="#A9E3D2" fontSize="2.0">Δt/τ = {fmt(dt/tau,2)}</text>
<text x="55" y="21" fill="#F4F2EC" fontSize="2.0">error = {fmt(data.err,5)}</text>
</svg>

<div className="control-stack">
<label><span>{c.dt}<strong>{fmt(dt,2)}</strong></span><input type="range" min=".02" max="1.5" step=".01" value={dt} onChange={e=>setDt(Number(e.target.value))}/></label>
<label><span>{c.tau}<strong>{fmt(tau,2)}</strong></span><input type="range" min=".1" max="3" step=".05" value={tau} onChange={e=>setTau(Number(e.target.value))}/></label>
<label><span>{c.epsn}<strong>{fmt(epsn,2)}</strong></span><input type="range" min="-.4" max=".4" step=".01" value={epsn} onChange={e=>setEpsn(Number(e.target.value))}/></label>
<label><span>{c.eps1}<strong>{fmt(eps1,2)}</strong></span><input type="range" min="-.4" max=".6" step=".01" value={eps1} onChange={e=>setEps1(Number(e.target.value))}/></label>
<label><span>{c.qn}<strong>{fmt(qn,2)}</strong></span><input type="range" min="-2" max="2" step=".02" value={qn} onChange={e=>setQn(Number(e.target.value))}/></label>
<label><span>{c.alpha}<strong>{fmt(alpha,2)}</strong></span><input type="range" min="0" max="8" step=".1" value={alpha} onChange={e=>setAlpha(Number(e.target.value))}/></label>
</div>

<div className="transport-metrics">
<div><span>{c.q1}</span><strong>{fmt(data.q1)}</strong></div>
<div><span>{c.sigma}</span><strong>{fmt(data.sigma)}</strong></div>
<div><span>{c.res}</span><strong>{fmt(data.res,6)}</strong></div>
<div><span>{c.iters}</span><strong>{scheme==='implicit'?data.iters:1}</strong></div>
<div><span>{c.tangentValue}</span><strong>{fmt(data.tangent)}</strong></div>
</div>
</div>

<div className="bottom-grid">
<div className="prediction-card"><span>{c.question}</span><strong>{c.questionTitle}</strong><p>{c.questionText}</p></div>
<div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div>
</div>
</div>
</section>
}
