import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CharacteristicCard from './CharacteristicCard.vue'

describe('CharacteristicCard', () => {
  const mockProps = {
    name: 'Scalability',
    description: 'A function of system capacity and growth',
    isSelected: false
  }

  it('should render the characteristic name', () => {
    const wrapper = mount(CharacteristicCard, {
      props: mockProps
    })
    
    expect(wrapper.find('h3').text()).toBe('Scalability')
  })

  it('should render the characteristic description', () => {
    const wrapper = mount(CharacteristicCard, {
      props: mockProps
    })
    
    expect(wrapper.find('p').text()).toBe('A function of system capacity and growth')
  })

  it('should not have selected class when isSelected is false', () => {
    const wrapper = mount(CharacteristicCard, {
      props: mockProps
    })
    
    expect(wrapper.classes()).not.toContain('selected')
  })

  it('should have selected class when isSelected is true', () => {
    const wrapper = mount(CharacteristicCard, {
      props: { ...mockProps, isSelected: true }
    })
    
    expect(wrapper.classes()).toContain('selected')
  })

  it('should emit click event when clicked', async () => {
    const wrapper = mount(CharacteristicCard, {
      props: mockProps
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})

