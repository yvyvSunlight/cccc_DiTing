import App from './App'
import * as Pinia from 'pinia'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const pinia = Pinia.createPinia()
const app = new Vue({
  ...App,
  pinia
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  const pinia = Pinia.createPinia()
  app.use(pinia)
  return {
    app,
    pinia
  }
}
// #endif