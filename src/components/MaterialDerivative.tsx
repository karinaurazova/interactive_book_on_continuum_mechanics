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
    back:'← T02',
    title:'Материальная производная',
    lead:'Материальная производная измеряет скорость изменения поля вдоль траектории движущейся частицы. Она объединяет изменение поля во времени в фиксированной точке и перенос частицы через пространственную неоднородность.',
    key:'ОПЕРАТОР ВДОЛЬ ДВИЖЕНИЯ',
    keyText:'Для скалярного поля φ(x,t): Dφ/Dt = ∂φ/∂t + v·∇φ. Та же идея переносится на компоненты векторных и тензорных полей.',
    local:'Локальная производная',
    localText:'∂φ/∂t отвечает на вопрос: как меняется поле во времени, если оставаться в одной и той же точке пространства?',
    material:'Материальная производная',
    materialText:'Dφ/Dt отвечает на вопрос: как меняется значение поля для частицы, которая сама движется через пространство?',
    general:'Общий оператор',
    generalText:'Для поля, заданного в пространственном описании, материальная производная строится как сумма локального и конвективного вкладов.',
    sceneKicker:'МАТЕРИАЛЬНАЯ ПРОИЗВОДНАЯ',
    sceneTitle:'сравни изменение поля в точке и вдоль движущейся частицы',
    time:'время t',
    particle:'материальная метка X',
    position:'положение частицы x',
    field:'значение φ',
    localTerm:'∂φ/∂t',
    convectiveTerm:'v ∂φ/∂x',
    materialTerm:'Dφ/Dt',
    check:'проверка по траектории',
    warning:'ВАЖНО',
    warningTitle:'D/Dt — не новая временная координата и не отдельная физическая величина.',
    warningText:'Это оператор дифференцирования вдоль движения. Он зависит и от самого поля, и от поля скорости, которое задаёт траектории частиц.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Когда Dφ/Dt совпадает с ∂φ/∂t?',
    questionText:'Если конвективный вклад исчезает, например когда поле пространственно однородно или частица в рассматриваемый момент покоится.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Материальная производная превращает пространственное поле в скорость изменения, которую испытывает конкретная частица.',
    conclusionText:'Следующий шаг — градиент скорости L = ∇v, который описывает локальную структуру движения.',
    interactive:'ИНТЕРАКТИВНО',
    particleLabel:'частица',
    next:'Перейти к градиенту скорости →',
  },
  en: {
    back:'← T02',
    title:'Material derivative',
    lead:'The material derivative measures the rate of change of a field along a moving particle trajectory. It combines local time variation at a fixed point with transport through spatial nonuniformity.',
    key:'DERIVATIVE ALONG MOTION',
    keyText:'For a scalar field φ(x,t): Dφ/Dt = ∂φ/∂t + v·∇φ. The same idea applies componentwise to vector and tensor fields.',
    local:'Local derivative',
    localText:'∂φ/∂t asks how the field changes in time while staying at the same spatial point.',
    material:'Material derivative',
    materialText:'Dφ/Dt asks how the field value changes for a particle that itself moves through space.',
    general:'General operator',
    generalText:'For a field written in the spatial description, the material derivative is the sum of local and convective contributions.',
    sceneKicker:'MATERIAL DERIVATIVE',
    sceneTitle:'compare field change at a point and along a moving particle',
    time:'time t',
    particle:'material label X',
    position:'particle position x',
    field:'field value φ',
    localTerm:'∂φ/∂t',
    convectiveTerm:'v ∂φ/∂x',
    materialTerm:'Dφ/Dt',
    check:'trajectory check',
    warning:'IMPORTANT',
    warningTitle:'D/Dt is not a new time coordinate or a separate physical quantity.',
    warningText:'It is a differentiation operator along the motion. It depends on both the field being differentiated and the velocity field that defines particle trajectories.',
    question:'CHECKPOINT',
    questionTitle:'When does Dφ/Dt equal ∂φ/∂t?',
    questionText:'When the convective contribution vanishes, for example if the field is spatially uniform or the particle is instantaneously at rest.',
    conclusion:'CONCLUSION',
    conclusionTitle:'The material derivative converts a spatial field into the rate of change experienced by a particular particle.',
    conclusionText:'Next we introduce the velocity gradient L = ∇v, which describes the local structure of motion.',
    interactive:'INTERACTIVE',
    particleLabel:'particle',
    next:'Continue to the velocity gradient →',
  }
} as const

