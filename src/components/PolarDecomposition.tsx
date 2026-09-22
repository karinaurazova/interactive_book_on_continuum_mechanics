import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    back: '← K07',
    title: 'Полярное разложение',
    lead: 'Теперь можно строго разделить локальное преобразование на растяжение и жёсткий поворот. Полярное разложение показывает, что одно и то же F можно получить двумя эквивалентными путями.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'F = R U = V R. Тензор U описывает правое растяжение в материальной конфигурации, V — левое растяжение в текущей, а R — чистый жёсткий поворот.',
    right: 'Сначала растянуть, потом повернуть',
    rightText: 'U действует на материальную конфигурацию, затем R поворачивает уже растянутую окрестность: F = R U.',
    left: 'Сначала повернуть, потом растянуть',
    leftText: 'Сначала действует R, затем пространственное растяжение V: F = V R.',
    rotation: 'угол поворота',
    u11: 'U₁₁',
    u22: 'U₂₂',
    u12: 'U₁₂',
    sceneKicker: 'ПОЛЯРНОЕ РАЗЛОЖЕНИЕ',
    sceneTitle: 'два пути — одна конечная конфигурация',
    pathRU: 'I → U → R U',
    pathVR: 'I → R → V R',
    error: '‖RU − VR‖',
    detR: 'det R',
    detU: 'det U',
    detV: 'det V',
    warning: 'ВАЖНО',
    warningTitle: 'U и V — не одно и то же.',
    warningText: 'Они имеют одинаковые главные растяжения, но относятся к разным конфигурациям. Связь между ними задаётся V = R U Rᵀ.',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Почему R не является деформацией?',
    questionText: 'Потому что RᵀR = I: он сохраняет длины и углы и меняет только ориентацию.',
    conclusion: 'ВЫВОД',
    conclusionTitle: 'Полярное разложение даёт строгий смысл словам «растяжение» и «поворот» внутри F.',
    conclusionText: 'После этого естественно перейти к главным растяжениям — собственным значениям U и V.',
    interactive: 'ИНТЕРАКТИВНО',
  },
  en: {
    back: '← K07',
    title: 'Polar decomposition',
    lead: 'We can now rigorously separate the local transformation into stretch and rigid rotation. Polar decomposition shows that the same F can be obtained by two equivalent paths.',
    key: 'KEY IDEA',
    keyText: 'F = R U = V R. U is the right stretch tensor in the material configuration, V is the left stretch tensor in the current configuration, and R is a pure rigid rotation.',
    right: 'Stretch first, then rotate',
    rightText: 'U acts in the material configuration, then R rotates the stretched neighborhood: F = R U.',
    left: 'Rotate first, then stretch',
    leftText: 'R acts first, then the spatial stretch V acts: F = V R.',
    rotation: 'rotation angle',
    u11: 'U₁₁',
    u22: 'U₂₂',
    u12: 'U₁₂',
    sceneKicker: 'POLAR DECOMPOSITION',
    sceneTitle: 'two paths — one final configuration',
    pathRU: 'I → U → R U',
    pathVR: 'I → R → V R',
    error: '‖RU − VR‖',
    detR: 'det R',
    detU: 'det U',
    detV: 'det V',
    warning: 'IMPORTANT',
    warningTitle: 'U and V are not the same tensor.',
    warningText: 'They share the same principal stretches but belong to different configurations. They are related by V = R U Rᵀ.',
    question: 'CHECKPOINT',
    questionTitle: 'Why is R not a strain measure?',
    questionText: 'Because RᵀR = I: it preserves lengths and angles and changes orientation only.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'Polar decomposition gives a rigorous meaning to stretch and rotation inside F.',
    conclusionText: 'This naturally leads to principal stretches — the eigenvalues of U and V.',
    interactive: 'INTERACTIVE',
  },
} as const

function fmt(v:number,d=3) {
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}
function matMul(a:number[][],b:number[][]) {
  return a.map(row=>b[0].map((_,j)=>row.reduce((s,v,k)=>s+v*b[k][j],0)))
}
function transpose(a:number[][]) {
  return a[0].map((_,j)=>a.map(r=>r[j]))
}
function frobDiff(a:number[][],b:number[][]) {
  return Math.sqrt(a.flat().reduce((s,v,i)=>s+(v-b.flat()[i])**2,0))
}

