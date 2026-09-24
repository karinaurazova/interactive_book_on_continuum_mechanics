import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}
type Experiment='relaxation'|'frequency'

const text={
ru:{
title:'Идентификация параметров и практическая идентифицируемость',
lead:'Хорошая подгонка кривой ещё не означает, что параметры модели определены надёжно. В вязкоупругости особенно легко получить несколько разных наборов модулей и времён релаксации, которые почти одинаково описывают ограниченный диапазон эксперимента.',
key:'ИДЕНТИФИЦИРУЕМОСТЬ ЗАВИСИТ НЕ ТОЛЬКО ОТ МОДЕЛИ, НО И ОТ ЭКСПЕРИМЕНТА',
keyText:'Если измерения не охватывают временной масштаб τᵢ, чувствительность отклика к этому параметру мала, а его оценка становится сильно коррелированной с другими параметрами.',
experiments:'Какие эксперименты несут разную информацию',
experimentsText:'Relaxation-тест напрямую зондирует спад G(t); частотный проход разделяет E′(ω) и E″(ω). Ползучесть и циклические тесты добавляют другую комбинацию чувствительностей. Совместная идентификация по нескольким протоколам обычно устойчивее.',
чувствительность:'Чувствительность и корреляция параметров',
чувствительностьText:'Локально информацию о параметрах можно оценивать через матрицу чувствительности J=∂y/∂θ. Почти параллельные столбцы J означают, что разные параметры меняют данные практически одинаково и потому плохо различимы.',
window:'Экспериментальное окно',
windowText:'Для времени релаксации τ полезно иметь измерения и до, и после соответствующего перехода: грубо говоря, диапазон наблюдения должен включать t≈τ или ωτ≈1.',
sceneKicker:'ЛАБОРАТОРИЯ ИДЕНТИФИЦИРУЕМОСТИ',
sceneTitle:'Измени экспериментальное окно и расстояние между τ₁ и τ₂',
experiment:'эксперимент',relaxation:'релаксация',frequency:'частотный проход',
span:'ширина окна, декады',center:'центр окна',tau1:'τ₁',ratio:'τ₂/τ₁',
corr:'корреляция чувствительностей',score:'оценка идентифицируемости',coverage:'покрытие переходов',
warning:'ВАЖНО',
warningTitle:'Малый residual не гарантирует уникальности параметров.',
warningText:'Оптимизатор может найти очень хорошую подгонку вдоль длинной плоской долины функции ошибки. В таком случае прогноз внутри окне калибровки может быть хорошим, а параметры и экстраполяция — ненадёжными.',
question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
questionTitle:'Что лучше для разделения двух близких времён релаксации: больше точек в узком окне или более широкий диапазон?',
questionText:'Обычно важнее расширить окно так, чтобы наблюдать оба переходных масштаба. Простое увеличение числа точек в области, где оба механизма выглядят одинаково, почти не добавляет независимой информации.',
conclusion:'ВЫВОД',
conclusionTitle:'Идентификация — это задача совместного выбора модели, протокола эксперимента и параметризации.',
conclusionText:'Следующий шаг — собрать всю главу в вычислительную лабораторию: выбрать модель, задать эксперимент, провести simulation и проверить физические sanity checks.',
deepen:'Углубиться',
deepenText:'Практическую идентифицируемость можно анализировать через сингулярные значения матрицы чувствительности, матрица информации Фишера, профиль правдоподобия или байесовское апостериорное распределение. Разные методы отвечают на немного разные вопросы, но все показывают, насколько данные действительно ограничивают параметры.',
research:'Исследовательское замечание',
researchText:'Для рядов Прони особенно опасны перестановочная симметрия ветвей, близкие τᵢ и слишком большое число ветвей. Полезны упорядочивание τ₁<τ₂<..., логарифмическая параметризация положительных параметров и penalization/model selection.',
back:'← E10',next:'E12 → вычислительная лаборатория'
},
en:{
title:'Parameter identification and practical identifiability',
lead:'A good curve fit does not guarantee that model parameters are well determined. In viscoelasticity, several different combinations of moduli and relaxation times can reproduce nearly the same response over a limited experimental window.',
key:'IDENTIFIABILITY DEPENDS ON THE EXPERIMENT AS WELL AS THE MODEL',
keyText:'If measurements do not cover a timescale τᵢ, response чувствительность to that parameter is weak and its estimate becomes strongly correlated with other parameters.',
experiments:'Different experiments carry different information',
experimentsText:'Relaxation directly probes G(t), while a частотный проход separates E′(ω) and E″(ω). Ползучесть and cyclic tests add other чувствительность combinations. Joint identification across multiple protocols is usually more robust.',
чувствительность:'Sensitivity and parameter корреляция',
чувствительностьText:'Locally, parameter information can be assessed using a чувствительность matrix J=∂y/∂θ. Nearly parallel columns of J mean that different parameters change the data in almost the same way and are difficult to distinguish.',
window:'Experimental window',
windowText:'For a relaxation time τ, measurements should span both sides of its transition, roughly including t≈τ or ωτ≈1.',
sceneKicker:'ЛАБОРАТОРИЯ ИДЕНТИФИЦИРУЕМОСТИ',
sceneTitle:'Change the experimental window and separation between τ₁ and τ₂',
experiment:'experiment',relaxation:'релаксация',frequency:'частотный проход',
span:'window width, decades',center:'window center',tau1:'τ₁',ratio:'τ₂/τ₁',
corr:'чувствительность корреляция',score:'оценка идентифицируемости',coverage:'transition coverage',
warning:'IMPORTANT',
warningTitle:'A small residual does not guarantee unique parameters.',
warningText:'An optimizer may fit data extremely well along a long flat valley of the objective function. Predictions inside the окне калибровки can then look good while parameters and extrapolation remain unreliable.',
question:'CHECKPOINT',
questionTitle:'What separates two nearby relaxation times better: more points in a narrow window or a broader window?',
questionText:'Usually the broader window is more valuable if it captures both transition scales. More points where both mechanisms look alike add little independent information.',
conclusion:'CONCLUSION',
conclusionTitle:'Identification is a joint problem of model choice, планирование эксперимента, and parameterization.',
conclusionText:'Next we assemble the chapter into a computational laboratory: choose a model, define an experiment, simulate it, and run physical sanity checks.',
deepen:'Go deeper',
deepenText:'Practical identifiability can be studied using сингулярные значения of the чувствительность matrix, the матрица информации Фишера, профиль правдоподобия, or байесовское апостериорное распределениеs. These methods answer slightly different questions but all quantify how strongly data constrain parameters.',
research:'Research note',
researchText:'рядов Прони models are especially vulnerable to branch permutation symmetry, nearby τᵢ, and over-parameterization. Ordering τ₁<τ₂<..., log-parameterization of positive quantities, and model selection or regularization are useful safeguards.',
back:'← E10',next:'E12 → computational laboratory'
}} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function ParameterIdentifiability({notation,language,onBack,onNext}:Props){
const c=text[language]
const [experiment,setExperiment]=useState<Experiment>('relaxation')
const [span,setSpan]=useState(3)
const [center,setCenter]=useState(0)
const [tau1,setTau1]=useState(1)
const [ratio,setRatio]=useState(8)

const d=useMemo(()=>{
 const tau2=tau1*ratio
 const n=81
 const xs=Array.from({length:n},(_,i)=>Math.pow(10,center-span/2+span*i/(n-1)))
 const s1:number[]=[]; const s2:number[]=[]; const y:number[]=[]
 if(experiment==='relaxation'){
   for(const t of xs){
     const a=Math.exp(-t/tau1),b=Math.exp(-t/tau2)
     y.push(2+5*a+4*b)
     s1.push(5*a*(t/tau1))
     s2.push(4*b*(t/tau2))
   }
 }else{
   for(const w of xs){
     const x1=w*tau1,x2=w*tau2
     const epp=5*x1/(1+x1*x1)+4*x2/(1+x2*x2)
     y.push(epp)
     s1.push(5*x1*(1-x1*x1)/(1+x1*x1)**2)
     s2.push(4*x2*(1-x2*x2)/(1+x2*x2)**2)
   }
 }
 const dot=s1.reduce((a,v,i)=>a+v*s2[i],0)
 const n1=Math.sqrt(s1.reduce((a,v)=>a+v*v,0))
 const n2=Math.sqrt(s2.reduce((a,v)=>a+v*v,0))
 const corr=Math.abs(dot/Math.max(1e-12,n1*n2))
 const score=Math.max(0,1-corr)
 const low=Math.pow(10,center-span/2),high=Math.pow(10,center+span/2)
 const cov1=experiment==='relaxation'?(low<tau1&&high>tau1):(low<1/tau1&&high>1/tau1)
 const cov2=experiment==='relaxation'?(low<tau2&&high>tau2):(low<1/tau2&&high>1/tau2)
 const coverage=(Number(cov1)+Number(cov2))/2
 return{tau2,xs,y,s1,s2,corr,score,coverage}
},[experiment,span,center,tau1,ratio])

const formula=notation==='Python'
?"J[:, j] = finite_difference(model, theta, j)"
:notation==='Index'
?"J_{kj}=∂y_k/∂θ_j,   F_{ij}=Σ_k J_{ki}J_{kj}"
:notation==='Matrix'
?"J = ∂y/∂θ,   F = JᵀJ"
:"J = ∂y/∂θ,   F = JᵀJ"

const yMin=Math.min(...d.y),yMax=Math.max(...d.y)
const mainPath=d.y.map((v,i)=>{
 const x=8+40*i/(d.y.length-1)
 const y=34-20*(v-yMin)/Math.max(1e-9,yMax-yMin)
 return `${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`
}).join(' ')
const maxS=Math.max(...d.s1.map(Math.abs),...d.s2.map(Math.abs),1e-9)
const s1Path=d.s1.map((v,i)=>`${i?'L':'M'}${(56+36*i/(d.s1.length-1)).toFixed(2)} ${(27-10*v/maxS).toFixed(2)}`).join(' ')
const s2Path=d.s2.map((v,i)=>`${i?'L':'M'}${(56+36*i/(d.s2.length-1)).toFixed(2)} ${(27-10*v/maxS).toFixed(2)}`).join(' ')
const scoreX=57+34*d.score

return <section className="module-view module-view-stacked">
<div className="lesson-copy">
<div className="lesson-index">E11</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.experiments}</div><p>{c.experimentsText}</p></div>
<div className="definition"><div className="definition-label">{c.чувствительность}</div><div className="formula">{formula}</div><p>{c.чувствительностьText}</p></div>
<div className="definition"><div className="definition-label">{c.window}</div><p>{c.windowText}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote>
<DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>
<ApplicationLinks language={language} items={[
{ru:'DMA и частотные sweep-тесты',en:'DMA and частотный проходs'},
{ru:'Релаксация напряжений',en:'Stress-relaxation tests'},
{ru:'Inverse problems в биомеханике',en:'Inverse problems in biomechanics'},
{ru:'Калибровка рядов Прони',en:'рядов Прони calibration'}
]}/>
<div className="module-actions">{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{c.next}</button>}</div>
</div>

