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
})

