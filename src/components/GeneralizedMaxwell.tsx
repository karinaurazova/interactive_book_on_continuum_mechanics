import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}

const text={
ru:{
title:'Обобщённая модель Максвелла и спектр времён релаксации',
lead:'Одного характерного времени релаксации часто недостаточно для описания реальных материалов. Обобщённая модель Максвелла представляет релаксирующий отклик как сумму нескольких ветвей Максвелла, каждая из которых характеризуется собственным модулем и временем релаксации.',
key:'НЕСКОЛЬКО ВРЕМЕННЫХ МАСШТАБОВ',
keyText:'Релаксационный модуль представляется суммой экспоненциальных вкладов: G(t)=G∞+Σᵢ Gᵢ exp(−t/τᵢ).',
structure:'Структура модели',
structureText:'Равновесный упругий элемент с модулем G∞ соединён параллельно с несколькими ветвями Максвелла. Каждая ветвь содержит упругий элемент Gᵢ и вязкий элемент ηᵢ, причём τᵢ=ηᵢ/Gᵢ.',
prony:'Представление рядом Прони',
pronyText:'В вычислительной механике ту же зависимость часто записывают как ряд Прони. Коэффициенты определяют амплитуды релаксирующих вкладов, а τᵢ задают соответствующие временные масштабы.',
spectrum:'Спектр релаксации',
spectrumText:'Набор пар (Gᵢ,τᵢ) можно интерпретировать как дискретный спектр времён релаксации. Чем шире диапазон τᵢ, тем более протяжённым по времени оказывается переход от мгновенного к равновесному отклику.',
sceneKicker:'СПЕКТР РЕЛАКСАЦИИ',
sceneTitle:'Влияние нескольких ветвей Максвелла на форму релаксационной кривой',
g1:'G₁',g2:'G₂',g3:'G₃',tau1:'τ₁',tau2:'τ₂',tau3:'τ₃',time:'t',G:'G(t)',G0:'G(0)',Ginf:'G∞',
warning:'ОГРАНИЧЕНИЕ',
warningTitle:'Увеличение числа ветвей повышает гибкость модели, но одновременно усложняет идентификацию параметров.',
warningText:'Если временные масштабы τᵢ близки друг к другу или эксперимент не охватывает соответствующий диапазон времени, отдельные параметры могут становиться практически неидентифицируемыми.',
question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
questionTitle:'Что изменяется при добавлении новой ветви Максвелла?',
questionText:'Добавляется дополнительный релаксирующий вклад с собственной амплитудой Gᵢ и собственным временем τᵢ. Это позволяет описывать более широкий диапазон времязависимого поведения.',
conclusion:'ВЫВОД',
conclusionTitle:'Обобщённая модель Максвелла описывает вязкоупругость как суперпозицию нескольких релаксационных процессов.',
conclusionText:'Следующий шаг — перейти от дискретного набора внутренних переменных к наследственному интегральному описанию линейной вязкоупругости.',
deepen:'Углубиться',
deepenText:'Для каждой ветви удобно вводить внутреннее напряжение qᵢ: q̇ᵢ + qᵢ/τᵢ = Gᵢ ε̇, а полное напряжение определяется как σ=G∞ε+Σᵢqᵢ. Такая форма естественно используется в пошаговых численных алгоритмах.',
research:'Исследовательское замечание',
researchText:'Выбор числа ветвей является задачей модельной селекции. Слишком малое число ветвей приводит к систематической ошибке, слишком большое — к переобучению и сильной корреляции параметров.',
back:'← E04',next:'E06 → наследственный интеграл'
},
en:{
title:'Generalized Maxwell model and relaxation-time spectrum',
lead:'A single relaxation time is often insufficient for real materials. The generalized Maxwell model represents relaxation as a sum of Maxwell branches, each with its own modulus and relaxation time.',
key:'MULTIPLE TIMESCALES',
keyText:'The relaxation modulus is written as a sum of exponential contributions: G(t)=G∞+Σᵢ Gᵢ exp(−t/τᵢ).',
structure:'Model structure',
structureText:'An equilibrium spring of modulus G∞ is placed in parallel with several Maxwell branches. Each branch contains an elastic modulus Gᵢ and viscosity ηᵢ, with τᵢ=ηᵢ/Gᵢ.',
prony:'Prony-series representation',
pronyText:'In computational mechanics the same dependence is commonly written as a Prony series. Coefficients determine relaxation amplitudes and τᵢ define their characteristic times.',
spectrum:'Relaxation spectrum',
spectrumText:'The set of pairs (Gᵢ,τᵢ) can be interpreted as a discrete relaxation spectrum. A broader range of τᵢ produces a more extended transition from instantaneous to equilibrium response.',
sceneKicker:'RELAXATION SPECTRUM',
sceneTitle:'Effect of multiple Maxwell branches on the relaxation curve',
g1:'G₁',g2:'G₂',g3:'G₃',tau1:'τ₁',tau2:'τ₂',tau3:'τ₃',time:'t',G:'G(t)',G0:'G(0)',Ginf:'G∞',
warning:'LIMITATION',
warningTitle:'More branches increase flexibility but also make parameter identification harder.',
warningText:'If relaxation times are close or the experiment does not span the relevant time range, individual parameters may become practically unidentifiable.',
question:'CHECKPOINT',
questionTitle:'What changes when a Maxwell branch is added?',
questionText:'An additional relaxing contribution appears with its own amplitude Gᵢ and characteristic time τᵢ, allowing a broader range of time-dependent behavior.',
conclusion:'CONCLUSION',
conclusionTitle:'The generalized Maxwell model represents viscoelasticity as a superposition of multiple relaxation processes.',
conclusionText:'Next we move from a discrete set of internal variables to the hereditary integral description of linear viscoelasticity.',
deepen:'Go deeper',
deepenText:'Introduce an internal stress qᵢ for each branch: q̇ᵢ + qᵢ/τᵢ = Gᵢ ε̇, with total stress σ=G∞ε+Σᵢqᵢ. This form is natural for time-stepping algorithms.',
research:'Research note',
researchText:'Choosing the number of branches is a model-selection problem: too few branches cause systematic error, whereas too many may overfit data and increase parameter correlation.',
back:'← E04',next:'E06 → hereditary integral'
}} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function GeneralizedMaxwell({notation,language,onBack,onNext}:Props){
const c=text[language]
const [Ginf,setGinf]=useState(2)
const [g1,setG1]=useState(6),[g2,setG2]=useState(4),[g3,setG3]=useState(2)
const [t1,setT1]=useState(.8),[t2,setT2]=useState(4),[t3,setT3]=useState(12)
const [t,setT]=useState(5)
const d=useMemo(()=>{
  const G=Ginf+g1*Math.exp(-t/t1)+g2*Math.exp(-t/t2)+g3*Math.exp(-t/t3)
  return{G,G0:Ginf+g1+g2+g3}
},[Ginf,g1,g2,g3,t1,t2,t3,t])
const formula=notation==='Python'
?'G = G_inf + sum(Gi * np.exp(-t/taui) for Gi, taui in branches)'
:notation==='Index'
?'G(t)=G_∞+Σ_i G_i exp(−t/τ_i)'
:'G(t) = G∞ + Σᵢ Gᵢ e^(−t/τᵢ)'
const pts=Array.from({length:101},(_,i)=>{
 const tt=20*i/100
 const G=Ginf+g1*Math.exp(-tt/t1)+g2*Math.exp(-tt/t2)+g3*Math.exp(-tt/t3)
 return[10+80*tt/20,58-36*G/(Ginf+g1+g2+g3)]
})
const path=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' ')
return <section className="module-view module-view-stacked">
<div className="lesson-copy"><div className="lesson-index">E05</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.structure}</div><div className="formula">{formula}</div><p>{c.structureText}</p></div>
<div className="definition"><div className="definition-label">{c.prony}</div><p>{c.pronyText}</p></div>
<div className="definition"><div className="definition-label">{c.spectrum}</div><p>{c.spectrumText}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote>
<DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>
<ApplicationLinks language={language} items={[
{ru:'Полимеры с широким спектром релаксации',en:'Polymers with broad relaxation spectra'},
{ru:'Вязкоупругие композиты',en:'Viscoelastic composites'},
{ru:'Асфальтобетон и битумные материалы',en:'Asphalt and bituminous materials'},
{ru:'Мягкие биологические ткани',en:'Soft biological tissues'}
]}/>
<div className="module-actions">{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{c.next}</button>}</div></div>
<div className="scene-column"><div className="scene-card"><div className="scene-head"><div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div></div>
<svg className="balance-scene" viewBox="0 0 100 68" role="img"><rect x="5" y="6" width="90" height="56" rx="9" fill="#111318"/><line x1="10" y1="58" x2="90" y2="58" stroke="#69717C" strokeWidth=".6"/><line x1="10" y1="18" x2="10" y2="58" stroke="#69717C" strokeWidth=".6"/><path d={path} fill="none" stroke="#A9E3D2" strokeWidth="1.2"/></svg>
<div className="control-stack">
<label><span>{c.g1} <strong>{fmt(g1,1)}</strong></span><input type="range" min=".5" max="10" step=".5" value={g1} onChange={e=>setG1(Number(e.target.value))}/></label>
<label><span>{c.tau1} <strong>{fmt(t1,1)}</strong></span><input type="range" min=".2" max="3" step=".1" value={t1} onChange={e=>setT1(Number(e.target.value))}/></label>
<label><span>{c.g2} <strong>{fmt(g2,1)}</strong></span><input type="range" min=".5" max="10" step=".5" value={g2} onChange={e=>setG2(Number(e.target.value))}/></label>
<label><span>{c.tau2} <strong>{fmt(t2,1)}</strong></span><input type="range" min="1" max="8" step=".2" value={t2} onChange={e=>setT2(Number(e.target.value))}/></label>
<label><span>{c.g3} <strong>{fmt(g3,1)}</strong></span><input type="range" min=".5" max="8" step=".5" value={g3} onChange={e=>setG3(Number(e.target.value))}/></label>
<label><span>{c.tau3} <strong>{fmt(t3,1)}</strong></span><input type="range" min="5" max="20" step=".5" value={t3} onChange={e=>setT3(Number(e.target.value))}/></label>
<label><span>{c.time} <strong>{fmt(t,1)}</strong></span><input type="range" min="0" max="20" step=".1" value={t} onChange={e=>setT(Number(e.target.value))}/></label>
</div>
<div className="transport-metrics"><div><span>{c.G}</span><strong>{fmt(d.G)}</strong></div><div><span>{c.G0}</span><strong>{fmt(d.G0)}</strong></div><div><span>{c.Ginf}</span><strong>{fmt(Ginf)}</strong></div></div>
</div><div className="bottom-grid"><div className="prediction-card"><span>{c.question}</span><strong>{c.questionTitle}</strong><p>{c.questionText}</p></div><div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div></div></div>
</section>
}