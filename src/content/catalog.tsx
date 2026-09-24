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
import { VolumeRateJacobian } from '../components/VolumeRateJacobian'
import { MaterialTransportTheorem } from '../components/MaterialTransportTheorem'
import { ControlVolumeFlux } from '../components/ControlVolumeFlux'
import { GeneralReynoldsTransport } from '../components/GeneralReynoldsTransport'
import { TransportFinalChallenge } from '../components/TransportFinalChallenge'
import { BalanceStructure } from '../components/BalanceStructure'
import { MassBalance } from '../components/MassBalance'
import { LinearMomentumBalance } from '../components/LinearMomentumBalance'
import { AngularMomentumLaw } from '../components/AngularMomentumLaw'
import { EnergyBalance } from '../components/EnergyBalance'
import { StressPowerSplit } from '../components/StressPowerSplit'
import { ClausiusDuhem } from '../components/ClausiusDuhem'
import { ConstitutiveAdmissibility } from '../components/ConstitutiveAdmissibility'
import { InitialBoundaryProblem } from '../components/InitialBoundaryProblem'
import { WeakFormBridge } from '../components/WeakFormBridge'
import { BalanceFinalChallenge } from '../components/BalanceFinalChallenge'
import { WhyConstitutiveLaw } from '../components/WhyConstitutiveLaw'
import { ConstitutiveStateSpace } from '../components/ConstitutiveStateSpace'
import { MaterialObjectivity } from '../components/MaterialObjectivity'
import { MaterialSymmetry } from '../components/MaterialSymmetry'
import { LinearElasticityTensor } from '../components/LinearElasticityTensor'
import { StiffnessSymmetries } from '../components/StiffnessSymmetries'
import { IsotropicElasticConstants } from '../components/IsotropicElasticConstants'
import { VolumetricDeviatoricElasticity } from '../components/VolumetricDeviatoricElasticity'
import { IncompressibilityModes } from '../components/IncompressibilityModes'
import { BeyondLinearElasticity } from '../components/BeyondLinearElasticity'
import { ConstitutiveLab } from '../components/ConstitutiveLab'
import { ConstitutiveFinalChallenge } from '../components/ConstitutiveFinalChallenge'
import { WhyFiniteStrain } from '../components/WhyFiniteStrain'
import { FiniteStrainStressMeasures } from '../components/FiniteStrainStressMeasures'
import { HyperelasticEnergy } from '../components/HyperelasticEnergy'
import { DeformationInvariants } from '../components/DeformationInvariants'
import { HyperelasticModelComparison } from '../components/HyperelasticModelComparison'
import { OgdenModel } from '../components/OgdenModel'
import { IsochoricVolumetricSplit } from '../components/IsochoricVolumetricSplit'
import { NearIncompressibility } from '../components/NearIncompressibility'
import { NonlinearFEMNewton } from '../components/NonlinearFEMNewton'
import { TangentStiffnessStability } from '../components/TangentStiffnessStability'
import { BifurcationPostcritical } from '../components/BifurcationPostcritical'
import { ArcLengthContinuation } from '../components/ArcLengthContinuation'
import { ImperfectionSensitivity } from '../components/ImperfectionSensitivity'
import { FiniteStrainComputationalLab } from '../components/FiniteStrainComputationalLab'
import { FiniteStrainFinalChallenge } from '../components/FiniteStrainFinalChallenge'
import { WhyMaterialMemory } from '../components/WhyMaterialMemory'
import { RelaxationCreep } from '../components/RelaxationCreep'
import { MaxwellModel } from '../components/MaxwellModel'
import { KelvinVoigtModel } from '../components/KelvinVoigtModel'
import { StandardLinearSolid } from '../components/StandardLinearSolid'
import { GeneralizedMaxwell } from '../components/GeneralizedMaxwell'
import { HereditaryIntegral } from '../components/HereditaryIntegral'
import { CyclicHysteresis } from '../components/CyclicHysteresis'\nimport { FrequencyDomain } from '../components/FrequencyDomain'
import type { Language, NotationMode } from '../i18n'

