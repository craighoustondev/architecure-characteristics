import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Workshop from './Workshop.vue'

describe('Workshop Page', () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/workshop', component: Workshop }
    ]
  })

  it('should display 3 architecture characteristic cards', () => {
    const wrapper = mount(Workshop, {
      global: {
        plugins: [router]
      }
    })
    
    const cards = wrapper.findAll('.characteristic-card')
    expect(cards).toHaveLength(3)
  })

  it('should display Scalability characteristic with its description', () => {
    const wrapper = mount(Workshop, {
      global: {
        plugins: [router]
      }
    })
    
    expect(wrapper.text()).toContain('Scalability')
    expect(wrapper.text()).toContain(
      'A function of system capacity and growth over time; as the number of users or requests increase in the system, responsiveness, performance and error rates remain consistent'
    )
  })

  it('should display Elasticity characteristic with its description', () => {
    const wrapper = mount(Workshop, {
      global: {
        plugins: [router]
      }
    })
    
    expect(wrapper.text()).toContain('Elasticity')
    expect(wrapper.text()).toContain(
      'The system is able to expend and respond quickly to unexpected or anticipated extreme loads (e.g. going from 20 to 250,000 users instantly)'
    )
  })

  it('should display Adaptability characteristic with its description', () => {
    const wrapper = mount(Workshop, {
      global: {
        plugins: [router]
      }
    })
    
    expect(wrapper.text()).toContain('Adaptability')
    expect(wrapper.text()).toContain(
      'The ease in which a system can adapt to changes in environment and functionality'
    )
  })
})

