<script setup>
import { ref, computed } from 'vue'

// --- СОСТОЯНИЕ ---
const view = ref('list')
const editingId = ref(null)
const showPrintMenu = ref(false)

// Модалки
const showWorkModal = ref(false)
const showSubModal = ref(false)
const showNrpModal = ref(false)

// Имитация БД
const orders = ref([
  {
    id: '000045',
    date: '2026-02-12',
    status: 'diagnostics',
    receptionPrinted: true,
    type: 'paid', 
    client: { name: 'Иванов П.С.', phone: '89001234567', type: 'private', orgName: '' },
    device: { model: 'Echips Envy', sn: 'CN123999', dateOfSale: '2025-05-10', condition: 'Б/У', package: 'ЗУ, Коробка', defects: 'Не вкл', notes: '' },
    nrp: { issued: false, reason: '' },
    sub: { status: 'none', reason: '', sn: '', model: '', condition: '', tests: [] },
    works: [
        { name: 'Диагностика', price: 1000, performer: 'Иванов', part: '' }
    ],
    tests: [
        { name: 'Включение', status: 'ok' },
        { name: 'Изображение', status: 'defect' },
        { name: 'Клавиатура', status: 'na' },
        { name: 'Звук', status: 'ok' },
        { name: 'Wi-Fi', status: 'ok' },
        { name: 'USB', status: 'ok' },
        { name: 'АКБ', status: 'ok' }
    ]
  }
])

const defaultSubTests = [
    { name: 'Включается', checked: false },
    { name: 'Зарядка ОК', checked: false },
    { name: 'Wi-Fi ОК', checked: false },
    { name: 'Внешний вид ОК', checked: false }
]

const emptyOrder = {
  id: '',
  date: '',
  status: 'new',
  receptionPrinted: false,
  type: 'warranty',
  client: { type: 'private', name: '', phone: '', orgName: '' },
  device: { sn: '', model: '', dateOfSale: '', condition: '', package: '', defects: '', notes: '' },
  nrp: { issued: false, reason: '' },
  sub: { status: 'none', reason: '', sn: '', model: '', condition: '', tests: JSON.parse(JSON.stringify(defaultSubTests)) },
  tests: [
    { name: 'Включение', status: 'na' },
    { name: 'Изображение', status: 'na' },
    { name: 'Клавиатура', status: 'na' },
    { name: 'Звук', status: 'na' },
    { name: 'Wi-Fi', status: 'na' },
    { name: 'USB', status: 'na' },
    { name: 'АКБ', status: 'na' }
  ],
  works: []
}

const currentOrder = ref(JSON.parse(JSON.stringify(emptyOrder)))
const newWork = ref({ name: '', price: '', part: '', performer: '', warranty: '30 дней' })

// --- ЛОГИКА ---

// Статусы
const availableStatuses = computed(() => {
    const all = [
        { val: 'new', label: 'Новый' },
        { val: 'diagnostics', label: 'Диагностика' },
        { val: 'approval', label: 'Согласование' },
        { val: 'work', label: 'В ремонте' },
        { val: 'ready', label: 'Готов' },
        { val: 'issued', label: 'Выдан' }
    ]
    if (!currentOrder.value.receptionPrinted) {
        return all.filter(s => ['new', 'diagnostics', 'approval'].includes(s.val))
    }
    return all
})

// Текст статуса подмены
const subStatusText = computed(() => {
    switch(currentOrder.value.sub.status) {
        case 'none': return 'Устройство не выдано'
        case 'issued': return 'Устройство выдано'
        case 'returned': return 'Устройство изъято'
        default: return ''
    }
})

// Гарантия
const warrantyStatus = computed(() => {
    if (!currentOrder.value.device.dateOfSale) return { text: 'Нет даты', valid: false }
    const saleDate = new Date(currentOrder.value.device.dateOfSale)
    const today = new Date()
    const endDate = new Date(saleDate)
    endDate.setFullYear(endDate.getFullYear() + 1) 
    const isValid = endDate >= today
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
    return {
        text: isValid ? `Гарантия до ${endDate.toLocaleDateString('ru-RU', options)}` : `Истекла ${endDate.toLocaleDateString('ru-RU', options)}`,
        valid: isValid
    }
})

