import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '../src/pages/IndexPage.vue'

describe('IndexPage', () => {
    it('renders main sections and all cards', () => {
        const wrapper = mount(IndexPage)

        // PageHeader vorhanden
        const header = wrapper.findComponent({ name: 'PageHeader' })
        expect(header.exists()).toBe(true)
        expect(header.props('title')).toBe('PetWeen')

        // SectionHeader vorhanden
        const sectionHeaders = wrapper.findAllComponents({ name: 'SectionHeader' })
        expect(sectionHeaders.length).toBe(2)
        expect(sectionHeaders[0].props('title')).toBe('Pets')
        expect(sectionHeaders[1].props('title')).toBe('Albums')

        // ScrollerCards vorhanden
        const scrollerCards = wrapper.findAllComponents({ name: 'ScrollerCards' })
        expect(scrollerCards.length).toBe(2)

        // InfoCards vorhanden (10 Pets + 10 Albums)
        const infoCards = wrapper.findAllComponents({ name: 'InfoCard' })
        expect(infoCards.length).toBe(20)

        // QBtn vorhanden
        const btn = wrapper.findComponent({ name: 'QBtn' })
        expect(btn.exists()).toBe(true)
        expect(btn.text()).toBe('View all')
        //expect(btn.text()).toBe('add picture')
    })
})


