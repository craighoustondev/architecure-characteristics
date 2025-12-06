import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Home from './views/Home.vue'

describe('App - Landing Page', () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Home },
      { path: '/workshop', component: { template: '<div>Workshop</div>' } }
    ]
  })

  it('should display "Architecture characteristics" title', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })
    
    expect(wrapper.text()).toContain('Architecture characteristics')
  })
  
  it('should render the landing page', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })
    
    expect(wrapper.exists()).toBe(true)
  })

  it('should display the descriptive copy about architecture characteristics', () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })
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
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })
    
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Start new workshop')
  })

  it('should navigate to workshop page when button is clicked', async () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [router]
      }
    })
    
    await router.isReady()
    await router.push('/')
    
    const button = wrapper.find('button')
    await button.trigger('click')
    
    // Wait for all promises to resolve
    await flushPromises()
    
    expect(router.currentRoute.value.path).toBe('/workshop')
  })
})

