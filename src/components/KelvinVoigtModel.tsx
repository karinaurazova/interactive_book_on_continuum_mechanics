import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}

const text={
ru:{
title:'Модель Kelvin–Voigt: пружина и демпфер параллельно',
lead:'В модели Kelvin–Voigt пружина и демпфер испытывают одну и ту же деформацию, а их напряжения складываются.',
key:'ПАРАЛЛЕЛЬНОЕ СОЕДИНЕНИЕ',keyText:'εₑ = εᵥ = ε,   σ = σₑ + σᵥ.',
eq:'Определяющее уравнение',eqText:'σ = Eε + ηε̇. Вязкий вклад сопротивляется скорости деформации, а пружина задаёт конечную равновесную жёсткость.',
creepTitle:'Ползучесть',creepText:'При ступени напряжения деформация постепенно подходит к σ₀/E: ε(t)=σ₀/E(1−e^(−t/τ)), τ=η/E.',
relaxTitle:'Релаксация',relaxText:'Идеальная мгновенная ступень деформации требует бесконечного начального напряжения в демпфере, поэтому чистый Kelvin–Voigt неудобен для релаксационного теста.',
sceneKicker:'KELVIN–VOIGT',sceneTitle:'наблюдай задержанное приближение к равновесной деформации',
E:'модуль E',eta:'вязкость η',time:'время t',tau:'τ=η/E',strain:'ε(t)',strainInf:'ε∞',
warning:'ОГРАНИЧЕНИЕ',warningTitle:'Kelvin–Voigt не допускает мгновенного скачка деформации.',warningText:'Именно поэтому он хорошо описывает запаздывающую ползучесть, но плохо подходит как единственная модель для релаксации.',
question:'ВОПРОС ДЛЯ ПРОВЕРКИ',questionTitle:'Что будет после снятия постоянного напряжения?',questionText:'Деформация не исчезает мгновенно: пружина возвращает систему к нулю, а демпфер растягивает восстановление во времени.',
conclusion:'ВЫВОД',conclusionTitle:'Параллельная схема даёт конечную долгосрочную деформацию и запаздывающее восстановление.',conclusionText:'Maxwell и Kelvin–Voigt по отдельности слишком просты; следующий естественный шаг — объединить их сильные стороны.',
deepen:'Углубиться',deepenText:'Дифференциальное уравнение ηε̇+Eε=σ имеет характерное время τ=η/E. Оно задаёт скорость приближения к равновесию при постоянной нагрузке.',
research:'Исследовательское замечание',researchText:'При реальной ступени нагрузки фронт всегда конечной длительности, поэтому экспериментальная оценка η зависит от временного разрешения и формы входного сигнала.',
back:'← E02',next:'E04 → стандартное линейное твёрдое тело'
},
en:{
title:'Kelvin–Voigt model: spring and dashpot in parallel',
lead:'In the Kelvin–Voigt model, spring and dashpot share the same strain while their stresses add.',
key:'PARALLEL CONNECTION',keyText:'εₑ = εᵥ = ε,   σ = σₑ + σᵥ.',
eq:'Constitutive equation',eqText:'σ = Eε + ηε̇. The viscous term resists strain rate while the spring provides finite equilibrium stiffness.',
creepTitle:'Creep',creepText:'Under a stress step, strain approaches σ₀/E gradually: ε(t)=σ₀/E(1−e^(−t/τ)), τ=η/E.',
relaxTitle:'Relaxation',relaxText:'An ideal instantaneous strain step requires infinite initial dashpot stress, so pure Kelvin–Voigt is awkward for relaxation tests.',
sceneKicker:'KELVIN–VOIGT',sceneTitle:'observe delayed approach to equilibrium strain',
E:'modulus E',eta:'viscosity η',time:'time t',tau:'τ=η/E',strain:'ε(t)',strainInf:'ε∞',
warning:'LIMITATION',warningTitle:'Kelvin–Voigt does not permit an instantaneous strain jump.',warningText:'It captures delayed creep well but is insufficient as a standalone relaxation model.',
question:'CHECKPOINT',questionTitle:'What happens after removing a constant stress?',questionText:'Strain does not vanish instantly: the spring drives recovery while the dashpot spreads it over time.',
conclusion:'CONCLUSION',conclusionTitle:'Parallel coupling gives finite long-term strain and delayed recovery.',conclusionText:'Maxwell and Kelvin–Voigt are each incomplete; the natural next step is to combine their strengths.',
deepen:'Go deeper',deepenText:'The ODE ηε̇+Eε=σ has characteristic time τ=η/E, setting the rate at which equilibrium is approached under constant load.',
research:'Research note',researchText:'Real stress steps have finite rise time, so fitted viscosity depends on time resolution and the exact input waveform.',
back:'← E02',next:'E04 → standard linear solid'
}} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function KelvinVoigtModel({notation,language,onBack,onNext}:Props){
const c=text[language];const[E,setE]=useState(8);const[eta,setEta]=useState(24);const[t,setT]=useState(4)
const d=useMemo(()=>{const tau=eta/E;const inf=1/E;const eps=inf*(1-Math.exp(-t/tau));return{tau,inf,eps}},[E,eta,t])
const formula=notation==='Python'?'sigma = E*eps + eta*eps_dot':notation==='Index'?'σ_ij = E ε_ij + η ε̇_ij':'σ = Eε + ηε̇'
return <section className="module-view module-view-stacked">
<div className="lesson-copy"><div className="lesson-index">E03</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.eq}</div><div className="formula">{formula}</div><p>{c.eqText}</p></div>
<div className="definition"><div className="definition-label">{c.creepTitle}</div><p>{c.creepText}</p></div>
<div className="definition"><div className="definition-label">{c.relaxTitle}</div><p>{c.relaxText}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote><DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>
<ApplicationLinks language={language} items={[{ru:'Полимерные композиты',en:'Polymer composites'},{ru:'Демпфирующие материалы',en:'Damping materials'},{ru:'Асфальтобетон',en:'Asphalt concrete'},{ru:'Мягкие ткани как локальная аппроксимация',en:'Soft tissues as a local approximation'}]}/>
<div className="module-actions">{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{c.next}</button>}</div></div>
<div className="scene-column"><div className="scene-card"><div className="scene-head"><div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div></div>
<div className="control-stack"><label><span>{c.E} <strong>{fmt(E,1)}</strong></span><input type="range" min="1" max="20" step=".5" value={E} onChange={e=>setE(Number(e.target.value))}/></label>
<label><span>{c.eta} <strong>{fmt(eta,1)}</strong></span><input type="range" min="2" max="60" step="1" value={eta} onChange={e=>setEta(Number(e.target.value))}/></label>
<label><span>{c.time} <strong>{fmt(t,1)}</strong></span><input type="range" min="0" max="15" step=".1" value={t} onChange={e=>setT(Number(e.target.value))}/></label></div>
<div className="transport-metrics"><div><span>{c.tau}</span><strong>{fmt(d.tau)}</strong></div><div><span>{c.strain}</span><strong>{fmt(d.eps)}</strong></div><div><span>{c.strainInf}</span><strong>{fmt(d.inf)}</strong></div></div></div>
<div className="bottom-grid"><div className="prediction-card"><span>{c.question}</span><strong>{c.questionTitle}</strong><p>{c.questionText}</p></div><div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div></div></div>
</section>
}