<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'
import { marked } from 'marked'

// Достаем данные из шапки статьи
const { frontmatter } = useData()
const blocks = computed(() => frontmatter.value.blocks || [])

// Функция для рендера текста (чтобы работали ссылки и жирный шрифт)
const parseMd = (text) => text ? marked.parse(text) : ''

// Функция, которая "вытаскивает" правильный ID из любой ссылки на YouTube
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
      
      <div v-else-if="block.type === 'video_block'" class="video-block">
        <iframe 
          width="100%" 
          height="450" 
          :src="'https://www.youtube.com/embed/' + getYoutubeId(block.url)" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
          style="border-radius: 12px; margin: 24px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
        ></iframe>
      </div>

      <div v-else-if="block.type === 'step_block'" class="step-block" style="margin-top: 32px;">
        <h3 v-if="block.h" style="margin-bottom: 12px;">{{ block.h }}</h3>
        <div class="vp-doc" v-html="parseMd(block.text)"></div>
        <img v-if="block.image" :src="block.image" alt="Шаг" style="border-radius: 8px; margin-top: 16px; border: 1px solid var(--vp-c-divider);" />
      </div>

      <div v-else-if="block.type === 'callout_block'" :class="['custom-block', block.type || 'tip']">
        <p class="custom-block-title">{{ block.title || 'Информация' }}</p>
        <div v-html="parseMd(block.content)"></div>
      </div>

    </template>
  </div>
</template>