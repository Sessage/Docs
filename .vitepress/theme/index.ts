import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import YouTubeVideo from './YouTubeVideo.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('YouTubeVideo', YouTubeVideo)
  }
} satisfies Theme
