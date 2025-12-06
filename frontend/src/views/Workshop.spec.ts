import { describe, it, expect } from 'vitest'
import { mount, type DOMWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Workshop from './Workshop.vue'

describe('Workshop Page', () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/workshop', component: Workshop }
    ]
  })

  it('should display all 22 architecture characteristic cards', () => {
    const wrapper = mount(Workshop, {
      global: {
        plugins: [router]
      }
    })
    
    const cards = wrapper.findAll('.characteristic-card')
    expect(cards).toHaveLength(22)
  })

  it('should display characteristic cards with name and description', () => {
    const wrapper = mount(Workshop, {
      global: {
        plugins: [router]
      }
    })
    
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
    const wrapper = mount(Workshop, {
      global: {
        plugins: [router]
      }
    })
    
    // Test one representative example to verify structure
    expect(wrapper.text()).toContain('Scalability')
    expect(wrapper.text()).toContain(
      'A function of system capacity and growth over time'
    )
  })

  it('should not have any cards selected initially', () => {
    const wrapper = mount(Workshop, {
      global: {
        plugins: [router]
      }
    })
    
    const selectedCards = wrapper.findAll('.characteristic-card.selected')
    expect(selectedCards).toHaveLength(0)
  })

  it('should select a card when clicked', async () => {
    const wrapper = mount(Workshop, {
      global: {
        plugins: [router]
      }
    })
    
    const cards = wrapper.findAll('.characteristic-card')
    const firstCard = cards[0]!
    
    await firstCard.trigger('click')
    
    expect(firstCard.classes()).toContain('selected')
  })

  it('should deselect a card when clicked again', async () => {
    const wrapper = mount(Workshop, {
      global: {
        plugins: [router]
      }
    })
    
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
    const wrapper = mount(Workshop, {
      global: {
        plugins: [router]
      }
    })
    
    const cards = wrapper.findAll('.characteristic-card')
    
    // Select first and second cards
    await cards[0]!.trigger('click')
    await cards[1]!.trigger('click')
    
    expect(cards[0]!.classes()).toContain('selected')
    expect(cards[1]!.classes()).toContain('selected')
    expect(cards[2]!.classes()).not.toContain('selected')
  })
})

