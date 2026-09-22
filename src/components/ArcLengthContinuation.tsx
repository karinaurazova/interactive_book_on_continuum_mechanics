import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'
import { ApplicationLinks } from './ApplicationLinks'

type Props={notation:NotationMode;language:Language;onBack?:()=>void;onNext?:()=>void}

const text={
ru:{
 title:'Продолжение ветвей решения и метод длины дуги',
 lead:'Около предельной точки нагрузка перестаёт быть удобным параметром продолжения: одному значению нагрузки могут соответствовать несколько равновесных состояний. Поэтому вычислительный алгоритм должен отслеживать сам путь решения, а не только монотонно увеличивать нагрузку.',
 key:'МЕТОД ПРОДОЛЖЕНИЯ ИЩЕТ НЕ ОТДЕЛЬНЫЕ РЕШЕНИЯ, А СВЯЗНУЮ ВЕТВЬ РАВНОВЕСИЯ',
 keyText:'Метод длины дуги добавляет дополнительное условие на приращения перемещений и параметра нагрузки. Благодаря этому численный шаг может пройти участок, где нагрузка сначала возрастает, затем уменьшается, а решение при этом остаётся на той же ветви.',
 ordinary:'Управление нагрузкой',arc:'Метод длины дуги',
 ordinaryText:'На каждом шаге параметр нагрузки задаётся заранее. Вблизи предельной точки касательная по нагрузке становится неудобной, и метод может не найти следующее состояние.',
 arcText:'Следующее состояние ищется на заданном расстоянии вдоль пространства «перемещения + нагрузка». Параметр нагрузки становится частью неизвестных.',
 step:'номер шага',radius:'длина дуги Δs',current:'текущая точка',limit:'предельная точка',
 success:'ветвь отслеживается',fail:'обычный шаг теряет ветвь',
 sceneKicker:'ПРОДОЛЖЕНИЕ ВЕТВИ',sceneTitle:'сравни два способа прохождения одной и той же предельной точки',
 checkpoint:'ПРОВЕРЬ ЛОГИКУ',checkpointTitle:'Почему простое уменьшение шага нагрузки не всегда решает проблему?',
 checkpointText:'Потому что проблема не только в размере шага. В предельной точке сама нагрузка перестаёт однозначно параметризовать ветвь решения: дальше по ветви она может уменьшаться.',
 conclusion:'ВЫВОД',conclusionTitle:'Чтобы исследовать посткритическое поведение, нужно параметризовать путь решения, а не только нагрузку.',
 conclusionText:'Метод длины дуги превращает задачу продолжения в расширенную систему: уравнения равновесия дополняются геометрическим ограничением на размер шага.',
 deepen:'Углубиться',deepenText:'Одна из типичных форм условия длины дуги имеет вид ΔuᵀΔu + α²Δλ² = Δs². Совместно с R(u,λ)=0 это позволяет решать и перемещения, и параметр нагрузки как неизвестные.',
 research:'Исследовательское замечание',researchText:'На практике существуют разные варианты дугового продолжения: сферическое, цилиндрическое, метод Рикса и их модификации. Они различаются выбором ограничения, нормировки и стратегией коррекции шага.',
 warning:'ВАЖНО',warningTitle:'Метод длины дуги не делает неустойчивую ветвь физически устойчивой.',
 warningText:'Он лишь позволяет вычислительно проследить равновесный путь. Физическая реализуемость состояния по-прежнему требует отдельного анализа устойчивости.',
 back:'← D10',next:'D12 →',interactive:'ИНТЕРАКТИВНО'
},
en:{
 title:'Solution continuation and the arc-length method',
 lead:'Near a limit point, load is no longer a convenient continuation parameter: the same load value may correspond to several equilibrium states. A numerical algorithm must therefore follow the solution path itself rather than only increase the load monotonically.',
 key:'CONTINUATION METHODS TRACK A CONNECTED EQUILIBRIUM BRANCH, NOT ISOLATED SOLUTIONS',
 keyText:'The arc-length method adds an extra constraint on displacement and load-parameter increments. This allows a numerical step to pass regions where load first increases and then decreases while the solution stays on the same branch.',
 ordinary:'Load control',arc:'Arc-length method',
 ordinaryText:'At each step the load parameter is prescribed in advance. Near a limit point the load tangent becomes unsuitable and the method may fail to locate the next state.',
 arcText:'The next state is searched at a prescribed distance in the combined displacement-load space. The load parameter becomes part of the unknowns.',
 step:'step number',radius:'arc length Δs',current:'current point',limit:'limit point',
 success:'branch is tracked',fail:'ordinary step loses the branch',
 sceneKicker:'BRANCH CONTINUATION',sceneTitle:'compare two ways of traversing the same limit point',
 checkpoint:'CHECK THE LOGIC',checkpointTitle:'Why does simply reducing the load increment not always solve the problem?',
 checkpointText:'Because the issue is not only the step size. At a limit point, load itself ceases to parameterize the branch uniquely: further along the branch it may decrease.',
 conclusion:'CONCLUSION',conclusionTitle:'To study post-critical behavior we must parameterize the solution path, not just the load.',
 conclusionText:'The arc-length method turns continuation into an augmented system: equilibrium equations are supplemented by a geometric constraint on the step size.',
 deepen:'Go deeper',deepenText:'A common arc-length constraint is ΔuᵀΔu + α²Δλ² = Δs². Together with R(u,λ)=0 it allows both displacements and the load parameter to be solved as unknowns.',
 research:'Research note',researchText:'Several arc-length variants are used in practice, including spherical and cylindrical constraints, the Riks method, and related modifications. They differ in the constraint, normalization, and step-correction strategy.',
 warning:'IMPORTANT',warningTitle:'The arc-length method does not make an unstable branch physically stable.',
 warningText:'It only allows the equilibrium path to be traced numerically. Physical realizability still requires a separate stability analysis.',
 back:'← D10',next:'D12 →',interactive:'INTERACTIVE'
}} as const

