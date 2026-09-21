export type Language = 'ru' | 'en'
export type NotationMode = 'Tensor' | 'Index' | 'Matrix' | 'Python'

export const ui = {
  ru: {
    eyebrow: 'ЗАКУЛИСЬЕ МАТМОДЕЛЬЕРА / MSS',
    brand: 'Continuum Mechanics Lab',
    pilot: 'ПИЛОТНАЯ ГЛАВА',
    progress: 'Прогресс v0.1',
    language: 'Язык',
    modules: {
      M00: { title: 'Континуум', subtitle: 'От микроструктуры к полю' },
      M01: { title: 'Мысленный разрез', subtitle: 'Как увидеть внутреннее взаимодействие' },
      M02: { title: 'Traction Lab', subtitle: 'Нормаль, вектор напряжения и разложение' },
    },
  },
  en: {
    eyebrow: 'BEHIND THE MATHMODELLER / CM',
    brand: 'Continuum Mechanics Lab',
    pilot: 'PILOT CHAPTER',
    progress: 'v0.1 progress',
    language: 'Language',
    modules: {
      M00: { title: 'Continuum', subtitle: 'From microstructure to field' },
      M01: { title: 'Imaginary cut', subtitle: 'Making internal interaction visible' },
      M02: { title: 'Traction Lab', subtitle: 'Normal, traction vector, and decomposition' },
    },
  },
} as const
