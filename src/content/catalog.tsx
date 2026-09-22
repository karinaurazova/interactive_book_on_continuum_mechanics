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
import { MotionConfigurations } from '../components/MotionConfigurations'
import { MaterialSpatialCoordinates } from '../components/MaterialSpatialCoordinates'
import { LocalNeighborhood } from '../components/LocalNeighborhood'
import { DeformationGradient } from '../components/DeformationGradient'
import { LocalTransformationModes } from '../components/LocalTransformationModes'
import { JacobianVolumeChange } from '../components/JacobianVolumeChange'
import { CauchyGreenTensors } from '../components/CauchyGreenTensors'
import { StrainMeasures } from '../components/StrainMeasures'
import { PolarDecomposition } from '../components/PolarDecomposition'
import { PrincipalStretches } from '../components/PrincipalStretches'
import { KinematicsLimitCases } from '../components/KinematicsLimitCases'
import { KinematicsComputationalLab } from '../components/KinematicsComputationalLab'
import { KinematicsFinalChallenge } from '../components/KinematicsFinalChallenge'
import { MotionToVelocity } from '../components/MotionToVelocity'
import { MaterialSpatialVelocity } from '../components/MaterialSpatialVelocity'
import { AccelerationConvective } from '../components/AccelerationConvective'
import { MaterialDerivative } from '../components/MaterialDerivative'
import { VelocityGradient } from '../components/VelocityGradient'
import { RateDeformationSpin } from '../components/RateDeformationSpin'
import type { Language, NotationMode } from '../i18n'

export type ModuleId =
  | 'M00' | 'M01' | 'M02' | 'M03' | 'M04'
  | 'M05' | 'M06' | 'M07' | 'M08' | 'M09'
  | 'M10' | 'M11' | 'M12' | 'M13' | 'M14'
  | 'K00' | 'K01' | 'K02' | 'K03' | 'K04' | 'K05' | 'K06' | 'K07' | 'K08' | 'K09' | 'K10' | 'K11' | 'K12'
  | 'T00' | 'T01' | 'T02' | 'T03' | 'T04' | 'T05'

export type ChapterId = 'stress-state' | 'kinematics' | 'transport'

type RenderContext = {
  notation: NotationMode
  language: Language
  goTo: (id: ModuleId) => void
}

export type ModuleDefinition = {
  id: ModuleId
  chapterId: ChapterId
  title: Record<Language, string>
  subtitle: Record<Language, string>
  render: (ctx: RenderContext) => ReactNode
}

export type ChapterDefinition = {
  id: ChapterId
  title: Record<Language, string>
  shortTitle: Record<Language, string>
  moduleIds: ModuleId[]
}

const stressModuleIds: ModuleId[] = [
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
    moduleIds: stressModuleIds,
  },
  {
    id: 'kinematics',
    title: { ru: 'Кинематика движения и деформации', en: 'Kinematics of motion and deformation' },
    shortTitle: { ru: 'Кинематика', en: 'Kinematics' },
    moduleIds: ['K00', 'K01', 'K02', 'K03', 'K04', 'K05', 'K06', 'K07', 'K08', 'K09', 'K10', 'K11', 'K12'],
  },
  {
    id: 'transport',
    title: { ru: 'Кинематика во времени и транспорт', en: 'Kinematics in time and transport' },
    shortTitle: { ru: 'Время и транспорт', en: 'Time & transport' },
    moduleIds: ['T00', 'T01', 'T02', 'T03', 'T04', 'T05'],
  },
]

