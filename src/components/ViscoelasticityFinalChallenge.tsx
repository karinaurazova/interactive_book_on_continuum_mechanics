import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props={notation:NotationMode;language:Language;onBack?:()=>void}
type CaseId='model'|'experiment'|'identifiability'|'numerics'

const text={
ru:{
title:'Итоговая самопроверка по вязкоупругости и памяти материала',
lead:'В финальном модуле нужно не вспоминать определения, а интерпретировать механическое поведение. Для каждого кейса выбери наиболее обоснованный вывод и проверь, согласуется ли он с физикой памяти, диссипации, идентификации и вычислительной реализацией.',
key:'ГЛАВНЫЙ НАВЫК — СВЯЗАТЬ НАБЛЮДАЕМЫЙ ОТКЛИК С МЕХАНИЗМОМ МОДЕЛИ',
keyText:'Вязкоупругость нельзя распознать по одному числу. Нужно одновременно учитывать историю нагружения, временной масштаб, форму протокола и структуру конститутивной модели.',
caseLabel:'кейс',
correct:'верно',
incorrect:'неверно',
check:'Проверить',
reset:'Сбросить',
score:'результат',
model:'Модель по эксперименту',
experiment:'Проектирование эксперимента',
identifiability:'Идентифицируемость',
numerics:'Численная реализация',
question1:'В relaxation-тесте напряжение быстро падает, но выходит на ненулевое плато. Какой вывод наиболее обоснован?',
a11:'Чистая модель Максвелла',
a12:'Стандартная линейная модель твёрдого тела или обобщённая модель с ненулевым равновесным модулем',
a13:'Чисто упругий материал',
question2:'Нужно разделить два близких времени релаксации τ₁ и τ₂. Что полезнее?',
a21:'Добавить много точек в уже узкое временное окно',
a22:'Расширить окно так, чтобы эксперимент охватывал оба переходных масштаба',
a23:'Оставить один протокол и увеличить число параметров модели',
question3:'Два набора параметров дают почти одинаковую ошибку, а столбцы матрицы чувствительности почти параллельны. Что это означает?',
a31:'Параметры хорошо идентифицируемы',
a32:'Есть практическая неидентифицируемость или сильная корреляция параметров',
a33:'Нужно только уменьшить временной шаг интегрирования',
question4:'Неявный constitutive update устойчив, но глобальный Newton в МКЭ сходится медленно. Что следует проверить в первую очередь?',
a41:'Согласованность алгоритмической касательной',
a42:'Увеличить только число ветвей Максвелла',
a43:'Удалить внутренние переменные из модели',
warning:'ВАЖНО',
warningTitle:'Правильный ответ здесь — это не “название модели”, а логика вывода.',
warningText:'В реальной задаче несколько моделей могут быть согласованы с одним экспериментом. Поэтому интерпретация должна учитывать ограничения данных и альтернативные объяснения.',
conclusion:'ИТОГ ГЛАВЫ',
conclusionTitle:'Вязкоупругость — это теория состояния, истории и временных масштабов.',
conclusionText:'Теперь можно переходить к следующему крупному разделу МСС, сохранив связку: физика → конститутивная модель → эксперимент → идентификация → вычислительная реализация.',
deepen:'Углубиться',
deepenText:'Хорошая самостоятельная проверка главы — взять неизвестный набор синтетических данных и пройти полный цикл: выбрать класс модели, предложить эксперимент, оценить идентифицируемость, реализовать update и провести независимую валидацию.',
back:'← E12'
},
en:{
title:'Final self-check on viscoelasticity and material memory',
lead:'The final module is not about recalling definitions but interpreting mechanical behavior. For each case, select the most justified conclusion and test whether it is consistent with memory, dissipation, identifiability, and computational implementation.',
key:'THE MAIN SKILL IS TO CONNECT OBSERVED RESPONSE TO A MODEL MECHANISM',
keyText:'Viscoelasticity cannot be identified from one number. Loading history, timescale, protocol, and constitutive structure must be interpreted together.',
caseLabel:'case',correct:'correct',incorrect:'incorrect',check:'Check',reset:'Reset',score:'score',
model:'Model from experiment',experiment:'Experiment design',identifiability:'Identifiability',numerics:'Numerical implementation',
question1:'In a relaxation test, stress decays rapidly but approaches a nonzero plateau. What is the most justified conclusion?',
a11:'Pure Maxwell model',a12:'Standard linear solid or generalized model with a nonzero equilibrium modulus',a13:'Purely elastic material',
question2:'You need to separate two nearby relaxation times τ₁ and τ₂. What is more useful?',
a21:'Add many points inside the same narrow time window',a22:'Widen the window so both transition scales are covered',a23:'Keep one protocol and increase the number of model parameters',
question3:'Two parameter sets give nearly the same objective value and sensitivity-matrix columns are almost parallel. What does this indicate?',
a31:'Parameters are well identifiable',a32:'Practical non-identifiability or strong parameter correlation',a33:'Only the integration time step must be reduced',
question4:'An implicit constitutive update is stable, but global FEM Newton iterations converge slowly. What should be checked first?',
a41:'Consistency of the algorithmic tangent',a42:'Only increase the number of Maxwell branches',a43:'Remove internal variables from the model',
warning:'IMPORTANT',warningTitle:'The right answer is a reasoning chain, not just a model name.',
warningText:'In real applications, several models may be compatible with one experiment. Interpretation must therefore account for data limitations and alternative explanations.',
conclusion:'CHAPTER SUMMARY',conclusionTitle:'Viscoelasticity is a theory of state, history, and timescales.',
conclusionText:'You can now move to the next major continuum-mechanics section while keeping the chain: physics → constitutive model → experiment → identification → computational implementation.',
deepen:'Go deeper',deepenText:'A strong independent exercise is to take an unknown synthetic dataset and complete the full cycle: select a model class, design an experiment, assess identifiability, implement the update, and validate independently.',
back:'← E12'
}} as const

