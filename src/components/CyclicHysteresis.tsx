import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}

const text={
ru:{
title:'Циклическое нагружение, фазовый сдвиг и гистерезис',
lead:'При гармоническом деформировании линейно-вязкоупругого материала напряжение в общем случае не совпадает по фазе с деформацией. Возникающий фазовый сдвиг является непосредственным проявлением времязависимого отклика, а площадь петли гистерезиса на диаграмме σ–ε характеризует энергию, рассеиваемую за один цикл.',
key:'ФАЗОВЫЙ СДВИГ СВЯЗЫВАЕТ ВРЕМЕННОЙ И ЭНЕРГЕТИЧЕСКИЙ ОТКЛИК',
keyText:'При ε(t)=ε₀sinωt напряжение можно представить как σ(t)=ε₀[E′sinωt+E″cosωt]=σ₀sin(ωt+δ).',
phase:'Фазовый сдвиг',
phaseText:'Угол δ определяется отношением вязкой и упругой составляющих отклика: tanδ=E″/E′. При δ=0 материал ведёт себя как идеально упругий; увеличение δ указывает на возрастающий вклад диссипативного механизма.',
hysteresis:'Петля гистерезиса',
hysteresisText:'Если построить напряжение как функцию деформации за полный цикл, получается замкнутая петля. Для линейного гармонического режима её площадь равна диссипированной за цикл энергии на единицу объёма.',
energy:'Диссипация энергии',
energyText:'Для синусоидального деформирования Wдисс=∮σdε=πE″ε₀². Следовательно, модуль потерь E″ непосредственно определяет энергетические потери при циклическом нагружении.',
sceneKicker:'ЦИКЛИЧЕСКИЙ ОТКЛИК',
sceneTitle:'Один цикл в трёх представлениях: время, фазовый сдвиг и петля σ–ε',
storage:'E′',loss:'E″',amplitude:'амплитуда ε₀',phaseAngle:'δ',lossFactor:'tan δ',dissipation:'Wдисс',
warning:'ВАЖНО',
warningTitle:'Форма петли гистерезиса зависит не только от материала, но и от частоты и амплитуды нагружения.',
warningText:'В линейной области изменение амплитуды масштабирует петлю, а изменение частоты влияет на E′ и E″. При переходе к нелинейной вязкоупругости форма петли перестаёт быть эллиптической.',
question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
questionTitle:'Что произойдёт с петлёй при E″→0?',
questionText:'Фазовый сдвиг исчезнет, петля выродится в однозначную прямую σ=E′ε, а диссипированная за цикл энергия станет равной нулю.',
conclusion:'ВЫВОД',
conclusionTitle:'Фазовый сдвиг и площадь петли гистерезиса являются двумя представлениями одного диссипативного механизма.',
conclusionText:'Следующий шаг — перейти к частотной области и рассмотреть зависимость модулей хранения и потерь от частоты нагружения.',
deepen:'Углубиться',
deepenText:'Комплексный модуль записывается как E*=E′+iE″. Его модуль определяет амплитудное отношение σ₀/ε₀, а аргумент — фазовый сдвиг δ. Временное и частотное описания линейной вязкоупругости связаны преобразованиями Фурье или Лапласа.',
research:'Исследовательское замечание',
researchText:'При обработке экспериментальных циклов площадь петли следует вычислять после выхода системы на установившийся периодический режим. Первые циклы могут содержать переходную составляющую и не отражать стационарные потери.',
back:'← E06',next:'E08 → частотная область'
},
en:{
title:'Cyclic loading, phase lag, and hysteresis',
lead:'Under harmonic deformation of a linear viscoelastic material, stress is generally out of phase with strain. The phase lag reflects time-dependent response, while the area of the σ–ε hysteresis loop measures energy dissipated per cycle.',
key:'PHASE LAG LINKS TIME RESPONSE TO ENERGY DISSIPATION',
keyText:'For ε(t)=ε₀sinωt, stress can be written as σ(t)=ε₀[E′sinωt+E″cosωt]=σ₀sin(ωt+δ).',
phase:'Phase lag',
phaseText:'The angle δ satisfies tanδ=E″/E′. At δ=0 the material is ideally elastic; increasing δ indicates a larger dissipative contribution.',
hysteresis:'Hysteresis loop',
hysteresisText:'Plotting stress against strain over a full cycle produces a closed loop. In linear harmonic response, its area equals the energy dissipated per unit volume per cycle.',
energy:'Energy dissipation',
energyText:'For sinusoidal strain, Wdiss=∮σdε=πE″ε₀². Thus the loss modulus E″ directly controls cyclic energy loss.',
sceneKicker:'CYCLIC RESPONSE',
sceneTitle:'One cycle in three views: time, phase lag, and the σ–ε loop',
storage:'E′',loss:'E″',amplitude:'strain amplitude ε₀',phaseAngle:'δ',lossFactor:'tan δ',dissipation:'Wdiss',
warning:'IMPORTANT',
warningTitle:'Hysteresis-loop shape depends on loading frequency and amplitude as well as material properties.',
warningText:'In the linear regime, changing amplitude rescales the loop, whereas changing frequency alters E′ and E″. Nonlinear viscoelasticity generally produces non-elliptical loops.',
question:'CHECKPOINT',
questionTitle:'What happens to the loop as E″→0?',
questionText:'Phase lag vanishes, the loop collapses to the line σ=E′ε, and dissipated energy per cycle tends to zero.',
conclusion:'CONCLUSION',
conclusionTitle:'Phase lag and hysteresis-loop area are two views of the same dissipative mechanism.',
conclusionText:'Next we move to the frequency domain and examine how storage and loss moduli depend on loading frequency.',
deepen:'Go deeper',
deepenText:'The complex modulus is E*=E′+iE″. Its magnitude gives σ₀/ε₀ and its argument gives δ. Time- and frequency-domain descriptions are connected through Fourier or Laplace transforms.',
research:'Research note',
researchText:'Experimental loop area should be evaluated after the response reaches a steady periodic regime. Early cycles may contain transients and should not be interpreted as stationary dissipation.',
back:'← E06',next:'E08 → frequency domain'
}} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function CyclicHysteresis({notation,language,onBack,onNext}:Props){
const c=text[language]
const [Ep,setEp]=useState(8)
const [Epp,setEpp]=useState(3)
const [eps0,setEps0]=useState(.08)
const data=useMemo(()=>{
 const delta=Math.atan2(Epp,Ep)
 const tan=Epp/Ep
 const amp=eps0*Math.sqrt(Ep*Ep+Epp*Epp)
 const W=Math.PI*Epp*eps0*eps0
 return{delta,tan,amp,W}
},[Ep,Epp,eps0])
const formula=notation==='Python'
?"sigma = eps0*(Ep*np.sin(w*t) + Epp*np.cos(w*t))"
:notation==='Index'
?"σ_ij(t)=ε₀[E′_ijkl sin(ωt)+E″_ijkl cos(ωt)]"
:"σ(t) = ε₀[E′ sin(ωt) + E″ cos(ωt)]"
const timePts=Array.from({length:121},(_,i)=>{const a=2*Math.PI*i/120;return{a,eps:Math.sin(a),sig:Math.sin(a+data.delta)}})
const epsPath=timePts.map((p,i)=>`${i?'L':'M'}${8+40*i/120} ${26-9*p.eps}`).join(' ')
const sigPath=timePts.map((p,i)=>`${i?'L':'M'}${8+40*i/120} ${26-9*p.sig}`).join(' ')
const loopPts=Array.from({length:161},(_,i)=>{const a=2*Math.PI*i/160;const eps=eps0*Math.sin(a);const sig=eps0*(Ep*Math.sin(a)+Epp*Math.cos(a));return[73+18*eps/eps0,47-14*sig/(eps0*Math.sqrt(Ep*Ep+Epp*Epp))]})
const loopPath=loopPts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ')+' Z'
const deltaDeg=data.delta*180/Math.PI
return <section className="module-view module-view-stacked">
<div className="lesson-copy"><div className="lesson-index">E07</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.phase}</div><div className="formula">{formula}</div><p>{c.phaseText}</p></div>
<div className="definition"><div className="definition-label">{c.hysteresis}</div><p>{c.hysteresisText}</p></div>
<div className="definition"><div className="definition-label">{c.energy}</div><div className="formula">W<sub>дисс</sub> = ∮σ dε = πE″ε₀²</div><p>{c.energyText}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote>
<DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>
<ApplicationLinks language={language} items={[
{ru:'Виброизоляционные и демпфирующие материалы',en:'Vibration-isolation and damping materials'},
{ru:'Полимеры и эластомеры',en:'Polymers and elastomers'},
{ru:'Асфальтобетон',en:'Asphalt concrete'},
{ru:'Мягкие биологические ткани',en:'Soft biological tissues'}
]}/>
<div className="module-actions">{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{c.next}</button>}</div></div>

