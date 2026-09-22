import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

type Mode = 'identity' | 'translation' | 'rotation' | 'stretch' | 'shear'

const text = {
  ru: {
    back: '← K09',
    title: 'Предельные случаи и жёсткое движение',
    lead: 'Перед вычислительной лабораторией полезно собрать эталонные случаи, на которых любая формула кинематики должна вести себя предсказуемо. Это быстрый способ ловить ошибки в формулах, коде и физической интерпретации.',
    key: 'ПРОВЕРКА ЗДРАВОГО СМЫСЛА',
    keyText: 'Если движение жёсткое, длины и углы не меняются: C = I, E = 0, J = 1 и все главные растяжения равны 1. Перенос вообще не входит в F.',
    identity: 'Тождественное отображение',
    translation: 'Чистый перенос',
    rotation: 'Чистый поворот',
    stretch: 'Одноосное растяжение',
    shear: 'Простой сдвиг',
    identityText: 'x = X. Никакого движения и никакой деформации.',
    translationText: 'x = X + c. Тело смещается как целое, но F = I, потому что производная постоянного переноса равна нулю.',
    rotationText: 'x = R X. Ориентация меняется, но длины и углы сохраняются.',
    stretchText: 'Одна координата масштабируется. Появляется истинное изменение длины и ненулевая мера деформации.',
    shearText: 'Форма и углы меняются, но при простом сдвиге J = 1: локальная площадь сохраняется.',
    parameter: 'параметр режима',
    translationValue: 'величина переноса',
    rotationValue: 'угол поворота',
    stretchValue: 'коэффициент растяжения',
    shearValue: 'параметр сдвига',
    sceneKicker: 'SANITY CHECK',
    sceneTitle: 'переключай предельные случаи и проверяй инварианты',
    fStatus: 'F',
    jStatus: 'J',
    eStatus: '‖E‖',
    lambdaStatus: 'λ₁, λ₂',
    expected: 'Ожидаемое поведение',
    rigid: 'жёсткое движение',
    deformed: 'есть деформация',
    translationNote: 'Перенос влияет на x, но не на F.',
    warning: 'ВАЖНО',
    warningTitle: 'Движение и деформация — не одно и то же.',
    warningText: 'Тело может заметно двигаться в пространстве и при этом не деформироваться. Именно поэтому кинематика отдельно различает положение, движение и меры деформации.',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Какие режимы должны давать E = 0?',
    questionText: 'Тождественное отображение, чистый перенос и чистый поворот. Все они не меняют расстояния между материальными точками.',
    conclusion: 'ВЫВОД',
    conclusionTitle: 'Эталонные случаи — это обязательная проверка любой модели конечной деформации.',
    conclusionText: 'Если код не проходит эти тесты, переходить к сложным нагрузкам и конститутивным моделям рано.',
    interactive: 'ИНТЕРАКТИВНО',
  },
  en: {
    back: '← K09',
    title: 'Limiting cases and rigid motion',
    lead: 'Before the computational laboratory, it is useful to collect benchmark cases in which every kinematic formula should behave predictably. These are fast checks for errors in formulas, code, and physical interpretation.',
    key: 'SANITY CHECK',
    keyText: 'For rigid motion, lengths and angles are preserved: C = I, E = 0, J = 1, and all principal stretches equal 1. Translation does not enter F at all.',
    identity: 'Identity motion',
    translation: 'Pure translation',
    rotation: 'Pure rotation',
    stretch: 'Uniaxial stretch',
    shear: 'Simple shear',
    identityText: 'x = X. No motion and no deformation.',
    translationText: 'x = X + c. The body shifts as a whole, but F = I because the derivative of a constant translation is zero.',
    rotationText: 'x = R X. Orientation changes, but lengths and angles are preserved.',
    stretchText: 'One coordinate is scaled. This creates a true change of length and nonzero strain.',
    shearText: 'Shape and angles change, but simple shear has J = 1: local area is preserved.',
    parameter: 'mode parameter',
    translationValue: 'translation magnitude',
    rotationValue: 'rotation angle',
    stretchValue: 'stretch ratio',
    shearValue: 'shear parameter',
    sceneKicker: 'SANITY CHECK',
    sceneTitle: 'switch benchmark cases and verify invariants',
    fStatus: 'F',
    jStatus: 'J',
    eStatus: '‖E‖',
    lambdaStatus: 'λ₁, λ₂',
    expected: 'Expected behavior',
    rigid: 'rigid motion',
    deformed: 'deformation present',
    translationNote: 'Translation changes x but not F.',
    warning: 'IMPORTANT',
    warningTitle: 'Motion and deformation are not the same thing.',
    warningText: 'A body may move significantly in space without deforming. This is why kinematics distinguishes position, motion, and strain measures.',
    question: 'CHECKPOINT',
    questionTitle: 'Which modes should give E = 0?',
    questionText: 'Identity, pure translation, and pure rotation. None of them changes distances between material points.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'Benchmark cases are mandatory checks for any finite-deformation model.',
    conclusionText: 'If the code fails these tests, it is too early to move on to complex loading or constitutive models.',
    interactive: 'INTERACTIVE',
  },
} as const

