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
    back: '← K05',
    title: 'Тензоры Коши–Грина',
    lead: 'Градиент деформации F содержит изменение длин и углов вместе с ориентацией. Тензоры Коши–Грина кодируют метрическое изменение: C в материальном описании, B — в пространственном.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'Правый тензор Коши–Грина C = FᵀF относится к материальному описанию, а левый B = FFᵀ — к текущему. Для невырожденной F они положительно определены и имеют одинаковые собственные значения λᵢ².',
    right: 'Правый тензор Коши–Грина',
    rightText: 'C измеряет изменение квадратов длин материальных направлений: |dx|² = dX · C dX.',
    left: 'Левый тензор Коши–Грина',
    leftText: 'B — пространственный аналог, описывающий те же главные растяжения в текущей конфигурации.',
    rotation: 'жёсткий поворот',
    stretchX: 'растяжение 1',
    stretchY: 'растяжение 2',
    shear: 'сдвиг',
    direction: 'направление dX',
    directLength: '|F dX|²',
    metricLength: 'dX · C dX',
    traceC: 'tr C',
    detC: 'det C',
    sceneKicker: 'МЕТРИКА ДЕФОРМАЦИИ',
    sceneTitle: 'сравни F, C и B при добавлении жёсткого поворота',
    warning: 'ВАЖНО',
    warningTitle: 'C и B — разные тензоры, хотя несут одни и те же главные растяжения.',
    warningText: 'C относится к материальным направлениям, B — к пространственным. Их компоненты и собственные направления в общем случае различаются.',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Что произойдёт с C, если к деформации добавить только жёсткий поворот?',
    questionText: 'Для F = R U получаем C = U²: дополнительный R исчезает из FᵀF.',
    conclusion: 'ВЫВОД',
    conclusionTitle: 'C и B позволяют говорить об изменении длин и углов, не принимая жёсткий поворот за деформацию.',
    conclusionText: 'Следующий шаг — перейти от этих метрических тензоров к конкретным мерам деформации.',
    interactive: 'ИНТЕРАКТИВНО',
    next: 'Перейти к мерам деформации →',
  },
  en: {
    back: '← K05',
    title: 'Cauchy–Green tensors',
    lead: 'The deformation gradient F combines changes of lengths and angles with orientation. The Cauchy–Green tensors encode metric change: C in the material description and B in the spatial description.',
    key: 'KEY IDEA',
    keyText: 'The right Cauchy–Green tensor C = FᵀF belongs to the material description, while B = FFᵀ belongs to the current description. For nonsingular F they are positive definite and share the eigenvalues λᵢ².',
    right: 'Right Cauchy–Green tensor',
    rightText: 'C measures changes of squared lengths of material directions: |dx|² = dX · C dX.',
    left: 'Left Cauchy–Green tensor',
    leftText: 'B is the spatial counterpart and contains the same principal stretches in the current configuration.',
    rotation: 'rigid rotation',
    stretchX: 'stretch 1',
    stretchY: 'stretch 2',
    shear: 'shear',
    direction: 'dX direction',
    directLength: '|F dX|²',
    metricLength: 'dX · C dX',
    traceC: 'tr C',
    detC: 'det C',
    sceneKicker: 'DEFORMATION METRIC',
    sceneTitle: 'compare F, C, and B while adding rigid rotation',
    warning: 'IMPORTANT',
    warningTitle: 'C and B are different tensors even though they contain the same principal stretches.',
    warningText: 'C refers to material directions, while B refers to spatial directions. Their components and eigenvectors generally differ.',
    question: 'CHECKPOINT',
    questionTitle: 'What happens to C if only a rigid rotation is added?',
    questionText: 'For F = R U, C = U²: the extra R disappears from FᵀF.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'C and B describe changes of lengths and angles without mistaking rigid rotation for deformation.',
    conclusionText: 'The next step is to build explicit strain measures from these metric tensors.',
    interactive: 'INTERACTIVE',
    next: 'Continue to strain measures →',
  },
} as const

function fmt(v:number, d=2) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(d)
}

function matMul(a:number[][],b:number[][]) {
  return a.map((row)=>b[0].map((_,j)=>row.reduce((s,v,k)=>s+v*b[k][j],0)))
}

function transpose(a:number[][]) {
  return a[0].map((_,j)=>a.map(row=>row[j]))
}

function matVec(a:number[][],x:[number,number]) {
  return [a[0][0]*x[0]+a[0][1]*x[1],a[1][0]*x[0]+a[1][1]*x[1]] as [number,number]
}

