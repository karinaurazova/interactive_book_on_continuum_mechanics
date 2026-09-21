import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

type ViewMode = 'full' | 'spherical' | 'deviatoric'

const text = {
  ru: {
    back: '← M10',
    title: 'Сферическая и девиаторная части напряжений',
    lead: 'Любой тензор напряжений можно разложить на сферическую часть, пропорциональную единичному тензору, и девиаторную часть с нулевым следом.',
    key: 'КЛЮЧЕВАЯ МЫСЛЬ',
    keyText: 'Это точное алгебраическое разложение одного тензора на две части с разными структурными свойствами.',
    split: 'Разложение',
    splitText: 'Сферическая часть определяется средним нормальным напряжением, а девиатор получается вычитанием этой части из полного тензора.',
    caution: 'Физическая интерпретация',
    cautionText: 'Связь сферической части с изменением объёма, а девиатора с изменением формы зависит от конститутивной модели и режима деформирования; это не чисто кинематическая истина.',
    sceneKicker: 'РАЗЛОЖЕНИЕ ТЕНЗОРА',
    sceneTitle: 'переключай части и сравни их структуру',
    full: 'полный тензор',
    spherical: 'сферическая часть',
    deviatoric: 'девиатор',
    mean: 'среднее нормальное напряжение',
    trace: 'след',
    devTrace: 'tr(s)',
    reconstruction: 'проверка суммы',
    question: 'ВОПРОС ДЛЯ ПРОВЕРКИ',
    questionTitle: 'Почему след девиаторной части всегда равен нулю?',
    questionText: 'Сравни tr(σ) и три одинаковых диагональных элемента сферической части.',
    conclusion: 'ИТОГ',
    conclusionTitle: 'Полный тензор можно восстановить как сумму сферической и девиаторной частей.',
    conclusionText: 'Это разложение особенно важно перед переходом к критериям текучести, энергии и инвариантам девиатора.',
    interactive: 'ИНТЕРАКТИВНО',
    aria: 'Сравнение полного тензора напряжений, сферической части и девиатора',
  },
  en: {
    back: '← M10',
    title: 'Spherical and deviatoric stress parts',
    lead: 'Any stress tensor can be decomposed into a spherical part proportional to the identity tensor and a deviatoric part with zero trace.',
    key: 'KEY IDEA',
    keyText: 'This is an exact algebraic decomposition of one tensor into two parts with different structural properties.',
    split: 'Decomposition',
    splitText: 'The spherical part is determined by the mean normal stress; the deviator is obtained by subtracting that part from the full tensor.',
    caution: 'Physical interpretation',
    cautionText: 'Associating the spherical part with volume change and the deviator with shape change depends on the constitutive model and deformation regime; it is not a purely kinematic identity.',
    sceneKicker: 'TENSOR DECOMPOSITION',
    sceneTitle: 'switch between parts and compare their structure',
    full: 'full tensor',
    spherical: 'spherical part',
    deviatoric: 'deviator',
    mean: 'mean normal stress',
    trace: 'trace',
    devTrace: 'tr(s)',
    reconstruction: 'sum check',
    question: 'CHECKPOINT',
    questionTitle: 'Why is the trace of the deviatoric part always zero?',
    questionText: 'Compare tr(σ) with the three equal diagonal entries of the spherical part.',
    conclusion: 'CONCLUSION',
    conclusionTitle: 'The full tensor is recovered as the sum of spherical and deviatoric parts.',
    conclusionText: 'This decomposition becomes especially important for yield criteria, energy measures, and deviatoric invariants.',
    interactive: 'INTERACTIVE',
    aria: 'Comparison of the full stress tensor, spherical part, and deviator',
  },
} as const

const sigma = [
  [1.30, 0.50, 0.18],
  [0.50, 0.85, 0.22],
  [0.18, 0.22, 0.62],
]

function fmt(v: number) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(3)
}

function trace(a: number[][]) {
  return a[0][0] + a[1][1] + a[2][2]
}

