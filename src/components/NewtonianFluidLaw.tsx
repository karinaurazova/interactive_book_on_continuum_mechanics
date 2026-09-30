import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}

const text={
ru:{
title:'Ньютоновская жидкость: связь напряжения со скоростью деформации',
lead:'Ньютоновская жидкость определяется линейной зависимостью вязкого напряжения от тензора скоростей деформации. Это не закон «напряжение–деформация», как в упругости, а закон «напряжение–скорость деформации».',
key:'В НЬЮТОНОВСКОЙ ЖИДКОСТИ ВЯЗКОЕ НАПРЯЖЕНИЕ ЛИНЕЙНО ПО D',
keyText:'Для несжимаемой жидкости τ=2μD. Для сжимаемой к нему добавляется изотропный вязкий вклад, пропорциональный ∇·v.',
incomp:'Несжимаемая форма',
incompText:'При ∇·v=0 тензор скоростей деформации имеет нулевой след, а девиаторное напряжение равно τ=2μD.',
comp:'Сжимаемая форма',
compText:'В общем изотропном ньютоновском случае τ=2μD+λ(∇·v)I. Коэффициент λ описывает объёмный вязкий отклик и не обязан удовлетворять гипотезе Стокса.',
diss:'Диссипация',
dissText:'Вязкая мощность на единицу объёма равна τ:D. При физически допустимых коэффициентах она должна быть неотрицательной.',
sceneKicker:'НЬЮТОНОВСКИЙ ЗАКОН',
sceneTitle:'изменяй скорость деформации и смотри, как меняется вязкое напряжение',
mu:'динамическая вязкость μ',lambda:'объёмный коэффициент λ',div:'дивергенция скорости ∇·v',d12:'сдвиговая скорость D₁₂',
tau12:'касательное напряжение τ₁₂',tauvol:'объёмный вклад',power:'вязкая мощность',mode:'режим',
incompressible:'несжимаемая',compressible:'сжимаемая',
warning:'ВАЖНО',
warningTitle:'Вязкость μ и давление p играют разные роли.',
warningText:'Давление относится к изотропной части полного напряжения, а μ управляет сопротивлением изменению формы. В несжимаемой постановке давление определяется из уравнений движения и ограничения ∇·v=0.',
question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
questionTitle:'Что произойдёт с τ₁₂, если удвоить μ при том же D₁₂?',
questionText:'Касательное напряжение удвоится, потому что для ньютоновской жидкости τ₁₂=2μD₁₂.',
conclusion:'ВЫВОД',
conclusionTitle:'Ньютоновский закон замыкает баланс импульса, связывая кинематику течения с напряжениями.',
conclusionText:'Следующий шаг — подставить этот закон в баланс импульса и получить уравнения Навье—Стокса.',
deepen:'Углубиться',
deepenText:'Для изотропной сжимаемой жидкости термодинамические ограничения накладываются на комбинации μ и λ. Часто удобно вводить объёмную вязкость ζ=λ+2μ/3.',
research:'Исследовательское замечание',
researchText:'У реальных жидкостей μ может зависеть от температуры, давления, концентрации или скорости деформации. Тогда жидкость уже выходит за рамки простейшей ньютоновской модели.',
back:'← F01',next:'F03 → баланс импульса и Навье—Стокс'
},
en:{
title:'Newtonian fluid: stress versus rate of deformation',
lead:'A Newtonian fluid is defined by a linear dependence of viscous stress on the rate-of-deformation tensor. This is not a stress–strain law as in elasticity, but a stress–deformation-rate law.',
key:'IN A NEWTONIAN FLUID, VISCOUS STRESS IS LINEAR IN D',
keyText:'For an incompressible fluid τ=2μD. For a compressible fluid an additional isotropic viscous term proportional to ∇·v appears.',
incomp:'Incompressible form',
incompText:'When ∇·v=0, the rate-of-deformation tensor has zero trace and the deviatoric stress is τ=2μD.',
comp:'Compressible form',
compText:'For a general isotropic Newtonian fluid, τ=2μD+λ(∇·v)I. The coefficient λ governs volumetric viscous response and need not satisfy the Stokes hypothesis.',
diss:'Dissipation',
dissText:'Viscous power per unit volume is τ:D. For physically admissible coefficients it must be non-negative.',
sceneKicker:'NEWTONIAN LAW',
sceneTitle:'change the deformation rate and observe the viscous stress response',
mu:'dynamic viscosity μ',lambda:'volumetric coefficient λ',div:'velocity divergence ∇·v',d12:'shear rate D₁₂',
tau12:'shear stress τ₁₂',tauvol:'volumetric contribution',power:'viscous power',mode:'mode',
incompressible:'incompressible',compressible:'compressible',
warning:'IMPORTANT',
warningTitle:'Viscosity μ and pressure p play different roles.',
warningText:'Pressure belongs to the isotropic part of total stress, while μ controls resistance to shape change. In incompressible flow, pressure is determined from the equations of motion together with ∇·v=0.',
question:'CHECKPOINT',
questionTitle:'What happens to τ₁₂ if μ is doubled at fixed D₁₂?',
questionText:'The shear stress doubles because τ₁₂=2μD₁₂ for a Newtonian fluid.',
conclusion:'CONCLUSION',
conclusionTitle:'The Newtonian law closes momentum balance by linking flow kinematics to stress.',
conclusionText:'Next we substitute this law into momentum balance and obtain the Navier–Stokes equations.',
deepen:'Go deeper',
deepenText:'For an isotropic compressible fluid, thermodynamic restrictions constrain combinations of μ and λ. It is often convenient to introduce the bulk viscosity ζ=λ+2μ/3.',
research:'Research note',
researchText:'In real fluids, μ may depend on temperature, pressure, concentration, or deformation rate. The fluid then lies outside the simplest Newtonian model.',
back:'← F01',next:'F03 → momentum balance and Navier–Stokes'
}} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function NewtonianFluidLaw({notation,language,onBack,onNext}:Props){
const c=text[language]
const [compressible,setCompressible]=useState(false)
const [mu,setMu]=useState(1.2)
const [lambda,setLambda]=useState(.5)
const [div,setDiv]=useState(.4)
const [d12,setD12]=useState(.7)

const data=useMemo(()=>{
 const divUse=compressible?div:0
 const tau12=2*mu*d12
 const tauVol=lambda*divUse
 const d11=divUse/2
 const d22=divUse/2
 const t11=2*mu*d11+tauVol
 const t22=2*mu*d22+tauVol
 const power=t11*d11+t22*d22+2*tau12*d12
 return{divUse,tau12,tauVol,t11,t22,power}
},[compressible,mu,lambda,div,d12])

const formula=notation==='Python'
? (compressible?"tau = 2*mu*D + lam*div_v*I":"tau = 2*mu*D")
:notation==='Index'
? (compressible?"\\tau_{ij}=2\\mu D_{ij}+\\lambda(\\nabla\\cdot v)\\delta_{ij}":"\\tau_{ij}=2\\mu D_{ij}")
:notation==='Matrix'
? (compressible?"τ = 2μD + λ(∇·v)I":"τ = 2μD")
: (compressible?"τ = 2μD + λ(∇·v)I":"τ = 2μD")

const bar=Math.max(-18,Math.min(18,data.tau12*3))
return <section className="module-view module-view-stacked">
<div className="lesson-copy">
<div className="lesson-index">F02</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.incomp}</div><div className="formula">τ = 2μD</div><p>{c.incompText}</p></div>
<div className="definition"><div className="definition-label">{c.comp}</div><div className="formula">{formula}</div><p>{c.compText}</p></div>
<div className="definition"><div className="definition-label">{c.diss}</div><div className="formula">Φ = τ:D ≥ 0</div><p>{c.dissText}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote>
<DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>
<ApplicationLinks language={language} items={[
{ru:'Вода и простые жидкости',en:'Water and simple liquids'},
{ru:'Газовая динамика',en:'Gas dynamics'},
{ru:'Гемодинамика как ньютоновское приближение',en:'Hemodynamics under a Newtonian approximation'},
{ru:'Течения в трубах и каналах',en:'Pipe and channel flows'}
]}/>
<div className="module-actions">{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{c.next}</button>}</div>
</div>

