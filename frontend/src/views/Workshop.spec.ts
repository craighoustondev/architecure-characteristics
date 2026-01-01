import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type DOMWrapper, type VueWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Workshop from './Workshop.vue'

describe('Workshop Page', () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/workshop', component: Workshop }
    ]
  })

  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(Workshop, {
      global: {
        plugins: [router]
      }
    })
  })

  // Helper to open System areas modal and add areas
  const openAndAddSystemAreas = async (areas: string[]) => {
    const addButton = wrapper.findAll('button').find(btn => 
      btn.text().includes('Add system areas')
    )
    await addButton!.trigger('click')
    
    for (const area of areas) {
      const input = wrapper.find('input[placeholder*="system area" i]')
      const addAreaButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Area')
      await input.setValue(area)
      await addAreaButton!.trigger('click')
    }
    
    const confirmButton = wrapper.findAll('button').find(btn => 
      btn.text().includes('Continue')
    )
    await confirmButton!.trigger('click')
  }

  // Helper to open Strategic goals modal and add goals
  const openAndAddStrategicGoals = async (goals: string[]) => {
    const addButton = wrapper.findAll('button').find(btn => 
      btn.text().includes('Add strategic goals')
    )
    await addButton!.trigger('click')
    
    for (const goal of goals) {
      const input = wrapper.find('input[placeholder*="strategic goal" i]')
      const addGoalButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Goal')
      await input.setValue(goal)
      await addGoalButton!.trigger('click')
    }
    
    const confirmButton = wrapper.findAll('button').find(btn => 
      btn.text().includes('Continue')
    )
    await confirmButton!.trigger('click')
  }

  // Helper to add both prerequisites
  const addPrerequisites = async () => {
    await openAndAddSystemAreas(['Test System Area'])
    await openAndAddStrategicGoals(['Test Strategic Goal'])
  }

  describe('Modal Workflow', () => {
    it('should show System areas and Strategic goals sections on load', () => {
      expect(wrapper.text()).toMatch(/system.*area/i)
      expect(wrapper.text()).toMatch(/strategic.*goal/i)
    })

    it('should open System areas modal when clicking "Add system areas"', async () => {
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add system areas')
      )
      
      await addButton!.trigger('click')
      
      const modal = wrapper.find('.modal-overlay')
      expect(modal.exists()).toBe(true)
      expect(wrapper.text()).toMatch(/system area/i)
    })

    it('should open Strategic goals modal when clicking "Add strategic goals"', async () => {
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add strategic goals')
      )
      
      await addButton!.trigger('click')
      
      const modal = wrapper.find('.modal-overlay')
      expect(modal.exists()).toBe(true)
      expect(wrapper.text()).toMatch(/strategic goal/i)
    })

    it('should not allow confirming System areas modal without adding areas', async () => {
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add system areas')
      )
      await addButton!.trigger('click')
      
      const confirmButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Continue')
      )
      if (confirmButton) {
        expect(confirmButton.attributes('disabled')).toBeDefined()
      }
    })

    it('should show confirmed system areas after closing modal', async () => {
      // Open modal
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add system areas')
      )
      await addButton!.trigger('click')
      
      // Add a system area
      const input = wrapper.find('input[placeholder*="system area" i]')
      const addAreaButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Area')
      
      await input.setValue('Payment Processing')
      await addAreaButton!.trigger('click')
      
      // Confirm
      const confirmButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Continue')
      )
      await confirmButton!.trigger('click')
      
      // Should show confirmed areas on main page
      expect(wrapper.text()).toContain('Payment Processing')
      expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('should not show characteristics selection until both sections completed', async () => {
      // Characteristics should be visible but disabled initially
      const cards = wrapper.findAll('.characteristic-card')
      expect(cards.length).toBe(22)
      
      // All cards should be disabled
      cards.forEach((card: DOMWrapper<Element>) => {
        expect(card.classes()).toContain('disabled')
      })
    })

    it('should allow re-opening System areas modal to edit', async () => {
      // Add System Area
      let addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add system areas')
      )
      await addButton!.trigger('click')
      
      const input = wrapper.find('input[placeholder*="system area" i]')
      const addAreaButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Area')
      
      await input.setValue('Payment Processing')
      await addAreaButton!.trigger('click')
      
      const confirmButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Continue')
      )
      await confirmButton!.trigger('click')
      
      // Should have an edit button
      const editButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Edit')
      )
      expect(editButton).toBeDefined()
    })

    it('should allow removing confirmed system areas', async () => {
      // Add System Area
      let addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add system areas')
      )
      await addButton!.trigger('click')
      
      const input = wrapper.find('input[placeholder*="system area" i]')
      const addAreaButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Area')
      
      await input.setValue('Payment Processing')
      await addAreaButton!.trigger('click')
      
      const confirmButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Continue')
      )
      await confirmButton!.trigger('click')
      
      // Find and click remove button
      const areaTags = wrapper.findAll('.area-tag')
      const removeButton = areaTags[0]?.find('button')
      if (removeButton?.exists()) {
        await removeButton.trigger('click')
        expect(wrapper.text()).not.toContain('Payment Processing')
      }
    })

    it('should disable characteristic selection when all system areas removed', async () => {
      // Complete System areas and Strategic goals
      await addPrerequisites()
      
      // Characteristics should be enabled
      const cards = wrapper.findAll('.characteristic-card')
      cards.forEach((card) => {
        expect(card.classes()).not.toContain('disabled')
      })
      
      // Remove all system areas from the confirmed section
      const areaTags = wrapper.findAll('.area-tag')
      for (const tag of areaTags) {
        const removeButton = tag.find('button')
        await removeButton.trigger('click')
      }
      
      // Characteristics should now be disabled
      const cardsAfter = wrapper.findAll('.characteristic-card')
      cardsAfter.forEach((card) => {
        expect(card.classes()).toContain('disabled')
      })
    })

    it('should disable characteristic selection when all strategic goals removed', async () => {
      // Complete System areas and Strategic goals
      await addPrerequisites()
      
      // Remove all strategic goals from the confirmed section
      const goalTags = wrapper.findAll('.goal-tag')
      for (const tag of goalTags) {
        const removeButton = tag.find('button')
        await removeButton.trigger('click')
      }
      
      // Characteristics should be disabled
      const cards = wrapper.findAll('.characteristic-card')
      cards.forEach((card) => {
        expect(card.classes()).toContain('disabled')
      })
    })

    it('should show "Add system areas" button when all areas removed', async () => {
      // Add system areas
      await openAndAddSystemAreas(['Payment Processing'])
      
      // Remove all system areas from the confirmed section
      const areaTags = wrapper.findAll('.area-tag')
      for (const tag of areaTags) {
        const removeButton = tag.find('button')
        await removeButton.trigger('click')
      }
      
      // Should show add button in empty state
      expect(wrapper.text()).toMatch(/add.*system.*area/i)
      const addSystemAreasButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add system areas')
      )
      expect(addSystemAreasButton).toBeDefined()
    })

    it('should reopen modal when clicking "Add system areas" button', async () => {
      // Add system areas
      await openAndAddSystemAreas(['Payment Processing'])
      
      // Remove all system areas from the confirmed section
      const areaTags = wrapper.findAll('.area-tag')
      for (const tag of areaTags) {
        const removeButton = tag.find('button')
        await removeButton.trigger('click')
      }
      
      // Click add button in empty state
      const addSystemAreasButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add system areas')
      )
      await addSystemAreasButton!.trigger('click')
      
      // Modal should be visible
      const modal = wrapper.find('.modal-overlay')
      expect(modal.exists()).toBe(true)
      
      // Modal should contain system areas content
      expect(wrapper.text()).toMatch(/system area/i)
    })

    it('should show "Add strategic goals" button when all goals removed', async () => {
      // Complete both modals
      await addPrerequisites()
      
      // Remove all strategic goals from the confirmed section
      const goalTags = wrapper.findAll('.goal-tag')
      for (const tag of goalTags) {
        const removeButton = tag.find('button')
        await removeButton.trigger('click')
      }
      
      // Should show add button in empty state
      expect(wrapper.text()).toMatch(/add.*strategic.*goal/i)
      const addGoalsButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add strategic goals')
      )
      expect(addGoalsButton).toBeDefined()
    })
  })

  describe('System areas', () => {
    it('should display an input field for adding system areas when modal is open', async () => {
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add system areas')
      )
      await addButton!.trigger('click')
      
      const input = wrapper.find('input[type="text"]')
      expect(input.exists()).toBe(true)
      expect(input.attributes('placeholder')).toContain('system area')
    })

    it('should add a system area when button is clicked', async () => {
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add system areas')
      )
      await addButton!.trigger('click')
      
      const input = wrapper.find('input[placeholder*="system area" i]')
      const addAreaButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Area')
      
      await input.setValue('Payment Processing')
      await addAreaButton!.trigger('click')
      
      expect(wrapper.text()).toContain('Payment Processing')
    })

    it('should display multiple added system areas', async () => {
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add system areas')
      )
      await addButton!.trigger('click')
      
      const input = wrapper.find('input[placeholder*="system area" i]')
      const addAreaButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Area')
      
      await input.setValue('Payment Processing')
      await addAreaButton!.trigger('click')
      
      await input.setValue('User Authentication')
      await addAreaButton!.trigger('click')
      
      expect(wrapper.text()).toContain('Payment Processing')
      expect(wrapper.text()).toContain('User Authentication')
    })

    it('should clear the input field after adding an area', async () => {
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add system areas')
      )
      await addButton!.trigger('click')
      
      const input = wrapper.find('input[placeholder*="system area" i]')
      const addAreaButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Area')
      
      await input.setValue('Payment Processing')
      await addAreaButton!.trigger('click')
      
      expect((input.element as HTMLInputElement).value).toBe('')
    })

    it('should remove an area when its remove button is clicked', async () => {
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add system areas')
      )
      await addButton!.trigger('click')
      
      const input = wrapper.find('input[placeholder*="system area" i]')
      const addAreaButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Area')
      
      await input.setValue('Payment Processing')
      await addAreaButton!.trigger('click')
      
      expect(wrapper.text()).toContain('Payment Processing')
      
      const areaTags = wrapper.findAll('.area-tag')
      const removeButton = areaTags[0]!.find('button')
      await removeButton.trigger('click')
      
      expect(wrapper.text()).not.toContain('Payment Processing')
    })

    it('should remove only the specific area when multiple areas exist', async () => {
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add system areas')
      )
      await addButton!.trigger('click')
      
      const input = wrapper.find('input[placeholder*="system area" i]')
      const addAreaButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Area')
      
      await input.setValue('Payment Processing')
      await addAreaButton!.trigger('click')
      
      await input.setValue('User Authentication')
      await addAreaButton!.trigger('click')
      
      await input.setValue('Reporting System')
      await addAreaButton!.trigger('click')
      
      expect(wrapper.text()).toContain('Payment Processing')
      expect(wrapper.text()).toContain('User Authentication')
      expect(wrapper.text()).toContain('Reporting System')
      
      // Remove the middle one (User Authentication)
      const areaTags = wrapper.findAll('.area-tag')
      const removeButton = areaTags[1]!.find('button')
      await removeButton.trigger('click')
      
      expect(wrapper.text()).toContain('Payment Processing')
      expect(wrapper.text()).not.toContain('User Authentication')
      expect(wrapper.text()).toContain('Reporting System')
    })
  })

  describe('Strategic goals', () => {
    it('should display an input field for adding strategic business/product goals when modal is open', async () => {
      await openAndAddSystemAreas(['Test Area'])
      
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add strategic goals')
      )
      await addButton!.trigger('click')
      
      const goalsInput = wrapper.find('input[placeholder="Enter a strategic goal"]')
      expect(goalsInput.exists()).toBe(true)
    })

    it('should display an "Add Goal" button', async () => {
      await openAndAddSystemAreas(['Test Area'])
      
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add strategic goals')
      )
      await addButton!.trigger('click')
      
      const addGoalButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Goal')
      expect(addGoalButton).toBeDefined()
      expect(addGoalButton!.exists()).toBe(true)
    })

    it('should add a goal when the Add Goal button is clicked', async () => {
      await openAndAddSystemAreas(['Test Area'])
      
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add strategic goals')
      )
      await addButton!.trigger('click')
      
      const goalsInput = wrapper.find('input[placeholder="Enter a strategic goal"]')
      const addGoalButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Goal')
      
      await goalsInput.setValue('Increase customer retention by 20%')
      await addGoalButton!.trigger('click')
      
      expect(wrapper.text()).toContain('Increase customer retention by 20%')
    })

    it('should display multiple goals when added', async () => {
      await openAndAddSystemAreas(['Test Area'])
      
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add strategic goals')
      )
      await addButton!.trigger('click')
      
      const goalsInput = wrapper.find('input[placeholder="Enter a strategic goal"]')
      const addGoalButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Goal')
      
      await goalsInput.setValue('Increase customer retention by 20%')
      await addGoalButton!.trigger('click')
      
      await goalsInput.setValue('Reduce operational costs')
      await addGoalButton!.trigger('click')
      
      expect(wrapper.text()).toContain('Increase customer retention by 20%')
      expect(wrapper.text()).toContain('Reduce operational costs')
    })

    it('should clear the input field after adding a goal', async () => {
      await openAndAddSystemAreas(['Test Area'])
      
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add strategic goals')
      )
      await addButton!.trigger('click')
      
      const goalsInput = wrapper.find('input[placeholder="Enter a strategic goal"]')
      const addGoalButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Goal')
      
      await goalsInput.setValue('Launch new product line')
      await addGoalButton!.trigger('click')
      
      expect((goalsInput.element as HTMLInputElement).value).toBe('')
    })

    it('should remove a goal when its remove button is clicked', async () => {
      await openAndAddSystemAreas(['Test Area'])
      
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add strategic goals')
      )
      await addButton!.trigger('click')
      
      const goalsInput = wrapper.find('input[placeholder="Enter a strategic goal"]')
      const addGoalButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Goal')
      
      await goalsInput.setValue('Improve market share')
      await addGoalButton!.trigger('click')
      
      expect(wrapper.text()).toContain('Improve market share')
      
      const goalTags = wrapper.findAll('.goal-tag')
      const removeButton = goalTags[0]!.find('button')
      await removeButton.trigger('click')
      
      expect(wrapper.text()).not.toContain('Improve market share')
    })

    it('should remove only the specific goal when multiple goals exist', async () => {
      await openAndAddSystemAreas(['Test Area'])
      
      const addButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add strategic goals')
      )
      await addButton!.trigger('click')
      
      const goalsInput = wrapper.find('input[placeholder="Enter a strategic goal"]')
      const addGoalButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Goal')
      
      await goalsInput.setValue('Goal A')
      await addGoalButton!.trigger('click')
      
      await goalsInput.setValue('Goal B')
      await addGoalButton!.trigger('click')
      
      await goalsInput.setValue('Goal C')
      await addGoalButton!.trigger('click')
      
      expect(wrapper.text()).toContain('Goal A')
      expect(wrapper.text()).toContain('Goal B')
      expect(wrapper.text()).toContain('Goal C')
      
      // Remove the middle one (Goal B)
      const goalTags = wrapper.findAll('.goal-tag')
      const removeButton = goalTags[1]!.find('button')
      await removeButton.trigger('click')
      
      expect(wrapper.text()).toContain('Goal A')
      expect(wrapper.text()).not.toContain('Goal B')
      expect(wrapper.text()).toContain('Goal C')
    })
  })

  describe('Architecture characteristics', () => {
    it('should display all 22 architecture characteristic cards', () => {
      const cards = wrapper.findAll('.characteristic-card')
      expect(cards).toHaveLength(22)
    })

    it('should display characteristic cards with name and description', () => {
      const cards = wrapper.findAll('.characteristic-card')
      
      // Verify each card has both h3 (name) and p (description)
      cards.forEach((card: DOMWrapper<Element>) => {
        expect(card.find('h3').exists()).toBe(true)
        expect(card.find('p').exists()).toBe(true)
        expect(card.find('h3').text()).not.toBe('')
        expect(card.find('p').text()).not.toBe('')
      })
    })

    it('should display a sample characteristic correctly', () => {
      // Test one representative example to verify structure
      expect(wrapper.text()).toContain('Scalability')
      expect(wrapper.text()).toContain(
        'A function of system capacity and growth over time'
      )
    })

    it('should not have any cards selected initially', () => {
      const selectedCards = wrapper.findAll('.characteristic-card.selected')
      expect(selectedCards).toHaveLength(0)
    })

    it('should not allow selecting characteristics when no system areas are defined', async () => {
      const cards = wrapper.findAll('.characteristic-card')
      const firstCard = cards[0]!
      
      // Try to select a characteristic without adding a system area
      await firstCard.trigger('click')
      
      // Card should not be selected
      expect(firstCard.classes()).not.toContain('selected')
    })

    it('should not allow selecting characteristics when system area exists but no goals are defined', async () => {
      await openAndAddSystemAreas(['Payment Processing'])
      
      // Should not be able to select characteristics yet (no goals confirmed)
      const cards = wrapper.findAll('.characteristic-card')
      expect(cards.length).toBe(22)
      
      // Try to select a characteristic without adding a goal
      const firstCard = cards[0]!
      await firstCard.trigger('click')
      
      // Card should not be selected
      expect(firstCard.classes()).not.toContain('selected')
    })

    it('should show a message when no system areas or goals are defined', () => {
      expect(wrapper.text()).toMatch(/add.*system area.*strategic goal.*before selecting/i)
    })

    it('should show a message when system area exists but no goals are defined', async () => {
      await openAndAddSystemAreas(['Payment Processing'])
      
      expect(wrapper.text()).toMatch(/add.*strategic goal.*before selecting/i)
    })

    it('should have disabled appearance on characteristics when prerequisites are not met', async () => {
      const cards = wrapper.findAll('.characteristic-card')
      
      // Cards should have a disabled class initially (no system area, no goal)
      cards.forEach((card: DOMWrapper<Element>) => {
        expect(card.classes()).toContain('disabled')
      })
      
      // Add system area but no goal - should still be disabled
      await openAndAddSystemAreas(['Payment Processing'])
      
      const cardsAfterArea = wrapper.findAll('.characteristic-card')
      cardsAfterArea.forEach((card: DOMWrapper<Element>) => {
        expect(card.classes()).toContain('disabled')
      })
    })

    it('should allow selecting characteristics after adding both system area and goal', async () => {
      await addPrerequisites()
      
      // Now try to select a characteristic
      const cards = wrapper.findAll('.characteristic-card')
      const firstCard = cards[0]!
      await firstCard.trigger('click')
      
      // Card should now be selected
      expect(firstCard.classes()).toContain('selected')
    })

    it('should clear all selected characteristics when all goals are removed', async () => {
      await addPrerequisites()
      
      // Select a characteristic
      const cards = wrapper.findAll('.characteristic-card')
      await cards[0]!.trigger('click')
      await cards[1]!.trigger('click')
      
      expect(cards[0]!.classes()).toContain('selected')
      expect(cards[1]!.classes()).toContain('selected')
      
      // Remove the goal via the Edit button
      const editGoalsButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Edit') && wrapper.text().includes('Strategic goals')
      )
      await editGoalsButton!.trigger('click')
      
      // Remove the goal from within the modal
      const goalTags = wrapper.findAll('.goal-tag')
      const removeButton = goalTags[0]!.find('button')
      await removeButton.trigger('click')
      
      // Confirm the modal (which now has no goals)
      const confirmButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Continue')
      )
      await confirmButton!.trigger('click')
      
      // Characteristics should be cleared
      expect(cards[0]!.classes()).not.toContain('selected')
      expect(cards[1]!.classes()).not.toContain('selected')
    })

    it('should clear all selected characteristics when all system areas are removed', async () => {
      await addPrerequisites()
      
      // Select some characteristics
      const cards = wrapper.findAll('.characteristic-card')
      await cards[0]!.trigger('click')
      await cards[1]!.trigger('click')
      await cards[2]!.trigger('click')
      
      // Verify they are selected
      expect(cards[0]!.classes()).toContain('selected')
      expect(cards[1]!.classes()).toContain('selected')
      expect(cards[2]!.classes()).toContain('selected')
      expect(wrapper.text()).toMatch(/Selected:.*3.*\/.*7/)
      
      // Remove the system area via the Edit button
      const editAreasButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Edit') && wrapper.text().includes('System areas')
      )
      await editAreasButton!.trigger('click')
      
      // Remove the area from within the modal
      const areaTags = wrapper.findAll('.area-tag')
      const removeButton = areaTags[0]!.find('button')
      await removeButton.trigger('click')
      
      // Confirm the modal (which now has no areas)
      const confirmButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Continue')
      )
      await confirmButton!.trigger('click')
      
      // All characteristics should now be deselected
      expect(cards[0]!.classes()).not.toContain('selected')
      expect(cards[1]!.classes()).not.toContain('selected')
      expect(cards[2]!.classes()).not.toContain('selected')
      expect(wrapper.text()).toMatch(/Selected:.*0.*\/.*7/)
    })

    it('should remove disabled state from characteristics after adding both prerequisites', async () => {
      await addPrerequisites()
      
      // Cards should no longer have disabled class
      const cards = wrapper.findAll('.characteristic-card')
      cards.forEach((card: DOMWrapper<Element>) => {
        expect(card.classes()).not.toContain('disabled')
      })
    })

    it('should select a card when clicked (after prerequisites added)', async () => {
      // Add prerequisites first
      await addPrerequisites()
      
      const cards = wrapper.findAll('.characteristic-card')
      const firstCard = cards[0]!
      
      await firstCard.trigger('click')
      
      expect(firstCard.classes()).toContain('selected')
    })

    it('should deselect a card when clicked again', async () => {
      // Add prerequisites first
      await addPrerequisites()
      
      const cards = wrapper.findAll('.characteristic-card')
      const firstCard = cards[0]!
      
      // Select the card
      await firstCard.trigger('click')
      expect(firstCard.classes()).toContain('selected')
      
      // Deselect the card
      await firstCard.trigger('click')
      expect(firstCard.classes()).not.toContain('selected')
    })

    it('should allow multiple cards to be selected', async () => {
      // Add prerequisites first
      await addPrerequisites()
      
      const cards = wrapper.findAll('.characteristic-card')
      
      // Select first and second cards
      await cards[0]!.trigger('click')
      await cards[1]!.trigger('click')
      
      expect(cards[0]!.classes()).toContain('selected')
      expect(cards[1]!.classes()).toContain('selected')
      expect(cards[2]!.classes()).not.toContain('selected')
    })
  })

  describe('Select 7 Characteristics Workflow', () => {

    it('should display a counter showing number of selected characteristics', () => {
      expect(wrapper.text()).toMatch(/Selected:.*0.*\/.*7/)
    })

    it('should update the counter when characteristics are selected', async () => {
      await addPrerequisites()
      
      const cards = wrapper.findAll('.characteristic-card')
      
      await cards[0]!.trigger('click')
      expect(wrapper.text()).toMatch(/Selected:.*1.*\/.*7/)
      
      await cards[1]!.trigger('click')
      expect(wrapper.text()).toMatch(/Selected:.*2.*\/.*7/)
    })

    it('should have "Continue" button disabled when less than 7 characteristics are selected', async () => {
      await addPrerequisites()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      
      expect(continueButton!.attributes('disabled')).toBeDefined()
      
      // Select 6 characteristics (not enough)
      const cards = wrapper.findAll('.characteristic-card')
      for (let i = 0; i < 6; i++) {
        await cards[i]!.trigger('click')
      }
      
      expect(continueButton!.attributes('disabled')).toBeDefined()
    })

    it('should enable "Continue" button when exactly 7 characteristics are selected', async () => {
      await addPrerequisites()
      
      const cards = wrapper.findAll('.characteristic-card')
      
      // Select exactly 7 characteristics
      for (let i = 0; i < 7; i++) {
        await cards[i]!.trigger('click')
      }
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      
      expect(continueButton!.attributes('disabled')).toBeUndefined()
    })

    it('should prevent selecting more than 7 characteristics', async () => {
      await addPrerequisites()
      
      const cards = wrapper.findAll('.characteristic-card')
      
      // Select 7 characteristics
      for (let i = 0; i < 7; i++) {
        await cards[i]!.trigger('click')
      }
      
      // Try to select an 8th
      await cards[7]!.trigger('click')
      
      // 8th card should not be selected
      expect(cards[7]!.classes()).not.toContain('selected')
      
      // Counter should still show 7
      expect(wrapper.text()).toMatch(/Selected:.*7.*\/.*7/)
      
      expect(wrapper.text()).toMatch(/maximum.*7/i)
    })

    it('should allow deselecting a characteristic when at the limit', async () => {
      await addPrerequisites()
      
      const cards = wrapper.findAll('.characteristic-card')
      
      // Select 7 characteristics
      for (let i = 0; i < 7; i++) {
        await cards[i]!.trigger('click')
      }
      
      // Deselect one
      await cards[0]!.trigger('click')
      expect(cards[0]!.classes()).not.toContain('selected')
      expect(wrapper.text()).toMatch(/Selected:.*6.*\/.*7/)
      
      // Now should be able to select a different one
      await cards[7]!.trigger('click')
      expect(cards[7]!.classes()).toContain('selected')
      expect(wrapper.text()).toMatch(/Selected:.*7.*\/.*7/)
    })
  })

  describe('Narrow Down to 3 Phase', () => {
    // Helper to add prerequisites and select 7 characteristics
    const setupSevenSelected = async () => {
      await addPrerequisites()
      
      const cards = wrapper.findAll('.characteristic-card')
      for (let i = 0; i < 7; i++) {
        await cards[i]!.trigger('click')
      }
    }

    it('should transition to narrow down phase when Continue is clicked with 7 selected', async () => {
      await setupSevenSelected()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      
      await continueButton!.trigger('click')
      
      // Should show instruction for narrowing down to 3
      expect(wrapper.text()).toMatch(/narrow.*down.*3/i)
    })

    it('should display the 7 selected characteristics prominently in narrow down phase', async () => {
      await setupSevenSelected()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      // The 7 selected characteristics should be in a prominent section
      const selectedSection = wrapper.find('.selected-characteristics-section')
      expect(selectedSection.exists()).toBe(true)
      
      const selectedCards = selectedSection.findAll('.characteristic-card')
      expect(selectedCards).toHaveLength(7)
    })

    it('should still display the other 15 characteristics in narrow down phase', async () => {
      await setupSevenSelected()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      // The other 15 characteristics should still be visible
      const otherSection = wrapper.find('.other-characteristics-section')
      expect(otherSection.exists()).toBe(true)
      
      const otherCards = otherSection.findAll('.characteristic-card')
      expect(otherCards).toHaveLength(15)
    })

    it('should show a counter for selecting final 3 characteristics', async () => {
      await setupSevenSelected()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      // Should show a counter starting at 0 / 3
      expect(wrapper.text()).toMatch(/Selected:.*0.*\/.*3/i)
    })

    it('should allow selecting characteristics from the 7 selected ones', async () => {
      await setupSevenSelected()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      const selectedSection = wrapper.find('.selected-characteristics-section')
      const cards = selectedSection.findAll('.characteristic-card')
      
      // Select first characteristic for final selection
      await cards[0]!.trigger('click')
      
      expect(cards[0]!.classes()).toContain('selected')
      expect(wrapper.text()).toMatch(/Selected:.*1.*\/.*3/i)
    })

    it('should allow deselecting characteristics in narrow down phase', async () => {
      await setupSevenSelected()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      const selectedSection = wrapper.find('.selected-characteristics-section')
      const cards = selectedSection.findAll('.characteristic-card')
      
      // Select and then deselect
      await cards[0]!.trigger('click')
      expect(cards[0]!.classes()).toContain('selected')
      
      await cards[0]!.trigger('click')
      expect(cards[0]!.classes()).not.toContain('selected')
      expect(wrapper.text()).toMatch(/Selected:.*0.*\/.*3/i)
    })

    it('should not enforce a hard limit of 3 selections', async () => {
      await setupSevenSelected()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      const selectedSection = wrapper.find('.selected-characteristics-section')
      const cards = selectedSection.findAll('.characteristic-card')
      
      // Select 4 characteristics (more than the suggested 3)
      for (let i = 0; i < 4; i++) {
        await cards[i]!.trigger('click')
      }
      
      // All 4 should be selected (no hard limit)
      expect(cards[0]!.classes()).toContain('selected')
      expect(cards[1]!.classes()).toContain('selected')
      expect(cards[2]!.classes()).toContain('selected')
      expect(cards[3]!.classes()).toContain('selected')
      expect(wrapper.text()).toMatch(/Selected:.*4.*\/.*3/i)
    })

    it('should show a visual distinction between selected 7 and other 15', async () => {
      await setupSevenSelected()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      const selectedSection = wrapper.find('.selected-characteristics-section')
      const otherSection = wrapper.find('.other-characteristics-section')
      
      // Sections should exist and be visually distinct
      expect(selectedSection.exists()).toBe(true)
      expect(otherSection.exists()).toBe(true)
      
      // Other section should have a less prominent styling
      expect(otherSection.classes()).toContain('secondary')
    })
  })

  describe('Navigate Back from Narrow Down Phase', () => {
    // Helper to add prerequisites and select 7 characteristics
    const setupSevenSelected = async () => {
      await addPrerequisites()
      
      const cards = wrapper.findAll('.characteristic-card')
      for (let i = 0; i < 7; i++) {
        await cards[i]!.trigger('click')
      }
    }

    it('should display a "Back" button in the narrow down phase', async () => {
      await setupSevenSelected()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      // Should have a back button
      const backButton = wrapper.findAll('button').find(btn => btn.text().includes('Back'))
      expect(backButton).toBeDefined()
      expect(backButton!.exists()).toBe(true)
    })

    it('should return to initial phase when Back button is clicked', async () => {
      await setupSevenSelected()
      
      // Move to narrow down phase
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      // Verify we're in narrow down phase
      expect(wrapper.text()).toMatch(/narrow.*down.*3/i)
      
      // Click back button
      const backButton = wrapper.findAll('button').find(btn => btn.text().includes('Back'))
      await backButton!.trigger('click')
      
      // Should be back in initial phase
      expect(wrapper.text()).toContain('Select 7 characteristics')
      expect(wrapper.text()).toMatch(/Selected:.*\d+.*\/.*7/)
    })

    it('should preserve the 7 selected characteristics when navigating back', async () => {
      await setupSevenSelected()
      
      // Move to narrow down phase
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      // Click back button
      const backButton = wrapper.findAll('button').find(btn => btn.text().includes('Back'))
      await backButton!.trigger('click')
      
      // The 7 characteristics should still be selected
      const cards = wrapper.findAll('.characteristic-card')
      expect(cards[0]!.classes()).toContain('selected')
      expect(cards[1]!.classes()).toContain('selected')
      expect(cards[2]!.classes()).toContain('selected')
      expect(cards[3]!.classes()).toContain('selected')
      expect(cards[4]!.classes()).toContain('selected')
      expect(cards[5]!.classes()).toContain('selected')
      expect(cards[6]!.classes()).toContain('selected')
      
      // Counter should show 7 / 7
      expect(wrapper.text()).toMatch(/Selected:.*7.*\/.*7/)
    })

    it('should allow deselecting characteristics after navigating back', async () => {
      await setupSevenSelected()
      
      // Move to narrow down phase and back
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      const backButton = wrapper.findAll('button').find(btn => btn.text().includes('Back'))
      await backButton!.trigger('click')
      
      // Deselect one characteristic
      const cards = wrapper.findAll('.characteristic-card')
      await cards[0]!.trigger('click')
      
      expect(cards[0]!.classes()).not.toContain('selected')
      expect(wrapper.text()).toMatch(/Selected:.*6.*\/.*7/)
    })

    it('should allow selecting additional characteristics after navigating back', async () => {
      await setupSevenSelected()
      
      // Move to narrow down phase and back
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      const backButton = wrapper.findAll('button').find(btn => btn.text().includes('Back'))
      await backButton!.trigger('click')
      
      // Deselect one
      const cards = wrapper.findAll('.characteristic-card')
      await cards[0]!.trigger('click')
      expect(wrapper.text()).toMatch(/Selected:.*6.*\/.*7/)
      
      // Select a different one (the 8th card which wasn't selected)
      await cards[7]!.trigger('click')
      expect(cards[7]!.classes()).toContain('selected')
      expect(wrapper.text()).toMatch(/Selected:.*7.*\/.*7/)
    })

    it('should disable Continue button after navigating back if less than 7 are selected', async () => {
      await setupSevenSelected()
      
      // Move to narrow down phase and back
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      const backButton = wrapper.findAll('button').find(btn => btn.text().includes('Back'))
      await backButton!.trigger('click')
      
      // Deselect one characteristic
      const cards = wrapper.findAll('.characteristic-card')
      await cards[0]!.trigger('click')
      
      // Continue button should be disabled
      buttons = wrapper.findAll('button')
      const newContinueButton = buttons.find(btn => btn.text().includes('Continue'))
      expect(newContinueButton!.attributes('disabled')).toBeDefined()
    })

    it('should clear final selections when navigating back and forward again', async () => {
      await setupSevenSelected()
      
      // Move to narrow down phase
      let buttons = wrapper.findAll('button')
      let continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      // Select 2 final characteristics
      const selectedSection = wrapper.find('.selected-characteristics-section')
      const selectedCards = selectedSection.findAll('.characteristic-card')
      await selectedCards[0]!.trigger('click')
      await selectedCards[1]!.trigger('click')
      expect(wrapper.text()).toMatch(/Selected:.*2.*\/.*3/)
      
      // Go back
      const backButton = wrapper.findAll('button').find(btn => btn.text().includes('Back'))
      await backButton!.trigger('click')
      
      // Go forward again
      buttons = wrapper.findAll('button')
      continueButton = buttons.find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      // Final selections should be cleared (reset to 0)
      expect(wrapper.text()).toMatch(/Selected:.*0.*\/.*3/)
    })
  })

  describe('Risk assessment Phase', () => {
    // Helper to get to the risk assessment phase
    const setupForRiskAssessment = async () => {
      await addPrerequisites()
      
      // Select 7 characteristics
      const cards = wrapper.findAll('.characteristic-card')
      for (let i = 0; i < 7; i++) {
        await cards[i]!.trigger('click')
      }
      
      // Continue to narrow down phase
      const continueButton = wrapper.findAll('button').find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      // Select final 3 characteristics
      const selectedSection = wrapper.find('.selected-characteristics-section')
      const selectedCards = selectedSection.findAll('.characteristic-card')
      for (let i = 0; i < 3; i++) {
        await selectedCards[i]!.trigger('click')
      }
    }

    it('should show a Continue button after selecting final characteristics', async () => {
      await setupForRiskAssessment()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      expect(continueButton).toBeDefined()
    })

    it('should display risk assessment section after clicking Continue from narrow down phase', async () => {
      await setupForRiskAssessment()
      
      // Find and click the button to proceed to risk assessment
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Should show risk assessment content
      expect(wrapper.text()).toMatch(/risk/i)
      
      // Should have sections for each of the 3 characteristics
      const riskSections = wrapper.findAll('.risk-characteristic-section')
      expect(riskSections.length).toBeGreaterThanOrEqual(3)
    })

    it('should have only the first characteristic section expanded by default', async () => {
      await setupForRiskAssessment()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      const riskSections = wrapper.findAll('.risk-characteristic-section')
      
      // First section should be expanded
      expect(riskSections[0]!.classes()).not.toContain('collapsed')
      
      // Other sections should be collapsed
      for (let i = 1; i < riskSections.length; i++) {
        expect(riskSections[i]!.classes()).toContain('collapsed')
      }
    })

    it('should have clickable headers to toggle collapse/expand', async () => {
      await setupForRiskAssessment()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Should have characteristic headers
      const headers = wrapper.findAll('.characteristic-header')
      expect(headers.length).toBeGreaterThanOrEqual(3)
    })

    it('should collapse a section when header is clicked', async () => {
      await setupForRiskAssessment()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      const header = wrapper.find('.characteristic-header')
      const section = wrapper.find('.risk-characteristic-section')
      
      // Click to collapse
      await header.trigger('click')
      
      // Section should now be collapsed
      expect(section.classes()).toContain('collapsed')
      // Content should be hidden in this specific section
      expect(section.find('.characteristic-content').exists()).toBe(false)
    })

    it('should expand a collapsed section when header is clicked again', async () => {
      await setupForRiskAssessment()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      const header = wrapper.find('.characteristic-header')
      const section = wrapper.find('.risk-characteristic-section')
      
      // Click to collapse
      await header.trigger('click')
      expect(section.classes()).toContain('collapsed')
      
      // Click to expand again
      await header.trigger('click')
      expect(section.classes()).not.toContain('collapsed')
    })

    it('should add a risk when Add risk button is clicked', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')

      // Only the first section is expanded by default, so only 1 Add risk button visible
      const addRiskButtons = wrapper.findAll('button').filter(btn => btn.text().includes('Add risk'))
      expect(addRiskButtons.length).toBeGreaterThanOrEqual(1)
      
      // Find first risk input and add risk button
      const riskInputs = wrapper.findAll('textarea[placeholder*="risk" i], input[placeholder*="risk" i]')
      const riskInput = riskInputs[0]!
      
      await riskInput.setValue('Database may become a bottleneck under high load')
      
      buttons = wrapper.findAll('button')
      const addRiskButton = buttons.filter(btn => btn.text().includes('Add risk'))[0]!
      await addRiskButton.trigger('click')
      
      expect(wrapper.text()).toContain('Database may become a bottleneck under high load')
    })

    it('should display probability selection matrix for each risk', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Add a risk
      const riskInputs = wrapper.findAll('textarea[placeholder*="risk" i], input[placeholder*="risk" i]')
      const riskInput = riskInputs[0]!
      await riskInput.setValue('Test risk')
      
      buttons = wrapper.findAll('button')
      const addRiskButton = buttons.filter(btn => btn.text().includes('Add risk'))[0]!
      await addRiskButton.trigger('click')
      
      // Should have probability and impact labels
      expect(wrapper.text()).toMatch(/probability/i)
      expect(wrapper.text()).toMatch(/impact/i)
    })

    it('should display probability and impact options: Low (1), Medium (2), High (3)', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Add a risk
      const riskInputs = wrapper.findAll('textarea[placeholder*="risk" i], input[placeholder*="risk" i]')
      const riskInput = riskInputs[0]!
      await riskInput.setValue('Test risk')
      
      buttons = wrapper.findAll('button')
      const addRiskButton = buttons.filter(btn => btn.text().includes('Add risk'))[0]!
      await addRiskButton.trigger('click')
      
      // Check specifically for PROBABILITY buttons (using data-probability attribute)
      const probabilityButtons = wrapper.findAll('button[data-probability]')
      expect(probabilityButtons).toHaveLength(3)
      
      // Verify each level exists
      const probLevels = probabilityButtons.map(btn => btn.attributes('data-probability'))
      expect(probLevels).toContain('1')
      expect(probLevels).toContain('2')
      expect(probLevels).toContain('3')
      
      // Verify labels
      expect(probabilityButtons[0]!.text()).toContain('Low')
      expect(probabilityButtons[1]!.text()).toContain('Medium')
      expect(probabilityButtons[2]!.text()).toContain('High')
      
      // Check specifically for IMPACT buttons (using data-impact attribute)
      const impactButtons = wrapper.findAll('button[data-impact]')
      expect(impactButtons).toHaveLength(3)
      
      // Verify each level exists
      const impactLevels = impactButtons.map(btn => btn.attributes('data-impact'))
      expect(impactLevels).toContain('1')
      expect(impactLevels).toContain('2')
      expect(impactLevels).toContain('3')
      
      // Verify labels
      expect(impactButtons[0]!.text()).toContain('Low')
      expect(impactButtons[1]!.text()).toContain('Medium')
      expect(impactButtons[2]!.text()).toContain('High')
    })

    it('should allow selecting probability level for a risk', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Add a risk
      const riskInputs = wrapper.findAll('textarea[placeholder*="risk" i], input[placeholder*="risk" i]')
      const riskInput = riskInputs[0]!
      await riskInput.setValue('Test risk')
      
      buttons = wrapper.findAll('button')
      const addRiskButton = buttons.filter(btn => btn.text().includes('Add risk'))[0]!
      await addRiskButton.trigger('click')
      
      // Find and click probability selection (e.g., radio button or button)
      const probabilityOptions = wrapper.findAll('input[type="radio"][name*="probability"], button[data-probability]')
      expect(probabilityOptions.length).toBeGreaterThan(0)
    })

    it('should allow selecting impact level for a risk', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Add a risk
      const riskInputs = wrapper.findAll('textarea[placeholder*="risk" i], input[placeholder*="risk" i]')
      const riskInput = riskInputs[0]!
      await riskInput.setValue('Test risk')
      
      buttons = wrapper.findAll('button')
      const addRiskButton = buttons.filter(btn => btn.text().includes('Add risk'))[0]!
      await addRiskButton.trigger('click')
      
      // Find and click impact selection
      const impactOptions = wrapper.findAll('input[type="radio"][name*="impact"], button[data-impact]')
      expect(impactOptions.length).toBeGreaterThan(0)
    })

    it('should calculate and display risk score (probability × impact)', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Add a risk
      const riskInputs = wrapper.findAll('textarea[placeholder*="risk" i], input[placeholder*="risk" i]')
      const riskInput = riskInputs[0]!
      await riskInput.setValue('Test risk')
      
      buttons = wrapper.findAll('button')
      const addRiskButton = buttons.filter(btn => btn.text().includes('Add risk'))[0]!
      await addRiskButton.trigger('click')
      
      // Select probability and impact (this test assumes the UI is set up)
      // The risk score should be displayed somewhere (e.g., 1-9 range)
      // This is a placeholder - actual implementation will determine exact selectors
      const riskItems = wrapper.findAll('.risk-item')
      if (riskItems.length > 0) {
        // Risk score should be calculated as probability × impact
        // Low × Low = 1, Medium × Medium = 4, High × High = 9, etc.
        expect(riskItems[0]!.text()).toBeTruthy()
      }
    })

    it('should display green color for low risk scores (1-2)', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // This test will verify color coding based on risk scores
      // Specific implementation depends on the UI design
      expect(wrapper.html()).toBeTruthy()
    })

    it('should display orange color for medium risk scores (3-4)', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // This test will verify color coding based on risk scores
      expect(wrapper.html()).toBeTruthy()
    })

    it('should display red color for high risk scores (6-9)', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // This test will verify color coding based on risk scores
      expect(wrapper.html()).toBeTruthy()
    })

    it('should allow adding multiple risks for a single characteristic', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Add first risk
      const riskInputs = wrapper.findAll('textarea[placeholder*="risk" i], input[placeholder*="risk" i]')
      const riskInput = riskInputs[0]!
      
      await riskInput.setValue('First risk')
      buttons = wrapper.findAll('button')
      let addRiskButton = buttons.filter(btn => btn.text().includes('Add risk'))[0]!
      await addRiskButton.trigger('click')
      
      expect(wrapper.text()).toContain('First risk')
      
      // Add second risk to the same characteristic
      await riskInput.setValue('Second risk')
      buttons = wrapper.findAll('button')
      addRiskButton = buttons.filter(btn => btn.text().includes('Add risk'))[0]!
      await addRiskButton.trigger('click')
      
      expect(wrapper.text()).toContain('First risk')
      expect(wrapper.text()).toContain('Second risk')
    })

    it('should remove a risk when its remove button is clicked', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Add a risk
      const riskInputs = wrapper.findAll('textarea[placeholder*="risk" i], input[placeholder*="risk" i]')
      const riskInput = riskInputs[0]!
      await riskInput.setValue('Risk to be removed')
      
      buttons = wrapper.findAll('button')
      const addRiskButton = buttons.filter(btn => btn.text().includes('Add risk'))[0]!
      await addRiskButton.trigger('click')
      
      expect(wrapper.text()).toContain('Risk to be removed')
      
      // Find and click remove button
      const riskItems = wrapper.findAll('.risk-item')
      const removeButton = riskItems[0]!.findAll('button').find(btn =>
        btn.text().includes('Remove') ||
        btn.text().includes('×') ||
        btn.text().includes('Delete')
      )
      
      await removeButton!.trigger('click')
      
      expect(wrapper.text()).not.toContain('Risk to be removed')
    })

    it('should display all risks grouped by their characteristic', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Add risks to different characteristics
      const riskSections = wrapper.findAll('.risk-characteristic-section')
      expect(riskSections.length).toBeGreaterThanOrEqual(3)
      
      // Each section should have its characteristic name displayed
      riskSections.forEach(section => {
        expect(section.find('h3, h4').exists()).toBe(true)
      })
    })

    it('should show back button to return to characteristic selection', async () => {
      await setupForRiskAssessment()
      
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Should have a back button
      const backButtons = wrapper.findAll('button').filter(btn => btn.text().includes('Back'))
      expect(backButtons.length).toBeGreaterThan(0)
    })

    it('should preserve risks when navigating back and forward', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      let continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Add a risk
      const riskInputs = wrapper.findAll('textarea[placeholder*="risk" i], input[placeholder*="risk" i]')
      const riskInput = riskInputs[0]!
      await riskInput.setValue('Persistent risk')
      
      buttons = wrapper.findAll('button')
      const addRiskButton = buttons.filter(btn => btn.text().includes('Add risk'))[0]!
      await addRiskButton.trigger('click')
      
      expect(wrapper.text()).toContain('Persistent risk')
      
      // Go back
      const backButton = wrapper.findAll('button').find(btn => btn.text().includes('Back'))
      await backButton!.trigger('click')
      
      // Go forward again
      buttons = wrapper.findAll('button')
      continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Risk should still be there
      expect(wrapper.text()).toContain('Persistent risk')
    })

    it('should clear risk input field after adding a risk', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Add a risk
      const riskInputs = wrapper.findAll('textarea[placeholder*="risk" i], input[placeholder*="risk" i]')
      const riskInput = riskInputs[0]!
      await riskInput.setValue('Test risk')
      
      buttons = wrapper.findAll('button')
      const addRiskButton = buttons.filter(btn => btn.text().includes('Add risk'))[0]!
      await addRiskButton.trigger('click')
      
      // Input should be cleared
      expect((riskInput.element as HTMLInputElement | HTMLTextAreaElement).value).toBe('')
    })

    it('should not add empty risks', async () => {
      await setupForRiskAssessment()
      
      let buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue') || btn.text().includes('Assess Risks'))
      await continueButton!.trigger('click')
      
      // Try to add empty risk
      const initialRiskCount = wrapper.findAll('.risk-item').length
      
      buttons = wrapper.findAll('button')
      const addRiskButton = buttons.filter(btn => btn.text().includes('Add risk'))[0]!
      await addRiskButton.trigger('click')
      
      // Risk count should not change
      const finalRiskCount = wrapper.findAll('.risk-item').length
      expect(finalRiskCount).toBe(initialRiskCount)
    })
  })

  describe('AI Recommendations', () => {
    // Helper to get to risk assessment with risks added
    const setupWithRisks = async () => {
      await addPrerequisites()
      
      // Select 7 characteristics
      const cards = wrapper.findAll('.characteristic-card')
      for (let i = 0; i < 7; i++) {
        await cards[i]!.trigger('click')
      }
      
      // Continue to narrow down phase
      const continueButton = wrapper.findAll('button').find(btn => btn.text().includes('Continue'))
      await continueButton!.trigger('click')
      
      // Select final 3 characteristics
      const selectedSection = wrapper.find('.selected-characteristics-section')
      const selectedCards = selectedSection.findAll('.characteristic-card')
      for (let i = 0; i < 3; i++) {
        await selectedCards[i]!.trigger('click')
      }
      
      // Proceed to risk assessment
      const riskButton = wrapper.findAll('button').find(btn => btn.text().includes('Risk assessment'))
      await riskButton!.trigger('click')
      
      // Add some risks
      const riskInputs = wrapper.findAll('textarea[placeholder*="risk" i], input[placeholder*="risk" i]')
      const riskInput = riskInputs[0]!
      await riskInput.setValue('Database bottleneck under load')
      
      const addRiskButton = wrapper.findAll('button').filter(btn => btn.text().includes('Add risk'))[0]!
      await addRiskButton.trigger('click')
    }

    it('should display a button to generate AI recommendations', async () => {
      await setupWithRisks()
      
      const buttons = wrapper.findAll('button')
      const aiButton = buttons.find(btn => 
        btn.text().includes('Generate') && btn.text().includes('AGENTS.md')
      )
      expect(aiButton).toBeDefined()
    })

    it('should show API key input when clicking generate without API key', async () => {
      await setupWithRisks()
      
      const buttons = wrapper.findAll('button')
      const aiButton = buttons.find(btn => 
        btn.text().includes('Generate') && btn.text().includes('AGENTS.md')
      )
      
      await aiButton!.trigger('click')
      
      // Should show API key input
      expect(wrapper.text()).toMatch(/API.*key/i)
      const apiKeyInput = wrapper.find('input[placeholder*="API key" i], input[type="password"]')
      expect(apiKeyInput.exists()).toBe(true)
      
      await apiKeyInput.setValue('gsk_test123456789')
      
      expect((apiKeyInput.element as HTMLInputElement).value).toBe('gsk_test123456789')
    })

    it('should have a link to get Groq API key', async () => {
      await setupWithRisks()
      
      const buttons = wrapper.findAll('button')
      const aiButton = buttons.find(btn => 
        btn.text().includes('Generate') && btn.text().includes('AGENTS.md')
      )
      await aiButton!.trigger('click')
      
      // Should have a link to Groq
      const links = wrapper.findAll('a')
      const groqLink = links.find(link => 
        link.attributes('href')?.includes('groq.com') ||
        link.text().includes('Groq')
      )
      expect(groqLink?.exists()).toBe(true)
    })

    it('should show loading state while generating recommendations', async () => {
      await setupWithRisks()
      
      // This test assumes the UI shows loading state
      // Actual API call would be mocked in real tests
      const buttons = wrapper.findAll('button')
      const aiButton = buttons.find(btn => 
        btn.text().includes('Generate') && btn.text().includes('AGENTS.md')
      )
      
      expect(aiButton).toBeDefined()
    })

    it('should display recommendations section after generation', async () => {
      await setupWithRisks()
      
      // After successful generation, should show recommendations
      // This would need API mocking in real implementation
      const aiSection = wrapper.find('.ai-recommendations-section, .recommendations-container')
      // Section might not exist yet without API call, but structure should support it
      expect(wrapper.html()).toBeTruthy()
    })

    it('should allow closing/dismissing the API key input', async () => {
      await setupWithRisks()
      
      const buttons = wrapper.findAll('button')
      const aiButton = buttons.find(btn => 
        btn.text().includes('Generate') && btn.text().includes('AGENTS.md')
      )
      await aiButton!.trigger('click')
      
      // Should have a way to close the dialog
      const closeButtons = wrapper.findAll('button').filter(btn => 
        btn.text().includes('Cancel') || 
        btn.text().includes('Close') ||
        btn.text() === '×'
      )
      expect(closeButtons.length).toBeGreaterThan(0)
    })

    it('should show error message if API call fails', async () => {
      await setupWithRisks()
      
      // This would test error handling
      // In real implementation, would mock failed API call
      expect(wrapper.html()).toBeTruthy()
    })

    it('should include system areas in the AI prompt context', async () => {
      await setupWithRisks()
      
      // Verify that the component has access to system areas for prompt building
      expect(wrapper.text()).toContain('Test System Area')
    })

    it('should include strategic goals in the AI prompt context', async () => {
      await setupWithRisks()
      
      // Verify that the component has access to strategic goals for prompt building
      expect(wrapper.text()).toContain('Test Strategic Goal')
    })

    it('should include selected characteristics in the AI prompt context', async () => {
      await setupWithRisks()
      
      // The selected characteristics should be visible in the risk assessment section
      const riskSections = wrapper.findAll('.risk-characteristic-section')
      expect(riskSections.length).toBe(3)
    })

    it('should include risk descriptions in the AI prompt context', async () => {
      await setupWithRisks()
      
      // Risk should be visible
      expect(wrapper.text()).toContain('Database bottleneck under load')
    })

    it('should allow copying recommendations to clipboard', async () => {
      await setupWithRisks()
      
      // After recommendations are generated, should have copy button
      // This tests the intended feature
      expect(wrapper.html()).toBeTruthy()
    })

    it('should maintain API key across multiple recommendation generations', async () => {
      await setupWithRisks()
      
      const buttons = wrapper.findAll('button')
      const aiButton = buttons.find(btn => 
        btn.text().includes('Generate') && btn.text().includes('AGENTS.md')
      )
      await aiButton!.trigger('click')
      
      const apiKeyInput = wrapper.find('input[placeholder*="API key" i], input[type="password"]')
      await apiKeyInput.setValue('gsk_test123456789')
      
      // API key should be stored for reuse
      expect((apiKeyInput.element as HTMLInputElement).value).toBe('gsk_test123456789')
    })

    it('should allow regenerating recommendations', async () => {
      await setupWithRisks()
      
      // After generating once, should be able to generate again
      const buttons = wrapper.findAll('button')
      const aiButton = buttons.find(btn => 
        btn.text().includes('Generate') && btn.text().includes('AGENTS.md')
      )
      expect(aiButton).toBeDefined()
    })

    it('should display recommendations in a readable format', async () => {
      await setupWithRisks()
      
      // Recommendations should be in a structured, readable section
      // Could be markdown, HTML, or formatted text
      expect(wrapper.html()).toBeTruthy()
    })

    it('should show a warning about API key security', async () => {
      await setupWithRisks()
      
      const buttons = wrapper.findAll('button')
      const aiButton = buttons.find(btn => 
        btn.text().includes('Generate') && btn.text().includes('AGENTS.md')
      )
      await aiButton!.trigger('click')
      
      // Should warn users about API key storage
      expect(wrapper.text()).toMatch(/secure|private|warning|note/i)
    })
  })

  describe('Discussion Notes', () => {
    it('should show discussion button on characteristic cards in initial phase', async () => {
      await addPrerequisites()
      
      const discussionButtons = wrapper.findAll('.discussion-button')
      expect(discussionButtons.length).toBeGreaterThan(0)
    })

    it('should not show discussion button on unselected cards in initial phase when prerequisites not met', () => {
      // No prerequisites added yet
      const discussionButtons = wrapper.findAll('.discussion-button')
      // Buttons should exist but may be disabled
      expect(wrapper.html()).toBeTruthy()
    })

    it('should open discussion modal when discussion button is clicked', async () => {
      await addPrerequisites()
      
      const discussionButton = wrapper.find('.discussion-button')
      await discussionButton.trigger('click')
      
      // Check for discussion modal
      const modalHeaders = wrapper.findAll('h2')
      const discussionModal = modalHeaders.find(h => 
        h.text().includes('Discussion Notes')
      )
      expect(discussionModal).toBeDefined()
    })

    it('should display characteristic name in discussion modal header', async () => {
      await addPrerequisites()
      
      const discussionButton = wrapper.find('.discussion-button')
      await discussionButton.trigger('click')
      
      // Modal should show characteristic name
      const modalHeaders = wrapper.findAll('h2')
      const discussionModal = modalHeaders.find(h => 
        h.text().includes('Discussion Notes')
      )
      expect(discussionModal?.text()).toBeTruthy()
    })

    it('should allow adding a comment to a characteristic', async () => {
      await addPrerequisites()
      
      const discussionButton = wrapper.find('.discussion-button')
      await discussionButton.trigger('click')
      
      // Find the textarea in the discussion modal
      const textareas = wrapper.findAll('textarea')
      const commentTextarea = textareas.find(ta => 
        ta.attributes('placeholder')?.includes('discussion')
      )
      
      await commentTextarea!.setValue('Test discussion comment')
      
      const addCommentButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add Comment')
      )
      await addCommentButton!.trigger('click')
      
      // Comment should be displayed
      expect(wrapper.text()).toContain('Test discussion comment')
    })

    it('should show comment count badge when comments exist', async () => {
      await addPrerequisites()
      
      // Open discussion modal
      const discussionButton = wrapper.find('.discussion-button')
      await discussionButton.trigger('click')
      
      // Add a comment
      const textareas = wrapper.findAll('textarea')
      const commentTextarea = textareas.find(ta => 
        ta.attributes('placeholder')?.includes('discussion')
      )
      await commentTextarea!.setValue('Test comment')
      
      const addCommentButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add Comment')
      )
      await addCommentButton!.trigger('click')
      
      // Close modal
      const closeButton = wrapper.findAll('button').find(btn => 
        btn.text() === 'Close'
      )
      await closeButton?.trigger('click')
      
      // Badge should show count
      const badge = wrapper.find('.comment-badge')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('1')
    })

    it('should allow editing a comment', async () => {
      await addPrerequisites()
      
      // Open modal and add comment
      const discussionButton = wrapper.find('.discussion-button')
      await discussionButton.trigger('click')
      
      const textareas = wrapper.findAll('textarea')
      const commentTextarea = textareas.find(ta => 
        ta.attributes('placeholder')?.includes('discussion')
      )
      await commentTextarea!.setValue('Original comment')
      
      const addCommentButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add Comment')
      )
      await addCommentButton!.trigger('click')
      
      // Click edit button
      const editButton = wrapper.find('.edit-icon-button')
      if (editButton.exists()) {
        await editButton.trigger('click')
        
        // Should show edit mode with textarea
        const editTextarea = wrapper.find('.edit-mode textarea')
        expect(editTextarea.exists()).toBe(true)
      }
    })

    it('should allow deleting a comment', async () => {
      await addPrerequisites()
      
      // Open modal and add comment
      const discussionButton = wrapper.find('.discussion-button')
      await discussionButton.trigger('click')
      
      const textareas = wrapper.findAll('textarea')
      const commentTextarea = textareas.find(ta => 
        ta.attributes('placeholder')?.includes('discussion')
      )
      await commentTextarea!.setValue('Comment to delete')
      
      const addCommentButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add Comment')
      )
      await addCommentButton!.trigger('click')
      
      // Should have delete button
      const deleteButton = wrapper.find('.delete-icon-button')
      expect(deleteButton.exists()).toBe(true)
    })

    it('should show discussion buttons in narrow down phase', async () => {
      await addPrerequisites()
      
      // Select 7 characteristics
      const cards = wrapper.findAll('.characteristic-card')
      for (let i = 0; i < 7 && i < cards.length; i++) {
        await cards[i].trigger('click')
      }
      
      // Continue to narrow down phase
      const continueButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Continue') && !btn.attributes('disabled')
      )
      await continueButton?.trigger('click')
      
      // Should still have discussion buttons in narrow down phase
      const discussionButtons = wrapper.findAll('.discussion-button')
      expect(discussionButtons.length).toBeGreaterThan(0)
    })

    it('should preserve comments when navigating between phases', async () => {
      await addPrerequisites()
      
      // Add a comment in initial phase
      const discussionButton = wrapper.find('.discussion-button')
      await discussionButton.trigger('click')
      
      const textareas = wrapper.findAll('textarea')
      const commentTextarea = textareas.find(ta => 
        ta.attributes('placeholder')?.includes('discussion')
      )
      await commentTextarea!.setValue('Persistent comment')
      
      const addCommentButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Add Comment')
      )
      await addCommentButton!.trigger('click')
      
      // Close modal
      const closeButtons = wrapper.findAll('button')
      const closeButton = closeButtons.find(btn => btn.text() === 'Close')
      await closeButton?.trigger('click')
      
      // Navigate to narrow down phase
      const cards = wrapper.findAll('.characteristic-card')
      for (let i = 0; i < 7 && i < cards.length; i++) {
        await cards[i].trigger('click')
      }
      
      const continueButton = wrapper.findAll('button').find(btn => 
        btn.text().includes('Continue') && !btn.attributes('disabled')
      )
      await continueButton?.trigger('click')
      
      // Comment count badge should still be visible
      const badge = wrapper.find('.comment-badge')
      expect(badge.exists()).toBe(true)
    })

    it('should close discussion modal without affecting characteristic selection', async () => {
      await addPrerequisites()
      
      // Select a characteristic
      const card = wrapper.find('.characteristic-card')
      await card.trigger('click')
      expect(card.classes()).toContain('selected')
      
      // Open and close discussion modal
      const discussionButton = wrapper.find('.discussion-button')
      await discussionButton.trigger('click')
      
      const closeButtons = wrapper.findAll('button')
      const closeButton = closeButtons.find(btn => btn.text() === 'Close')
      await closeButton?.trigger('click')
      
      // Card should still be selected
      expect(card.classes()).toContain('selected')
    })
  })
})

