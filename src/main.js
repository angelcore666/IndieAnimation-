import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './components/router.js'


import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})


import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import en from './locales/en.json'

const i18n = createI18n({
  legacy: false,      //
  locale: 'en',       //base language
  fallbackLocale: 'fr', //language of last resort
  messages: { fr, en }
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(vuetify)
app.mount('#app')


