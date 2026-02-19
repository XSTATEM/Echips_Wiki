<script setup>
import { ref, computed } from 'vue'

// --- СОСТОЯНИЕ ---
const view = ref('list') // 'list' (список) или 'editor' (форма)
const editingId = ref(null) // ID заказа, который редактируем

// Имитация базы данных (Список заказов)
const orders = ref([
  {
    id: '000045',
    date: '2026-02-12',
    status: 'diagnostics',
    client: { name: 'Иванов П.С.', phone: '89001234567', type: 'private' },
    device: { model: 'Echips Envy', sn: 'CN123999', condition: 'Б/У', defects: 'Не вкл' },
    works: [],
    total: 0
  }
])

// Шаблон пустого заказа
const emptyOrder = {
  id: '',
  date: '',
  status: 'new', // new, diagnostics, approval, work, ready, issued
  client: { type: 'private', name: '', phone: '' },
  device: { sn: '', model: '', password: '', condition: '', defects: '', notes: '' },
  tests: [
    { name: 'Включение', status: 'ok' },
    { name: 'Изображение', status: 'ok' },
    { name: 'Клавиатура', status: 'ok' },
    { name: 'Звук', status: 'ok' },
    { name: 'Wi-Fi', status: 'ok' },
    { name: 'USB / Разъемы', status: 'ok' }
  ],
  works: []
}

const currentOrder = ref(JSON.parse(JSON.stringify(emptyOrder)))
const showWorkModal = ref(false)

// Данные для новой работы
const newWork = ref({ name: '', price: '', part: '', performer: '', warranty: '30 дней' })

// --- ЛОГИКА ---

// Открыть список
const goToList = () => {
  view.value = 'list'
  editingId.value = null
}

// Открыть создание нового
const createOrder = () => {
  // Генерируем номер
  const nextId = String(orders.value.length + 1).padStart(6, '0')
  currentOrder.value = JSON.parse(JSON.stringify(emptyOrder))
  currentOrder.value.id = nextId
  currentOrder.value.date = new Date().toISOString().split('T')[0]
  view.value = 'editor'
}

// Открыть существующий
const openOrder = (order) => {
  currentOrder.value = JSON.parse(JSON.stringify(order))
  editingId.value = order.id
  view.value = 'editor'
}

// Сохранение (БЕЗ ПОДТВЕРЖДЕНИЯ)
const saveOrder = () => {
  if (!currentOrder.value.client.name) return alert('Введите имя клиента!')
  
  // Пересчет суммы
  currentOrder.value.total = currentOrder.value.works.reduce((sum, item) => sum + Number(item.price || 0), 0)

  if (editingId.value) {
    // Обновляем существующий
    const index = orders.value.findIndex(o => o.id === editingId.value)
    orders.value[index] = { ...currentOrder.value }
  } else {
    // Добавляем новый
    orders.value.unshift({ ...currentOrder.value })
  }
  
  // Тихо выходим в список
  goToList()
}

// Работы
const addWork = () => {
  if (!newWork.value.name) return
  currentOrder.value.works.push({ ...newWork.value })
  newWork.value = { name: '', price: '', part: '', performer: '', warranty: '30 дней' }
  showWorkModal.value = false
}
const removeWork = (index) => currentOrder.value.works.splice(index, 1)
const totalSum = computed(() => currentOrder.value.works.reduce((sum, item) => sum + Number(item.price || 0), 0))

// Тесты
const setTestStatus = (index, status) => currentOrder.value.tests[index].status = status

// Статусы (для бейджей)
const statusMap = {
  new: { label: 'Новый', class: 'st-new' },
  diagnostics: { label: 'Диагностика', class: 'st-diag' },
  approval: { label: 'Согласование', class: 'st-wait' },
  work: { label: 'В ремонте', class: 'st-work' },
  ready: { label: 'Готов', class: 'st-ready' },
  issued: { label: 'Выдан', class: 'st-issued' }
}

// Печать (Имитация)
const printDoc = (type) => {
  alert(`Печать документа: ${type}\n(Здесь откроется PDF версия для принтера)`)
}
</script>

