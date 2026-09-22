export type Language = 'ru' | 'en'
export type NotationMode = 'Tensor' | 'Index' | 'Matrix' | 'Python'

export const ui = {
  ru: {
    eyebrow: 'МЕХАНИКА СПЛОШНЫХ СРЕД / v0.4',
    brand: 'Интерактивный учебник',
    pilot: 'ПИЛОТНАЯ ГЛАВА',
    progress: 'Прогресс главы',
    language: 'Язык',
    notationLabel: 'Форма записи',
    notationNames: {
      Tensor: 'Тензорная',
      Index: 'Индексная',
      Matrix: 'Матричная',
      Python: 'Python',
    },
  },
  en: {
    eyebrow: 'CONTINUUM MECHANICS / v0.4',
    brand: 'Interactive Textbook',
    pilot: 'PILOT CHAPTER',
    progress: 'Chapter progress',
    language: 'Language',
    notationLabel: 'Notation',
    notationNames: {
      Tensor: 'Tensor',
      Index: 'Index',
      Matrix: 'Matrix',
      Python: 'Python',
    },
  },
} as const