const answers:Record<CaseId,number>={model:1,experiment:1,identifiability:1,numerics:0}

export function ViscoelasticityFinalChallenge({notation,language,onBack}:Props){
const c=text[language]
const [selected,setSelected]=useState<Record<CaseId,number|null>>({model:null,experiment:null,identifiability:null,numerics:null})
const [checked,setChecked]=useState(false)
const cases=useMemo(()=>[
{id:'model' as CaseId,title:c.model,q:c.question1,opts:[c.a11,c.a12,c.a13]},
{id:'experiment' as CaseId,title:c.experiment,q:c.question2,opts:[c.a21,c.a22,c.a23]},
{id:'identifiability' as CaseId,title:c.identifiability,q:c.question3,opts:[c.a31,c.a32,c.a33]},
{id:'numerics' as CaseId,title:c.numerics,q:c.question4,opts:[c.a41,c.a42,c.a43]},
],[c])
const score=cases.reduce((s,k)=>s+(selected[k.id]===answers[k.id]?1:0),0)
const formula=notation==='Python'?"score = sum(selected[k] == answer[k] for k in cases)":notation==='Index'?"\text{decision}_k = \arg\max_j\;P(H_j\mid data_k)":"evidence + assumptions → defensible conclusion"
return <section className="module-view module-view-stacked">
<div className="lesson-copy">
<div className="lesson-index">E13</div><h1>{c.title}</h1><p className="lead">{c.lead}</p>
<div className="concept-card"><span>{c.key}</span><strong>{c.keyText}</strong></div>
<div className="definition"><div className="definition-label">{c.caseLabel}</div><div className="formula">{formula}</div><p>{c.lead}</p></div>
<div className="warning-card kinematics-warning"><span>{c.warning}</span><strong>{c.warningTitle}</strong><p>{c.warningText}</p></div>
<DepthNote label={c.deepen}><p>{c.deepenText}</p></DepthNote>
{onBack&&<button className="text-button" onClick={onBack}>{c.back}</button>}
</div>
<div className="scene-column">
<div className="scene-card">
<div className="scene-head"><div><span className="scene-kicker">{language==='ru'?'ФИНАЛЬНАЯ САМОПРОВЕРКА':'FINAL SELF-CHECK'}</span><h2>{c.title}</h2></div></div>
<div style={{display:'grid',gap:12}}>
{cases.map((k,idx)=><div key={k.id} className="definition component-vector-card">
<div className="definition-label">{idx+1}. {k.title}</div>
<p style={{color:'var(--paper)'}}>{k.q}</p>
<div className="mini-toggle-row">
{k.opts.map((opt,i)=><button key={i} className={selected[k.id]===i?'toggle active':'toggle'} onClick={()=>{setSelected(s=>({...s,[k.id]:i}));setChecked(false)}}>{opt}</button>)}
</div>
{checked&&selected[k.id]!==null&&<p style={{marginTop:10,color:selected[k.id]===answers[k.id]?'var(--mint)':'#f0a261'}}>{selected[k.id]===answers[k.id]?c.correct:c.incorrect}</p>}
</div>)}
</div>
<div className="transport-metrics" style={{marginTop:14}}><div><span>{c.score}</span><strong>{checked?score+'/4':'—'}</strong></div></div>
<div className="mini-toggle-row" style={{marginTop:14}}>
<button className="primary-button" onClick={()=>setChecked(true)}>{c.check}</button>
<button className="text-button" onClick={()=>{setSelected({model:null,experiment:null,identifiability:null,numerics:null});setChecked(false)}}>{c.reset}</button>
</div>
</div>
<div className="bottom-grid">
<div className="author-card"><span>{c.conclusion}</span><strong>{c.conclusionTitle}</strong><p>{c.conclusionText}</p></div>
<div className="prediction-card"><span>{c.score}</span><strong>{checked?score+'/4':'—'}</strong><p>{checked?(score===4?(language==='ru'?'Все четыре механизма интерпретированы согласованно.':'All four mechanisms are interpreted consistently.'):(language==='ru'?'Вернись к кейсам, где вывод не согласуется с механизмом модели.':'Revisit the cases where the conclusion does not match the model mechanism.')):(language==='ru'?'Ответь на все четыре кейса и проверь себя.':'Answer all four cases and check yourself.')}</p></div>
</div>
</div>
</section>
}
