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
      <CharacteristicCard
        v-for="characteristic in characteristics" 
        :key="characteristic.name"
        :name="characteristic.name"
        :description="characteristic.description"
        :is-selected="isSelected(characteristic.name)"
        @click="toggleSelection(characteristic.name)"
      />
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
</style>