const totalSum = computed(() => currentOrder.value.works.reduce((sum, item) => sum + Number(item.price || 0), 0))

// CRUD
const goToList = () => { view.value = 'list'; editingId.value = null }

const createOrder = () => {
  const nextId = String(orders.value.length + 1).padStart(6, '0')
  currentOrder.value = JSON.parse(JSON.stringify(emptyOrder))
  currentOrder.value.id = nextId
  currentOrder.value.date = new Date().toISOString().split('T')[0]
  view.value = 'editor'
}

const openOrder = (order) => {
  currentOrder.value = JSON.parse(JSON.stringify(order))
  if (!currentOrder.value.sub.tests) currentOrder.value.sub.tests = JSON.parse(JSON.stringify(defaultSubTests))
  editingId.value = order.id
  view.value = 'editor'
}

const saveOrder = () => {
  if (editingId.value) {
    const index = orders.value.findIndex(o => o.id === editingId.value)
    orders.value[index] = { ...currentOrder.value }
  } else {
    orders.value.unshift({ ...currentOrder.value })
  }
}

const saveAndExit = () => {
    saveOrder()
    goToList()
}

const deleteOrder = () => {
    if (confirm('Удалить заказ навсегда?')) {
        if (editingId.value) orders.value = orders.value.filter(o => o.id !== editingId.value)
        goToList()
    }
}

// Печать
const handlePrint = (docType) => {
    showPrintMenu.value = false
    alert(`Печать документа: ${docType}`)
    if (docType === 'Акт приемки') {
        currentOrder.value.receptionPrinted = true
        if (currentOrder.value.status === 'new') currentOrder.value.status = 'diagnostics'
        saveOrder() 
    }
}

// НРП
const toggleNrp = () => {
    if (currentOrder.value.nrp.issued) {
        if (confirm('Аннулировать Акт НРП?')) {
            currentOrder.value.nrp.issued = false
            currentOrder.value.nrp.reason = ''
        }
    } else {
        showNrpModal.value = true
    }
}
const confirmNrp = () => {
    if (!currentOrder.value.nrp.reason) return alert('Укажите причину!')
    currentOrder.value.works.push({ name: 'Диагностика (Акт НРП)', price: 1000, performer: 'Система', warranty: '-', part: '' })
    currentOrder.value.nrp.issued = true
    currentOrder.value.status = 'ready'
    showNrpModal.value = false
}

// Подмена
const openSubModal = () => {
    if (currentOrder.value.sub.status === 'none') currentOrder.value.sub.tests = JSON.parse(JSON.stringify(defaultSubTests))
    showSubModal.value = true
}
const confirmIssueSub = () => {
    if (!currentOrder.value.sub.sn) return alert('Заполните SN!')
    if (!currentOrder.value.sub.tests.every(t => t.checked)) return alert('Пройдите чек-лист!')
    currentOrder.value.sub.status = 'issued'
    showSubModal.value = false
}
const returnSubDevice = () => { currentOrder.value.sub.status = 'returned' }

// Работы
const addWork = () => {
  if (!newWork.value.name) return
  currentOrder.value.works.push({ ...newWork.value })
  newWork.value = { name: '', price: '', part: '', performer: '', warranty: '30 дней' }
  showWorkModal.value = false
}
const removeWork = (index) => currentOrder.value.works.splice(index, 1)
const setTestStatus = (index, status) => currentOrder.value.tests[index].status = status

const statusMap = {
  new: { label: 'Новый', class: 'st-new' },
  diagnostics: { label: 'Диагностика', class: 'st-diag' },
  approval: { label: 'Согласование', class: 'st-wait' },
  work: { label: 'В ремонте', class: 'st-work' },
  ready: { label: 'Готов', class: 'st-ready' },
  issued: { label: 'Выдан', class: 'st-issued' }
}
</script>