<div className="scene-column">
<div className="scene-card">
<div className="scene-head"><div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div></div>
<div className="mini-toggle-row" style={{marginBottom:14}}>
<button className={experiment==='relaxation'?'toggle active':'toggle'} onClick={()=>setExperiment('relaxation')}>{c.relaxation}</button>
<button className={experiment==='frequency'?'toggle active':'toggle'} onClick={()=>setExperiment('frequency')}>{c.frequency}</button>
</div>

<svg className="balance-scene" viewBox="0 0 100 68" role="img">
<rect x="4" y="5" width="92" height="58" rx="9" fill="#111318"/>
<text x="8" y="11" fill="#F4F2EC" fontSize="2.5">{experiment==='relaxation'?'response G(t)':'loss modulus E″(ω)'}</text>
<line x1="8" y1="34" x2="48" y2="34" stroke="#69717C" strokeWidth=".5"/>
<path d={mainPath} fill="none" stroke="#F4F2EC" strokeWidth="1.2"/>
<text x="8" y="39" fill="#8C939D" fontSize="1.8">log {experiment==='relaxation'?'t':'ω'}</text>

<text x="56" y="11" fill="#F4F2EC" fontSize="2.5">sensitivities to log τ</text>
<line x1="56" y1="27" x2="92" y2="27" stroke="#69717C" strokeWidth=".5"/>
<path d={s1Path} fill="none" stroke="#A9E3D2" strokeWidth="1.1"/>
<path d={s2Path} fill="none" stroke="#2864FF" strokeWidth="1.1"/>
<text x="57" y="16" fill="#A9E3D2" fontSize="1.9">τ₁</text><text x="64" y="16" fill="#2864FF" fontSize="1.9">τ₂</text>

