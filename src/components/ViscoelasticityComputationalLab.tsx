import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}
type Model='maxwell'|'sls'|'generalized'|'state'
type Protocol='relaxation'|'creep'|'cyclic'

const text={
ru:{
title:'Вычислительная лаборатория вязкоупругости',
lead:'Здесь собраны ключевые идеи всей главы: выбор модели, протокол нагружения, временной масштаб, диссипация, память и предельные режимы. Цель — не получить “красивую кривую”, а проверить, согласуется ли наблюдаемый отклик с физикой выбранной модели.',
key:'МОДЕЛЬ НУЖНО ПРОВЕРЯТЬ НЕ ОДНОЙ КРИВОЙ, А НАБОРОМ ФИЗИЧЕСКИХ ТЕСТОВ',
keyText:'Одна и та же параметризация должна выдерживать relaxation, creep, cyclic response, limits при t→0 и t→∞, а также проверку неотрицательной диссипации.',
models:'Модель материала',
modelsText:'В лаборатории доступны редуцированные варианты Maxwell, Standard Linear Solid, обобщённая модель Максвелла и зависимая от состояния relaxation. Это учебные аналоги, которые сохраняют основные механизмы памяти и диссипации.',
protocols:'Протоколы нагружения',
protocolsText:'Relaxation проверяет спад напряжения при фиксированной деформации, creep — рост деформации при фиксированном напряжении, cyclic protocol — фазовый сдвиг и площадь петли.',
checks:'Sanity checks',
checksText:'Проверяем монотонность релаксации, корректные пределы, отсутствие отрицательной диссипации в установившемся цикле и чувствительность к отношению внешнего и внутреннего временных масштабов.',
sceneKicker:'ИНТЕГРИРОВАННАЯ ЛАБОРАТОРИЯ ВЯЗКОУПРУГОСТИ',
sceneTitle:'выбери модель и протокол и проверь физические свойства отклика',
model:'модель',protocol:'протокол',maxwell:'Maxwell',sls:'SLS',generalized:'обобщённая модель Максвелла',state:'зависимая от состояния',
relaxation:'релаксация',creep:'ползучесть',cyclic:'циклическое нагружение',
tau:'τ',tau2:'τ₂',E0:'E₀',Einf:'E∞',amp:'амплитуда',omega:'ω',beta:'β',
memory:'индекс памяти',diss:'диссипация',limit:'проверка предела',mono:'монотонность',
pass:'OK',fail:'check',
warning:'ВАЖНО',
warningTitle:'Успех на одном протоколе не доказывает адекватность модели.',
warningText:'Параметры, отлично описывающие relaxation, могут плохо предсказывать cyclic response или creep. Поэтому полноценная валидация должна быть многопротокольной.',
question:'ИССЛЕДОВАТЕЛЬСКОЕ ЗАДАНИЕ',
questionTitle:'Найди параметры, при которых модель хорошо проходит relaxation, но заметно меняет cyclic диссипация.',
questionText:'Измени τ, ω и второй временной масштаб. Сформулируй, какой параметр отвечает за форму релаксации, а какой — за положение максимума диссипации по частоте.',
conclusion:'ВЫВОД',
conclusionTitle:'Вязкоупругость становится понятной, когда один материал проверяется через несколько независимых наблюдений.',
conclusionText:'Следующий модуль — итоговая самопроверка главы, где придётся самостоятельно выбирать модель, интерпретировать эксперимент и находить некорректные выводы.',
deepen:'Углубиться',
deepenText:'В реальном workflow лаборатория должна дополняться автоматизированными регрессионные тесты: единичный скачок деформации, единичный скачок напряжения, гармонический частотный проход, Δt-refinement и проверка дискретного баланса энергии.',
research:'Исследовательское замечание',
researchText:'Для nonlinear finite-strain моделей полезно разделять верификация и валидация. Verification отвечает на вопрос “правильно ли реализованы уравнения?”, валидация — “подходит ли эта модель конкретному материалу и эксперименту?”.',
back:'← E11',next:'E13 → итоговая самопроверка'
},
en:{
title:'Computational viscoelasticity laboratory',
lead:'This module combines the key ideas of the chapter: model choice, loading protocol, characteristic timescales, диссипация, memory, and limiting regimes. The goal is not a visually appealing curve but a response that is physically consistent with the chosen model.',
key:'A MODEL SHOULD BE TESTED WITH A SET OF PHYSICAL CHECKS, NOT ONE CURVE',
keyText:'A single parameter set should survive relaxation, creep, cyclic response, the t→0 and t→∞ limits, and a non-negative диссипация check.',
models:'Material model',
modelsText:'The lab includes reduced Maxwell, Standard Linear Solid, обобщённая модель Максвелла, and зависимая от состояния relaxation models. They are teaching analogues that preserve the central mechanisms of memory and диссипация.',
protocols:'Loading protocols',
protocolsText:'Relaxation probes stress decay at fixed strain, creep probes strain growth at fixed stress, and cyclic loading reveals phase lag and hysteretic диссипация.',
checks:'Sanity checks',
checksText:'We test monotone relaxation, correct limits, non-negative steady-cycle диссипация, and sensitivity to the ratio of external and internal timescales.',
sceneKicker:'ИНТЕГРИРОВАННАЯ ЛАБОРАТОРИЯ ВЯЗКОУПРУГОСТИ',
sceneTitle:'choose a model and protocol and test the physical response',
model:'model',protocol:'protocol',maxwell:'Maxwell',sls:'SLS',generalized:'обобщённая модель Максвелла',state:'зависимая от состояния',
relaxation:'релаксация',creep:'ползучесть',cyclic:'циклическое нагружение',
tau:'τ',tau2:'τ₂',E0:'E₀',Einf:'E∞',amp:'amplitude',omega:'ω',beta:'β',
memory:'индекс памяти',diss:'диссипация',limit:'проверка предела',mono:'монотонность',
pass:'OK',fail:'check',
warning:'IMPORTANT',
warningTitle:'Success on one protocol does not prove model adequacy.',
warningText:'Parameters that fit relaxation extremely well may predict cyclic response or creep poorly. Proper валидация should therefore use multiple protocols.',
question:'RESEARCH TASK',
questionTitle:'Find parameters that preserve relaxation quality but strongly change cyclic диссипация.',
questionText:'Vary τ, ω, and the second timescale. Identify which parameter controls the relaxation shape and which shifts the диссипация peak in frequency.',
conclusion:'CONCLUSION',
conclusionTitle:'Viscoelasticity becomes clearer when one material is tested through several independent observations.',
conclusionText:'Next comes the final self-check, where you will choose models, interpret experiments, and identify incorrect conclusions on your own.',
deepen:'Go deeper',
deepenText:'A production workflow should include automated регрессионные тесты: strain step, stress step, гармонический частотный проход, Δt refinement, and a discrete energy-balance check.',
research:'Research note',
researchText:'For nonlinear finite-strain models it is useful to separate верификация and валидация. Verification asks “are the equations implemented correctly?”, while валидация asks “is this model suitable for this material and experiment?”.',
back:'← E11',next:'E13 → final self-check'
}} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function ViscoelasticityComputationalLab({notation,language,onBack,onNext}:Props){
const c=text[language]
const [model,setModel]=useState<Model>('generalized')
const [protocol,setProtocol]=useState<Protocol>('cyclic')
const [tau,setTau]=useState(1)
const [tau2,setTau2]=useState(8)
const [E0,setE0]=useState(12)
const [Einf,setEinf]=useState(3)
const [amp,setAmp]=useState(.08)
const [omega,setOmega]=useState(1)
const [beta,setBeta]=useState(2)

const data=useMemo(()=>{
 const n=240
 const pts:{x:number;y:number;eps:number;sig:number}[]=[]
 let diss=0,mono=true,prev=Infinity
 let memory=0
 if(protocol==='relaxation'){
   for(let i=0;i<=n;i++){
     const t=5*Math.max(tau,tau2)*i/n
     let G=Einf+(E0-Einf)*Math.exp(-t/tau)
     if(model==='generalized') G=Einf+.65*(E0-Einf)*Math.exp(-t/tau)+.35*(E0-Einf)*Math.exp(-t/tau2)
     if(model==='maxwell') G=(E0-Einf)*Math.exp(-t/tau)
     if(model==='state') G=Einf+(E0-Einf)*Math.exp(-t/(tau*Math.exp(beta*amp)))
     const sig=amp*G
     if(sig>prev+1e-8) mono=false
     prev=sig
     pts.push({x:t,y:sig,eps:amp,sig})
   }
   memory=Math.abs(pts[Math.floor(n/4)].sig-pts[n].sig)/Math.max(1e-9,Math.abs(pts[0].sig))
 }else if(protocol==='creep'){
   for(let i=0;i<=n;i++){
     const t=5*Math.max(tau,tau2)*i/n
     let J=1/E0+(1/Einf-1/E0)*(1-Math.exp(-t/tau))
     if(model==='generalized') J=1/E0+(1/Einf-1/E0)*(1-(.65*Math.exp(-t/tau)+.35*Math.exp(-t/tau2)))
     if(model==='maxwell') J=1/E0+t/(E0*tau)
     if(model==='state') J=1/E0+(1/Einf-1/E0)*(1-Math.exp(-t/(tau*Math.exp(beta*amp))))
     const eps=amp*E0*J
     pts.push({x:t,y:eps,eps,sig:amp*E0})
   }
   memory=Math.abs(pts[n].eps-pts[Math.floor(n/4)].eps)/Math.max(1e-9,Math.abs(pts[n].eps))
 }else{
   let prevEps=0,prevSig=0
   for(let i=0;i<=n;i++){
     const a=2*Math.PI*i/n
     const eps=amp*Math.sin(a)
     const tauEff=model==='state'?tau*Math.exp(beta*Math.abs(eps)):tau
     const branch=(T:number)=>{
       const x=omega*T
       return {Ep:(E0-Einf)*x*x/(1+x*x),Epp:(E0-Einf)*x/(1+x*x)}
     }
     let Ep=Einf,Epp=0
     if(model==='maxwell'){
       const b=branch(tauEff); Ep=b.Ep; Epp=b.Epp
     }else if(model==='sls'||model==='state'){
       const b=branch(tauEff); Ep+=b.Ep; Epp+=b.Epp
     }else{
       const b1=branch(tau),b2=branch(tau2)
       Ep+=.65*b1.Ep+.35*b2.Ep
       Epp+=.65*b1.Epp+.35*b2.Epp
     }
     const sig=eps*Ep+amp*Math.cos(a)*Epp
     pts.push({x:eps,y:sig,eps,sig})
     if(i>0) diss+=.5*(sig+prevSig)*(eps-prevEps)
     prevEps=eps;prevSig=sig
   }
   diss=Math.abs(diss)
   memory=omega*tau
 }
 const ys=pts.map(p=>p.y),ymin=Math.min(...ys),ymax=Math.max(...ys)
 const limitOk=protocol==='relaxation'?Math.abs(pts[pts.length-1].y-(model==='maxwell'?0:amp*Einf))<0.08*Math.max(1,Math.abs(pts[0].y)):true
 return{pts,diss,memory,mono,limitOk,ymin,ymax}
},[model,protocol,tau,tau2,E0,Einf,amp,omega,beta])

const formula=notation==='Python'
?"response = material.simulate(protocol, params)"
:notation==='Index'
?"\mathcal M(\theta,\mathcal H_t)\rightarrow\{\sigma_{ij}(t),q_a(t)\}"
:notation==='Matrix'
?"𝓜(θ, history) → {σ(t), q(t), 𝒟(t)}"
:"material model + loading history → stress, state, диссипация"

const path=data.pts.map((p,i)=>{
 const x=9+82*i/Math.max(1,data.pts.length-1)
 const y=56-38*(p.y-data.ymin)/Math.max(1e-9,data.ymax-data.ymin)
 return `${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`
}).join(' ')
const loopPath=protocol==='cyclic'?data.pts.map((p,i)=>{
 const x=54+36*(p.eps+amp)/(2*amp)
 const maxSig=Math.max(...data.pts.map(q=>Math.abs(q.sig)),1e-9)
 const y=55-28*(p.sig/maxSig+1)/2
 return `${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`
}).join(' '):''

return <section className="module-view module-view-stacked">
<div className="lesson-copy">
<div className="lesson-index">E12</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.models}</div><div className="formula">{formula}</div><p>{c.modelsText}</p></div>
<div className="definition"><div className="definition-label">{c.protocols}</div><p>{c.protocolsText}</p></div>
<div className="definition"><div className="definition-label">{c.checks}</div><p>{c.checksText}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote>
<DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>
<ApplicationLinks language={language} items={[
{ru:'Верификация конститутивных моделей',en:'Constitutive-model верификация'},
{ru:'ДМА и реологические протоколы',en:'DMA and rheology workflows'},
{ru:'Тестирование материала в МКЭ',en:'Тестирование материала в МКЭ'},
{ru:'Биомеханика мягких тканей',en:'Soft-tissue biomechanics'}
]}/>
<div className="module-actions">{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{c.next}</button>}</div>
</div>

