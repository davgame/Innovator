import { createApp,onMounted } from 'vue'
import App from './App.vue'
import router from './router'
import './main.css';
import { initFlowbite } from 'flowbite'

const app = createApp(App)

app.use(router)

app.mixin({
  mounted() {
    initFlowbite()
  }
})
app.mount('#app')