export function PolarDecomposition({notation,language,onBack}:Props) {
  const copy=text[language]
  const [rotationDeg,setRotationDeg]=useState(32)
  const [u11,setU11]=useState(1.30)
  const [u22,setU22]=useState(0.82)
  const [u12,setU12]=useState(0.16)

  const data=useMemo(()=>{
    const th=rotationDeg*Math.PI/180
    const c=Math.cos(th), s=Math.sin(th)
    const R=[[c,-s],[s,c]]
    const U=[[u11,u12],[u12,u22]]
    const F=matMul(R,U)
    const V=matMul(matMul(R,U),transpose(R))
    const VR=matMul(V,R)
    return {R,U,F,V,VR}
  },[rotationDeg,u11,u22,u12])

  const {R,U,F,V,VR}=data
  const detR=R[0][0]*R[1][1]-R[0][1]*R[1][0]
  const detU=U[0][0]*U[1][1]-U[0][1]*U[1][0]
  const detV=V[0][0]*V[1][1]-V[0][1]*V[1][0]
  const err=frobDiff(F,VR)

  const notationLine =
    notation==='Index' ? 'Fᵢⱼ = RᵢₖUₖⱼ = VᵢₖRₖⱼ' :
    notation==='Matrix' ? 'F = R U = V R' :
    notation==='Python' ? 'F = R @ U; V = R @ U @ R.T' :
    '𝐅 = 𝐑𝐔 = 𝐕𝐑'

  const square=[[0,0],[1,0],[1,1],[0,1]] as [number,number][]
  const apply=(A:number[][],p:[number,number])=>[
    A[0][0]*p[0]+A[0][1]*p[1],
    A[1][0]*p[0]+A[1][1]*p[1],
  ] as [number,number]

  const mapStage=(p:[number,number],col:number,baseY:number)=>[col+10*p[0],baseY-10*p[1]]
  const poly=(pts:[number,number][],mapper:(p:[number,number])=>number[])=>pts.map(p=>mapper(p).join(',')).join(' ')

  const sqU=square.map(p=>apply(U,p))
  const sqR=square.map(p=>apply(R,p))
  const sqF=square.map(p=>apply(F,p))
  const sqVAfterR=square.map(p=>apply(V,apply(R,p)))

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">K08 / 13</div>
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
          <div className="formula">𝐕 = 𝐑𝐔𝐑ᵀ</div>
          <p>{copy.leftText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>
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

          <svg className="polar-scene" viewBox="0 0 100 94" role="img">
            <rect x="4" y="4" width="92" height="86" rx="9" fill="#111318"/>

            <text x="7" y="11" fill="#8E96A3" fontSize="2.8">{copy.pathRU}</text>
            <text x="7" y="52" fill="#8E96A3" fontSize="2.8">{copy.pathVR}</text>

            <text x="16" y="18" fill="#F4F2EC" fontSize="2.4">I</text>
            <text x="45" y="18" fill="#A9E3D2" fontSize="2.4">U</text>
            <text x="75" y="18" fill="#2864FF" fontSize="2.4">RU</text>

            <polygon points={poly(square,p=>mapStage(p,12,39))} fill="rgba(244,242,236,.04)" stroke="#69717C" strokeWidth=".65"/>
            <polygon points={poly(sqU,p=>mapStage(p,41,39))} fill="rgba(169,227,210,.08)" stroke="#A9E3D2" strokeWidth=".8"/>
            <polygon points={poly(sqF,p=>mapStage(p,71,39))} fill="rgba(40,100,255,.10)" stroke="#2864FF" strokeWidth=".9"/>

            <text x="16" y="59" fill="#F4F2EC" fontSize="2.4">I</text>
            <text x="45" y="59" fill="#DD7A2B" fontSize="2.4">R</text>
            <text x="75" y="59" fill="#2864FF" fontSize="2.4">VR</text>

            <polygon points={poly(square,p=>mapStage(p,12,82))} fill="rgba(244,242,236,.04)" stroke="#69717C" strokeWidth=".65"/>
            <polygon points={poly(sqR,p=>mapStage(p,41,82))} fill="rgba(221,122,43,.08)" stroke="#DD7A2B" strokeWidth=".8"/>
            <polygon points={poly(sqVAfterR,p=>mapStage(p,71,82))} fill="rgba(40,100,255,.10)" stroke="#2864FF" strokeWidth=".9"/>
          </svg>

          <div className="polar-matrix-grid">
            {[
              ['R',R],['U',U],['V',V],['F',F]
            ].map(([label,m])=>(
              <div className="gradient-matrix-card" key={String(label)}>
                <span>{label as string}</span>
                <div className="gradient-matrix">
                  {(m as number[][]).flat().map((v,i)=><strong key={i}>{fmt(v)}</strong>)}
                </div>
              </div>
            ))}
          </div>

          <div className="control-stack">
            <label><span>{copy.rotation} <strong>{rotationDeg}°</strong></span><input type="range" min="-90" max="90" step="1" value={rotationDeg} onChange={e=>setRotationDeg(Number(e.target.value))}/></label>
            <label><span>{copy.u11} <strong>{fmt(u11,2)}</strong></span><input type="range" min="0.55" max="1.75" step="0.01" value={u11} onChange={e=>setU11(Number(e.target.value))}/></label>
            <label><span>{copy.u22} <strong>{fmt(u22,2)}</strong></span><input type="range" min="0.55" max="1.75" step="0.01" value={u22} onChange={e=>setU22(Number(e.target.value))}/></label>
            <label><span>{copy.u12} <strong>{fmt(u12,2)}</strong></span><input type="range" min="-0.35" max="0.35" step="0.01" value={u12} onChange={e=>setU12(Number(e.target.value))}/></label>
          </div>

          <div className="polar-metrics">
            <div><span>{copy.error}</span><strong>{fmt(err,6)}</strong></div>
            <div><span>{copy.detR}</span><strong>{fmt(detR)}</strong></div>
            <div><span>{copy.detU}</span><strong>{fmt(detU)}</strong></div>
            <div><span>{copy.detV}</span><strong>{fmt(detV)}</strong></div>
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
