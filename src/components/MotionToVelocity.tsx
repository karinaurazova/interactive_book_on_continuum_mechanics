import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onNext: () => void
}

const text = {
  ru: {
    title: 'От движения к скорости',
    lead: 'До сих пор мы описывали, где находится материальная точка и как меняется её окрестность. Теперь добавим время как активную переменную и спросим: с какой скоростью движется одна и та же материальная точка?',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'Материальная скорость получается дифференцированием отображения движения по времени при фиксированной материальной метке X.',
    definition: 'Материальная скорость',
    definitionText: 'Фиксируем одну и ту же материальную точку X и наблюдаем, как меняется её текущее положение x = χ(X,t).',
    fixed: 'Что фиксировано?',
    fixedText: 'При ∂χ/∂t фиксирована материальная метка X. Мы следим за одной и той же частицей континуума.',
    sceneKicker: 'ВРЕМЯ В КИНЕМАТИКЕ',
    sceneTitle: 'двигай время и сравни положение, траекторию и скорость',
    time: 'время t',
    amplitude: 'амплитуда движения',
    frequency: 'частота',
    materialPoint: 'материальная метка X',
    position: 'текущее положение x',
    velocity: 'скорость v',
    speed: 'модуль скорости',
    trajectory: 'траектория выбранной материальной точки',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Что именно нужно держать фиксированным, когда вычисляем скорость частицы?',
    questionText: 'Материальную метку X. Если вместо неё фиксировать точку пространства x, мы уже перейдём к другому — пространственному — описанию.',
    conclusion: 'ВЫВОД',
    conclusionTitle: 'Скорость — это временная производная движения, а не новое независимое поле.',
    conclusionText: 'Следующий шаг — показать, как эта же скорость описывается как поле v(x,t) в текущей конфигурации.',
    interactive: 'ИНТЕРАКТИВНО',
    next: 'Перейти к двум описаниям скорости →',
  },
  en: {
    title: 'From motion to velocity',
    lead: 'So far we have described where a material point is and how its neighborhood changes. We now activate time and ask: how fast is the same material point moving?',
    key: 'KEY IDEA',
    keyText: 'Material velocity is obtained by differentiating the motion map with respect to time while keeping the material label X fixed.',
    definition: 'Material velocity',
    definitionText: 'Fix the same material point X and observe how its current position x = χ(X,t) changes.',
    fixed: 'What is held fixed?',
    fixedText: 'In ∂χ/∂t the material label X is fixed. We follow the same continuum particle.',
    sceneKicker: 'TIME IN KINEMATICS',
    sceneTitle: 'move time and compare position, trajectory, and velocity',
    time: 'time t',
    amplitude: 'motion amplitude',
    frequency: 'frequency',
    materialPoint: 'material label X',
    position: 'current position x',
    velocity: 'velocity v',
    speed: 'speed',
    trajectory: 'trajectory of the selected material point',
    question: 'CHECKPOINT',
    questionTitle: 'What must be held fixed when computing particle velocity?',
    questionText: 'The material label X. Fixing a spatial location x instead leads to the spatial description.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'Velocity is the time derivative of motion, not an independent new field.',
    conclusionText: 'The next step is to describe the same velocity as a field v(x,t) in the current configuration.',
    interactive: 'INTERACTIVE',
    next: 'Continue to the two velocity descriptions →',
  },
} as const

function fmt(v:number,d=2){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

export function MotionToVelocity({notation,language,onNext}:Props){
  const copy=text[language]
  const [time,setTime]=useState(0.35)
  const [amplitude,setAmplitude]=useState(0.55)
  const [frequency,setFrequency]=useState(1.10)
  const X:[number,number]=[0.35,0.20]

  const data=useMemo(()=>{
    const w=2*Math.PI*frequency
    const phase=w*time
    const x:[number,number]=[
      X[0]+amplitude*Math.sin(phase),
      X[1]+0.55*amplitude*Math.sin(phase+Math.PI/3),
    ]
    const v:[number,number]=[
      amplitude*w*Math.cos(phase),
      0.55*amplitude*w*Math.cos(phase+Math.PI/3),
    ]
    return {x,v,w}
  },[time,amplitude,frequency])

  const path=Array.from({length:120},(_,i)=>{
    const tt=i/119
    const phase=2*Math.PI*frequency*tt
    return [
      X[0]+amplitude*Math.sin(phase),
      X[1]+0.55*amplitude*Math.sin(phase+Math.PI/3),
    ] as [number,number]
  })

  const map=(p:[number,number])=>[50+28*p[0],40-28*p[1]]
  const p=map(data.x)
  const velScale=0.055
  const pv=map([data.x[0]+velScale*data.v[0],data.x[1]+velScale*data.v[1]])
  const pathPoints=path.map(q=>map(q).join(',')).join(' ')

  const notationLine =
    notation==='Index' ? 'vᵢ(X,t) = (∂χᵢ/∂t)_X' :
    notation==='Matrix' ? 'v(X,t) = ∂x(X,t)/∂t' :
    notation==='Python' ? 'v = dchi_dt(X, t)' :
    '𝐯(𝐗,t) = (∂χ(𝐗,t)/∂t)_X'

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <div className="lesson-index">T00 / 11</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.definition}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.definitionText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.fixed}</div>
          <p>{copy.fixedText}</p>
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

          <svg className="transport-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <polyline points={pathPoints} fill="none" stroke="#5E6774" strokeWidth=".75" strokeDasharray="1.6 1.6"/>
            <circle cx={p[0]} cy={p[1]} r="2.0" fill="#A9E3D2"/>
            <line x1={p[0]} y1={p[1]} x2={pv[0]} y2={pv[1]} stroke="#2864FF" strokeWidth="1.5"/>
            <circle cx={map(X)[0]} cy={map(X)[1]} r="1.2" fill="#F4F2EC" opacity=".55"/>
            <text x={p[0]+2.5} y={p[1]-2} fill="#A9E3D2" fontSize="2.7">x(t)</text>
            <text x={pv[0]+1.5} y={pv[1]-1} fill="#2864FF" fontSize="2.7">v</text>
            <text x="9" y="13" fill="#8E96A3" fontSize="2.7">{copy.trajectory}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.time} <strong>{fmt(time)}</strong></span><input type="range" min="0" max="1" step=".01" value={time} onChange={e=>setTime(Number(e.target.value))}/></label>
            <label><span>{copy.amplitude} <strong>{fmt(amplitude)}</strong></span><input type="range" min=".10" max=".90" step=".01" value={amplitude} onChange={e=>setAmplitude(Number(e.target.value))}/></label>
            <label><span>{copy.frequency} <strong>{fmt(frequency)}</strong></span><input type="range" min=".25" max="2.0" step=".01" value={frequency} onChange={e=>setFrequency(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.materialPoint}</span><strong>[{fmt(X[0])}, {fmt(X[1])}]</strong></div>
            <div><span>{copy.position}</span><strong>[{fmt(data.x[0])}, {fmt(data.x[1])}]</strong></div>
            <div><span>{copy.velocity}</span><strong>[{fmt(data.v[0])}, {fmt(data.v[1])}]</strong></div>
            <div><span>{copy.speed}</span><strong>{fmt(Math.hypot(data.v[0],data.v[1]))}</strong></div>
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
