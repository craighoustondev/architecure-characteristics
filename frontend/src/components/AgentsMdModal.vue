<script setup lang="ts">
interface Props {
  show: boolean
  recommendations: string
  error: string
  isGenerating: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  export: []
  copy: []
  regenerate: []
}>()

const handleOverlayClick = () => {
  emit('close')
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-dialog agents-modal-dialog" @click.stop>
      <div class="modal-header">
        <h2>AGENTS.md Generated</h2>
        <button class="close-modal-button" @click="emit('close')">×</button>
      </div>
      
      <div class="modal-content">
        <div v-if="error" class="error-message">
          <strong>Error:</strong> {{ error }}
        </div>
        
        <div v-if="recommendations" class="recommendations-content">
          <pre>{{ recommendations }}</pre>
        </div>
      </div>
      
      <div class="modal-actions agents-modal-actions">
        <button 
          v-if="recommendations"
          class="export-button"
          @click="emit('export')"
          title="Download AGENTS.md file"
        >
          📥 Export AGENTS.md
        </button>
        <button 
          v-if="recommendations"
          class="copy-button"
          @click="emit('copy')"
          title="Copy to clipboard"
        >
          📋 Copy
        </button>
        <button 
          class="regenerate-button"
          @click="emit('regenerate')"
          :disabled="isGenerating"
        >
          🔄 Regenerate
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

.agents-modal-dialog {
  max-width: 900px;
  width: 95%;
  max-height: 90vh;
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

.error-message {
  padding: 1rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #991b1b;
  margin-bottom: 1rem;
}

.recommendations-content {
  padding: 0;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  color: #1f2937;
  line-height: 1.8;
  font-size: 0.95rem;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
}

.recommendations-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  margin: 0;
  padding: 1.5rem;
  font-size: 0.9rem;
}

.agents-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.export-button,
.copy-button,
.regenerate-button {
  padding: 0.5rem 1rem;
  background-color: white;
  color: #8b5cf6;
  border: 1px solid #8b5cf6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.export-button {
  background-color: #8b5cf6;
  color: white;
}

.export-button:hover {
  background-color: #7c3aed;
}

.copy-button:hover,
.regenerate-button:hover:not(:disabled) {
  background-color: #8b5cf6;
  color: white;
}

.regenerate-button:disabled {
  opacity: 0.5;
  cursor: wait;
}
</style>
