<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const container = ref(null)

const loadGiscus = () => {
  if (!container.value) return
  
  // Очищаем контейнер перед новой загрузкой, чтобы комментарии не дублировались
  container.value.innerHTML = ''
  
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
  script.setAttribute('data-theme', 'preferred_color_scheme') 
  script.setAttribute('data-lang', 'ru')
  script.crossOrigin = 'anonymous'
  script.async = true
  
  container.value.appendChild(script)
}

onMounted(() => {
  loadGiscus()
})

// Следим за сменой пути: если перешли в другую статью — перезагружаем Giscus
watch(() => route.path, () => {
  loadGiscus()
})
</script>

<template>
  <div class="comments-wrapper">
    <div class="comments-header">
      💬 Обсуждение регламента
    </div>
    <div ref="container" class="giscus-container"></div>
  </div>
</template>

<style scoped>
.comments-wrapper {
  margin-top: 60px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--vp-c-divider);
}

.comments-header {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.giscus-container {
  min-height: 300px;
}
</style>