function fmt(v:number,d=3){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function MaterialDerivative({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [time,setTime]=useState(0.22)
  const [X,setX]=useState(0.30)

  const data=useMemo(()=>{
    const w=2*Math.PI
    const a=1+0.22*Math.sin(w*time)
    const adot=0.22*w*Math.cos(w*time)
    const b=0.18*Math.sin(w*time+0.4)
    const bdot=0.18*w*Math.cos(w*time+0.4)

    const x=a*X+b
    const v=adot*X+bdot

    const phase=0.8*time
    const phi=Math.sin(Math.PI*x)*Math.cos(phase)+0.25*time

    const dphiDtFixed=-0.8*Math.sin(phase)*Math.sin(Math.PI*x)+0.25
    const dphiDx=Math.PI*Math.cos(Math.PI*x)*Math.cos(phase)
    const convective=v*dphiDx
    const material=dphiDtFixed+convective

    const h=1e-4
    const evalAlong=(tt:number)=>{
      const aa=1+0.22*Math.sin(w*tt)
      const bb=0.18*Math.sin(w*tt+0.4)
      const xx=aa*X+bb
      return Math.sin(Math.PI*xx)*Math.cos(0.8*tt)+0.25*tt
    }
    const trajectoryCheck=(evalAlong(time+h)-evalAlong(time-h))/(2*h)

    return {a,b,x,v,phi,dphiDtFixed,dphiDx,convective,material,trajectoryCheck}
  },[time,X])

  const notationLine =
    notation==='Index' ? 'Dφ/Dt = ∂φ/∂t + vⱼ ∂φ/∂xⱼ' :
    notation==='Matrix' ? 'Dφ/Dt = ∂φ/∂t + v·∇φ' :
    notation==='Python' ? 'DphiDt = dphi_dt + v * dphi_dx' :
    'Dφ/Dt = ∂φ/∂t + 𝐯·∇φ'

  const samples=Array.from({length:120},(_,i)=>{
    const x=-.25+1.5*i/119
    const y=Math.sin(Math.PI*x)*Math.cos(.8*time)+.25*time
    return [x,y] as [number,number]
  })
  const map=(p:[number,number])=>[12+76*(p[0]+.25)/1.5,48-12*p[1]]
  const curve=samples.map(p=>map(p).join(',')).join(' ')
  const pp=map([data.x,data.phi])

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">T03 / 11</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.local}</div>
          <p>{copy.localText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.material}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.materialText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.general}</div>
          <div className="formula">D/Dt = ∂/∂t + 𝐯·∇</div>
          <p>{copy.generalText}</p>
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
            <line x1="12" y1="48" x2="88" y2="48" stroke="#5E6774" strokeWidth=".6"/>
            <polyline points={curve} fill="none" stroke="#2864FF" strokeWidth=".9"/>
            <circle cx={pp[0]} cy={pp[1]} r="2" fill="#A9E3D2"/>
            <line x1={pp[0]} y1="58" x2={pp[0]} y2={pp[1]+2} stroke="#A9E3D2" strokeDasharray="1.2 1.2" strokeWidth=".6"/>
            <text x="9" y="13" fill="#8E96A3" fontSize="2.7">φ(x,t)</text>
            <text x={pp[0]+2} y={pp[1]-2} fill="#A9E3D2" fontSize="2.5">{copy.particleLabel}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.time} <strong>{fmt(time,2)}</strong></span><input type="range" min="0" max="1" step=".01" value={time} onChange={e=>setTime(Number(e.target.value))}/></label>
            <label><span>{copy.particle} <strong>{fmt(X,2)}</strong></span><input type="range" min="-.10" max=".80" step=".01" value={X} onChange={e=>setX(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.position}</span><strong>{fmt(data.x)}</strong></div>
            <div><span>{copy.field}</span><strong>{fmt(data.phi)}</strong></div>
            <div><span>{copy.localTerm}</span><strong>{fmt(data.dphiDtFixed)}</strong></div>
            <div><span>{copy.convectiveTerm}</span><strong>{fmt(data.convective)}</strong></div>
            <div><span>{copy.materialTerm}</span><strong>{fmt(data.material)}</strong></div>
            <div><span>{copy.check}</span><strong>{fmt(data.trajectoryCheck)}</strong></div>
            <div><span>|Δ|</span><strong>{fmt(Math.abs(data.material-data.trajectoryCheck),6)}</strong></div>
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