<template>
  <div class="crm-app" @click="showPrintMenu = false">
    
    <div v-if="view === 'list'" class="list-view fade-in">
      <div class="list-header">
        <h2>Журнал ремонтов</h2>
        <button class="btn-primary" @click="createOrder">+ Новый заказ</button>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th width="80">№</th>
              <th width="100">Дата</th>
              <th width="120">Статус</th>
              <th>Клиент</th>
              <th>Устройство</th>
              <th align="right">Тип</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" @click="openOrder(order)" class="order-row">
              <td class="id-cell">{{ order.id }}</td>
              <td>{{ order.date }}</td>
              <td><span class="status-badge" :class="statusMap[order.status]?.class">{{ statusMap[order.status]?.label }}</span></td>
              <td>
                <div class="bold">{{ order.client.orgName || order.client.name }}</div>
                <div class="sub-text" v-if="order.client.orgName">{{ order.client.name }}</div>
              </td>
              <td>
                 <div class="bold">{{ order.device.model }}</div>
                 <div class="sub-text">SN: {{ order.device.sn }}</div>
              </td>
              <td align="right">
                  <span class="type-badge" :class="order.type === 'warranty' ? 't-war' : 't-paid'">
                      {{ order.type === 'warranty' ? 'Гарантия' : 'Платный' }}
                  </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="editor-view fade-in">
      
      <div class="toolbar">
        <div class="toolbar-left">
            <button class="btn-back" @click="saveAndExit">← Сохранить и выйти</button>
        </div>
        
        <div class="toolbar-center">
           <span class="order-id">Заказ №{{ currentOrder.id }}</span>
           <select v-model="currentOrder.status" class="status-select" :class="statusMap[currentOrder.status]?.class">
             <option v-for="s in availableStatuses" :key="s.val" :value="s.val">{{ s.label }}</option>
           </select>
        </div>
        
        <div class="toolbar-right">
            <div class="print-wrapper" @click.stop>
                <button class="btn-print-menu" @click="showPrintMenu = !showPrintMenu">
                    🖨 Печать ▼
                </button>
                <div class="print-dropdown" v-if="showPrintMenu">
                    <div class="pd-item" @click="handlePrint('Акт приемки')">📄 Акт приемки</div>
                    <div class="pd-divider"></div>
                    <div class="pd-item" @click="handlePrint('Акт работ')">🛠 Акт выполненных работ</div>
                    <div class="pd-item" v-if="currentOrder.sub.status !== 'none'" @click="handlePrint('Акт подмены')">💻 Акт подмены</div>
                    <div class="pd-item" v-if="currentOrder.nrp.issued" @click="handlePrint('Акт НРП')">⚠️ Акт НРП</div>
                </div>
            </div>
            
            <button class="btn-del-order" @click="deleteOrder" title="Удалить заказ">✕</button>
        </div>
      </div>

      <div class="editor-grid">
        
        <div class="info-sidebar">
          <div class="section-title">1. Приемка и Осмотр</div>
          
          <div class="card">
            <div class="field-row">
                <div class="field half">
                    <label>Тип ремонта</label>
                    <select v-model="currentOrder.type">
                        <option value="warranty">Гарантийный</option>
                        <option value="paid">Платный</option>
                    </select>
                </div>
                <div class="field half">
                     <label>Тип клиента</label>
                     <select v-model="currentOrder.client.type">
                        <option value="private">Физ. лицо</option>
                        <option value="ooo">Юр. лицо</option>
                     </select>
                </div>
            </div>
            <div class="field" v-if="currentOrder.client.type === 'ooo'">
              <input v-model="currentOrder.client.orgName" placeholder='Название организации' class="highlight-border" />
            </div>
            <div class="field">
              <input v-model="currentOrder.client.name" placeholder="ФИО Клиента / Контактное лицо" />
            </div>
            <div class="field">
              <input v-model="currentOrder.client.phone" placeholder="Телефон" />
            </div>
          </div>

          <div class="card">
            <div class="field">
              <label>Модель устройства</label>
              <input v-model="currentOrder.device.model" />
            </div>
            <div class="field">
              <label>Serial Number (SN)</label>
              <input v-model="currentOrder.device.sn" class="font-mono" />
            </div>
            
            <div class="field-row">
                 <div class="field half">
                    <label>Дата продажи</label>
                    <input type="date" v-model="currentOrder.device.dateOfSale" />
                 </div>
                 <div class="field half warranty-info">
                    <div class="w-status" :class="warrantyStatus.valid ? 'w-ok' : 'w-fail'">
                        {{ warrantyStatus.text }}
                    </div>
                 </div>
            </div>

            <div class="field-row">
                <div class="field half">
                    <label>Внешний вид</label>
                    <input v-model="currentOrder.device.condition" placeholder="Б/У, царапины..." />
                </div>
                <div class="field half">
                    <label>Комплектация</label>
                    <input v-model="currentOrder.device.package" placeholder="ЗУ, коробка..." />
                </div>
            </div>

            <div class="field full">
               <label>Заявленная неисправность</label>
               <textarea v-model="currentOrder.device.defects" rows="2"></textarea>
            </div>
             <div class="field full">
               <label>Комментарий приемщика (внутренний)</label>
               <input v-model="currentOrder.device.notes" placeholder="Клиент оставил пароль: 1234" class="notes-input"/>
            </div>
          </div>
          
          <div class="reception-actions" v-if="!currentOrder.receptionPrinted">
              <div class="hint-arrow">🖨 Распечатайте Акт приемки, чтобы начать ремонт →</div>
          </div>
        </div>

        <div class="work-area">
          <div class="section-title">2. Диагностика и Ремонт</div>
          
          <div class="card">
            <h3>Карта диагностики</h3>
            <div class="diag-list">
                <div v-for="(test, i) in currentOrder.tests" :key="i" class="diag-item">
                    <span class="diag-name">{{ test.name }}</span>
                    <div class="diag-btns">
                        <button @click="setTestStatus(i, 'ok')" :class="{active: test.status==='ok'}" class="db ok" data-tooltip="Работает">✓</button>
                        <button @click="setTestStatus(i, 'defect')" :class="{active: test.status==='defect'}" class="db def" data-tooltip="Дефект">!</button>
                        <button @click="setTestStatus(i, 'fail')" :class="{active: test.status==='fail'}" class="db fail" data-tooltip="Не работает">✕</button>
                        <button @click="setTestStatus(i, 'na')" :class="{active: test.status==='na'}" class="db na" data-tooltip="Н/Д">∅</button>
                    </div>
                </div>
            </div>
          </div>

          <div class="repair-block-wrapper">
              
              <div class="locked-overlay" v-if="!currentOrder.receptionPrinted">
                  <div class="lock-msg">
                      🔒 Ремонт заблокирован<br>
                      <span>Распечатайте Акт приемки</span>
                  </div>
              </div>

              <div class="repair-content" :class="{ blurred: !currentOrder.receptionPrinted }">
                  
                  <div class="card compact-card" :class="{'active-sub': currentOrder.sub.status !== 'none'}">
                      <div class="card-header-row">
                          <h3>Подменное устройство</h3>
                          <button v-if="currentOrder.sub.status === 'none'" class="btn-link-sm" @click="openSubModal">Выдать</button>
                          <button v-if="currentOrder.sub.status === 'issued'" class="btn-link-sm" @click="returnSubDevice">Принять возврат</button>
                      </div>
                      <div class="status-msg" :class="currentOrder.sub.status">
                          {{ subStatusText }}
                      </div>
                      <div v-if="currentOrder.sub.status === 'issued'" class="sub-detail">
                          {{ currentOrder.sub.model }} ({{ currentOrder.sub.sn }})
                      </div>
                  </div>

                  <div class="card compact-card row-card">
                      <div class="row-left">
                          <h3>Акт НРП</h3>
                          <div class="sub-label" v-if="currentOrder.nrp.issued">Выдан: {{ currentOrder.nrp.reason }}</div>
                      </div>
                      <label class="switch">
                          <input type="checkbox" :checked="currentOrder.nrp.issued" @change="toggleNrp">
                          <span class="slider round"></span>
                      </label>
                  </div>

                  <div class="card">
                    <div class="card-header-row">
                      <h3>Работы и запчасти</h3>
                      <button class="btn-link" @click="showWorkModal = true">+ Добавить</button>
                    </div>
                    <table class="works-table">
                      <tr v-for="(w, i) in currentOrder.works" :key="i">
                        <td>
                          <div class="w-name">{{ w.name }}</div>
                          <div class="w-part" v-if="w.part">{{ w.part }}</div>
                        </td>
                        <td class="price-cell">
                            {{ currentOrder.type === 'warranty' ? '0 ₽' : w.price + ' ₽' }}
                        </td>
                        <td width="30"><button @click="removeWork(i)" class="btn-del">×</button></td>
                      </tr>
                    </table>
                    
                    <div class="finance-block">
                        <div class="total-row" v-if="currentOrder.type === 'paid'">
                            <span>Итого к оплате:</span>
                            <span class="total-val">{{ totalSum }} ₽</span>
                        </div>
                        <div class="asc-row" v-else>
                            <div class="asc-label">Клиенту: 0 ₽</div>
                            <div class="asc-profit">К начислению АСЦ: {{ totalSum }} ₽</div>
                        </div>
                    </div>
                  </div>
              </div>
          </div>
          
        </div>
      </div>
    </div>

    <div v-if="showNrpModal" class="modal-bg" @click.self="showNrpModal = false">
        <div class="modal-card">
            <h3>Оформление НРП</h3>
            <textarea v-model="currentOrder.nrp.reason" placeholder="Укажите причину (нет запчастей, отказ...)" rows="3" class="input-std"></textarea>
            <button @click="confirmNrp" class="btn-danger full">Сформировать Акт</button>
        </div>
    </div>

    <div v-if="showWorkModal" class="modal-bg" @click.self="showWorkModal = false">
      <div class="modal-card">
        <h3>Добавить работу</h3>
        <input v-model="newWork.name" placeholder="Название услуги" class="input-std" />
        <div class="grid-2">
           <input v-model="newWork.price" type="number" placeholder="Стоимость" class="input-std" />
           <input v-model="newWork.performer" placeholder="Мастер" class="input-std" />
        </div>
        <input v-model="newWork.part" placeholder="Запчасть (арт)" class="input-std" />
        <button @click="addWork" class="btn-primary full">Добавить</button>
      </div>
    </div>

    <div v-if="showSubModal" class="modal-bg" @click.self="showSubModal = false">
      <div class="modal-card wide-modal">
        <h3>Выдача подменного устройства</h3>
        <div class="grid-2">
            <div class="field">
                <label>Серийный номер (SN)</label>
                <input v-model="currentOrder.sub.sn" class="input-std font-mono" />
            </div>
            <div class="field">
                <label>Модель</label>
                <input v-model="currentOrder.sub.model" class="input-std" />
            </div>
        </div>
        <div class="field">
             <label>Состояние при выдаче</label>
             <input v-model="currentOrder.sub.condition" class="input-std" />
        </div>
        
        <div class="checklist-compact">
            <div v-for="(item, idx) in currentOrder.sub.tests" :key="idx" class="check-item">
                <label><input type="checkbox" v-model="item.checked" /> {{ item.name }}</label>
            </div>
        </div>
        
        <div class="modal-btns-row">
             <button @click="showSubModal = false" class="btn-text">Отмена</button>
             <button @click="confirmIssueSub" class="btn-primary">Подтвердить выдачу</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* GENERAL */
