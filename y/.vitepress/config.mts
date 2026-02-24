import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Echips Wiki",
  ignoreDeadLinks: true,
  description: "База знаний для АСЦ",
  themeConfig: {
    // Твоё меню (nav)
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Инструкции', link: '/partner/' }
    ],

    // 1. ПОИСК (Добавь запятую перед этим блоком, если сверху что-то есть!)
    search: {
      provider: 'local'
    },

    // 2. ССЫЛКА НА РЕДАКТИРОВАНИЕ
    editLink: {
      pattern: 'https://github.com/XSTATEM/Echips_Wiki/edit/main/y/:path',
      text: 'Править страницу на GitHub'
    },

    // 3. ПРАВОЕ МЕНЮ (Оглавление)
    outline: {
      label: 'На этой странице',
      level: [2, 3]
    },

    // Социальные ссылки
    socialLinks: [
      { icon: 'github', link: 'https://github.com/XSTATEM/Echips_Wiki' }
    ]
  }
})