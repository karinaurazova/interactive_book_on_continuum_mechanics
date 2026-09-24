import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}

const text={
ru:{
title:'Частотная область: модули хранения и потерь',
lead:'Циклический эксперимент можно описывать не только во времени. Если повторять гармоническое нагружение на разных частотах, вязкоупругий материал показывает частотно-зависимую жёсткость и диссипацию. Комплексный модуль E*(ω)=E′(ω)+iE″(ω) позволяет разделить упруго запасаемую и рассеиваемую части отклика.',
key:'ЧАСТОТА СРАВНИВАЕТСЯ С ВНУТРЕННИМ ВРЕМЕНЕМ МАТЕРИАЛА',
keyText:'Безразмерный параметр ωτ показывает, успевает ли релаксационный механизм перестроиться за один цикл: ωτ≪1 — квазирелаксированный режим, ωτ≈1 — максимальная конкуренция, ωτ≫1 — «замороженный» быстрый отклик.',
complex:'Комплексный модуль',
complexText:'Для гармонической деформации ε(t)=ε₀sinωt напряжение можно представить через E′ и E″. Модуль хранения E′ характеризует часть энергии, возвращаемую материалом, а модуль потерь E″ — диссипативную часть.',
sls:'Частотный отклик одной релаксационной ветви',
slsText:'Для стандартной линейной модели с равновесным модулем E∞, релаксирующим вкладом ΔE и временем τ: E′=E∞+ΔE(ωτ)²/[1+(ωτ)²], E″=ΔE(ωτ)/[1+(ωτ)²].',
limits:'Низкие и высокие частоты',
limitsText:'При ωτ≪1 ветвь успевает релаксировать и E′≈E∞. При ωτ≫1 релаксация не успевает произойти, поэтому E′≈E∞+ΔE. Модуль потерь имеет максимум около ωτ=1.',
sceneKicker:'ЧАСТОТНЫЙ ЭКСПЕРИМЕНТ',
sceneTitle:'Одна модель — три связанных представления: E′(ω), E″(ω), режим ωτ и петля σ–ε',
frequency:'частота ω',tau:'время релаксации τ',einf:'E∞',de:'ΔE',
storage:'E′(ω)',loss:'E″(ω)',lossFactor:'tan δ',phase:'δ',omegaTau:'ωτ',
warning:'ВАЖНО',
warningTitle:'Пик E″ не означает максимальную жёсткость.',
warningText:'Максимум потерь возникает в переходной области ωτ≈1, где релаксационный процесс наиболее сильно запаздывает относительно нагружения. При этом E′ продолжает переход между низко- и высокочастотными пределами.',
question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
questionTitle:'Где ожидать наибольшую диссипацию для одной релаксационной ветви?',
questionText:'Около ωτ=1. Именно тогда период внешнего нагружения сопоставим с внутренним временем релаксации материала.',
conclusion:'ВЫВОД',
conclusionTitle:'Частотная область превращает «память» материала в измеряемый спектр временных масштабов.',
conclusionText:'Следующий шаг — перейти к нелинейной и конечно-деформационной вязкоупругости, где сами модули и времена релаксации могут зависеть от состояния и амплитуды деформации.',
deepen:'Углубиться',
deepenText:'Для обобщённой модели Максвелла вклады отдельных ветвей суммируются: E′(ω)=E∞+Σᵢ Eᵢ(ωτᵢ)²/[1+(ωτᵢ)²], E″(ω)=Σᵢ Eᵢ(ωτᵢ)/[1+(ωτᵢ)²]. Поэтому широкое распределение τᵢ формирует широкий частотный диапазон диссипации.',
research:'Исследовательское замечание',
researchText:'Экспериментальные E′ и E″ обычно получают в динамическом механическом анализе или осцилляторных реологических тестах. Для корректной идентификации спектра релаксации частотный диапазон должен перекрывать интересующие внутренние времена материала.',
back:'← E07',next:'E09 → нелинейная вязкоупругость'
},
en:{
title:'Frequency domain: storage and loss moduli',
lead:'A cyclic experiment can be described in the frequency domain as well as in time. Repeating harmonic loading at different frequencies reveals frequency-dependent stiffness and dissipation. The complex modulus E*(ω)=E′(ω)+iE″(ω) separates the stored and dissipated parts of the response.',
key:'FREQUENCY IS COMPARED WITH THE MATERIAL INTERNAL TIMESCALE',
keyText:'The dimensionless quantity ωτ indicates whether a relaxation mechanism can evolve during a cycle: ωτ≪1 is quasi-relaxed, ωτ≈1 is the transition regime, and ωτ≫1 is a fast, nearly frozen response.',
complex:'Complex modulus',
complexText:'For harmonic strain ε(t)=ε₀sinωt, stress can be written in terms of E′ and E″. The storage modulus E′ measures the recoverable contribution and the loss modulus E″ measures the dissipative contribution.',
sls:'Frequency response of one relaxation branch',
slsText:'For a standard linear solid with equilibrium modulus E∞, relaxing increment ΔE, and relaxation time τ: E′=E∞+ΔE(ωτ)²/[1+(ωτ)²], E″=ΔE(ωτ)/[1+(ωτ)²].',
limits:'Low and high frequencies',
limitsText:'For ωτ≪1 the branch has time to relax and E′≈E∞. For ωτ≫1 relaxation is too slow during a cycle, so E′≈E∞+ΔE. The loss modulus peaks near ωτ=1.',
sceneKicker:'FREQUENCY SWEEP',
sceneTitle:'One model in three linked views: E′(ω), E″(ω), the ωτ regime, and the σ–ε loop',
frequency:'frequency ω',tau:'relaxation time τ',einf:'E∞',de:'ΔE',
storage:'E′(ω)',loss:'E″(ω)',lossFactor:'tan δ',phase:'δ',omegaTau:'ωτ',
warning:'IMPORTANT',
warningTitle:'The peak of E″ is not the point of maximum stiffness.',
warningText:'Maximum loss occurs in the transition region ωτ≈1, where the relaxation process lags most strongly behind the imposed cycle. E′ meanwhile continues its transition between the low- and high-frequency limits.',
question:'CHECKPOINT',
questionTitle:'Where should one relaxation branch dissipate most strongly?',
questionText:'Near ωτ=1, where the external loading timescale becomes comparable with the material relaxation time.',
conclusion:'CONCLUSION',
conclusionTitle:'The frequency domain converts material memory into a measurable spectrum of timescales.',
conclusionText:'Next we move to nonlinear and finite-strain viscoelasticity, where moduli and relaxation times may depend on state and deformation amplitude.',
deepen:'Go deeper',
deepenText:'For a generalized Maxwell model the branch contributions add: E′(ω)=E∞+Σᵢ Eᵢ(ωτᵢ)²/[1+(ωτᵢ)²], E″(ω)=Σᵢ Eᵢ(ωτᵢ)/[1+(ωτᵢ)²]. A broad distribution of τᵢ therefore creates a broad dissipation spectrum.',
research:'Research note',
researchText:'Experimental E′ and E″ are commonly obtained from dynamic mechanical analysis or oscillatory rheology. Reliable identification of a relaxation spectrum requires a frequency window that overlaps the internal timescales of interest.',
back:'← E07',next:'E09 → nonlinear viscoelasticity'
}} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}
function logX(w:number){return 9+40*(Math.log10(w)+2)/4}