.crm-app { background: var(--vp-c-bg); min-height: 80vh; font-size: 13px; color: var(--vp-c-text-1); }
.fade-in { animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.bold { font-weight: 600; }
.sub-text { font-size: 11px; color: var(--vp-c-text-2); }
.full { width: 100%; }

/* TOOLBAR */
.toolbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); position: relative; z-index: 20; }
.toolbar-right { display: flex; gap: 10px; align-items: center; }
.order-id { font-weight: 700; font-family: monospace; font-size: 15px; margin-right: 10px; }
.status-select { padding: 5px 10px; border-radius: 6px; border: 1px solid var(--vp-c-divider); font-weight: 600; background: var(--vp-c-bg-alt); }
.btn-back { background: var(--vp-c-bg-alt); border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-1); padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 500; }
.btn-back:hover { background: var(--vp-c-bg-soft); }
.btn-del-order { width: 30px; height: 30px; border-radius: 50%; border: 1px solid #ff3b30; color: #ff3b30; background: none; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.btn-del-order:hover { background: #ff3b30; color: white; }

/* PRINT DROPDOWN */
.print-wrapper { position: relative; }
.btn-print-menu { background: var(--vp-c-brand); color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: 500; cursor: pointer; }
.print-dropdown { position: absolute; top: 100%; right: 0; margin-top: 5px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.15); width: 200px; overflow: hidden; }
.pd-item { padding: 10px 15px; cursor: pointer; font-size: 13px; }
.pd-item:hover { background: var(--vp-c-bg-alt); color: var(--vp-c-brand); }
.pd-divider { height: 1px; background: var(--vp-c-divider); margin: 0; }

