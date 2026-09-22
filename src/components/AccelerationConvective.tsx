import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

const text = {
  ru: {
    back:'← T01',
    title:'Ускорение и конвективный вклад',
    lead:'В материальном описании ускорение — это вторая производная движения по времени. В пространственном описании та же величина распадается на локальное изменение поля скорости и перенос частицы через неоднородное поле.',
    key:'ОДНО УСКОРЕНИЕ — ДВА ВКЛАДА',
    keyText:'Для пространственного поля скорости v(x,t) ускорение частицы равно материальной производной: a = ∂v/∂t + (v·∇)v.',
    material:'Материальное ускорение',
    materialText:'При фиксированной материальной метке X: A(X,t) = ∂²χ(X,t)/∂t².',
    spatial:'Пространственная форма',
    spatialText:'В пространственном описании нужно учитывать не только изменение v во времени в фиксированной точке, но и движение частицы через пространственный градиент скорости.',
    sceneKicker:'УСКОРЕНИЕ',
    sceneTitle:'разложи ускорение на локальный и конвективный вклады',
    time:'время t',
    selectedX:'материальная метка X',
    position:'текущее положение x',
    velocity:'скорость v',
    acceleration:'ускорение a',
    local:'локальный вклад ∂v/∂t',
    convective:'конвективный вклад (v·∇)v',
    sum:'сумма вкладов',
    error:'ошибка проверки',
    warning:'ВАЖНО',
    warningTitle:'Ненулевой конвективный вклад возможен даже при стационарном поле скорости.',
    warningText:'Если ∂v/∂t = 0, но поле неоднородно по пространству, частица всё равно может ускоряться, перемещаясь через разные значения v.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Когда конвективный вклад исчезает?',
    questionText:'Например, если поле скорости пространственно однородно, то ∇v = 0 и (v·∇)v = 0.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Материальная производная соединяет два описания движения.',
    conclusionText:'Следующий модуль введёт оператор D/Dt как общий способ дифференцировать любое поле вдоль движения частицы.',
    interactive:'ИНТЕРАКТИВНО',
    next:'Перейти к материальной производной →',
  },
  en: {
    back:'← T01',
    title:'Acceleration and the convective contribution',
    lead:'In the material description, acceleration is the second time derivative of motion. In the spatial description, the same quantity splits into local change of the velocity field and transport through a nonuniform field.',
    key:'ONE ACCELERATION — TWO CONTRIBUTIONS',
    keyText:'For a spatial velocity field v(x,t), particle acceleration is the material derivative: a = ∂v/∂t + (v·∇)v.',
    material:'Material acceleration',
    materialText:'At fixed material label X: A(X,t) = ∂²χ(X,t)/∂t².',
    spatial:'Spatial form',
    spatialText:'The spatial description must include both local time variation of v at a fixed point and particle motion through the spatial velocity gradient.',
    sceneKicker:'ACCELERATION',
    sceneTitle:'split acceleration into local and convective parts',
    time:'time t',
    selectedX:'material label X',
    position:'current position x',
    velocity:'velocity v',
    acceleration:'acceleration a',
    local:'local term ∂v/∂t',
    convective:'convective term (v·∇)v',
    sum:'sum of terms',
    error:'verification error',
    warning:'IMPORTANT',
    warningTitle:'The convective term can be nonzero even in a steady velocity field.',
    warningText:'If ∂v/∂t = 0 but the field is spatially nonuniform, a particle may still accelerate while moving through different values of v.',
    question:'CHECKPOINT',
    questionTitle:'When does the convective contribution vanish?',
    questionText:'For example, if the velocity field is spatially uniform, then ∇v = 0 and (v·∇)v = 0.',
    conclusion:'CONCLUSION',
    conclusionTitle:'The material derivative connects the two descriptions of motion.',
    conclusionText:'The next module introduces D/Dt as the general operator for differentiating any field along particle motion.',
    interactive:'INTERACTIVE',
    next:'Continue to the material derivative →',
  }
} as const