function curvePoint(t:number){
 const u=-1.6+3.2*t
 const lambda=1.05+1.15*u-.42*u*u*u
 return {u,lambda}
}

function mapPoint(u:number,lambda:number){
 const x=9+(u+1.6)/3.2*82
 const y=53-(lambda+0.55)/3.4*41
 return {x,y}
}

export function ArcLengthContinuation({notation,language,onBack,onNext}:Props){
 const copy=text[language]
 const [method,setMethod]=useState<'load'|'arc'>('arc')
 const [step,setStep]=useState(8)
 const [ds,setDs]=useState(.22)

 const curve=useMemo(()=>Array.from({length:140},(_,i)=>curvePoint(i/139)),[])
 const path=curve.map((p,i)=>{const m=mapPoint(p.u,p.lambda);return `${i?'L':'M'} ${m.x.toFixed(2)} ${m.y.toFixed(2)}`}).join(' ')
 const limitIndex=curve.reduce((best,p,i)=>curve[i>0?i-1:0].lambda<p.lambda?i:best,0)
 const limit=curve[limitIndex]
 const lim=mapPoint(limit.u,limit.lambda)

 const maxStep=24
 const t=method==='arc'?Math.min(.98,step/maxStep):Math.min(.57,step/maxStep*.85)
 const p=curvePoint(t)
 const pm=mapPoint(p.u,p.lambda)
 const loadFailed=method==='load' && step>15

 const formula=notation==='Python'
 ? 'solve([R(u, lam), dot(du,du) + alpha**2*dlam**2 - ds**2])'
 : notation==='Index'
 ? 'R_a(u,λ)=0,   Δu_aΔu_a + α²Δλ² = Δs²'
 : 'R(u,λ)=0,   ΔuᵀΔu + α²Δλ² = Δs²'

 return <section className="module-view module-view-stacked"><div className="lesson-copy">
  <div className="lesson-index">D11</div><h1>{copy.title}</h1><p className="lead">{copy.lead}</p>
  <div className="concept-card"><span>{copy.key}</span><strong>{copy.keyText}</strong></div>
  <div className="definition"><div className="definition-label">{copy.ordinary}</div><p>{copy.ordinaryText}</p></div>
  <div className="definition"><div className="definition-label">{copy.arc}</div><div className="formula">{formula}</div><p>{copy.arcText}</p></div>
  <div className="warning-card kinematics-warning"><span>{copy.warning}</span><strong>{copy.warningTitle}</strong><p>{copy.warningText}</p></div>
  <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
  <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>
  <ApplicationLinks language={language} items={[{ru:'Посткритический анализ конструкций',en:'Post-buckling analysis'},{ru:'Нелинейный метод конечных элементов',en:'Nonlinear finite element analysis'},{ru:'Предельные точки',en:'Limit points'},{ru:'Продолжение ветвей решения',en:'Solution continuation'}]}/>
  <div className="lesson-nav">{onBack&&<button className="text-button" onClick={onBack}>{copy.back}</button>}{onNext&&<button className="text-button" onClick={onNext}>{copy.next}</button>}</div>
 </div><div className="scene-column">
  <div className="scene-card">
   <div className="scene-head"><div><span className="scene-kicker">{copy.sceneKicker}</span><h2>{copy.sceneTitle}</h2></div><div className="live-badge">{copy.interactive}</div></div>
   <div className="mode-switcher">
    <button className={method==='load'?'active':''} onClick={()=>setMethod('load')}>{copy.ordinary}</button>
    <button className={method==='arc'?'active':''} onClick={()=>setMethod('arc')}>{copy.arc}</button>
   </div>
   <svg className="balance-scene" viewBox="0 0 100 62">
    <rect x="5" y="5" width="90" height="52" rx="8" fill="#111318"/>
    <line x1="9" y1="53" x2="93" y2="53" stroke="#69717C" strokeWidth=".55"/>
    <line x1="9" y1="53" x2="9" y2="10" stroke="#69717C" strokeWidth=".55"/>
    <path d={path} fill="none" stroke="#A9E3D2" strokeWidth="1.4"/>
    <circle cx={lim.x} cy={lim.y} r="2.1" fill="#F28C52"/>
    <text x={Math.min(76,lim.x+3)} y={Math.max(12,lim.y-3)} fill="#F4F2EC" fontSize="2.0">{copy.limit}</text>
    {!loadFailed&&<circle cx={pm.x} cy={pm.y} r="2" fill="#2864FF"/>}
    {loadFailed&&<>
      <line x1={pm.x-3} y1={pm.y-3} x2={pm.x+3} y2={pm.y+3} stroke="#F28C52" strokeWidth="1.2"/>
      <line x1={pm.x+3} y1={pm.y-3} x2={pm.x-3} y2={pm.y+3} stroke="#F28C52" strokeWidth="1.2"/>
    </>}
    {method==='arc'&&<circle cx={pm.x} cy={pm.y} r={Math.max(3,ds*15)} fill="none" stroke="#2864FF" strokeDasharray="2 2" strokeWidth=".65"/>}
    <text x="12" y="13" fill="#F4F2EC" fontSize="2.1">λ</text>
    <text x="86" y="58" fill="#F4F2EC" fontSize="2.1">u →</text>
   </svg>
   <div className="transport-metrics">
    <div><span>{copy.current}</span><strong>u={p.u.toFixed(2)}</strong></div>
    <div><span>λ</span><strong>{p.lambda.toFixed(2)}</strong></div>
    <div><span>{loadFailed?copy.fail:copy.success}</span><strong>{method==='arc'?'✓':loadFailed?'×':'✓'}</strong></div>
   </div>
   <div className="control-stack">
    <label><span>{copy.step}<strong>{step}</strong></span><input type="range" min="1" max={maxStep} step="1" value={step} onChange={e=>setStep(Number(e.target.value))}/></label>
    <label><span>{copy.radius}<strong>{ds.toFixed(2)}</strong></span><input type="range" min=".08" max=".38" step=".01" value={ds} onChange={e=>setDs(Number(e.target.value))}/></label>
   </div>
  </div>
  <div className="bottom-grid"><div className="prediction-card"><span>{copy.checkpoint}</span><strong>{copy.checkpointTitle}</strong><p>{copy.checkpointText}</p></div><div className="author-card"><span>{copy.conclusion}</span><strong>{copy.conclusionTitle}</strong><p>{copy.conclusionText}</p></div></div>
 </div></section>
}
