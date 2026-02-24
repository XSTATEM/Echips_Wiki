import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import StepGuide from '../../components/StepGuide.vue'
import NewOrder from '../../components/NewOrder.vue'
import BlocksRenderer from '../../components/BlocksRenderer.vue' // <-- Добавили наш рендерер
import './style.css'

export default {
  extends: DefaultTheme,
  // Мы просто добавили ": any" после ctx и после app
  enhanceApp(ctx: any) {
    const { app } = ctx
    app.component('StepGuide', StepGuide)
    app.component('NewOrder', NewOrder)
    app.component('BlocksRenderer', BlocksRenderer)
  },
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(BlocksRenderer),
    })
  }
}