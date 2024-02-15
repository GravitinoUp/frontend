import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import ruNs1 from './locales/ru.json'

i18next.use(initReactI18next).init({
    debug: true,
    fallbackLng: 'ru',
    defaultNS: 'ns1',
    resources: {
        ru: {
            ns1: ruNs1,
        },
    },
})

export default i18next