<text x="56" y="43" fill="#F4F2EC" fontSize="2.3">identifiability</text>
<line x1="57" y1="52" x2="91" y2="52" stroke="#69717C" strokeWidth="2.2"/>
<circle cx={scoreX} cy="52" r="2.1" fill={d.score>.55?'#A9E3D2':d.score>.25?'#DD7A2B':'#F4F2EC'}/>
<text x="57" y="59" fill="#8C939D" fontSize="1.8">0</text><text x="89" y="59" fill="#8C939D" fontSize="1.8">1</text>
</svg>

<div className="control-stack">
<label><span>{c.span}<strong>{fmt(span,1)}</strong></span><input type="range" min=".8" max="6" step=".1" value={span} onChange={e=>setSpan(Number(e.target.value))}/></label>
<label><span>{c.center}<strong>{fmt(center,1)}</strong></span><input type="range" min="-3" max="3" step=".1" value={center} onChange={e=>setCenter(Number(e.target.value))}/></label>
<label><span>{c.tau1}<strong>{fmt(tau1,2)}</strong></span><input type="range" min=".1" max="5" step=".05" value={tau1} onChange={e=>setTau1(Number(e.target.value))}/></label>
<label><span>{c.ratio}<strong>{fmt(ratio,2)}</strong></span><input type="range" min="1.2" max="50" step=".2" value={ratio} onChange={e=>setRatio(Number(e.target.value))}/></label>
</div>

<div className="transport-metrics">
<div><span>{c.corr}</span><strong>{fmt(d.corr)}</strong></div>
<div><span>{c.score}</span><strong>{fmt(d.score)}</strong></div>
<div><span>{c.coverage}</span><strong>{Math.round(100*d.coverage)}%</strong></div>
<div><span>τ₂</span><strong>{fmt(d.tau2,2)}</strong></div>
</div>
</div>

<div className="bottom-grid">
<div className="prediction-card"><span>{c.question}</span><strong>{c.questionTitle}</strong><p>{c.questionText}</p></div>
<div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div>
</div>
</div>
</section>
}
