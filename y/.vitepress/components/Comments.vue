<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const container = ref(null)

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'XSTATEM/Echips_Wiki')
  script.setAttribute('data-repo-id', 'R_kgDORTt3aQ')
  script.setAttribute('data-category', 'General')
  script.setAttribute('data-category-id', 'DIC_kwDORTt3ac4C22bF')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', 'light')
  script.setAttribute('data-lang', 'ru')
  script.crossOrigin = 'anonymous'
  script.async = true
  
  container.value.appendChild(script)
})
</script>

<template>
  <div class="giscus-wrapper" :key="route.path" ref="container" style="margin-top: 50px; border-top: 1px solid #eaeaea; padding-top: 30px;">
    </div>
</template>