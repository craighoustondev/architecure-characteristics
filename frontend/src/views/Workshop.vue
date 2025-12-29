<script setup lang="ts">
import { ref, watch } from 'vue'
import CharacteristicCard from '../components/CharacteristicCard.vue'
import ItemListModal from '../components/ItemListModal.vue'
import AgentsMdModal from '../components/AgentsMdModal.vue'
import { architectureCharacteristics } from '../data/architectureCharacteristics'
import type { Risk } from '../types'

const characteristics = architectureCharacteristics

// System areas state
const systemAreas = ref<string[]>([])
const showSystemAreasModal = ref(false) // Don't show modal on load
const systemAreasConfirmed = ref(false)

const addSystemArea = (value: string) => {
  systemAreas.value.push(value)
}

const removeSystemArea = (index: number) => {
  systemAreas.value.splice(index, 1)
}

const confirmSystemAreas = () => {
  if (systemAreas.value.length > 0) {
    systemAreasConfirmed.value = true
    showSystemAreasModal.value = false
  }
}

const editSystemAreas = () => {
  showSystemAreasModal.value = true
}

// Strategic goals state
const strategicGoals = ref<string[]>([])
const showStrategicGoalsModal = ref(false)
const strategicGoalsConfirmed = ref(false)

const addStrategicGoal = (value: string) => {
  strategicGoals.value.push(value)
}

const removeStrategicGoal = (index: number) => {
  strategicGoals.value.splice(index, 1)
}

const confirmStrategicGoals = () => {
  if (strategicGoals.value.length > 0) {
    strategicGoalsConfirmed.value = true
    showStrategicGoalsModal.value = false
  }
}

const editStrategicGoals = () => {
  showStrategicGoalsModal.value = true
}

// Phase tracking: 'initial' (select 7), 'narrowDown' (narrow to 3), or 'riskAssessment'
const phase = ref<'initial' | 'narrowDown' | 'riskAssessment'>('initial')

// Characteristics selection state
const selectedCharacteristics = ref<Set<string>>(new Set())
const candidateCharacteristics = ref<string[]>([]) // The 7 selected in phase 1
const finalSelections = ref<Set<string>>(new Set()) // The final 3 (or more) in phase 2
const MAX_SELECTIONS = 7
const SUGGESTED_FINAL = 3
const showLimitWarning = ref(false)

// Risk assessment state
const risks = ref<Record<string, Risk[]>>({}) // Risks grouped by characteristic name
const newRiskInputs = ref<Record<string, string>>({}) // Input fields for each characteristic

// AI Recommendations state
const showApiKeyDialog = ref(false)
const apiKey = ref('')
const recommendations = ref('')
const isGenerating = ref(false)
const generationError = ref('')
const showRecommendationsModal = ref(false)

const canSelectCharacteristics = () => {
  return systemAreasConfirmed.value && strategicGoalsConfirmed.value
}

