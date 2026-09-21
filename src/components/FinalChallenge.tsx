import { useMemo, useState } from 'react'
import type { Language, NotationMode } from '../i18n'

type Props = {
  notation: NotationMode
  language: Language
  onBack: () => void
}

const text = {
  ru: {
    back: '← M13',
    title: 'Challenge: исследуй тензор сам',
    lead: 'В этом модуле подсказки сведены к минимуму. Перед тобой фиксированное напряжённое состояние и набор целей. Используй весь инструментарий главы, чтобы выполнить их.',
    key: 'РЕЖИМ САМОПРОВЕРКИ',
    keyText: 'Цель — не угадать ответ, а провести связное исследование: площадка → traction → главные направления → инварианты → разложение.',
    task1: 'Найди главную площадку',
    task1Text: 'Добейся |τ| < 0.02.',
    task2: 'Найди вторую главную площадку',
    task2Text: 'После первой главной площадки найди ортогональную ей.',
    task3: 'Проверь инвариант',
    task3Text: 'Убедись, что I₁ совпадает с суммой главных напряжений.',
    task4: 'Проверь девиатор',
    task4Text: 'Убедись, что tr(s)=0.',
    complete: 'выполнено',
    pending: 'в процессе',
    progress: 'Прогресс challenge',
    angle: 'угол нормали',
    tau: '|τ|',
    sigmaN: 'σₙ',
    i1: 'I₁',
    principalSum: 'σ₁+σ₂',
    devTrace: 'tr(s)',
    reset: 'сбросить',
    finish: 'challenge завершён',
    finishText: 'Все условия выполнены. Ты связала геометрию площадки, traction, главные значения, инварианты и девиаторное разложение в одном исследовании.',
    sceneKicker: 'FINAL CHALLENGE',
    sceneTitle: 'один тензор — несколько целей',
    interactive: 'ИНТЕРАКТИВНО',
    aria: 'Финальная самопроверка по напряжённому состоянию',
  },
  en: {
    back: '← M13',
    title: 'Challenge: investigate the tensor yourself',
    lead: 'Hints are intentionally minimal here. You are given a fixed stress state and a set of goals. Use the tools from the chapter to complete them.',
    key: 'SELF-CHECK MODE',
    keyText: 'The goal is not to guess an answer, but to perform a coherent investigation: plane → traction → principal directions → invariants → decomposition.',
    task1: 'Find a principal plane',
    task1Text: 'Reach |τ| < 0.02.',
    task2: 'Find the second principal plane',
    task2Text: 'After the first one, find the orthogonal principal plane.',
    task3: 'Check an invariant',
    task3Text: 'Verify that I₁ equals the sum of principal stresses.',
    task4: 'Check the deviator',
    task4Text: 'Verify that tr(s)=0.',
    complete: 'completed',
    pending: 'in progress',
    progress: 'Challenge progress',
    angle: 'normal angle',
    tau: '|τ|',
    sigmaN: 'σₙ',
    i1: 'I₁',
    principalSum: 'σ₁+σ₂',
    devTrace: 'tr(s)',
    reset: 'reset',
    finish: 'challenge completed',
    finishText: 'All conditions are satisfied. You linked plane geometry, traction, principal values, invariants, and deviatoric decomposition in one investigation.',
    sceneKicker: 'FINAL CHALLENGE',
    sceneTitle: 'one tensor — several goals',
    interactive: 'INTERACTIVE',
    aria: 'Final self-check for a two-dimensional stress state',
  },
} as const

const sigma11 = 1.18
const sigma22 = 0.42
const sigma12 = 0.46

function fmt(v: number) {
  return (Math.abs(v) < 1e-10 ? 0 : v).toFixed(3)
}