export function FrequencyDomain({notation,language,onBack,onNext}:Props){
const c=text[language]
const [logw,setLogw]=useState(0)
const [tau,setTau]=useState(1)
const [Einf,setEinf]=useState(3)
const [dE,setDE]=useState(9)
const omega=Math.pow(10,logw)
const data=useMemo(()=>{
 const x=omega*tau
 const den=1+x*x
 const Ep=Einf+dE*x*x/den
 const Epp=dE*x/den
 const delta=Math.atan2(Epp,Ep)
 return{x,Ep,Epp,delta,tan:Epp/Ep}
},[omega,tau,Einf,dE])
const formula=notation==='Python'
?"E_star = E_inf + dE*(1j*w*tau)/(1 + 1j*w*tau)"
:notation==='Index'
?"E*_{ijkl}(ω)=E′_{ijkl}(ω)+iE″_{ijkl}(ω)"
:"E*(ω) = E′(ω) + iE″(ω)"

const curve=Array.from({length:161},(_,i)=>{
 const lw=-2+4*i/160
 const w=Math.pow(10,lw)
 const x=w*tau,den=1+x*x
 return{w,Ep:Einf+dE*x*x/den,Epp:dE*x/den}
})
const ymax=Math.max(Einf+dE,dE/2)*1.12
const epPath=curve.map((p,i)=>`${i?'L':'M'}${logX(p.w).toFixed(2)} ${(34-20*p.Ep/ymax).toFixed(2)}`).join(' ')
const eppPath=curve.map((p,i)=>`${i?'L':'M'}${logX(p.w).toFixed(2)} ${(34-20*p.Epp/ymax).toFixed(2)}`).join(' ')
const cx=logX(omega)
const cyEp=34-20*data.Ep/ymax
const cyEpp=34-20*data.Epp/ymax

const loop=Array.from({length:161},(_,i)=>{
 const a=2*Math.PI*i/160
 const eps=Math.sin(a)
 const sig=(data.Ep*Math.sin(a)+data.Epp*Math.cos(a))/Math.max(1e-9,Math.hypot(data.Ep,data.Epp))
 return[73+17*eps,52-12*sig]
})
const loopPath=loop.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ')+' Z'
const deltaDeg=data.delta*180/Math.PI
const regime=data.x<0.3?(language==='ru'?'успевает релаксировать':'relaxed'):data.x>3?(language==='ru'?'не успевает релаксировать':'frozen'):(language==='ru'?'переходный режим':'transition')
const regimeX=10+36*Math.min(1,Math.max(0,(Math.log10(data.x)+2)/4))

return <section className="module-view module-view-stacked">
<div className="lesson-copy">
<div className="lesson-index">E08</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.complex}</div><div className="formula">{formula}</div><p>{c.complexText}</p></div>
<div className="definition"><div className="definition-label">{c.sls}</div><div className="formula">E′ = E∞ + ΔE (ωτ)²/[1+(ωτ)²]<br/>E″ = ΔE (ωτ)/[1+(ωτ)²]</div><p>{c.slsText}</p></div>
<div className="definition"><div className="definition-label">{c.limits}</div><p>{c.limitsText}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote>
<DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>
<ApplicationLinks language={language} items={[
{ru:'Динамический механический анализ полимеров',en:'Dynamic mechanical analysis of polymers'},
{ru:'Осцилляторная реология',en:'Oscillatory rheology'},
{ru:'Демпфирование и виброизоляция',en:'Damping and vibration isolation'},
{ru:'Мягкие биологические ткани',en:'Soft biological tissues'}
]}/>
<div className="module-actions">{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{c.next}</button>}</div>
</div>

