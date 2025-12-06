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

  describe('System Areas', () => {
    it('should display an input field for adding system areas', () => {
      const input = wrapper.find('input[type="text"]')
      expect(input.exists()).toBe(true)
    })

    it('should have a placeholder text for the area input', () => {
      const input = wrapper.find('input[type="text"]')
      expect(input.attributes('placeholder')).toContain('system area')
    })

    it('should display a button to add system areas', () => {
      const addButton = wrapper.find('button')
      expect(addButton.exists()).toBe(true)
      expect(addButton.text()).toContain('Add')
    })

    it('should add a system area when button is clicked', async () => {
      const input = wrapper.find('input[type="text"]')
      const addButton = wrapper.find('button')
      
      await input.setValue('Payment Processing')
      await addButton.trigger('click')
      
      expect(wrapper.text()).toContain('Payment Processing')
    })

    it('should display multiple added system areas', async () => {
      const input = wrapper.find('input[type="text"]')
      const addButton = wrapper.find('button')
      
      await input.setValue('Payment Processing')
      await addButton.trigger('click')
      
      await input.setValue('User Authentication')
      await addButton.trigger('click')
      
      expect(wrapper.text()).toContain('Payment Processing')
      expect(wrapper.text()).toContain('User Authentication')
    })

    it('should clear the input field after adding an area', async () => {
      const input = wrapper.find('input[type="text"]')
      const addButton = wrapper.find('button')
      
      await input.setValue('Payment Processing')
      await addButton.trigger('click')
      
      expect((input.element as HTMLInputElement).value).toBe('')
    })

    it('should display a remove button for each added area', async () => {
      const input = wrapper.find('input[type="text"]')
      const addButton = wrapper.find('button')
      
      await input.setValue('Payment Processing')
      await addButton.trigger('click')
      
      const areaTags = wrapper.findAll('.area-tag')
      expect(areaTags).toHaveLength(1)
      
      // Check for remove button within the area tag
      const removeButton = areaTags[0]!.find('button')
      expect(removeButton.exists()).toBe(true)
    })

    it('should remove an area when its remove button is clicked', async () => {
      const input = wrapper.find('input[type="text"]')
      const addButton = wrapper.find('button')
      
      await input.setValue('Payment Processing')
      await addButton.trigger('click')
      
      expect(wrapper.text()).toContain('Payment Processing')
      
      const areaTags = wrapper.findAll('.area-tag')
      const removeButton = areaTags[0]!.find('button')
      await removeButton.trigger('click')
      
      expect(wrapper.text()).not.toContain('Payment Processing')
    })

    it('should remove only the specific area when multiple areas exist', async () => {
      const input = wrapper.find('input[type="text"]')
      const addButton = wrapper.find('button')
      
      await input.setValue('Payment Processing')
      await addButton.trigger('click')
      
      await input.setValue('User Authentication')
      await addButton.trigger('click')
      
      await input.setValue('Reporting System')
      await addButton.trigger('click')
      
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

  describe('Architecture Characteristics', () => {
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

    it('should show a message when no system areas are defined', () => {
      expect(wrapper.text()).toMatch(/add.*system area.*before selecting/i)
    })

    it('should have disabled appearance on characteristics when no system areas exist', () => {
      const cards = wrapper.findAll('.characteristic-card')
      
      // Cards should have a disabled class or attribute
      cards.forEach((card: DOMWrapper<Element>) => {
        expect(card.classes()).toContain('disabled')
      })
    })

    it('should allow selecting characteristics after adding a system area', async () => {
      const input = wrapper.find('input[type="text"]')
      const addButton = wrapper.find('button')
      
      // Add a system area
      await input.setValue('Payment Processing')
      await addButton.trigger('click')
      
      // Now try to select a characteristic
      const cards = wrapper.findAll('.characteristic-card')
      const firstCard = cards[0]!
      await firstCard.trigger('click')
      
      // Card should now be selected
      expect(firstCard.classes()).toContain('selected')
    })

    it('should clear all selected characteristics when all system areas are removed', async () => {
      const input = wrapper.find('input[type="text"]')
      const addButton = wrapper.find('button')
      
      // Add a system area
      await input.setValue('Payment Processing')
      await addButton.trigger('click')
      
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
      
      // Remove the system area
      const removeButtons = wrapper.findAll('.remove-button')
      await removeButtons[0]!.trigger('click')
      
      // All characteristics should now be deselected
      expect(cards[0]!.classes()).not.toContain('selected')
      expect(cards[1]!.classes()).not.toContain('selected')
      expect(cards[2]!.classes()).not.toContain('selected')
      expect(wrapper.text()).toMatch(/Selected:.*0.*\/.*7/)
    })

    it('should remove disabled state from characteristics after adding a system area', async () => {
      const input = wrapper.find('input[type="text"]')
      const addButton = wrapper.find('button')
      
      // Add a system area
      await input.setValue('Payment Processing')
      await addButton.trigger('click')
      
      // Cards should no longer have disabled class
      const cards = wrapper.findAll('.characteristic-card')
      cards.forEach((card: DOMWrapper<Element>) => {
        expect(card.classes()).not.toContain('disabled')
      })
    })

    it('should select a card when clicked (after system area added)', async () => {
      // Add a system area first
      const input = wrapper.find('input[type="text"]')
      const addButton = wrapper.find('button')
      await input.setValue('Payment Processing')
      await addButton.trigger('click')
      
      const cards = wrapper.findAll('.characteristic-card')
      const firstCard = cards[0]!
      
      await firstCard.trigger('click')
      
      expect(firstCard.classes()).toContain('selected')
    })

    it('should deselect a card when clicked again', async () => {
      // Add a system area first
      const input = wrapper.find('input[type="text"]')
      const addButton = wrapper.find('button')
      await input.setValue('Payment Processing')
      await addButton.trigger('click')
      
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
      // Add a system area first
      const input = wrapper.find('input[type="text"]')
      const addButton = wrapper.find('button')
      await input.setValue('Payment Processing')
      await addButton.trigger('click')
      
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
    // Helper to add a system area before selecting characteristics
    const addSystemArea = async () => {
      const input = wrapper.find('input[type="text"]')
      const addButton = wrapper.find('button')
      await input.setValue('Test System Area')
      await addButton.trigger('click')
    }

    it('should display a counter showing number of selected characteristics', () => {
      expect(wrapper.text()).toMatch(/Selected:.*0.*\/.*7/)
    })

    it('should update the counter when characteristics are selected', async () => {
      await addSystemArea()
      
      const cards = wrapper.findAll('.characteristic-card')
      
      await cards[0]!.trigger('click')
      expect(wrapper.text()).toMatch(/Selected:.*1.*\/.*7/)
      
      await cards[1]!.trigger('click')
      expect(wrapper.text()).toMatch(/Selected:.*2.*\/.*7/)
    })

    it('should display instruction text about selecting 7 characteristics', () => {
      expect(wrapper.text()).toContain('Select 7 characteristics')
    })

    it('should display a "Continue" button', () => {
      const buttons = wrapper.findAll('button')
      const continueButton = buttons.find(btn => btn.text().includes('Continue'))
      expect(continueButton).toBeDefined()
    })

    it('should have "Continue" button disabled when less than 7 characteristics are selected', async () => {
      await addSystemArea()
      
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
      await addSystemArea()
      
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
      await addSystemArea()
      
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
    })

    it('should show a message when trying to select more than 7', async () => {
      await addSystemArea()
      
      const cards = wrapper.findAll('.characteristic-card')
      
      // Select 7 characteristics
      for (let i = 0; i < 7; i++) {
        await cards[i]!.trigger('click')
      }
      
      // Try to select an 8th
      await cards[7]!.trigger('click')
      
      expect(wrapper.text()).toMatch(/maximum.*7/i)
    })

    it('should allow deselecting a characteristic when at the limit', async () => {
      await addSystemArea()
      
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
})

