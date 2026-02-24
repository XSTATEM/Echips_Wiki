<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'
import { marked } from 'marked'

const { frontmatter } = useData()
const blocks = computed(() => frontmatter.value.blocks || [])

const parseMd = (text) => text ? marked.parse(text) : ''

const getYoutubeId = (url) => {
  if (!url) return ''
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}
</script>

<template>
  <div class="blocks-container">
    <template v-for="(block, idx) in blocks" :key="idx">
      
      <div v-if="block.type === 'text_block'" class="vp-doc" v-html="parseMd(block.content)"></div>
      
      <div v-else-if="block.type === 'step_block'" class="step-item" style="margin-bottom: 2rem;">
        <h3 v-if="block.h" style="margin-top: 0;">{{ block.h }}</h3>
        <div class="vp-doc" v-html="parseMd(block.text)"></div>
        <img v-if="block.image" :src="block.image" style="border-radius: 12px; border: 1px solid var(--vp-c-divider); margin-top: 1rem;" />
      </div>

      <div v-else-if="block.type === 'video_block'" class="video-container" style="margin: 2rem 0;">
        <iframe width="100%" height="450" :src="'https://www.youtube.com/embed/' + getYoutubeId(block.url)" frameborder="0" allowfullscreen style="border-radius: 12px; box-shadow: var(--vp-shadow-3);"></iframe>
        <p v-if="block.caption" style="text-align: center; font-style: italic; font-size: 0.9rem; color: var(--vp-c-text-2);">{{ block.caption }}</p>
      </div>

      <div v-else-if="block.type === 'callout_block' || block.type === 'warning'" :class="['custom-block', block.type || 'tip']" style="margin: 1.5rem 0;">
        <p class="custom-block-title">{{ block.title || 'ОБРАТИТЕ ВНИМАНИЕ' }}</p>
        <div v-html="parseMd(block.content)"></div>
      </div>

      <div v-else-if="block.type === 'file_block'" style="margin: 1.5rem 0;">
        <a :href="block.file" target="_blank" class="file-card">
          <span style="font-size: 1.5rem;">📁</span>
          <div>
            <strong>{{ block.label || 'Скачать файл' }}</strong>
            <p style="margin: 0; font-size: 0.8rem; opacity: 0.7;">Нажмите для просмотра</p>
          </div>
        </a>
      </div>

      <div v-else-if="block.type === 'table_block'" class="vp-doc" style="margin: 1.5rem 0;">
        <h4 v-if="block.caption">{{ block.caption }}</h4>
        <div v-html="parseMd(block.table_data)"></div>
      </div>

      <div v-else-if="block.type === 'gallery_block'" class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0;">
        <div v-for="(img, i) in block.images" :key="i" style="text-align: center;">
          <img :src="img.url" :alt="img.alt" style="border-radius: 8px; border: 1px solid var(--vp-c-divider);" />
          <p v-if="img.alt" style="font-size: 0.8rem; margin-top: 0.5rem;">{{ img.alt }}</p>
        </div>
      </div>

      <div v-else-if="block.type === 'button_block'" style="margin: 1.5rem 0; text-align: center;">
        <a :href="block.link" :class="['v-button', block.color || 'brand']">{{ block.text }}</a>
      </div>

    </template>
  </div>
</template>

<style scoped>
.file-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none !important;
  transition: border-color 0.2s;
}
.file-card:hover { border-color: var(--vp-c-brand); }
.v-button {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  text-decoration: none !important;
}
.v-button.brand { background: var(--vp-c-brand); color: white; }
.v-button.alt { background: var(--vp-c-bg-mute); color: var(--vp-c-text-1); }
</style>