<div className="scene-column">
<div className="scene-card">
<div className="scene-head"><div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div></div>
<svg className="balance-scene" viewBox="0 0 100 68" role="img">
<rect x="4" y="5" width="92" height="58" rx="9" fill="#111318"/>

<text x="8" y="11" fill="#F4F2EC" fontSize="2.5">1 · E′(ω), E″(ω)</text>
<line x1="9" y1="34" x2="49" y2="34" stroke="#69717C" strokeWidth=".5"/>
<line x1="9" y1="14" x2="9" y2="34" stroke="#69717C" strokeWidth=".5"/>
<path d={epPath} fill="none" stroke="#A9E3D2" strokeWidth="1.2"/>
<path d={eppPath} fill="none" stroke="#2864FF" strokeWidth="1.2"/>
<line x1={cx} y1="13" x2={cx} y2="35" stroke="#DD7A2B" strokeWidth=".8" strokeDasharray="2 1.5"/>
<circle cx={cx} cy={cyEp} r="1.2" fill="#A9E3D2"/><circle cx={cx} cy={cyEpp} r="1.2" fill="#2864FF"/>
<text x="11" y="17" fill="#A9E3D2" fontSize="2.0">E′</text><text x="17" y="17" fill="#2864FF" fontSize="2.0">E″</text>
<text x="32" y="38" fill="#8C939D" fontSize="1.8">log ω</text>

