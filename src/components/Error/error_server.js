// plugins/errorHandler.js
import { createApp } from 'vue'
import Error_502 from './Error_502.vue'


export default {
  install(app) {
    // Глобальная обработка ошибок
    app.config.errorHandler = (err, vm, info) => {
      console.error('Глобальная ошибка:', err)
      console.error('Информация:', info)

      // Проверяем статус ошибки
      if (err.response && err.response.status === 502) {
        show502Page()
      }
    }

    // Перехватчик для axios (если используете)
    const axios = app.config.globalProperties.$axios
    if (axios) {
      axios.interceptors.response.use(
        response => response,
        error => {
          if (error.response && error.response.status === 502) {
            show502Page()
          }
          return Promise.reject(error)
        }
      )
    }
  }
}

// Функция для показа 502 страницы
function show502Page() {
  // Создаем временный div для отображения 502
  const existingError = document.getElementById('502-error')
  if (existingError) return

  const errorDiv = document.createElement('div')
  errorDiv.id = '502-error'
  errorDiv.style.position = 'fixed'
  errorDiv.style.top = '0'
  errorDiv.style.left = '0'
  errorDiv.style.width = '100%'
  errorDiv.style.height = '100%'
  errorDiv.style.backgroundColor = '#fff'
  errorDiv.style.zIndex = '9999'
  document.body.appendChild(errorDiv)

  // Монтируем компонент 502
  const errorApp = createApp(Error502)
  errorApp.mount('#502-error')
}