export const modules: ModuleDefinition[] = [
  { id: 'M00', chapterId: 'stress-state', title: { ru: 'Континуум', en: 'Continuum' }, subtitle: { ru: 'От микроструктуры к полю', en: 'From microstructure to field' }, render: ({notation,language,goTo}) => <ScaleExplorer notation={notation} language={language} onNext={() => goTo('M01')} /> },
  { id: 'M01', chapterId: 'stress-state', title: { ru: 'Мысленный разрез', en: 'Imaginary cut' }, subtitle: { ru: 'Как увидеть внутреннее взаимодействие', en: 'Making internal interaction visible' }, render: ({notation,language,goTo}) => <CutTheBody notation={notation} language={language} onBack={() => goTo('M00')} onNext={() => goTo('M02')} /> },
  { id: 'M02', chapterId: 'stress-state', title: { ru: 'Вектор напряжения', en: 'Traction vector' }, subtitle: { ru: 'Нормальная и касательная составляющие', en: 'Normal and tangential components' }, render: ({notation,language,goTo}) => <TractionLab notation={notation} language={language} onBack={() => goTo('M01')} onNext={() => goTo('M03')} /> },
  { id: 'M03', chapterId: 'stress-state', title: { ru: 'Ориентация площадки', en: 'Plane orientation' }, subtitle: { ru: 'Отображение n ↦ t(n)', en: 'Mapping n ↦ t(n)' }, render: ({notation,language,goTo}) => <OrientationMap notation={notation} language={language} onBack={() => goTo('M02')} onNext={() => goTo('M04')} /> },
  { id: 'M04', chapterId: 'stress-state', title: { ru: 'Тетраэдр Коши', en: 'Cauchy tetrahedron' }, subtitle: { ru: 'Переход к формуле t(n)=σn', en: 'Toward the formula t(n)=σn' }, render: ({notation,language,goTo}) => <CauchyTetrahedron notation={notation} language={language} onBack={() => goTo('M03')} onNext={() => goTo('M05')} /> },
  { id: 'M05', chapterId: 'stress-state', title: { ru: 'Компоненты тензора', en: 'Stress components' }, subtitle: { ru: 'Как читать σᵢⱼ', en: 'How to read σᵢⱼ' }, render: ({notation,language,goTo}) => <StressComponents notation={notation} language={language} onBack={() => goTo('M04')} onNext={() => goTo('M06')} /> },
  { id: 'M06', chapterId: 'stress-state', title: { ru: 'Симметрия тензора', en: 'Stress symmetry' }, subtitle: { ru: 'Баланс момента импульса', en: 'Angular-momentum balance' }, render: ({notation,language,goTo}) => <AngularMomentumBalance notation={notation} language={language} onBack={() => goTo('M05')} onNext={() => goTo('M07')} /> },
  { id: 'M07', chapterId: 'stress-state', title: { ru: 'Разложение вектора', en: 'Traction decomposition' }, subtitle: { ru: 'Нормальная и касательная части', en: 'Normal and tangential parts' }, render: ({notation,language,goTo}) => <TractionDecomposition notation={notation} language={language} onBack={() => goTo('M06')} onNext={() => goTo('M08')} /> },
  { id: 'M08', chapterId: 'stress-state', title: { ru: 'Смена базиса', en: 'Change of basis' }, subtitle: { ru: 'Компоненты в новой системе координат', en: 'Components in a rotated frame' }, render: ({notation,language,goTo}) => <BasisTransform notation={notation} language={language} onBack={() => goTo('M07')} onNext={() => goTo('M09')} /> },
  { id: 'M09', chapterId: 'stress-state', title: { ru: 'Главные напряжения', en: 'Principal stresses' }, subtitle: { ru: 'Собственные значения и направления', en: 'Eigenvalues and principal directions' }, render: ({notation,language,goTo}) => <PrincipalStresses notation={notation} language={language} onBack={() => goTo('M08')} onNext={() => goTo('M10')} /> },
  { id: 'M10', chapterId: 'stress-state', title: { ru: 'Инварианты', en: 'Invariants' }, subtitle: { ru: 'I₁, I₂, I₃ вне зависимости от базиса', en: 'I₁, I₂, I₃ independent of basis' }, render: ({notation,language,goTo}) => <StressInvariants notation={notation} language={language} onBack={() => goTo('M09')} onNext={() => goTo('M11')} /> },
  { id: 'M11', chapterId: 'stress-state', title: { ru: 'Сферическая и девиаторная части', en: 'Spherical and deviatoric parts' }, subtitle: { ru: 'Разложение σ = σˢᵖʰ + s', en: 'Decomposition σ = σˢᵖʰ + s' }, render: ({notation,language,goTo}) => <StressDecomposition notation={notation} language={language} onBack={() => goTo('M10')} onNext={() => goTo('M12')} /> },
  { id: 'M12', chapterId: 'stress-state', title: { ru: 'Круг Мора', en: 'Mohr circle' }, subtitle: { ru: 'Площадка ↔ точка (σₙ, τ)', en: 'Plane ↔ point (σₙ, τ)' }, render: ({notation,language,goTo}) => <MohrCircle notation={notation} language={language} onBack={() => goTo('M11')} onNext={() => goTo('M13')} /> },
  { id: 'M13', chapterId: 'stress-state', title: { ru: 'Вычислительная лаборатория', en: 'Computational laboratory' }, subtitle: { ru: 'Лаборатория тензора напряжений', en: 'Stress Tensor Lab' }, render: ({notation,language,goTo}) => <ComputationalLab notation={notation} language={language} onBack={() => goTo('M12')} onNext={() => goTo('M14')} /> },
  { id: 'M14', chapterId: 'stress-state', title: { ru: 'Итоговая самопроверка', en: 'Challenge' }, subtitle: { ru: 'Самостоятельное исследование по всей главе', en: 'Chapter-wide self-check' }, render: ({notation,language,goTo}) => <FinalChallenge notation={notation} language={language} onBack={() => goTo('M13')} /> },
  { id: 'K00', chapterId: 'kinematics', title: { ru: 'Движение и конфигурации', en: 'Motion and configurations' }, subtitle: { ru: 'Материальная точка: X → x', en: 'Material point: X → x' }, render: ({notation,language,goTo}) => <MotionConfigurations notation={notation} language={language} onNext={() => goTo('K01')} /> },
  { id: 'K01', chapterId: 'kinematics', title: { ru: 'Материальные и пространственные координаты', en: 'Material and spatial coordinates' }, subtitle: { ru: 'Два описания одного движения', en: 'Two descriptions of one motion' }, render: ({notation,language,goTo}) => <MaterialSpatialCoordinates notation={notation} language={language} onBack={() => goTo('K00')} onNext={() => goTo('K02')} /> },
  { id: 'K02', chapterId: 'kinematics', title: { ru: 'Локальная окрестность материальной точки', en: 'Local neighborhood of a material point' }, subtitle: { ru: 'Как меняются малые направления рядом с X', en: 'How small directions near X change' }, render: ({notation,language,goTo}) => <LocalNeighborhood notation={notation} language={language} onBack={() => goTo('K01')} onNext={() => goTo('K03')} /> },
  { id: 'K03', chapterId: 'kinematics', title: { ru: 'Градиент деформации', en: 'Deformation gradient' }, subtitle: { ru: 'F = ∂x/∂X и отображение dX → dx', en: 'F = ∂x/∂X and the map dX → dx' }, render: ({notation,language,goTo}) => <DeformationGradient notation={notation} language={language} onBack={() => goTo('K02')} onNext={() => goTo('K04')} /> },
  { id: 'K04', chapterId: 'kinematics', title: { ru: 'Растяжение, сдвиг и поворот', en: 'Stretch, shear, and rotation' }, subtitle: { ru: 'Типовые геометрические эффекты внутри F', en: 'Typical geometric effects inside F' }, render: ({notation,language,goTo}) => <LocalTransformationModes notation={notation} language={language} onBack={() => goTo('K03')} onNext={() => goTo('K05')} /> },
  { id: 'K05', chapterId: 'kinematics', title: { ru: 'Якобиан движения', en: 'Jacobian of motion' }, subtitle: { ru: 'J = det F и локальное изменение площади/объёма', en: 'J = det F and local area/volume change' }, render: ({notation,language,goTo}) => <JacobianVolumeChange notation={notation} language={language} onBack={() => goTo('K04')} onNext={() => goTo('K06')} /> },
  { id: 'K06', chapterId: 'kinematics', title: { ru: 'Тензоры Коши–Грина', en: 'Cauchy–Green tensors' }, subtitle: { ru: 'C = FᵀF и B = FFᵀ', en: 'C = FᵀF and B = FFᵀ' }, render: ({notation,language,goTo}) => <CauchyGreenTensors notation={notation} language={language} onBack={() => goTo('K05')} onNext={() => goTo('K07')} /> },
  { id: 'K07', chapterId: 'kinematics', title: { ru: 'Меры деформации Грина–Лагранжа и Эйлера–Альманси', en: 'Green–Lagrange and Euler–Almansi strain measures' }, subtitle: { ru: 'E = 1/2(C − I), e = 1/2(I − B⁻¹)', en: 'E = 1/2(C − I), e = 1/2(I − B⁻¹)' }, render: ({notation,language,goTo}) => <StrainMeasures notation={notation} language={language} onBack={() => goTo('K06')} onNext={() => goTo('K08')} /> },
  { id: 'K08', chapterId: 'kinematics', title: { ru: 'Полярное разложение', en: 'Polar decomposition' }, subtitle: { ru: 'F = RU = VR', en: 'F = RU = VR' }, render: ({notation,language,goTo}) => <PolarDecomposition notation={notation} language={language} onBack={() => goTo('K07')} onNext={() => goTo('K09')} /> },
  { id: 'K09', chapterId: 'kinematics', title: { ru: 'Главные растяжения и главные направления', en: 'Principal stretches and principal directions' }, subtitle: { ru: 'Собственные значения и векторы U', en: 'Eigenvalues and eigenvectors of U' }, render: ({notation,language,goTo}) => <PrincipalStretches notation={notation} language={language} onBack={() => goTo('K08')} onNext={() => goTo('K10')} /> },
  { id: 'K10', chapterId: 'kinematics', title: { ru: 'Предельные случаи и жёсткое движение', en: 'Limiting cases and rigid motion' }, subtitle: { ru: 'Эталонные проверки F, J, C, E и λᵢ', en: 'Benchmark checks for F, J, C, E, and λᵢ' }, render: ({notation,language,goTo}) => <KinematicsLimitCases notation={notation} language={language} onBack={() => goTo('K09')} onNext={() => goTo('K11')} /> },
  { id: 'K11', chapterId: 'kinematics', title: { ru: 'Вычислительная лаборатория кинематики', en: 'Computational kinematics laboratory' }, subtitle: { ru: 'F → J, C, B, E, e, U, V, R, λᵢ', en: 'F → J, C, B, E, e, U, V, R, λᵢ' }, render: ({notation,language,goTo}) => <KinematicsComputationalLab notation={notation} language={language} onBack={() => goTo('K10')} onNext={() => goTo('K12')} /> },
  { id: 'K12', chapterId: 'kinematics', title: { ru: 'Итоговая самопроверка по кинематике', en: 'Final kinematics self-check' }, subtitle: { ru: 'Самостоятельное исследование F', en: 'Independent investigation of F' }, render: ({notation,language,goTo}) => <KinematicsFinalChallenge notation={notation} language={language} onBack={() => goTo('K11')} /> },
  { id: 'T00', chapterId: 'transport', title: { ru: 'От движения к скорости', en: 'From motion to velocity' }, subtitle: { ru: '∂χ/∂t при фиксированной материальной метке X', en: '∂χ/∂t at fixed material label X' }, render: ({notation,language,goTo}) => <MotionToVelocity notation={notation} language={language} onNext={() => goTo('T01')} /> },
  { id: 'T01', chapterId: 'transport', title: { ru: 'Материальное и пространственное описание скорости', en: 'Material and spatial descriptions of velocity' }, subtitle: { ru: 'V(X,t) ↔ v(x,t)', en: 'V(X,t) ↔ v(x,t)' }, render: ({notation,language,goTo}) => <MaterialSpatialVelocity notation={notation} language={language} onBack={() => goTo('T00')} onNext={() => goTo('T02')} /> },
  { id: 'T02', chapterId: 'transport', title: { ru: 'Ускорение и конвективный вклад', en: 'Acceleration and convective contribution' }, subtitle: { ru: 'a = ∂v/∂t + (v·∇)v', en: 'a = ∂v/∂t + (v·∇)v' }, render: ({notation,language,goTo}) => <AccelerationConvective notation={notation} language={language} onBack={() => goTo('T01')} onNext={() => goTo('T03')} /> },
  { id: 'T03', chapterId: 'transport', title: { ru: 'Материальная производная', en: 'Material derivative' }, subtitle: { ru: 'D/Dt = ∂/∂t + v·∇', en: 'D/Dt = ∂/∂t + v·∇' }, render: ({notation,language,goTo}) => <MaterialDerivative notation={notation} language={language} onBack={() => goTo('T02')} onNext={() => goTo('T04')} /> },
  { id: 'T04', chapterId: 'transport', title: { ru: 'Градиент скорости', en: 'Velocity gradient' }, subtitle: { ru: 'L = ∇v = ḞF⁻¹', en: 'L = ∇v = ḞF⁻¹' }, render: ({notation,language,goTo}) => <VelocityGradient notation={notation} language={language} onBack={() => goTo('T03')} onNext={() => goTo('T05')} /> },
  { id: 'T05', chapterId: 'transport', title: { ru: 'Скорость деформации и локальный спин', en: 'Rate of deformation and local spin' }, subtitle: { ru: 'L = D + W', en: 'L = D + W' }, render: ({notation,language,goTo}) => <RateDeformationSpin notation={notation} language={language} onBack={() => goTo('T04')} /> },
]

export const moduleById = Object.fromEntries(modules.map((m) => [m.id, m])) as Record<ModuleId, ModuleDefinition>
export const chapterById = Object.fromEntries(chapters.map((c) => [c.id, c])) as Record<ChapterId, ChapterDefinition>