export function StressDecomposition({ notation, language, onBack }: Props) {
  const copy = text[language]
  const [mode, setMode] = useState<ViewMode>('full')

  const tr = useMemo(() => trace(sigma), [])
  const mean = tr / 3

  const spherical = useMemo(
    () => [
      [mean, 0, 0],
      [0, mean, 0],
      [0, 0, mean],
    ],
    [mean],
  )

  const deviatoric = useMemo(
    () => sigma.map((row, i) => row.map((v, j) => v - spherical[i][j])),
    [spherical],
  )

  const shown = mode === 'full' ? sigma : mode === 'spherical' ? spherical : deviatoric
  const shownTitle = mode === 'full' ? copy.full : mode === 'spherical' ? copy.spherical : copy.deviatoric

  const notationLine =
    notation === 'Index' ? 'σᵢⱼ = (1/3)σₖₖδᵢⱼ + sᵢⱼ' :
    notation === 'Matrix' ? '[σ] = (tr[σ]/3)[I] + [s]' :
    notation === 'Python' ? 'p = np.trace(sigma)/3; s = sigma - p*np.eye(3)' :
    'σ = (1/3 tr σ)I + s'

  const devTrace = trace(deviatoric)
  const reconstructionError = Math.max(
    ...sigma.flatMap((row, i) => row.map((v, j) => Math.abs(v - spherical[i][j] - deviatoric[i][j]))),
  )

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">M11 / 12</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.split}</div>
          <div className="formula">{notationLine}</div>
          <p>{copy.splitText}</p>
        </div>

        <div className="definition">
          <div className="definition-label">{copy.caution}</div>
          <p>{copy.cautionText}</p>
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
              ['full', copy.full],
              ['spherical', copy.spherical],
              ['deviatoric', copy.deviatoric],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                className={mode === id ? 'decomp-toggle active' : 'decomp-toggle'}
                onClick={() => setMode(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="decomp-main-grid">
            <div className="decomp-matrix-panel">
              <span>{shownTitle}</span>
              <div className="invariant-3x3">
                {shown.flatMap((r, i) => r.map((v, j) => (
                  <strong key={`${mode}-${i}-${j}`}>{fmt(v)}</strong>
                )))}
              </div>
            </div>

            <svg className="decomp-scene" viewBox="0 0 100 72" role="img" aria-label={copy.aria}>
              <rect x="6" y="7" width="88" height="58" rx="9" fill="#111318" />
              <rect x="30" y="20" width="40" height="32" rx="5" fill="#20242C" stroke="#505764" strokeWidth="0.8" />

              {mode !== 'deviatoric' && (
                <>
                  <line x1="50" y1="20" x2="50" y2="12" stroke="#2864FF" strokeWidth="1.6" />
                  <line x1="50" y1="52" x2="50" y2="60" stroke="#2864FF" strokeWidth="1.6" />
                  <line x1="30" y1="36" x2="22" y2="36" stroke="#2864FF" strokeWidth="1.6" />
                  <line x1="70" y1="36" x2="78" y2="36" stroke="#2864FF" strokeWidth="1.6" />
                </>
              )}

              {mode !== 'spherical' && (
                <>
                  <line x1="30" y1="25" x2="41" y2="20" stroke="#A9E3D2" strokeWidth="1.5" />
                  <line x1="70" y1="47" x2="59" y2="52" stroke="#A9E3D2" strokeWidth="1.5" />
                  <line x1="35" y1="52" x2="30" y2="42" stroke="#DD7A2B" strokeWidth="1.3" />
                  <line x1="65" y1="20" x2="70" y2="30" stroke="#DD7A2B" strokeWidth="1.3" />
                </>
              )}

              <text x="11" y="14" fill="#F4F2EC" fontSize="3.5">
                {mode === 'full' ? 'σ' : mode === 'spherical' ? 'σˢᵖʰ' : 's'}
              </text>
            </svg>
          </div>

          <div className="decomp-metrics">
            <div><span>{copy.mean}</span><strong>{fmt(mean)}</strong></div>
            <div><span>{copy.trace}</span><strong>{fmt(tr)}</strong></div>
            <div><span>{copy.devTrace}</span><strong>{fmt(devTrace)}</strong></div>
            <div><span>{copy.reconstruction}</span><strong>{fmt(reconstructionError)}</strong></div>
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