function fmt(v:number,d=3){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function AccelerationConvective({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [time,setTime]=useState(0.28)
  const [X,setX]=useState(0.32)

  const data=useMemo(()=>{
    const w=2*Math.PI
    const a=1+0.28*Math.sin(w*time)
    const adot=0.28*w*Math.cos(w*time)
    const addot=-0.28*w*w*Math.sin(w*time)

    const b=0.22*Math.sin(w*time+0.45)
    const bdot=0.22*w*Math.cos(w*time+0.45)
    const bddot=-0.22*w*w*Math.sin(w*time+0.45)

    const x=a*X+b
    const v=adot*X+bdot
    const A=addot*X+bddot

    const alpha=adot/a
    const beta=bdot-alpha*b

    const alphadot=(addot*a-adot*adot)/(a*a)
    const betadot=bddot-alphadot*b-alpha*bdot

    const local=alphadot*x+betadot
    const dvdx=alpha
    const convective=v*dvdx
    const spatialSum=local+convective

    return {a,adot,addot,b,bdot,bddot,x,v,A,alpha,beta,local,convective,spatialSum}
  },[time,X])

  const notationLine =
    notation==='Index' ? 'aᵢ = ∂vᵢ/∂t + vⱼ ∂vᵢ/∂xⱼ' :
    notation==='Matrix' ? 'a = ∂v/∂t + (v·∇)v' :
    notation==='Python' ? 'a = dv_dt + v * dv_dx' :
    '𝐚 = ∂𝐯/∂t + (𝐯·∇)𝐯'

  const mapX=(q:number)=>12+76*(q+0.4)/1.8
  const p=mapX(data.x)
  const vEnd=p+7*data.v
  const aEnd=p+2.3*data.A

  const localEnd=p+2.3*data.local
  const convEnd=localEnd+2.3*data.convective

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">T02 / 11</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.material}</div>
          <div className="formula">𝐀(𝐗,t) = (∂²χ(𝐗,t)/∂t²)_X</div>
          <p>{copy.materialText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.spatial}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.spatialText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

        <button className="primary-button" onClick={onNext}>{copy.next}</button>
      </div>

      <div className="scene-column">
        <div className="scene-card">
          <div className="scene-head">
            <div>
              <span className="scene-kicker">{copy.sceneKicker}</span>
              <h2>{copy.sceneTitle}</h2>
            </div>
            <div className="live-badge">{copy.interactive}</div>
          </div>

          <svg className="transport-scene" viewBox="0 0 100 70" role="img">
            <rect x="5" y="6" width="90" height="58" rx="9" fill="#111318"/>
            <line x1="12" y1="38" x2="88" y2="38" stroke="#5E6774" strokeWidth=".7"/>
            <circle cx={p} cy="38" r="2" fill="#A9E3D2"/>

            <line x1={p} y1="38" x2={vEnd} y2="38" stroke="#2864FF" strokeWidth="1.4"/>
            <text x={vEnd+1} y="35" fill="#2864FF" fontSize="2.5">v</text>

            <line x1={p} y1="45" x2={aEnd} y2="45" stroke="#DD7A2B" strokeWidth="1.4"/>
            <text x={aEnd+1} y="49" fill="#DD7A2B" fontSize="2.5">a</text>

            <line x1={p} y1="55" x2={localEnd} y2="55" stroke="#A9E3D2" strokeWidth="1.15"/>
            <line x1={localEnd} y1="55" x2={convEnd} y2="55" stroke="#2864FF" strokeWidth="1.15"/>
            <circle cx={convEnd} cy="55" r=".9" fill="#F4F2EC"/>
          </svg>

          <div className="control-stack">
            <label><span>{copy.time} <strong>{fmt(time,2)}</strong></span><input type="range" min="0" max="1" step=".01" value={time} onChange={e=>setTime(Number(e.target.value))}/></label>
            <label><span>{copy.selectedX} <strong>{fmt(X,2)}</strong></span><input type="range" min="-.15" max=".85" step=".01" value={X} onChange={e=>setX(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.position}</span><strong>{fmt(data.x)}</strong></div>
            <div><span>{copy.velocity}</span><strong>{fmt(data.v)}</strong></div>
            <div><span>{copy.acceleration}</span><strong>{fmt(data.A)}</strong></div>
            <div><span>{copy.local}</span><strong>{fmt(data.local)}</strong></div>
            <div><span>{copy.convective}</span><strong>{fmt(data.convective)}</strong></div>
            <div><span>{copy.sum}</span><strong>{fmt(data.spatialSum)}</strong></div>
            <div><span>{copy.error}</span><strong>{fmt(Math.abs(data.A-data.spatialSum),6)}</strong></div>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="prediction-card">
            <span>{copy.question}</span>
            <strong>{copy.questionTitle}</strong>
            <p>{copy.questionText}</p>
          </div>
          <div className="author-card">
            <span>{copy.conclusion}</span>
            <strong>{copy.conclusionTitle}</strong>
            <p>{copy.conclusionText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
