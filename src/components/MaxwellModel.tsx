import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}

const text={
ru:{
title:'Модель Максвелла: последовательное соединение упругого и вязкого элементов',
lead:'Модель Максвелла представляет собой последовательное соединение линейно-упругого элемента с модулем E и ньютоновского вязкого элемента с коэффициентом вязкости η. При таком соединении полная деформация складывается из упругой и вязкой составляющих, а напряжение в обоих элементах одинаково.',
key:'КИНЕМАТИЧЕСКОЕ И СИЛОВОЕ УСЛОВИЯ',
keyText:'ε = εₑ + εᵥ,   σₑ = σᵥ = σ.',
eq:'Определяющее уравнение',
eqText:'Из законов σ=Eεₑ и σ=ηε̇ᵥ с учётом ε=εₑ+εᵥ следует дифференциальное определяющее соотношение ε̇=σ̇/E+σ/η.',
relax:'Релаксация',
relaxText:'При мгновенно заданной и далее постоянной деформации напряжение релаксирует по экспоненциальному закону σ(t)=σ₀e^(−t/τ), где τ=η/E — время релаксации.',
creep:'Ползучесть',
creepText:'При постоянном напряжении деформация содержит мгновенную упругую часть σ₀/E и линейно возрастающую вязкую часть σ₀t/η; следовательно, ползучесть в этой модели неограниченна.',
sceneKicker:'МОДЕЛЬ МАКСВЕЛЛА',
sceneTitle:'Влияние модуля упругости E и вязкости η на характерное время релаксации',
E:'модуль E',eta:'вязкость η',time:'время t',tau:'τ=η/E',relaxRatio:'σ/σ₀',creepMetric:'ε при σ₀=1',
warning:'ОГРАНИЧЕНИЕ',warningTitle:'Модель Максвелла воспроизводит релаксацию напряжений, но предсказывает неограниченную ползучесть.',warningText:'Поэтому она не может самостоятельно описывать твёрдый материал с ненулевой равновесной жёсткостью при длительном нагружении.',
question:'ВОПРОС ДЛЯ ПРОВЕРКИ',questionTitle:'Что происходит после разгрузки?',questionText:'После разгрузки упругая составляющая деформации исчезает, тогда как накопленная вязкая составляющая сохраняется.',
conclusion:'ВЫВОД',conclusionTitle:'Последовательное соединение упругого и вязкого элементов приводит к релаксации напряжений и накоплению вязкой деформации.',conclusionText:'Далее эта модель сопоставляется с моделью Кельвина—Фойгта, основанной на параллельном соединении тех же элементов.',
deepen:'Углубиться',deepenText:'Внутренняя переменная εᵥ даёт эволюционную форму: σ=E(ε−εᵥ), ε̇ᵥ=σ/η. Это уже пример конститутивной модели с внутренним состоянием.',
research:'Исследовательское замечание',researchText:'В трёхмерной постановке обычно отдельно моделируют объёмную и девиаторную части, а термодинамическая допустимость требует неотрицательной диссипации η ε̇ᵥ².',
back:'← E01',next:'E03 → модель Кельвина—Фойгта'
},
en:{
title:'Maxwell model: spring and dashpot in series',
lead:'The Maxwell model is the minimal arrangement in which elastic and viscous strains add while stress is identical in both elements.',
key:'SERIES CONNECTION',keyText:'ε = εₑ + εᵥ,   σₑ = σᵥ = σ.',
eq:'Constitutive equation',eqText:'Combining σ=Eεₑ and σ=η ε̇ᵥ gives ε̇ = σ̇/E + σ/η.',
relax:'Relaxation',relaxText:'At fixed strain, stress decays exponentially: σ(t)=σ₀e^(−t/τ), with τ=η/E.',
creep:'Creep',creepText:'At fixed stress, strain grows without bound: ε(t)=σ₀/E + σ₀t/η.',
sceneKicker:'MAXWELL',sceneTitle:'change E and η and observe the memory timescale',
E:'modulus E',eta:'viscosity η',time:'time t',tau:'τ=η/E',relaxRatio:'σ/σ₀',creepMetric:'ε at σ₀=1',
warning:'LIMITATION',warningTitle:'Maxwell captures relaxation well but predicts unbounded creep.',warningText:'For materials with finite long-term stiffness, a single Maxwell branch is therefore insufficient.',
question:'CHECKPOINT',questionTitle:'What happens after unloading?',questionText:'The elastic strain recovers immediately, but accumulated viscous strain remains in the pure Maxwell model.',
conclusion:'CONCLUSION',conclusionTitle:'Series coupling naturally produces relaxation and a persistent viscous contribution.',conclusionText:'Next we compare the parallel Kelvin–Voigt arrangement, which behaves differently in the same tests.',
deepen:'Go deeper',deepenText:'Using viscous strain as an internal variable: σ=E(ε−εᵥ), ε̇ᵥ=σ/η. This is already a constitutive model with evolving internal state.',
research:'Research note',researchText:'In 3D, volumetric and deviatoric branches are often treated separately, while thermodynamic admissibility requires nonnegative viscous dissipation.',
back:'← E01',next:'E03 → Kelvin–Voigt'
}} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function MaxwellModel({notation,language,onBack,onNext}:Props){
const c=text[language];const[E,setE]=useState(8);const[eta,setEta]=useState(24);const[t,setT]=useState(4)
const d=useMemo(()=>{const tau=eta/E;return{tau,relax:Math.exp(-t/tau),creep:1/E+t/eta}},[E,eta,t])
const formula=notation==='Python'?'eps_dot = sigma_dot/E + sigma/eta':notation==='Index'?'ε̇_ij = σ̇_ij/E + σ_ij/η':'ε̇ = σ̇/E + σ/η'
return <section className="module-view module-view-stacked">
<div className="lesson-copy"><div className="lesson-index">E02</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.eq}</div><div className="formula">{formula}</div><p>{c.eqText}</p></div>
<div className="definition"><div className="definition-label">{c.relax}</div><p>{c.relaxText}</p></div>
<div className="definition"><div className="definition-label">{c.creep}</div><p>{c.creepText}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote><DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>
<ApplicationLinks language={language} items={[{ru:'Полимеры при релаксации',en:'Polymer relaxation'},{ru:'Вязкие связующие',en:'Viscous binders'},{ru:'Геоматериалы',en:'Geomaterials'},{ru:'Биологические ткани как компонент сложной модели',en:'Biological tissues as part of richer models'}]}/>
<div className="module-actions">{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{c.next}</button>}</div></div>
<div className="scene-column"><div className="scene-card"><div className="scene-head"><div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div></div>
<div className="control-stack"><label><span>{c.E} <strong>{fmt(E,1)}</strong></span><input type="range" min="1" max="20" step=".5" value={E} onChange={e=>setE(Number(e.target.value))}/></label>
<label><span>{c.eta} <strong>{fmt(eta,1)}</strong></span><input type="range" min="2" max="60" step="1" value={eta} onChange={e=>setEta(Number(e.target.value))}/></label>
<label><span>{c.time} <strong>{fmt(t,1)}</strong></span><input type="range" min="0" max="15" step=".1" value={t} onChange={e=>setT(Number(e.target.value))}/></label></div>
<div className="transport-metrics"><div><span>{c.tau}</span><strong>{fmt(d.tau)}</strong></div><div><span>{c.relaxRatio}</span><strong>{fmt(d.relax)}</strong></div><div><span>{c.creepMetric}</span><strong>{fmt(d.creep)}</strong></div></div></div>
<div className="bottom-grid"><div className="prediction-card"><span>{c.question}</span><strong>{c.questionTitle}</strong><p>{c.questionText}</p></div><div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div></div></div>
</section>
}