<text x="8" y="45" fill="#F4F2EC" fontSize="2.5">2 · ωτ</text>
<line x1="10" y1="54" x2="46" y2="54" stroke="#69717C" strokeWidth=".7"/>
<line x1="22" y1="51" x2="22" y2="57" stroke="#69717C" strokeWidth=".6"/>
<line x1="34" y1="51" x2="34" y2="57" stroke="#69717C" strokeWidth=".6"/>
<circle cx={regimeX} cy="54" r="2.1" fill="#DD7A2B"/>
<text x="10" y="61" fill="#8C939D" fontSize="1.8">ωτ≪1</text><text x="24" y="61" fill="#8C939D" fontSize="1.8">≈1</text><text x="36" y="61" fill="#8C939D" fontSize="1.8">ωτ≫1</text>
<text x="10" y="49" fill="#DD7A2B" fontSize="2.0">{regime}</text>

<text x="57" y="11" fill="#F4F2EC" fontSize="2.5">3 · σ–ε</text>
<line x1="55" y1="52" x2="92" y2="52" stroke="#69717C" strokeWidth=".5"/>
<line x1="73" y1="37" x2="73" y2="64" stroke="#69717C" strokeWidth=".5"/>
<path d={loopPath} fill="rgba(221,122,43,.16)" stroke="#DD7A2B" strokeWidth="1.2"/>
<text x="57" y="18" fill="#A9E3D2" fontSize="2.0">δ = {fmt(deltaDeg,1)}°</text>
<text x="57" y="22" fill="#2864FF" fontSize="2.0">tanδ = {fmt(data.tan,3)}</text>
</svg>

<div className="control-stack">
<label><span>{c.frequency} <strong>{omega<1?fmt(omega,3):fmt(omega,2)}</strong></span><input type="range" min="-2" max="2" step=".02" value={logw} onChange={e=>setLogw(Number(e.target.value))}/></label>
<label><span>{c.tau} <strong>{fmt(tau,2)}</strong></span><input type="range" min=".1" max="10" step=".1" value={tau} onChange={e=>setTau(Number(e.target.value))}/></label>
<label><span>{c.einf} <strong>{fmt(Einf,1)}</strong></span><input type="range" min="1" max="10" step=".5" value={Einf} onChange={e=>setEinf(Number(e.target.value))}/></label>
<label><span>{c.de} <strong>{fmt(dE,1)}</strong></span><input type="range" min="1" max="16" step=".5" value={dE} onChange={e=>setDE(Number(e.target.value))}/></label>
</div>
<div className="transport-metrics">
<div><span>{c.storage}</span><strong>{fmt(data.Ep)}</strong></div>
<div><span>{c.loss}</span><strong>{fmt(data.Epp)}</strong></div>
<div><span>{c.omegaTau}</span><strong>{fmt(data.x)}</strong></div>
<div><span>{c.phase}</span><strong>{fmt(deltaDeg,1)}°</strong></div>
</div>
</div>

<div className="bottom-grid">
<div className="prediction-card"><span>{c.question}</span><strong>{c.questionTitle}</strong><p>{c.questionText}</p></div>
<div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div>
</div>
</div>
</section>
}