export type ModuleId =
  | 'M00' | 'M01' | 'M02' | 'M03' | 'M04'
  | 'M05' | 'M06' | 'M07' | 'M08' | 'M09'
  | 'M10' | 'M11' | 'M12' | 'M13' | 'M14'
  | 'K00' | 'K01' | 'K02' | 'K03' | 'K04' | 'K05' | 'K06' | 'K07' | 'K08' | 'K09' | 'K10' | 'K11' | 'K12'
  | 'T00' | 'T01' | 'T02' | 'T03' | 'T04' | 'T05' | 'T06' | 'T07' | 'T08' | 'T09' | 'T10'
  | 'B00' | 'B01' | 'B02' | 'B03' | 'B04' | 'B05' | 'B06' | 'B07' | 'B08' | 'B09' | 'B10'
  | 'C00' | 'C01' | 'C02' | 'C03' | 'C04' | 'C05' | 'C06' | 'C07' | 'C08' | 'C09' | 'C10' | 'C11'
  | 'D00' | 'D01' | 'D02' | 'D03' | 'D04' | 'D05' | 'D06' | 'D07' | 'D08' | 'D09' | 'D10' | 'D11' | 'D12' | 'D13' | 'D14'
  | 'E00' | 'E01' | 'E02' | 'E03' | 'E04' | 'E05' | 'E06' | 'E07' | 'E08'

