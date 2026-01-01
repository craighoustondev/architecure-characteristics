import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CharacteristicCard from './CharacteristicCard.vue'

describe('CharacteristicCard', () => {
  const mockProps = {
    name: 'Scalability',
    description: 'A function of system capacity and growth',
    isSelected: false,
    emoji: '📈'
  }

  it('should render the characteristic name', () => {
    const wrapper = mount(CharacteristicCard, {
      props: mockProps
    })
    
    expect(wrapper.find('h3').text()).toContain('Scalability')
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

  describe('Discussion button', () => {
    it('should not render discussion button when showDiscussionButton is false', () => {
      const wrapper = mount(CharacteristicCard, {
        props: {
          ...mockProps,
          showDiscussionButton: false
        }
      })
      
      expect(wrapper.find('.discussion-button').exists()).toBe(false)
    })

    it('should render discussion button when showDiscussionButton is true', () => {
      const wrapper = mount(CharacteristicCard, {
        props: {
          ...mockProps,
          showDiscussionButton: true
        }
      })
      
      expect(wrapper.find('.discussion-button').exists()).toBe(true)
    })

    it('should not show comment badge when commentCount is 0', () => {
      const wrapper = mount(CharacteristicCard, {
        props: {
          ...mockProps,
          showDiscussionButton: true,
          commentCount: 0
        }
      })
      
      expect(wrapper.find('.comment-badge').exists()).toBe(false)
    })

    it('should show comment badge with count when commentCount > 0', () => {
      const wrapper = mount(CharacteristicCard, {
        props: {
          ...mockProps,
          showDiscussionButton: true,
          commentCount: 3
        }
      })
      
      const badge = wrapper.find('.comment-badge')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('3')
    })

    it('should emit openDiscussion event when discussion button is clicked', async () => {
      const wrapper = mount(CharacteristicCard, {
        props: {
          ...mockProps,
          showDiscussionButton: true
        }
      })
      
      await wrapper.find('.discussion-button').trigger('click')
      
      expect(wrapper.emitted()).toHaveProperty('openDiscussion')
      expect(wrapper.emitted('openDiscussion')).toHaveLength(1)
    })

    it('should not emit click event when discussion button is clicked', async () => {
      const wrapper = mount(CharacteristicCard, {
        props: {
          ...mockProps,
          showDiscussionButton: true
        }
      })
      
      await wrapper.find('.discussion-button').trigger('click')
      
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })
})

