import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

describe('App - Landing Page', () => {
  it('should display "Architecture characteristics" title', () => {
    const wrapper = mount(App)
    
    expect(wrapper.text()).toContain('Architecture characteristics')
  })
  
  it('should render the landing page', () => {
    const wrapper = mount(App)
    
    expect(wrapper.exists()).toBe(true)
  })

  it('should display the descriptive copy about architecture characteristics', () => {
    const wrapper = mount(App)
    const text = wrapper.text()
    
    expect(text).toContain(
      'Architecture characteristics describe the capabilities of a software system that are not directly related to domain functionality.'
    )
    expect(text).toContain(
      'They are often suffixed with -ility E.g. scalability, extensibility, adaptability.'
    )
    expect(text).toContain(
      'The appropriateness of each characteristic is context specific and involves trade-offs analysis to understand which ones should be accommodated.'
    )
  })

  it('should display a "Start new workshop" button', () => {
    const wrapper = mount(App)
    
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Start new workshop')
  })
})