<template>
  <div class="crm-app">
    
    <div v-if="view === 'list'" class="list-view fade-in">
      <div class="list-header">
        <h2>Журнал ремонтов</h2>
        <button class="btn-primary" @click="createOrder">+ Новый заказ</button>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Клиент</th>
              <th>Устройство</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" @click="openOrder(order)" class="order-row">
              <td class="id-cell">{{ order.id }}</td>
              <td>{{ order.date }}</td>
              <td><span class="status-badge" :class="statusMap[order.status]?.class">{{ statusMap[order.status]?.label }}</span></td>
              <td>{{ order.client.name }}</td>
              <td>{{ order.device.model }} <span class="sn">{{ order.device.sn }}</span></td>
              <td class="price">{{ order.total }} ₽</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="editor-view fade-in">
      
      <div class="toolbar">
        <button class="btn-back" @click="goToList">← Назад</button>
        
        <div class="toolbar-center">
           <span class="order-id">Заказ №{{ currentOrder.id }}</span>
           <select v-model="currentOrder.status" class="status-select" :class="statusMap[currentOrder.status]?.class">
             <option value="new">Новый</option>
             <option value="diagnostics">Диагностика</option>
             <option value="approval">Согласование</option>
             <option value="work">В ремонте</option>
             <option value="ready">Готов к выдаче</option>
             <option value="issued">Выдан</option>
           </select>
        </div>

        <div class="toolbar-actions">
          <div class="print-group">
            <button @click="printDoc('Акт приемки')" title="Печать приемки">📄 Приемка</button>
            <button @click="printDoc('Акт работ')" title="Печать акта работ">🛠 Акт работ</button>
          </div>
          <button class="btn-save" @click="saveOrder">Сохранить</button>
        </div>
      </div>

      <div class="editor-grid">
        
        <div class="info-sidebar">
          <div class="card">
            <h3>👤 Клиент</h3>
            <div class="field">
              <label>Тип</label>
              <select v-model="currentOrder.client.type">
                <option value="private">Физ. лицо</option>
                <option value="ip">ИП</option>
                <option value="ooo">Юр. лицо</option>
              </select>
            </div>
            <div class="field">
              <label>ФИО / Название</label>
              <input v-model="currentOrder.client.name" placeholder="Иванов И.И." />
            </div>
            <div class="field">
              <label>Телефон</label>
              <input v-model="currentOrder.client.phone" placeholder="+7..." />
            </div>
          </div>

          <div class="card">
            <h3>💻 Устройство</h3>
            <div class="field">
              <label>Модель</label>
              <input v-model="currentOrder.device.model" />
            </div>
            <div class="field">
              <label>Serial Number (SN)</label>
              <input v-model="currentOrder.device.sn" class="font-mono" />
            </div>
            <div class="field">
              <label>Пароль</label>
              <input v-model="currentOrder.device.password" />
            </div>
            <div class="field full">
               <label>Неисправность</label>
               <textarea v-model="currentOrder.device.defects" rows="3"></textarea>
            </div>
            <div class="field full">
               <label>Внешний вид</label>
               <textarea v-model="currentOrder.device.condition" rows="2"></textarea>
            </div>
          </div>
        </div>

        <div class="work-area">
          
          <div class="card">
            <h3>🔍 Диагностический лист</h3>
            <div class="tests-grid">
              <div v-for="(test, i) in currentOrder.tests" :key="i" class="test-row">
                <span>{{ test.name }}</span>
                <div class="t-btns">
                  <button @click="setTestStatus(i, 'ok')" :class="{ active: test.status === 'ok' }" class="tb ok">Ok</button>
                  <button @click="setTestStatus(i, 'defect')" :class="{ active: test.status === 'defect' }" class="tb def">!</button>
                  <button @click="setTestStatus(i, 'fail')" :class="{ active: test.status === 'fail' }" class="tb fail">✕</button>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header-row">
              <h3>🛠 Выполненные работы</h3>
              <button class="btn-ghost" @click="showWorkModal = true">+ Добавить работу</button>
            </div>

            <table class="works-table" v-if="currentOrder.works.length > 0">
              <thead>
                <tr>
                  <th>Услуга</th>
                  <th>Мастер</th>
                  <th>Цена</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(w, i) in currentOrder.works" :key="i">
                  <td>
                    <div class="w-name">{{ w.name }}</div>
                    <div class="w-sub" v-if="w.part">Запчасть: {{ w.part }}</div>
                  </td>
                  <td>{{ w.performer }}</td>
                  <td>{{ w.price }} ₽</td>
                  <td style="text-align: right;"><button @click="removeWork(i)" class="btn-del">×</button></td>
                </tr>
              </tbody>
            </table>
            <div v-else class="empty-placeholder">Работы еще не добавлены</div>

            <div class="total-row">
              Итого к оплате: <span>{{ totalSum }} ₽</span>
            </div>
          </div>

          <div class="card">
             <h3>🔒 Внутренние заметки</h3>
             <textarea v-model="currentOrder.device.notes" placeholder="Клиент просил срочно..." rows="2" style="width:100%"></textarea>
           </div>

        </div>
      </div>
    </div>

    <div v-if="showWorkModal" class="modal-bg" @click.self="showWorkModal = false">
      <div class="modal-card">
        <h3>Добавить работу</h3>
        <input v-model="newWork.name" placeholder="Название услуги" class="input-std" />
        <div class="grid-2">
           <input v-model="newWork.price" type="number" placeholder="Цена" class="input-std" />
           <input v-model="newWork.performer" placeholder="Мастер" class="input-std" />
        </div>
        <input v-model="newWork.part" placeholder="Запчасть (арт)" class="input-std" />
        <div class="modal-btns">
          <button @click="addWork" class="btn-primary full">Добавить</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ОБЩИЕ СТИЛИ */
