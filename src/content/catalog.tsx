import type { ReactNode } from 'react'
import { ScaleExplorer } from '../components/ScaleExplorer'
import { CutTheBody } from '../components/CutTheBody'
import { TractionLab } from '../components/TractionLab'
import { OrientationMap } from '../components/OrientationMap'
import { CauchyTetrahedron } from '../components/CauchyTetrahedron'
import { StressComponents } from '../components/StressComponents'
import { AngularMomentumBalance } from '../components/AngularMomentumBalance'
import { TractionDecomposition } from '../components/TractionDecomposition'
import { BasisTransform } from '../components/BasisTransform'
import { PrincipalStresses } from '../components/PrincipalStresses'
import { StressInvariants } from '../components/StressInvariants'
import { StressDecomposition } from '../components/StressDecomposition'
import { MohrCircle } from '../components/MohrCircle'
import { ComputationalLab } from '../components/ComputationalLab'
import { FinalChallenge } from '../components/FinalChallenge'
import type { Language, NotationMode } from '../i18n'

export type ModuleId =
  | 'M00' | 'M01' | 'M02' | 'M03' | 'M04'
  | 'M05' | 'M06' | 'M07' | 'M08' | 'M09'
  | 'M10' | 'M11' | 'M12' | 'M13' | 'M14'

export type ChapterId = 'stress-state'

type RenderContext = {
  notation: NotationMode
  language: Language
  goTo: (id: ModuleId) => void
}

export type ModuleDefinition = {
  id: ModuleId
  chapterId: ChapterId
  render: (ctx: RenderContext) => ReactNode
}

export type ChapterDefinition = {
  id: ChapterId
  title: Record<Language, string>
  shortTitle: Record<Language, string>
  moduleIds: ModuleId[]
}

const moduleIds: ModuleId[] = [
  'M00','M01','M02','M03','M04',
  'M05','M06','M07','M08','M09',
  'M10','M11','M12','M13','M14',
]

export const chapters: ChapterDefinition[] = [
  {
    id: 'stress-state',
    title: {
      ru: 'Напряжённое состояние в точке',
      en: 'Stress state at a point',
    },
    shortTitle: {
      ru: 'Напряжения',
      en: 'Stress',
    },
    moduleIds,
  },
]

export const modules: ModuleDefinition[] = [
  { id: 'M00', chapterId: 'stress-state', render: ({notation,language,goTo}) => <ScaleExplorer notation={notation} language={language} onNext={() => goTo('M01')} /> },
  { id: 'M01', chapterId: 'stress-state', render: ({notation,language,goTo}) => <CutTheBody notation={notation} language={language} onBack={() => goTo('M00')} onNext={() => goTo('M02')} /> },
  { id: 'M02', chapterId: 'stress-state', render: ({notation,language,goTo}) => <TractionLab notation={notation} language={language} onBack={() => goTo('M01')} onNext={() => goTo('M03')} /> },
  { id: 'M03', chapterId: 'stress-state', render: ({notation,language,goTo}) => <OrientationMap notation={notation} language={language} onBack={() => goTo('M02')} onNext={() => goTo('M04')} /> },
  { id: 'M04', chapterId: 'stress-state', render: ({notation,language,goTo}) => <CauchyTetrahedron notation={notation} language={language} onBack={() => goTo('M03')} onNext={() => goTo('M05')} /> },
  { id: 'M05', chapterId: 'stress-state', render: ({notation,language,goTo}) => <StressComponents notation={notation} language={language} onBack={() => goTo('M04')} onNext={() => goTo('M06')} /> },
  { id: 'M06', chapterId: 'stress-state', render: ({notation,language,goTo}) => <AngularMomentumBalance notation={notation} language={language} onBack={() => goTo('M05')} onNext={() => goTo('M07')} /> },
  { id: 'M07', chapterId: 'stress-state', render: ({notation,language,goTo}) => <TractionDecomposition notation={notation} language={language} onBack={() => goTo('M06')} onNext={() => goTo('M08')} /> },
  { id: 'M08', chapterId: 'stress-state', render: ({notation,language,goTo}) => <BasisTransform notation={notation} language={language} onBack={() => goTo('M07')} onNext={() => goTo('M09')} /> },
  { id: 'M09', chapterId: 'stress-state', render: ({notation,language,goTo}) => <PrincipalStresses notation={notation} language={language} onBack={() => goTo('M08')} onNext={() => goTo('M10')} /> },
  { id: 'M10', chapterId: 'stress-state', render: ({notation,language,goTo}) => <StressInvariants notation={notation} language={language} onBack={() => goTo('M09')} onNext={() => goTo('M11')} /> },
  { id: 'M11', chapterId: 'stress-state', render: ({notation,language,goTo}) => <StressDecomposition notation={notation} language={language} onBack={() => goTo('M10')} onNext={() => goTo('M12')} /> },
  { id: 'M12', chapterId: 'stress-state', render: ({notation,language,goTo}) => <MohrCircle notation={notation} language={language} onBack={() => goTo('M11')} onNext={() => goTo('M13')} /> },
  { id: 'M13', chapterId: 'stress-state', render: ({notation,language,goTo}) => <ComputationalLab notation={notation} language={language} onBack={() => goTo('M12')} onNext={() => goTo('M14')} /> },
  { id: 'M14', chapterId: 'stress-state', render: ({notation,language,goTo}) => <FinalChallenge notation={notation} language={language} onBack={() => goTo('M13')} /> },
]

export const moduleById = Object.fromEntries(modules.map((m) => [m.id, m])) as Record<ModuleId, ModuleDefinition>
export const chapterById = Object.fromEntries(chapters.map((c) => [c.id, c])) as Record<ChapterId, ChapterDefinition>
