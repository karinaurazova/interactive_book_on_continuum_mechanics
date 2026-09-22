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
    back: '← K02',
    title: 'Градиент деформации',
    lead: 'Теперь формализуем то, что уже увидели на малой окрестности. Градиент деформации F описывает, как малый материальный вектор dX около точки X преобразуется в текущий вектор dx.',
    key: 'ОПРЕДЕЛЕНИЕ',
    keyText: 'Для движения x = χ(X,t) градиент деформации — это производная отображения по материальным координатам: F = ∂x/∂X.',
    mapping: 'Локальное отображение',
    mappingText: 'В первом приближении около выбранной точки: dx = F dX. В выбранном материальном базисе столбцы матрицы F — это образы его базисных векторов.',
    jacobian: 'Локальное изменение площади',
    jacobianText: 'В двумерной сцене det F показывает ориентированное локальное отношение площадей. В 3D J = det F даёт локальное отношение ориентированных объёмов; условие физической допустимости J > 0 разберём отдельно.',
    warning: 'ВАЖНО',
    warningTitle: 'F — не мера деформации strain.',
    warningText: 'F описывает полное локальное преобразование и потому содержит также жёсткий поворот. Меры C, B, E и другие будут введены позже, чтобы отделять собственно деформацию от вращения.',
    f11: 'F₁₁',
    f12: 'F₁₂',
    f21: 'F₂₁',
    f22: 'F₂₂',
    vectorAngle: 'направление dX',
    sceneKicker: 'ГРАДИЕНТ ДЕФОРМАЦИИ',
    sceneTitle: 'одна матрица F преобразует все малые направления',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Что означают столбцы F?',
    questionText: 'Для выбранного базиса первый столбец — образ e₁, второй — образ e₂. Любой dX представляется их линейной комбинацией.',
    conclusion: 'ВЫВОД',
    conclusionTitle: 'F — локальная линейзация движения.',
    conclusionText: 'Она связывает геометрию движения с вычислением: dX → F dX → dx.',
    interactive: 'ИНТЕРАКТИВНО',
    next: 'Перейти к типовым режимам F →',
  },
  en: {
    back: '← K02',
    title: 'Deformation gradient',
    lead: 'We now formalize what the local-neighborhood experiment already showed. The deformation gradient F describes how a small material vector dX near X maps into the current vector dx.',
    key: 'DEFINITION',
    keyText: 'For the motion x = χ(X,t), the deformation gradient is the derivative of the motion with respect to material coordinates: F = ∂x/∂X.',
    mapping: 'Local mapping',
    mappingText: 'To first order near the selected point: dx = F dX. In the chosen material basis, the columns of F are the images of its basis vectors.',
    jacobian: 'Local area change',
    jacobianText: 'In this two-dimensional scene det F gives the oriented local area ratio. In 3D, J = det F gives the local oriented volume ratio; the admissibility condition J > 0 is discussed separately.',
    warning: 'IMPORTANT',
    warningTitle: 'F is not a strain measure.',
    warningText: 'F represents the full local transformation and therefore also contains rigid rotation. Measures such as C, B, E, and others will be introduced later to separate deformation from rotation.',
    f11: 'F₁₁',
    f12: 'F₁₂',
    f21: 'F₂₁',
    f22: 'F₂₂',
    vectorAngle: 'dX direction',
    sceneKicker: 'DEFORMATION GRADIENT',
    sceneTitle: 'one matrix F transforms every small direction',
    question: 'CHECKPOINT',
    questionTitle: 'What do the columns of F mean?',
    questionText: 'For the chosen basis, the first column is the image of e₁ and the second is the image of e₂. Any dX is represented by their linear combination.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'F is the local linearization of motion.',
    conclusionText: 'It links geometry and computation: dX → F dX → dx.',
    interactive: 'INTERACTIVE',
    next: 'Continue to typical F modes →',
  },
} as const

function fmt(v:number) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(2)
}