export type ChapterId = 'stress-state' | 'kinematics' | 'transport' | 'balance-laws' | 'constitutive-modeling' | 'finite-strain-hyperelasticity' | 'viscoelasticity-memory'

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
    moduleIds: ['T00', 'T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10'],
  },
  {
    id: 'balance-laws',
    title: { ru: 'Законы баланса', en: 'Balance laws' },
    shortTitle: { ru: 'Балансы', en: 'Balances' },
    moduleIds: ['B00', 'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B10'],
  },
  {
    id: 'constitutive-modeling',
    title: { ru: 'Конститутивные соотношения и модели материала', en: 'Constitutive relations and material models' },
    shortTitle: { ru: 'Материалы', en: 'Materials' },
    moduleIds: ['C00', 'C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10', 'C11'],
  },
  {
    id: 'finite-strain-hyperelasticity',
    title: { ru: 'Конечные деформации и гиперупругость', en: 'Finite strain and hyperelasticity' },
    shortTitle: { ru: 'Конечные деформации', en: 'Finite strain' },
    moduleIds: ['D00', 'D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09', 'D10', 'D11', 'D12', 'D13', 'D14'],
  },
  {
    id: 'viscoelasticity-memory',
    title: { ru: 'Вязкоупругость и память материала', en: 'Viscoelasticity and material memory' },
    shortTitle: { ru: 'Память материала', en: 'Material memory' },
    moduleIds: ['E00', 'E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08'],
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
  { id: 'T05', chapterId: 'transport', title: { ru: 'Скорость деформации и локальный спин', en: 'Rate of deformation and local spin' }, subtitle: { ru: 'L = D + W', en: 'L = D + W' }, render: ({notation,language,goTo}) => <RateDeformationSpin notation={notation} language={language} onBack={() => goTo('T04')} onNext={() => goTo('T06')} /> },
  { id: 'T06', chapterId: 'transport', title: { ru: 'Дивергенция скорости и изменение объёма', en: 'Velocity divergence and volume change' }, subtitle: { ru: 'J̇ = J tr D = J ∇·v', en: 'J̇ = J tr D = J ∇·v' }, render: ({notation,language,goTo}) => <VolumeRateJacobian notation={notation} language={language} onBack={() => goTo('T05')} onNext={() => goTo('T07')} /> },
  { id: 'T07', chapterId: 'transport', title: { ru: 'Транспортная теорема для материальной области', en: 'Transport theorem for a material region' }, subtitle: { ru: 'd/dt ∫Ωₜ φ dv', en: 'd/dt ∫Ωₜ φ dv' }, render: ({notation,language,goTo}) => <MaterialTransportTheorem notation={notation} language={language} onBack={() => goTo('T06')} onNext={() => goTo('T08')} /> },
  { id: 'T08', chapterId: 'transport', title: { ru: 'Контрольный объём и поток через границу', en: 'Control volume and boundary flux' }, subtitle: { ru: 'накопление + поток', en: 'accumulation + flux' }, render: ({notation,language,goTo}) => <ControlVolumeFlux notation={notation} language={language} onBack={() => goTo('T07')} onNext={() => goTo('T09')} /> },
  { id: 'T09', chapterId: 'transport', title: { ru: 'Общая теорема Рейнольдса', en: 'General Reynolds transport theorem' }, subtitle: { ru: 'относительная скорость v−w', en: 'relative velocity v−w' }, render: ({notation,language,goTo}) => <GeneralReynoldsTransport notation={notation} language={language} onBack={() => goTo('T08')} onNext={() => goTo('T10')} /> },
  { id: 'T10', chapterId: 'transport', title: { ru: 'Итоговая самопроверка по времени и транспорту', en: 'Final self-check on time and transport' }, subtitle: { ru: 'самостоятельные кинематические эксперименты', en: 'independent kinematic experiments' }, render: ({notation,language,goTo}) => <TransportFinalChallenge notation={notation} language={language} onBack={() => goTo('T09')} /> },
  { id: 'B00', chapterId: 'balance-laws', title: { ru: 'Что означает закон баланса?', en: 'What does a balance law mean?' }, subtitle: { ru: 'накопление + отток = источники', en: 'accumulation + outflux = sources' }, render: ({notation,language,goTo}) => <BalanceStructure notation={notation} language={language} onNext={() => goTo('B01')} /> },
  { id: 'B01', chapterId: 'balance-laws', title: { ru: 'Баланс массы и уравнение неразрывности', en: 'Mass balance and continuity equation' }, subtitle: { ru: 'Dρ/Dt + ρ∇·v = 0', en: 'Dρ/Dt + ρ∇·v = 0' }, render: ({notation,language,goTo}) => <MassBalance notation={notation} language={language} onBack={() => goTo('B00')} onNext={() => goTo('B02')} /> },
  { id: 'B02', chapterId: 'balance-laws', title: { ru: 'Баланс линейного импульса и уравнение Коши', en: 'Linear momentum balance and Cauchy equation' }, subtitle: { ru: 'ρa = ∇·σ + ρb', en: 'ρa = ∇·σ + ρb' }, render: ({notation,language,goTo}) => <LinearMomentumBalance notation={notation} language={language} onBack={() => goTo('B01')} onNext={() => goTo('B03')} /> },
  { id: 'B03', chapterId: 'balance-laws', title: { ru: 'Баланс момента импульса и симметрия напряжений', en: 'Angular momentum balance and stress symmetry' }, subtitle: { ru: 'σ = σᵀ', en: 'σ = σᵀ' }, render: ({notation,language,goTo}) => <AngularMomentumLaw notation={notation} language={language} onBack={() => goTo('B02')} onNext={() => goTo('B04')} /> },
  { id: 'B04', chapterId: 'balance-laws', title: { ru: 'Баланс энергии и первый закон термодинамики', en: 'Energy balance and the first law of thermodynamics' }, subtitle: { ru: 'ρ De/Dt = σ:D − ∇·q + ρr', en: 'ρ De/Dt = σ:D − ∇·q + ρr' }, render: ({notation,language,goTo}) => <EnergyBalance notation={notation} language={language} onBack={() => goTo('B03')} onNext={() => goTo('B05')} /> },
  { id: 'B05', chapterId: 'balance-laws', title: { ru: 'Мощность напряжений: сферическая и девиаторная части', en: 'Stress power: spherical and deviatoric parts' }, subtitle: { ru: 'σ:D = (trσ/3)(trD) + s:D_dev', en: 'σ:D = (trσ/3)(trD) + s:D_dev' }, render: ({notation,language,goTo}) => <StressPowerSplit notation={notation} language={language} onBack={() => goTo('B04')} onNext={() => goTo('B06')} /> },
  { id: 'B06', chapterId: 'balance-laws', title: { ru: 'Второй закон термодинамики и неравенство Клаузиуса–Дюгема', en: 'Second law and the Clausius–Duhem inequality' }, subtitle: { ru: '𝒟 ≥ 0', en: '𝒟 ≥ 0' }, render: ({notation,language,goTo}) => <ClausiusDuhem notation={notation} language={language} onBack={() => goTo('B05')} onNext={() => goTo('B07')} /> },
  { id: 'B07', chapterId: 'balance-laws', title: { ru: 'Термодинамические ограничения на простые конститутивные модели', en: 'Thermodynamic constraints on simple constitutive models' }, subtitle: { ru: 'упругость ↔ вязкость ↔ 𝒟', en: 'elasticity ↔ viscosity ↔ 𝒟' }, render: ({notation,language,goTo}) => <ConstitutiveAdmissibility notation={notation} language={language} onBack={() => goTo('B06')} onNext={() => goTo('B08')} /> },
  { id: 'B08', chapterId: 'balance-laws', title: { ru: 'Начально-краевая постановка задачи МСС', en: 'Initial-boundary-value problem in continuum mechanics' }, subtitle: { ru: 'уравнения + материал + условия', en: 'equations + material + conditions' }, render: ({notation,language,goTo}) => <InitialBoundaryProblem notation={notation} language={language} onBack={() => goTo('B07')} onNext={() => goTo('B09')} /> },
  { id: 'B09', chapterId: 'balance-laws', title: { ru: 'Слабая форма и мост к методу конечных элементов', en: 'Weak form and bridge to the finite-element method' }, subtitle: { ru: 'сильная форма → вариационная форма', en: 'strong form → variational form' }, render: ({notation,language,goTo}) => <WeakFormBridge notation={notation} language={language} onBack={() => goTo('B08')} onNext={() => goTo('B10')} /> },
  { id: 'B10', chapterId: 'balance-laws', title: { ru: 'Итоговая самопроверка по законам баланса', en: 'Final self-check on balance laws' }, subtitle: { ru: 'масса · импульс · энергия · диссипация · слабая форма', en: 'mass · momentum · energy · dissipation · weak form' }, render: ({notation,language,goTo}) => <BalanceFinalChallenge notation={notation} language={language} onBack={() => goTo('B09')} /> },
  { id: 'C00', chapterId: 'constitutive-modeling', title: { ru: 'Зачем нужен конститутивный закон?', en: 'Why do we need a constitutive law?' }, subtitle: { ru: 'балансы не определяют материал', en: 'balance laws do not define the material' }, render: ({notation,language,goTo}) => <WhyConstitutiveLaw notation={notation} language={language} onNext={() => goTo('C01')} /> },
  { id: 'C01', chapterId: 'constitutive-modeling', title: { ru: 'Что может входить в конститутивное соотношение?', en: 'What can enter a constitutive relation?' }, subtitle: { ru: 'состояние · история · температура · внутренние переменные', en: 'state · history · temperature · internal variables' }, render: ({notation,language,goTo}) => <ConstitutiveStateSpace notation={notation} language={language} onBack={() => goTo('C00')} onNext={() => goTo('C02')} /> },
  { id: 'C02', chapterId: 'constitutive-modeling', title: { ru: 'Материальная объективность', en: 'Material objectivity' }, subtitle: { ru: 'F* = QF, C* = C, σ* = QσQᵀ', en: 'F* = QF, C* = C, σ* = QσQᵀ' }, render: ({notation,language,goTo}) => <MaterialObjectivity notation={notation} language={language} onBack={() => goTo('C01')} onNext={() => goTo('C03')} /> },
  { id: 'C03', chapterId: 'constitutive-modeling', title: { ru: 'Изотропия и анизотропия', en: 'Isotropy and anisotropy' }, subtitle: { ru: 'поворот структуры ≠ поворот наблюдателя', en: 'rotating structure ≠ rotating observer' }, render: ({notation,language,goTo}) => <MaterialSymmetry notation={notation} language={language} onBack={() => goTo('C02')} onNext={() => goTo('C04')} /> },
  { id: 'C04', chapterId: 'constitutive-modeling', title: { ru: 'Линейная упругость и тензор жёсткости четвёртого порядка', en: 'Linear elasticity and the fourth-order stiffness tensor' }, subtitle: { ru: 'σ = 𝓒:ε', en: 'σ = 𝓒:ε' }, render: ({notation,language,goTo}) => <LinearElasticityTensor notation={notation} language={language} onBack={() => goTo('C03')} onNext={() => goTo('C05')} /> },
  { id: 'C05', chapterId: 'constitutive-modeling', title: { ru: 'Симметрии тензора жёсткости', en: 'Stiffness-tensor symmetries' }, subtitle: { ru: '81 → 36 → 21', en: '81 → 36 → 21' }, render: ({notation,language,goTo}) => <StiffnessSymmetries notation={notation} language={language} onBack={() => goTo('C04')} onNext={() => goTo('C06')} /> },
  { id: 'C06', chapterId: 'constitutive-modeling', title: { ru: 'Изотропная линейная упругость: E, ν, λ, μ, K и G', en: 'Isotropic linear elasticity: E, ν, λ, μ, K, and G' }, subtitle: { ru: 'два независимых параметра', en: 'two independent parameters' }, render: ({notation,language,goTo}) => <IsotropicElasticConstants notation={notation} language={language} onBack={() => goTo('C05')} onNext={() => goTo('C07')} /> },
  { id: 'C07', chapterId: 'constitutive-modeling', title: { ru: 'Объёмный и девиаторный отклик через K и G', en: 'Volumetric and deviatoric response through K and G' }, subtitle: { ru: 'объём ↔ форма', en: 'volume ↔ shape' }, render: ({notation,language,goTo}) => <VolumetricDeviatoricElasticity notation={notation} language={language} onBack={() => goTo('C06')} onNext={() => goTo('C08')} /> },
  { id: 'C08', chapterId: 'constitutive-modeling', title: { ru: 'Несжимаемость и почти несжимаемые материалы', en: 'Incompressibility and nearly incompressible materials' }, subtitle: { ru: 'J = 1 · давление · большой K', en: 'J = 1 · pressure · large K' }, render: ({notation,language,goTo}) => <IncompressibilityModes notation={notation} language={language} onBack={() => goTo('C07')} onNext={() => goTo('C09')} /> },
  { id: 'C09', chapterId: 'constitutive-modeling', title: { ru: 'Что ломается за пределами линейной упругости?', en: 'What breaks down beyond linear elasticity?' }, subtitle: { ru: 'большие деформации · память · повреждение · анизотропия', en: 'large strain · memory · damage · anisotropy' }, render: ({notation,language,goTo}) => <BeyondLinearElasticity notation={notation} language={language} onBack={() => goTo('C08')} onNext={() => goTo('C10')} /> },
  { id: 'C10', chapterId: 'constitutive-modeling', title: { ru: 'Конститутивная лаборатория', en: 'Constitutive laboratory' }, subtitle: { ru: 'сравнение редуцированных моделей', en: 'compare reduced models' }, render: ({notation,language,goTo}) => <ConstitutiveLab notation={notation} language={language} onBack={() => goTo('C09')} onNext={() => goTo('C11')} /> },
  { id: 'C11', chapterId: 'constitutive-modeling', title: { ru: 'Итоговая самопроверка по конститутивному моделированию', en: 'Final self-check on constitutive modeling' }, subtitle: { ru: 'параметры · несжимаемость · диссипация · анизотропия', en: 'parameters · incompressibility · dissipation · anisotropy' }, render: ({notation,language,goTo}) => <ConstitutiveFinalChallenge notation={notation} language={language} onBack={() => goTo('C10')} /> },
  { id: 'D00', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Почему нужны конечные деформации?', en: 'Why do we need finite-strain mechanics?' }, subtitle: { ru: 'геометрическая нелинейность и объективные меры', en: 'geometric nonlinearity and objective measures' }, render: ({notation,language,goTo}) => <WhyFiniteStrain notation={notation} language={language} onNext={() => goTo('D01')} /> },
  { id: 'D01', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Меры напряжений при конечных деформациях', en: 'Stress measures at finite strain' }, subtitle: { ru: 'σ · τ · P · S и конфигурации', en: 'σ · τ · P · S and configurations' }, render: ({notation,language,goTo}) => <FiniteStrainStressMeasures notation={notation} language={language} onBack={() => goTo('D00')} onNext={() => goTo('D02')} /> },
  { id: 'D02', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Гиперупругость через функцию энергии', en: 'Hyperelasticity through a strain-energy function' }, subtitle: { ru: 'Ψ → S, P, σ и касательная жёсткость', en: 'Ψ → S, P, σ and tangent stiffness' }, render: ({notation,language,goTo}) => <HyperelasticEnergy notation={notation} language={language} onBack={() => goTo('D01')} onNext={() => goTo('D03')} /> },
  { id: 'D03', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Инварианты деформации и объективная гиперупругость', en: 'Deformation invariants and objective hyperelasticity' }, subtitle: { ru: 'I₁ · I₂ · I₃ · J и проверка поворота', en: 'I₁ · I₂ · I₃ · J and rotation check' }, render: ({notation,language,goTo}) => <DeformationInvariants notation={notation} language={language} onBack={() => goTo('D02')} onNext={() => goTo('D04')} /> },
  { id: 'D04', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Нео–Гук и Муни–Ривлин', en: 'Neo-Hookean and Mooney–Rivlin' }, subtitle: { ru: 'что меняет зависимость от I₂', en: 'what changes when I₂ enters the energy' }, render: ({notation,language,goTo}) => <HyperelasticModelComparison notation={notation} language={language} onBack={() => goTo('D03')} onNext={() => goTo('D05')} /> },
  { id: 'D05', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Модель Огдена: гиперупругость через главные растяжения', en: 'Ogden: hyperelasticity through principal stretches' }, subtitle: { ru: 'роль α и сильная нелинейность', en: 'role of α and strong nonlinearity' }, render: ({notation,language,goTo}) => <OgdenModel notation={notation} language={language} onBack={() => goTo('D04')} onNext={() => goTo('D06')} /> },
  { id: 'D06', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Изохорно-объёмное разложение', en: 'Isochoric–volumetric split' }, subtitle: { ru: 'форма · объём · почти несжимаемость', en: 'shape · volume · near incompressibility' }, render: ({notation,language,goTo}) => <IsochoricVolumetricSplit notation={notation} language={language} onBack={() => goTo('D05')} onNext={() => goTo('D07')} /> },
  { id: 'D07', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Почти несжимаемость: давление и смешанная u–p постановка', en: 'Near incompressibility: pressure and mixed u–p formulation' }, subtitle: { ru: 'штрафной метод · давление · объёмная блокировка', en: 'penalty method · pressure · volumetric locking' }, render: ({notation,language,goTo}) => <NearIncompressibility notation={notation} language={language} onBack={() => goTo('D06')} onNext={() => goTo('D08')} /> },
  { id: 'D08', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Нелинейный МКЭ: остаток, касательная жёсткость и метод Ньютона', en: 'Nonlinear FEM: residual, tangent stiffness, and Newton method' }, subtitle: { ru: 'R(u) · K_T · итерации Ньютона', en: 'R(u) · K_T · Newton iterations' }, render: ({notation,language,goTo}) => <NonlinearFEMNewton notation={notation} language={language} onBack={() => goTo('D07')} onNext={() => goTo('D09')} /> },
  { id: 'D09', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Материальная и геометрическая жёсткость. Потеря устойчивости', en: 'Material and geometric stiffness. Loss of stability' }, subtitle: { ru: 'K_mat · K_geo · λ_min(K_T)', en: 'K_mat · K_geo · λ_min(K_T)' }, render: ({notation,language,goTo}) => <TangentStiffnessStability notation={notation} language={language} onBack={() => goTo('D08')} onNext={() => goTo('D10')} /> },
  { id: 'D10', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Бифуркации и посткритическое поведение', en: 'Bifurcations and post-critical behavior' }, subtitle: { ru: 'ветви равновесия · критическая точка · энергетический ландшафт', en: 'equilibrium branches · critical point · energy landscape' }, render: ({notation,language,goTo}) => <BifurcationPostcritical notation={notation} language={language} onBack={() => goTo('D09')} onNext={() => goTo('D11')} /> },
  { id: 'D11', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Продолжение ветвей решения и метод длины дуги', en: 'Solution continuation and the arc-length method' }, subtitle: { ru: 'управление нагрузкой · предельная точка · длина дуги', en: 'load control · limit point · arc length' }, render: ({notation,language,goTo}) => <ArcLengthContinuation notation={notation} language={language} onBack={() => goTo('D10')} onNext={() => goTo('D12')} /> },
  { id: 'D12', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Чувствительность к несовершенствам и реальная потеря устойчивости', en: 'Imperfection sensitivity and real instability' }, subtitle: { ru: 'идеальная симметрия · несовершенство · выбор ветви', en: 'perfect symmetry · imperfection · branch selection' }, render: ({notation,language,goTo}) => <ImperfectionSensitivity notation={notation} language={language} onBack={() => goTo('D11')} onNext={() => goTo('D13')} /> },
  { id: 'D13', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Вычислительная лаборатория конечных деформаций и устойчивости', en: 'Computational laboratory for finite strain and stability' }, subtitle: { ru: 'гиперупругость · касательная жёсткость · ветви · несовершенства', en: 'hyperelasticity · tangent stiffness · branches · imperfections' }, render: ({notation,language,goTo}) => <FiniteStrainComputationalLab notation={notation} language={language} onBack={() => goTo('D12')} onNext={() => goTo('D14')} /> },
  { id: 'D14', chapterId: 'finite-strain-hyperelasticity', title: { ru: 'Итоговая самопроверка по конечным деформациям и гиперупругости', en: 'Final self-check on finite strain and hyperelasticity' }, subtitle: { ru: 'энергия · напряжения · устойчивость · продолжение · несовершенства', en: 'energy · stresses · stability · continuation · imperfections' }, render: ({notation,language,goTo}) => <FiniteStrainFinalChallenge notation={notation} language={language} onBack={() => goTo('D13')} onNext={() => goTo('E00')} /> },
  { id: 'E00', chapterId: 'viscoelasticity-memory', title: { ru: 'Почему материал может помнить прошлое?', en: 'Why can a material remember its past?' }, subtitle: { ru: 'история нагружения · время · внутренние переменные', en: 'loading history · time · internal variables' }, render: ({notation,language,goTo}) => <WhyMaterialMemory notation={notation} language={language} onNext={() => goTo('E01')} /> },
  { id: 'E01', chapterId: 'viscoelasticity-memory', title: { ru: 'Релаксация напряжений и ползучесть', en: 'Stress relaxation and creep' }, subtitle: { ru: 'ε=const → σ(t) · σ=const → ε(t)', en: 'ε=const → σ(t) · σ=const → ε(t)' }, render: ({notation,language,goTo}) => <RelaxationCreep notation={notation} language={language} onBack={() => goTo('E00')} onNext={() => goTo('E02')} /> },
  { id: 'E02', chapterId: 'viscoelasticity-memory', title: { ru: 'Модель Максвелла', en: 'Maxwell model' }, subtitle: { ru: 'последовательное соединение упругого и вязкого элементов', en: 'spring + dashpot in series' }, render: ({notation,language,goTo}) => <MaxwellModel notation={notation} language={language} onBack={() => goTo('E01')} onNext={() => goTo('E03')} /> },
  { id: 'E03', chapterId: 'viscoelasticity-memory', title: { ru: 'Модель Кельвина—Фойгта', en: 'Kelvin–Voigt model' }, subtitle: { ru: 'параллельное соединение упругого и вязкого элементов', en: 'spring + dashpot in parallel' }, render: ({notation,language,goTo}) => <KelvinVoigtModel notation={notation} language={language} onBack={() => goTo('E02')} onNext={() => goTo('E04')} /> },
  { id: 'E04', chapterId: 'viscoelasticity-memory', title: { ru: 'Стандартная линейная модель твёрдого тела (модель Ценера)', en: 'Standard Linear Solid (Zener)' }, subtitle: { ru: 'мгновенная, релаксирующая и равновесная составляющие', en: 'instantaneous and equilibrium stiffness' }, render: ({notation,language,goTo}) => <StandardLinearSolid notation={notation} language={language} onBack={() => goTo('E03')} onNext={() => goTo('E05')} /> },
  { id: 'E05', chapterId: 'viscoelasticity-memory', title: { ru: 'Обобщённая модель Максвелла и спектр времён релаксации', en: 'Generalized Maxwell model and relaxation-time spectrum' }, subtitle: { ru: 'несколько временных масштабов · ряд Прони', en: 'multiple timescales · Prony series' }, render: ({notation,language,goTo}) => <GeneralizedMaxwell notation={notation} language={language} onBack={() => goTo('E04')} onNext={() => goTo('E06')} /> },
  { id: 'E06', chapterId: 'viscoelasticity-memory', title: { ru: 'Наследственный интеграл и принцип суперпозиции Больцмана', en: 'Hereditary integral and Boltzmann superposition principle' }, subtitle: { ru: 'ядро памяти · история деформации · свёртка', en: 'memory kernel · strain history · convolution' }, render: ({notation,language,goTo}) => <HereditaryIntegral notation={notation} language={language} onBack={() => goTo('E05')} onNext={() => goTo('E07')} /> },
  { id: 'E07', chapterId: 'viscoelasticity-memory', title: { ru: 'Циклическое нагружение, фазовый сдвиг и гистерезис', en: 'Cyclic loading, phase lag, and hysteresis' }, subtitle: { ru: 'фазовый сдвиг · петля σ–ε · диссипация энергии', en: 'phase lag · σ–ε loop · energy dissipation' }, render: ({notation,language,goTo}) => <CyclicHysteresis notation={notation} language={language} onBack={() => goTo('E06')} onNext={() => goTo('E08')} /> },\n  { id: 'E08', chapterId: 'viscoelasticity-memory', title: { ru: 'Частотная область: модули хранения и потерь', en: 'Frequency domain: storage and loss moduli' }, subtitle: { ru: 'E′(ω) · E″(ω) · tanδ · ωτ', en: 'E′(ω) · E″(ω) · tanδ · ωτ' }, render: ({notation,language,goTo}) => <FrequencyDomain notation={notation} language={language} onBack={() => goTo('E07')} /> },
]

export const moduleById = Object.fromEntries(modules.map((m) => [m.id, m])) as Record<ModuleId, ModuleDefinition>
export const chapterById = Object.fromEntries(chapters.map((c) => [c.id, c])) as Record<ChapterId, ChapterDefinition>
