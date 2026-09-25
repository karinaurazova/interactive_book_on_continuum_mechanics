import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}
type Material='solid'|'fluid'

const text={
ru:{
title:'Твёрдое тело и жидкость: что меняется в конститутивной модели?',
lead:'Переход от механики твёрдого тела к механике жидкости — это не просто замена одной формулы другой. Меняется сам тип конститутивной зависимости: для твёрдого тела важна накопленная деформация относительно опорной конфигурации, а для простой вязкой жидкости — текущая скорость деформации.',
key:'ТВЁРДОЕ ТЕЛО ХРАНИТ ДЕФОРМАЦИЮ, НЬЮТОНОВСКАЯ ЖИДКОСТЬ — НЕТ',
keyText:'После остановки деформирования упругое твёрдое тело может сохранять касательное напряжение, а ньютоновская жидкость при нулевой скорости деформации теряет вязкое касательное напряжение.',
solid:'Твёрдое тело',
solidText:'В простейшем упругом случае напряжение зависит от меры деформации: σ=σ(F) или, при малых деформациях, τ≈Gγ. История может быть не нужна, но текущая конфигурация относительно опорной важна.',
fluid:'Жидкость',
fluidText:'Для простой ньютоновской жидкости девиаторное напряжение определяется скоростью деформации: σ=−pI+2μD. При D=0 вязкий девиаторный вклад исчезает.',
compare:'Один и тот же сдвиг',
compareText:'Если сначала задать скорость сдвига, а затем остановить движение, твёрдое тело остаётся деформированным, а ньютоновская жидкость перестаёт поддерживать вязкое касательное напряжение.',
sceneKicker:'ТВЁРДОЕ ТЕЛО ↔ ЖИДКОСТЬ',
sceneTitle:'задай сдвиг, останови движение и сравни, что остаётся',
material:'материал',shear:'сдвиг γ',rate:'скорость сдвига γ̇',G:'модуль сдвига G',mu:'вязкость μ',
stress:'касательное напряжение',stored:'накопленная деформация',rateState:'текущая скорость',
stop:'Остановить движение',resume:'Возобновить движение',
warning:'ВАЖНО',
warningTitle:'Жидкость может иметь память — но тогда это уже не простая ньютоновская жидкость.',
warningText:'Вязкоупругие жидкости, полимерные растворы и сложные реологические среды требуют внутренних переменных или наследственных законов. Их мы рассмотрим позже в этой главе.',
question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
questionTitle:'Почему нельзя описывать ньютоновскую жидкость законом τ=Gγ?',
questionText:'Потому что такой закон связывает напряжение с накопленной деформацией и тем самым приписывает жидкости упругую память относительно опорной конфигурации. Для ньютоновской жидкости касательное напряжение определяется скоростью сдвига.',
conclusion:'ВЫВОД',
conclusionTitle:'Главное различие между простым твёрдым телом и простой жидкостью лежит в выборе аргументов конститутивного закона.',
conclusionText:'Дальше можно формально разложить напряжение жидкости на давление и девиаторную часть и вывести ньютоновский закон через тензор скоростей деформации D.',
deepen:'Углубиться',
deepenText:'В 3D различие формулируется через материальные симметрии и зависимость свободной энергии или диссипативного потенциала от кинематических аргументов. Для простой вязкой жидкости объективный девиаторный отклик строится из D, а изотропная часть напряжения связана с давлением.',
research:'Исследовательское замечание',
researchText:'Граница между «твёрдым телом» и «жидкостью» становится нетривиальной для стеклообразных материалов, гелей, суспензий и вязкоупругих сред. Тогда классификация зависит от временного масштаба наблюдения и выбранной модели.',
back:'← E13',next:'F01 → напряжение в жидкости'
},
en:{
title:'Solid and fluid: what changes in the constitutive model?',
lead:'Moving from solid mechanics to fluid mechanics is not just replacing one formula with another. The constitutive dependence itself changes: a solid responds to accumulated deformation relative to a reference configuration, while a simple viscous fluid responds to the current rate of deformation.',
key:'A SOLID STORES DEFORMATION; A NEWTONIAN FLUID DOES NOT',
keyText:'After deformation stops, an elastic solid may retain shear stress, while a Newtonian fluid loses its viscous shear stress when the deformation rate becomes zero.',
solid:'Solid',solidText:'In a simple elastic model, stress depends on deformation: σ=σ(F), or at small strain τ≈Gγ. The current configuration relative to a reference matters.',
fluid:'Fluid',fluidText:'For a simple Newtonian fluid, deviatoric stress depends on the rate of deformation: σ=−pI+2μD. When D=0, the viscous deviatoric contribution vanishes.',
compare:'The same shear experiment',compareText:'Impose shear motion and then stop it. The solid remains deformed, while the Newtonian fluid no longer carries viscous shear stress.',
sceneKicker:'SOLID ↔ FLUID',sceneTitle:'apply shear, stop motion, and compare what remains',
material:'material',shear:'shear γ',rate:'shear rate γ̇',G:'shear modulus G',mu:'viscosity μ',
stress:'shear stress',stored:'stored deformation',rateState:'current rate',
stop:'Stop motion',resume:'Resume motion',
warning:'IMPORTANT',warningTitle:'A fluid can have memory — but then it is not a simple Newtonian fluid.',
warningText:'Viscoelastic liquids, polymer solutions, and complex rheological media require internal variables or hereditary laws. We will return to them later in this chapter.',
question:'CHECKPOINT',questionTitle:'Why is τ=Gγ not a suitable law for a Newtonian fluid?',
questionText:'Because it ties stress to accumulated deformation and therefore gives the fluid elastic memory relative to a reference configuration. Newtonian shear stress is controlled by shear rate.',
conclusion:'CONCLUSION',conclusionTitle:'The key distinction between a simple solid and a simple fluid lies in the arguments of the constitutive law.',
conclusionText:'Next we decompose fluid stress into pressure and deviatoric parts and introduce the Newtonian law through the rate-of-deformation tensor D.',
deepen:'Go deeper',deepenText:'In 3D, the distinction can be framed through material symmetries and the dependence of free energy or dissipation potential on kinematic arguments. For a simple viscous fluid, the objective deviatoric response is built from D, while the isotropic part is associated with pressure.',
research:'Research note',researchText:'The boundary between “solid” and “fluid” becomes subtle for glasses, gels, suspensions, and viscoelastic media. Classification then depends on the observation timescale and constitutive model.',
back:'← E13',next:'F01 → fluid stress'
}} as const

