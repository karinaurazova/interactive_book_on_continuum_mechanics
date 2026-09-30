import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}

const text={
ru:{
title:'Напряжение в жидкости: давление и девиаторная часть',
lead:'В жидкости полный тензор напряжений удобно разложить на изотропную часть, связанную с давлением, и девиаторную часть, связанную с вязким сопротивлением деформации. Такое разложение отделяет изменение объёма от изменения формы.',
key:'ДАВЛЕНИЕ ДЕЙСТВУЕТ ОДИНАКОВО ПО ВСЕМ НАПРАВЛЕНИЯМ, ДЕВИАТОРНАЯ ЧАСТЬ — НЕТ',
keyText:'Изотропное давление задаёт сферическую часть тензора напряжений, а девиаторная часть содержит касательные напряжения и различия нормальных напряжений.',
split:'Разложение тензора напряжений',
splitText:'Полный тензор напряжений записывается как σ=−pI+τ. Знак перед p зависит от принятого соглашения о знаках; здесь положительное давление соответствует сжатию.',
pressure:'Давление',
pressureText:'Часть −pI одинакова по всем направлениям и не создаёт касательных напряжений. В несжимаемой жидкости давление часто выступает как множитель, обеспечивающий условие ∇·v=0.',
deviator:'Девиаторная часть',
deviatorText:'Тензор τ описывает вязкий отклик на изменение формы. Для ньютоновской несжимаемой жидкости τ=2μD, где D — тензор скоростей деформации.',
sceneKicker:'ДАВЛЕНИЕ И ДЕВИАТОР',
sceneTitle:'раздели полный тензор напряжений на две физически разные части',
p:'давление p',mu:'вязкость μ',d11:'D₁₁',d12:'D₁₂',
normal:'нормальное напряжение',shear:'касательное напряжение',trace:'след τ',power:'вязкая мощность τ:D',
warning:'ВАЖНО',
warningTitle:'Давление и вязкое напряжение — не одно и то же.',
warningText:'Даже при большом давлении касательное вязкое напряжение может быть равно нулю. И наоборот, интенсивный сдвиг может создавать заметную девиаторную часть при умеренном давлении.',
question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
questionTitle:'Может ли давление само по себе создавать касательное напряжение?',
questionText:'Нет. Изотропная часть −pI содержит только одинаковые нормальные компоненты. Касательные напряжения возникают из девиаторной части τ.',
conclusion:'ВЫВОД',
conclusionTitle:'Разложение σ=−pI+τ позволяет отдельно интерпретировать объёмную и формоизменяющую части механического отклика жидкости.',
conclusionText:'Следующий шаг — связать τ с D и получить полный ньютоновский закон для сжимаемой и несжимаемой жидкости.',
deepen:'Углубиться',
deepenText:'Для сжимаемой ньютоновской жидкости обычно используют τ=2μD+λ(∇·v)I. При дополнительной гипотезе Стокса λ=−2μ/3, однако эта гипотеза не является универсальным законом природы.',
research:'Исследовательское замечание',
researchText:'В сложных жидкостях девиаторное напряжение может зависеть не только от текущего D, но и от структуры, истории деформации, концентрации, температуры и внутренних переменных.',
back:'← F00',next:'F02 → ньютоновская жидкость'
},
en:{
title:'Fluid stress: pressure and deviatoric part',
lead:'In a fluid, the total stress tensor is naturally decomposed into an isotropic pressure contribution and a deviatoric contribution associated with viscous resistance to deformation. This separates volume change from shape change.',
key:'PRESSURE ACTS EQUALLY IN ALL DIRECTIONS; THE DEVIATORIC PART DOES NOT',
keyText:'Isotropic pressure forms the spherical part of the stress tensor, while the deviatoric part contains shear stresses and normal-stress differences.',
split:'Stress decomposition',
splitText:'The total stress tensor is written as σ=−pI+τ. The sign in front of p depends on convention; here positive pressure corresponds to compression.',
pressure:'Pressure',
pressureText:'The term −pI is identical in every direction and creates no shear stress. In an incompressible fluid, pressure often acts as a multiplier enforcing ∇·v=0.',
deviator:'Deviatoric part',
deviatorText:'The tensor τ represents viscous resistance to shape change. For an incompressible Newtonian fluid, τ=2μD, where D is the rate-of-deformation tensor.',
sceneKicker:'PRESSURE AND DEVIATOR',
sceneTitle:'separate total stress into two physically different parts',
p:'pressure p',mu:'viscosity μ',d11:'D₁₁',d12:'D₁₂',
normal:'normal stress',shear:'shear stress',trace:'tr τ',power:'viscous power τ:D',
warning:'IMPORTANT',
warningTitle:'Pressure and viscous stress are not the same thing.',
warningText:'Even at high pressure, viscous shear stress may be zero. Conversely, strong shear can create a large deviatoric contribution at moderate pressure.',
question:'CHECKPOINT',
questionTitle:'Can pressure alone create shear stress?',
questionText:'No. The isotropic term −pI contains only equal normal components. Shear stresses arise from the deviatoric part τ.',
conclusion:'CONCLUSION',
conclusionTitle:'The split σ=−pI+τ separates volumetric and shape-changing parts of the fluid mechanical response.',
conclusionText:'Next we relate τ to D and obtain the full Newtonian constitutive law for compressible and incompressible fluids.',
deepen:'Go deeper',
deepenText:'For a compressible Newtonian fluid one commonly writes τ=2μD+λ(∇·v)I. With the additional Stokes hypothesis λ=−2μ/3, although this hypothesis is not a universal physical law.',
research:'Research note',
researchText:'In complex fluids, deviatoric stress may depend not only on the current D but also on structure, deformation history, concentration, temperature, and internal variables.',
back:'← F00',next:'F02 → Newtonian fluid'
}} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function FluidStressSplit({notation,language,onBack,onNext}:Props){
const c=text[language]
const [p,setP]=useState(2.5)
const [mu,setMu]=useState(1.2)
const [d11,setD11]=useState(.4)
const [d12,setD12]=useState(.7)

const data=useMemo(()=>{
 const d22=-d11
 const t11=2*mu*d11
 const t22=2*mu*d22
 const t12=2*mu*d12
 const s11=-p+t11
 const s22=-p+t22
 const power=t11*d11+t22*d22+2*t12*d12
 return{d22,t11,t22,t12,s11,s22,power,trace:t11+t22}
},[p,mu,d11,d12])

const formula=notation==='Python'
?"sigma = -p*I + tau; tau = 2*mu*D"
:notation==='Index'
?"\\sigma_{ij}=-p\\delta_{ij}+\\tau_{ij},   \\tau_{ij}=2\\mu D_{ij}"
:notation==='Matrix'
?"σ = −pI + τ,   τ = 2μD"
:"σ = −pI + τ,   τ = 2μD"

const scale=5
return <section className="module-view module-view-stacked">
<div className="lesson-copy">
<div className="lesson-index">F01</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.split}</div><div className="formula">{formula}</div><p>{c.splitText}</p></div>
<div className="definition"><div className="definition-label">{c.pressure}</div><p>{c.pressureText}</p></div>
<div className="definition"><div className="definition-label">{c.deviator}</div><p>{c.deviatorText}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote>
<DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>
<ApplicationLinks language={language} items={[
{ru:'Гидростатика',en:'Hydrostatics'},
{ru:'Течения вязкой жидкости',en:'Viscous flows'},
{ru:'Гемодинамика',en:'Hemodynamics'},
{ru:'Реология сложных жидкостей',en:'Complex-fluid rheology'}
]}/>
<div className="module-actions">{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{c.next}</button>}</div>
</div>

