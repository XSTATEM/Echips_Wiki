import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue' // <--- Добавили импорт
import StepGuide from '../../components/StepGuide.vue'
import NewOrder from '../../components/NewOrder.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: Layout, // <--- Указали использовать наш замок
  enhanceApp(ctx: any) {
    ctx.app.component('StepGuide', StepGuide)
    ctx.app.component('NewOrder', NewOrder)
  }
}