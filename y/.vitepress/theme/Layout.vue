<script setup>
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { ref, onMounted } from 'vue'

const { Layout } = DefaultTheme
const route = useRoute()

// Состояние авторизации
const isAuth = ref(false)
const password = ref('')
const showError = ref(false)

// Проверяем, вводил ли человек пароль ранее (чтобы не просить каждый раз)
onMounted(() => {
  if (localStorage.getItem('echips_partner_auth') === 'granted') {
    isAuth.value = true
  }
})

// Функция проверки пароля
const checkPassword = () => {
  // ЗДЕСЬ УКАЖИ ЖЕЛАЕМЫЙ ПАРОЛЬ ДЛЯ СЕРВИСОВ
  if (password.value === 'service2026') { 
    localStorage.setItem('echips_partner_auth', 'granted')
    isAuth.value = true
    showError.value = false
  } else {
    showError.value = true
    password.value = ''
  }
}
</script>

<template>
  <div v-if="route.path.startsWith('/partner/') && !isAuth" class="lock-screen">
    <div class="lock-card fade-in">
      <div class="lock-icon">🔒</div>
      <h2>Вход для партнеров</h2>
      <p>Пожалуйста, введите пароль для доступа к базе знаний АСЦ Echips.</p>
      
      <input 
        type="password" 
        v-model="password" 
        placeholder="Пароль" 
        @keyup.enter="checkPassword"
        :class="{ 'error-shake': showError }"
      />
      <div v-if="showError" class="error-text">Неверный пароль</div>
      
      <button @click="checkPassword">Войти</button>
    </div>
  </div>

  <Layout v-else />
</template>

<style scoped>
.lock-screen {
  position: fixed;
  inset: 0;
  background: var(--vp-c-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.lock-card {
  background: var(--vp-c-bg-alt);
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}
.lock-icon { font-size: 40px; margin-bottom: 10px; }
h2 { margin: 0 0 10px; font-size: 20px; font-weight: 600; }
p { font-size: 14px; color: var(--vp-c-text-2); margin-bottom: 20px; }
input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
  outline: none;
}
input:focus { border-color: var(--vp-c-brand); }
button {
  width: 100%;
  padding: 12px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}
.error-text { color: #ff3b30; font-size: 12px; margin-bottom: 10px; }
.error-shake { border-color: #ff3b30; animation: shake 0.4s; }
.fade-in { animation: fadeIn 0.3s ease; }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
}
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>