export function FinalChallenge({ notation, language, onBack }: Props) {
  const copy = text[language]
  const [thetaDeg, setThetaDeg] = useState(0)
  const [firstFound, setFirstFound] = useState<number | null>(null)
  const [secondFound, setSecondFound] = useState(false)

  const theta = thetaDeg * Math.PI / 180
  const n = useMemo<[number, number]>(() => [Math.cos(theta), Math.sin(theta)], [theta])
  const m: [number, number] = [-n[1], n[0]]

  const t = useMemo<[number, number]>(() => [
    sigma11 * n[0] + sigma12 * n[1],
    sigma12 * n[0] + sigma22 * n[1],
  ], [n])

  const sigmaN = t[0] * n[0] + t[1] * n[1]
  const tau = t[0] * m[0] + t[1] * m[1]
  const tauMag = Math.abs(tau)

  const center = 0.5 * (sigma11 + sigma22)
  const radius = Math.sqrt((0.5 * (sigma11 - sigma22)) ** 2 + sigma12 ** 2)
  const p1 = center + radius
  const p2 = center - radius
  const i1 = sigma11 + sigma22
  const principalSum = p1 + p2

  const mean = i1 / 2
  const s11 = sigma11 - mean
  const s22 = sigma22 - mean
  const devTrace = s11 + s22

  const principalNow = tauMag < 0.02

  const normalizeAngle = (a: number) => {
    let x = ((a % 180) + 180) % 180
    if (x > 90) x -= 180
    return x
  }

  const angularDistance90 = (a: number, b: number) => {
    const d = Math.abs(normalizeAngle(a - b))
    return Math.abs(d - 90)
  }

  const task1Done = firstFound !== null
  const task2Done = secondFound
  const task3Done = Math.abs(i1 - principalSum) < 1e-10
  const task4Done = Math.abs(devTrace) < 1e-10
  const completed = [task1Done, task2Done, task3Done, task4Done].filter(Boolean).length

  const capturePrincipal = () => {
    if (!principalNow) return
    if (firstFound === null) {
      setFirstFound(thetaDeg)
      return
    }
    if (angularDistance90(thetaDeg, firstFound) < 2) {
      setSecondFound(true)
    }
  }

  const notationLine =
    notation === 'Index' ? 'tᵢ = σᵢⱼnⱼ' :
    notation === 'Matrix' ? 't = [σ]n' :
    notation === 'Python' ? 't = sigma @ n' :
    '𝐭 = σ𝐧'

  const cx = 50
  const cy = 36
  const planeHalf = 18
  const planeA = { x: cx - m[0] * planeHalf, y: cy + m[1] * planeHalf }
  const planeB = { x: cx + m[0] * planeHalf, y: cy - m[1] * planeHalf }
  const nEnd = { x: cx + n[0] * 16, y: cy - n[1] * 16 }
  const tEnd = { x: cx + t[0] * 12, y: cy - t[1] * 12 }

  const tasks = [
    [copy.task1, copy.task1Text, task1Done],
    [copy.task2, copy.task2Text, task2Done],
    [copy.task3, copy.task3Text, task3Done],
    [copy.task4, copy.task4Text, task4Done],
  ] as const

  return (
    <section className="module-view">
      <div className="lesson-copy">
        <button className="text-button" onClick={onBack}>{copy.back}</button>
        <div className="lesson-index">M14 / 15</div>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.lead}</p>

        <div className="concept-card">
          <span>{copy.key}</span>
          <strong>{copy.keyText}</strong>
        </div>

        <div className="definition">
          <div className="definition-label">σ</div>
          <div className="formula">[[1.18, 0.46], [0.46, 0.42]]</div>
          <p>{notationLine}</p>
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

          <div className="challenge-grid">
            <div className="challenge-scene-wrap">
              <svg className="challenge-scene" viewBox="0 0 100 72" role="img" aria-label={copy.aria}>
                <rect x="6" y="7" width="88" height="58" rx="9" fill="#111318" />
                <line x1={planeA.x} y1={planeA.y} x2={planeB.x} y2={planeB.y} stroke="#6C7480" strokeWidth="1.1" />
                <circle cx={cx} cy={cy} r="1.2" fill="#F4F2EC" />
                <line x1={cx} y1={cy} x2={nEnd.x} y2={nEnd.y} stroke="#2864FF" strokeWidth="1.6" />
                <text x={nEnd.x + 1.2} y={nEnd.y - 1} fill="#F4F2EC" fontSize="3.7">n</text>
                <line x1={cx} y1={cy} x2={tEnd.x} y2={tEnd.y} stroke="#A9E3D2" strokeWidth="1.9" />
                <text x={tEnd.x + 1.2} y={tEnd.y - 1} fill="#F4F2EC" fontSize="3.7">t</text>
                <text x="11" y="15" fill="#8E96A3" fontSize="3.2">θ = {thetaDeg}°</text>
              </svg>

              <div className="control-stack">
                <label>
                  <span>{copy.angle} <strong>{thetaDeg}°</strong></span>
                  <input type="range" min="-90" max="90" step="0.5" value={thetaDeg} onChange={(e) => setThetaDeg(Number(e.target.value))} />
                </label>
              </div>

              <div className="challenge-metrics">
                <div><span>{copy.tau}</span><strong>{fmt(tauMag)}</strong></div>
                <div><span>{copy.sigmaN}</span><strong>{fmt(sigmaN)}</strong></div>
                <div><span>{copy.i1}</span><strong>{fmt(i1)}</strong></div>
                <div><span>{copy.principalSum}</span><strong>{fmt(principalSum)}</strong></div>
                <div><span>{copy.devTrace}</span><strong>{fmt(devTrace)}</strong></div>
              </div>

              <div className="challenge-actions">
                <button className={principalNow ? 'primary-button' : 'challenge-disabled'} onClick={capturePrincipal} disabled={!principalNow}>
                  {principalNow ? '✓' : '—'} {copy.task1}
                </button>
                <button className="text-button challenge-reset" onClick={() => {
                  setThetaDeg(0)
                  setFirstFound(null)
                  setSecondFound(false)
                }}>{copy.reset}</button>
              </div>
            </div>

            <div className="challenge-task-list">
              {tasks.map(([title, body, done], i) => (
                <div className={done ? 'challenge-task done' : 'challenge-task'} key={i}>
                  <div className="challenge-task-status">{done ? '✓' : i + 1}</div>
                  <div>
                    <strong>{title}</strong>
                    <p>{body}</p>
                    <small>{done ? copy.complete : copy.pending}</small>
                  </div>
                </div>
              ))}

              <div className="challenge-progress-card">
                <div className="progress-head">
                  <span>{copy.progress}</span>
                  <span>{completed} / 4</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${completed * 25}%` }} />
                </div>
              </div>
            </div>
          </div>

          {completed === 4 && (
            <div className="challenge-finish">
              <strong>{copy.finish}</strong>
              <p>{copy.finishText}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
