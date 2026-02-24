import { h } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import StepGuide from '../../components/StepGuide.vue'
import NewOrder from '../../components/NewOrder.vue'
import Comments from '../components/Comments.vue'
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
    return h(DefaultTheme.Layout, null, {
      // Это выводит твои блоки из админки сверху
      'doc-before': () => h(BlocksRenderer, { key: route.path + '-blocks' }),
      
      // А ВОТ ЭТО ЖЕЛЕЗОБЕТОННО ВЫВОДИТ КОММЕНТАРИИ ВНИЗУ КАЖДОЙ СТРАНИЦЫ
      'doc-after': () => h(Comments, { key: route.path + '-comments' }) 
    })
  }
}