<script setup lang="ts">
import { ref } from 'vue'
import CharacteristicCard from '../components/CharacteristicCard.vue'

interface Characteristic {
  name: string
  description: string
}

const characteristics: Characteristic[] = [
  {
    name: 'Performance',
    description: 'The amount of time it takes for the system to process a business request'
  },
  {
    name: 'Responsiveness',
    description: 'The amount of time it takes to get a response to the user'
  },
  {
    name: 'Availability',
    description: 'The amount of uptime of a system; usually measured in 9\'s (e.g., 99.9%)'
  },
  {
    name: 'Fault Tolerance',
    description: 'When fatal errors occur, other parts of the system continue to function'
  },
  {
    name: 'Scalability',
    description: 'A function of system capacity and growth over time; as the number of users or requests increase in the system, responsiveness, performance, and error rates remain consistent'
  },
  {
    name: 'Elasticity',
    description: 'The system is able to expend and respond quickly to unexpected or anticipated extreme loads (e.g., going from 20 to 250,000 users instantly)'
  },
  {
    name: 'Data Integrity',
    description: 'The data across the system is correct and there is no data loss in the system'
  },
  {
    name: 'Data Consistency',
    description: 'The data across the system is in sync and consistent across databases and tables'
  },
  {
    name: 'Adaptability',
    description: 'The ease in which a system can adapt to changes in environment and functionality'
  },
  {
    name: 'Concurrency',
    description: 'The ability of the system to process simultaneous requests, in most cases in the same order in which they were received; implied when scalability and elasticity are supported'
  },
  {
    name: 'Interoperability',
    description: 'The ability of the system to interface and interact with other systems to complete a business request'
  },
  {
    name: 'Extensibility',
    description: 'The ease in which a system can be extended with additional features and functionality'
  },
  {
    name: 'Deployability',
    description: 'The amount of ceremony involved with releasing the software, the frequency in which releases occur, and the overall risk of deployment'
  },
  {
    name: 'Testability',
    description: 'The ease of and completeness of testing'
  },
  {
    name: 'Abstraction',
    description: 'The level at which parts of the system are isolated from other parts of the system (both internal and external system interactions)'
  },
  {
    name: 'Workflow',
    description: 'The ability of the system to manage complex workflows that require multiple parts (services) of the system to complete a business request'
  },
  {
    name: 'Configurability',
    description: 'The ability of the system to support multiple configurations, as well as support custom on-demand configurations and configuration updates'
  },
  {
    name: 'Recoverability',
    description: 'The ability of the system to start where it left off in the event of a system crash'
  },
  {
    name: 'Feasibility (implicit)',
    description: 'Taking into account timeframes, budgets, and developer skills when making architectural choices; tight timeframes and budgets make this a driving architectural characteristic'
  },
  {
    name: 'Security (implicit)',
    description: 'The ability of the system to restrict access to sensitive information or functionality'
  },
  {
    name: 'Maintainability (implicit)',
    description: 'The level of effort required to locate and apply changes to the system'
  },
  {
    name: 'Observability (implicit)',
    description: 'The ability of a system or a service to make available and stream metrics such as overall health, uptime, response times, performance, etc.'
  }
]

// System areas state
const systemAreas = ref<string[]>([])
const newArea = ref('')

const addSystemArea = () => {
  if (newArea.value.trim()) {
    systemAreas.value.push(newArea.value.trim())
    newArea.value = ''
  }
}

const removeSystemArea = (index: number) => {
  systemAreas.value.splice(index, 1)
}

// Characteristics selection state
const selectedCharacteristics = ref<Set<string>>(new Set())
const MAX_SELECTIONS = 7
const showLimitWarning = ref(false)

const toggleSelection = (name: string) => {
  if (selectedCharacteristics.value.has(name)) {
    selectedCharacteristics.value.delete(name)
    showLimitWarning.value = false
  } else {
    // Check if we're at the limit
    if (selectedCharacteristics.value.size >= MAX_SELECTIONS) {
      showLimitWarning.value = true
      return
    }
    selectedCharacteristics.value.add(name)
  }
  // Trigger reactivity
  selectedCharacteristics.value = new Set(selectedCharacteristics.value)
}