const toggleSelection = (name: string) => {
  // Check if system areas are defined first
  if (!canSelectCharacteristics()) {
    return
  }

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

const toggleFinalSelection = (name: string) => {
  if (finalSelections.value.has(name)) {
    finalSelections.value.delete(name)
  } else {
    finalSelections.value.add(name)
  }
  // Trigger reactivity
  finalSelections.value = new Set(finalSelections.value)
}

const isSelected = (name: string) => {
  return selectedCharacteristics.value.has(name)
}

const isFinallySelected = (name: string) => {
  return finalSelections.value.has(name)
}

const canContinue = () => {
  return selectedCharacteristics.value.size === MAX_SELECTIONS
}

const continueToNextStep = () => {
  if (canContinue()) {
    // Store the 7 selected characteristics as candidates
    candidateCharacteristics.value = Array.from(selectedCharacteristics.value)
    // Clear final selections for fresh start in phase 2
    finalSelections.value.clear()
    // Transition to narrow down phase
    phase.value = 'narrowDown'
  }
}

const goBackToInitialPhase = () => {
  // Return to initial phase
  phase.value = 'initial'
  // Restore the 7 selected characteristics from candidates
  selectedCharacteristics.value = new Set(candidateCharacteristics.value)
  // Clear final selections (they'll be reset if user continues again)
  finalSelections.value.clear()
}

const canProceedToRiskAssessment = () => {
  return finalSelections.value.size >= SUGGESTED_FINAL
}

const proceedToRiskAssessment = () => {
  if (canProceedToRiskAssessment()) {
    // Initialize risk tracking for each final characteristic
    const finalChars = Array.from(finalSelections.value)
    finalChars.forEach(char => {
      if (!risks.value[char]) {
        risks.value[char] = []
      }
      if (!newRiskInputs.value[char]) {
        newRiskInputs.value[char] = ''
      }
    })
    phase.value = 'riskAssessment'
  }
}

const goBackToNarrowDown = () => {
  phase.value = 'narrowDown'
}

const addRisk = (characteristicName: string) => {
  const input = newRiskInputs.value[characteristicName]?.trim()
  if (!input) return
  
  const newRisk: Risk = {
    id: `${characteristicName}-${Date.now()}-${Math.random()}`,
    description: input,
    probability: null,
    impact: null
  }
  
  if (!risks.value[characteristicName]) {
    risks.value[characteristicName] = []
  }
  
  risks.value[characteristicName].push(newRisk)
  newRiskInputs.value[characteristicName] = ''
  
  // Trigger reactivity
  risks.value = { ...risks.value }
}

const removeRisk = (characteristicName: string, riskId: string) => {
  if (risks.value[characteristicName]) {
    risks.value[characteristicName] = risks.value[characteristicName].filter(
      risk => risk.id !== riskId
    )
    // Trigger reactivity
    risks.value = { ...risks.value }
  }
}

const updateRiskProbability = (characteristicName: string, riskId: string, probability: 1 | 2 | 3) => {
  const risk = risks.value[characteristicName]?.find(r => r.id === riskId)
  if (risk) {
    risk.probability = probability
    // Trigger reactivity
    risks.value = { ...risks.value }
  }
}

const updateRiskImpact = (characteristicName: string, riskId: string, impact: 1 | 2 | 3) => {
  const risk = risks.value[characteristicName]?.find(r => r.id === riskId)
  if (risk) {
    risk.impact = impact
    // Trigger reactivity
    risks.value = { ...risks.value }
  }
}

const getRiskScore = (risk: Risk): number | null => {
  if (risk.probability && risk.impact) {
    return risk.probability * risk.impact
  }
  return null
}

const getRiskColorClass = (score: number | null): string => {
  if (score === null) return 'risk-unassessed'
  if (score <= 2) return 'risk-low'
  if (score <= 4) return 'risk-medium'
  return 'risk-high'
}

const getFinalCharacteristicsObjects = () => {
  return characteristics.filter(
    char => finalSelections.value.has(char.name)
  )
}

// AI Recommendations functions
const initializeApiKey = () => {
  // Try to load from localStorage
  const stored = localStorage.getItem('groq_api_key')
  if (stored) {
    apiKey.value = stored
  }
}

const saveApiKey = () => {
  if (apiKey.value.trim()) {
    localStorage.setItem('groq_api_key', apiKey.value.trim())
    showApiKeyDialog.value = false
    generateRecommendations()
  }
}

const clearApiKey = () => {
  apiKey.value = ''
  localStorage.removeItem('groq_api_key')
}

const requestApiKey = () => {
  showApiKeyDialog.value = true
  generationError.value = ''
}

const cancelApiKeyDialog = () => {
  showApiKeyDialog.value = false
}

const buildPrompt = (): string => {
  const finalChars = Array.from(finalSelections.value)
  
  let prompt = `Analyze this software architecture workshop output and provide recommendations specific to our technology stack and architectural patterns.\n\n`
  
  prompt += `CURRENT PLATFORM ARCHITECTURE:\n`
  prompt += `- Backend: Django modular monolith\n`
  prompt += `- API Layer: Django Rest Framework (DRF)\n`
  prompt += `- Integration Pattern: Ports & Adapters (Hexagonal Architecture) for third-party integrations\n`
  prompt += `- Design Approach: Domain-Driven Design (DDD) principles encouraged\n`
  prompt += `- Event Handling: Django signals used occasionally for decoupling\n`
  prompt += `- Frontend: Vue.js Single Page Applications (SPAs)\n`
  prompt += `- State Management: Pinia for Vue.js state management\n\n`
  
  prompt += `SYSTEM AREAS:\n`
  systemAreas.value.forEach(area => {
    prompt += `- ${area}\n`
  })
  
  prompt += `\nSTRATEGIC GOALS:\n`
  strategicGoals.value.forEach(goal => {
    prompt += `- ${goal}\n`
  })
  
  prompt += `\nSELECTED ARCHITECTURE CHARACTERISTICS WITH RISKS:\n\n`
  
  finalChars.forEach(charName => {
    const char = characteristics.find(c => c.name === charName)
    if (char) {
      prompt += `${char.name}:\n`
      prompt += `  Description: ${char.description}\n`
      
      const charRisks = risks.value[charName] || []
      if (charRisks.length > 0) {
        prompt += `  Identified Risks:\n`
        charRisks.forEach(risk => {
          const score = getRiskScore(risk)
          prompt += `  - ${risk.description}`
          if (score !== null) {
            prompt += ` (Probability: ${risk.probability}, Impact: ${risk.impact}, Risk Score: ${score})`
          }
          prompt += `\n`
        })
      } else {
        prompt += `  No risks identified yet.\n`
      }
      prompt += `\n`
    }
  })
  
  prompt += `Please generate a complete AGENTS.md file that:\n`
  prompt += `1. Starts with "# AGENTS.md" as the title\n`
  prompt += `2. Includes a brief project overview section describing the Django modular monolith\n`
  prompt += `3. Has an "## Architecture Characteristics" section documenting the ${finalChars.length} priority characteristics\n`
  prompt += `4. Contains a "## Risk Management" section with identified risks and mitigation strategies\n`
  prompt += `5. Provides a "## Development Guidelines" section covering Django/DRF/Vue/Pinia best practices\n`
  prompt += `6. Includes "## Setup commands" and "## Testing instructions" sections\n`
  prompt += `7. Has a "## Code style" section for conventions\n`
  prompt += `8. Contains a "## Architecture patterns" section for Ports & Adapters, DDD, and signal usage\n`
  prompt += `9. Includes a "## Deployment considerations" section\n`
  prompt += `10. Ends with a "## Security considerations" section if Security is a characteristic\n\n`
  prompt += `Format the entire response as a ready-to-use AGENTS.md markdown file. Use proper markdown syntax with ## for main sections, ### for subsections, bullet points, and code blocks where helpful. Make it comprehensive enough that an AI agent could understand the architectural priorities without reading other documentation.\n\n`
  prompt += `Keep recommendations practical, specific to Django/DRF/Vue/Pinia, and avoid suggesting major architectural changes unless absolutely necessary for the characteristics. Prefer evolutionary improvements within the existing modular monolith structure.`
  
  console.log(prompt)
  return prompt
}

const generateRecommendations = async () => {
  // Check if we have an API key
  if (!apiKey.value.trim()) {
    requestApiKey()
    return
  }
  
  isGenerating.value = true
  generationError.value = ''
  recommendations.value = ''
  
  try {
    // Dynamically import OpenAI to avoid build issues
    // @ts-ignore - OpenAI package will be installed via npm install openai
    const { default: OpenAI } = await import('openai')
    
    const groq = new OpenAI({
      apiKey: apiKey.value.trim(),
      baseURL: 'https://api.groq.com/openai/v1',
      dangerouslyAllowBrowser: true
    })
    
    const prompt = buildPrompt()
    
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert software architect specializing in Django and Vue.js applications with deep knowledge of:\n- Django modular monolith architecture and best practices\n- Django Rest Framework (DRF) for API design\n- Ports & Adapters (Hexagonal Architecture) pattern\n- Domain-Driven Design (DDD) principles\n- Django signals usage patterns\n- Vue.js SPA architecture with Pinia state management\n- AGENTS.md file format and structure (as defined at https://agents.md/)\n- Architecture characteristics, design patterns, and risk management\n\nYour task is to generate a complete, well-formatted AGENTS.md file that AI coding agents can use to understand the project\'s architectural priorities, constraints, and development guidelines. Format the output as a proper markdown document starting with "# AGENTS.md" and using appropriate heading levels (##, ###), bullet points, code blocks, and sections. Make it comprehensive, practical, and specific to the Django/DRF/Vue/Pinia tech stack.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
    
    recommendations.value = response.choices[0]?.message?.content || 'No recommendations generated.'
    showRecommendationsModal.value = true // Open modal automatically
    
  } catch (error: any) {
    console.error('Error generating recommendations:', error)
    generationError.value = error.message || 'Failed to generate recommendations. Please check your API key and try again.'
    showRecommendationsModal.value = true // Open modal to show error
    
    // If it's an auth error, prompt for API key again
    if (error.status === 401 || error.message?.includes('API key')) {
      clearApiKey()
      requestApiKey()
    }
  } finally {
    isGenerating.value = false
  }
}

const copyRecommendations = async () => {
  try {
    await navigator.clipboard.writeText(recommendations.value)
    alert('AGENTS.md content copied to clipboard!')
  } catch (error) {
    console.error('Failed to copy:', error)
    alert('Failed to copy to clipboard')
  }
}

const exportAgentsMd = () => {
  if (recommendations.value) {
    // Create a blob with the markdown content
    const blob = new Blob([recommendations.value], { type: 'text/markdown;charset=utf-8' })
    
    // Create a download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'AGENTS.md'
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

// Initialize API key on mount
initializeApiKey()

// Get characteristics that were not in the top 7
const getOtherCharacteristics = () => {
  return characteristics.filter(
    char => !candidateCharacteristics.value.includes(char.name)
  )
}

// Get the selected candidate characteristics as objects
const getCandidateCharacteristicsObjects = () => {
  return characteristics.filter(
    char => candidateCharacteristics.value.includes(char.name)
  )
}

// Watch for when all system areas are removed and clear selections
watch(
  () => systemAreas.value.length,
  (newLength) => {
    if (newLength === 0) {
      // Reset confirmation flag
      systemAreasConfirmed.value = false
      // Clear all selected characteristics when no system areas exist
      selectedCharacteristics.value.clear()
      selectedCharacteristics.value = new Set()
      showLimitWarning.value = false
    }
  }
)

// Watch for when all strategic goals are removed and clear selections
watch(
  () => strategicGoals.value.length,
  (newLength) => {
    if (newLength === 0) {
      // Reset confirmation flag
      strategicGoalsConfirmed.value = false
      // Clear all selected characteristics when no strategic goals exist
      selectedCharacteristics.value.clear()
      selectedCharacteristics.value = new Set()
      showLimitWarning.value = false
    }
  }
)
</script>

<template>
  <div class="workshop-page">
    <h1>Workshop</h1>
    
    <!-- System Areas Modal -->
    <ItemListModal
      :show="showSystemAreasModal"
      title="System Areas"
      description="Define the areas of your system that this workshop will focus on."
      placeholder="Enter a system area"
      add-button-text="Add Area"
      :items="systemAreas"
      item-class="area-tag"
      :confirmed="systemAreasConfirmed"
      @add="addSystemArea"
      @remove="removeSystemArea"
      @confirm="confirmSystemAreas"
      @close="showSystemAreasModal = false"
    />

    <!-- Strategic Goals Modal -->
    <ItemListModal
      :show="showStrategicGoalsModal"
      title="Strategic Goals"
      description="Define the strategic business or product goals associated with your system areas."
      placeholder="Enter a strategic goal"
      add-button-text="Add Goal"
      :items="strategicGoals"
      item-class="goal-tag"
      :confirmed="strategicGoalsConfirmed"
      @add="addStrategicGoal"
      @remove="removeStrategicGoal"
      @confirm="confirmStrategicGoals"
      @close="showStrategicGoalsModal = false"
    />

    <!-- Confirmed System Areas and Goals Summary -->
    <section class="confirmed-selections-section">
      <!-- System Areas Summary -->
      <div class="selection-summary">
        <div class="summary-header">
          <h3>System Areas</h3>
          <button v-if="systemAreas.length > 0" class="edit-button" @click="editSystemAreas">Edit</button>
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
        <div v-else class="empty-state">
          <p>Define the areas of your system that this workshop will focus on.</p>
          <button class="add-button" @click="editSystemAreas">
            + Add System Areas
          </button>
        </div>
      </div>

      <!-- Strategic Goals Summary -->
      <div class="selection-summary">
        <div class="summary-header">
          <h3>Strategic Goals</h3>
          <button v-if="strategicGoals.length > 0" class="edit-button" @click="editStrategicGoals">Edit</button>
        </div>
        <div v-if="strategicGoals.length > 0" class="goals-list">
          <div 
            v-for="(goal, index) in strategicGoals" 
            :key="index"
            class="goal-tag"
          >
            <span>{{ goal }}</span>
            <button 
              class="remove-button"
              @click="removeStrategicGoal(index)"
              aria-label="Remove goal"
            >
              ×
            </button>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>Define the strategic business or product goals associated with your system areas.</p>
          <button class="add-button" @click="editStrategicGoals">
            + Add Strategic Goals
          </button>
        </div>
      </div>
    </section>

    <!-- Initial Phase: Select 7 Characteristics -->
    <section v-if="phase === 'initial'" class="characteristics-section">
      <h2>Architecture Characteristics</h2>
      <p>Select 7 characteristics that are most relevant to your system areas.</p>
      
      <div v-if="!canSelectCharacteristics()" class="info-message">
        <span v-if="systemAreas.length === 0 && strategicGoals.length === 0">
          You must add at least one system area and one strategic goal before selecting characteristics.
        </span>
        <span v-else-if="systemAreas.length === 0">
          You must add at least one system area before selecting characteristics.
        </span>
        <span v-else-if="strategicGoals.length === 0">
          You must add at least one strategic goal before selecting characteristics.
        </span>
      </div>
      
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
      
      <div class="characteristics-grid" :class="{ 'grid-disabled': !canSelectCharacteristics() }">
        <CharacteristicCard
          v-for="characteristic in characteristics" 
          :key="characteristic.name"
          :name="characteristic.name"
          :description="characteristic.description"
          :is-selected="isSelected(characteristic.name)"
          :class="{ disabled: !canSelectCharacteristics() }"
          @click="toggleSelection(characteristic.name)"
        />
      </div>
    </section>

    <!-- Narrow Down Phase: Select Final 3 -->
    <section v-if="phase === 'narrowDown'" class="narrow-down-section">
      <h2>Narrow Down to Top 3</h2>
      <p>Review your 7 selected characteristics and narrow them down to the 3 most important ones for your system areas. This is a suggested limit - you can select more if needed.</p>
      
      <div class="selection-status">
        <div class="counter">
          Selected: {{ finalSelections.size }} / {{ SUGGESTED_FINAL }}
        </div>
        
        <button 
          class="back-button"
          @click="goBackToInitialPhase"
        >
          Back to initial selection
        </button>
        
        <button 
          class="continue-button"
          :disabled="!canProceedToRiskAssessment()"
          @click="proceedToRiskAssessment"
        >
          Continue to Risk Assessment
        </button>
      </div>

      <!-- Selected 7 Characteristics (Prominent) -->
      <div class="selected-characteristics-section">
        <h3>Your Selected Characteristics</h3>
        <div class="characteristics-grid">
          <CharacteristicCard
            v-for="characteristic in getCandidateCharacteristicsObjects()" 
            :key="characteristic.name"
            :name="characteristic.name"
            :description="characteristic.description"
            :is-selected="isFinallySelected(characteristic.name)"
            @click="toggleFinalSelection(characteristic.name)"
          />
        </div>
      </div>

      <!-- Other 15 Characteristics (Less Prominent) -->
      <div class="other-characteristics-section secondary">
        <h3>Other Characteristics</h3>
        <p class="secondary-text">For reference - these were not in your top 7</p>
        <div class="characteristics-grid">
          <CharacteristicCard
            v-for="characteristic in getOtherCharacteristics()" 
            :key="characteristic.name"
            :name="characteristic.name"
            :description="characteristic.description"
            :is-selected="false"
            :class="{ disabled: true }"
            @click="() => {}"
          />
        </div>
      </div>
    </section>

    <!-- Risk Assessment Phase -->
    <section v-if="phase === 'riskAssessment'" class="risk-assessment-section">
      <h2>Risk Assessment</h2>
      <p>For each of your selected characteristics, identify risks that will need to be managed and assess their probability and impact.</p>
      
      <div class="selection-status">
        <button 
          class="back-button"
          @click="goBackToNarrowDown"
        >
          Back to characteristic selection
        </button>
        
        <div class="ai-button-group">
          <button 
            class="generate-ai-button"
            @click="generateRecommendations"
            :disabled="isGenerating"
          >
            {{ isGenerating ? 'Generating AGENTS.md...' : '🤖 Generate AGENTS.md' }}
          </button>
          
          <button 
            v-if="recommendations || generationError"
            class="view-agents-button"
            @click="showRecommendationsModal = true"
          >
            📄 View AGENTS.md
          </button>
        </div>
      </div>

      <div class="risk-characteristics-container">
        <div 
          v-for="characteristic in getFinalCharacteristicsObjects()"
          :key="characteristic.name"
          class="risk-characteristic-section"
        >
          <h3>{{ characteristic.name }}</h3>
          <p class="characteristic-description">{{ characteristic.description }}</p>

          <!-- Add Risk Input -->
          <div class="risk-input-group">
            <textarea
              v-model="newRiskInputs[characteristic.name]"
              :placeholder="`Enter a risk for ${characteristic.name}...`"
              rows="3"
              @keyup.ctrl.enter="addRisk(characteristic.name)"
            />
            <button 
              class="add-risk-button"
              @click="addRisk(characteristic.name)"
            >
              Add Risk
            </button>
          </div>

          <!-- Risk List -->
          <div v-if="(risks[characteristic.name]?.length ?? 0) > 0" class="risks-list">
            <div 
              v-for="risk in risks[characteristic.name]!"
              :key="risk.id"
              class="risk-item"
              :class="getRiskColorClass(getRiskScore(risk))"
            >
              <div class="risk-header">
                <p class="risk-description">{{ risk.description }}</p>
                <button 
                  class="remove-risk-button"
                  @click="removeRisk(characteristic.name, risk.id)"
                  aria-label="Remove risk"
                >
                  ×
                </button>
              </div>

              <div class="risk-assessment-matrix">
                <div class="risk-dimension">
                  <label class="risk-label">Probability</label>
                  <div class="risk-options">
                    <button
                      v-for="level in [1, 2, 3]"
                      :key="`prob-${level}`"
                      class="risk-option-button"
                      :class="{ selected: risk.probability === level }"
                      :data-probability="level"
                      @click="updateRiskProbability(characteristic.name, risk.id, level as 1 | 2 | 3)"
                    >
                      <span class="level-label">{{ ['Low', 'Medium', 'High'][level - 1] }}</span>
                      <span class="level-value">{{ level }}</span>
                    </button>
                  </div>
                </div>

                <div class="risk-dimension">
                  <label class="risk-label">Impact</label>
                  <div class="risk-options">
                    <button
                      v-for="level in [1, 2, 3]"
                      :key="`impact-${level}`"
                      class="risk-option-button"
                      :class="{ selected: risk.impact === level }"
                      :data-impact="level"
                      @click="updateRiskImpact(characteristic.name, risk.id, level as 1 | 2 | 3)"
                    >
                      <span class="level-label">{{ ['Low', 'Medium', 'High'][level - 1] }}</span>
                      <span class="level-value">{{ level }}</span>
                    </button>
                  </div>
                </div>

                <div v-if="getRiskScore(risk) !== null" class="risk-score">
                  <label class="risk-label">Risk Score</label>
                  <div class="score-value">{{ getRiskScore(risk) }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="no-risks-message">
            No risks added yet. Use the text area above to add risks for this characteristic.
          </div>
        </div>
      </div>

      <!-- API Key Dialog -->
      <div v-if="showApiKeyDialog" class="api-key-dialog-overlay" @click="cancelApiKeyDialog">
        <div class="api-key-dialog" @click.stop>
          <div class="dialog-header">
            <h3>Enter Groq API Key</h3>
            <button class="close-dialog-button" @click="cancelApiKeyDialog">×</button>
          </div>
          
          <div class="dialog-content">
            <p>To generate AI recommendations, you need a Groq API key.</p>
            <p class="info-note">
              <strong>Note:</strong> Your API key is stored locally in your browser and never sent to our servers.
            </p>
            
            <div class="api-key-input-group">
              <label for="apiKeyInput">Groq API Key</label>
              <input
                id="apiKeyInput"
                v-model="apiKey"
                type="password"
                placeholder="Enter your Groq API key (gsk_...)"
                @keyup.enter="saveApiKey"
              />
            </div>
            
            <p class="help-text">
              Don't have an API key? 
              <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer">
                Get one free from Groq →
              </a>
            </p>
          </div>
          
          <div class="dialog-actions">
            <button class="cancel-button" @click="cancelApiKeyDialog">Cancel</button>
            <button class="save-button" @click="saveApiKey" :disabled="!apiKey.trim()">
              Save & Generate
            </button>
          </div>
        </div>
      </div>

      <!-- AGENTS.md Modal -->
      <AgentsMdModal
        :show="showRecommendationsModal"
        :recommendations="recommendations"
        :error="generationError"
        :is-generating="isGenerating"
        @close="showRecommendationsModal = false"
        @export="exportAgentsMd"
        @copy="copyRecommendations"
        @regenerate="generateRecommendations"
      />
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

h3 {
  color: #000000;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

section {
  margin-bottom: 3rem;
}

/* Confirmed Selections Summary */
.confirmed-selections-section {
  background-color: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .confirmed-selections-section {
    grid-template-columns: 1fr;
  }
}

.selection-summary {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
}

.summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.summary-header h3 {
  margin: 0;
  color: #000000;
  font-size: 1rem;
  font-weight: 600;
}

.edit-button {
  padding: 0.375rem 0.75rem;
  background-color: white;
  color: #16a34a;
  border: 1px solid #16a34a;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-button:hover {
  background-color: #16a34a;
  color: white;
}

.edit-button:active {
  background-color: #15803d;
}

.empty-state {
  padding: 1.5rem;
  text-align: center;
  background-color: white;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.4;
}

.add-button {
  padding: 0.5rem 1rem;
  background-color: #16a34a;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #15803d;
}

.add-button:active {
  background-color: #14532d;
}

.system-areas-section p,
.strategic-goals-section p,
.characteristics-section p {
  color: #4b5563;
  margin-bottom: 1.5rem;
}

.areas-list,
.goals-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.area-tag,
.goal-tag {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background-color: #dcfce7;
  border: 2px solid #16a34a;
  border-radius: 0.375rem;
  color: #000000;
  font-weight: 500;
  font-size: 0.875rem;
}

.area-tag .remove-button,
.goal-tag .remove-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  padding: 0;
  background-color: transparent;
  color: #dc2626;
  border: none;
  border-radius: 50%;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.area-tag .remove-button:hover,
.goal-tag .remove-button:hover {
  background-color: #fee2e2;
  color: #991b1b;
}

.area-tag .remove-button:active {
  background-color: #fecaca;
}

.info-message {
  padding: 1rem;
  background-color: #dbeafe;
  border: 2px solid #3b82f6;
  border-radius: 0.5rem;
  color: #1e40af;
  font-weight: 500;
  margin-bottom: 1.5rem;
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

.back-button {
  padding: 0.75rem 2rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #4b5563;
}

.back-button:active {
  background-color: #374151;
}

.characteristics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.characteristics-grid.grid-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.characteristics-grid :deep(.characteristic-card.disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Narrow Down Phase Styles */
.narrow-down-section {
  margin-top: 2rem;
}

.narrow-down-section h2 {
  color: #000000;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.narrow-down-section > p {
  color: #4b5563;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.selected-characteristics-section {
  margin-bottom: 3rem;
}

.selected-characteristics-section h3 {
  color: #000000;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.other-characteristics-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.other-characteristics-section.secondary {
  opacity: 0.7;
}

.other-characteristics-section h3 {
  color: #6b7280;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.secondary-text {
  color: #6b7280;
  font-size: 0.95rem;
  font-style: italic;
  margin-bottom: 1rem;
}

/* Risk Assessment Phase Styles */
.risk-assessment-section {
  margin-top: 2rem;
}

.risk-assessment-section h2 {
  color: #000000;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.risk-assessment-section > p {
  color: #4b5563;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.risk-characteristics-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-top: 2rem;
}

.risk-characteristic-section {
  background-color: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 2rem;
}

.risk-characteristic-section h3 {
  color: #000000;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.characteristic-description {
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.risk-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.risk-input-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.risk-input-group textarea:focus {
  outline: none;
  border-color: #16a34a;
}

.add-risk-button {
  align-self: flex-end;
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

.add-risk-button:hover {
  background-color: #15803d;
}

.add-risk-button:active {
  background-color: #14532d;
}

.risks-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.risk-item {
  background-color: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: border-color 0.2s;
}

.risk-item.risk-unassessed {
  border-color: #d1d5db;
}

.risk-item.risk-low {
  border-color: #16a34a;
  background-color: #f0fdf4;
}

.risk-item.risk-medium {
  border-color: #f59e0b;
  background-color: #fffbeb;
}

.risk-item.risk-high {
  border-color: #dc2626;
  background-color: #fef2f2;
}

.risk-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.risk-description {
  flex: 1;
  color: #000000;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
}

.remove-risk-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background-color: transparent;
  color: #dc2626;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  flex-shrink: 0;
}

.remove-risk-button:hover {
  background-color: #fee2e2;
  color: #991b1b;
}

.remove-risk-button:active {
  background-color: #fecaca;
}

.risk-assessment-matrix {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.risk-dimension {
  flex: 1;
  min-width: 200px;
}

.risk-label {
  display: block;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.risk-options {
  display: flex;
  gap: 0.5rem;
}

.risk-option-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.5rem;
  background-color: white;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.risk-option-button:hover {
  border-color: #16a34a;
  background-color: #f0fdf4;
}

.risk-option-button.selected {
  border-color: #16a34a;
  background-color: #dcfce7;
  font-weight: 600;
}

.level-label {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.risk-option-button.selected .level-label {
  color: #15803d;
}

.level-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #000000;
}

.risk-option-button.selected .level-value {
  color: #15803d;
}

.risk-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
}

.risk-item.risk-low .risk-score {
  background-color: #dcfce7;
}

.risk-item.risk-medium .risk-score {
  background-color: #fef3c7;
}

.risk-item.risk-high .risk-score {
  background-color: #fee2e2;
}

.score-value {
  font-size: 2rem;
  font-weight: 700;
  color: #000000;
  margin-top: 0.25rem;
}

.risk-item.risk-low .score-value {
  color: #15803d;
}

.risk-item.risk-medium .score-value {
  color: #d97706;
}

.risk-item.risk-high .score-value {
  color: #dc2626;
}

.no-risks-message {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-style: italic;
  background-color: white;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
}

/* AI Recommendations Styles */
.generate-ai-button {
  padding: 0.75rem 1.5rem;
  background-color: #8b5cf6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: auto;
}

.generate-ai-button:hover:not(:disabled) {
  background-color: #7c3aed;
}

.generate-ai-button:active:not(:disabled) {
  background-color: #6d28d9;
}

.generate-ai-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

/* API Key Dialog */
.api-key-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.api-key-dialog {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 100%;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.dialog-header h3 {
  margin: 0;
  color: #000000;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-dialog-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background-color: transparent;
  color: #6b7280;
  border: none;
  border-radius: 0.375rem;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.close-dialog-button:hover {
  background-color: #f3f4f6;
  color: #000000;
}

.dialog-content {
  padding: 1.5rem;
}

.dialog-content p {
  margin: 0 0 1rem 0;
  color: #4b5563;
  line-height: 1.5;
}

.info-note {
  padding: 0.75rem;
  background-color: #dbeafe;
  border: 1px solid #93c5fd;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.api-key-input-group {
  margin: 1.5rem 0;
}

.api-key-input-group label {
  display: block;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.api-key-input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.api-key-input-group input:focus {
  outline: none;
  border-color: #8b5cf6;
}

.help-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 1rem;
}

.help-text a {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 600;
}

.help-text a:hover {
  text-decoration: underline;
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
  justify-content: flex-end;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.cancel-button:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.save-button {
  padding: 0.75rem 1.5rem;
  background-color: #8b5cf6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover:not(:disabled) {
  background-color: #7c3aed;
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* AI Recommendations Section */
.ai-button-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.view-agents-button {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #8b5cf6;
  border: 2px solid #8b5cf6;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.view-agents-button:hover {
  background: #8b5cf6;
  color: white;
}
</style>

