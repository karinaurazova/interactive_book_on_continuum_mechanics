import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'
import { DepthNote } from './DepthNote'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    back:'← C05',
    title:'Изотропная линейная упругость: E, ν, λ, μ, K и G',
    lead:'Для изотропного линейно-упругого материала нужны только два независимых параметра. Остальные упругие константы вычисляются из выбранной пары.',
    key:'ШЕСТЬ ОБОЗНАЧЕНИЙ — ДВА НЕЗАВИСИМЫХ ПАРАМЕТРА',
    keyText:'Например, задав E и ν, можно однозначно вычислить λ, μ, K и G.',
    hooke:'Закон Гука в тензорной форме',
    hookeText:'Изотропный материал одинаково реагирует на поворот материальных осей, поэтому тензор жёсткости определяется только двумя скалярными константами.',
    conversions:'Переход между наборами параметров',
    conversionsText:'Разные пары удобны для разных задач: E и ν — в инженерной практике, K и G — для разделения объёмного и девиаторного отклика, λ и μ — в тензорной записи.',
    sceneKicker:'ОДИН МАТЕРИАЛ — РАЗНЫЕ ПАРАМЕТРИЗАЦИИ',
    sceneTitle:'меняй E и ν и наблюдай эквивалентные упругие константы',
    E:'модуль Юнга E',
    nu:'коэффициент Пуассона ν',
    lambda:'первый параметр Ламе λ',
    mu:'модуль сдвига μ = G',
    K:'объёмный модуль K',
    G:'модуль сдвига G',
    warning:'ВАЖНО',
    warningTitle:'Диапазон ν ограничен термодинамической устойчивостью.',
    warningText:'Для устойчивого изотропного линейно-упругого материала в 3D обычно требуется E > 0 и −1 < ν < 1/2. При ν → 1/2 объёмный модуль K резко растёт, что соответствует почти несжимаемому пределу.',
    question:'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle:'Почему при ν → 1/2 материал становится почти несжимаемым?',
    questionText:'Потому что K = E/[3(1−2ν)] стремится к бесконечности, и объёмное изменение становится энергетически очень дорогим.',
    conclusion:'ВЫВОД',
    conclusionTitle:'Изотропная линейная упругость задаётся двумя независимыми константами.',
    conclusionText:'Следующий шаг — объёмный и девиаторный отклик через K и G.',
    deepen:'Углубиться',
    deepenText:'Связи между константами: μ = G = E/[2(1+ν)], λ = Eν/[(1+ν)(1−2ν)], K = E/[3(1−2ν)]. Обратно E = 9KG/(3K+G), ν = (3K−2G)/[2(3K+G)].',
    research:'Исследовательское замечание',
    researchText:'Для почти несжимаемых мягких тканей параметризация через K и G часто физически прозрачнее, но численно требует аккуратной постановки. В смешанных FEM-формулировках давление вводится как дополнительное поле, чтобы избежать блокировки.',
    interactive:'ИНТЕРАКТИВНО',
  },
  en: {
    back:'← C05',
    title:'Isotropic linear elasticity: E, ν, λ, μ, K, and G',
    lead:'An isotropic linear elastic material needs only two independent parameters. All other elastic constants follow from the chosen pair.',
    key:'SIX SYMBOLS — TWO INDEPENDENT PARAMETERS',
    keyText:'For example, prescribing E and ν uniquely determines λ, μ, K, and G.',
    hooke:'Hooke law in tensor form',
    hookeText:'Because an isotropic material does not distinguish material directions, the stiffness tensor is determined by only two scalar constants.',
    conversions:'Conversion between parameter sets',
    conversionsText:'Different pairs are useful in different settings: E and ν in engineering, K and G for volumetric/deviatoric response, and λ and μ in tensor notation.',
    sceneKicker:'ONE MATERIAL — DIFFERENT PARAMETERIZATIONS',
    sceneTitle:'change E and ν and observe equivalent elastic constants',
    E:'Young modulus E',
    nu:'Poisson ratio ν',
    lambda:'first Lamé parameter λ',
    mu:'shear modulus μ = G',
    K:'bulk modulus K',
    G:'shear modulus G',
    warning:'IMPORTANT',
    warningTitle:'The admissible ν range is restricted by stability.',
    warningText:'For a stable isotropic linear elastic material in 3D one usually requires E > 0 and −1 < ν < 1/2. As ν → 1/2, K grows sharply, corresponding to the nearly incompressible limit.',
    question:'CHECKPOINT',
    questionTitle:'Why does ν → 1/2 imply near incompressibility?',
    questionText:'Because K = E/[3(1−2ν)] tends to infinity, making volume change energetically very expensive.',
    conclusion:'CONCLUSION',
    conclusionTitle:'Isotropic linear elasticity is fully determined by two independent constants.',
    conclusionText:'Next we separate volumetric and deviatoric response using K and G.',
    deepen:'Go deeper',
    deepenText:'Relations between constants: μ = G = E/[2(1+ν)], λ = Eν/[(1+ν)(1−2ν)], K = E/[3(1−2ν)]. Conversely E = 9KG/(3K+G), ν = (3K−2G)/[2(3K+G)].',
    research:'Research note',
    researchText:'For nearly incompressible soft tissues, K–G parameterization is often more transparent physically but numerically delicate. Mixed FEM formulations introduce pressure as an additional field to avoid volumetric locking.',
    interactive:'INTERACTIVE',
  }
} as const