<div className="scene-column">
<div className="scene-card">
<div className="scene-head"><div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div></div>
<div className="mini-toggle-row" style={{marginBottom:14}}>
<button className={!compressible?'toggle active':'toggle'} onClick={()=>setCompressible(false)}>{c.incompressible}</button>
<button className={compressible?'toggle active':'toggle'} onClick={()=>setCompressible(true)}>{c.compressible}</button>
</div>

<svg className="balance-scene" viewBox="0 0 100 68" role="img">
<rect x="4" y="5" width="92" height="58" rx="9" fill="#111318"/>
<text x="9" y="12" fill="#F4F2EC" fontSize="2.4">{compressible?'τ = 2μD + λ(∇·v)I':'τ = 2μD'}</text>
<rect x="15" y="22" width="25" height="25" fill="rgba(40,100,255,.12)" stroke="#2864FF" strokeWidth="1"/>
<line x1="15" y1="27" x2={15+bar} y2="27" stroke="#DD7A2B" strokeWidth="1.3"/>
<line x1="40" y1="42" x2={40-bar} y2="42" stroke="#DD7A2B" strokeWidth="1.3"/>
<text x="13" y="53" fill="#DD7A2B" fontSize="2">{c.tau12}: {fmt(data.tau12,2)}</text>

<circle cx="72" cy="34" r={compressible?10+5*Math.max(-.8,Math.min(.8,data.divUse)):10} fill="rgba(169,227,210,.12)" stroke="#A9E3D2" strokeWidth="1.2"/>
<text x="60" y="53" fill="#A9E3D2" fontSize="2">{c.tauvol}: {fmt(data.tauVol,2)}</text>
<text x="57" y="59" fill="#F4F2EC" fontSize="2">∇·v = {fmt(data.divUse,2)}</text>
</svg>

