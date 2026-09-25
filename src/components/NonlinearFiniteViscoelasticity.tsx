import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}
type Mode='constant'|'state'

const text={
ru:{
title:'Нелинейная и конечно-деформационная вязкоупругость',
lead:'При больших деформациях недостаточно заменить малую деформацию на “большое ε” в линейной модели Максвелла. Нужно одновременно сохранить геометрически точную кинематику, объективность напряжений, положительную диссипацию и корректную эволюцию внутренних переменных.',
key:'ПАМЯТЬ ДОЛЖНА БЫТЬ СОГЛАСОВАНА С КОНЕЧНОЙ КИНЕМАТИКОЙ',
keyText:'В одной из распространённых постановок полную деформацию раскладывают как F=FₑFᵥ: упругая часть хранит энергию, а вязкая внутренняя часть эволюционирует во времени и создаёт диссипацию.',
split:'Мультипликативное разложение',
splitText:'Разложение F=FₑFᵥ является конечнодеформационным аналогом идеи “упругая + вязкая часть”, но работает на уровне отображений, а не аддитивных малых деформаций.',
state:'Состояние и внутренняя переменная',
stateText:'Конститутивная модель задаёт свободную энергию Ψ(Fₑ,...) и закон эволюции Fᵥ или эквивалентной внутренней переменной. Именно закон эволюции определяет память и скорость релаксации.',
dependent:'Зависимость времени релаксации от состояния',
dependentText:'В нелинейной модели τ уже не обязано быть постоянным: τ=τ(F,T,q,...). Поэтому один и тот же материал может релаксировать по-разному при разных амплитудах, температурах и структурных состояниях.',
sceneKicker:'НЕЛИНЕЙНАЯ ПАМЯТЬ',
sceneTitle:'Сравни постоянное τ и τ, зависящее от текущего растяжения',
mode:'закон релаксации',constant:'τ = постоянное',stateMode:'τ = τ(λ)',
amplitude:'амплитуда ln λ',omega:'частота ω',tau0:'базовое τ₀',beta:'чувствительность β',
tauMin:'минимальное τ',tauMax:'максимальное τ',diss:'площадь петли',peak:'максимум |σ|',
warning:'ВАЖНО',
warningTitle:'F=FₑFᵥ — не единственно возможная теория конечной вязкоупругости.',
warningText:'Существуют интегральные, внутренне-переменные и другие объективные формулировки. Конкретную модель выбирают по физике материала, диапазону деформаций, термодинамической согласованности и данным.',
question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
questionTitle:'Почему при τ=τ(λ) петля может стать несимметричной?',
questionText:'Потому что скорость внутренней релаксации на растяжении и разгружении становится различной: эволюция внутренней переменной зависит от текущего состояния, а не только от времени.',
conclusion:'ВЫВОД',
conclusionTitle:'Нелинейная вязкоупругость — это уже эволюционная теория состояния, а не набор постоянных E′, E″ и τ.',
conclusionText:'Следующий шаг — перейти к внутренним переменным и дискретному обновлению состояния, то есть к форме, пригодной для вычислительной реализации и МКЭ.',
deepen:'Углубиться',
deepenText:'Термодинамически согласованная модель строится так, чтобы диссипация оставалась неотрицательной. Обычно это связывает производную Ψ по внутренней переменной с её эволюционным законом и ограничивает допустимые формы вязкого потока.',
research:'Исследовательское замечание',
researchText:'Для мягких тканей, эластомеров и полимеров нелинейность может входить одновременно через гиперупругую энергию, анизотропию, зависимость вязкости от деформации, несколько временных масштабов и структурные внутренние переменные. Поэтому идентификация требует нескольких типов экспериментов.',
back:'← E08',next:'E10 → внутренние переменные'
},
en:{
title:'Nonlinear and finite-strain viscoelasticity',
lead:'At large deformation, it is not enough to insert a “large strain” into a linear Maxwell equation. The formulation must preserve finite-strain kinematics, objectivity, non-negative dissipation, and a consistent evolution law for internal variables.',
key:'MEMORY MUST BE CONSISTENT WITH FINITE KINEMATICS',
keyText:'In one common framework the total deformation is split as F=FₑFᵥ: the elastic part stores energy while the viscous internal part evolves in time and produces dissipation.',
split:'Multiplicative split',
splitText:'The split F=FₑFᵥ is a finite-strain analogue of elastic-plus-viscous decomposition, but it acts on mappings rather than additive infinitesimal strains.',
state:'State and internal variable',
stateText:'A constitutive model specifies a free energy Ψ(Fₑ,...) and an evolution law for Fᵥ or an equivalent internal variable. That evolution law defines memory and relaxation rate.',
dependent:'State-dependent relaxation time',
dependentText:'In a nonlinear model τ need not be constant: τ=τ(F,T,q,...). The same material may therefore relax differently at different amplitudes, temperatures, or structural states.',
sceneKicker:'NONLINEAR MEMORY',
sceneTitle:'Compare constant τ with a relaxation time that depends on current stretch',
mode:'relaxation law',constant:'τ = постоянное',stateMode:'τ = τ(λ)',
amplitude:'log-stretch amplitude',omega:'frequency ω',tau0:'base τ₀',beta:'sensitivity β',
tauMin:'минимальное τ',tauMax:'максимальное τ',diss:'loop area',peak:'максимум |σ|',
warning:'IMPORTANT',
warningTitle:'F=FₑFᵥ is not the only finite-viscoelastic framework.',
warningText:'Integral, internal-variable, and other objective formulations also exist. The model should be selected from material physics, strain range, thermodynamic consistency, and data.',
question:'CHECKPOINT',
questionTitle:'Why can τ=τ(λ) make the loop asymmetric?',
questionText:'Because the internal relaxation rate differs across the loading cycle: evolution depends on the current state rather than on time alone.',
conclusion:'CONCLUSION',
conclusionTitle:'Nonlinear viscoelasticity is an evolutionary state theory, not merely a set of constant E′, E″, and τ.',
conclusionText:'Next we move to internal variables and discrete state updates — the form needed for computational implementation and FEM.',
deepen:'Go deeper',
deepenText:'A thermodynamically consistent formulation keeps dissipation non-negative. This typically links the derivative of Ψ with respect to internal variables to their evolution law and restricts admissible viscous flow rules.',
research:'Research note',
researchText:'For soft tissues, elastomers, and polymers, nonlinearity may enter through hyperelastic energy, anisotropy, strain-dependent viscosity, multiple timescales, and structural internal variables. Parameter identification therefore usually needs several experiment types.',
back:'← E08',next:'E10 → internal variables'
}} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function NonlinearFiniteViscoelasticity({notation,language,onBack,onNext}:Props){
const c=text[language]
const [mode,setMode]=useState<Mode>('state')
const [amp,setAmp]=useState(.32)
const [omega,setOmega]=useState(1)
const [tau0,setTau0]=useState(1.2)
const [beta,setBeta]=useState(2.5)

const result=useMemo(()=>{
 const n=720,cycles=3,dt=cycles*2*Math.PI/omega/n
 let q=0
 const pts:{lam:number;sig:number;tau:number}[]=[]
 for(let i=0;i<=n;i++){
   const t=i*dt
   const e=amp*Math.sin(omega*t)
   const lam=Math.exp(e)
   const tau=mode==='constant'?tau0:tau0*Math.exp(beta*(lam-1))
   const target=7*e
   q += dt*(target-q)/Math.max(.03,tau)
   const seq=5*(lam-lam**-2)
   const sig=seq+q
   if(i>n*2/3) pts.push({lam,sig,tau})
 }
 const maxSig=Math.max(...pts.map(p=>Math.abs(p.sig)),1e-9)
 const minTau=Math.min(...pts.map(p=>p.tau))
 const maxTau=Math.max(...pts.map(p=>p.tau))
 let area=0
 for(let i=1;i<pts.length;i++) area+=.5*(pts[i].sig+pts[i-1].sig)*(Math.log(pts[i].lam)-Math.log(pts[i-1].lam))
 return{pts,maxSig,minTau,maxTau,area:Math.abs(area)}
},[mode,amp,omega,tau0,beta])

const formula=notation==='Python'
?"Fe = F @ inv(Fv);  Psi = Psi(Fe);  Fv_dot = flow(Fe, Fv)"
:notation==='Index'
?"F_{iI}=F^e_{ij}F^v_{jI},   Ψ=Ψ(F^e, q)"
:notation==='Matrix'
?"F = FₑFᵥ,   Ψ = Ψ(Fₑ,q),   Ḟᵥ = 𝒢(Fₑ,Fᵥ)"
:"F = FₑFᵥ,   Ψ = Ψ(Fₑ,q),   evolution: Ḟᵥ = 𝒢(Fₑ,Fᵥ)"

const lmin=Math.exp(-amp),lmax=Math.exp(amp)
const loopPath=result.pts.map((p,i)=>{
 const x=55+38*(p.lam-lmin)/(lmax-lmin)
 const y=58-35*(p.sig/result.maxSig+1)/2
 return `${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`
}).join(' ')

const history=result.pts.map((p,i)=>{
 const x=9+38*i/Math.max(1,result.pts.length-1)
 const norm=(Math.log(p.lam)+amp)/(2*amp)
 return `${i?'L':'M'}${x.toFixed(2)} ${(34-18*norm).toFixed(2)}`
}).join(' ')
const tauPath=result.pts.map((p,i)=>{
 const x=9+38*i/Math.max(1,result.pts.length-1)
 const norm=(p.tau-result.minTau)/Math.max(1e-9,result.maxTau-result.minTau)
 return `${i?'L':'M'}${x.toFixed(2)} ${(57-15*norm).toFixed(2)}`
}).join(' ')

return <section className="module-view module-view-stacked">
<div className="lesson-copy">
<div className="lesson-index">E09</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.split}</div><div className="formula">{formula}</div><p>{c.splitText}</p></div>
<div className="definition"><div className="definition-label">{c.state}</div><p>{c.stateText}</p></div>
<div className="definition"><div className="definition-label">{c.dependent}</div><div className="formula">τ = τ₀ exp[β(λ−1)]</div><p>{c.dependentText}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote>
<DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>
<ApplicationLinks language={language} items={[
{ru:'Мягкие биологические ткани',en:'Soft biological tissues'},
{ru:'Эластомеры и резина',en:'Elastomers and rubber'},
{ru:'Полимеры при больших деформациях',en:'Polymers at large strain'},
{ru:'Нелинейный МКЭ с внутренними переменными',en:'Nonlinear FEM with internal variables'}
]}/>
<div className="module-actions">{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{c.next}</button>}</div>
</div>

