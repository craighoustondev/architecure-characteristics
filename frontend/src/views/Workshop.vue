<script setup lang="ts">
import { ref } from 'vue'

interface Characteristic {
  name: string
  description: string
}

const characteristics: Characteristic[] = [
  {
    name: 'Scalability',
    description: 'A function of system capacity and growth over time; as the number of users or requests increase in the system, responsiveness, performance and error rates remain consistent'
  },
  {
    name: 'Elasticity',
    description: 'The system is able to expend and respond quickly to unexpected or anticipated extreme loads (e.g. going from 20 to 250,000 users instantly)'
  },
  {
    name: 'Adaptability',
    description: 'The ease in which a system can adapt to changes in environment and functionality'
  }
]

const selectedCharacteristics = ref<Set<string>>(new Set())

const toggleSelection = (name: string) => {
  if (selectedCharacteristics.value.has(name)) {
    selectedCharacteristics.value.delete(name)
  } else {
    selectedCharacteristics.value.add(name)
  }
  // Trigger reactivity
  selectedCharacteristics.value = new Set(selectedCharacteristics.value)
}

const isSelected = (name: string) => {
  return selectedCharacteristics.value.has(name)
}
</script>

<template>
  <div class="workshop-page">
    <h1>Workshop</h1>
    <p>Select architecture characteristics...</p>
    
    <div class="characteristics-grid">
      <div 
        v-for="characteristic in characteristics" 
        :key="characteristic.name"
        class="characteristic-card"
        :class="{ selected: isSelected(characteristic.name) }"
        @click="toggleSelection(characteristic.name)"
      >
        <h3>{{ characteristic.name }}</h3>
        <p>{{ characteristic.description }}</p>
      </div>
    </div>
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
  margin-bottom: 1rem;
}

.characteristics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.characteristic-card {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s, border-color 0.2s;
}

.characteristic-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.characteristic-card.selected {
  background-color: #dcfce7;
  border-color: #16a34a;
  border-width: 2px;
}

.characteristic-card.selected:hover {
  background-color: #bbf7d0;
}

.characteristic-card h3 {
  margin: 0 0 1rem 0;
  color: #000000;
  font-size: 1.25rem;
  font-weight: 600;
}

.characteristic-card p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
  font-size: 0.95rem;
}
</style>

