<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  show: boolean
  title: string
  description: string
  placeholder: string
  addButtonText: string
  items: string[]
  itemClass: string
  confirmed: boolean
  confirmButtonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmButtonText: 'Continue'
})

const emit = defineEmits<{
  add: [value: string]
  remove: [index: number]
  confirm: []
  close: []
}>()

const inputValue = ref('')

watch(() => props.show, (newVal) => {
  if (!newVal) {
    inputValue.value = ''
  }
})

const handleAdd = () => {
  if (inputValue.value.trim()) {
    emit('add', inputValue.value.trim())
    inputValue.value = ''
  }
}

const handleOverlayClick = () => {
  if (props.confirmed) {
    emit('close')
  }
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-dialog" @click.stop>
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button v-if="confirmed" class="close-modal-button" @click="emit('close')">×</button>
      </div>
      
      <div class="modal-content">
        <p>{{ description }}</p>
        
        <div class="input-group">
          <input 
            v-model="inputValue"
            type="text" 
            :placeholder="placeholder"
            @keyup.enter="handleAdd"
          />
          <button @click="handleAdd">{{ addButtonText }}</button>
        </div>
        
        <div v-if="items.length > 0" class="items-list">
          <div 
            v-for="(item, index) in items" 
            :key="index"
            :class="itemClass"
          >
            <span>{{ item }}</span>
            <button 
              class="remove-button"
              @click="emit('remove', index)"
              aria-label="Remove item"
            >
              ×
            </button>
          </div>
        </div>
      </div>
      
      <div class="modal-actions">
        <button 
          class="confirm-button"
          :disabled="items.length === 0"
          @click="emit('confirm')"
        >
          {{ confirmed ? 'Update' : confirmButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-dialog {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.75rem;
}

.close-modal-button {
  background: none;
  border: none;
  font-size: 2rem;
  color: #95a5a6;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-modal-button:hover {
  color: #e74c3c;
}

.modal-content {
  margin-bottom: 1.5rem;
}

.modal-content > p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.input-group {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.input-group input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #3498db;
}

.input-group button {
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.input-group button:hover {
  background: #2980b9;
}

.items-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.area-tag,
.goal-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #ecf0f1;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: background 0.2s;
}

.area-tag:hover,
.goal-tag:hover {
  background: #d5dbdb;
}

.remove-button {
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.remove-button:hover {
  transform: scale(1.2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.confirm-button {
  padding: 0.75rem 2rem;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.confirm-button:hover:not(:disabled) {
  background: #27ae60;
}

.confirm-button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