export function CauchyGreenTensors({ notation, language, onBack, onNext }: Props) {
  const copy=text[language]
  const [rotationDeg,setRotationDeg]=useState(28)
  const [stretchX,setStretchX]=useState(1.30)
  const [stretchY,setStretchY]=useState(0.85)
  const [shear,setShear]=useState(0.22)
  const [directionDeg,setDirectionDeg]=useState(35)

  const F=useMemo(()=>{
    const t=rotationDeg*Math.PI/180
    const c=Math.cos(t), s=Math.sin(t)
    const U=[[stretchX,shear],[shear,stretchY]]
    const R=[[c,-s],[s,c]]
    return matMul(R,U)
  },[rotationDeg,stretchX,stretchY,shear])

  const C=useMemo(()=>matMul(transpose(F),F),[F])
  const B=useMemo(()=>matMul(F,transpose(F)),[F])

  const a=directionDeg*Math.PI/180
  const dX:[number,number]=[Math.cos(a),Math.sin(a)]
  const dx=matVec(F,dX)
  const directLength=dx[0]*dx[0]+dx[1]*dx[1]
  const CdX=matVec(C,dX)
  const metricLength=dX[0]*CdX[0]+dX[1]*CdX[1]
  const traceC=C[0][0]+C[1][1]
  const detC=C[0][0]*C[1][1]-C[0][1]*C[1][0]

  const notationLine =
    notation === 'Index' ? 'Cᵢⱼ = FₖᵢFₖⱼ,   Bᵢⱼ = FᵢₖFⱼₖ' :
    notation === 'Matrix' ? 'C = FᵀF,   B = FFᵀ' :
    notation === 'Python' ? 'C = F.T @ F; B = F @ F.T' :
    '𝐂 = 𝐅ᵀ𝐅,   𝐁 = 𝐅𝐅ᵀ'

  const ref=(p:[number,number])=>[29+p[0]*13,40-p[1]*13]
  const cur=(p:[number,number])=>[72+p[0]*11,40-p[1]*11]
  const p0=ref([0,0]), p1=ref(dX)
  const q0=cur([0,0]), q1=cur(dx)

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">K06 / 13</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.right}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.rightText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.left}</div>
          <div className="formula">𝐁 = 𝐅𝐅ᵀ</div>
          <p>{copy.leftText}</p>
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

          <div className="cg-main-grid">
            <svg className="cg-scene" viewBox="0 0 100 72" role="img">
              <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
              <text x="13" y="13" fill="#8E96A3" fontSize="3.1">dX</text>
              <text x="62" y="13" fill="#8E96A3" fontSize="3.1">dx = F dX</text>

              <line x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke="#A9E3D2" strokeWidth="1.5"/>
              <circle cx={p0[0]} cy={p0[1]} r="1.4" fill="#F4F2EC"/>
              <line x1={q0[0]} y1={q0[1]} x2={q1[0]} y2={q1[1]} stroke="#2864FF" strokeWidth="1.5"/>
              <circle cx={q0[0]} cy={q0[1]} r="1.4" fill="#F4F2EC"/>
            </svg>

            <div className="cg-matrix-stack">
              {[['F',F],['C',C],['B',B]].map(([label,matrix])=>(
                <div className="gradient-matrix-card" key={String(label)}>
                  <span>{label as string}</span>
                  <div className="gradient-matrix">
                    {(matrix as number[][]).flat().map((v,i)=><strong key={i}>{fmt(v)}</strong>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="control-stack">
            <label><span>{copy.rotation} <strong>{rotationDeg}°</strong></span><input type="range" min="-90" max="90" step="1" value={rotationDeg} onChange={e=>setRotationDeg(Number(e.target.value))}/></label>
            <label><span>{copy.stretchX} <strong>{fmt(stretchX)}</strong></span><input type="range" min="0.55" max="1.65" step="0.01" value={stretchX} onChange={e=>setStretchX(Number(e.target.value))}/></label>
            <label><span>{copy.stretchY} <strong>{fmt(stretchY)}</strong></span><input type="range" min="0.55" max="1.65" step="0.01" value={stretchY} onChange={e=>setStretchY(Number(e.target.value))}/></label>
            <label><span>{copy.shear} <strong>{fmt(shear)}</strong></span><input type="range" min="-0.45" max="0.45" step="0.01" value={shear} onChange={e=>setShear(Number(e.target.value))}/></label>
            <label><span>{copy.direction} <strong>{directionDeg}°</strong></span><input type="range" min="-180" max="180" step="1" value={directionDeg} onChange={e=>setDirectionDeg(Number(e.target.value))}/></label>
          </div>

          <div className="cg-metrics">
            <div><span>{copy.directLength}</span><strong>{fmt(directLength,3)}</strong></div>
            <div><span>{copy.metricLength}</span><strong>{fmt(metricLength,3)}</strong></div>
            <div><span>{copy.traceC}</span><strong>{fmt(traceC)}</strong></div>
            <div><span>{copy.detC}</span><strong>{fmt(detC)}</strong></div>
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
