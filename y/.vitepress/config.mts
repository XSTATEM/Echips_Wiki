
import { defineConfig } from 'vitepress'



// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Echips Service Wiki",
  description: "База знаний для АСЦ и клиентов",
  lang: 'ru-RU',

  ignoreDeadLinks: true, // <--- ВОТ ЭТА СТРОЧКА СПАСЕТ НАС
  
  themeConfig: {
    // Навигация сверху
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Клиентам', link: '/client/' },
      { text: 'Партнерам (АСЦ)', link: '/partner/' },
    ],

    // Боковое меню
    sidebar: {
      // Меню для раздела Партнеров
      '/partner/': [
        {
          text: '⚡ Быстрый старт',
          items: [
            { text: '➕ СОЗДАТЬ ЗАКАЗ', link: '/partner/new-order' },
            { text: 'Главная панель', link: '/partner/' },
          ]
        },
        {
          text: '💻 Инструкции 1С',
          items: [
            { text: 'Оформление заказа', link: '/partner/create-order' },
            { text: 'Заказ запчастей', link: '/partner/parts-request' },
          ]
        },
        {
          text: '📜 Регламенты',
          items: [
            { text: 'Акт НРП', link: '/partner/nrp-act' },
            { text: 'Подменный фонд', link: '/partner/substitution' },
          ]
        }
      ],

      // Меню для Клиентов
      '/client/': [
        {
          text: 'Информация',
          items: [
            { text: 'Гарантия', link: '/client/' },
            { text: 'Поддержка', link: '/client/support' }
          ]
        }
      ]
    },

    socialLinks: [
      // Можно добавить ссылку на Telegram
    ],
    
    footer: {
      message: 'Сервисный департамент Echips',
      copyright: '© 2026'
    }
  }
})