<div className="scene-column">
<div className="scene-card">
<div className="scene-head"><div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div></div>

<svg className="balance-scene" viewBox="0 0 100 68" role="img">
<rect x="4" y="5" width="92" height="58" rx="9" fill="#111318"/>
<text x="10" y="12" fill="#F4F2EC" fontSize="2.4">σ = −pI + τ</text>

<rect x="14" y="22" width="22" height="22" fill="rgba(169,227,210,.10)" stroke="#A9E3D2" strokeWidth="1"/>
<line x1="14" y1="25" x2={14-scale*Math.min(2,p)} y2="25" stroke="#A9E3D2" strokeWidth="1"/>
<line x1="36" y1="25" x2={36+scale*Math.min(2,p)} y2="25" stroke="#A9E3D2" strokeWidth="1"/>
<line x1="17" y1="22" x2="17" y2={22-scale*Math.min(2,p)} stroke="#A9E3D2" strokeWidth="1"/>
<line x1="17" y1="44" x2="17" y2={44+scale*Math.min(2,p)} stroke="#A9E3D2" strokeWidth="1"/>
<text x="14" y="50" fill="#A9E3D2" fontSize="2">{language==='ru'?'давление':'pressure'}</text>

<rect x="64" y="22" width="22" height="22" fill="rgba(40,100,255,.10)" stroke="#2864FF" strokeWidth="1"/>
<line x1="64" y1="27" x2={64+scale*d12} y2="27" stroke="#DD7A2B" strokeWidth="1.2"/>
<line x1="86" y1="39" x2={86-scale*d12} y2="39" stroke="#DD7A2B" strokeWidth="1.2"/>
<line x1="69" y1="22" x2="69" y2={22-scale*d11} stroke="#2864FF" strokeWidth="1.2"/>
<line x1="81" y1="44" x2="81" y2={44-scale*data.d22} stroke="#2864FF" strokeWidth="1.2"/>
<text x="64" y="50" fill="#2864FF" fontSize="2">{language==='ru'?'девиатор':'deviator'}</text>

