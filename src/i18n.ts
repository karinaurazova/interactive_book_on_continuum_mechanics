export type Language = 'ru' | 'en'
export type NotationMode = 'Tensor' | 'Index' | 'Matrix' | 'Python'

export const ui = {
  ru: {
    eyebrow: 'МЕХАНИКА СПЛОШНЫХ СРЕД / v0.1',
    brand: 'Интерактивный учебник',
    pilot: 'ПИЛОТНАЯ ГЛАВА',
    progress: 'Прогресс v0.1',
    language: 'Язык',
    notationLabel: 'Форма записи',
    notationNames: {
      Tensor: 'Тензорная',
      Index: 'Индексная',
      Matrix: 'Матричная',
      Python: 'Python',
    },
    modules: {
      M00: { title: 'Континуум', subtitle: 'От микроструктуры к полю' },
      M01: { title: 'Мысленный разрез', subtitle: 'Как увидеть внутреннее взаимодействие' },
      M02: { title: 'Вектор напряжения', subtitle: 'Нормальная и касательная составляющие' },
      M03: { title: 'Ориентация площадки', subtitle: 'Отображение n ↦ t(n)' },
    },
  },
  en: {
    eyebrow: 'CONTINUUM MECHANICS / v0.1',
    brand: 'Interactive Textbook',
    pilot: 'PILOT CHAPTER',
    progress: 'v0.1 progress',
    language: 'Language',
    notationLabel: 'Notation',
    notationNames: {
      Tensor: 'Tensor',
      Index: 'Index',
      Matrix: 'Matrix',
      Python: 'Python',
    },
    modules: {
      M00: { title: 'Continuum', subtitle: 'From microstructure to field' },
      M01: { title: 'Imaginary cut', subtitle: 'Making internal interaction visible' },
      M02: { title: 'Traction vector', subtitle: 'Normal and tangential components' },
      M03: { title: 'Plane orientation', subtitle: 'Mapping n ↦ t(n)' },
    },
  },
} as const