<div className="scene-column">
<div className="scene-card">
<div className="scene-head"><div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div></div>

<div className="mini-toggle-row" style={{marginBottom:14}}>
<button className={mode==='constant'?'toggle active':'toggle'} onClick={()=>setMode('constant')}>{c.constant}</button>
<button className={mode==='state'?'toggle active':'toggle'} onClick={()=>setMode('state')}>{c.stateMode}</button>
</div>

<svg className="balance-scene" viewBox="0 0 100 68" role="img">
<rect x="4" y="5" width="92" height="58" rx="9" fill="#111318"/>
<text x="8" y="11" fill="#F4F2EC" fontSize="2.5">1 · λ(t)</text>
<line x1="9" y1="34" x2="47" y2="34" stroke="#69717C" strokeWidth=".5"/>
<path d={history} fill="none" stroke="#A9E3D2" strokeWidth="1.2"/>

<text x="8" y="42" fill="#F4F2EC" fontSize="2.5">2 · τ(t)</text>
<line x1="9" y1="57" x2="47" y2="57" stroke="#69717C" strokeWidth=".5"/>
<path d={tauPath} fill="none" stroke="#2864FF" strokeWidth="1.2"/>
<text x="10" y="62" fill="#8C939D" fontSize="1.8">{mode==='constant'?'τ = const':'τ = τ(λ)'}</text>

