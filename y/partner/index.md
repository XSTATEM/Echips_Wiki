---
layout: page
title: База знаний АСЦ
sidebar: false
---

<script setup>
import { onMounted } from 'vue'
import { data as docs } from './docs.data.mjs'

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.glass-effect');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });
  }
})
</script>

<div class="echips-wrapper">
  <div class="bg-glow top-glow"></div>
  <div class="bg-glow bottom-glow"></div>

  <div class="main-header">
    <a href="/service/" class="back-link">← В сервисный центр</a>
    <h1 class="hero-title">База знаний АСЦ</h1>
    <p class="hero-subtitle">Официальные инструкции, регламенты и стандарты диагностики Echips.</p>
  </div>

  <div v-if="docs.length > 0" class="docs-grid">  
    <a 
      v-for="doc in docs" 
      :key="doc.url" 
      :href="doc.url" 
      class="doc-card glass-effect tilt-card"
    >
      <div class="mouse-glow"></div>
      <div class="card-inner">
        <div>
          <h2 class="card-h">{{ doc.title }}</h2>
          <p class="card-desc" v-if="doc.description">{{ doc.description }}</p>
        </div>
        <span class="btn-yellow">Читать инструкцию &rarr;</span>
      </div>
    </a>
  </div>
  
  <div v-else class="empty-state glass-effect">
    <p>Инструкции пока не добавлены. Перейдите в админку и создайте первую статью в разделе «Инструкции для АСЦ»!</p>
  </div>
</div>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

:deep(h1:not(.hero-title)) { display: none !important; }
.echips-wrapper a { text-decoration: none !important; }

.echips-wrapper {
  --echips-coral: #FF4500; --echips-blue: #FFB800;
  max-width: 1000px; margin: 0 auto; padding: 100px 20px 60px;
  position: relative; font-family: 'Montserrat', sans-serif !important;
}

.bg-glow { position: absolute; border-radius: 50%; filter: blur(140px); z-index: -1; pointer-events: none; }
.top-glow { width: 450px; height: 450px; background: var(--echips-coral); top: -10%; left: 5%; opacity: 0.25; } 
.bottom-glow { width: 550px; height: 550px; background: var(--echips-blue); bottom: 10%; right: -5%; opacity: 0.15; } 

.main-header { margin-bottom: 50px; text-align: left; }
.back-link { color: var(--vp-c-text-2) !important; text-transform: uppercase; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 24px; }
.hero-title { font-size: 48px; font-weight: 800; margin: 0 0 16px 0 !important; color: var(--vp-c-text-1); letter-spacing: -1px; }
.hero-subtitle { font-size: 18px; color: var(--vp-c-text-2); margin: 0; line-height: 1.5; max-width: 600px; }

.docs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }

.doc-card { 
  padding: 32px 24px; border-radius: 20px; display: flex; flex-direction: column; 
  height: 100%; min-height: 220px;
}
.card-inner { position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: space-between; height: 100%; width: 100%; }

.card-h { font-size: 20px; font-weight: 700; color: var(--vp-c-text-1); margin: 0 0 12px 0 !important; border: none; padding: 0; line-height: 1.3; }
.card-desc { font-size: 14px; color: var(--vp-c-text-2); margin: 0 0 24px 0; line-height: 1.5; }

.btn-yellow { font-size: 13px; font-weight: 600; color: var(--vp-c-text-1); background: var(--vp-c-default-soft); padding: 12px 16px; border-radius: 20px; transition: all 0.3s; width: 100%; box-sizing: border-box; text-align: center; }
.doc-card:hover .btn-yellow { background: var(--echips-blue); color: #000 !important; box-shadow: 0 4px 12px rgba(255, 184, 0, 0.3); }

.glass-effect { background: var(--vp-c-bg-soft); border: 1px solid rgba(128, 130, 133, 0.25); box-shadow: 0 12px 32px rgba(0,0,0,0.08); overflow: hidden; position: relative; }
html.dark .glass-effect { border-color: rgba(255, 255, 255, 0.12); box-shadow: 0 16px 40px rgba(0,0,0,0.3); }

.tilt-card { transition: transform 0.2s, box-shadow 0.3s, border-color 0.3s; }
.tilt-card:hover { transform: translateY(-5px); border-color: rgba(255, 184, 0, 0.4); }

.mouse-glow { position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0; transition: opacity 0.5s; pointer-events: none; z-index: 0; background: radial-gradient(circle 250px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 184, 0, 0.5), transparent 100%); }
.doc-card:hover .mouse-glow { opacity: 1; }

.empty-state { padding: 40px; text-align: center; border-radius: 20px; color: var(--vp-c-text-2); font-size: 16px; border: 1px dashed var(--vp-c-divider); background: transparent; }

:deep(.VPNavBar) { background-color: transparent !important; backdrop-filter: blur(25px) !important; -webkit-backdrop-filter: blur(25px) !important; border-bottom: 1px solid var(--vp-c-divider) !important; }
html.dark :deep(.VPNavBar) { background-color: rgba(30, 30, 30, 0.4) !important; border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important; }
</style>