const isSelected = (name: string) => {
  return selectedCharacteristics.value.has(name)
}

const canContinue = () => {
  return selectedCharacteristics.value.size === MAX_SELECTIONS
}

const continueToNextStep = () => {
  if (canContinue()) {
    // TODO: Navigate to next step
    console.log('Selected characteristics:', Array.from(selectedCharacteristics.value))
  }
}
</script>

<template>
  <div class="workshop-page">
    <h1>Workshop</h1>
    
    <!-- System Areas Section -->
    <section class="system-areas-section">
      <h2>System Areas</h2>
      <p>Define the areas of your system that this workshop will focus on.</p>
      
      <div class="area-input-group">
        <input 
          v-model="newArea"
          type="text" 
          placeholder="Enter a system area (e.g., Payment Processing)"
          @keyup.enter="addSystemArea"
        />
        <button @click="addSystemArea">Add Area</button>
      </div>
      
      <div v-if="systemAreas.length > 0" class="areas-list">
        <div 
          v-for="(area, index) in systemAreas" 
          :key="index"
          class="area-tag"
        >
          <span>{{ area }}</span>
          <button 
            class="remove-button"
            @click="removeSystemArea(index)"
            aria-label="Remove area"
          >
            ×
          </button>
        </div>
      </div>
    </section>

    <!-- Characteristics Section -->
    <section class="characteristics-section">
      <h2>Architecture Characteristics</h2>
      <p>Select 7 characteristics that are most relevant to your system areas.</p>
      
      <div class="selection-status">
        <div class="counter">
          Selected: {{ selectedCharacteristics.size }} / {{ MAX_SELECTIONS }}
        </div>
        
        <div v-if="showLimitWarning" class="warning-message">
          You've reached the maximum of {{ MAX_SELECTIONS }} characteristics. Deselect one to choose a different characteristic.
        </div>
        
        <button 
          class="continue-button"
          :disabled="!canContinue()"
          @click="continueToNextStep"
        >
          Continue
        </button>
      </div>
      
      <div class="characteristics-grid">
        <CharacteristicCard
          v-for="characteristic in characteristics" 
          :key="characteristic.name"
          :name="characteristic.name"
          :description="characteristic.description"
          :is-selected="isSelected(characteristic.name)"
          @click="toggleSelection(characteristic.name)"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.workshop-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #000000;
  margin-bottom: 2rem;
}

h2 {
  color: #000000;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

section {
  margin-bottom: 3rem;
}

.system-areas-section p,
.characteristics-section p {
  color: #4b5563;
  margin-bottom: 1.5rem;
}

.area-input-group {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.area-input-group input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.area-input-group input:focus {
  outline: none;
  border-color: #16a34a;
}

.area-input-group button {
  padding: 0.75rem 1.5rem;
  background-color: #16a34a;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.area-input-group button:hover {
  background-color: #15803d;
}

.area-input-group button:active {
  background-color: #14532d;
}

.areas-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.area-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #dcfce7;
  border: 2px solid #16a34a;
  border-radius: 0.5rem;
  color: #000000;
  font-weight: 500;
}

.area-tag .remove-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  background-color: transparent;
  color: #dc2626;
  border: none;
  border-radius: 50%;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.area-tag .remove-button:hover {
  background-color: #fee2e2;
  color: #991b1b;
}

.area-tag .remove-button:active {
  background-color: #fecaca;
}

.selection-status {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
}

.counter {
  font-size: 1.125rem;
  font-weight: 600;
  color: #000000;
}

.warning-message {
  flex: 1;
  padding: 0.5rem 1rem;
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.375rem;
  color: #92400e;
  font-size: 0.95rem;
}

.continue-button {
  padding: 0.75rem 2rem;
  background-color: #16a34a;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
}

.continue-button:hover:not(:disabled) {
  background-color: #15803d;
}

.continue-button:active:not(:disabled) {
  background-color: #14532d;
}

.continue-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.characteristics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}
</style>