<text x="55" y="11" fill="#F4F2EC" fontSize="2.5">3 · σ–lnλ</text>
<line x1="55" y1="40.5" x2="93" y2="40.5" stroke="#69717C" strokeWidth=".5"/>
<line x1="74" y1="17" x2="74" y2="58" stroke="#69717C" strokeWidth=".5"/>
<path d={loopPath} fill="none" stroke="#DD7A2B" strokeWidth="1.25"/>
<text x="57" y="17" fill="#DD7A2B" fontSize="1.9">{language==='ru'?'нелинейная петля':'nonlinear loop'}</text>
</svg>

<div className="control-stack">
<label><span>{c.amplitude}<strong>{fmt(amp,2)}</strong></span><input type="range" min=".05" max=".55" step=".01" value={amp} onChange={e=>setAmp(Number(e.target.value))}/></label>
<label><span>{c.omega}<strong>{fmt(omega,2)}</strong></span><input type="range" min=".2" max="3" step=".05" value={omega} onChange={e=>setOmega(Number(e.target.value))}/></label>
<label><span>{c.tau0}<strong>{fmt(tau0,2)}</strong></span><input type="range" min=".2" max="4" step=".05" value={tau0} onChange={e=>setTau0(Number(e.target.value))}/></label>
<label><span>{c.beta}<strong>{fmt(beta,2)}</strong></span><input type="range" min="0" max="5" step=".1" value={beta} onChange={e=>setBeta(Number(e.target.value))}/></label>
</div>

<div className="transport-metrics">
<div><span>{c.tauMin}</span><strong>{fmt(result.minTau)}</strong></div>
<div><span>{c.tauMax}</span><strong>{fmt(result.maxTau)}</strong></div>
<div><span>{c.diss}</span><strong>{fmt(result.area,4)}</strong></div>
<div><span>{c.peak}</span><strong>{fmt(result.maxSig)}</strong></div>
</div>
</div>

<div className="bottom-grid">
<div className="prediction-card"><span>{c.question}</span><strong>{c.questionTitle}</strong><p>{c.questionText}</p></div>
<div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div>
</div>
</div>
</section>
}