function fmt(v:number,d=3){return (Math.abs(v)<1e-12?0:v).toFixed(d)}

export function SolidFluidTransition({notation,language,onBack,onNext}:Props){
const c=text[language]
const [material,setMaterial]=useState<Material>('fluid')
const [gamma,setGamma]=useState(.35)
const [rate,setRate]=useState(.8)
const [G,setG]=useState(4)
const [mu,setMu]=useState(1.5)
const [moving,setMoving]=useState(true)

const data=useMemo(()=>{
 const actualRate=moving?rate:0
 const tau=material==='solid'?G*gamma:mu*actualRate
 const tilt=material==='solid'?gamma:(moving?Math.max(-.5,Math.min(.5,actualRate*.25)):0)
 return{actualRate,tau,tilt}
},[material,gamma,rate,G,mu,moving])

const formula=notation==='Python'
? (material==='solid'?"tau = G * gamma":"sigma = -p*I + 2*mu*D")
:notation==='Index'
? (material==='solid'?"\\tau_{12}=G\\gamma":"\\sigma_{ij}=-p\\delta_{ij}+2\\mu D_{ij}")
:notation==='Matrix'
? (material==='solid'?"τ = Gγ":"σ = −pI + 2μD")
: (material==='solid'?"τ = Gγ":"σ = −pI + 2μD")

const xShift=10*data.tilt
const body='M'+(30+xShift)+' 22 L'+(58+xShift)+' 22 L'+(66-xShift)+' 46 L'+(38-xShift)+' 46 Z'

return <section className="module-view module-view-stacked">
<div className="lesson-copy">
<div className="lesson-index">F00</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.solid}</div><p>{c.solidText}</p></div>
<div className="definition"><div className="definition-label">{c.fluid}</div><div className="formula">{formula}</div><p>{c.fluidText}</p></div>
<div className="definition"><div className="definition-label">{c.compare}</div><p>{c.compareText}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote>
<DepthNote label={c.research} variant="research"><p>{c.researchText}</p></DepthNote>
<ApplicationLinks language={language} items={[
{ru:'Гидродинамика',en:'Fluid mechanics'},
{ru:'Реология полимеров',en:'Polymer rheology'},
{ru:'Гемодинамика',en:'Hemodynamics'},
{ru:'Технологические течения',en:'Processing flows'}
]}/>
<div className="module-actions">{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}{onNext&&<button className="primary-button" onClick={onNext}>{c.next}</button>}</div>
</div>