<div className="scene-column">
<div className="scene-card">
<div className="scene-head"><div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div></div>
<div className="mini-toggle-row" style={{marginBottom:10}}>
{(['maxwell','sls','generalized','state'] as Model[]).map(m=><button key={m} className={model===m?'toggle active':'toggle'} onClick={()=>setModel(m)}>{c[m]}</button>)}
</div>
<div className="mini-toggle-row" style={{marginBottom:14}}>
{(['relaxation','creep','cyclic'] as Protocol[]).map(p=><button key={p} className={protocol===p?'toggle active':'toggle'} onClick={()=>setProtocol(p)}>{c[p]}</button>)}
</div>

<svg className="balance-scene" viewBox="0 0 100 68" role="img">
<rect x="4" y="5" width="92" height="58" rx="9" fill="#111318"/>
<text x="8" y="11" fill="#F4F2EC" fontSize="2.5">{protocol==='relaxation'?'σ(t)':protocol==='creep'?'ε(t)':'отклик по циклу'}</text>
<line x1="9" y1="56" x2="48" y2="56" stroke="#69717C" strokeWidth=".5"/>
<line x1="9" y1="16" x2="9" y2="56" stroke="#69717C" strokeWidth=".5"/>
<path d={path} fill="none" stroke="#A9E3D2" strokeWidth="1.25"/>
{protocol==='cyclic'&&<>
<text x="55" y="11" fill="#F4F2EC" fontSize="2.5">σ–ε</text>
<line x1="54" y1="41" x2="90" y2="41" stroke="#69717C" strokeWidth=".5"/>
<line x1="72" y1="20" x2="72" y2="58" stroke="#69717C" strokeWidth=".5"/>
<path d={loopPath} fill="rgba(221,122,43,.12)" stroke="#DD7A2B" strokeWidth="1.15"/>
</>}
<text x="56" y="61" fill="#8C939D" fontSize="1.9">{protocol==='cyclic'?'loop area = диссипация':'same parameters · different protocol'}</text>
</svg>

