<script setup>
import { ref, onMounted } from 'vue'

const isAuthorized = ref(false)
const login = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

onMounted(() => {
  if (localStorage.getItem('echips_wiki_token')) {
    isAuthorized.value = true
  }
})

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch('https://echips-auth.uzakovv41.workers.dev/login', {
      method: 'POST',
      body: JSON.stringify({ user: login.value, pass: password.value })
    })
    
    if (response.ok) {
      const { token } = await response.json()
      localStorage.setItem('echips_wiki_token', token)
      isAuthorized.value = true
    } else {
      error.value = 'Неверный логин или пароль'
    }
  } catch (e) {
    error.value = 'Сервер авторизации временно недоступен'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="!isAuthorized" class="login-overlay">
    <div class="login-card">
      <h2>Вход для АСЦ</h2>
      <p>Используйте учетные данные от 1С</p>
      
      <input v-model="login" type="text" placeholder="Логин 1С" @keyup.enter="handleLogin" />
      <input v-model="password" type="password" placeholder="Пароль" @keyup.enter="handleLogin" />
      
      <button @click="handleLogin" :disabled="loading">
        {{ loading ? 'Проверка...' : 'Войти' }}
      </button>
      
      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>
  
  <slot v-else />
</template>

<style scoped>
/* Стили оставляем те же, что и были */
.login-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--vp-c-bg); z-index: 999; display: flex; align-items: center; justify-content: center; }
.login-card { width: 100%; max-width: 350px; padding: 40px; background: var(--vp-c-bg-soft); border-radius: 20px; border: 1px solid var(--vp-c-divider); text-align: center; }
input { width: 100%; padding: 12px; margin: 10px 0; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1); }
button { width: 100%; padding: 12px; margin-top: 20px; background: var(--vp-c-brand); color: white; border-radius: 8px; font-weight: 600; cursor: pointer; }
button:disabled { opacity: 0.7; cursor: not-allowed; }
.error-msg { color: var(--vp-c-danger); margin-top: 15px; font-size: 0.9rem; }
</style>