<div className="control-stack">
<label><span>{c.mu}<strong>{fmt(mu,2)}</strong></span><input type="range" min=".1" max="4" step=".05" value={mu} onChange={e=>setMu(Number(e.target.value))}/></label>
{compressible&&<label><span>{c.lambda}<strong>{fmt(lambda,2)}</strong></span><input type="range" min="-2" max="4" step=".05" value={lambda} onChange={e=>setLambda(Number(e.target.value))}/></label>}
{compressible&&<label><span>{c.div}<strong>{fmt(div,2)}</strong></span><input type="range" min="-1" max="1" step=".02" value={div} onChange={e=>setDiv(Number(e.target.value))}/></label>}
<label><span>{c.d12}<strong>{fmt(d12,2)}</strong></span><input type="range" min="-1.5" max="1.5" step=".02" value={d12} onChange={e=>setD12(Number(e.target.value))}/></label>
</div>

<div className="transport-metrics">
<div><span>{c.tau12}</span><strong>{fmt(data.tau12)}</strong></div>
<div><span>{c.tauvol}</span><strong>{fmt(data.tauVol)}</strong></div>
<div><span>{c.power}</span><strong>{fmt(data.power)}</strong></div>
<div><span>{c.mode}</span><strong>{compressible?c.compressible:c.incompressible}</strong></div>
</div>
</div>

<div className="bottom-grid">
<div className="prediction-card"><span>{c.question}</span><strong>{c.questionTitle}</strong><p>{c.questionText}</p></div>
<div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div>
</div>
</div>
</section>
}
