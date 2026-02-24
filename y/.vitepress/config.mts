import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Echips Wiki",
  description: "База знаний для АСЦ",
  ignoreDeadLinks: true, // Оставляем, чтобы не падал билд!
  
  themeConfig: {
    // 1. ВЕРХНЕЕ МЕНЮ (Справа от логотипа)
    nav: [
      { text: 'Главная', link: '/' },
      // Ссылка на любую твою стартовую инструкцию
      { text: 'Инструкции', link: '/partner/nrp-act' } 
    ],

    // 2. ЛЕВОЕ МЕНЮ (Сама структура Вики)
    sidebar: [
      {
        text: 'Регламенты АСЦ',
        items: [
          // Пропиши тут пути к твоим файлам (без .md на конце)
          { text: 'Выдача Акта НРП', link: '/partner/nrp-act' },
          { text: 'Оформление заказа 1С', link: '/partner/new-order' }
        ]
      }
    ],

    // 3. ПОИСК
    search: {
      provider: 'local'
    },

    // 4. ОГЛАВЛЕНИЕ (Справа)
    outline: {
      label: 'На этой странице',
      level: [2, 3]
    }
  }
})