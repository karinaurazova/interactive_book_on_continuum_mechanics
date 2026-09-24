import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}

const text={
ru:{
title:'Наследственный интеграл и принцип суперпозиции Больцмана',
lead:'В линейной вязкоупругости текущее напряжение определяется не только текущей деформацией, но и всей предшествующей историей её изменения. Принцип суперпозиции Больцмана формализует эту идею: вклад каждого малого приращения деформации развивается во времени независимо и суммируется с вкладами остальных приращений.',
key:'ИСТОРИЯ ДЕФОРМАЦИИ КАК СУММА ЗАТУХАЮЩИХ ВКЛАДОВ',
keyText:'Каждое приращение dε(ξ), возникшее в момент ξ, вносит в напряжение в момент t вклад G(t−ξ)dε(ξ).',
integral:'Наследственный интеграл',
integralText:'Для линейного вязкоупругого материала напряжение можно представить в виде σ(t)=∫₋∞ᵗ G(t−ξ) ε̇(ξ)dξ. Функция G(t−ξ) определяет, насколько сильно материал «помнит» изменение деформации, произошедшее ранее.',
kernel:'Ядро памяти',
kernelText:'Ядро G(s), где s=t−ξ≥0, зависит только от временного лага. Чем медленнее убывает G(s), тем дольше сохраняется влияние прошлых приращений деформации.',
superposition:'Принцип суперпозиции Больцмана',
superpositionText:'Линейность означает, что отклик на сложную историю нагружения равен сумме откликов на её элементарные части. Именно поэтому интегральное представление является естественным продолжением дискретной суммы релаксационных процессов.',
connection:'Связь с обобщённой моделью Максвелла',
connectionText:'Если G(t)=G∞+ΣᵢGᵢexp(−t/τᵢ), наследственный интеграл эквивалентен системе внутренних переменных для отдельных ветвей Максвелла. Таким образом, интегральная и внутренне-переменная формы описывают один и тот же линейный материал разными способами.',
sceneKicker:'НАСЛЕДСТВЕННЫЙ ОТКЛИК',
sceneTitle:'Вклад трёх последовательных приращений деформации в текущее напряжение',
tau:'время релаксации τ',time:'текущее время t',memory:'остаточный вклад памяти',sigma:'σ(t)',
warning:'ОГРАНИЧЕНИЕ',
warningTitle:'Принцип суперпозиции Больцмана справедлив только в области линейной вязкоупругости.',
warningText:'При больших деформациях, зависимости параметров от состояния, повреждении, пластичности или нелинейной вязкости суперпозиция отдельных откликов в общем случае нарушается.',
question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
questionTitle:'Почему далёкое по времени приращение деформации влияет на текущее напряжение слабее?',
questionText:'Потому что его вклад умножается на значение ядра памяти G(t−ξ), которое для релаксирующего материала убывает с увеличением временного лага.',
conclusion:'ВЫВОД',
conclusionTitle:'Наследственный интеграл описывает вязкоупругую память как непрерывную сумму вкладов всей истории деформации.',
conclusionText:'Следующий шаг — исследовать циклическое нагружение, где память проявляется в фазовом сдвиге, гистерезисе и диссипации энергии.',
deepen:'Углубиться',
deepenText:'При нулевой предыстории интеграл можно записать от 0 до t. Интегрирование по частям позволяет получить эквивалентные формы через деформацию ε и производную релаксационного модуля Ġ.',
research:'Исследовательское замечание',
researchText:'Интегральное представление концептуально прозрачно, но прямое хранение всей истории нагружения вычислительно дорого. Поэтому в конечно-элементных расчётах чаще используют рекуррентные обновления внутренних переменных.',
back:'← E05',next:'E07 → циклическое нагружение и гистерезис'
},
en:{
title:'Hereditary integral and Boltzmann superposition principle',
lead:'In linear viscoelasticity, current stress depends not only on current strain but on its full prior history. Boltzmann superposition formalizes this idea: each infinitesimal strain increment evolves independently in time and all contributions are summed.',
key:'STRAIN HISTORY AS A SUM OF DECAYING CONTRIBUTIONS',
keyText:'Each strain increment dε(ξ) introduced at time ξ contributes G(t−ξ)dε(ξ) to stress at time t.',
integral:'Hereditary integral',
integralText:'For a linear viscoelastic material, stress can be written as σ(t)=∫₋∞ᵗ G(t−ξ) ε̇(ξ)dξ. The function G(t−ξ) determines how strongly the material remembers a past strain change.',
kernel:'Memory kernel',
kernelText:'The kernel G(s), with s=t−ξ≥0, depends only on the time lag. The slower G(s) decays, the longer past strain increments influence the present state.',
superposition:'Boltzmann superposition principle',
superpositionText:'Linearity means that the response to a complex loading history equals the sum of responses to its elementary parts. This makes the integral formulation a natural continuation of discrete relaxation processes.',
connection:'Connection to the generalized Maxwell model',
connectionText:'If G(t)=G∞+ΣᵢGᵢexp(−t/τᵢ), the hereditary integral is equivalent to a set of internal variables for individual Maxwell branches.',
sceneKicker:'HEREDITARY RESPONSE',
sceneTitle:'Contribution of three successive strain increments to current stress',
tau:'relaxation time τ',time:'current time t',memory:'remaining memory contribution',sigma:'σ(t)',
warning:'LIMITATION',
warningTitle:'Boltzmann superposition is valid only within linear viscoelasticity.',
warningText:'At large strain, with state-dependent parameters, damage, plasticity, or nonlinear viscosity, superposition generally breaks down.',
question:'CHECKPOINT',
questionTitle:'Why does a distant past strain increment contribute less to current stress?',
questionText:'Because its contribution is weighted by the memory kernel G(t−ξ), which decays with increasing time lag in a relaxing material.',
conclusion:'CONCLUSION',
conclusionTitle:'The hereditary integral represents viscoelastic memory as a continuous sum over the entire strain history.',
conclusionText:'Next we examine cyclic loading, where memory appears through phase lag, hysteresis, and energy dissipation.',
deepen:'Go deeper',
deepenText:'For zero prehistory, the integral can be written from 0 to t. Integration by parts gives equivalent forms involving ε and the derivative of the relaxation modulus Ġ.',
research:'Research note',
researchText:'The integral form is conceptually transparent but storing the entire loading history is computationally expensive. Finite-element implementations therefore often use recursive internal-variable updates.',
back:'← E05',next:'E07 → cyclic loading and hysteresis'
}} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function HereditaryIntegral({notation,language,onBack,onNext}:Props){
const c=text[language]
const [tau,setTau]=useState(4)
const [t,setT]=useState(8)
const impulses=[{time:1,amp:.5},{time:3.5,amp:.35},{time:6,amp:.25}]
const data=useMemo(()=>{
 const parts=impulses.map(p=>t>=p.time?p.amp*Math.exp(-(t-p.time)/tau):0)
 return{parts,sigma:parts.reduce((a,b)=>a+b,0)}
},[t,tau])
const history=Array.from({length:121},(_,i)=>{const tt=10*i/120;const val=impulses.reduce((s,p)=>s+(tt>=p.time?p.amp*Math.exp(-(tt-p.time)/tau):0),0);return[10+80*tt/10,57-24*val]})
const historyPath=history.map((p,i)=>(i?'L':'M')+p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' ')
const tails=impulses.map(p=>Array.from({length:81},(_,i)=>{const tt=p.time+(10-p.time)*i/80;const val=p.amp*Math.exp(-(tt-p.time)/tau);return[10+80*tt/10,34-18*val/.5]}).map((q,i)=>(i?'L':'M')+q[0].toFixed(2)+' '+q[1].toFixed(2)).join(' '))
const formula=notation==='Python'
?'sigma = quad(lambda xi: G(t-xi)*eps_dot(xi), -np.inf, t)'
:notation==='Index'
?'σ_ij(t)=∫ G_ijkl(t−ξ) ε̇_kl(ξ)dξ'
:'σ(t) = ∫₋∞ᵗ G(t−ξ) ε̇(ξ) dξ'
return <section className="module-view module-view-stacked">
<div className="lesson-copy"><div className="lesson-index">E06</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.integral}</div><div className="formula">{formula}</div><p>{c.integralText}</p></div>
<div className="definition"><div className="definition-label">{c.kernel}</div><p>{c.kernelText}</p></div>
<div className="definition"><div className="definition-label">{c.superposition}</div><p>{c.superpositionText}</p></div>
<div className="definition"><div className="definition-label">{c.connection}</div><p>{c.connectionText}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote>
<DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>
<ApplicationLinks language={language} items={[
{ru:'Линейные полимеры',en:'Linear polymers'},
{ru:'Демпфирующие материалы',en:'Damping materials'},
{ru:'Битумные материалы',en:'Bituminous materials'},
{ru:'Мягкие ткани в области малых возмущений',en:'Soft tissues in the small-perturbation regime'}
]}/>
<div className="module-actions">{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{c.next}</button>}</div></div>
<div className="scene-column"><div className="scene-card"><div className="scene-head"><div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div></div>
<svg className="balance-scene" viewBox="0 0 100 68" role="img">
<rect x="5" y="6" width="90" height="56" rx="9" fill="#111318"/>
<text x="10" y="13" fill="#F4F2EC" fontSize="2.5">следы отдельных приращений</text>
<line x1="10" y1="35" x2="90" y2="35" stroke="#69717C" strokeWidth=".5"/>
{tails.map((d,i)=><path key={i} d={d} fill="none" stroke={i===0?'#A9E3D2':i===1?'#2864FF':'#DD7A2B'} strokeWidth="1.1"/>)}
{impulses.map((p,i)=><g key={i}><line x1={10+8*p.time} y1="35" x2={10+8*p.time} y2={28} stroke={i===0?'#A9E3D2':i===1?'#2864FF':'#DD7A2B'} strokeWidth="1.3"/><circle cx={10+8*p.time} cy="28" r="1.3" fill={i===0?'#A9E3D2':i===1?'#2864FF':'#DD7A2B'}/></g>)}
<text x="10" y="43" fill="#F4F2EC" fontSize="2.5">суммарное напряжение</text>
<line x1="10" y1="57" x2="90" y2="57" stroke="#69717C" strokeWidth=".5"/>
<path d={historyPath} fill="none" stroke="#F4F2EC" strokeWidth="1.5"/>
<line x1={10+8*t} y1="11" x2={10+8*t} y2="59" stroke="#2864FF" strokeWidth=".9" strokeDasharray="2 2"/>
<text x={Math.min(82,11+8*t)} y="16" fill="#2864FF" fontSize="2.1">t</text>
</svg>
<div className="control-stack">
<label><span>{c.tau} <strong>{fmt(tau,1)}</strong></span><input type="range" min=".5" max="10" step=".1" value={tau} onChange={e=>setTau(Number(e.target.value))}/></label>
<label><span>{c.time} <strong>{fmt(t,1)}</strong></span><input type="range" min="0" max="10" step=".1" value={t} onChange={e=>setT(Number(e.target.value))}/></label>
</div>
<div className="transport-metrics"><div><span>{c.sigma}</span><strong>{fmt(data.sigma)}</strong></div><div><span>{c.memory} 1</span><strong>{fmt(data.parts[0])}</strong></div><div><span>{c.memory} 2</span><strong>{fmt(data.parts[1])}</strong></div><div><span>{c.memory} 3</span><strong>{fmt(data.parts[2])}</strong></div></div>
</div><div className="bottom-grid"><div className="prediction-card"><span>{c.question}</span><strong>{c.questionTitle}</strong><p>{c.questionText}</p></div><div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div></div></div>
</section>
}