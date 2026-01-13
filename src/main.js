import { createApp,onMounted } from 'vue'
import App from './App.vue'
import './main.css';
import { initFlowbite } from 'flowbite'
import router from './router';

const app = createApp(App)

app.use(router)

app.mixin({
  mounted() {
    initFlowbite()
  }
})
app.mount('#app')