function fmt(v:number,d=3){
  return (Math.abs(v)<1e-10?0:v).toFixed(d)
}

function matMul(a:number[][],b:number[][]){
  return a.map(row=>b[0].map((_,j)=>row.reduce((s,v,k)=>s+v*b[k][j],0)))
}

function transpose(a:number[][]){
  return a[0].map((_,j)=>a.map(r=>r[j]))
}

function eigSym2(a:number,b:number,d:number){
  const tr=a+d
  const disc=Math.sqrt((a-d)*(a-d)+4*b*b)
  return [(tr+disc)/2,(tr-disc)/2]
}

function frob(a:number[][]){
  return Math.sqrt(a.flat().reduce((s,v)=>s+v*v,0))
}

export function KinematicsLimitCases({notation,language,onBack}:Props){
  const copy=text[language]
  const [mode,setMode]=useState<Mode>('identity')
  const [parameter,setParameter]=useState(0.35)

  const state=useMemo(()=>{
    let F=[[1,0],[0,1]]
    let translation:[number,number]=[0,0]
    if(mode==='translation'){
      translation=[parameter,0.55*parameter]
    }else if(mode==='rotation'){
      const th=parameter*Math.PI
      const c=Math.cos(th),s=Math.sin(th)
      F=[[c,-s],[s,c]]
    }else if(mode==='stretch'){
      F=[[1+parameter,0],[0,1]]
    }else if(mode==='shear'){
      F=[[1,parameter],[0,1]]
    }

    const C=matMul(transpose(F),F)
    const E=[
      [0.5*(C[0][0]-1),0.5*C[0][1]],
      [0.5*C[1][0],0.5*(C[1][1]-1)],
    ]
    const J=F[0][0]*F[1][1]-F[0][1]*F[1][0]
    const evals=eigSym2(C[0][0],C[0][1],C[1][1])
    const lambdas=evals.map(v=>Math.sqrt(Math.max(v,0)))
    return {F,C,E,J,lambdas,translation}
  },[mode,parameter])

  const {F,E,J,lambdas,translation}=state
  const strainNorm=frob(E)
  const rigid=strainNorm<1e-8

  const modeLabel=
    mode==='identity'?copy.identity:
    mode==='translation'?copy.translation:
    mode==='rotation'?copy.rotation:
    mode==='stretch'?copy.stretch:copy.shear

  const modeText=
    mode==='identity'?copy.identityText:
    mode==='translation'?copy.translationText:
    mode==='rotation'?copy.rotationText:
    mode==='stretch'?copy.stretchText:copy.shearText

  const parameterLabel=
    mode==='translation'?copy.translationValue:
    mode==='rotation'?copy.rotationValue:
    mode==='stretch'?copy.stretchValue:
    mode==='shear'?copy.shearValue:copy.parameter

  const displayParam=
    mode==='rotation' ? `${fmt(parameter*180,1)}°` :
    mode==='stretch' ? fmt(1+parameter,2) :
    fmt(parameter,2)

  const notationLine=
    notation==='Index' ? 'Fᵢⱼ = ∂xᵢ/∂Xⱼ' :
    notation==='Matrix' ? 'F = ∂x/∂X' :
    notation==='Python' ? 'F = grad_x_X' :
    '𝐅 = ∂𝐱/∂𝐗'

  const square=[[0,0],[1,0],[1,1],[0,1]] as [number,number][]
  const mapRef=(p:[number,number])=>[27+14*p[0],44-14*p[1]]
  const curPoint=(p:[number,number])=>[
    F[0][0]*p[0]+F[0][1]*p[1]+translation[0],
    F[1][0]*p[0]+F[1][1]*p[1]+translation[1],
  ] as [number,number]
  const mapCur=(p:[number,number])=>[68+11*p[0],44-11*p[1]]
  const poly=(pts:[number,number][],mapper:(p:[number,number])=>number[])=>pts.map(p=>mapper(p).join(',')).join(' ')
  const current=square.map(curPoint)

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">K10 / 13</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{modeLabel}</div>
          <div className="formula">{notationLine}</div>
          <p>{modeText}</p>
          {mode==='translation' && <p><strong>{copy.translationNote}</strong></p>}
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

          <div className="decomp-toggle-row">
            {([
              ['identity',copy.identity],
              ['translation',copy.translation],
              ['rotation',copy.rotation],
              ['stretch',copy.stretch],
              ['shear',copy.shear],
            ] as [Mode,string][]).map(([id,label])=>(
              <button key={id} className={mode===id?'decomp-toggle active':'decomp-toggle'} onClick={()=>setMode(id)}>{label}</button>
            ))}
          </div>

          <svg className="limit-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <text x="14" y="13" fill="#8E96A3" fontSize="3.1">Ω₀</text>
            <text x="62" y="13" fill="#8E96A3" fontSize="3.1">Ωₜ</text>

            <polygon points={poly(square,mapRef)} fill="rgba(244,242,236,.04)" stroke="#69717C" strokeWidth=".75"/>
            <polygon points={poly(current,mapCur)} fill={rigid?"rgba(169,227,210,.08)":"rgba(40,100,255,.10)"} stroke={rigid?"#A9E3D2":"#2864FF"} strokeWidth=".9"/>

            <line x1={mapRef([0,0])[0]} y1={mapRef([0,0])[1]} x2={mapRef([1,0])[0]} y2={mapRef([1,0])[1]} stroke="#2864FF" strokeWidth="1.2"/>
            <line x1={mapRef([0,0])[0]} y1={mapRef([0,0])[1]} x2={mapRef([0,1])[0]} y2={mapRef([0,1])[1]} stroke="#A9E3D2" strokeWidth="1.2"/>
          </svg>

          {mode!=='identity' && (
            <div className="control-stack">
              <label>
                <span>{parameterLabel} <strong>{displayParam}</strong></span>
                <input
                  type="range"
                  min={mode==='stretch' ? '-0.45' : mode==='rotation' ? '-0.75' : '-0.8'}
                  max={mode==='stretch' ? '0.75' : mode==='rotation' ? '0.75' : '0.8'}
                  step="0.01"
                  value={parameter}
                  onChange={e=>setParameter(Number(e.target.value))}
                />
              </label>
            </div>
          )}

          <div className="limit-matrix-row">
            <div className="gradient-matrix-card">
              <span>{copy.fStatus}</span>
              <div className="gradient-matrix">
                {F.flat().map((v,i)=><strong key={i}>{fmt(v)}</strong>)}
              </div>
            </div>
            <div className="limit-summary-card">
              <span>{copy.expected}</span>
              <strong>{rigid ? copy.rigid : copy.deformed}</strong>
              <p>{modeText}</p>
            </div>
          </div>

          <div className="limit-metrics">
            <div><span>{copy.jStatus}</span><strong>{fmt(J)}</strong></div>
            <div><span>{copy.eStatus}</span><strong>{fmt(strainNorm)}</strong></div>
            <div><span>{copy.lambdaStatus}</span><strong>{fmt(lambdas[0])}, {fmt(lambdas[1])}</strong></div>
            <div><span>det F</span><strong>{fmt(J)}</strong></div>
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
