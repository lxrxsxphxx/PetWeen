import { config } from '@vue/test-utils'

// Stub Quasar components globally
    config.global.stubs = {
        Quasar: true,
        QBtn: true,
        QIcon: true,
        ScrollerCards: true,
        PageHeader: true,
        SectionHeader: true
    }
