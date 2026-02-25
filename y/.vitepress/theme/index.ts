import { h } from 'vue'
import { useRoute, useData } from 'vitepress' 
import DefaultTheme from 'vitepress/theme'
import StepGuide from '../../components/StepGuide.vue' 
import NewOrder from '../../components/NewOrder.vue'
import Comments from '../components/Comments.vue' 
import BlocksRenderer from '../../components/BlocksRenderer.vue'
import LoginGuard from '../../components/LoginGuard.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx: any) {
    const { app } = ctx
    app.component('StepGuide', StepGuide)
    app.component('NewOrder', NewOrder)
    app.component('Comments', Comments)
    app.component('BlocksRenderer', BlocksRenderer)
    app.component('LoginGuard', LoginGuard)
  },
  Layout: () => {
    const route = useRoute()
    const { frontmatter } = useData()

    return h(LoginGuard, null, {
      default: () => h(DefaultTheme.Layout, null, {
        'doc-before': () => {
          if (frontmatter.value.layout === 'home') return null
          return h(BlocksRenderer, { key: route.path + '-blocks' })
        },
        'doc-after': () => {
          if (frontmatter.value.layout === 'home' || frontmatter.value.show_comments === false) return null
          return h(Comments, { key: route.path + '-comments' })
        }
      })
    })  
  }
}