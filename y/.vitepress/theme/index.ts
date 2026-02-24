import DefaultTheme from 'vitepress/theme'
import StepGuide from '../../components/StepGuide.vue'
import NewOrder from '../../components/NewOrder.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx: any) {
    ctx.app.component('StepGuide', StepGuide)
    ctx.app.component('NewOrder', NewOrder)
  }
}