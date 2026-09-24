import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}

const text={
ru:{
title:'Стандартное линейное твёрдое тело (Zener)',
lead:'Модель Zener объединяет мгновенную упругость, релаксацию и конечную долгосрочную жёсткость. Это минимальная линейная модель, которая уже воспроизводит оба ключевых предела реалистичнее, чем Maxwell или Kelvin–Voigt по отдельности.',
key:'ПРУЖИНА ПАРАЛЛЕЛЬНО ВЕТВИ MAXWELL',
keyText:'E∞ задаёт долгосрочную жёсткость, а ветвь Maxwell добавляет времязависимый вклад.',
eq:'Релаксационный модуль',
eqText:'G(t)=E∞+E₁e^(−t/τ), где τ=η/E₁. Сразу после ступени деформации модуль равен E₀=E∞+E₁, а при t→∞ остаётся E∞.',
meaning:'Физический смысл параметров',
meaningText:'E∞ отвечает за равновесный отклик, E₁ — за долю релаксирующего напряжения, η — за скорость релаксации.',
sceneKicker:'ZENER / SLS',
sceneTitle:'смотри, как мгновенная и долгосрочная жёсткости разделяются во времени',
Einf:'E∞',E1:'E₁',eta:'η',time:'t',tau:'τ',G:'G(t)',G0:'G(0)',Ginf:'G(∞)',
warning:'ВАЖНО',warningTitle:'Один τ означает только один характерный временной масштаб.',warningText:'Для широкого спектра релаксации одной ветви SLS недостаточно — тогда используют несколько Maxwell-ветвей или Prony series.',
question:'ВОПРОС ДЛЯ ПРОВЕРКИ',questionTitle:'Почему Zener лучше чистого Maxwell для твёрдого материала?',questionText:'Потому что при t→∞ напряжение не обязано исчезать: остаётся равновесная упругая жёсткость E∞.',
conclusion:'ВЫВОД',conclusionTitle:'SLS — первый по-настоящему универсальный линейный строительный блок.',conclusionText:'Следующий шаг — перейти от одного времени релаксации к спектру времён и обобщённой модели Maxwell.',
deepen:'Углубиться',deepenText:'Через внутреннюю переменную q модель можно писать как σ=E∞ε+q, q̇+(1/τ)q=E₁ ε̇. Такая форма удобна для численного интегрирования.',
research:'Исследовательское замечание',researchText:'Параметры E∞, E₁ и τ лучше идентифицировать совместно по нескольким протоколам. Иначе возможна сильная корреляция параметров.',
back:'← E03',next:'E05 → обобщённый Maxwell'
},
en:{
title:'Standard Linear Solid (Zener)',
lead:'The Zener model combines instantaneous elasticity, relaxation, and finite long-term stiffness. It is the simplest linear model that captures both short- and long-time limits more realistically than Maxwell or Kelvin–Voigt alone.',
key:'SPRING IN PARALLEL WITH A MAXWELL BRANCH',
keyText:'E∞ sets the equilibrium stiffness, while the Maxwell branch adds a time-dependent contribution.',
eq:'Relaxation modulus',
eqText:'G(t)=E∞+E₁e^(−t/τ), with τ=η/E₁. Immediately after a strain step, E₀=E∞+E₁; as t→∞, only E∞ remains.',
meaning:'Physical meaning of parameters',
meaningText:'E∞ controls equilibrium response, E₁ the relaxing fraction, and η the relaxation rate.',
sceneKicker:'ZENER / SLS',
sceneTitle:'see how instantaneous and long-term stiffness separate in time',
Einf:'E∞',E1:'E₁',eta:'η',time:'t',tau:'τ',G:'G(t)',G0:'G(0)',Ginf:'G(∞)',
warning:'IMPORTANT',warningTitle:'A single τ represents only one characteristic timescale.',warningText:'Broad relaxation spectra require multiple Maxwell branches or a Prony series.',
question:'CHECKPOINT',questionTitle:'Why is Zener more suitable than pure Maxwell for a solid?',questionText:'Because stress need not vanish at long times: a finite equilibrium stiffness E∞ remains.',
conclusion:'CONCLUSION',conclusionTitle:'SLS is the first broadly useful linear building block.',conclusionText:'Next we move from one relaxation time to a spectrum of times with the generalized Maxwell model.',
deepen:'Go deeper',deepenText:'Using an internal variable q: σ=E∞ε+q, q̇+(1/τ)q=E₁ ε̇. This form is convenient for numerical integration.',
research:'Research note',researchText:'E∞, E₁, and τ are best identified jointly from multiple loading protocols to reduce parameter correlation.',
back:'← E03',next:'E05 → generalized Maxwell'
}} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function StandardLinearSolid({notation,language,onBack,onNext}:Props){
const c=text[language];const[Einf,setEinf]=useState(4);const[E1,setE1]=useState(8);const[eta,setEta]=useState(24);const[t,setT]=useState(4)
const d=useMemo(()=>{const tau=eta/E1;const G=Einf+E1*Math.exp(-t/tau);return{tau,G,G0:Einf+E1,Ginf:Einf}},[Einf,E1,eta,t])
const formula=notation==='Python'?'G = E_inf + E1 * np.exp(-t/tau)':notation==='Index'?'G(t)=E_∞+E_1 exp(-t/τ)':'G(t) = E∞ + E₁ e^(−t/τ)'
const pts=Array.from({length:81},(_,i)=>{const tt=15*i/80;const tau=eta/E1;const g=Einf+E1*Math.exp(-tt/tau);return[10+80*tt/15,58-34*g/(Einf+E1)]})
const path=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' ')
return <section className="module-view module-view-stacked">
<div className="lesson-copy"><div className="lesson-index">E04</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.eq}</div><div className="formula">{formula}</div><p>{c.eqText}</p></div>
<div className="definition"><div className="definition-label">{c.meaning}</div><p>{c.meaningText}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote><DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>
<ApplicationLinks language={language} items={[{ru:'Полимеры',en:'Polymers'},{ru:'Вязкоупругие клеи и демпферы',en:'Viscoelastic adhesives and dampers'},{ru:'Геоматериалы',en:'Geomaterials'},{ru:'Мягкие ткани',en:'Soft tissues'}]}/>
<div className="module-actions">{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{c.next}</button>}</div></div>
<div className="scene-column"><div className="scene-card"><div className="scene-head"><div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div></div>
<svg className="balance-scene" viewBox="0 0 100 68" role="img"><rect x="5" y="6" width="90" height="56" rx="9" fill="#111318"/><line x1="10" y1="58" x2="90" y2="58" stroke="#69717C" strokeWidth=".6"/><line x1="10" y1="18" x2="10" y2="58" stroke="#69717C" strokeWidth=".6"/><path d={path} fill="none" stroke="#A9E3D2" strokeWidth="1.2"/></svg>
<div className="control-stack">
<label><span>{c.Einf} <strong>{fmt(Einf,1)}</strong></span><input type="range" min="1" max="15" step=".5" value={Einf} onChange={e=>setEinf(Number(e.target.value))}/></label>
<label><span>{c.E1} <strong>{fmt(E1,1)}</strong></span><input type="range" min="1" max="20" step=".5" value={E1} onChange={e=>setE1(Number(e.target.value))}/></label>
<label><span>{c.eta} <strong>{fmt(eta,1)}</strong></span><input type="range" min="2" max="80" step="1" value={eta} onChange={e=>setEta(Number(e.target.value))}/></label>
<label><span>{c.time} <strong>{fmt(t,1)}</strong></span><input type="range" min="0" max="15" step=".1" value={t} onChange={e=>setT(Number(e.target.value))}/></label>
</div>
<div className="transport-metrics"><div><span>{c.tau}</span><strong>{fmt(d.tau)}</strong></div><div><span>{c.G}</span><strong>{fmt(d.G)}</strong></div><div><span>{c.G0}</span><strong>{fmt(d.G0)}</strong></div><div><span>{c.Ginf}</span><strong>{fmt(d.Ginf)}</strong></div></div>
</div><div className="bottom-grid"><div className="prediction-card"><span>{c.question}</span><strong>{c.questionTitle}</strong><p>{c.questionText}</p></div><div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div></div></div>
</section>
}