<div className="scene-column"><div className="scene-card"><div className="scene-head"><div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div></div>
<svg className="balance-scene" viewBox="0 0 100 68" role="img">
<rect x="4" y="5" width="92" height="58" rx="9" fill="#111318"/>

<text x="8" y="12" fill="#F4F2EC" fontSize="2.5">1 · ε(t) и σ(t)</text>
<line x1="8" y1="26" x2="48" y2="26" stroke="#69717C" strokeWidth=".5"/>
<path d={epsPath} fill="none" stroke="#A9E3D2" strokeWidth="1.1"/>
<path d={sigPath} fill="none" stroke="#2864FF" strokeWidth="1.1"/>
<text x="9" y="16" fill="#A9E3D2" fontSize="2.1">ε</text><text x="14" y="16" fill="#2864FF" fontSize="2.1">σ</text>

<text x="8" y="42" fill="#F4F2EC" fontSize="2.5">2 · фазовый сдвиг</text>
<circle cx="28" cy="52" r="8" fill="none" stroke="#69717C" strokeWidth=".6"/>
<line x1="28" y1="52" x2="36" y2="52" stroke="#A9E3D2" strokeWidth="1.1"/>
<line x1="28" y1="52" x2={28+8*Math.cos(-data.delta)} y2={52+8*Math.sin(-data.delta)} stroke="#2864FF" strokeWidth="1.1"/>
<path d={`M34 52 A6 6 0 0 0 ${28+6*Math.cos(-data.delta)} ${52+6*Math.sin(-data.delta)}`} fill="none" stroke="#DD7A2B" strokeWidth=".8"/>
<text x="38" y="53" fill="#DD7A2B" fontSize="2.2">δ = {fmt(deltaDeg,1)}°</text>

