import { config } from '@vue/test-utils'
import { QToolbar } from 'quasar'

// Stub Quasar components globally
    config.global.stubs = {
        Quasar: true,
        QBtn: {
            name: 'QBtn',
            props: ['label'],
            template: '<button>{{ label }}<slot /></button>'
        },
        QIcon: true,
        QToolbar: true
        //own components
        //ScrollerCards: true,
        //PageHeader: true,
        //SectionHeader: true
    }
