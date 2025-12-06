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

    it('should select a card when clicked', async () => {
      const cards = wrapper.findAll('.characteristic-card')
      const firstCard = cards[0]!
      
      await firstCard.trigger('click')
      
      expect(firstCard.classes()).toContain('selected')
    })

    it('should deselect a card when clicked again', async () => {
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
      const cards = wrapper.findAll('.characteristic-card')
      
      // Select first and second cards
      await cards[0]!.trigger('click')
      await cards[1]!.trigger('click')
      
      expect(cards[0]!.classes()).toContain('selected')
      expect(cards[1]!.classes()).toContain('selected')
      expect(cards[2]!.classes()).not.toContain('selected')
    })
  })
})