<div className="scene-column">
<div className="scene-card">
<div className="scene-head"><div><span className="scene-kicker">{c.sceneKicker}</span><h2>{c.sceneTitle}</h2></div></div>
<div className="mini-toggle-row" style={{marginBottom:14}}>
<button className={material==='solid'?'toggle active':'toggle'} onClick={()=>setMaterial('solid')}>{c.solid}</button>
<button className={material==='fluid'?'toggle active':'toggle'} onClick={()=>setMaterial('fluid')}>{c.fluid}</button>
</div>

<svg className="balance-scene" viewBox="0 0 100 68" role="img">
<rect x="4" y="5" width="92" height="58" rx="9" fill="#111318"/>
<line x1="22" y1="48" x2="78" y2="48" stroke="#69717C" strokeWidth=".8"/>
<line x1="22" y1="20" x2="78" y2="20" stroke="#69717C" strokeWidth=".8"/>
<path d={body} fill={material==='solid'?'rgba(169,227,210,.18)':'rgba(40,100,255,.18)'} stroke={material==='solid'?'#A9E3D2':'#2864FF'} strokeWidth="1.4"/>
<line x1="22" y1="17" x2={moving?78:58} y2="17" stroke="#DD7A2B" strokeWidth="1.2"/>
<polygon points={moving?"78,17 74,15 74,19":"58,17 54,15 54,19"} fill="#DD7A2B"/>
<text x="24" y="13" fill="#F4F2EC" fontSize="2.2">{moving?(language==='ru'?'движение':'motion'):(language==='ru'?'остановлено':'stopped')}</text>
<text x="12" y="58" fill="#A9E3D2" fontSize="2.1">γ = {fmt(material==='solid'?gamma:0,2)}</text>
<text x="40" y="58" fill="#2864FF" fontSize="2.1">γ̇ = {fmt(data.actualRate,2)}</text>
<text x="68" y="58" fill="#DD7A2B" fontSize="2.1">τ = {fmt(data.tau,2)}</text>
</svg>

<div className="control-stack">
<label><span>{c.shear}<strong>{fmt(gamma,2)}</strong></span><input type="range" min="-.6" max=".6" step=".01" value={gamma} onChange={e=>setGamma(Number(e.target.value))}/></label>
<label><span>{c.rate}<strong>{fmt(rate,2)}</strong></span><input type="range" min="-2" max="2" step=".05" value={rate} onChange={e=>setRate(Number(e.target.value))}/></label>
{material==='solid'?<label><span>{c.G}<strong>{fmt(G,1)}</strong></span><input type="range" min=".5" max="10" step=".1" value={G} onChange={e=>setG(Number(e.target.value))}/></label>:<label><span>{c.mu}<strong>{fmt(mu,1)}</strong></span><input type="range" min=".2" max="5" step=".1" value={mu} onChange={e=>setMu(Number(e.target.value))}/></label>}
</div>
<button className="primary-button" onClick={()=>setMoving(v=>!v)}>{moving?c.stop:c.resume}</button>
<div className="transport-metrics">
<div><span>{c.stress}</span><strong>{fmt(data.tau)}</strong></div>
<div><span>{c.stored}</span><strong>{material==='solid'?fmt(gamma):'—'}</strong></div>
<div><span>{c.rateState}</span><strong>{fmt(data.actualRate)}</strong></div>
</div>
</div>

<div className="bottom-grid">
<div className="prediction-card"><span>{c.question}</span><strong>{c.questionTitle}</strong><p>{c.questionText}</p></div>
<div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div>
</div>
</div>
</section>
}