/* LAYOUT */
.editor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 20px; }
@media (max-width: 900px) { .editor-grid { grid-template-columns: 1fr; } }
.section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--vp-c-text-2); margin-bottom: 8px; font-weight: 700; }

/* CARDS & FIELDS */
.card { background: var(--vp-c-bg-alt); padding: 15px; border-radius: 12px; margin-bottom: 15px; border: 1px solid transparent; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.field { margin-bottom: 10px; }
.field label { display: block; font-size: 11px; color: var(--vp-c-text-2); margin-bottom: 3px; }
.field-row { display: flex; gap: 10px; margin-bottom: 10px; }
.field.half { width: 50%; margin-bottom: 0; }
input, select, textarea, .input-std { width: 100%; padding: 7px 10px; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1); outline: none; font-size: 13px; }
input:focus { border-color: var(--vp-c-brand); }
.notes-input { background: #fffbe6; border-color: #ffe58f; } /* Желтоватый фон для заметок */
.font-mono { font-family: monospace; }

/* WARRANTY CHECK */
.warranty-info { display: flex; align-items: flex-end; }
.w-status { font-size: 11px; padding: 6px 10px; border-radius: 6px; width: 100%; text-align: center; font-weight: 600; }
.w-ok { background: #e6ffec; color: #34c759; border: 1px solid #b7eb8f; }
.w-fail { background: #fff1f0; color: #ff4d4f; border: 1px solid #ffa39e; }

/* LOCKING */
.repair-block-wrapper { position: relative; }
.locked-overlay { position: absolute; inset: 0; z-index: 10; display: flex; justify-content: center; align-items: center; }
.lock-msg { background: rgba(0,0,0,0.7); color: white; padding: 20px; border-radius: 12px; text-align: center; backdrop-filter: blur(4px); }
.lock-msg span { font-size: 11px; opacity: 0.8; }
.blurred { filter: blur(3px); opacity: 0.5; pointer-events: none; }
.reception-actions { text-align: right; padding: 10px; color: var(--vp-c-brand); font-weight: 500; animation: bounce 2s infinite; }
@keyframes bounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }

/* DIAGNOSTICS & TOOLTIPS */
.diag-list { display: flex; flex-direction: column; gap: 4px; }
.diag-item { display: flex; justify-content: space-between; align-items: center; font-size: 12px; border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 4px; margin-bottom: 4px; }
.diag-btns { display: flex; gap: 4px; }
.db { width: 24px; height: 24px; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: var(--vp-c-bg); cursor: pointer; font-size: 11px; padding: 0; display: flex; align-items: center; justify-content: center; color: var(--vp-c-text-2); position: relative; }
.db:hover { background: var(--vp-c-bg-soft); }
.db.ok.active { background: #34c759; color: white; border-color: #34c759; }
.db.def.active { background: #ff9500; color: white; border-color: #ff9500; }
.db.fail.active { background: #ff3b30; color: white; border-color: #ff3b30; }
.db.na.active { background: #8e8e93; color: white; border-color: #8e8e93; }

/* CSS TOOLTIP */
.db:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    white-space: nowrap;
    pointer-events: none;
    margin-bottom: 5px;
    z-index: 100;
    opacity: 0;
    animation: fadeIn 0.2s forwards;
}

/* SUB DEVICE */
.compact-card h3 { margin: 0 0 10px 0; font-size: 13px; font-weight: 600; }
.active-sub { border: 1px solid #007aff; }
.status-msg { font-size: 12px; font-weight: 600; margin-bottom: 5px; }
.status-msg.none { color: #8e8e93; }
.status-msg.issued { color: #007aff; }
.status-msg.returned { color: #34c759; }
.sub-detail { font-size: 11px; background: var(--vp-c-bg); padding: 5px; border-radius: 4px; font-family: monospace; }
.checklist-compact { background: var(--vp-c-bg-alt); padding: 10px; border-radius: 8px; margin: 10px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }

/* TOGGLE SWITCH (NRP) */
.row-card { display: flex; justify-content: space-between; align-items: center; }
.sub-label { font-size: 10px; color: #ff3b30; }
.switch { position: relative; display: inline-block; width: 40px; height: 20px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 20px; }
.slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: #ff3b30; }
input:checked + .slider:before { transform: translateX(20px); }

/* TABLES & FINANCE */
.card-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
.btn-link, .btn-link-sm { background: none; border: none; color: var(--vp-c-brand); font-weight: 600; cursor: pointer; }
.btn-link-sm { font-size: 11px; }
.works-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.works-table td { padding: 6px 0; border-bottom: 1px solid var(--vp-c-divider); }
.price-cell { text-align: right; font-weight: 600; }
.btn-del { color: #ff3b30; background: none; border: none; cursor: pointer; }
.finance-block { margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--vp-c-divider); }
.total-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 15px; }
.asc-row { text-align: right; }
.asc-label { color: #34c759; font-weight: bold; font-size: 14px; }
.asc-profit { font-size: 11px; color: var(--vp-c-text-2); margin-top: 2px; }

/* LIST VIEW */
.table-container { border: 1px solid var(--vp-c-divider); border-radius: 8px; overflow: hidden; background: var(--vp-c-bg-alt); }
.list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.list-view th { background: var(--vp-c-bg); padding: 10px; text-align: left; font-size: 11px; color: var(--vp-c-text-2); border-bottom: 1px solid var(--vp-c-divider); }
.list-view td { padding: 10px; border-bottom: 1px solid var(--vp-c-divider); vertical-align: middle; }
.order-row:hover { background: var(--vp-c-bg); cursor: pointer; }
.status-badge { padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; }
.st-new { background: #e6f7ff; color: #1890ff; }
.st-diag { background: #fff7e6; color: #fa8c16; }
.st-ready { background: #f6ffed; color: #52c41a; }
.type-badge { font-size: 10px; padding: 2px 6px; border-radius: 4px; border: 1px solid; }
.t-war { border-color: #b7eb8f; color: #52c41a; background: #f6ffed; }
.t-paid { border-color: #ffccc7; color: #ff4d4f; background: #fff1f0; }

/* MODALS */
.modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 100; backdrop-filter: blur(2px); }
.modal-card { background: var(--vp-c-bg); padding: 20px; border-radius: 12px; width: 300px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.wide-modal { width: 450px; }
.btn-primary { background: var(--vp-c-brand); color: white; border: none; padding: 6px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; }
.btn-save-big { width: 100%; padding: 12px; background: #34c759; color: white; border: none; border-radius: 8px; font-weight: 600; margin-top: 15px; cursor: pointer; }
.btn-danger { background: #ff3b30; color: white; border: none; padding: 6px 16px; border-radius: 6px; cursor: pointer; }
.modal-btns-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; }
.btn-text { background: none; border: none; color: var(--vp-c-text-2); cursor: pointer; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
</style>