.crm-app {
  background: var(--vp-c-bg);
  min-height: 80vh;
  font-size: 14px;
}

.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* СПИСОК ЗАКАЗОВ */
.list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.table-container { border: 1px solid var(--vp-c-divider); border-radius: 12px; overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th { background: var(--vp-c-bg-alt); padding: 12px; text-align: left; font-weight: 600; color: var(--vp-c-text-2); }
td { padding: 12px; border-top: 1px solid var(--vp-c-divider); cursor: pointer; }
.order-row:hover td { background: var(--vp-c-bg-alt); }
.id-cell { font-family: monospace; font-weight: bold; color: var(--vp-c-brand); }
.sn { background: var(--vp-c-bg-alt); padding: 2px 6px; border-radius: 4px; font-size: 12px; }
.price { font-weight: bold; }

/* СТАТУСЫ */
.status-badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.st-new { background: #e3f2fd; color: #1565c0; }
.st-diag { background: #fff3e0; color: #e65100; }
.st-wait { background: #f3e5f5; color: #7b1fa2; }
.st-work { background: #e8f5e9; color: #2e7d32; }
.st-ready { background: #e0f7fa; color: #006064; }
.st-issued { background: #eeeeee; color: #616161; }

/* ТУЛБАР РЕДАКТОРА */
.toolbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 15px; border-bottom: 1px solid var(--vp-c-divider); margin-bottom: 20px;
  position: sticky; top: 0; background: var(--vp-c-bg); z-index: 10;
}
.toolbar-center { display: flex; align-items: center; gap: 15px; }
.order-id { font-size: 18px; font-weight: 700; }
.status-select { padding: 5px 10px; border-radius: 8px; border: 1px solid var(--vp-c-divider); font-weight: 600; }
.toolbar-actions { display: flex; gap: 15px; }
.print-group { display: flex; gap: 5px; }
.print-group button { 
  padding: 6px 12px; font-size: 13px; border: 1px solid var(--vp-c-divider); 
  background: var(--vp-c-bg-alt); border-radius: 8px; cursor: pointer; 
}
.btn-save { background: var(--vp-c-brand); color: white; border: none; padding: 8px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-back { background: none; border: none; color: var(--vp-c-text-2); cursor: pointer; font-size: 15px; }
.btn-primary { background: var(--vp-c-brand); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }

/* СЕТКА РЕДАКТОРА */
.editor-grid { display: grid; grid-template-columns: 350px 1fr; gap: 24px; }
@media (max-width: 900px) { .editor-grid { grid-template-columns: 1fr; } }

.card { background: var(--vp-c-bg-alt); padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.card h3 { margin-top: 0; font-size: 16px; margin-bottom: 15px; color: var(--vp-c-text-1); }

/* ПОЛЯ ВВОДА */
.field { margin-bottom: 12px; }
.field label { display: block; font-size: 12px; color: var(--vp-c-text-2); margin-bottom: 4px; }
.field input, .field select, .field textarea {
  width: 100%; padding: 8px; border: 1px solid var(--vp-c-divider); 
  border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1);
}
.font-mono { font-family: monospace; }

/* ТЕСТЫ */
.tests-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
.test-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
.t-btns { display: flex; gap: 4px; }
.tb { width: 32px; height: 26px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); border-radius: 6px; cursor: pointer; font-size: 11px; }
.tb.ok.active { background: #34c759; color: white; border-color: #34c759; }
.tb.def.active { background: #ff9f0a; color: white; border-color: #ff9f0a; }
.tb.fail.active { background: #ff3b30; color: white; border-color: #ff3b30; }

/* ТАБЛИЦА РАБОТ */
.card-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.btn-ghost { color: var(--vp-c-brand); background: none; border: none; cursor: pointer; font-weight: 600; }
.works-table { width: 100%; font-size: 13px; }
.works-table th { padding: 0 0 10px 0; background: none; border-bottom: 1px solid var(--vp-c-divider); }
.works-table td { padding: 10px 0; border-bottom: 1px solid var(--vp-c-divider); }
.w-name { font-weight: 500; }
.w-sub { font-size: 11px; color: var(--vp-c-text-2); }
.btn-del { color: #ff3b30; border: none; background: none; cursor: pointer; font-size: 18px; }
.total-row { text-align: right; margin-top: 15px; font-size: 16px; font-weight: bold; }
.empty-placeholder { text-align: center; color: var(--vp-c-text-3); padding: 20px; font-style: italic; }

/* МОДАЛКА */
.modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 100; backdrop-filter: blur(3px); }
.modal-card { background: var(--vp-c-bg); padding: 24px; border-radius: 12px; width: 320px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
.input-std { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-alt); }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.full { width: 100%; }
</style>