function fmt(v:number,d=3){
  if (!Number.isFinite(v)) return '∞'
  return (Math.abs(v)<1e-12?0:v).toFixed(d)
}

export function IsotropicElasticConstants({notation,language,onBack}:Props){
  const copy=text[language]
  const [E,setE]=useState(1.5)
  const [nu,setNu]=useState(.30)

  const data=useMemo(()=>{
    const G=E/(2*(1+nu))
    const mu=G
    const lambda=E*nu/((1+nu)*(1-2*nu))
    const K=E/(3*(1-2*nu))
    return {G,mu,lambda,K}
  },[E,nu])

  const formula =
    notation==='Index' ? 'σᵢⱼ = λ εₖₖ δᵢⱼ + 2μ εᵢⱼ' :
    notation==='Matrix' ? 'σ = λ tr(ε) I + 2μ ε' :
    notation==='Python' ? 'sigma = lam * np.trace(eps) * I + 2 * mu * eps' :
    'σ = λ tr(ε) I + 2μ ε'

  const kNorm=Math.min(1,Math.max(0,data.K/(data.K+2)))
  const gNorm=Math.min(1,Math.max(0,data.G/(data.G+2)))

  return (
    <section className="module-view module-view-stacked">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">C06</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.hooke}</div>
          <div className="formula">{formula}</div>
          <p>{copy.hookeText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.conversions}</div>
          <p>{copy.conversionsText}</p>
        </div>

        <div className="warning-card kinematics-warning">
          <span>{copy.warning}</span>
          <strong>{copy.warningTitle}</strong>
          <p>{copy.warningText}</p>
        </div>

        <DepthNote label={copy.deepen}><p>{copy.deepenText}</p></DepthNote>
        <DepthNote label={copy.research} variant="research"><p>{copy.researchText}</p></DepthNote>
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

          <svg className="balance-scene" viewBox="0 0 100 72" role="img">
            <rect x="5" y="6" width="90" height="60" rx="9" fill="#111318"/>
            <text x="12" y="17" fill="#F4F2EC" fontSize="2.4">E = {fmt(E,2)}, ν = {fmt(nu,2)}</text>

            <rect x="18" y="27" width="26" height="10" rx="3" fill="rgba(40,100,255,.12)" stroke="#2864FF" strokeWidth=".8"/>
            <rect x="18" y="43" width="26" height="10" rx="3" fill="rgba(169,227,210,.12)" stroke="#A9E3D2" strokeWidth=".8"/>
            <text x="21" y="33.5" fill="#2864FF" fontSize="2.3">K</text>
            <text x="21" y="49.5" fill="#A9E3D2" fontSize="2.3">G</text>

            <rect x="48" y="28" width={36*kNorm} height="8" rx="2" fill="rgba(40,100,255,.52)"/>
            <rect x="48" y="44" width={36*gNorm} height="8" rx="2" fill="rgba(169,227,210,.52)"/>
            <text x="48" y="24" fill="#2864FF" fontSize="2.15">K = {fmt(data.K,2)}</text>
            <text x="48" y="40" fill="#A9E3D2" fontSize="2.15">G = {fmt(data.G,2)}</text>
          </svg>

          <div className="control-stack">
            <label><span>{copy.E} <strong>{fmt(E,2)}</strong></span><input type="range" min=".2" max="4" step=".01" value={E} onChange={e=>setE(Number(e.target.value))}/></label>
            <label><span>{copy.nu} <strong>{fmt(nu,3)}</strong></span><input type="range" min="-.8" max=".49" step=".005" value={nu} onChange={e=>setNu(Number(e.target.value))}/></label>
          </div>

          <div className="transport-metrics">
            <div><span>{copy.lambda}</span><strong>{fmt(data.lambda)}</strong></div>
            <div><span>{copy.mu}</span><strong>{fmt(data.mu)}</strong></div>
            <div><span>{copy.K}</span><strong>{fmt(data.K)}</strong></div>
            <div><span>{copy.G}</span><strong>{fmt(data.G)}</strong></div>
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