<div className="control-stack">
<label><span>{c.tau}<strong>{fmt(tau,2)}</strong></span><input type="range" min=".1" max="5" step=".05" value={tau} onChange={e=>setTau(Number(e.target.value))}/></label>
{model==='generalized'&&<label><span>{c.tau2}<strong>{fmt(tau2,2)}</strong></span><input type="range" min=".3" max="20" step=".1" value={tau2} onChange={e=>setTau2(Number(e.target.value))}/></label>}
<label><span>{c.E0}<strong>{fmt(E0,1)}</strong></span><input type="range" min="4" max="20" step=".5" value={E0} onChange={e=>setE0(Number(e.target.value))}/></label>
<label><span>{c.Einf}<strong>{fmt(Einf,1)}</strong></span><input type="range" min=".5" max="8" step=".25" value={Einf} onChange={e=>setEinf(Number(e.target.value))}/></label>
<label><span>{c.amp}<strong>{fmt(amp,3)}</strong></span><input type="range" min=".02" max=".18" step=".005" value={amp} onChange={e=>setAmp(Number(e.target.value))}/></label>
{protocol==='cyclic'&&<label><span>{c.omega}<strong>{fmt(omega,2)}</strong></span><input type="range" min=".1" max="4" step=".05" value={omega} onChange={e=>setOmega(Number(e.target.value))}/></label>}
{model==='state'&&<label><span>{c.beta}<strong>{fmt(beta,2)}</strong></span><input type="range" min="0" max="5" step=".1" value={beta} onChange={e=>setBeta(Number(e.target.value))}/></label>}
</div>

<div className="transport-metrics">
<div><span>{c.memory}</span><strong>{fmt(data.memory)}</strong></div>
<div><span>{c.diss}</span><strong>{fmt(data.diss,5)}</strong></div>
<div><span>{c.limit}</span><strong>{data.limitOk?c.pass:c.fail}</strong></div>
<div><span>{c.mono}</span><strong>{protocol==='relaxation'?(data.mono?c.pass:c.fail):'—'}</strong></div>
</div>
</div>

<div className="bottom-grid">
<div className="prediction-card"><span>{c.question}</span><strong>{c.questionTitle}</strong><p>{c.questionText}</p></div>
<div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div>
</div>
</div>
</section>
}
