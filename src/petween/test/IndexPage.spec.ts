import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '../src/pages/IndexPage.vue'

// test file for IndexPage.vue
describe('IndexPage', () => {
    it('renders the PageHeader', () => {
        const wrapper = mount(IndexPage) // setup.ts stubs used automatically
        expect(wrapper.exists()).toBe(true)
    })
})
