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
    back:'← T05',
    title:'Дивергенция скорости и изменение объёма',
    lead:'След матрицы скорости деформации имеет прямой геометрический смысл: он задаёт мгновенную относительную скорость изменения локальной площади в 2D и объёма в 3D.',
    key:'ОДНА СВЯЗЬ — ТРИ ЗАПИСИ',
    keyText:'Для движения с J = det F выполняется точное тождество: J̇ = J tr L = J tr D = J ∇·v.',
    jacobian:'Якобиан и скорость его изменения',
    jacobianText:'J измеряет локальное отношение ориентированных площадей или объёмов, а J̇ показывает, как быстро это отношение меняется со временем.',
    divergence:'Дивергенция скорости',
    divergenceText:'∇·v = tr L = tr D — относительная мгновенная скорость локального изменения площади/объёма.',
    sceneKicker:'ОБЪЁМНАЯ СКОРОСТЬ',
    sceneTitle:'меняй растяжение и сдвиг и проверяй J̇ = J tr D',
    time:'время t',
    rate1:'скорость растяжения α',
    rate2:'скорость растяжения β',
    shearRate:'скорость сдвига γ̇',
    matrixF:'F',
    matrixL:'L',
    matrixD:'D',
    J:'J',
    Jdot:'J̇ напрямую',
    JtrD:'J tr D',
    divergenceValue:'∇·v',
    traceD:'tr D',
    error:'ошибка',
    areaRatio:'отношение площадей',
    warning:'ВАЖНО',
    warningTitle:'Сдвиг сам по себе не обязан менять объём.',
    warningText:'Можно иметь D ≠ 0 при tr D = 0. Тогда форма меняется, но локальный объём сохраняется. Поэтому несжимаемость не означает отсутствие деформации.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Что означает tr D = 0?',
    questionText:'Локально объём не меняется мгновенно: J̇ = 0. Но это не запрещает сдвиг, изменение формы или вращение.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Дивергенция скорости — это локальная относительная скорость изменения объёма.',
    conclusionText:'Следующий шаг — транспортная теорема, где этот локальный результат появится внутри интеграла по движущейся области.',
    interactive:'ИНТЕРАКТИВНО',
    next:'Перейти к транспортной теореме →',
  },
  en: {
    back:'← T05',
    title:'Velocity divergence and volume change',
    lead:'The trace of the rate-of-deformation tensor has a direct geometric meaning: it gives the instantaneous relative rate of local area change in 2D and volume change in 3D.',
    key:'ONE RELATION — THREE FORMS',
    keyText:'For a motion with J = det F, the exact identity is J̇ = J tr L = J tr D = J ∇·v.',
    jacobian:'Jacobian and its rate',
    jacobianText:'J measures the local oriented area or volume ratio, while J̇ measures how fast this ratio changes in time.',
    divergence:'Velocity divergence',
    divergenceText:'∇·v = tr L = tr D is the instantaneous relative rate of local area/volume change.',
    sceneKicker:'VOLUMETRIC RATE',
    sceneTitle:'change stretch and shear and verify J̇ = J tr D',
    time:'time t',
    rate1:'stretch rate α',
    rate2:'stretch rate β',
    shearRate:'shear rate γ̇',
    matrixF:'F',
    matrixL:'L',
    matrixD:'D',
    J:'J',
    Jdot:'direct J̇',
    JtrD:'J tr D',
    divergenceValue:'∇·v',
    traceD:'tr D',
    error:'error',
    areaRatio:'area ratio',
    warning:'IMPORTANT',
    warningTitle:'Shear alone does not have to change volume.',
    warningText:'It is possible to have D ≠ 0 while tr D = 0. Shape changes while local volume is preserved. Incompressibility therefore does not mean absence of deformation.',
    question:'CHECKPOINT',
    questionTitle:'What does tr D = 0 mean?',
    questionText:'There is no instantaneous local volume change: J̇ = 0. Shear, shape change, or rotation may still occur.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Velocity divergence is the local relative rate of volume change.',
    conclusionText:'Next we move to the transport theorem, where this local result appears inside an integral over a moving region.',
    interactive:'INTERACTIVE',
    next:'Continue to the transport theorem →',
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

function transpose(A:M2):M2{
  return [[A[0][0],A[1][0]],[A[0][1],A[1][1]]]
}

function add(A:M2,B:M2):M2{
  return [[A[0][0]+B[0][0],A[0][1]+B[0][1]],[A[1][0]+B[1][0],A[1][1]+B[1][1]]]
}

function scale(A:M2,s:number):M2{
  return [[s*A[0][0],s*A[0][1]],[s*A[1][0],s*A[1][1]]]
}

export function VolumeRateJacobian({notation,language,onBack,onNext}:Props){
  const copy=text[language]
  const [time,setTime]=useState(0.55)
  const [alpha,setAlpha]=useState(0.35)
  const [beta,setBeta]=useState(-0.10)
  const [shearRate,setShearRate]=useState(0.45)

  const data=useMemo(()=>{
    const a=Math.exp(alpha*time)
    const b=Math.exp(beta*time)
    const g=shearRate*time

    const F:M2=[[a,g],[0,b]]
    const Fdot:M2=[[alpha*a,shearRate],[0,beta*b]]
    const L=mul(Fdot,inv(F))
    const D=scale(add(L,transpose(L)),0.5)

    const J=det(F)
    const Jdot=(alpha+beta)*J
    const trD=D[0][0]+D[1][1]
    const divv=L[0][0]+L[1][1]
    const rhs=J*trD

    return {F,Fdot,L,D,J,Jdot,trD,divv,rhs}
  },[time,alpha,beta,shearRate])

  const notationLine =
    notation==='Index' ? 'J̇ = J Lᵢᵢ = J Dᵢᵢ = J ∂vᵢ/∂xᵢ' :
    notation==='Matrix' ? 'J̇ = J tr(L) = J tr(D)' :
    notation==='Python' ? 'Jdot = J * np.trace(D)' :
    'J̇ = J tr𝐋 = J tr𝐃 = J ∇·𝐯'

  const square=[[0,0],[1,0],[1,1],[0,1]] as [number,number][]
  const current=square.map(([x,y])=>[
    data.F[0][0]*x+data.F[0][1]*y,
    data.F[1][0]*x+data.F[1][1]*y,
  ] as [number,number])

  const ref=(p:[number,number])=>[27+13*p[0],48-13*p[1]]
  const cur=(p:[number,number])=>[66+10*p[0],48-10*p[1]]
  const poly=(pts:[number,number][],m:(p:[number,number])=>number[])=>pts.map(p=>m(p).join(',')).join(' ')

  const error=Math.abs(data.Jdot-data.rhs)

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">T06 / 11</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.jacobian}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.jacobianText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.divergence}</div>
          <div className="formula">∇·𝐯 = tr𝐋 = tr𝐃</div>
          <p>{copy.divergenceText}</p>
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
            <text x="13" y="14" fill="#8E96A3" fontSize="2.8">Ω₀</text>
            <text x="62" y="14" fill="#8E96A3" fontSize="2.8">Ωₜ</text>
            <polygon points={poly(square,ref)} fill="rgba(244,242,236,.04)" stroke="#69717C" strokeWidth=".75"/>
            <polygon points={poly(current,cur)} fill="rgba(40,100,255,.10)" stroke="#2864FF" strokeWidth=".95"/>
            <text x="17" y="62" fill="#8E96A3" fontSize="2.5">A₀ = 1</text>
            <text x="64" y="62" fill="#A9E3D2" fontSize="2.5">A/A₀ = {fmt(data.J,2)}</text>
          </svg>

          <div className="velocity-gradient-matrices">
            {[
              [copy.matrixF,data.F],
              [copy.matrixL,data.L],
              [copy.matrixD,data.D],
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
            <label><span>{copy.time} <strong>{fmt(time,2)}</strong></span><input type="range" min="0" max="1.2" step=".01" value={time} onChange={e=>setTime(Number(e.target.value))}/></label>
            <label><span>{copy.rate1} <strong>{fmt(alpha,2)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={alpha} onChange={e=>setAlpha(Number(e.target.value))}/></label>
            <label><span>{copy.rate2} <strong>{fmt(beta,2)}</strong></span><input type="range" min="-.8" max=".8" step=".01" value={beta} onChange={e=>setBeta(Number(e.target.value))}/></label>
            <label><span>{copy.shearRate} <strong>{fmt(shearRate,2)}</strong></span><input type="range" min="-.9" max=".9" step=".01" value={shearRate} onChange={e=>setShearRate(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.J}</span><strong>{fmt(data.J)}</strong></div>
            <div><span>{copy.Jdot}</span><strong>{fmt(data.Jdot)}</strong></div>
            <div><span>{copy.JtrD}</span><strong>{fmt(data.rhs)}</strong></div>
            <div><span>{copy.divergenceValue}</span><strong>{fmt(data.divv)}</strong></div>
            <div><span>{copy.traceD}</span><strong>{fmt(data.trD)}</strong></div>
            <div><span>{copy.error}</span><strong>{fmt(error,6)}</strong></div>
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
