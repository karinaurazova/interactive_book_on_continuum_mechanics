import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
  onNext: () => void
}

type M2 = [[number,number],[number,number]]

const text = {
  ru: {
    back:'← T03',
    title:'Градиент скорости',
    lead:'Градиент скорости описывает, как меняется скорость от точки к точке в текущей конфигурации. Для движения с градиентом деформации F он связан с временной кинематикой точной формулой L = ḞF⁻¹.',
    key:'ЛОКАЛЬНАЯ СТРУКТУРА ДВИЖЕНИЯ',
    keyText:'Если две текущие точки разделены малым вектором dx, то разность их скоростей в первом порядке равна dv = L dx.',
    definition:'Градиент скорости',
    definitionText:'L = ∇v — пространственный градиент поля скорости. Его компоненты показывают, как компоненты скорости меняются по пространственным координатам.',
    bridge:'Связь с градиентом деформации',
    bridgeText:'Поскольку dx = F dX, дифференцирование по времени при фиксированном dX даёт dṡx = Ḟ dX = ḞF⁻¹ dx.',
    time:'время t',
    direction:'направление dx',
    length:'длина dx',
    sceneKicker:'ГРАДИЕНТ СКОРОСТИ',
    sceneTitle:'сравни скорости двух близких точек и проверь dv = L dx',
    matrixF:'F',
    matrixFdot:'Ḟ',
    matrixL:'L',
    dx:'dx',
    dvDirect:'dv напрямую',
    dvFromL:'L dx',
    error:'ошибка',
    detF:'det F',
    warning:'ВАЖНО',
    warningTitle:'L относится к текущей конфигурации.',
    warningText:'В формуле L = ḞF⁻¹ множитель F⁻¹ переводит текущий вектор dx обратно к материальному приращению dX. Поэтому порядок множителей принципиален.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Может ли L быть ненулевым при J = 1?',
    questionText:'Да. Например, локальное движение может менять форму и ориентацию без изменения объёма. Сам по себе J не определяет весь градиент скорости.',
    conclusion:'ВЫВОД',
    conclusionTitle:'L — мгновенный локальный аналог того, чем F является для конечной деформации.',
    conclusionText:'Следующим шагом разложим L на симметричную и кососимметричную части: D и W.',
    interactive:'ИНТЕРАКТИВНО',
    next:'Перейти к D и W →',
  },
  en: {
    back:'← T03',
    title:'Velocity gradient',
    lead:'The velocity gradient describes how velocity changes from point to point in the current configuration. For a motion with deformation gradient F, it is linked to time-dependent kinematics by L = ḞF⁻¹.',
    key:'LOCAL STRUCTURE OF MOTION',
    keyText:'If two current points are separated by a small vector dx, their velocity difference is, to first order, dv = L dx.',
    definition:'Velocity gradient',
    definitionText:'L = ∇v is the spatial gradient of the velocity field. Its components describe how velocity components vary with spatial coordinates.',
    bridge:'Connection to the deformation gradient',
    bridgeText:'Since dx = F dX, differentiating in time at fixed dX gives dẋ = Ḟ dX = ḞF⁻¹ dx.',
    time:'time t',
    direction:'direction of dx',
    length:'length of dx',
    sceneKicker:'VELOCITY GRADIENT',
    sceneTitle:'compare velocities at two nearby points and verify dv = L dx',
    matrixF:'F',
    matrixFdot:'Ḟ',
    matrixL:'L',
    dx:'dx',
    dvDirect:'direct dv',
    dvFromL:'L dx',
    error:'error',
    detF:'det F',
    warning:'IMPORTANT',
    warningTitle:'L belongs to the current configuration.',
    warningText:'In L = ḞF⁻¹, the factor F⁻¹ maps the current vector dx back to the material increment dX. The multiplication order therefore matters.',
    question:'CHECKPOINT',
    questionTitle:'Can L be nonzero when J = 1?',
    questionText:'Yes. Local motion may change shape and orientation without changing volume. J alone does not determine the full velocity gradient.',
    conclusion:'CONCLUSION',
    conclusionTitle:'L is the instantaneous local counterpart of what F describes for finite deformation.',
    conclusionText:'Next we decompose L into its symmetric and skew-symmetric parts: D and W.',
    interactive:'INTERACTIVE',
    next:'Continue to D and W →',
  }
} as const