<text x="57" y="12" fill="#F4F2EC" fontSize="2.5">3 · петля σ–ε</text>
<line x1="55" y1="47" x2="92" y2="47" stroke="#69717C" strokeWidth=".5"/>
<line x1="73" y1="30" x2="73" y2="61" stroke="#69717C" strokeWidth=".5"/>
<path d={loopPath} fill="rgba(221,122,43,.16)" stroke="#DD7A2B" strokeWidth="1.2"/>
<text x="78" y="60" fill="#8C939D" fontSize="2.0">ε</text><text x="56" y="32" fill="#8C939D" fontSize="2.0">σ</text>
<text x="60" y="17" fill="#F4F2EC" fontSize="2.1">площадь = Wдисс</text>
</svg>

<div className="control-stack">
<label><span>{c.storage} <strong>{fmt(Ep,1)}</strong></span><input type="range" min="1" max="15" step=".5" value={Ep} onChange={e=>setEp(Number(e.target.value))}/></label>
<label><span>{c.loss} <strong>{fmt(Epp,1)}</strong></span><input type="range" min="0" max="12" step=".25" value={Epp} onChange={e=>setEpp(Number(e.target.value))}/></label>
<label><span>{c.amplitude} <strong>{fmt(eps0,3)}</strong></span><input type="range" min=".02" max=".15" step=".005" value={eps0} onChange={e=>setEps0(Number(e.target.value))}/></label>
</div>
<div className="transport-metrics"><div><span>{c.phaseAngle}</span><strong>{fmt(deltaDeg,1)}°</strong></div><div><span>{c.lossFactor}</span><strong>{fmt(data.tan)}</strong></div><div><span>{c.dissipation}</span><strong>{fmt(data.W,4)}</strong></div></div>
</div>
<div className="bottom-grid"><div className="prediction-card"><span>{c.question}</span><strong>{c.questionTitle}</strong><p>{c.questionText}</p></div><div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div></div>
</div></section>
}