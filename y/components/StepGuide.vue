<script setup>
defineProps({
  step: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, default: '' }
})
</script>

<template>
  <div class="step-card">
    <div class="step-header">
      <div class="step-badge">{{ step }}</div>
      <h3 class="step-title">{{ title }}</h3>
    </div>
    <div class="step-content">
      <slot></slot>
    </div>
    <div v-if="image" class="step-image">
      <img :src="image" :alt="title" loading="lazy" />
    </div>
  </div>
</template>

<style scoped>
.step-card {
  margin: 24px 0;
  padding: 20px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.step-badge {
  background: #007aff; /* Синий цвет Apple */
  color: white;
  font-weight: bold;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.step-title {
  margin: 0 !important;
  font-size: 18px;
  font-weight: 600;
}

.step-image img {
  margin-top: 16px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  max-height: 400px; /* Чтобы скриншоты не были гигантскими */
  object-fit: contain;
}
</style>