export function DeformationGradient({ notation, language, onBack, onNext }: Props) {
  const copy = text[language]
  const [F11,setF11] = useState(1.20)
  const [F12,setF12] = useState(0.35)
  const [F21,setF21] = useState(0.15)
  const [F22,setF22] = useState(0.90)
  const [angleDeg,setAngleDeg] = useState(28)

  const F = useMemo(() => [[F11,F12],[F21,F22]], [F11,F12,F21,F22])
  const angle = angleDeg*Math.PI/180
  const dX:[number,number] = [Math.cos(angle),Math.sin(angle)]
  const dx:[number,number] = [
    F[0][0]*dX[0]+F[0][1]*dX[1],
    F[1][0]*dX[0]+F[1][1]*dX[1],
  ]

  const e1:[number,number]=[1,0]
  const e2:[number,number]=[0,1]
  const Fe1:[number,number]=[F[0][0],F[1][0]]
  const Fe2:[number,number]=[F[0][1],F[1][1]]
  const det=F[0][0]*F[1][1]-F[0][1]*F[1][0]

  const notationLine =
    notation === 'Index' ? 'Fᵢⱼ = ∂xᵢ/∂Xⱼ,   dxᵢ = Fᵢⱼ dXⱼ' :
    notation === 'Matrix' ? 'F = [∂x/∂X],   dx = F dX' :
    notation === 'Python' ? 'dx = F @ dX' :
    '𝐅 = ∂𝐱/∂𝐗,   d𝐱 = 𝐅 d𝐗'

  const ref=(p:[number,number])=>[28+p[0]*13,39-p[1]*13]
  const cur=(p:[number,number])=>[70+p[0]*11,39-p[1]*11]

  const p0=ref([0,0])
  const pDX=ref(dX)
  const q0=cur([0,0])
  const qdx=cur(dx)
  const qe1=cur(Fe1)
  const qe2=cur(Fe2)

  const parallelogram = [
    q0,
    qe1,
    cur([Fe1[0]+Fe2[0],Fe1[1]+Fe2[1]]),
    qe2,
  ].map(p=>p.join(',')).join(' ')

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">K03 / 13</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.mapping}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.mappingText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.jacobian}</div>
          <div className="formula">J = det F = {fmt(det)}</div>
          <p>{copy.jacobianText}</p>
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

          <div className="gradient-layout">
            <svg className="gradient-scene" viewBox="0 0 100 72" role="img">
              <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
              <text x="14" y="13" fill="#8E96A3" fontSize="3.1">dX</text>
              <text x="61" y="13" fill="#8E96A3" fontSize="3.1">dx = F dX</text>

              <line x1={p0[0]} y1={p0[1]} x2={ref(e1)[0]} y2={ref(e1)[1]} stroke="#2864FF" strokeWidth="1.1"/>
              <line x1={p0[0]} y1={p0[1]} x2={ref(e2)[0]} y2={ref(e2)[1]} stroke="#A9E3D2" strokeWidth="1.1"/>
              <line x1={p0[0]} y1={p0[1]} x2={pDX[0]} y2={pDX[1]} stroke="#DD7A2B" strokeWidth="1.4"/>
              <circle cx={p0[0]} cy={p0[1]} r="1.4" fill="#F4F2EC"/>

              <polygon points={parallelogram} fill="rgba(40,100,255,0.08)" stroke="#5E6774" strokeWidth="0.6"/>
              <line x1={q0[0]} y1={q0[1]} x2={qe1[0]} y2={qe1[1]} stroke="#2864FF" strokeWidth="1.2"/>
              <line x1={q0[0]} y1={q0[1]} x2={qe2[0]} y2={qe2[1]} stroke="#A9E3D2" strokeWidth="1.2"/>
              <line x1={q0[0]} y1={q0[1]} x2={qdx[0]} y2={qdx[1]} stroke="#DD7A2B" strokeWidth="1.5"/>
              <circle cx={q0[0]} cy={q0[1]} r="1.4" fill="#F4F2EC"/>

              <text x={qe1[0]+1.2} y={qe1[1]-1} fill="#2864FF" fontSize="2.8">F e₁</text>
              <text x={qe2[0]+1.2} y={qe2[1]-1} fill="#A9E3D2" fontSize="2.8">F e₂</text>
            </svg>

            <div className="gradient-matrix-card">
              <span>F</span>
              <div className="gradient-matrix">
                {[F11,F12,F21,F22].map((v,i)=><strong key={i}>{fmt(v)}</strong>)}
              </div>
              <div className="gradient-column-note">
                <div><span>col 1</span><strong>[{fmt(F11)}, {fmt(F21)}]</strong></div>
                <div><span>col 2</span><strong>[{fmt(F12)}, {fmt(F22)}]</strong></div>
              </div>
            </div>
          </div>

          <div className="control-stack">
            <label><span>{copy.f11} <strong>{fmt(F11)}</strong></span><input type="range" min="0.4" max="1.8" step="0.01" value={F11} onChange={e=>setF11(Number(e.target.value))}/></label>
            <label><span>{copy.f12} <strong>{fmt(F12)}</strong></span><input type="range" min="-0.8" max="0.8" step="0.01" value={F12} onChange={e=>setF12(Number(e.target.value))}/></label>
            <label><span>{copy.f21} <strong>{fmt(F21)}</strong></span><input type="range" min="-0.8" max="0.8" step="0.01" value={F21} onChange={e=>setF21(Number(e.target.value))}/></label>
            <label><span>{copy.f22} <strong>{fmt(F22)}</strong></span><input type="range" min="0.4" max="1.8" step="0.01" value={F22} onChange={e=>setF22(Number(e.target.value))}/></label>
            <label><span>{copy.vectorAngle} <strong>{angleDeg}°</strong></span><input type="range" min="-180" max="180" step="1" value={angleDeg} onChange={e=>setAngleDeg(Number(e.target.value))}/></label>
          </div>

          <div className="metrics">
            <div><span>|dX|</span><strong>1.00</strong></div>
            <div><span>|dx|</span><strong>{fmt(Math.hypot(dx[0],dx[1]))}</strong></div>
            <div><span>J = det F</span><strong>{fmt(det)}</strong></div>
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