function fmt(v:number,d=3){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

function det(A:M2){ return A[0][0]*A[1][1]-A[0][1]*A[1][0] }

function inv(A:M2):M2{
  const d=det(A)
  return [[A[1][1]/d,-A[0][1]/d],[-A[1][0]/d,A[0][0]/d]]
}

function mul(A:M2,B:M2):M2{
  return [
    [A[0][0]*B[0][0]+A[0][1]*B[1][0],A[0][0]*B[0][1]+A[0][1]*B[1][1]],
    [A[1][0]*B[0][0]+A[1][1]*B[1][0],A[1][0]*B[0][1]+A[1][1]*B[1][1]],
  ]
}

function matVec(A:M2,x:[number,number]):[number,number]{
  return [A[0][0]*x[0]+A[0][1]*x[1],A[1][0]*x[0]+A[1][1]*x[1]]
}

export function VelocityGradient({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [time,setTime]=useState(0.20)
  const [angle,setAngle]=useState(28)
  const [length,setLength]=useState(0.28)

  const data=useMemo(()=>{
    const w=2*Math.PI
    const F:M2=[
      [1+0.18*Math.sin(w*time), 0.22*Math.sin(w*time+0.40)],
      [0.10*Math.cos(w*time-0.20), 1+0.14*Math.cos(w*time)],
    ]
    const Fdot:M2=[
      [0.18*w*Math.cos(w*time), 0.22*w*Math.cos(w*time+0.40)],
      [-0.10*w*Math.sin(w*time-0.20), -0.14*w*Math.sin(w*time)],
    ]
    const Finv=inv(F)
    const L=mul(Fdot,Finv)

    const a=angle*Math.PI/180
    const dx:[number,number]=[length*Math.cos(a),length*Math.sin(a)]
    const dX=matVec(Finv,dx)
    const dvDirect=matVec(Fdot,dX)
    const dvFromL=matVec(L,dx)

    const x0:[number,number]=[0.22,0.14]
    const x1:[number,number]=[x0[0]+dx[0],x0[1]+dx[1]]
    const v0=matVec(L,x0)
    const v1=matVec(L,x1)

    return {F,Fdot,L,dx,dX,dvDirect,dvFromL,x0,x1,v0,v1}
  },[time,angle,length])

  const err=Math.hypot(
    data.dvDirect[0]-data.dvFromL[0],
    data.dvDirect[1]-data.dvFromL[1]
  )

  const notationLine =
    notation==='Index' ? 'Lᵢⱼ = ∂vᵢ/∂xⱼ = Ḟᵢₖ(F⁻¹)ₖⱼ' :
    notation==='Matrix' ? 'L = ∇v = Ḟ F⁻¹' :
    notation==='Python' ? 'L = Fdot @ np.linalg.inv(F)' :
    '𝐋 = ∇𝐯 = Ḟ F⁻¹'

  const map=(p:[number,number])=>[48+28*p[0],40-28*p[1]]
  const p0=map(data.x0)
  const p1=map(data.x1)
  const velScale=.055
  const v0e=map([data.x0[0]+velScale*data.v0[0],data.x0[1]+velScale*data.v0[1]])
  const v1e=map([data.x1[0]+velScale*data.v1[0],data.x1[1]+velScale*data.v1[1]])

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">T04 / 11</div>
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
          <div className="definition-label">{copy.bridge}</div>
          <div className="formula">d𝐯 = 𝐋 d𝐱 = Ḟ d𝐗</div>
          <p>{copy.bridgeText}</p>
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

          <svg className="transport-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <line x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke="#A9E3D2" strokeWidth="1.1"/>
            <circle cx={p0[0]} cy={p0[1]} r="1.8" fill="#F4F2EC"/>
            <circle cx={p1[0]} cy={p1[1]} r="1.8" fill="#F4F2EC"/>
            <line x1={p0[0]} y1={p0[1]} x2={v0e[0]} y2={v0e[1]} stroke="#2864FF" strokeWidth="1.4"/>
            <line x1={p1[0]} y1={p1[1]} x2={v1e[0]} y2={v1e[1]} stroke="#2864FF" strokeWidth="1.4"/>
            <text x={p0[0]-2} y={p0[1]+5} fill="#8E96A3" fontSize="2.4">x</text>
            <text x={p1[0]+1} y={p1[1]+5} fill="#8E96A3" fontSize="2.4">x+dx</text>
          </svg>

          <div className="velocity-gradient-matrices">
            {[
              [copy.matrixF,data.F],
              [copy.matrixFdot,data.Fdot],
              [copy.matrixL,data.L],
            ].map(([label,M])=>(
              <div className="gradient-matrix-card" key={String(label)}>
                <span>{label as string}</span>
                <div className="gradient-matrix">
                  {(M as M2).flat().map((v,i)=><strong key={i}>{fmt(v)}</strong>)}
                </div>
              </div>
            ))}
          </div>

          <div className="control-stack">
            <label><span>{copy.time} <strong>{fmt(time,2)}</strong></span><input type="range" min="0" max="1" step=".01" value={time} onChange={e=>setTime(Number(e.target.value))}/></label>
            <label><span>{copy.direction} <strong>{fmt(angle,0)}°</strong></span><input type="range" min="-180" max="180" step="1" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label>
            <label><span>{copy.length} <strong>{fmt(length,2)}</strong></span><input type="range" min=".08" max=".50" step=".01" value={length} onChange={e=>setLength(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.dx}</span><strong>[{fmt(data.dx[0])}, {fmt(data.dx[1])}]</strong></div>
            <div><span>{copy.dvDirect}</span><strong>[{fmt(data.dvDirect[0])}, {fmt(data.dvDirect[1])}]</strong></div>
            <div><span>{copy.dvFromL}</span><strong>[{fmt(data.dvFromL[0])}, {fmt(data.dvFromL[1])}]</strong></div>
            <div><span>{copy.error}</span><strong>{fmt(err,6)}</strong></div>
            <div><span>{copy.detF}</span><strong>{fmt(det(data.F))}</strong></div>
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
