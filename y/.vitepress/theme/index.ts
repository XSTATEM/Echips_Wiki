import { h } from 'vue'
import { useRoute, useData } from 'vitepress' // <-- Добавили useData
import DefaultTheme from 'vitepress/theme'
import StepGuide from '../../components/StepGuide.vue' 
import NewOrder from '../../components/NewOrder.vue'
import Comments from '../components/Comments.vue' // <-- Твой правильный путь
import BlocksRenderer from '../../components/BlocksRenderer.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx: any) {
    const { app } = ctx
    app.component('StepGuide', StepGuide)
    app.component('NewOrder', NewOrder)
    app.component('Comments', Comments)
    app.component('BlocksRenderer', BlocksRenderer)
  },
  Layout: () => {
    const route = useRoute()
    const { frontmatter } = useData() // <-- Достаем настройки текущей страницы

    return h(DefaultTheme.Layout, null, {
      'doc-before': () => {
        // Прячем блоки-конструктор на главной странице
        if (frontmatter.value.layout === 'home') return null
        return h(BlocksRenderer, { key: route.path + '-blocks' })
      },
      'doc-after': () => {
        // Прячем комментарии на главной странице 
        // ИЛИ если в статье явно написано show_comments: false
        if (frontmatter.value.layout === 'home' || frontmatter.value.show_comments === false) return null
        return h(Comments, { key: route.path + '-comments' })
      }
    })
  }
}