<text x="12" y="59" fill="#F4F2EC" fontSize="2">σ₁₁ = {fmt(data.s11,2)}</text>
<text x="40" y="59" fill="#F4F2EC" fontSize="2">σ₂₂ = {fmt(data.s22,2)}</text>
<text x="68" y="59" fill="#DD7A2B" fontSize="2">σ₁₂ = {fmt(data.t12,2)}</text>
</svg>

<div className="control-stack">
<label><span>{c.p}<strong>{fmt(p,2)}</strong></span><input type="range" min="0" max="8" step=".1" value={p} onChange={e=>setP(Number(e.target.value))}/></label>
<label><span>{c.mu}<strong>{fmt(mu,2)}</strong></span><input type="range" min=".1" max="4" step=".05" value={mu} onChange={e=>setMu(Number(e.target.value))}/></label>
<label><span>{c.d11}<strong>{fmt(d11,2)}</strong></span><input type="range" min="-1" max="1" step=".02" value={d11} onChange={e=>setD11(Number(e.target.value))}/></label>
<label><span>{c.d12}<strong>{fmt(d12,2)}</strong></span><input type="range" min="-1" max="1" step=".02" value={d12} onChange={e=>setD12(Number(e.target.value))}/></label>
</div>

<div className="transport-metrics">
<div><span>{c.normal}</span><strong>{fmt(data.s11)}</strong></div>
<div><span>{c.shear}</span><strong>{fmt(data.t12)}</strong></div>
<div><span>{c.trace}</span><strong>{fmt(data.trace)}</strong></div>
<div><span>{c.power}</span><strong>{fmt(data.power)}</strong></div>
</div>
</div>

<div className="bottom-grid">
<div className="prediction-card"><span>{c.question}</span><strong>{c.questionTitle}</strong><p>{c.questionText}</p></div>
<div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div>
</div>
</div>
</section>
}
